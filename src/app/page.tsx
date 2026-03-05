'use client';

import React, { useState, useEffect } from 'react';
import TaskList from '@/components/TaskList';
import TaskForm from '@/components/TaskForm';
import ProjectFilter from '@/components/ProjectFilter';
import LinksTab from '@/components/LinksTab';
import ExportImport from '@/components/ExportImport';
import { Task, Project } from '@/types';
import { loadTasks, saveTasks } from '@/lib/persistence';

const PROJECTS: Project[] = [
  { id: 'all', name: 'All Projects', color: 'gray' },
  { id: 'ui', name: 'UI', color: 'blue' },
  { id: 'backend', name: 'Backend', color: 'green' },
  { id: 'api', name: 'API', color: 'purple' },
  { id: 'mobile', name: 'Mobile', color: 'orange' },
  { id: 'infra', name: 'Infrastructure', color: 'red' },
  { id: 'devops', name: 'DevOps', color: 'indigo' },
  { id: 'qa', name: 'QA/Testing', color: 'cyan' },
  { id: 'docs', name: 'Documentation', color: 'amber' },
  { id: 'security', name: 'Security', color: 'pink' },
  { id: 'database', name: 'Database', color: 'emerald' },
  { id: 'other', name: 'Other', color: 'slate' },
];

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'tasks' | 'links'>('tasks');
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  // Load tasks on mount
  useEffect(() => {
    const loadData = async () => {
      const loadedTasks = await loadTasks();
      setTasks(loadedTasks);
      setIsLoading(false);
    };
    loadData();
  }, []);

  // Save tasks whenever they change
  useEffect(() => {
    if (!isLoading) {
      saveTasks(tasks);
      
      // Send tasks to Electron main process for reminder checking
      if (typeof window !== 'undefined' && (window as any).electron) {
        (window as any).electron.ipcRenderer.invoke('tasks-updated', tasks).catch(() => {
          // Silently fail if not in Electron context
        });
      }
    }
  }, [tasks, isLoading]);

  const handleAddTask = (newTask: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const task: Task = {
      ...newTask,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setTasks([...tasks, task]);
    setShowForm(false); // Close form after adding task
  };

  const handleUpdateTask = (id: string, updates: Partial<Task>) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, ...updates, updatedAt: new Date() } : task
      )
    );
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const filteredTasks =
    selectedProject === 'all'
      ? tasks
      : tasks.filter((task) => task.project === selectedProject);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-3xl font-bold text-gray-900">TaskHub</h1>
          <p className="text-gray-600 text-sm mt-1">
            Task and Documentation Management for Engineering Teams
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-4 sticky top-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Projects</h2>
              <ProjectFilter
                projects={PROJECTS}
                selectedProject={selectedProject}
                onSelectProject={setSelectedProject}
              />
              <div className="mt-6 pt-6 border-t border-gray-200">
                <ExportImport
                  tasks={tasks}
                  onImport={(importedTasks) => setTasks(importedTasks)}
                />
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {/* Tabs and Add Button */}
            <div className="flex gap-4 mb-6 border-b border-gray-200 items-center justify-between">
              <div className="flex gap-4">
                <button
                  onClick={() => setActiveTab('tasks')}
                  className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                    activeTab === 'tasks'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Tasks ({filteredTasks.length})
                </button>
                <button
                  onClick={() => setActiveTab('links')}
                  className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                    activeTab === 'links'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Links
                </button>
              </div>
              
              {activeTab === 'tasks' && (
                <button
                  onClick={() => setShowForm(!showForm)}
                  className="px-4 py-2 bg-blue-600 text-white font-medium text-sm rounded-md hover:bg-blue-700 transition-colors whitespace-nowrap"
                >
                  {showForm ? '✕ Cancel' : '+ Add Task'}
                </button>
              )}
            </div>

            {/* Content */}
            {activeTab === 'tasks' ? (
              <div className="space-y-6">
                {showForm && (
                  <TaskForm
                    projects={PROJECTS.filter((p) => p.id !== 'all')}
                    onAddTask={handleAddTask}
                  />
                )}
                <TaskList
                  tasks={filteredTasks}
                  projects={PROJECTS}
                  onUpdateTask={handleUpdateTask}
                  onDeleteTask={handleDeleteTask}
                />
              </div>
            ) : (
              <LinksTab tasks={tasks} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
