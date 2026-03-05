import { Notification, BrowserWindow } from 'electron';

export function showNotification(title: string, options?: any, onClickCallback?: () => void) {
  try {
    const notification = new Notification({
      title,
      icon: require('path').join(__dirname, '../assets/icon.png'),
      ...options,
    });

    if (onClickCallback) {
      notification.on('click', onClickCallback);
    }

    notification.show();
    return notification;
  } catch (error) {
    console.error('Error showing notification:', error);
  }
}

export function showTaskReminder(taskTitle: string, taskDetails?: string, onClickCallback?: () => void) {
  showNotification('TaskHub - Task Reminder', {
    body: `Task due today: ${taskTitle}${taskDetails ? '\n' + taskDetails : ''}`,
    tag: 'task-reminder',
    sound: true,
  }, onClickCallback);
}

export function showTaskAlert(taskTitle: string, message: string, onClickCallback?: () => void) {
  showNotification('TaskHub Alert', {
    body: `${taskTitle}: ${message}`,
    tag: 'task-alert',
    sound: true,
  }, onClickCallback);
}
