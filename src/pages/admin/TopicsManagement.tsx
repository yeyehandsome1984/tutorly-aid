import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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

interface Topic {
  id: string;
  name: string;
  description: string | null;
  subject_id: string;
  order_index: number;
}

interface Subject {
  id: string;
  name: string;
}

const TopicsManagement = () => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    subject_id: "",
    order_index: 0,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [topicsRes, subjectsRes] = await Promise.all([
        supabase.from("topics").select("*").order("order_index"),
        supabase.from("subjects").select("id, name").order("name"),
      ]);

      if (topicsRes.error) throw topicsRes.error;
      if (subjectsRes.error) throw subjectsRes.error;

      setTopics(topicsRes.data || []);
      setSubjects(subjectsRes.data || []);
    } catch (error: any) {
      toast.error("Failed to fetch data: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const getSubjectName = (subjectId: string) => {
    return subjects.find((s) => s.id === subjectId)?.name || "Unknown";
  };

  const handleOpenDialog = (topic?: Topic) => {
    if (topic) {
      setEditingTopic(topic);
      setFormData({
        name: topic.name,
        description: topic.description || "",
        subject_id: topic.subject_id,
        order_index: topic.order_index,
      });
    } else {
      setEditingTopic(null);
      setFormData({
        name: "",
        description: "",
        subject_id: "",
        order_index: 0,
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingTopic(null);
    setFormData({ name: "", description: "", subject_id: "", order_index: 0 });
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.subject_id) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const submitData = {
        name: formData.name,
        description: formData.description || null,
        subject_id: formData.subject_id,
        order_index: formData.order_index,
      };

      if (editingTopic) {
        const { error } = await supabase
          .from("topics")
          .update(submitData)
          .eq("id", editingTopic.id);

        if (error) throw error;
        toast.success("Topic updated successfully");
      } else {
        const { error } = await supabase.from("topics").insert([submitData]);

        if (error) throw error;
        toast.success("Topic added successfully");
      }

      fetchData();
      handleCloseDialog();
    } catch (error: any) {
      toast.error("Failed to save topic: " + error.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this topic?")) return;

    try {
      const { error } = await supabase.from("topics").delete().eq("id", id);

      if (error) throw error;
      toast.success("Topic deleted successfully");
      fetchData();
    } catch (error: any) {
      toast.error("Failed to delete topic: " + error.message);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Topics Management</h1>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="mr-2 h-4 w-4" />
          Add Topic
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {topics.map((topic) => (
          <Card key={topic.id}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <div>
                  <div>{topic.name}</div>
                  <div className="text-sm font-normal text-muted-foreground">
                    {getSubjectName(topic.subject_id)}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleOpenDialog(topic)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(topic.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {topic.description || "No description"}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Order: {topic.order_index}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingTopic ? "Edit Topic" : "Add New Topic"}
            </DialogTitle>
            <DialogDescription>
              {editingTopic
                ? "Update the topic's information"
                : "Add a new topic to a subject"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Topic name"
              />
            </div>

            <div>
              <Label htmlFor="subject">Subject *</Label>
              <Select
                value={formData.subject_id}
                onValueChange={(value) =>
                  setFormData({ ...formData, subject_id: value })
                }
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

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Topic description"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="order">Order Index</Label>
              <Input
                id="order"
                type="number"
                value={formData.order_index}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    order_index: parseInt(e.target.value) || 0,
                  })
                }
                placeholder="0"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {editingTopic ? "Update" : "Add"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TopicsManagement;
