import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { Plus, Edit, Trash2, Upload, User, X } from "lucide-react";
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
  photo_url: string | null;
}

const TutorsManagement = () => {
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTutor, setEditingTutor] = useState<Tutor | null>(null);
  const [formData, setFormData] = useState({ name: "", introduction: "", photo_url: "" });
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      setFormData({ 
        name: tutor.name, 
        introduction: tutor.introduction,
        photo_url: tutor.photo_url || ""
      });
    } else {
      setEditingTutor(null);
      setFormData({ name: "", introduction: "", photo_url: "" });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingTutor(null);
    setFormData({ name: "", introduction: "", photo_url: "" });
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error("Please upload an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('tutor-photos')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('tutor-photos')
        .getPublicUrl(filePath);

      setFormData({ ...formData, photo_url: publicUrl });
      toast.success("Photo uploaded successfully");
    } catch (error: any) {
      toast.error("Failed to upload photo: " + error.message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemovePhoto = () => {
    setFormData({ ...formData, photo_url: "" });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.introduction) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const dataToSave = {
        name: formData.name,
        introduction: formData.introduction,
        photo_url: formData.photo_url || null
      };

      if (editingTutor) {
        const { error } = await supabase
          .from("tutors")
          .update(dataToSave)
          .eq("id", editingTutor.id);

        if (error) throw error;
        toast.success("Tutor updated successfully");
      } else {
        const { error } = await supabase.from("tutors").insert([dataToSave]);

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
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={tutor.photo_url || ""} alt={tutor.name} />
                    <AvatarFallback>
                      <User className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                  <span>{tutor.name}</span>
                </div>
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
        <DialogContent className="max-w-md">
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
            <div className="flex flex-col items-center gap-3">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={formData.photo_url} alt="Tutor photo" />
                  <AvatarFallback className="bg-muted">
                    <User className="h-12 w-12 text-muted-foreground" />
                  </AvatarFallback>
                </Avatar>
                {formData.photo_url && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                    onClick={handleRemovePhoto}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                <Upload className="mr-2 h-4 w-4" />
                {uploading ? "Uploading..." : formData.photo_url ? "Replace Photo" : "Upload Photo"}
              </Button>
            </div>

            <div>
              <Label htmlFor="name">Name *</Label>
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
              <Label htmlFor="introduction">Introduction *</Label>
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
            <Button onClick={handleSubmit} disabled={uploading}>
              {editingTutor ? "Update" : "Add"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TutorsManagement;