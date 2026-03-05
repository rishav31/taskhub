'use client';

import React from 'react';
import { Task, Project } from '@/types';
import TaskCard from './TaskCard';

interface TaskListProps {
  tasks: Task[];
  projects: Project[];
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onDeleteTask: (id: string) => void;
}

export default function TaskList({
  tasks,
  projects,
  onUpdateTask,
  onDeleteTask,
}: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No tasks found. Create one to get started!</p>
      </div>
    );
  }

  // Sort tasks by status (blockers first) and priority
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  const statusOrder = { 'blocker': 0, 'todo': 1, 'in-progress': 2, 'done': 3 };

  const sortedTasks = [...tasks].sort((a, b) => {
    if (statusOrder[a.status] !== statusOrder[b.status]) {
      return statusOrder[a.status] - statusOrder[b.status];
    }
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  return (
    <div className="space-y-4">
      {sortedTasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          projects={projects}
          onUpdate={onUpdateTask}
          onDelete={onDeleteTask}
        />
      ))}
    </div>
  );
}
