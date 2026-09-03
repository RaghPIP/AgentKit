import { NextRequest, NextResponse } from 'next/server';
import { executeIndieFounderRadarFlow } from '@/lib/lamatic-client';
import { parseReportText } from '@/lib/parse-report';

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { success: false, error: 'Invalid JSON payload.' },
      { status: 400 }
    );
  }

  const idea =
    typeof (body as { idea?: unknown })?.idea === 'string'
      ? (body as { idea: string }).idea.trim()
      : '';

  if (!idea) {
    return NextResponse.json(
      { success: false, error: 'Please enter a startup idea to analyze.' },
      { status: 400 }
    );
  }

  try {
    // Call Lamatic flow
    const execution = await executeIndieFounderRadarFlow(idea);

    // Extract raw text from workflow result
    let rawReportText = '';
    const result = execution.result;

    if (typeof result === 'string') {
      rawReportText = result;
    } else if (result && typeof result === 'object') {
      const resObj = result as Record<string, unknown>;
      if (typeof resObj.report === 'string') {
        rawReportText = resObj.report;
      } else if (typeof resObj.generatedResponse === 'string') {
        rawReportText = resObj.generatedResponse;
      } else if (typeof resObj.output === 'string') {
        rawReportText = resObj.output;
      } else {
        rawReportText = JSON.stringify(result, null, 2);
      }
    }

    if (!rawReportText) {
      rawReportText = 'No text output returned by the model.';
    }

    const report = parseReportText(rawReportText, idea, execution.latencyMs);

    return NextResponse.json({
      success: true,
      report,
      requestId: execution.requestId,
    });
  } catch (error: unknown) {
    console.error('Error executing Indie Founder Radar flow:', error);
    const message =
      error instanceof Error
        ? error.message
        : 'Unknown error occurred while analyzing startup idea.';

    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 500 }
    );
  }
}
