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

interface Content {
  id: string;
  title: string;
  body: string | null;
  topic_id: string;
  content_type: string;
  order_index: number;
}

interface Topic {
  id: string;
  name: string;
  subject_id: string;
}

interface Subject {
  id: string;
  name: string;
}

const ContentManagement = () => {
  const [contents, setContents] = useState<Content[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingContent, setEditingContent] = useState<Content | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    body: "",
    topic_id: "",
    content_type: "text",
    order_index: 0,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [contentsRes, topicsRes, subjectsRes] = await Promise.all([
        supabase.from("content").select("*").order("order_index"),
        supabase.from("topics").select("id, name, subject_id").order("name"),
        supabase.from("subjects").select("id, name").order("name"),
      ]);

      if (contentsRes.error) throw contentsRes.error;
      if (topicsRes.error) throw topicsRes.error;
      if (subjectsRes.error) throw subjectsRes.error;

      setContents(contentsRes.data || []);
      setTopics(topicsRes.data || []);
      setSubjects(subjectsRes.data || []);
    } catch (error: any) {
      toast.error("Failed to fetch data: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const getTopicName = (topicId: string) => {
    const topic = topics.find((t) => t.id === topicId);
    if (!topic) return "Unknown";
    const subject = subjects.find((s) => s.id === topic.subject_id);
    return `${topic.name} (${subject?.name || "Unknown"})`;
  };

  const handleOpenDialog = (content?: Content) => {
    if (content) {
      setEditingContent(content);
      setFormData({
        title: content.title,
        body: content.body || "",
        topic_id: content.topic_id,
        content_type: content.content_type,
        order_index: content.order_index,
      });
    } else {
      setEditingContent(null);
      setFormData({
        title: "",
        body: "",
        topic_id: "",
        content_type: "text",
        order_index: 0,
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingContent(null);
    setFormData({
      title: "",
      body: "",
      topic_id: "",
      content_type: "text",
      order_index: 0,
    });
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.topic_id) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const submitData = {
        title: formData.title,
        body: formData.body || null,
        topic_id: formData.topic_id,
        content_type: formData.content_type,
        order_index: formData.order_index,
      };

      if (editingContent) {
        const { error } = await supabase
          .from("content")
          .update(submitData)
          .eq("id", editingContent.id);

        if (error) throw error;
        toast.success("Content updated successfully");
      } else {
        const { error } = await supabase.from("content").insert([submitData]);

        if (error) throw error;
        toast.success("Content added successfully");
      }

      fetchData();
      handleCloseDialog();
    } catch (error: any) {
      toast.error("Failed to save content: " + error.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this content?")) return;

    try {
      const { error } = await supabase.from("content").delete().eq("id", id);

      if (error) throw error;
      toast.success("Content deleted successfully");
      fetchData();
    } catch (error: any) {
      toast.error("Failed to delete content: " + error.message);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Content Management</h1>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="mr-2 h-4 w-4" />
          Add Content
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {contents.map((content) => (
          <Card key={content.id}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <div>
                  <div>{content.title}</div>
                  <div className="text-sm font-normal text-muted-foreground">
                    {getTopicName(content.topic_id)}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleOpenDialog(content)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(content.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground line-clamp-3">
                {content.body || "No content"}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Type: {content.content_type} | Order: {content.order_index}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingContent ? "Edit Content" : "Add New Content"}
            </DialogTitle>
            <DialogDescription>
              {editingContent
                ? "Update the content's information"
                : "Add new content to a topic"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Content title"
              />
            </div>

            <div>
              <Label htmlFor="topic">Topic *</Label>
              <Select
                value={formData.topic_id}
                onValueChange={(value) =>
                  setFormData({ ...formData, topic_id: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a topic" />
                </SelectTrigger>
                <SelectContent>
                  {topics.map((topic) => (
                    <SelectItem key={topic.id} value={topic.id}>
                      {getTopicName(topic.id)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="content_type">Content Type</Label>
              <Select
                value={formData.content_type}
                onValueChange={(value) =>
                  setFormData({ ...formData, content_type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="exercise">Exercise</SelectItem>
                  <SelectItem value="quiz">Quiz</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="body">Body</Label>
              <Textarea
                id="body"
                value={formData.body}
                onChange={(e) =>
                  setFormData({ ...formData, body: e.target.value })
                }
                placeholder="Content body"
                rows={6}
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
              {editingContent ? "Update" : "Add"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContentManagement;
