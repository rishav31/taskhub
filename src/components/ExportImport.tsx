'use client';

import React, { useRef } from 'react';
import { Task } from '@/types';
import { exportToJSON, importFromJSON } from '@/lib/persistence';

interface ExportImportProps {
  tasks: Task[];
  onImport: (tasks: Task[]) => void;
}

export default function ExportImport({ tasks, onImport }: ExportImportProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const jsonData = exportToJSON(tasks);
    const element = document.createElement('a');
    element.setAttribute(
      'href',
      'data:application/json;charset=utf-8,' + encodeURIComponent(jsonData)
    );
    element.setAttribute('download', `taskhub-backup-${new Date().toISOString().split('T')[0]}.json`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const jsonString = event.target?.result as string;
        const importedTasks = importFromJSON(jsonString);
        onImport(importedTasks);
        alert(`Successfully imported ${importedTasks.length} tasks!`);
      } catch (error) {
        alert('Error importing file: ' + (error as Error).message);
      }
    };
    reader.readAsText(file);

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <h3 className="font-semibold text-gray-900">Backup & Restore</h3>
      <button
        onClick={handleExport}
        className="w-full px-3 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-colors"
      >
        Export JSON
      </button>
      <button
        onClick={handleImportClick}
        className="w-full px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
      >
        Import JSON
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileChange}
        className="hidden"
      />
      <p className="text-xs text-gray-500 mt-2">
        Export your tasks as JSON for backup, or import from a previous backup.
      </p>
    </div>
  );
}
