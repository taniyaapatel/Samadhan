# ✨ Beautiful To-Do App

📸 Preview:
![To-Do App Screenshot](https://res.cloudinary.com/doxmvuss9/image/upload/v1756537161/link-generator/towcxkoqursvapb6mnsq.png)

A modern, responsive To-Do application built with Node.js backend and vanilla JavaScript frontend, featuring beautiful animations and a clean UI.

## 🚀 Features

- **Modern UI Design**: Clean, glassmorphism-inspired interface with smooth animations
- **Full CRUD Operations**: Create, Read, Update, and Delete tasks
- **Real-time Statistics**: Track total, completed, and pending tasks
- **Smooth Animations**: Beautiful slide-in, fade, and hover effects
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Interactive Notifications**: Toast notifications for user feedback
- **Edit Mode**: Inline editing with keyboard shortcuts (Enter to save, Escape to cancel)
- **Empty State**: Friendly empty state when no tasks exist
- **RESTful API**: Clean backend API with proper error handling

## 🛠️ Technologies Used

- **Backend**: Node.js, Express.js
- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Styling**: Custom CSS with modern design patterns
- **Icons**: Font Awesome
- **Fonts**: Inter (Google Fonts)

## 📦 Installation

1. **Clone or navigate to the project directory:**

   ```bash
   cd Day-12
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Start the development server:**

   ```bash
   npm run dev
   ```

4. **Open your browser and visit:**
   ```
   http://localhost:3000
   ```

## 🎯 How to Use

### Adding Tasks

- Type your task in the input field
- Press Enter or click the "+" button to add

### Managing Tasks

- **Complete**: Click the checkbox to mark as complete
- **Edit**: Click the edit (pencil) icon to modify the task
  - Press Enter to save changes
  - Press Escape to cancel editing
- **Delete**: Click the trash icon to remove the task

### Statistics

The app automatically tracks:

- Total number of tasks
- Completed tasks
- Pending tasks

## 🎨 Design Features

### Animations

- **Fade-in animations** for page load
- **Slide-in effects** for new tasks
- **Hover animations** for interactive elements
- **Smooth transitions** for all state changes
- **Slide-out animation** for task deletion

### UI Elements

- **Glassmorphism design** with backdrop blur effects
- **Gradient backgrounds** for visual appeal
- **Responsive grid layout** for statistics
- **Interactive hover states** for better UX
- **Toast notifications** for user feedback

### Color Scheme

- **Primary**: Purple gradient (#667eea to #764ba2)
- **Success**: Green (#48bb78)
- **Error**: Red (#f56565)
- **Warning**: Orange (#ed8936)
- **Info**: Blue (#4299e1)

## 🔧 API Endpoints

- `GET /api/todos` - Get all todos
- `POST /api/todos` - Create a new todo
- `PUT /api/todos/:id` - Update a todo
- `DELETE /api/todos/:id` - Delete a todo

## 📱 Responsive Design

The app is fully responsive and optimized for:

- **Desktop**: Full-featured layout with hover effects
- **Tablet**: Adapted layout with touch-friendly interactions
- **Mobile**: Stacked layout with always-visible action buttons

## 🎉 Getting Started

1. Start the server with `npm run dev`
2. Open `http://localhost:3000` in your browser
3. Start adding your tasks!
4. Enjoy the beautiful animations and smooth interactions

## 🔮 Future Enhancements

- [ ] Local storage persistence
- [ ] Task categories/tags
- [ ] Due dates and reminders
- [ ] Dark mode toggle
- [ ] Task search and filtering
- [ ] Drag and drop reordering
- [ ] Export/import functionality

---

**Happy task managing! ✨**
