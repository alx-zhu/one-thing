// src/components/TaskBucket.tsx
import { useMemo, useState } from "react";
import type {
  TaskBucket as TaskBucketType,
  Task,
  BucketType,
  EditTaskType,
  AddTaskType,
} from "@/types/task";
import { TaskItem } from "./TaskItem";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface TaskBucketProps {
  bucket: TaskBucketType;
  tasks: Task[];
  oneThingTaskId: string | null;
  draggedTask: Task | null;
  onAddTask: (task: AddTaskType) => void;
  onEditTask: (taskId: string, updates: EditTaskType) => void;
  onDeleteTask: (taskId: string) => void;
  onSetOneThing: (taskId: string | null) => void;
  onDragStart: (e: React.DragEvent, task: Task, bucketId: BucketType) => void;
  onDragEnd: () => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, targetBucket: BucketType) => void;
}

export const TaskBucket = ({
  bucket,
  tasks,
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

  const canAddTask = !bucket.maxTasks || tasks.length < bucket.maxTasks;

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return;

    if (!canAddTask) {
      return;
    }

    try {
      onAddTask({
        bucketId: bucket.id,
        title: newTaskTitle.trim(),
        description: newTaskDescription.trim() || undefined,
        deadline: newTaskDeadline ? new Date(newTaskDeadline) : undefined,
        timeEstimate: newTaskTimeEstimate
          ? parseInt(newTaskTimeEstimate)
          : undefined,
        steps: [],
      });
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
    if (!canAddTask) {
      return;
    }
    onDrop(e, bucket.id);
    setIsDropTarget(false);
  };

  // Prioritize deadlines, then creation date by oldest first.
  const sortedTasks = useMemo(() => {
    return tasks.sort((a, b) => {
      if (a.deadline && b.deadline) {
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      }
      if (a.deadline) return -1;
      if (b.deadline) return 1;
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });
  }, [tasks]);

  return (
    <div
      className={cn(
        "space-y-3 transition-all duration-200",
        isDropTarget && "scale-[1.01]"
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wide">
            {bucket.title}
          </h3>
          {bucket.maxTasks && (
            <span
              className={cn(
                "text-xs px-2 py-1 rounded-full font-medium",
                !canAddTask
                  ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                  : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
              )}
            >
              {tasks.length}/{bucket.maxTasks}
            </span>
          )}
          {!canAddTask && (
            <>
              <AlertCircle className="h-3 w-3 text-red-500" />
              <span className="text-center text-xs text-muted-foreground bg-transparent">
                Bucket limit reached
              </span>
            </>
          )}
        </div>
        {canAddTask && (
          <Button
            size="sm"
            variant="ghost"
            className="text-xs opacity-60 hover:opacity-100"
            onClick={() => setIsAddingTask(true)}
          >
            <Plus className="h-3 w-3 mr-1" />
            Add
          </Button>
        )}
      </div>

      {/* Tasks Section */}
      <div className="space-y-2">
        {/* Add Task Form */}
        {isAddingTask && (
          <Card className="p-4 space-y-3 border-dashed">
            <Input
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter task title..."
              autoFocus
            />
            <Textarea
              value={newTaskDescription}
              onChange={(e) => setNewTaskDescription(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Description (optional)..."
              rows={2}
            />
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-muted-foreground">
                  Deadline
                </Label>
                <Input
                  type="date"
                  value={newTaskDeadline}
                  onChange={(e) => setNewTaskDeadline(e.target.value)}
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">
                  Time (minutes)
                </Label>
                <Input
                  type="number"
                  value={newTaskTimeEstimate}
                  onChange={(e) => setNewTaskTimeEstimate(e.target.value)}
                  placeholder="(e.g., 30)"
                  min="5"
                  step="5"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={handleAddTask}>
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
              >
                Cancel
              </Button>
            </div>
          </Card>
        )}

        {/* Task Items */}
        {sortedTasks.map((task) => (
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

        {/* Empty State */}
        {tasks.length === 0 && !isAddingTask && (
          <div className="text-center py-6 text-gray-400 dark:text-gray-600 text-xs border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
            No {bucket.title.toLowerCase()} tasks.
          </div>
        )}
      </div>
    </div>
  );
};
