-- Create storage bucket for tutor photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('tutor-photos', 'tutor-photos', true);

-- Allow anyone to view tutor photos (public bucket)
CREATE POLICY "Anyone can view tutor photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'tutor-photos');

-- Allow admins to upload tutor photos
CREATE POLICY "Admins can upload tutor photos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'tutor-photos' 
  AND has_role(auth.uid(), 'admin'::app_role)
);

-- Allow admins to update tutor photos
CREATE POLICY "Admins can update tutor photos"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'tutor-photos' 
  AND has_role(auth.uid(), 'admin'::app_role)
);

-- Allow admins to delete tutor photos
CREATE POLICY "Admins can delete tutor photos"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'tutor-photos' 
  AND has_role(auth.uid(), 'admin'::app_role)
);