// Supabase Edge Function: validate-docs
// Trigger: HTTP POST /functions/v1/validate-docs
// Body: { dealId, documentId, fileUrl }
//
// Flow:
// 1. Download file from storage
// 2. Validate via Ollama (primary) → Gemini (fallback) → Claude (final fallback)
// 3. Update documents table with validation result
// 4. Trigger deal step progression if all docs validated

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

    const { dealId, documentId, fileUrl } = await req.json();

    if (!dealId || !documentId || !fileUrl) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: dealId, documentId, fileUrl' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // TODO: Implement AI validation pipeline
    // 1. Download file from storage using fileUrl
    // 2. Convert to base64 if needed for vision models
    // 3. Call Ollama (llama3.2-vision) on localhost:11434
    // 4. If confidence < threshold, fallback to Gemini
    // 5. If still low, fallback to Claude
    // 6. Extract fields (company name, NIB, NPWP, etc.)
    // 7. Update documents table with validation_status, confidence_score, extracted_fields
    // 8. Check if all docs for deal are validated → update deal status

    const validationResult = {
      status: 'processing',
      message: 'Skeleton — implement AI validation pipeline',
      dealId,
      documentId,
    };

    return new Response(
      JSON.stringify(validationResult),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
