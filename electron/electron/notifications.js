"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.showNotification = showNotification;
exports.showTaskReminder = showTaskReminder;
exports.showTaskAlert = showTaskAlert;
const electron_1 = require("electron");
function showNotification(title, options, onClickCallback) {
    try {
        const notification = new electron_1.Notification({
            title,
            icon: require('path').join(__dirname, '../assets/icon.png'),
            ...options,
        });
        if (onClickCallback) {
            notification.on('click', onClickCallback);
        }
        notification.show();
        return notification;
    }
    catch (error) {
        console.error('Error showing notification:', error);
    }
}
function showTaskReminder(taskTitle, taskDetails, onClickCallback) {
    showNotification('TaskHub - Task Reminder', {
        body: `Task due today: ${taskTitle}${taskDetails ? '\n' + taskDetails : ''}`,
        tag: 'task-reminder',
        sound: true,
    }, onClickCallback);
}
function showTaskAlert(taskTitle, message, onClickCallback) {
    showNotification('TaskHub Alert', {
        body: `${taskTitle}: ${message}`,
        tag: 'task-alert',
        sound: true,
    }, onClickCallback);
}
