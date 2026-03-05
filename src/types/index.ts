export interface Task {
  id: string;
  title: string;
  description: string;
  project: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in-progress' | 'done' | 'blocker';
  tags: string[];
  dueDate: Date | null;
  links: string[];
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
  id: string;
  name: string;
  color: string;
}

export interface Link {
  url: string;
  taskId: string;
  taskTitle: string;
  project: string;
}
