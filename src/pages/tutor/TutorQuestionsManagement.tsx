import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface Question {
  id: string;
  title: string;
  content: string;
  created_at: string;
  subjects: { name: string } | null;
  answers: { id: string }[];
}

const TutorQuestionsManagement = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchQuestions();
  }, []);

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

  const getQuestionStatus = (answersCount: number) => {
    if (answersCount === 0) {
      return <Badge variant="destructive">Unanswered</Badge>;
    }
    return <Badge variant="default">{answersCount} answers</Badge>;
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Student Questions</h1>
        <p className="text-muted-foreground">
          View and answer student questions
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12">Loading questions...</div>
      ) : questions.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No questions yet</p>
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
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle className="text-xl">{question.title}</CardTitle>
                        {getQuestionStatus(question.answers.length)}
                      </div>
                      <CardDescription className="line-clamp-2">
                        {question.content}
                      </CardDescription>
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

export default TutorQuestionsManagement;
