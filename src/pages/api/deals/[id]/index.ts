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

  const { id } = context.params;
  if (!id) {
    return new Response(JSON.stringify({ error: 'Missing deal id' }), { status: 400 });
  }

  try {
    const res = await fetch(`${ORCHESTRATOR_URL}/api/v1/deals/${id}`, {
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
