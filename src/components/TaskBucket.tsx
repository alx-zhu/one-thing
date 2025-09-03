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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface TaskBucketProps {
  bucket: TaskBucketType;
  oneThingTaskId: string | null;
  draggedTask: Task | null;
  onAddTask: (
    bucketId: BucketType,
    title: string,
    description?: string,
    deadline?: Date,
    timeEstimate?: number
  ) => void;
  onEditTask: (
    taskId: string,
    updates: Partial<
      Pick<Task, "title" | "description" | "deadline" | "timeEstimate">
    >
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
  const [newTaskDeadline, setNewTaskDeadline] = useState("");
  const [newTaskTimeEstimate, setNewTaskTimeEstimate] = useState("");
  const [isDropTarget, setIsDropTarget] = useState(false);

  const canAddTask = !bucket.maxTasks || bucket.tasks.length < bucket.maxTasks;
  const isAtLimit = bucket.maxTasks && bucket.tasks.length >= bucket.maxTasks;

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return;

    try {
      onAddTask(
        bucket.id,
        newTaskTitle.trim(),
        newTaskDescription.trim() || undefined,
        newTaskDeadline ? new Date(newTaskDeadline) : undefined,
        newTaskTimeEstimate ? parseInt(newTaskTimeEstimate) : undefined
      );
      setNewTaskTitle("");
      setNewTaskDescription("");
      setNewTaskDeadline("");
      setNewTaskTimeEstimate("");
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
      setNewTaskDeadline("");
      setNewTaskTimeEstimate("");
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
          <Card className="border-dashed bg-muted/30 px-4 py-4">
            <div className="space-y-4">
              <Input
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter task title..."
                className="h-9 font-medium border-none bg-transparent p-0 shadow-none focus-visible:ring-0"
                autoFocus
              />
              <Textarea
                value={newTaskDescription}
                onChange={(e) => setNewTaskDescription(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Add description (optional)..."
                className="min-h-[60px] text-sm border-none bg-transparent p-0 shadow-none focus-visible:ring-0 resize-none"
                rows={2}
              />
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">
                    Deadline
                  </Label>
                  <Input
                    type="date"
                    value={newTaskDeadline}
                    onChange={(e) => setNewTaskDeadline(e.target.value)}
                    className="h-8"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">
                    Time (minutes)
                  </Label>
                  <Input
                    type="number"
                    value={newTaskTimeEstimate}
                    onChange={(e) => setNewTaskTimeEstimate(e.target.value)}
                    placeholder="30"
                    min="5"
                    step="5"
                    className="h-8"
                  />
                </div>
              </div>
              <div className="flex gap-2 pt-1">
                <Button
                  size="sm"
                  onClick={handleAddTask}
                  className="h-8 px-3 text-xs"
                >
                  Add Task
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setNewTaskTitle("");
                    setNewTaskDescription("");
                    setNewTaskDeadline("");
                    setNewTaskTimeEstimate("");
                    setIsAddingTask(false);
                  }}
                  className="h-8 px-3 text-xs"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        ) : canAddTask ? (
          <Button
            variant="outline"
            onClick={() => setIsAddingTask(true)}
            className="w-full h-12 border-2 border-dashed border-muted-foreground/25 bg-transparent hover:border-muted-foreground/50 hover:bg-muted/50 transition-all duration-200 text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add task
          </Button>
        ) : (
          <div className="text-center py-4 text-xs text-muted-foreground">
            Bucket limit reached
          </div>
        )}
      </CardContent>
    </Card>
  );
};
