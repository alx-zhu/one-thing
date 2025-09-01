// src/hooks/useDragDrop.ts
import { useState, useCallback } from "react";
import type { Task, BucketType } from "@/types/task";

export const useDragDrop = () => {
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [sourceBucket, setSourceBucket] = useState<BucketType | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const startDrag = useCallback((task: Task, source: BucketType) => {
    setDraggedTask(task);
    setSourceBucket(source);
    setIsDragging(true);
  }, []);

  const endDrag = useCallback(() => {
    setDraggedTask(null);
    setSourceBucket(null);
    setIsDragging(false);
  }, []);

  const handleDragStart = useCallback(
    (e: React.DragEvent, task: Task, source: BucketType) => {
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", task.id);
      startDrag(task, source);
    },
    [startDrag]
  );

  const handleDragEnd = useCallback(() => {
    endDrag();
  }, [endDrag]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);

  const handleDrop = useCallback(
    (
      e: React.DragEvent,
      targetBucket: BucketType,
      onMove: (taskId: string, from: BucketType, to: BucketType) => void
    ) => {
      e.preventDefault();

      if (draggedTask && sourceBucket && sourceBucket !== targetBucket) {
        try {
          onMove(draggedTask.id, sourceBucket, targetBucket);
        } catch (error) {
          console.warn("Move failed:", error);
          // Could show toast notification here
        }
      }

      endDrag();
    },
    [draggedTask, sourceBucket, endDrag]
  );

  return {
    draggedTask,
    sourceBucket,
    isDragging,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDrop,
  };
};
