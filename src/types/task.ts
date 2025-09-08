// src/types/task.ts
export type taskId = string;

export type EditTaskType = Partial<
  Omit<Task, "id" | "createdAt" | "updatedAt">
>;

export type AddTaskType = Omit<
  Task,
  "id" | "createdAt" | "updatedAt" | "isCompleted"
>;

export interface Task {
  id: taskId;
  title: string;
  steps: TaskStep[];
  bucketId: BucketType;
  createdAt: Date;
  updatedAt: Date;
  description?: string;
  deadline?: Date;
  timeEstimate?: number;
  isCompleted?: boolean;
}

export interface TaskStep {
  id: number;
  taskId: taskId;
  description: string;
  isCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type BucketType = "time-sensitive" | "important" | "when-available";

export interface TaskBucket {
  id: BucketType;
  title: string;
  description: string;
  maxTasks?: number;
}

export interface AppState {
  tasks: Task[];
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
