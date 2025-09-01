// src/components/TaskItem.tsx
import { useState } from "react";
import type { Task, BucketType } from "@/types/task";
import { Card } from "@/components/ui/card";
import { Star, Edit3, Trash2, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";

interface TaskItemProps {
  task: Task;
  bucketId: BucketType;
  isOneThing: boolean;
  isDragging?: boolean;
  onEdit: (
    taskId: string,
    updates: Partial<Pick<Task, "title" | "description">>
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

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    onEdit(task.id, {
      title: editTitle.trim(),
      description: editDescription.trim() || undefined,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(task.title);
    setEditDescription(task.description || "");
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

  return (
    <Card
      className={cn(
        "group relative cursor-move transition-all duration-200 hover:shadow-md",
        isOneThing && "ring-2 ring-amber-400 bg-amber-50 dark:bg-amber-950/20",
        isDragging && "opacity-50 scale-95",
        "px-4 py-3"
      )}
      draggable
      onDragStart={(e) => onDragStart(e, task, bucketId)}
      onDragEnd={onDragEnd}
    >
      <div className="flex items-start gap-3">
        <GripVertical className="h-4 w-4 text-muted-foreground/50 mt-0.5 group-hover:text-muted-foreground transition-colors" />

        <div className="flex-1 space-y-1">
          {isEditing ? (
            <div className="space-y-2">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={handleSave}
                className="w-full px-2 py-1 text-sm font-medium bg-transparent border border-input rounded focus:outline-none focus:ring-1 focus:ring-ring"
                autoFocus
              />
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={handleSave}
                placeholder="Add description..."
                className="w-full px-2 py-1 text-xs text-muted-foreground bg-transparent border border-input rounded resize-none focus:outline-none focus:ring-1 focus:ring-ring"
                rows={2}
              />
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
            </>
          )}
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleToggleOneThing}
            className={cn(
              "p-1 rounded hover:bg-muted transition-colors",
              isOneThing
                ? "text-amber-600"
                : "text-muted-foreground hover:text-foreground"
            )}
            title={isOneThing ? "Remove as ONE Thing" : "Set as ONE Thing"}
          >
            <Star className={cn("h-3 w-3", isOneThing && "fill-current")} />
          </button>
          <button
            onClick={handleEdit}
            className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            title="Edit task"
          >
            <Edit3 className="h-3 w-3" />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="p-1 rounded text-muted-foreground hover:text-destructive hover:bg-muted transition-colors"
            title="Delete task"
          >
            <Trash2 className="h-3 w-3" />
          </button>
        </div>
      </div>
    </Card>
  );
};
