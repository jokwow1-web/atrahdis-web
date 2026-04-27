// Supabase Edge Function: payment-webhook
// Trigger: HTTP POST /functions/v1/payment-webhook
// Body: Midtrans webhook payload
//
// Flow:
// 1. Verify webhook signature (if configured)
// 2. Parse transaction status from Midtrans
// 3. Update payment_schedules + deals table
// 4. Trigger deal step progression
// 5. Send notification (Slack/WA) on status change

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || 'https://pnnhwfeljzcokuwqvcjb.supabase.co';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const payload = await req.json();

    // TODO: Implement Midtrans webhook handling
    // 1. Verify signature using MIDTRANS_WEBHOOK_SIGNATURE_KEY (optional for now)
    // 2. Extract: order_id, transaction_status, payment_type, va_number, etc.
    // 3. Find payment_schedules by midtrans_order_id
    // 4. Update payment_schedules: status, raw_webhook, paid_at
    // 5. If DP paid → update deals.status to 'dp_paid'
    // 6. If final paid → update deals.status to 'completed'
    // 7. Send Slack notification on significant state changes

    const webhookResult = {
      status: 'received',
      message: 'Skeleton — implement Midtrans webhook handler',
      receivedAt: new Date().toISOString(),
      orderId: payload.order_id || null,
    };

    return new Response(
      JSON.stringify(webhookResult),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
