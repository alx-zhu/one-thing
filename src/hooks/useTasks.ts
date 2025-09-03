// src/hooks/useTasks.ts
import { useState, useCallback } from "react";
import type { Task, TaskBucket, BucketType, AppState } from "@/types/task";

const initialBuckets: TaskBucket[] = [
  {
    id: "when-available",
    title: "When Available",
    description: "Tasks to do when you have extra time",
    tasks: [],
  },
  {
    id: "important",
    title: "Important",
    description: "High-impact tasks that move you forward",
    maxTasks: 5,
    tasks: [],
  },
  {
    id: "time-sensitive",
    title: "Time Sensitive",
    description: "Urgent tasks that must be done today",
    maxTasks: 3,
    tasks: [],
  },
];

export const useTasks = () => {
  const [appState, setAppState] = useState<AppState>({
    buckets: initialBuckets,
    oneThingTaskId: null,
    selectedDate: new Date(),
  });

  const generateId = () =>
    `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const addTask = useCallback(
    (
      bucketId: BucketType,
      title: string,
      description?: string,
      deadline?: Date,
      timeEstimate?: number
    ) => {
      const bucket = appState.buckets.find((b) => b.id === bucketId);
      if (bucket?.maxTasks && bucket.tasks.length >= bucket.maxTasks) {
        throw new Error(
          `Cannot add more than ${bucket.maxTasks} tasks to ${bucket.title}`
        );
      }

      const newTask: Task = {
        id: generateId(),
        title,
        description,
        deadline,
        timeEstimate,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      setAppState((prev) => ({
        ...prev,
        buckets: prev.buckets.map((bucket) =>
          bucket.id === bucketId
            ? { ...bucket, tasks: [...bucket.tasks, newTask] }
            : bucket
        ),
      }));

      return newTask;
    },
    [appState.buckets]
  );

  const editTask = useCallback(
    (
      taskId: string,
      updates: Partial<
        Pick<Task, "title" | "description" | "deadline" | "timeEstimate">
      >
    ) => {
      setAppState((prev) => ({
        ...prev,
        buckets: prev.buckets.map((bucket) => ({
          ...bucket,
          tasks: bucket.tasks.map((task) =>
            task.id === taskId
              ? { ...task, ...updates, updatedAt: new Date() }
              : task
          ),
        })),
      }));
    },
    []
  );

  const deleteTask = useCallback((taskId: string) => {
    setAppState((prev) => ({
      ...prev,
      buckets: prev.buckets.map((bucket) => ({
        ...bucket,
        tasks: bucket.tasks.filter((task) => task.id !== taskId),
      })),
      oneThingTaskId:
        prev.oneThingTaskId === taskId ? null : prev.oneThingTaskId,
    }));
  }, []);

  const moveTask = useCallback(
    (taskId: string, fromBucket: BucketType, toBucket: BucketType) => {
      if (fromBucket === toBucket) return;

      const targetBucket = appState.buckets.find((b) => b.id === toBucket);
      if (
        targetBucket?.maxTasks &&
        targetBucket.tasks.length >= targetBucket.maxTasks
      ) {
        throw new Error(
          `Cannot add more than ${targetBucket.maxTasks} tasks to ${targetBucket.title}`
        );
      }

      setAppState((prev) => {
        const taskToMove = prev.buckets
          .find((b) => b.id === fromBucket)
          ?.tasks.find((t) => t.id === taskId);

        if (!taskToMove) return prev;

        return {
          ...prev,
          buckets: prev.buckets.map((bucket) => {
            if (bucket.id === fromBucket) {
              return {
                ...bucket,
                tasks: bucket.tasks.filter((t) => t.id !== taskId),
              };
            }
            if (bucket.id === toBucket) {
              return { ...bucket, tasks: [...bucket.tasks, taskToMove] };
            }
            return bucket;
          }),
        };
      });
    },
    [appState.buckets]
  );

  const setOneThing = useCallback((taskId: string | null) => {
    setAppState((prev) => ({
      ...prev,
      oneThingTaskId: taskId,
    }));
  }, []);

  const getTaskById = useCallback(
    (taskId: string): Task | null => {
      for (const bucket of appState.buckets) {
        const task = bucket.tasks.find((t) => t.id === taskId);
        if (task) return task;
      }
      return null;
    },
    [appState.buckets]
  );

  const getBucketByTaskId = useCallback(
    (taskId: string): BucketType | null => {
      for (const bucket of appState.buckets) {
        if (bucket.tasks.find((t) => t.id === taskId)) return bucket.id;
      }
      return null;
    },
    [appState.buckets]
  );

  return {
    buckets: appState.buckets,
    oneThingTaskId: appState.oneThingTaskId,
    selectedDate: appState.selectedDate,
    addTask,
    editTask,
    deleteTask,
    moveTask,
    setOneThing,
    getTaskById,
    getBucketByTaskId,
  };
};
