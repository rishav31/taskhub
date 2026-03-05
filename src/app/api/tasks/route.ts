import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const TASKS_FILE = path.join(DATA_DIR, 'tasks.json');

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (error) {
    console.error('Error creating data directory:', error);
  }
}

// Get all tasks from file
async function getTasks() {
  try {
    await ensureDataDir();
    const data = await fs.readFile(TASKS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // File doesn't exist yet or is empty
    return [];
  }
}

// Save tasks to file
async function saveTasks(tasks: any[]) {
  try {
    await ensureDataDir();
    await fs.writeFile(TASKS_FILE, JSON.stringify(tasks, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Error saving tasks:', error);
    throw error;
  }
}

// GET endpoint - retrieve all tasks
export async function GET() {
  try {
    const tasks = await getTasks();
    return NextResponse.json(tasks);
  } catch (error) {
    console.error('Error getting tasks:', error);
    return NextResponse.json([], { status: 200 });
  }
}

// POST endpoint - save tasks
export async function POST(request: NextRequest) {
  try {
    const tasks = await request.json();
    
    // Validate it's an array
    if (!Array.isArray(tasks)) {
      return NextResponse.json(
        { error: 'Tasks must be an array' },
        { status: 400 }
      );
    }

    await saveTasks(tasks);
    return NextResponse.json({ success: true, message: 'Tasks saved successfully' });
  } catch (error) {
    console.error('Error saving tasks:', error);
    return NextResponse.json(
      { error: 'Failed to save tasks' },
      { status: 500 }
    );
  }
}
