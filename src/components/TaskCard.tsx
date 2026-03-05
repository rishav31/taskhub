'use client';

import React, { useState } from 'react';
import { Task, Project } from '@/types';
import { formatDistanceToNow } from 'date-fns';

interface TaskCardProps {
  task: Task;
  projects: Project[];
  onUpdate: (id: string, updates: Partial<Task>) => void;
  onDelete: (id: string) => void;
}

export default function TaskCard({ task, projects, onUpdate, onDelete }: TaskCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const project = projects.find((p) => p.id === task.project);
  const priorityColors = {
    low: 'bg-blue-100 text-blue-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800',
  };

  const statusColors = {
    todo: 'bg-gray-100 text-gray-800',
    'in-progress': 'bg-purple-100 text-purple-800',
    blocker: 'bg-red-100 text-red-800 font-semibold',
    done: 'bg-green-100 text-green-800',
  };

  const statusLabels = {
    todo: 'To Do',
    'in-progress': 'In Progress',
    blocker: '⚠️ Blocker',
    done: 'Done',
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
            <p className="text-sm text-gray-600 mt-1">{task.description}</p>
          </div>
          <button
            onClick={() => onDelete(task.id)}
            className="text-red-600 hover:text-red-800 font-medium text-sm ml-4"
          >
            Delete
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mb-3">
          {project && (
            <span className={`px-2 py-1 text-xs font-medium rounded bg-${project.color}-100 text-${project.color}-800`}>
              {project.name}
            </span>
          )}
          <span className={`px-2 py-1 text-xs font-medium rounded ${priorityColors[task.priority]}`}>
            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
          </span>
          <span className={`px-2 py-1 text-xs font-medium rounded ${statusColors[task.status]}`}>
            {statusLabels[task.status]}
          </span>
        </div>

        {task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {task.tags.map((tag) => (
              <span key={tag} className="px-2 py-1 text-xs bg-gray-200 text-gray-800 rounded">
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex justify-between items-center text-sm text-gray-600 mb-3">
          <span>
            {task.dueDate
              ? `Due ${formatDistanceToNow(new Date(task.dueDate), { addSuffix: true })}`
              : 'No due date'}
          </span>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            {isExpanded ? 'Less' : 'More'}
          </button>
        </div>

        {isExpanded && (
          <div className="border-t border-gray-200 pt-3 mt-3 space-y-3">
            {task.links.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Links</h4>
                <div className="space-y-1">
                  {task.links.map((link, idx) => (
                    <a
                      key={idx}
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm break-all"
                    >
                      {link}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {task.notes && (
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Notes</h4>
                <p className="text-sm text-gray-700">{task.notes}</p>
              </div>
            )}

            <div className="flex gap-2 pt-3 border-t border-gray-200">
              <select
                value={task.status}
                onChange={(e) =>
                  onUpdate(task.id, { status: e.target.value as Task['status'] })
                }
                className="px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="blocker">Blocker</option>
                <option value="done">Done</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
