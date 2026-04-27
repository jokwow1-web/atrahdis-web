-- Wave 0-B: Storage Policies for sbu-docs bucket
-- Run after bucket 'sbu-docs' is created in Supabase Dashboard

-- Allow authenticated users to upload to their own deal subfolder
CREATE POLICY "client_upload_own_docs"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'sbu-docs'
    AND (storage.foldername(name))[1] IN (
        SELECT d.id::text
        FROM public.deals d
        JOIN public.client_registry c ON c.id = d.client_id
        WHERE c.portal_user_id = auth.uid()
    )
);

-- Allow authenticated users to read their own deal subfolder
CREATE POLICY "client_read_own_docs"
ON storage.objects FOR SELECT
USING (
    bucket_id = 'sbu-docs'
    AND (storage.foldername(name))[1] IN (
        SELECT d.id::text
        FROM public.deals d
        JOIN public.client_registry c ON c.id = d.client_id
        WHERE c.portal_user_id = auth.uid()
    )
);

-- Allow service_role full access (for backend processing)
CREATE POLICY "service_role_full_access"
ON storage.objects FOR ALL
TO service_role
USING (bucket_id = 'sbu-docs')
WITH CHECK (bucket_id = 'sbu-docs');
