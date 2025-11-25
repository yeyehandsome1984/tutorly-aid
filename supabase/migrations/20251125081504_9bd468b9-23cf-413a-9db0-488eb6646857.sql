-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'student', 'tutor');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create subjects table
CREATE TABLE public.subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  keywords TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;

-- Create tutors table
CREATE TABLE public.tutors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  introduction TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.tutors ENABLE ROW LEVEL SECURITY;

-- Create tutor_subjects junction table (many-to-many)
CREATE TABLE public.tutor_subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tutor_id UUID REFERENCES public.tutors(id) ON DELETE CASCADE NOT NULL,
  subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE (tutor_id, subject_id)
);

ALTER TABLE public.tutor_subjects ENABLE ROW LEVEL SECURITY;

-- Create topics table
CREATE TABLE public.topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;

-- Create content table
CREATE TABLE public.content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id UUID REFERENCES public.topics(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  body TEXT,
  content_type TEXT DEFAULT 'text',
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.content ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_roles (admins only)
CREATE POLICY "Admins can view all user roles"
  ON public.user_roles FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert user roles"
  ON public.user_roles FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update user roles"
  ON public.user_roles FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete user roles"
  ON public.user_roles FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for subjects (public read, admin write)
CREATE POLICY "Anyone can view subjects"
  ON public.subjects FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert subjects"
  ON public.subjects FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update subjects"
  ON public.subjects FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete subjects"
  ON public.subjects FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for tutors (public read, admin write)
CREATE POLICY "Anyone can view tutors"
  ON public.tutors FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert tutors"
  ON public.tutors FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update tutors"
  ON public.tutors FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete tutors"
  ON public.tutors FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for tutor_subjects (public read, admin write)
CREATE POLICY "Anyone can view tutor subjects"
  ON public.tutor_subjects FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert tutor subjects"
  ON public.tutor_subjects FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete tutor subjects"
  ON public.tutor_subjects FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for topics (public read, admin write)
CREATE POLICY "Anyone can view topics"
  ON public.topics FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert topics"
  ON public.topics FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update topics"
  ON public.topics FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete topics"
  ON public.topics FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for content (public read, admin write)
CREATE POLICY "Anyone can view content"
  ON public.content FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert content"
  ON public.content FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update content"
  ON public.content FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete content"
  ON public.content FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at columns
CREATE TRIGGER update_subjects_updated_at
  BEFORE UPDATE ON public.subjects
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tutors_updated_at
  BEFORE UPDATE ON public.tutors
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_topics_updated_at
  BEFORE UPDATE ON public.topics
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_content_updated_at
  BEFORE UPDATE ON public.content
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial seed data for subjects
INSERT INTO public.subjects (name, description, keywords) VALUES
  ('Principles of Accounting (POA)', 'Master the fundamentals of accounting principles and financial statements', ARRAY['accounting', 'financial statements', 'bookkeeping', 'POA']),
  ('Management of Business (MOB)', 'Understand business management concepts and organizational strategies', ARRAY['business management', 'organization', 'leadership', 'MOB']),
  ('Mathematics', 'Develop strong mathematical skills for A-Level examinations', ARRAY['algebra', 'calculus', 'statistics', 'mathematics']),
  ('Economics', 'Learn micro and macroeconomic principles and their real-world applications', ARRAY['microeconomics', 'macroeconomics', 'market analysis', 'economics']);

-- Insert initial seed data for tutors
INSERT INTO public.tutors (name, introduction) VALUES
  ('Ye Yichen', 'Experienced educator specializing in Principles of Accounting and Management of Business with over 8 years of teaching experience. Known for simplifying complex concepts and helping students achieve distinction grades.'),
  ('Denise', 'Passionate mathematics and accounting tutor dedicated to building strong foundational skills. Focuses on problem-solving techniques and exam strategies to help students excel in their A-Level examinations.'),
  ('Ruvina', 'Dynamic tutor with expertise in Economics and Accounting. Emphasizes real-world applications and critical thinking to make learning engaging and relevant for JC students.'),
  ('Jiayi', 'Mathematics specialist with a track record of helping students improve from failing grades to consistent A''s. Uses innovative teaching methods and personalized attention to address individual learning gaps.');

-- Link tutors to subjects
INSERT INTO public.tutor_subjects (tutor_id, subject_id)
SELECT t.id, s.id
FROM public.tutors t
CROSS JOIN public.subjects s
WHERE (t.name = 'Ye Yichen' AND s.name IN ('Principles of Accounting (POA)', 'Management of Business (MOB)'))
   OR (t.name = 'Denise' AND s.name IN ('Mathematics', 'Principles of Accounting (POA)'))
   OR (t.name = 'Ruvina' AND s.name IN ('Economics', 'Principles of Accounting (POA)'))
   OR (t.name = 'Jiayi' AND s.name = 'Mathematics');