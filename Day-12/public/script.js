class TodoApp {
  constructor() {
    this.todos = []
    this.apiUrl = '/api/todos'
    this.init()
  }

  async init() {
    await this.loadTodos()
    this.setupEventListeners()
    this.updateStats()
    this.toggleEmptyState()
  }

  setupEventListeners() {
    const todoForm = document.getElementById('todoForm')
    const todoInput = document.getElementById('todoInput')

    todoForm.addEventListener('submit', (e) => {
      e.preventDefault()
      this.addTodo()
    })

    todoInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.addTodo()
      }
    })
  }

  async loadTodos() {
    try {
      const response = await fetch(this.apiUrl)
      if (response.ok) {
        this.todos = await response.json()
        this.renderTodos()
      } else {
        throw new Error('Failed to load todos')
      }
    } catch (error) {
      console.error('Error loading todos:', error)
      this.showNotification('Failed to load todos', 'error')
    }
  }

  async addTodo() {
    const todoInput = document.getElementById('todoInput')
    const text = todoInput.value.trim()

    if (!text) {
      this.showNotification('Please enter a task', 'warning')
      return
    }

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      })

      if (response.ok) {
        const newTodo = await response.json()
        this.todos.push(newTodo)
        this.renderTodos()
        this.updateStats()
        this.toggleEmptyState()
        todoInput.value = ''
        this.showNotification('Task added successfully!', 'success')
      } else {
        throw new Error('Failed to add todo')
      }
    } catch (error) {
      console.error('Error adding todo:', error)
      this.showNotification('Failed to add task', 'error')
    }
  }

  async toggleTodo(id) {
    const todo = this.todos.find((t) => t.id === id)
    if (!todo) return

    try {
      const response = await fetch(`${this.apiUrl}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed: !todo.completed }),
      })

      if (response.ok) {
        todo.completed = !todo.completed
        this.renderTodos()
        this.updateStats()
        this.showNotification(
          todo.completed ? 'Task completed! 🎉' : 'Task marked as pending',
          'success'
        )
      } else {
        throw new Error('Failed to update todo')
      }
    } catch (error) {
      console.error('Error updating todo:', error)
      this.showNotification('Failed to update task', 'error')
    }
  }

  async editTodo(id) {
    const todo = this.todos.find((t) => t.id === id)
    if (!todo) return

    const todoItem = document.querySelector(`[data-id="${id}"]`)
    const todoText = todoItem.querySelector('.todo-text')
    const currentText = todoText.textContent

    // Create edit input
    const editInput = document.createElement('input')
    editInput.type = 'text'
    editInput.className = 'edit-input'
    editInput.value = currentText
    editInput.style.display = 'block'

    // Hide text and show input
    todoText.style.display = 'none'
    todoItem.classList.add('editing')
    todoItem.insertBefore(editInput, todoText)

    // Focus and select text
    editInput.focus()
    editInput.select()

    const saveEdit = async () => {
      const newText = editInput.value.trim()

      if (!newText) {
        this.showNotification('Task text cannot be empty', 'warning')
        this.cancelEdit(id)
        return
      }

      if (newText === currentText) {
        this.cancelEdit(id)
        return
      }

      try {
        const response = await fetch(`${this.apiUrl}/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text: newText }),
        })

        if (response.ok) {
          todo.text = newText
          this.renderTodos()
          this.showNotification('Task updated successfully!', 'success')
        } else {
          throw new Error('Failed to update todo')
        }
      } catch (error) {
        console.error('Error updating todo:', error)
        this.showNotification('Failed to update task', 'error')
        this.cancelEdit(id)
      }
    }

    const cancelEdit = () => {
      this.cancelEdit(id)
    }

    editInput.addEventListener('blur', saveEdit)
    editInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        saveEdit()
      } else if (e.key === 'Escape') {
        cancelEdit()
      }
    })
  }

  cancelEdit(id) {
    const todoItem = document.querySelector(`[data-id="${id}"]`)
    if (!todoItem) return

    const editInput = todoItem.querySelector('.edit-input')
    const todoText = todoItem.querySelector('.todo-text')

    if (editInput) {
      editInput.remove()
    }

    todoText.style.display = 'block'
    todoItem.classList.remove('editing')
  }

  async deleteTodo(id) {
    const todo = this.todos.find((t) => t.id === id)
    if (!todo) return

    // Add slide out animation
    const todoItem = document.querySelector(`[data-id="${id}"]`)
    todoItem.style.animation = 'slideOutLeft 0.3s ease-out forwards'

    setTimeout(async () => {
      try {
        const response = await fetch(`${this.apiUrl}/${id}`, {
          method: 'DELETE',
        })

        if (response.ok) {
          this.todos = this.todos.filter((t) => t.id !== id)
          this.renderTodos()
          this.updateStats()
          this.toggleEmptyState()
          this.showNotification('Task deleted successfully!', 'success')
        } else {
          throw new Error('Failed to delete todo')
        }
      } catch (error) {
        console.error('Error deleting todo:', error)
        this.showNotification('Failed to delete task', 'error')
        // Reset animation if delete failed
        todoItem.style.animation = ''
      }
    }, 300)
  }

  renderTodos() {
    const todoList = document.getElementById('todoList')
    todoList.innerHTML = ''

    this.todos.forEach((todo) => {
      const todoItem = this.createTodoElement(todo)
      todoList.appendChild(todoItem)
    })
  }

  createTodoElement(todo) {
    const todoItem = document.createElement('div')
    todoItem.className = `todo-item ${todo.completed ? 'completed' : ''}`
    todoItem.setAttribute('data-id', todo.id)

    todoItem.innerHTML = `
            <div class="todo-checkbox ${
              todo.completed ? 'checked' : ''
            }" onclick="todoApp.toggleTodo(${todo.id})">
                ${todo.completed ? '<i class="fas fa-check"></i>' : ''}
            </div>
            <div class="todo-text">${this.escapeHtml(todo.text)}</div>
            <div class="todo-actions">
                <button class="action-btn edit-btn" onclick="todoApp.editTodo(${
                  todo.id
                })" title="Edit task">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn delete-btn" onclick="todoApp.deleteTodo(${
                  todo.id
                })" title="Delete task">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `

    return todoItem
  }

  updateStats() {
    const totalTasks = this.todos.length
    const completedTasks = this.todos.filter((todo) => todo.completed).length
    const pendingTasks = totalTasks - completedTasks

    document.getElementById('totalTasks').textContent = totalTasks
    document.getElementById('completedTasks').textContent = completedTasks
    document.getElementById('pendingTasks').textContent = pendingTasks

    // Add animation to stats
    const statNumbers = document.querySelectorAll('.stat-number')
    statNumbers.forEach((stat) => {
      stat.style.transform = 'scale(1.1)'
      setTimeout(() => {
        stat.style.transform = 'scale(1)'
      }, 200)
    })
  }

  toggleEmptyState() {
    const emptyState = document.getElementById('emptyState')
    const todoList = document.getElementById('todoList')

    if (this.todos.length === 0) {
      todoList.style.display = 'none'
      emptyState.classList.add('show')
    } else {
      todoList.style.display = 'flex'
      emptyState.classList.remove('show')
    }
  }

  showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification')
    existingNotifications.forEach((notification) => notification.remove())

    const notification = document.createElement('div')
    notification.className = `notification notification-${type}`
    notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
        `

    // Add styles
    notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${this.getNotificationColor(type)};
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
            z-index: 1000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 300px;
            font-weight: 500;
        `

    document.body.appendChild(notification)

    // Animate in
    setTimeout(() => {
      notification.style.transform = 'translateX(0)'
    }, 100)

    // Auto remove after 3 seconds
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)'
      setTimeout(() => {
        if (notification.parentNode) {
          notification.remove()
        }
      }, 300)
    }, 3000)
  }

  getNotificationIcon(type) {
    const icons = {
      success: 'fa-check-circle',
      error: 'fa-exclamation-circle',
      warning: 'fa-exclamation-triangle',
      info: 'fa-info-circle',
    }
    return icons[type] || icons.info
  }

  getNotificationColor(type) {
    const colors = {
      success: '#48bb78',
      error: '#f56565',
      warning: '#ed8936',
      info: '#4299e1',
    }
    return colors[type] || colors.info
  }

  escapeHtml(text) {
    const div = document.createElement('div')
    div.textContent = text
    return div.innerHTML
  }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.todoApp = new TodoApp()
})

// Add some nice loading animation
window.addEventListener('load', () => {
  document.body.style.opacity = '0'
  document.body.style.transition = 'opacity 0.5s ease'

  setTimeout(() => {
    document.body.style.opacity = '1'
  }, 100)
})
