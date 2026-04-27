import type { Deal, DealsListResponse } from '../types/deal';

const ORCHESTRATOR_URL = import.meta.env.ORCHESTRATOR_URL || 'https://atrahdis.id';

export async function fetchDeals(token: string): Promise<{ deals: Deal[]; error?: string }> {
  try {
    const res = await fetch(`${ORCHESTRATOR_URL}/api/v1/deals`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!res.ok) {
      const text = await res.text();
      return { deals: [], error: `HTTP ${res.status}: ${text}` };
    }
    const data = (await res.json()) as DealsListResponse;
    return { deals: data.deals || [] };
  } catch (err) {
    return { deals: [], error: String(err) };
  }
}

export async function fetchDealDetail(token: string, id: string): Promise<{ deal?: Deal; error?: string }> {
  try {
    const res = await fetch(`${ORCHESTRATOR_URL}/api/v1/deals/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!res.ok) {
      const text = await res.text();
      return { error: `HTTP ${res.status}: ${text}` };
    }
    const data = (await res.json()) as Deal;
    return { deal: data };
  } catch (err) {
    return { error: String(err) };
  }
}
