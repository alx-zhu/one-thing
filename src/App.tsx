// src/App.tsx
import "./App.css";
import { useTasks } from "@/hooks/useTasks";
import { useDragDrop } from "@/hooks/useDragDrop";
import { TaskBucket } from "@/components/TaskBucket";
import { OneThingDisplay } from "@/components/OneThingDisplay";
import { Sparkles } from "lucide-react";
import type { BucketType } from "./types/task";

function App() {
  const {
    buckets,
    oneThingTaskId,
    fetchBucketTasks,
    addTask,
    editTask,
    deleteTask,
    moveTask,
    setOneThing,
    getTaskById,
  } = useTasks();

  const {
    draggedTask,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDrop,
  } = useDragDrop();

  const oneThingTask = oneThingTaskId ? getTaskById(oneThingTaskId) : null;

  const handleMove = (taskId: string, from: string, to: string) => {
    moveTask(taskId, from as BucketType, to as BucketType);
  };

  const handleDropOneThing = (e: React.DragEvent) => {
    e.preventDefault();

    if (draggedTask) {
      setOneThing(draggedTask.id);
    }

    handleDragEnd();
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-8 w-8 text-amber-500" />
            <h1 className="text-3xl font-bold tracking-tight">The ONE Thing</h1>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Focus on what matters most. Organize your tasks, choose your ONE
            thing, and make meaningful progress every day.
          </p>
        </div>

        {/* ONE Thing Display */}
        <OneThingDisplay
          oneThingTask={oneThingTask}
          className="max-w-2xl mx-auto"
          draggedTask={draggedTask}
          onDragOver={handleDragOver}
          onDrop={handleDropOneThing}
          onSetOneThing={setOneThing}
        />

        {/* Task Buckets */}
        <div className="space-y-8">
          {buckets.map((bucket) => (
            <TaskBucket
              key={bucket.id}
              bucket={bucket}
              tasks={fetchBucketTasks(bucket.id)}
              oneThingTaskId={oneThingTaskId}
              draggedTask={draggedTask}
              onAddTask={addTask}
              onEditTask={editTask}
              onDeleteTask={deleteTask}
              onSetOneThing={setOneThing}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onDragOver={handleDragOver}
              onDrop={(e, targetBucket) =>
                handleDrop(e, targetBucket, handleMove)
              }
            />
          ))}
        </div>

        {/* Footer */}
        <footer className="text-center pt-8 border-t">
          <p className="text-xs text-muted-foreground">
            What's the ONE thing I can do such that by doing it everything else
            will be easier or unnecessary?"
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
