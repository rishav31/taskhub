import { Task } from '@/types';

const TASKS_STORAGE_KEY = 'taskhub_tasks';
const API_BASE_URL = '/api/tasks';

// Try to load from file first, fallback to localStorage
export async function loadTasks(): Promise<Task[]> {
  try {
    // Try API first (file-based storage)
    const response = await fetch(API_BASE_URL, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      const tasks = await response.json();
      if (Array.isArray(tasks) && tasks.length > 0) {
        return tasks.map((task: any) => ({
          ...task,
          createdAt: new Date(task.createdAt),
          updatedAt: new Date(task.updatedAt),
          dueDate: task.dueDate ? new Date(task.dueDate) : null,
        }));
      }
    }
  } catch (error) {
    console.warn('API load failed, trying localStorage:', error);
  }

  // Fallback to localStorage
  try {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(TASKS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.map((task: any) => ({
          ...task,
          createdAt: new Date(task.createdAt),
          updatedAt: new Date(task.updatedAt),
          dueDate: task.dueDate ? new Date(task.dueDate) : null,
        }));
      }
    }
  } catch (error) {
    console.error('Error loading from localStorage:', error);
  }

  return [];
}

// Save to file (API) and localStorage
export async function saveTasks(tasks: Task[]): Promise<void> {
  try {
    // Save to API (file-based)
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tasks),
    });

    if (!response.ok) {
      console.warn('Failed to save to API');
    }
  } catch (error) {
    console.warn('API save failed:', error);
  }

  // Also save to localStorage as backup
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
    }
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
}

// Export tasks to JSON file
export function exportToJSON(tasks: Task[]): string {
  return JSON.stringify(tasks, null, 2);
}

// Import tasks from JSON string
export function importFromJSON(jsonString: string): Task[] {
  try {
    const parsed = JSON.parse(jsonString);
    if (Array.isArray(parsed)) {
      return parsed.map((task: any) => ({
        ...task,
        createdAt: new Date(task.createdAt),
        updatedAt: new Date(task.updatedAt),
        dueDate: task.dueDate ? new Date(task.dueDate) : null,
      }));
    }
    return [];
  } catch (error) {
    console.error('Error importing JSON:', error);
    throw new Error('Invalid JSON format');
  }
}
