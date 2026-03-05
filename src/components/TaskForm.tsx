'use client';

import React, { useState } from 'react';
import { Task, Project } from '@/types';
import { detectLinksInTask } from '@/lib/linkDetection';

interface TaskFormProps {
  projects: Project[];
  onAddTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

export default function TaskForm({ projects, onAddTask }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [project, setProject] = useState(projects[0]?.id || '');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [status, setStatus] = useState<'todo' | 'in-progress' | 'done' | 'blocker'>('todo');
  const [tags, setTags] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');
  const [linkInput, setLinkInput] = useState('');
  const [manualLinks, setManualLinks] = useState<string[]>([]);

  const handleAddLink = () => {
    if (!linkInput.trim()) {
      alert('Please enter a valid link');
      return;
    }

    // Validate URL format
    try {
      new URL(linkInput);
      if (!manualLinks.includes(linkInput)) {
        setManualLinks([...manualLinks, linkInput]);
        setLinkInput('');
      } else {
        alert('This link is already added');
      }
    } catch {
      alert('Please enter a valid URL (starting with http:// or https://)');
    }
  };

  const handleRemoveLink = (index: number) => {
    setManualLinks(manualLinks.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      alert('Please enter a task title');
      return;
    }

    // Get auto-detected links
    const autoDetectedLinks = detectLinksInTask(description, notes);
    
    // Combine manual links with auto-detected links (remove duplicates)
    const allLinks = [...new Set([...manualLinks, ...autoDetectedLinks])];

    const newTask: Omit<Task, 'id' | 'createdAt' | 'updatedAt'> = {
      title,
      description,
      project,
      priority,
      status,
      tags: tags.split(',').map((t) => t.trim()).filter((t) => t),
      dueDate: dueDate ? new Date(dueDate) : null,
      links: allLinks,
      notes,
    };

    onAddTask(newTask);

    // Reset form
    setTitle('');
    setDescription('');
    setProject(projects[0]?.id || '');
    setPriority('medium');
    setStatus('todo');
    setTags('');
    setDueDate('');
    setNotes('');
    setLinkInput('');
    setManualLinks([]);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6 space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">Create New Task</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Task title"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Add description (links will be detected automatically)"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Project</label>
          <select
            value={project}
            onChange={(e) => setProject(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as 'todo' | 'in-progress' | 'done' | 'blocker')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="blocker">Blocker</option>
            <option value="done">Done</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Separate tags with commas"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Links</label>
        <div className="flex gap-2 mb-2">
          <input
            type="url"
            value={linkInput}
            onChange={(e) => setLinkInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddLink();
              }
            }}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Add link (e.g., https://example.com)"
          />
          <button
            type="button"
            onClick={handleAddLink}
            className="px-4 py-2 bg-gray-600 text-white font-medium rounded-md hover:bg-gray-700 transition-colors whitespace-nowrap"
          >
            Add Link
          </button>
        </div>

        {manualLinks.length > 0 && (
          <div className="bg-blue-50 rounded-md p-3 mb-2">
            <p className="text-sm font-medium text-gray-900 mb-2">Added Links ({manualLinks.length}):</p>
            <div className="space-y-2">
              {manualLinks.map((link, index) => (
                <div key={index} className="flex items-center justify-between bg-white p-2 rounded border border-gray-200">
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm flex-1 break-all"
                  >
                    {link}
                  </a>
                  <button
                    type="button"
                    onClick={() => handleRemoveLink(index)}
                    className="ml-2 text-red-600 hover:text-red-800 font-medium text-sm whitespace-nowrap"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        <p className="text-xs text-gray-500">
          You can also add links in the Description or Notes fields - they will be detected automatically.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Add additional notes (links will be detected automatically)"
          rows={2}
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white font-medium py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
      >
        Create Task
      </button>
    </form>
  );
}
