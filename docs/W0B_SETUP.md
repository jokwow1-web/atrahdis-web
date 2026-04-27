# W0-B Setup Guide — Storage + Env Vars + Edge Functions

## Status: Partially Automated
Beberapa langkah perlu manual karena tidak ada Supabase CLI setup di project ini.

---

## 1. Supabase Storage Bucket (Manual — Supabase Dashboard)

Buka Supabase Dashboard → Project `pnnhwfeljzcokuwqvcjb`:

1. **Storage → New Bucket**
   - Name: `sbu-docs`
   - Private: **YES**
   - File size limit: `20MB`
   - Allowed MIME types:
     - `application/pdf`
     - `image/jpeg`
     - `image/png`
     - `image/webp`

2. **Jalankan SQL Policy**
   Buka SQL Editor → New Query → paste isi file:
   ```
   supabase/migrations/20260426_w0b_storage_policy.sql
   ```
   Lalu klik **Run**.

3. **Verifikasi**
   ```sql
   SELECT * FROM storage.buckets WHERE name = 'sbu-docs';
   SELECT * FROM storage.policies WHERE name = 'client_own_storage';
   ```

---

## 2. Env Vars (✅ Done — VPS)

Sudah di-append ke `/root/.env` di VPS (212.85.25.73):

| Var | Status |
|-----|--------|
| `MIDTRANS_*` | Placeholder — ganti dengan real key |
| `OLLAMA_*` | ✅ Configured |
| `GEMINI_VALIDATION_MODEL` | ✅ Configured |
| `CLAUDE_VALIDATOR_MODEL` | ✅ Configured |
| `VALIDATION_CONFIDENCE_THRESHOLD` | ✅ Configured (92.0) |
| `STORAGE_*` | ✅ Placeholder configured |
| `SMTP_*` | Placeholder — ganti dengan real credentials |
| `SUPABASE_URL` | ✅ Configured (`https://pnnhwfeljzcokuwqvcjb.supabase.co`) |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ Configured (`sbp_c53f...8bf`) |

---

## 3. Supabase Edge Functions

Skeleton sudah dibuat di `supabase/functions/`:

| Function | File | Purpose |
|----------|------|---------|
| `validate-docs` | `supabase/functions/validate-docs/index.ts` | AI validation pipeline (Ollama → Gemini → Claude) |
| `payment-webhook` | `supabase/functions/payment-webhook/index.ts` | Midtrans webhook handler |
| `storage-cleanup` | `supabase/functions/storage-cleanup/index.ts` | Cleanup rejected/expired files |

### Deploy (Supabase CLI)

Jika belum punya Supabase CLI:
```bash
npm install -g supabase
supabase login
supabase link --project-ref pnnhwfeljzcokuwqvcjb
```

Deploy functions:
```bash
supabase functions deploy validate-docs
supabase functions deploy payment-webhook
supabase functions deploy storage-cleanup
```

### Environment Variables untuk Functions

Setelah deploy, tambahkan env vars di Supabase Dashboard → Edge Functions → `validate-docs` → Secrets:
```
SUPABASE_URL=https://pnnhwfeljzcokuwqvcjb.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<service_role_key>
```

---

## Next Steps (W0-C / Next Wave)

1. Isi placeholder env vars dengan real values:
   - Midtrans keys (server, client, webhook signature)
   - SMTP credentials
   - Supabase Service Role Key

2. Implementasi logic di Edge Functions:
   - `validate-docs`: Integrasi Ollama vision + fallback Gemini/Claude
   - `payment-webhook`: Parse Midtrans payload + update DB
   - `storage-cleanup`: Cron job harian untuk cleanup

3. Setup Supabase Cron (pg_cron) untuk `storage-cleanup`:
   ```sql
   SELECT cron.schedule('storage-cleanup-daily', '0 3 * * *', $$ SELECT net.http_post(url:='https://pnnhwfeljzcokuwqvcjb.supabase.co/functions/v1/storage-cleanup', headers:='{"Authorization":"Bearer <service_role_key>"}'::jsonb) $$);
   ```
