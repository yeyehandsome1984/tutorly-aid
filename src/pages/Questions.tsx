import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Question {
  id: string;
  title: string;
  content: string;
  created_at: string;
  subjects: { name: string } | null;
  answers: { id: string }[];
}

interface Subject {
  id: string;
  name: string;
}

const Questions = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [images, setImages] = useState<FileList | null>(null);
  const [user, setUser] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
    fetchQuestions();
    fetchSubjects();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  const fetchQuestions = async () => {
    const { data, error } = await supabase
      .from("questions")
      .select(`
        id,
        title,
        content,
        created_at,
        subjects(name),
        answers(id)
      `)
      .order("created_at", { ascending: false });

    if (error) {
      toast({ title: "Error fetching questions", variant: "destructive" });
    } else {
      setQuestions(data || []);
    }
    setLoading(false);
  };

  const fetchSubjects = async () => {
    const { data, error } = await supabase
      .from("subjects")
      .select("id, name")
      .order("name");

    if (error) {
      toast({ title: "Error fetching subjects", variant: "destructive" });
    } else {
      setSubjects(data || []);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({ title: "Please log in to ask a question", variant: "destructive" });
      return;
    }

    const { data, error } = await supabase
      .from("questions")
      .insert({
        student_id: user.id,
        subject_id: subjectId || null,
        title,
        content,
      })
      .select()
      .single();

    if (error) {
      toast({ title: "Error creating question", variant: "destructive" });
      return;
    }

    // Upload images if any
    if (images && data) {
      for (let i = 0; i < images.length; i++) {
        const file = images[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}/${data.id}/${Date.now()}_${i}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('question-attachments')
          .upload(fileName, file);

        if (uploadError) {
          console.error("Error uploading image:", uploadError);
        } else {
          await supabase.from("question_attachments").insert({
            question_id: data.id,
            file_path: fileName,
            file_name: file.name,
          });
        }
      }
    }

    toast({ title: "Question posted successfully!" });
    setOpen(false);
    setTitle("");
    setContent("");
    setSubjectId("");
    setImages(null);
    fetchQuestions();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Questions & Answers</h1>
          <p className="text-muted-foreground">Ask questions and get help from our tutors</p>
        </div>
        {user && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Ask Question
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Ask a Question</DialogTitle>
                <DialogDescription>
                  Get help from our expert tutors
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title">Question Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Brief summary of your question"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="subject">Subject (Optional)</Label>
                  <Select value={subjectId} onValueChange={setSubjectId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map((subject) => (
                        <SelectItem key={subject.id} value={subject.id}>
                          {subject.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="content">Question Details</Label>
                  <Textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Provide detailed information about your question"
                    rows={6}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="images">Attach Images (Optional)</Label>
                  <Input
                    id="images"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => setImages(e.target.files)}
                  />
                </div>
                <Button type="submit" className="w-full">Post Question</Button>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {loading ? (
        <div className="text-center py-12">Loading questions...</div>
      ) : questions.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No questions yet. Be the first to ask!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {questions.map((question) => (
            <Link key={question.id} to={`/questions/${question.id}`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{question.title}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {question.content}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground ml-4">
                      <MessageSquare className="h-4 w-4" />
                      <span>{question.answers.length} answers</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    {question.subjects && (
                      <span className="text-xs px-2 py-1 rounded-full bg-secondary text-secondary-foreground">
                        {question.subjects.name}
                      </span>
                    )}
                    <span className="text-xs text-muted-foreground">
                      {new Date(question.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Questions;
