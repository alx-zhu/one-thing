// src/components/OneThingDisplay.tsx
import { useState } from "react";
import type { Task } from "@/types/task";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Star, Target, Calendar, Clock, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  formatDate,
  formatTimeEstimate,
  getDeadlineStatus,
  getDeadlineColor,
} from "@/lib/dateUtils";
import { Button } from "./ui/button";

interface OneThingDisplayProps {
  oneThingTask: Task | null;
  className?: string;
  draggedTask: Task | null;
  onSetOneThing: (taskId: string | null) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
}

export const OneThingDisplay = ({
  oneThingTask,
  className,
  draggedTask,
  onSetOneThing,
  onDragOver,
  onDrop,
}: OneThingDisplayProps) => {
  const deadlineStatus = oneThingTask?.deadline
    ? getDeadlineStatus(oneThingTask.deadline)
    : null;
  const deadlineColor = deadlineStatus ? getDeadlineColor(deadlineStatus) : "";

  const [isDropTarget, setIsDropTarget] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    onDragOver(e);
    setIsDropTarget(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    // Only set to false if we're leaving the component entirely
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDropTarget(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    onDrop(e);
    setIsDropTarget(false);
  };

  return (
    <Card
      className={cn(
        "border-2 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 transition-all duration-200",
        isDropTarget
          ? "border-amber-400 ring-2 ring-amber-400/50 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 scale-[1.02]"
          : "border-amber-200 dark:border-amber-800",
        draggedTask && "border-dashed border-amber-300 dark:border-amber-700",
        className
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
          <Target className="h-5 w-5" />
          My ONE Thing Today
        </CardTitle>
      </CardHeader>
      <CardContent>
        {oneThingTask ? (
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="space-y-2 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-semibold text-lg text-foreground leading-tight">
                    {oneThingTask.title}
                  </h3>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => onSetOneThing(null)}
                    className={cn(
                      "h-6 w-6 text-amber-600 hover:text-amber-700"
                    )}
                    title="Clear ONE Thing"
                  >
                    <Star className="h-4 w-4 fill-current" />
                  </Button>
                </div>
                {oneThingTask.description && (
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {oneThingTask.description}
                  </p>
                )}
                <div className="flex items-center gap-2 flex-wrap">
                  {oneThingTask.deadline && (
                    <div
                      className={cn(
                        "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border",
                        deadlineColor
                      )}
                    >
                      <Calendar className="h-3 w-3" />
                      {formatDate(oneThingTask.deadline)}
                    </div>
                  )}
                  {oneThingTask.timeEstimate && (
                    <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200">
                      <Clock className="h-3 w-3" />
                      {formatTimeEstimate(oneThingTask.timeEstimate)}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="pt-3 border-t border-amber-200 dark:border-amber-800">
              <p className="text-xs text-amber-700 dark:text-amber-300 font-medium">
                "What's the ONE thing I can do such that by doing it everything
                else will be easier or unnecessary?"
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 space-y-4">
            {draggedTask ? (
              <div className="space-y-3">
                <div className="flex items-center justify-center">
                  <Sparkles className="h-8 w-8 text-amber-500 animate-pulse" />
                </div>
                <div className="space-y-1">
                  <p className="text-foreground font-medium">
                    Drop "{draggedTask.title}" here
                  </p>
                  <p className="text-xs text-amber-700 dark:text-amber-300">
                    Make this your ONE thing for today
                  </p>
                </div>
              </div>
            ) : (
              <>
                <Target className="h-12 w-12 text-amber-400 mx-auto opacity-50" />
                <div className="space-y-1">
                  <p className="text-muted-foreground text-sm">
                    Select your ONE thing for today
                  </p>
                  <p className="text-xs text-amber-700 dark:text-amber-300">
                    Click the star icon or drag any task here
                  </p>
                </div>
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
