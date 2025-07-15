import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit2, Trash2, Calendar, GripVertical } from "lucide-react";
import TaskForm from "./TaskForm";

export default function TaskCard({ task, onToggleStatus, onDelete, onRefresh }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500 text-white';
      case 'medium':
        return 'bg-yellow-500 text-black';
      case 'low':
        return 'bg-green-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-600 text-white';
      case 'in_progress':
        return 'bg-blue-600 text-white';
      case 'pending':
        return 'bg-orange-600 text-white';
      default:
        return 'bg-gray-600 text-white';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const handleToggleStatus = async () => {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    await onToggleStatus(task.id, newStatus);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      await onDelete(task.id);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${isDragging ? 'opacity-50' : ''}`}
    >
      <Card className="bg-cyan-900 border-cyan-700 hover:bg-cyan-800 transition-colors">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-2 flex-1">
              <div
                {...attributes}
                {...listeners}
                className="cursor-grab active:cursor-grabbing pt-1"
              >
                <GripVertical className="h-4 w-4 text-cyan-300" />
              </div>
              <div className="flex-1">
                <CardTitle className={`text-white ${task.status === 'completed' ? 'line-through text-gray-300' : ''}`}>
                  {task.title}
                </CardTitle>
                {task.description && (
                  <CardDescription className="text-cyan-100 mt-1">
                    {task.description}
                  </CardDescription>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <TaskForm 
                editTask={task} 
                refresh={onRefresh}
                trigger={
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-cyan-300 hover:text-white hover:bg-cyan-700"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                }
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                className="h-8 w-8 p-0 text-red-300 hover:text-white hover:bg-red-600"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className={getPriorityColor(task.priority)}>
                {task.priority}
              </Badge>
              <Badge 
                className={`${getStatusColor(task.status)} cursor-pointer`}
                onClick={handleToggleStatus}
              >
                {task.status.replace('_', ' ')}
              </Badge>
              {task.due_date && (
                <div className="flex items-center gap-1 text-cyan-200 text-sm">
                  <Calendar className="h-3 w-3" />
                  <span>{formatDate(task.due_date)}</span>
                </div>
              )}
            </div>
            {task.created_at && (
              <span className="text-xs text-cyan-300">
                Created: {formatDate(task.created_at)}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
