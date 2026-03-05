"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path = __importStar(require("path"));
const isDev = __importStar(require("electron-is-dev"));
const notifications_1 = require("./notifications");
const reminders_1 = require("../src/lib/reminders");
let mainWindow = null;
let storedTasks = [];
let reminderIntervalId = null;
const createWindow = () => {
    mainWindow = new electron_1.BrowserWindow({
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
    if (storedTasks.length === 0)
        return;
    try {
        const dueToday = (0, reminders_1.getTasksDueToday)(storedTasks);
        const overdue = (0, reminders_1.getOverdueTasks)(storedTasks);
        // Callback to bring window to foreground when notification is clicked
        const focusWindow = () => {
            if (mainWindow) {
                if (mainWindow.isMinimized())
                    mainWindow.restore();
                mainWindow.focus();
            }
        };
        // Show reminders for overdue tasks first (more urgent)
        overdue.forEach((task) => {
            (0, notifications_1.showTaskAlert)(task.title, `Overdue: ${task.description || 'No description'}`, focusWindow);
        });
        // Then show reminders for tasks due today
        dueToday.forEach((task) => {
            (0, notifications_1.showTaskReminder)(task.title, `Due today: ${task.description || 'No description'}`, focusWindow);
        });
    }
    catch (error) {
        console.error('Error checking reminders:', error);
    }
};
// Create application menu
const createMenu = () => {
    const template = [
        {
            label: 'File',
            submenu: [
                {
                    label: 'Exit',
                    accelerator: 'CmdOrCtrl+Q',
                    click: () => {
                        electron_1.app.quit();
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
    const menu = electron_1.Menu.buildFromTemplate(template);
    electron_1.Menu.setApplicationMenu(menu);
};
electron_1.app.on('ready', () => {
    createWindow();
    createMenu();
    setupReminderScheduler();
});
// IPC handlers for app functionality
electron_1.ipcMain.on('app-name', (event) => {
    event.reply('app-name', { name: 'TaskHub', version: electron_1.app.getVersion() });
});
electron_1.ipcMain.on('app-path', (event) => {
    event.reply('app-path', { path: electron_1.app.getAppPath() });
});
// IPC handler for receiving task updates from renderer
electron_1.ipcMain.handle('tasks-updated', (event, tasks) => {
    storedTasks = tasks;
    return { success: true };
});
// IPC handler to manually trigger reminder check
electron_1.ipcMain.handle('check-reminders', async () => {
    checkAndSendReminders();
    return { success: true };
});
// Clean up interval on app quit
electron_1.app.on('before-quit', () => {
    if (reminderIntervalId) {
        clearInterval(reminderIntervalId);
        reminderIntervalId = null;
    }
});
