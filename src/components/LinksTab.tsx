'use client';

import React from 'react';
import { Task } from '@/types';

interface LinksTabProps {
  tasks: Task[];
}

export default function LinksTab({ tasks }: LinksTabProps) {
  // Collect all unique links from all tasks
  const allLinks: Array<{ url: string; taskId: string; taskTitle: string; project: string }> = [];
  const seenUrls = new Set<string>();

  tasks.forEach((task) => {
    task.links.forEach((link) => {
      if (!seenUrls.has(link)) {
        seenUrls.add(link);
        allLinks.push({
          url: link,
          taskId: task.id,
          taskTitle: task.title,
          project: task.project,
        });
      }
    });
  });

  if (allLinks.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No links found. Add descriptions or notes with URLs to your tasks!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold text-gray-900">All Links</h2>
      <div className="space-y-2">
        {allLinks.map((link) => (
          <div key={link.url} className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <div className="flex items-start justify-between mb-2">
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 font-medium break-all flex-1"
              >
                {link.url}
              </a>
              <button
                onClick={() => navigator.clipboard.writeText(link.url)}
                className="ml-2 text-sm text-gray-600 hover:text-gray-900"
              >
                Copy
              </button>
            </div>
            <div className="text-sm text-gray-600">
              <p>From task: <span className="font-medium">{link.taskTitle}</span></p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
