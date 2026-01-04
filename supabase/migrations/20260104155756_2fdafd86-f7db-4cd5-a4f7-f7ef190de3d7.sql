-- Create trial bookings table
CREATE TABLE public.trial_bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_name TEXT NOT NULL,
  contact_number TEXT NOT NULL,
  email TEXT,
  subject TEXT NOT NULL,
  preferred_date DATE NOT NULL,
  preferred_time TEXT NOT NULL,
  current_school TEXT,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.trial_bookings ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (public form)
CREATE POLICY "Anyone can submit trial bookings"
ON public.trial_bookings
FOR INSERT
WITH CHECK (true);

-- Only admins can view/manage bookings
CREATE POLICY "Admins can view all bookings"
ON public.trial_bookings
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
  )
);

CREATE POLICY "Admins can update bookings"
ON public.trial_bookings
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
  )
);

CREATE POLICY "Admins can delete bookings"
ON public.trial_bookings
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
  )
);

-- Add trigger for updated_at
CREATE TRIGGER update_trial_bookings_updated_at
BEFORE UPDATE ON public.trial_bookings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();