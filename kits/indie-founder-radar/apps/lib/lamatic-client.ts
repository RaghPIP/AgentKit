// lib/lamatic-client.ts — Lamatic GraphQL Execution Client for Indie Founder Radar

export interface ExecuteWorkflowResult {
  status: string;
  result: Record<string, unknown> | string;
  requestId?: string;
  latencyMs: number;
}

export interface LamaticConfig {
  apiUrl: string;
  projectId: string;
  flowId: string;
  apiKey: string;
}

/**
 * Resolves credentials and endpoints from environment variables or Studio URLs.
 */
export function getLamaticConfig(): LamaticConfig {
  let apiUrl = (process.env.LAMATIC_API_URL || '').trim();
  let projectId = (process.env.LAMATIC_PROJECT_ID || 'FactcheckAi595').trim();
  let flowId = (
    process.env.INDIE_FOUNDER_RADAR_FLOW_ID ||
    process.env.LAMATIC_FLOW_ID ||
    'e4705e2f-5405-4e00-aaf9-7e6263459012'
  ).trim();
  const apiKey = (process.env.LAMATIC_API_KEY || '').trim();
  const studioUrl = (process.env.LAMATIC_STUDIO_URL || '').trim();

  // If apiUrl was set to a studio URL, extract IDs
  const targetUrl = apiUrl.includes('studio.lamatic.ai') ? apiUrl : studioUrl;
  if (targetUrl.includes('studio.lamatic.ai')) {
    const match = targetUrl.match(/project\/([^/]+)\/flow\/([^/]+)/);
    if (match) {
      if (!projectId || projectId === 'FactcheckAi595') projectId = match[1];
      if (!flowId || flowId === 'e4705e2f-5405-4e00-aaf9-7e6263459012') flowId = match[2];
    }
  }

  // Ensure valid endpoint structure with HTTPS
  if (apiUrl && !apiUrl.startsWith('http://') && !apiUrl.startsWith('https://')) {
    apiUrl = `https://${apiUrl}`;
  }

  return {
    apiUrl,
    projectId,
    flowId,
    apiKey,
  };
}

/**
 * Executes the Indie Founder Radar flow with a given startup idea.
 */
export async function executeIndieFounderRadarFlow(
  idea: string,
  options?: { signal?: AbortSignal }
): Promise<ExecuteWorkflowResult> {
  const config = getLamaticConfig();

  if (!config.apiKey) {
    throw new Error(
      'Missing LAMATIC_API_KEY in environment variables. Please check your .env.local file.'
    );
  }

  if (!config.apiUrl) {
    throw new Error(
      'Missing LAMATIC_API_URL in .env.local. In Lamatic Studio, open your flow and copy the deployed API Endpoint URL.'
    );
  }

  // Determine the endpoint URL
  let endpoint = config.apiUrl;
  if (!endpoint.endsWith('/graphql') && !endpoint.includes('/api/')) {
    // Check if base domain
    if (endpoint.endsWith('/')) {
      endpoint = `${endpoint}graphql`;
    } else {
      endpoint = `${endpoint}/graphql`;
    }
  }

  // Reject insecure HTTP connections to prevent cleartext transmission of sensitive credentials (CWE-319)
  if (!endpoint.startsWith('https://')) {
    throw new Error(
      `Insecure connection rejected: LAMATIC_API_URL must use the HTTPS protocol (https://) to protect API credentials. Provided: "${endpoint}"`
    );
  }

  const query = `
    query ExecuteWorkflow($workflowId: String!, $idea: String) {
      executeWorkflow(
        workflowId: $workflowId
        payload: {
          idea: $idea
        }
      ) {
        status
        result
      }
    }
  `;

  const startTime = performance.now();

  let response: Response;
  try {
    response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.apiKey}`,
        'x-project-id': config.projectId,
      },
      body: JSON.stringify({
        query,
        variables: {
          workflowId: config.flowId,
          idea,
        },
      }),
      signal: options?.signal,
    });
  } catch (fetchErr: unknown) {
    const msg = fetchErr instanceof Error ? fetchErr.message : String(fetchErr);
    throw new Error(`Could not connect to Lamatic API at "${endpoint}": ${msg}`);
  }

  const endTime = performance.now();
  const latencyMs = Math.round((endTime - startTime) * 10) / 10;

  if (!response.ok) {
    const errorBody = await response.text().catch(() => '');
    if (errorBody.includes('Error 1014') || errorBody.includes('CNAME Cross-User Banned')) {
      throw new Error(
        `Cloudflare Error 1014: The endpoint "${endpoint}" is not a direct API gateway. In Lamatic Studio, deploy your flow and copy your project's unique endpoint URL (e.g. from the API / Deploy tab) and paste it into apps/.env.local as LAMATIC_API_URL.`
      );
    }
    throw new Error(`Lamatic API returned HTTP ${response.status}: ${errorBody.slice(0, 300)}`);
  }

  const json = await response.json();

  if (json.errors && json.errors.length > 0) {
    const errorMsg = json.errors.map((e: { message?: string }) => e.message || JSON.stringify(e)).join(', ');
    throw new Error(`Lamatic GraphQL error: ${errorMsg}`);
  }

  const workflowOutput = json.data?.executeWorkflow;
  if (!workflowOutput) {
    throw new Error(`Lamatic API did not return executeWorkflow data: ${JSON.stringify(json)}`);
  }

  return {
    status: workflowOutput.status || 'success',
    result: workflowOutput.result,
    requestId: workflowOutput.requestId,
    latencyMs,
  };
}
