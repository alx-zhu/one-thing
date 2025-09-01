// src/components/TaskBucket.tsx
import { useState } from "react";
import type {
  TaskBucket as TaskBucketType,
  Task,
  BucketType,
} from "@/types/task";
import { TaskItem } from "./TaskItem";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Plus, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface TaskBucketProps {
  bucket: TaskBucketType;
  oneThingTaskId: string | null;
  draggedTask: Task | null;
  onAddTask: (
    bucketId: BucketType,
    title: string,
    description?: string
  ) => void;
  onEditTask: (
    taskId: string,
    updates: Partial<Pick<Task, "title" | "description">>
  ) => void;
  onDeleteTask: (taskId: string) => void;
  onSetOneThing: (taskId: string | null) => void;
  onDragStart: (e: React.DragEvent, task: Task, bucketId: BucketType) => void;
  onDragEnd: () => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, targetBucket: BucketType) => void;
}

export const TaskBucket = ({
  bucket,
  oneThingTaskId,
  draggedTask,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onSetOneThing,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
}: TaskBucketProps) => {
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [isDropTarget, setIsDropTarget] = useState(false);

  const canAddTask = !bucket.maxTasks || bucket.tasks.length < bucket.maxTasks;
  const isAtLimit = bucket.maxTasks && bucket.tasks.length >= bucket.maxTasks;

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return;

    try {
      onAddTask(
        bucket.id,
        newTaskTitle.trim(),
        newTaskDescription.trim() || undefined
      );
      setNewTaskTitle("");
      setNewTaskDescription("");
      setIsAddingTask(false);
    } catch (error) {
      console.error("Failed to add task:", error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAddTask();
    } else if (e.key === "Escape") {
      setNewTaskTitle("");
      setNewTaskDescription("");
      setIsAddingTask(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    onDragOver(e);
    setIsDropTarget(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    // Only set to false if we're leaving the bucket entirely
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDropTarget(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    onDrop(e, bucket.id);
    setIsDropTarget(false);
  };

  const getBucketColor = (bucketId: BucketType) => {
    switch (bucketId) {
      case "time-sensitive":
        return "border-red-200 dark:border-red-800";
      case "important":
        return "border-blue-200 dark:border-blue-800";
      case "when-available":
        return "border-gray-200 dark:border-gray-700";
      default:
        return "border-gray-200 dark:border-gray-700";
    }
  };

  return (
    <Card
      className={cn(
        "flex flex-col h-full min-h-96 transition-all duration-200",
        getBucketColor(bucket.id),
        isDropTarget && "ring-2 ring-primary/50 bg-primary/5 scale-[1.02]"
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-base">{bucket.title}</CardTitle>
            <CardDescription className="text-xs">
              {bucket.description}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {bucket.maxTasks && (
              <span
                className={cn(
                  "px-2 py-1 rounded-full text-xs font-medium",
                  isAtLimit
                    ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                    : "bg-muted"
                )}
              >
                {bucket.tasks.length}/{bucket.maxTasks}
              </span>
            )}
            {isAtLimit && <AlertCircle className="h-3 w-3 text-red-500" />}
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 space-y-3">
        {bucket.tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            bucketId={bucket.id}
            isOneThing={oneThingTaskId === task.id}
            isDragging={draggedTask?.id === task.id}
            onEdit={onEditTask}
            onDelete={onDeleteTask}
            onSetOneThing={onSetOneThing}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
          />
        ))}

        {isAddingTask ? (
          <Card className="border-dashed bg-muted/30 px-4 py-3">
            <div className="space-y-2">
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter task title..."
                className="w-full px-0 py-1 text-sm font-medium bg-transparent border-none focus:outline-none placeholder:text-muted-foreground"
                autoFocus
              />
              <textarea
                value={newTaskDescription}
                onChange={(e) => setNewTaskDescription(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Add description (optional)..."
                className="w-full px-0 py-1 text-xs text-muted-foreground bg-transparent border-none resize-none focus:outline-none placeholder:text-muted-foreground"
                rows={2}
              />
              <div className="flex gap-2 pt-1">
                <button
                  onClick={handleAddTask}
                  className="px-3 py-1 text-xs bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
                >
                  Add
                </button>
                <button
                  onClick={() => {
                    setNewTaskTitle("");
                    setNewTaskDescription("");
                    setIsAddingTask(false);
                  }}
                  className="px-3 py-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </Card>
        ) : canAddTask ? (
          <button
            onClick={() => setIsAddingTask(true)}
            className="w-full p-3 border-2 border-dashed border-muted-foreground/25 rounded-lg text-muted-foreground hover:border-muted-foreground/50 hover:text-foreground transition-all duration-200 flex items-center justify-center gap-2 text-sm"
          >
            <Plus className="h-4 w-4" />
            Add task
          </button>
        ) : (
          <div className="text-center py-4 text-xs text-muted-foreground">
            Bucket limit reached
          </div>
        )}
      </CardContent>
    </Card>
  );
};
