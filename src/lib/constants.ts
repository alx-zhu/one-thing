import type { Task, TaskBucket } from "@/types/task";

export const sampleTasks: Task[] = [
  // Time Sensitive (3 tasks)
  {
    id: "task-1",
    title: "Submit tax documents",
    description: "Deadline is today - gather W2s and receipts",
    deadline: new Date(), // Today
    timeEstimate: 120,
    bucketId: "time-sensitive",
    createdAt: new Date("2025-01-01"),
    updatedAt: new Date("2025-01-01"),
    isCompleted: false,
    steps: [
      {
        id: 1,
        taskId: "task-1",
        description: "Gather W2 forms",
        isCompleted: true,
        createdAt: new Date("2025-01-01"),
        updatedAt: new Date("2025-01-01"),
      },
      {
        id: 2,
        taskId: "task-1",
        description: "Collect receipts",
        isCompleted: false,
        createdAt: new Date("2025-01-01"),
        updatedAt: new Date("2025-01-01"),
      },
      {
        id: 3,
        taskId: "task-1",
        description: "Fill out tax forms",
        isCompleted: false,
        createdAt: new Date("2025-01-01"),
        updatedAt: new Date("2025-01-01"),
      },
    ],
  },
  {
    id: "task-2",
    title: "Call dentist for emergency appointment",
    description: "Tooth pain getting worse, need same-day appointment",
    deadline: new Date(),
    timeEstimate: 15,
    bucketId: "time-sensitive",
    createdAt: new Date("2025-01-02"),
    updatedAt: new Date("2025-01-02"),
    steps: [],
  },
  {
    id: "task-3",
    title: "Pick up prescription before pharmacy closes",
    description: "Medication runs out tomorrow, pharmacy closes at 6pm",
    deadline: new Date(),
    timeEstimate: 30,
    bucketId: "time-sensitive",
    createdAt: new Date("2025-01-03"),
    updatedAt: new Date("2025-01-03"),
    steps: [],
  },

  // Important (3 tasks)
  {
    id: "task-4",
    title: "Prepare quarterly business review presentation",
    description: "Key metrics and strategy updates for leadership team",
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Next week
    timeEstimate: 180,
    bucketId: "important",
    createdAt: new Date("2025-01-04"),
    updatedAt: new Date("2025-01-04"),
    steps: [
      {
        id: 4,
        taskId: "task-4",
        description: "Compile key metrics",
        isCompleted: true,
        createdAt: new Date("2025-01-04"),
        updatedAt: new Date("2025-01-04"),
      },
      {
        id: 5,
        taskId: "task-4",
        description: "Draft strategy updates",
        isCompleted: false,
        createdAt: new Date("2025-01-04"),
        updatedAt: new Date("2025-01-04"),
      },
      {
        id: 6,
        taskId: "task-4",
        description: "Create presentation slides",
        isCompleted: false,
        createdAt: new Date("2025-01-04"),
        updatedAt: new Date("2025-01-04"),
      },
    ],
  },
  {
    id: "task-5",
    title: "Interview senior developer candidate",
    description: "Final round interview for critical team position",
    deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
    timeEstimate: 60,
    bucketId: "important",
    createdAt: new Date("2025-01-05"),
    updatedAt: new Date("2025-01-05"),
    steps: [],
  },
  {
    id: "task-6",
    title: "Review and sign contract with new vendor",
    description: "Legal review complete, need final approval and signature",
    deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days
    timeEstimate: 45,
    bucketId: "important",
    createdAt: new Date("2025-01-06"),
    updatedAt: new Date("2025-01-06"),
    steps: [],
  },

  // When Available (2 tasks)
  {
    id: "task-7",
    title: "Organize digital photo library",
    description: "Sort and tag family photos from last year",
    timeEstimate: 90,
    bucketId: "when-available",
    createdAt: new Date("2025-01-07"),
    updatedAt: new Date("2025-01-07"),
    steps: [],
  },
  {
    id: "task-8",
    title: "Read industry white paper on AI trends",
    description: "35-page report on emerging AI applications in our sector",
    timeEstimate: 75,
    bucketId: "when-available",
    createdAt: new Date("2025-01-08"),
    updatedAt: new Date("2025-01-08"),
    steps: [],
  },
  {
    id: "task-9",
    title: "Plan weekend hiking trip",
    description: "Research trails and book campsite for next month",
    timeEstimate: 60,
    bucketId: "when-available",
    createdAt: new Date("2025-01-09"),
    updatedAt: new Date("2025-01-09"),
    steps: [],
  },
  {
    id: "task-10",
    title: "Learn basic Spanish phrases",
    description: "Practice conversational Spanish for upcoming vacation",
    timeEstimate: 45,
    bucketId: "when-available",
    createdAt: new Date("2025-01-10"),
    updatedAt: new Date("2025-01-10"),
    steps: [],
  },
];

export const sampleBuckets: TaskBucket[] = [
  {
    id: "time-sensitive",
    title: "Time Sensitive",
    description: "Urgent tasks that must be done today",
    maxTasks: 3,
  },
  {
    id: "important",
    title: "Important",
    description: "High-impact tasks that move you forward",
    maxTasks: 5,
  },
  {
    id: "when-available",
    title: "When Available",
    description: "Tasks to do when you have extra time",
  },
];
