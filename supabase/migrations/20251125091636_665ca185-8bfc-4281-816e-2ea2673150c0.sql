-- Create storage bucket for question attachments
INSERT INTO storage.buckets (id, name, public)
VALUES ('question-attachments', 'question-attachments', true);

-- Create questions table
CREATE TABLE public.questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL,
  subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create answers table
CREATE TABLE public.answers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  tutor_id UUID NOT NULL REFERENCES public.tutors(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create question attachments table
CREATE TABLE public.question_attachments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  file_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_attachments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for questions
CREATE POLICY "Users can view all questions"
  ON public.questions FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create questions"
  ON public.questions FOR INSERT
  WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Users can update their own questions"
  ON public.questions FOR UPDATE
  USING (auth.uid() = student_id);

CREATE POLICY "Users can delete their own questions"
  ON public.questions FOR DELETE
  USING (auth.uid() = student_id);

-- RLS Policies for answers
CREATE POLICY "Anyone can view answers"
  ON public.answers FOR SELECT
  USING (true);

CREATE POLICY "Tutors can create answers"
  ON public.answers FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'tutor'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Tutors can update their own answers"
  ON public.answers FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.tutors 
    WHERE tutors.id = answers.tutor_id 
    AND (has_role(auth.uid(), 'tutor'::app_role) OR has_role(auth.uid(), 'admin'::app_role))
  ));

CREATE POLICY "Tutors can delete their own answers"
  ON public.answers FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.tutors 
    WHERE tutors.id = answers.tutor_id 
    AND (has_role(auth.uid(), 'tutor'::app_role) OR has_role(auth.uid(), 'admin'::app_role))
  ));

-- RLS Policies for attachments
CREATE POLICY "Anyone can view attachments"
  ON public.question_attachments FOR SELECT
  USING (true);

CREATE POLICY "Question owners can add attachments"
  ON public.question_attachments FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.questions 
    WHERE questions.id = question_attachments.question_id 
    AND questions.student_id = auth.uid()
  ));

CREATE POLICY "Question owners can delete attachments"
  ON public.question_attachments FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.questions 
    WHERE questions.id = question_attachments.question_id 
    AND questions.student_id = auth.uid()
  ));

-- Storage policies for question attachments
CREATE POLICY "Anyone can view question attachments"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'question-attachments');

CREATE POLICY "Authenticated users can upload attachments"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'question-attachments' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their own attachments"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'question-attachments' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own attachments"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'question-attachments' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Add triggers for updated_at
CREATE TRIGGER update_questions_updated_at
  BEFORE UPDATE ON public.questions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_answers_updated_at
  BEFORE UPDATE ON public.answers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();