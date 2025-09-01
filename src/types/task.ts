// src/types/task.ts
export interface Task {
  id: string;
  title: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type BucketType = "time-sensitive" | "important" | "when-available";

export interface TaskBucket {
  id: BucketType;
  title: string;
  description: string;
  maxTasks?: number;
  tasks: Task[];
}

export interface AppState {
  buckets: TaskBucket[];
  oneThingTaskId: string | null;
  selectedDate: Date;
}

export interface DragDropContext {
  draggedTask: Task | null;
  sourceBucket: BucketType | null;
  setDraggedTask: (task: Task | null) => void;
  setSourceBucket: (bucket: BucketType | null) => void;
}
