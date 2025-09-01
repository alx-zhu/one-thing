// src/components/TaskItem.tsx
import { useState } from "react";
import type { Task, BucketType } from "@/types/task";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Star,
  Edit3,
  Trash2,
  GripVertical,
  Calendar,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  formatDate,
  formatTimeEstimate,
  getDeadlineStatus,
  getDeadlineColor,
} from "@/lib/dateUtils";

interface TaskItemProps {
  task: Task;
  bucketId: BucketType;
  isOneThing: boolean;
  isDragging?: boolean;
  onEdit: (
    taskId: string,
    updates: Partial<
      Pick<Task, "title" | "description" | "deadline" | "timeEstimate">
    >
  ) => void;
  onDelete: (taskId: string) => void;
  onSetOneThing: (taskId: string | null) => void;
  onDragStart: (e: React.DragEvent, task: Task, bucketId: BucketType) => void;
  onDragEnd: () => void;
}

export const TaskItem = ({
  task,
  bucketId,
  isOneThing,
  isDragging = false,
  onEdit,
  onDelete,
  onSetOneThing,
  onDragStart,
  onDragEnd,
}: TaskItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(
    task.description || ""
  );
  const [editDeadline, setEditDeadline] = useState(
    task.deadline ? task.deadline.toISOString().split("T")[0] : ""
  );
  const [editTimeEstimate, setEditTimeEstimate] = useState(
    task.timeEstimate?.toString() || ""
  );

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    const updates: Partial<
      Pick<Task, "title" | "description" | "deadline" | "timeEstimate">
    > = {
      title: editTitle.trim(),
      description: editDescription.trim() || undefined,
      deadline: editDeadline ? new Date(editDeadline) : undefined,
      timeEstimate: editTimeEstimate ? parseInt(editTimeEstimate) : undefined,
    };

    onEdit(task.id, updates);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(task.title);
    setEditDescription(task.description || "");
    setEditDeadline(
      task.deadline ? task.deadline.toISOString().split("T")[0] : ""
    );
    setEditTimeEstimate(task.timeEstimate?.toString() || "");
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  const handleToggleOneThing = () => {
    onSetOneThing(isOneThing ? null : task.id);
  };

  const deadlineStatus = task.deadline
    ? getDeadlineStatus(task.deadline)
    : null;
  const deadlineColor = deadlineStatus ? getDeadlineColor(deadlineStatus) : "";

  return (
    <Card
      className={cn(
        "group relative cursor-move transition-all duration-200 hover:shadow-md overflow-visible",
        isOneThing && "ring-2 ring-amber-400 bg-amber-50 dark:bg-amber-950/20",
        isDragging && "opacity-50 scale-95",
        isEditing && "z-10",
        "px-4 py-3"
      )}
      draggable={!isEditing}
      onDragStart={(e) => onDragStart(e, task, bucketId)}
      onDragEnd={onDragEnd}
    >
      <div className="flex items-start gap-3">
        <GripVertical className="h-4 w-4 text-muted-foreground/50 mt-0.5 group-hover:text-muted-foreground transition-colors" />

        <div className="flex-1 space-y-2">
          {isEditing ? (
            <div className="space-y-3">
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onKeyDown={handleKeyDown}
                className="h-8 text-sm font-medium"
                autoFocus
              />
              <Textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Add description..."
                className="min-h-[60px] text-xs resize-none"
                rows={2}
              />
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">
                    Deadline
                  </Label>
                  <Input
                    type="date"
                    value={editDeadline}
                    onChange={(e) => setEditDeadline(e.target.value)}
                    className="h-8 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">
                    Time (minutes)
                  </Label>
                  <Input
                    type="number"
                    value={editTimeEstimate}
                    onChange={(e) => setEditTimeEstimate(e.target.value)}
                    placeholder="30"
                    min="5"
                    step="5"
                    className="h-8 text-xs"
                  />
                </div>
              </div>
              <div className="flex gap-2 pt-1">
                <Button
                  size="sm"
                  onClick={handleSave}
                  className="h-7 px-3 text-xs"
                >
                  Save
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleCancel}
                  className="h-7 px-3 text-xs"
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-medium leading-none">
                  {task.title}
                </h3>
                {isOneThing && (
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                )}
              </div>
              {task.description && (
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {task.description}
                </p>
              )}
              <div className="flex items-center gap-2 flex-wrap">
                {task.deadline && (
                  <div
                    className={cn(
                      "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border",
                      deadlineColor
                    )}
                  >
                    <Calendar className="h-3 w-3" />
                    {formatDate(task.deadline)}
                  </div>
                )}
                {task.timeEstimate && (
                  <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                    <Clock className="h-3 w-3" />
                    {formatTimeEstimate(task.timeEstimate)}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="icon"
            variant="ghost"
            onClick={handleToggleOneThing}
            className={cn(
              "h-6 w-6",
              isOneThing
                ? "text-amber-600 hover:text-amber-700"
                : "text-muted-foreground hover:text-foreground"
            )}
            title={isOneThing ? "Remove as ONE Thing" : "Set as ONE Thing"}
          >
            <Star className={cn("h-3 w-3", isOneThing && "fill-current")} />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={handleEdit}
            className="h-6 w-6 text-muted-foreground hover:text-foreground"
            title="Edit task"
          >
            <Edit3 className="h-3 w-3" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => onDelete(task.id)}
            className="h-6 w-6 text-muted-foreground hover:text-destructive"
            title="Delete task"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
