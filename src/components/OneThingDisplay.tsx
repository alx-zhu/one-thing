// src/components/OneThingDisplay.tsx
import type { Task } from "@/types/task";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Star, Target, Calendar, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  formatDate,
  formatTimeEstimate,
  getDeadlineStatus,
  getDeadlineColor,
} from "@/lib/dateUtils";

interface OneThingDisplayProps {
  oneThingTask: Task | null;
  className?: string;
}

export const OneThingDisplay = ({
  oneThingTask,
  className,
}: OneThingDisplayProps) => {
  const deadlineStatus = oneThingTask?.deadline
    ? getDeadlineStatus(oneThingTask.deadline)
    : null;
  const deadlineColor = deadlineStatus ? getDeadlineColor(deadlineStatus) : "";

  return (
    <Card
      className={cn(
        "border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 dark:border-amber-800",
        className
      )}
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
              <Star className="h-4 w-4 fill-amber-500 text-amber-500 mt-0.5 flex-shrink-0" />
              <div className="space-y-2">
                <h3 className="font-semibold text-lg text-foreground leading-tight">
                  {oneThingTask.title}
                </h3>
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
          <div className="text-center py-8 space-y-3">
            <Target className="h-12 w-12 text-amber-400 mx-auto opacity-50" />
            <div className="space-y-1">
              <p className="text-muted-foreground text-sm">
                Select your ONE thing for today
              </p>
              <p className="text-xs text-amber-700 dark:text-amber-300">
                Click the star icon next to any task to make it your focus
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
