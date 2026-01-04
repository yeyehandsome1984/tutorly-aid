-- Drop tables in correct order (respecting foreign key dependencies)
DROP TABLE IF EXISTS public.question_attachments CASCADE;
DROP TABLE IF EXISTS public.answers CASCADE;
DROP TABLE IF EXISTS public.questions CASCADE;

-- Delete storage bucket for question attachments
DELETE FROM storage.objects WHERE bucket_id = 'question-attachments';
DELETE FROM storage.buckets WHERE id = 'question-attachments';