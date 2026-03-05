'use client';

import React from 'react';
import { Project } from '@/types';

interface ProjectFilterProps {
  projects: Project[];
  selectedProject: string;
  onSelectProject: (projectId: string) => void;
}

const colorClasses: { [key: string]: string } = {
  gray: 'text-gray-600 hover:text-gray-900',
  blue: 'text-blue-600 hover:text-blue-900',
  green: 'text-green-600 hover:text-green-900',
  purple: 'text-purple-600 hover:text-purple-900',
  orange: 'text-orange-600 hover:text-orange-900',
  red: 'text-red-600 hover:text-red-900',
};

export default function ProjectFilter({
  projects,
  selectedProject,
  onSelectProject,
}: ProjectFilterProps) {
  return (
    <div className="space-y-2">
      {projects.map((project) => (
        <button
          key={project.id}
          onClick={() => onSelectProject(project.id)}
          className={`block w-full text-left px-3 py-2 rounded-md font-medium text-sm transition-colors ${
            selectedProject === project.id
              ? 'bg-blue-100 text-blue-900'
              : colorClasses[project.color] || 'text-gray-600 hover:text-gray-900'
          }`}
        >
          {project.name}
        </button>
      ))}
    </div>
  );
}
