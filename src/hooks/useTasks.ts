// src/hooks/useTasks.ts
import { useState, useCallback } from "react";
import type { Task, TaskBucket, BucketType, AppState } from "@/types/task";
import { initialBuckets, initialTasks } from "@/lib/constants";

export const useTasks = () => {
  const [appState, setAppState] = useState<AppState>({
    buckets: initialBuckets,
    oneThingTaskId: null,
    selectedDate: new Date(),
    tasks: initialTasks,
  });

  const fetchTasks = useCallback((): Task[] => {
    return appState.tasks;
  }, [appState.tasks]);

  const fetchBuckets = useCallback((): TaskBucket[] => {
    return appState.buckets;
  }, [appState.buckets]);

  const fetchBucketTasks = useCallback(
    (bucketId: BucketType): Task[] => {
      return appState.tasks.filter((task) => task.bucketId === bucketId);
    },
    [appState.tasks]
  );

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
      if (!bucket) {
        throw new Error("Invalid bucket");
      }

      const newTask: Task = {
        id: generateId(),
        title,
        description,
        deadline,
        timeEstimate,
        bucketId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      setAppState((prev) => ({
        ...prev,
        tasks: [...prev.tasks, newTask],
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
        tasks: prev.tasks.map((task) =>
          task.id === taskId
            ? { ...task, ...updates, updatedAt: new Date() }
            : task
        ),
      }));
    },
    []
  );

  const deleteTask = useCallback((taskId: string) => {
    setAppState((prev) => ({
      ...prev,
      tasks: prev.tasks.filter((task) => task.id !== taskId),
      oneThingTaskId:
        prev.oneThingTaskId === taskId ? null : prev.oneThingTaskId,
    }));
  }, []);

  const moveTask = useCallback(
    (taskId: string, fromBucket: BucketType, toBucket: BucketType) => {
      if (fromBucket === toBucket) return;

      const targetBucket = appState.buckets.find((b) => b.id === toBucket);
      if (!targetBucket) return;

      // Error handling will be delegated to the actual buckets
      setAppState((prev) => {
        const taskToMove = prev.tasks.find((t) => t.id === taskId);

        if (!taskToMove) return prev;

        return {
          ...prev,
          tasks: prev.tasks.map((task) =>
            task.id === taskId
              ? { ...task, updatedAt: new Date(), bucketId: toBucket }
              : task
          ),
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
      return appState.tasks.find((t) => t.id === taskId) || null;
    },
    [appState.tasks]
  );

  const getTaskBucketId = useCallback(
    (taskId: string): BucketType | undefined => {
      const task = appState.tasks.find((t) => t.id === taskId);
      return task ? task.bucketId : undefined;
    },
    [appState.tasks]
  );

  return {
    buckets: appState.buckets,
    oneThingTaskId: appState.oneThingTaskId,
    selectedDate: appState.selectedDate,
    fetchTasks,
    fetchBuckets,
    fetchBucketTasks,
    addTask,
    editTask,
    deleteTask,
    moveTask,
    setOneThing,
    getTaskById,
    getTaskBucketId,
  };
};
