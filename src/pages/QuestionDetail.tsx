import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Image as ImageIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Question {
  id: string;
  title: string;
  content: string;
  created_at: string;
  subjects: { name: string } | null;
}

interface Answer {
  id: string;
  content: string;
  created_at: string;
  tutors: { name: string };
}

interface Attachment {
  id: string;
  file_path: string;
  file_name: string;
}

const QuestionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [question, setQuestion] = useState<Question | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [loading, setLoading] = useState(true);
  const [answerContent, setAnswerContent] = useState("");
  const [user, setUser] = useState<any>(null);
  const [isTutor, setIsTutor] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
    fetchQuestion();
    fetchAnswers();
    fetchAttachments();
  }, [id]);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
    
    if (user) {
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id);
      
      setIsTutor(roles?.some(r => r.role === "tutor" || r.role === "admin") || false);
    }
  };

  const fetchQuestion = async () => {
    const { data, error } = await supabase
      .from("questions")
      .select(`
        id,
        title,
        content,
        created_at,
        subjects(name)
      `)
      .eq("id", id)
      .single();

    if (error) {
      toast({ title: "Error fetching question", variant: "destructive" });
      navigate("/questions");
    } else {
      setQuestion(data);
    }
    setLoading(false);
  };

  const fetchAnswers = async () => {
    const { data, error } = await supabase
      .from("answers")
      .select(`
        id,
        content,
        created_at,
        tutors(name)
      `)
      .eq("question_id", id)
      .order("created_at", { ascending: true });

    if (!error) {
      setAnswers(data || []);
    }
  };

  const fetchAttachments = async () => {
    const { data, error } = await supabase
      .from("question_attachments")
      .select("*")
      .eq("question_id", id);

    if (!error) {
      setAttachments(data || []);
    }
  };

  const getImageUrl = (filePath: string) => {
    const { data } = supabase.storage
      .from("question-attachments")
      .getPublicUrl(filePath);
    return data.publicUrl;
  };

  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({ title: "Please log in to answer", variant: "destructive" });
      return;
    }

    // Get the tutor record for this user
    const { data: tutorData } = await supabase
      .from("tutors")
      .select("id")
      .limit(1)
      .single();

    if (!tutorData) {
      toast({ title: "Tutor profile not found", variant: "destructive" });
      return;
    }

    const { error } = await supabase
      .from("answers")
      .insert({
        question_id: id,
        tutor_id: tutorData.id,
        content: answerContent,
      });

    if (error) {
      toast({ title: "Error posting answer", variant: "destructive" });
      return;
    }

    toast({ title: "Answer posted successfully!" });
    setAnswerContent("");
    fetchAnswers();
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  if (!question) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Button 
        variant="ghost" 
        onClick={() => navigate("/questions")}
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Questions
      </Button>

      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            {question.subjects && (
              <span className="text-xs px-2 py-1 rounded-full bg-secondary text-secondary-foreground">
                {question.subjects.name}
              </span>
            )}
            <span className="text-xs text-muted-foreground">
              {new Date(question.created_at).toLocaleDateString()}
            </span>
          </div>
          <CardTitle className="text-2xl">{question.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-wrap mb-4">{question.content}</p>
          
          {attachments.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {attachments.map((attachment) => (
                <a
                  key={attachment.id}
                  href={getImageUrl(attachment.file_path)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative group"
                >
                  <img
                    src={getImageUrl(attachment.file_path)}
                    alt={attachment.file_name}
                    className="w-full h-40 object-cover rounded-lg border hover:opacity-80 transition-opacity"
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 rounded-lg">
                    <ImageIcon className="h-8 w-8 text-white" />
                  </div>
                </a>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">
          Answers ({answers.length})
        </h2>
        
        <div className="space-y-4">
          {answers.map((answer) => (
            <Card key={answer.id}>
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  <Avatar>
                    <AvatarFallback>
                      {answer.tutors.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold">{answer.tutors.name}</span>
                      <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                        Tutor
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(answer.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="whitespace-pre-wrap">{answer.content}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {isTutor && (
        <Card>
          <CardHeader>
            <CardTitle>Post an Answer</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitAnswer} className="space-y-4">
              <div>
                <Label htmlFor="answer">Your Answer</Label>
                <Textarea
                  id="answer"
                  value={answerContent}
                  onChange={(e) => setAnswerContent(e.target.value)}
                  placeholder="Share your expertise..."
                  rows={6}
                  required
                />
              </div>
              <Button type="submit">Post Answer</Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default QuestionDetail;
