# TaskHub - Task & Documentation Management App

A comprehensive task and documentation management application designed for software engineering team leads. Built with Next.js and TypeScript, this app helps you organize, track, and manage your team's tasks efficiently.

## Features

### ✅ Task Management
- **Create, Read, Update, Delete (CRUD)** - Full task lifecycle management
- **Task Properties:**
  - Title and detailed descriptions
  - Priority levels (Low, Medium, High)
  - Status tracking (To Do, In Progress, Done)
  - Due dates with relative time display
  - Custom tags for organization
  - Detailed notes for additional context

### ✅ Project Organization
- **Project Categories:**
  - UI
  - Backend
  - API
  - Mobile
  - Infrastructure
- Filter tasks by project for focused work
- Quick project switching in the sidebar

### ✅ Automatic Link Detection
- **Auto-detect URLs** in task descriptions and notes
- **Supported formats:** Any http or https URL
- **Multiple links per task** - Add as many relevant links as you need
- Automatically extracted and organized in the Links tab

### ✅ Dedicated Links Tab
- **View all URLs** across all tasks in one place
- **Quick actions:**
  - Click to open links in new tabs
  - Copy links to clipboard with one click
- **Link context** - See which task each link belongs to

### ✅ File Persistence
- **File-based storage** - Data saved to `data/tasks.json` on the server
- **Never lose data** - Persists even if browser cache is cleared
- **Fallback to localStorage** - Automatic backup to browser storage
- **Automatic saving** - Changes saved instantly to file
- **Survives app restart** - All data preserved between sessions

### ✅ Export & Import
- **Export to JSON** - Create backups of all your tasks
- **Import from JSON** - Restore tasks from previous exports
- **Timestamped backups** - Auto-named with current date
- **Batch operations** - Import/export all tasks at once

### ✅ User Interface
- **Clean, modern design** with Tailwind CSS
- **Responsive layout** - Works on desktop and tablet
- **Dark-aware** - Adapts to your system theme
- **Organized sidebar** - Easy navigation and controls
- **Task sorting** - Automatically sorted by status and priority

## Getting Started

### Prerequisites
- Node.js 16.0 or later
- npm or yarn

### Installation

1. **Clone or navigate to the project directory:**
   ```bash
   cd taskhub
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   - Navigate to `http://localhost:3000`

### Building for Production (Web)

```bash
npm run build
npm start
```

### Building Desktop App (Mac & Windows)

🎉 **NEW:** Build TaskHub as a native desktop application!

**Quick Start:**
```bash
# macOS (.dmg file)
npm run build:mac

# Windows (.exe installer)
npm run build:windows

# Both platforms (macOS only)
npm run build:all
```

**Output files:**
- macOS: `dist/TaskHub-1.0.0.dmg`
- Windows: `dist/TaskHub Setup 1.0.0.exe`

**Development:**
```bash
npm run electron-dev
```
Launches Electron with hot reload for development.

**Important:** Before building, you need to create icon files in the `assets/` directory:
- `assets/icon.icns` for macOS (use https://cloudconvert.com)
- `assets/icon.ico` for Windows (use https://icoconvert.com)

Upload `assets/icon.svg` to either service to generate the required format.


## How to Use

### Creating a Task

1. Click on the **"Create New Task"** form at the top of the Tasks tab
2. Fill in the required fields:
   - **Title** (required) - Name of your task
   - **Description** - Detailed information (can include URLs)
   - **Project** - Select which project this belongs to
   - **Priority** - Set Low, Medium, or High
   - **Status** - Choose To Do, In Progress, or Done
   - **Tags** - Add comma-separated tags for organization
   - **Due Date** - Set a deadline (optional)
   - **Notes** - Additional information (can include URLs)
3. Click **"Create Task"** - Any URLs in description or notes will be automatically detected

### Managing Tasks

- **View details** - Click "More" on any task card to expand
- **Change status** - Use the status dropdown in the expanded view
- **Delete task** - Click the "Delete" button on the task card
- **Copy links** - Press "Copy" next to any URL in the expanded view

### Viewing Links

1. Click the **"Links"** tab at the top
2. See all URLs automatically detected across all tasks
3. Click any link to open it in a new tab
4. Use "Copy" to copy a URL to your clipboard

### Exporting & Importing

**Export Tasks:**
1. Click **"Export JSON"** in the Projects sidebar
2. A JSON file will download with your tasks
3. Name it for backup - automatically includes today's date

**Import Tasks:**
1. Click **"Import JSON"** in the Projects sidebar
2. Select a previously exported JSON file
3. Tasks will be imported and merged with existing tasks

### Filtering by Project

1. In the sidebar, click on any project name
2. Tasks list will update to show only that project's tasks
3. Click "All Projects" to see everything

## Tech Stack

- **Frontend:** Next.js 14, React 18, TypeScript
- **Styling:** Tailwind CSS
- **Storage:** File-based JSON (`data/tasks.json`) + localStorage fallback
- **API:** Next.js API routes for server-side file operations
- **Date Handling:** date-fns
- **Build Tool:** Next.js built-in Webpack

## Project Structure

```
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── tasks/
│   │   │       └── route.ts      # API for file-based storage
│   │   ├── layout.tsx            # Root layout
│   │   ├── page.tsx              # Main page component
│   │   └── favicon.ico
│   ├── components/
│   │   ├── TaskForm.tsx          # Task creation form
│   │   ├── TaskList.tsx          # Task list container
│   │   ├── TaskCard.tsx          # Individual task display
│   │   ├── ProjectFilter.tsx     # Project sidebar filter
│   │   ├── LinksTab.tsx          # Links view component
│   │   └── ExportImport.tsx      # Backup/restore functionality
│   ├── lib/
│   │   ├── linkDetection.ts      # URL extraction utilities
│   │   └── persistence.ts        # Storage and import/export
│   ├── types/
│   │   └── index.ts              # TypeScript interfaces
│   └── globals.css               # Global styles
├── data/
│   └── tasks.json                # File-based task storage (auto-created)
├── next.config.js
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

## Key Features in Detail

### Smart Link Detection
The app uses regex pattern matching to automatically find and extract URLs from task descriptions and notes. This means you can paste links anywhere in your task details and they'll automatically appear in the Links tab.

### Priority & Status Sorting
Tasks are automatically sorted by:
1. Status (To Do → In Progress → Done)
2. Priority (High → Medium → Low)

This ensures urgent tasks are always visible first.

### Persistent Storage
All your data is stored securely in two ways:
- **Primary:** File-based storage in `data/tasks.json` on the server
- **Backup:** Browser localStorage for redundancy
- Data persists across browser sessions and even if browser cache is cleared
- All data stays on your device/server - no cloud sync
- Works offline once data is loaded (reads from file)

**Key Benefits:**
- ✅ Never lose data even if browser cache is cleared
- ✅ Data survives application restarts
- ✅ Automatic backup in localStorage
- ✅ No internet required for local use

## Keyboard Shortcuts

Coming soon! For now, all features are accessible via buttons and forms.

## Tips & Tricks

1. **Add multiple links** - You can paste as many URLs as you want in the description or notes
2. **Use tags smartly** - Create consistent tag naming for better filtering
3. **Regular backups** - Export your tasks regularly using the Export JSON button
4. **Project names** - Keep project names short for easy identification
5. **Due dates** - Set realistic dates to help with task planning

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Any modern browser supporting localStorage and ES6+

## Performance

- Instant task creation and updates
- Smooth animations and transitions
- Optimized component rendering
- Minimal bundle size

## Future Enhancements

Potential features for future versions:
- Task search and advanced filtering
- Task statistics and analytics
- Recurring tasks
- Task templates
- Collaborative features
- Mobile app version
- Dark mode toggle
- Custom project creation

## Troubleshooting

### Tasks not saving?
- Check if the `data/` directory exists and is writable
- Verify the Next.js server is running (`npm run dev`)
- Check browser console for API errors
- Check application logs for file system errors
- Tasks will fallback to localStorage if file saving fails

### Data directory missing?
- Create `data/` folder manually in the project root
- Ensure write permissions: `mkdir -p data`
- Restart the development server

### Links not detected?
- Ensure URLs start with `http://` or `https://`
- Make sure there are no spaces before/after URLs
- Try copying the full URL correctly

### Import not working?
- Verify the JSON file is from a TaskHub export
- Check file format hasn't been modified
- Ensure file is valid JSON format

### Data lost after clearing browser cache?
- Don't worry! Data is stored in `data/tasks.json`
- The app will reload from file when you refresh
- Browser cache clearing won't affect file-based storage

## Support

For issues or feature requests, please check your browser console for any error messages and ensure:
1. JavaScript is enabled
2. localStorage is available
3. Browser is up to date

## License

This project is open source and available for personal and team use.

---

**Made with ❤️ for engineering team leads** - TaskHub makes task management simple and efficient.
