"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTaskDueToday = isTaskDueToday;
exports.isTaskOverdue = isTaskOverdue;
exports.getTasksDueToday = getTasksDueToday;
exports.getOverdueTasks = getOverdueTasks;
exports.getUpcomingTasks = getUpcomingTasks;
exports.formatDueDate = formatDueDate;
// Check if a task is due today
function isTaskDueToday(task) {
    if (!task.dueDate)
        return false;
    const taskDate = new Date(task.dueDate);
    const today = new Date();
    return (taskDate.getFullYear() === today.getFullYear() &&
        taskDate.getMonth() === today.getMonth() &&
        taskDate.getDate() === today.getDate());
}
// Check if a task is overdue
function isTaskOverdue(task) {
    if (!task.dueDate)
        return false;
    const taskDate = new Date(task.dueDate);
    const today = new Date();
    // Set time to start of day for comparison
    taskDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    return taskDate < today && task.status !== 'done';
}
// Get tasks due today
function getTasksDueToday(tasks) {
    return tasks.filter(task => isTaskDueToday(task) &&
        (task.status === 'todo' || task.status === 'in-progress'));
}
// Get overdue tasks
function getOverdueTasks(tasks) {
    return tasks.filter(isTaskOverdue);
}
// Get tasks due in next 3 days
function getUpcomingTasks(tasks) {
    return tasks.filter(task => {
        if (!task.dueDate || task.status === 'done')
            return false;
        const taskDate = new Date(task.dueDate);
        const today = new Date();
        const threeDaysFromNow = new Date(today);
        threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
        taskDate.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);
        threeDaysFromNow.setHours(0, 0, 0, 0);
        return taskDate > today && taskDate <= threeDaysFromNow;
    });
}
// Format date for display
function formatDueDate(date) {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const taskDate = new Date(date);
    if (taskDate.toDateString() === today.toDateString()) {
        return 'Today';
    }
    if (taskDate.toDateString() === tomorrow.toDateString()) {
        return 'Tomorrow';
    }
    return taskDate.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
    });
}
