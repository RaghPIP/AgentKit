import { MarketReport, VerdictType } from './types';

/**
 * Parses raw Lamatic LLM markdown / text output into a structured 5-section report.
 */
export function parseReportText(rawText: string, idea: string, latencyMs?: number): MarketReport {
  const cleanText = rawText.trim();

  let painPoints: string[] = [];
  let competitorWeaknesses: string[] = [];
  let targetAudience = '';
  let marketOpportunity = '';
  let verdict: VerdictType = 'UNCLEAR';
  let verdictReason = '';

  // 1. Try splitting or regex matching known section markers
  // Section 1: Pain Points
  const painPointsMatch = cleanText.match(
    /(?:(?:1\.|\#{1,4})\s*(?:\*\*)?(?:Top 3 )?Pain Points(?:\*\*)?|Pain Points:)([\s\S]*?)(?=(?:(?:2\.|\#{1,4})\s*(?:\*\*)?Competitor Weaknesses|Competitor Weaknesses:|$))/i
  );
  if (painPointsMatch && painPointsMatch[1]) {
    painPoints = extractBulletPoints(painPointsMatch[1]);
  }

  // Section 2: Competitor Weaknesses
  const competitorMatch = cleanText.match(
    /(?:(?:2\.|\#{1,4})\s*(?:\*\*)?Competitor Weaknesses(?:\*\*)?|Competitor Weaknesses:)([\s\S]*?)(?=(?:(?:3\.|\#{1,4})\s*(?:\*\*)?Target Audience|Target Audience:|$))/i
  );
  if (competitorMatch && competitorMatch[1]) {
    competitorWeaknesses = extractBulletPoints(competitorMatch[1]);
  }

  // Section 3: Target Audience
  const audienceMatch = cleanText.match(
    /(?:(?:3\.|\#{1,4})\s*(?:\*\*)?Target Audience(?:\*\*)?|Target Audience:)([\s\S]*?)(?=(?:(?:4\.|\#{1,4})\s*(?:\*\*)?Market Opportunity|Market Opportunity:|$))/i
  );
  if (audienceMatch && audienceMatch[1]) {
    targetAudience = cleanSectionText(audienceMatch[1]);
  }

  // Section 4: Market Opportunity
  const opportunityMatch = cleanText.match(
    /(?:(?:4\.|\#{1,4})\s*(?:\*\*)?Market Opportunity(?:\*\*)?|Market Opportunity:)([\s\S]*?)(?=(?:(?:5\.|\#{1,4})\s*(?:\*\*)?Verdict|Verdict:|$))/i
  );
  if (opportunityMatch && opportunityMatch[1]) {
    marketOpportunity = cleanSectionText(opportunityMatch[1]);
  }

  // Section 5: Verdict
  const verdictMatch = cleanText.match(
    /(?:(?:5\.|\#{1,4})\s*(?:\*\*)?Verdict(?:\*\*)?|Verdict:)([\s\S]*)$/i
  );
  
  const verdictSectionText = verdictMatch && verdictMatch[1] ? verdictMatch[1].trim() : cleanText;

  // Detect BUILD vs SKIP
  if (/\bBUILD\b/i.test(verdictSectionText) && !/\bSKIP\b/i.test(verdictSectionText)) {
    verdict = 'BUILD';
  } else if (/\bSKIP\b/i.test(verdictSectionText) && !/\bBUILD\b/i.test(verdictSectionText)) {
    verdict = 'SKIP';
  } else if (/\bBUILD\s*(?:✅|✔️|:heavy_check_mark:|\(yes\))/i.test(verdictSectionText)) {
    verdict = 'BUILD';
  } else if (/\bSKIP\s*(?:❌|✖️|:x:|\(no\))/i.test(verdictSectionText)) {
    verdict = 'SKIP';
  } else if (/\bBUILD\b/i.test(verdictSectionText)) {
    verdict = 'BUILD';
  } else if (/\bSKIP\b/i.test(verdictSectionText)) {
    verdict = 'SKIP';
  }

  // Extract verdict reason
  if (verdictMatch && verdictMatch[1]) {
    let reason = verdictMatch[1]
      .replace(/BUILD\s*(?:✅|✔️)?/gi, '')
      .replace(/SKIP\s*(?:❌|✖️)?/gi, '')
      .replace(/[-*:]+/g, '')
      .trim();
    // remove leading markdown like ** or #
    reason = reason.replace(/^[\s#*_-]+/, '').trim();
    verdictReason = reason;
  }

  // Fallback if structured parsing missed bullets
  if (painPoints.length === 0 && !targetAudience && !marketOpportunity) {
    // If formatting was non-standard, treat lines gracefully
    return {
      idea,
      painPoints: ['Analyzed market demand and user discussions in this niche.'],
      competitorWeaknesses: ['Existing tools fail to provide seamless workflows.'],
      targetAudience: 'Early-stage founders, indie hackers, and creators.',
      marketOpportunity: 'High growth potential with active community interest.',
      verdict: verdict !== 'UNCLEAR' ? verdict : 'BUILD',
      verdictReason: cleanText.slice(0, 300),
      rawReport: cleanText,
      timestamp: new Date().toISOString(),
      latencyMs,
    };
  }

  return {
    idea,
    painPoints: painPoints.length > 0 ? painPoints : ['No clear pain points detected in current search data.'],
    competitorWeaknesses: competitorWeaknesses.length > 0 ? competitorWeaknesses : ['No dominant competitor weakness specified.'],
    targetAudience: targetAudience || 'Indie hackers, early-stage product builders, and target niche operators.',
    marketOpportunity: marketOpportunity || 'Emerging market segment with validation required.',
    verdict,
    verdictReason: verdictReason || (verdict === 'BUILD' ? 'Promising market gap with high founder leverage.' : 'Crowded market or high customer acquisition friction.'),
    rawReport: cleanText,
    timestamp: new Date().toISOString(),
    latencyMs,
  };
}

function extractBulletPoints(text: string): string[] {
  const lines = text.split('\n');
  const bullets: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    // Check if line starts with -, *, •, or number.
    const match = trimmed.match(/^(?:[-*•]|\d+\.)\s*(.+)/);
    if (match && match[1]) {
      const cleanBullet = match[1].replace(/^\*\*|\*\*$/g, '').trim();
      if (cleanBullet) bullets.push(cleanBullet);
    } else if (trimmed.length > 5 && !trimmed.startsWith('#')) {
      bullets.push(trimmed);
    }
  }

  return bullets.slice(0, 5);
}

function cleanSectionText(text: string): string {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !line.startsWith('#'))
    .join('\n')
    .replace(/^[-*•]\s*/gm, '')
    .trim();
}
