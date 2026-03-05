import { app, BrowserWindow, Menu, ipcMain } from 'electron';
import * as path from 'path';
import * as isDev from 'electron-is-dev';
import { showTaskReminder, showTaskAlert } from './notifications';
import { getTasksDueToday, getOverdueTasks } from '../src/lib/reminders';
import type { Task } from '../src/types';

let mainWindow: BrowserWindow | null = null;
let storedTasks: Task[] = [];
let reminderIntervalId: NodeJS.Timeout | null = null;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
    icon: path.join(__dirname, '../assets/icon.png'),
  });

  const startUrl = isDev
    ? 'http://localhost:3000'
    : `file://${path.join(__dirname, '../out/index.html')}`;

  mainWindow.loadURL(startUrl);

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Handle window resizing
  mainWindow.on('resize', () => {
    if (mainWindow) {
      mainWindow.webContents.send('window-resized');
    }
  });
};

// Set up daily reminder scheduler
const setupReminderScheduler = () => {
  // Check immediately on app start
  checkAndSendReminders();

  // Check every hour for reminders (more practical than waiting until next day)
  reminderIntervalId = setInterval(() => {
    checkAndSendReminders();
  }, 60 * 60 * 1000); // 1 hour
};

// Check for tasks due today/overdue and send notifications
const checkAndSendReminders = () => {
  if (storedTasks.length === 0) return;

  try {
    const dueToday = getTasksDueToday(storedTasks);
    const overdue = getOverdueTasks(storedTasks);

    // Callback to bring window to foreground when notification is clicked
    const focusWindow = () => {
      if (mainWindow) {
        if (mainWindow.isMinimized()) mainWindow.restore();
        mainWindow.focus();
      }
    };

    // Show reminders for overdue tasks first (more urgent)
    overdue.forEach((task) => {
      showTaskAlert(task.title, `Overdue: ${task.description || 'No description'}`, focusWindow);
    });

    // Then show reminders for tasks due today
    dueToday.forEach((task) => {
      showTaskReminder(task.title, `Due today: ${task.description || 'No description'}`, focusWindow);
    });
  } catch (error) {
    console.error('Error checking reminders:', error);
  }
};

// Create application menu
const createMenu = () => {
  const template: Electron.MenuItemConstructorOptions[] = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Exit',
          accelerator: 'CmdOrCtrl+Q',
          click: () => {
            app.quit();
          },
        },
      ],
    },
    {
      label: 'Edit',
      submenu: [
        { label: 'Undo', accelerator: 'CmdOrCtrl+Z', role: 'undo' },
        { label: 'Redo', accelerator: 'CmdOrCtrl+Y', role: 'redo' },
        { type: 'separator' },
        { label: 'Cut', accelerator: 'CmdOrCtrl+X', role: 'cut' },
        { label: 'Copy', accelerator: 'CmdOrCtrl+C', role: 'copy' },
        { label: 'Paste', accelerator: 'CmdOrCtrl+V', role: 'paste' },
      ],
    },
    {
      label: 'View',
      submenu: [
        { label: 'Reload', accelerator: 'CmdOrCtrl+R', role: 'reload' },
        {
          label: 'Toggle Developer Tools',
          accelerator: 'CmdOrCtrl+Shift+I',
          role: 'toggleDevTools',
        },
      ],
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'About',
          click: () => {
            // You can create an about window here
          },
        },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
};

app.on('ready', () => {
  createWindow();
  createMenu();
  setupReminderScheduler();
});

// IPC handlers for app functionality
ipcMain.on('app-name', (event) => {
  event.reply('app-name', { name: 'TaskHub', version: app.getVersion() });
});

ipcMain.on('app-path', (event) => {
  event.reply('app-path', { path: app.getAppPath() });
});

// IPC handler for receiving task updates from renderer
ipcMain.handle('tasks-updated', (event, tasks: Task[]) => {
  storedTasks = tasks;
  return { success: true };
});

// IPC handler to manually trigger reminder check
ipcMain.handle('check-reminders', async () => {
  checkAndSendReminders();
  return { success: true };
});

// Clean up interval on app quit
app.on('before-quit', () => {
  if (reminderIntervalId) {
    clearInterval(reminderIntervalId);
    reminderIntervalId = null;
  }
});
