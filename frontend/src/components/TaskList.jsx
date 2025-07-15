import { useState } from "react";
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import TaskCard from "./TaskCard";
import API from "../api";

export default function TaskList({ tasks, refresh, filters }) {
  const [draggedTasks, setDraggedTasks] = useState(tasks);
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Filter tasks based on filters
  const filteredTasks = tasks.filter(task => {
    if (filters.status && filters.status !== 'all' && task.status !== filters.status) {
      return false;
    }
    if (filters.priority && filters.priority !== 'all' && task.priority !== filters.priority) {
      return false;
    }
    if (filters.search && !task.title.toLowerCase().includes(filters.search.toLowerCase()) && 
        !task.description.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    return true;
  });

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = filteredTasks.findIndex(task => task.id === active.id);
      const newIndex = filteredTasks.findIndex(task => task.id === over.id);
      
      const newTasks = arrayMove(filteredTasks, oldIndex, newIndex);
      
      // Update order in backend
      try {
        const taskOrders = newTasks.map((task, index) => ({
          id: task.id,
          order: index
        }));
        
        await API.patch('/tasks/reorder/', { task_orders: taskOrders });
        refresh(prev => !prev);
      } catch (error) {
        console.error('Error updating task order:', error);
      }
    }
  };

  const toggleStatus = async (task) => {
    try {
      let newStatus;
      if (task.status === 'pending') {
        newStatus = 'in_progress';
      } else if (task.status === 'in_progress') {
        newStatus = 'completed';
      } else {
        newStatus = 'pending';
      }

      await API.patch(`/tasks/${task.id}/`, { status: newStatus });
      refresh(prev => !prev);
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const deleteTask = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await API.delete(`/tasks/${id}/`);
        refresh(prev => !prev);
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  if (filteredTasks.length === 0) {
    return (
      <div className="text-center py-8 text-black">
        <p>No tasks found. Create your first task to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext 
          items={filteredTasks.map(task => task.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-3">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggleStatus={toggleStatus}
                onDelete={deleteTask}
                onRefresh={refresh}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
