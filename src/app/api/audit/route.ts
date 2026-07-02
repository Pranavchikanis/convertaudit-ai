export const dynamic = 'force-dynamic';
export const runtime = 'edge';

import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

function validateUrl(urlString: string): boolean {
  try {
    const url = new URL(urlString);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      return false;
    }
    
    const hostname = url.hostname.toLowerCase();
    
    // SSRF Mitigation (SKILL.md)
    if (
      hostname === 'localhost' ||
      hostname.startsWith('127.') ||
      hostname.startsWith('10.') ||
      hostname.startsWith('172.16.') ||
      hostname.startsWith('192.168.') ||
      hostname.endsWith('.local')
    ) {
      return false;
    }
    
    return true;
  } catch (error) {
    return false;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { url } = body;

    if (!url || typeof url !== 'string' || !validateUrl(url)) {
      return NextResponse.json(
        { error: 'Invalid or missing URL.' },
        { status: 400 }
      );
    }

    let html: string = '';
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        },
        signal: AbortSignal.timeout(10000)
      });
      
      if (!response.ok) {
        return NextResponse.json(
          { error: `Failed to fetch target URL. Status: ${response.status}` },
          { status: 400 }
        );
      }
      
      html = await response.text();
    } catch (error) {
      return NextResponse.json(
        { error: 'Failed to extract content from the provided URL. Please verify the link is accessible.' },
        { status: 400 }
      );
    }

    if (!html) {
      return NextResponse.json(
        { error: 'Empty content returned from the target URL.' },
        { status: 400 }
      );
    }

    const $ = cheerio.load(html);
    
    // Strip irrelevant content (PRD.md specification)
    $('script, style, nav, footer, noscript, iframe').remove();
    
    // Extract required elements
    const extractedData: string[] = [];
    
    const title = $('title').text().trim();
    if (title) extractedData.push(`Title: ${title}`);
    
    $('h1').each((_, el) => {
      const text = $(el).text().trim();
      if (text) extractedData.push(`H1: ${text}`);
    });
    
    $('h2').each((_, el) => {
      const text = $(el).text().trim();
      if (text) extractedData.push(`H2: ${text}`);
    });
    
    $('p').each((_, el) => {
      const text = $(el).text().trim();
      if (text) extractedData.push(`Paragraph: ${text}`);
    });

    let rawText = extractedData.join('\n');
    
    // Normalize and clean all extracted text
    rawText = rawText.replace(/\s+/g, ' ').trim();
    
    if (!rawText || rawText.length < 50) {
      return NextResponse.json(
        { error: 'Insufficient content extracted for a meaningful AI audit. This page might be a Single Page Application (SPA) or require JavaScript rendering.' },
        { status: 400 }
      );
    }

    // Limit to ~5000 chars as per PRD to ensure context fits and processes quickly
    rawText = rawText.substring(0, 5000);

    const prompt = `
You are an elite Principal CRO (Conversion Rate Optimization) Expert. 
Analyze the following website copy and structure.
Your goal is to evaluate Clarity, Friction, Value Proposition, and Trust signals.

Website Content:
${rawText}

Return ONLY a strictly valid JSON object matching exactly this schema, with no markdown code blocks, backticks, or extra text:
{
  "scores": {
    "ux": number (0-100),
    "copy": number (0-100),
    "conversionProbability": number (0-100)
  },
  "recommendations": [
    {
      "category": string ("Critical Fix", "Quick Win", or "Strategic Improvement"),
      "issue": string (The problem),
      "impact": string (How this hurts conversion),
      "solution": string (Actionable fix)
    }
  ]
}
    `.trim();

    const model = genAI.getGenerativeModel({ model: 'gemini-3.5-flash' });
    let aiResponseText = '';
    
    try {
      const result = await model.generateContent(prompt);
      aiResponseText = result.response.text();
    } catch (aiError) {
      console.error('Gemini API Error:', aiError);
      return NextResponse.json(
        { error: 'AI analysis is currently at capacity or encountered an error. Please try again.' },
        { status: 500 }
      );
    }

    // Clean AI JSON response (strip markdown blocks if present)
    let cleanedAiJson = aiResponseText.trim();
    if (cleanedAiJson.startsWith('\`\`\`json')) {
      cleanedAiJson = cleanedAiJson.substring(7);
    } else if (cleanedAiJson.startsWith('\`\`\`')) {
      cleanedAiJson = cleanedAiJson.substring(3);
    }
    
    if (cleanedAiJson.endsWith('\`\`\`')) {
      cleanedAiJson = cleanedAiJson.substring(0, cleanedAiJson.length - 3);
    }
    cleanedAiJson = cleanedAiJson.trim();

    let parsedResponse;
    try {
      parsedResponse = JSON.parse(cleanedAiJson);
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError, 'Raw response:', aiResponseText);
      return NextResponse.json(
        { error: 'The AI model returned an invalid format. Please try again.' },
        { status: 500 }
      );
    }

    // Validate response shape briefly against PRD.md schema expectations
    if (
      !parsedResponse ||
      !parsedResponse.scores ||
      typeof parsedResponse.scores.ux !== 'number' ||
      !Array.isArray(parsedResponse.recommendations)
    ) {
       return NextResponse.json(
        { error: 'The AI model returned a malformed report structure.' },
        { status: 500 }
      );
    }

    return NextResponse.json(parsedResponse, { status: 200 });

  } catch (globalError) {
    console.error('Global Error in API Audit Route:', globalError);
    return NextResponse.json(
      { error: 'An unexpected server error occurred.' },
      { status: 500 }
    );
  }
}
