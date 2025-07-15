import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import API from "../api";
import { Plus, Save, X } from "lucide-react";

export default function TaskForm({ refresh, editTask = null, trigger = null }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { 
    register, 
    handleSubmit, 
    reset, 
    setValue, 
    watch,
    formState: { errors } 
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      due_date: "",
      priority: "medium",
      status: "pending"
    }
  });

  const watchedStatus = watch("status");
  const watchedPriority = watch("priority");

  // Effect to reset form when editTask prop changes
  useEffect(() => {
    if (editTask) {
      reset({
        title: editTask.title || "",
        description: editTask.description || "",
        due_date: editTask.due_date || "",
        priority: editTask.priority || "medium",
        status: editTask.status || "pending"
      });
    } else {
      reset({
        title: "",
        description: "",
        due_date: "",
        priority: "medium",
        status: "pending"
      });
    }
  }, [editTask, reset]);

  // Reset form when opening
  const handleOpenChange = (open) => {
    setIsOpen(open);
    if (open) {
      // Reset form when opening
      if (editTask) {
        // Pre-fill form with edit data
        reset({
          title: editTask.title || "",
          description: editTask.description || "",
          due_date: editTask.due_date || "",
          priority: editTask.priority || "medium",
          status: editTask.status || "pending"
        });
      } else {
        // Reset to default values for new task
        reset({
          title: "",
          description: "",
          due_date: "",
          priority: "medium",
          status: "pending"
        });
      }
    } else {
      // Reset form when closing
      reset({
        title: "",
        description: "",
        due_date: "",
        priority: "medium",
        status: "pending"
      });
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      if (editTask) {
        await API.put(`/tasks/${editTask.id}/`, data);
      } else {
        await API.post("/tasks/", data);
      }
      
      // Trigger refresh first
      if (refresh) {
        refresh(prev => !prev);
      }
      
      // Close dialog
      setIsOpen(false);
      
      // Reset form after successful submission
      reset({
        title: "",
        description: "",
        due_date: "",
        priority: "medium",
        status: "pending"
      });
    } catch (error) {
      console.error("Error saving task:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button 
            className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-colored"
          >
            <Plus className="w-4 h-4" />
            Add New Task
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto task-form-dialog">
        <DialogHeader className="bg-cyan-900">
          <DialogTitle className="text-xl font-bold text-white">
            {editTask ? "Edit Task" : "Create New Task"}
          </DialogTitle>
          <DialogDescription className="text-gray-200">
            {editTask 
              ? "Update the task details below." 
              : "Fill in the details to create a new task."
            }
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-4">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium">
                Title *
              </Label>
              <Input
                id="title"
                placeholder="Enter task title..."
                {...register("title", { 
                  required: "Title is required",
                  minLength: { value: 3, message: "Title must be at least 3 characters" }
                })}
                className="w-full"
              />
              {errors.title && (
                <p className="text-sm text-destructive">{errors.title.message}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">
                Description
              </Label>
              <Textarea
                id="description"
                placeholder="Describe your task..."
                {...register("description")}
                rows={3}
                className="w-full resize-none"
              />
            </div>

            {/* Form Grid for Priority, Status, and Due Date */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Priority */}
              <div className="space-y-2">
                <Label htmlFor="priority" className="text-sm font-medium">
                  Priority
                </Label>
                <Select
                  value={watchedPriority}
                  onValueChange={(value) => setValue("priority", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        Low
                      </div>
                    </SelectItem>
                    <SelectItem value="medium">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-yellow-600"></div>
                        Medium
                      </div>
                    </SelectItem>
                    <SelectItem value="high">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        High
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Status */}
              <div className="space-y-2">
                <Label htmlFor="status" className="text-sm font-medium">
                  Status
                </Label>
                <Select
                  value={watchedStatus}
                  onValueChange={(value) => setValue("status", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        Pending
                      </div>
                    </SelectItem>
                    <SelectItem value="in_progress">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-yellow-600"></div>
                        In Progress
                      </div>
                    </SelectItem>
                    <SelectItem value="completed">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        Completed
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Due Date */}
              <div className="space-y-2">
                <Label htmlFor="due_date" className="text-sm font-medium">
                  Due Date
                </Label>
                <Input
                  id="due_date"
                  type="date"
                  {...register("due_date")}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={loading}
            >
              <X className="w-4 h-4" />
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {loading ? "Saving..." : (editTask ? "Update Task" : "Create Task")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}