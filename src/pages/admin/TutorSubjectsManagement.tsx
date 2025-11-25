import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Tutor {
  id: string;
  name: string;
  introduction: string;
}

interface Subject {
  id: string;
  name: string;
}

interface TutorSubject {
  id: string;
  tutor_id: string;
  subject_id: string;
  tutors: Tutor;
  subjects: Subject;
}

const TutorSubjectsManagement = () => {
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [assignments, setAssignments] = useState<TutorSubject[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTutorId, setSelectedTutorId] = useState<string>("");
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [tutorsRes, subjectsRes, assignmentsRes] = await Promise.all([
        supabase.from("tutors").select("*").order("name"),
        supabase.from("subjects").select("*").order("name"),
        supabase
          .from("tutor_subjects")
          .select(`
            *,
            tutors (id, name, introduction),
            subjects (id, name)
          `),
      ]);

      if (tutorsRes.error) throw tutorsRes.error;
      if (subjectsRes.error) throw subjectsRes.error;
      if (assignmentsRes.error) throw assignmentsRes.error;

      setTutors(tutorsRes.data || []);
      setSubjects(subjectsRes.data || []);
      setAssignments(assignmentsRes.data || []);
    } catch (error: any) {
      toast.error("Failed to fetch data: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = () => {
    setSelectedTutorId("");
    setSelectedSubjectId("");
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedTutorId("");
    setSelectedSubjectId("");
  };

  const handleSubmit = async () => {
    if (!selectedTutorId || !selectedSubjectId) {
      toast.error("Please select both tutor and subject");
      return;
    }

    // Check if assignment already exists
    const exists = assignments.some(
      (a) => a.tutor_id === selectedTutorId && a.subject_id === selectedSubjectId
    );

    if (exists) {
      toast.error("This assignment already exists");
      return;
    }

    try {
      const { error } = await supabase.from("tutor_subjects").insert([
        {
          tutor_id: selectedTutorId,
          subject_id: selectedSubjectId,
        },
      ]);

      if (error) throw error;
      toast.success("Assignment added successfully");
      fetchData();
      handleCloseDialog();
    } catch (error: any) {
      toast.error("Failed to add assignment: " + error.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this assignment?")) return;

    try {
      const { error } = await supabase
        .from("tutor_subjects")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast.success("Assignment removed successfully");
      fetchData();
    } catch (error: any) {
      toast.error("Failed to remove assignment: " + error.message);
    }
  };

  const getTutorSubjects = (tutorId: string) => {
    return assignments.filter((a) => a.tutor_id === tutorId);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-3xl font-bold">Tutor-Subject Assignments</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Click the trash icon on any subject badge to remove it. Use "Add Assignment" to assign subjects to tutors.
          </p>
        </div>
        <Button onClick={handleOpenDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Add Assignment
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {tutors.map((tutor) => {
          const tutorAssignments = getTutorSubjects(tutor.id);
          return (
            <Card key={tutor.id}>
              <CardHeader>
                <CardTitle>{tutor.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Teaching:</h4>
                    {tutorAssignments.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {tutorAssignments.map((assignment) => (
                          <Badge
                            key={assignment.id}
                            variant="secondary"
                            className="flex items-center gap-2 pr-1"
                          >
                            {assignment.subjects.name}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 hover:bg-destructive hover:text-destructive-foreground rounded-full"
                              onClick={() => handleDelete(assignment.id)}
                              title="Remove this subject from tutor"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No subjects assigned
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Tutor-Subject Assignment</DialogTitle>
            <DialogDescription>
              Assign a subject to a tutor
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="tutor">Tutor</Label>
              <Select value={selectedTutorId} onValueChange={setSelectedTutorId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a tutor" />
                </SelectTrigger>
                <SelectContent>
                  {tutors.map((tutor) => (
                    <SelectItem key={tutor.id} value={tutor.id}>
                      {tutor.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="subject">Subject</Label>
              <Select
                value={selectedSubjectId}
                onValueChange={setSelectedSubjectId}
              >
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
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>Add Assignment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TutorSubjectsManagement;
