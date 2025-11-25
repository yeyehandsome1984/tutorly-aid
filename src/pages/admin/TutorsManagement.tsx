import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Plus, Edit, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Tutor {
  id: string;
  name: string;
  introduction: string;
}

const TutorsManagement = () => {
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTutor, setEditingTutor] = useState<Tutor | null>(null);
  const [formData, setFormData] = useState({ name: "", introduction: "" });

  useEffect(() => {
    fetchTutors();
  }, []);

  const fetchTutors = async () => {
    try {
      const { data, error } = await supabase
        .from("tutors")
        .select("*")
        .order("name");

      if (error) throw error;
      setTutors(data || []);
    } catch (error: any) {
      toast.error("Failed to fetch tutors: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (tutor?: Tutor) => {
    if (tutor) {
      setEditingTutor(tutor);
      setFormData({ name: tutor.name, introduction: tutor.introduction });
    } else {
      setEditingTutor(null);
      setFormData({ name: "", introduction: "" });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingTutor(null);
    setFormData({ name: "", introduction: "" });
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.introduction) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      if (editingTutor) {
        const { error } = await supabase
          .from("tutors")
          .update(formData)
          .eq("id", editingTutor.id);

        if (error) throw error;
        toast.success("Tutor updated successfully");
      } else {
        const { error } = await supabase.from("tutors").insert([formData]);

        if (error) throw error;
        toast.success("Tutor added successfully");
      }

      fetchTutors();
      handleCloseDialog();
    } catch (error: any) {
      toast.error("Failed to save tutor: " + error.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this tutor?")) return;

    try {
      const { error } = await supabase.from("tutors").delete().eq("id", id);

      if (error) throw error;
      toast.success("Tutor deleted successfully");
      fetchTutors();
    } catch (error: any) {
      toast.error("Failed to delete tutor: " + error.message);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Tutors Management</h1>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="mr-2 h-4 w-4" />
          Add Tutor
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {tutors.map((tutor) => (
          <Card key={tutor.id}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>{tutor.name}</span>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleOpenDialog(tutor)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(tutor.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{tutor.introduction}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingTutor ? "Edit Tutor" : "Add New Tutor"}
            </DialogTitle>
            <DialogDescription>
              {editingTutor
                ? "Update the tutor's information"
                : "Add a new tutor to the system"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Tutor name"
              />
            </div>

            <div>
              <Label htmlFor="introduction">Introduction</Label>
              <Textarea
                id="introduction"
                value={formData.introduction}
                onChange={(e) =>
                  setFormData({ ...formData, introduction: e.target.value })
                }
                placeholder="Tutor introduction and background"
                rows={5}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {editingTutor ? "Update" : "Add"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TutorsManagement;
