export const prerender = false;
import type { APIContext } from 'astro';

function getToken(context: APIContext): string | null {
  const session = context.cookies.get('sb-session')?.json();
  return session?.access_token ?? null;
}

const ORCHESTRATOR_URL = import.meta.env.ORCHESTRATOR_URL || 'https://atrahdis.id';

export async function GET(context: APIContext) {
  const token = getToken(context);
  if (!token) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  try {
    const res = await fetch(`${ORCHESTRATOR_URL}/api/v1/deals`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await res.json().catch(() => ({ error: 'Invalid JSON from upstream' }));
    return new Response(JSON.stringify(data), { status: res.status });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Upstream error', detail: String(err) }), { status: 502 });
  }
}

export async function POST(context: APIContext) {
  const token = getToken(context);
  if (!token) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  try {
    const body = await context.request.json();
    const res = await fetch(`${ORCHESTRATOR_URL}/api/v1/deals`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await res.json().catch(() => ({ error: 'Invalid JSON from upstream' }));
    return new Response(JSON.stringify(data), { status: res.status });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Upstream error', detail: String(err) }), { status: 502 });
  }
}
