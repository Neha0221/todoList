import { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [taskStatus, setTaskStatus] = useState("Todo");
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [sortDirection, setSortDirection] = useState('desc'); // 'desc' for Completed→Todo, 'asc' for Todo→Completed
  const [taskPriority, setTaskPriority] = useState("Medium");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const statusOrder = {
    "Completed": 0,
    "In Progress": 1,
    "Todo": 2
  };

  const priorityOrder = {
    "High": 0,
    "Medium": 1,
    "Low": 2
  };

  // Fetch tasks from backend API (implement yourself)
  useEffect(() => {
    // TODO: fetch tasks from API and setTasks
    fetchTasks();
  }, []);

  // Auto-hide notification after 3 seconds
  useEffect(() => {
    if (notification.show) {
      const timer = setTimeout(() => {
        setNotification({ show: false, message: '', type: '' });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification.show]);

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
  };

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:5002/api/todos');
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error.response?.data || error.message);
    }
  };

  const handleOpen = () => {
    setShowModal(true);
    setEditingTask(null);
    setNewTask("");
    setTaskStatus("Todo");
  };

  const handleClose = () => {
    setShowModal(false);
    setEditingTask(null);
    setNewTask("");
    setTaskStatus("Todo");
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setNewTask(task.title);
    setTaskStatus(task.status);
    setTaskPriority(task.priority || "Medium");
    setShowModal(true);
  };

  const handleCreateTask = async () => {
    if (!newTask.trim()) {
      alert('Please enter a task title');
      return;
    }
    
    if (newTask.trim().length < 3) {
      alert('Task title must be at least 3 characters long');
      return;
    }

    try {
      const payload = {
        title: newTask.trim(),
        status: taskStatus,
        priority: taskPriority
      };

      const response = await axios.post('http://localhost:5002/api/todos/', payload);
      console.log('Task created successfully:', response.data);
      
      await fetchTasks();
      handleClose();
      showNotification('Task created successfully');
      
    } catch (error) {
      console.error('Error creating task:', error);
      handleApiError(error, 'creating task');
    }
  };

  const handleUpdateTask = async () => {
    if (!newTask.trim()) {
      alert('Please enter a task title');
      return;
    }
    
    if (newTask.trim().length < 3) {
      alert('Task title must be at least 3 characters long');
      return;
    }

    try {
      const payload = {
        title: newTask.trim(),
        status: taskStatus,
        priority: taskPriority
      };

      const response = await axios.put(`http://localhost:5002/api/todos/${editingTask._id}`, payload);
      console.log('Task updated successfully:', response.data);
      
      await fetchTasks();
      handleClose();
      showNotification('Task updated successfully');
      
    } catch (error) {
      console.error('Error updating task:', error);
      handleApiError(error, 'updating task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await axios.delete(`http://localhost:5002/api/todos/${taskId}`);
        console.log('Task deleted successfully');
        await fetchTasks();
        showNotification('Task deleted successfully');
      } catch (error) {
        console.error('Error deleting task:', error);
        handleApiError(error, 'deleting task');
      }
    }
  };

  const handleApiError = (error, operation) => {
    if (error.response?.status === 422) {
      showNotification(`Validation error while ${operation}: ${error.response.data.message || 'Please check your input'}`, 'error');
    } else if (error.response?.status === 409) {
      showNotification('A task with this title already exists. Please use a different title.', 'error');
    } else if (error.response?.status === 404) {
      showNotification('Task not found. It may have been deleted.', 'error');
    } else if (error.code === 'ECONNREFUSED') {
      showNotification('Cannot connect to server. Please make sure the backend is running.', 'error');
    } else {
      showNotification(`Error ${operation}: ${error.response?.data?.message || error.message}`, 'error');
    }
  };

  const filteredTasks = tasks.filter(task => {
    // Search filter
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Status filter
    const matchesStatus = statusFilter === "All" || task.status === statusFilter;
    
    // Both conditions must be true
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="List">
      {/* Notification Component */}
      {notification.show && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}

      <div className="headerGroup">
        <div className="Heading">TODO List App</div>
        <div className="heading2">Do it now.</div>
      </div>

      <div className="buttonWrapper">
        <button className="addTaskBtn" onClick={handleOpen}>Add Task</button>
        <button
          className="sortToggleBtnStacked"
          onClick={() => setSortDirection(sortDirection === 'desc' ? 'asc' : 'desc')}
          title={sortDirection === 'desc' ? 'Sort: Completed → Todo' : 'Sort: Todo → Completed'}
        >
          <span className="arrow up" aria-label="Sort Ascending">▲</span>
          <span className="arrow down" aria-label="Sort Descending">▼</span>
        </button>
      </div>

      <div className="searchWrapper">
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="searchInput"
        />
        {searchTerm && (
          <button
            className="clearSearchBtn"
            onClick={() => setSearchTerm("")}
            title="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      <div className="filterWrapper">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="statusFilterDropdown"
        >
          <option value="All">All Status</option>
          <option value="Todo">Todo</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
        {statusFilter !== "All" && (
          <button
            className="clearFilterBtn"
            onClick={() => setStatusFilter("All")}
            title="Clear status filter"
          >
            Clear Filter
          </button>
        )}
      </div>

      {showModal && (
        <div className="modalOverlay">
          <div className="modalContent">
            <h3>{editingTask ? 'Edit Task' : 'Add New Task'}</h3>
            <input
              type="text"
              placeholder="Enter task name"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
            />
            <select
              value={taskStatus}
              onChange={(e) => setTaskStatus(e.target.value)}
              className="statusDropdown"
            >
              <option value="Todo">Todo</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>

            <select 
              value={taskPriority} 
              onChange={(e) => setTaskPriority(e.target.value)}
              className="priorityDropdown"
            >
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="Low">Low Priority</option>
            </select>
            <div className="modalButtons">
              <button onClick={handleClose} className="cancelBtn">Cancel</button>
              {editingTask ? (
                <button className="saveBtn" onClick={handleUpdateTask}>
                  Update
                </button>
              ) : (
                <button className="saveBtn" onClick={handleCreateTask}>
                  Save
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <table className="taskTable">
        <thead>
          <tr>
            <th>No.</th>
            <th>Task Name</th>
            <th>Status</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {filteredTasks.length === 0 ? (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center' }}>
                {searchTerm || statusFilter !== "All" 
                  ? `No tasks found${searchTerm ? ` matching "${searchTerm}"` : ''}${statusFilter !== "All" ? ` with status "${statusFilter}"` : ''}`
                  : 'No tasks found'
                }
              </td>
            </tr>
          ) : (
            [...filteredTasks]
              .sort((a, b) => {
                // First sort by status
                const statusComparison = statusOrder[a.status] - statusOrder[b.status];
                
                // Apply sortDirection to status comparison
                const statusResult = sortDirection === 'desc' ? statusComparison : -statusComparison;
                
                // If status is the same, sort by priority
                if (statusComparison === 0) {
                  return priorityOrder[a.priority] - priorityOrder[b.priority];
                }
                
                return statusResult;
              })
              .map((task, index) => (
                <tr key={task._id}>
                  <td>{index + 1}</td>
                  <td>{task.title}</td>
                  <td>
                    <span className={`status ${task.status.replace(" ", "")}`}>
                      {task.status}
                    </span>
                  </td>
                  <td className="actionCell">
                    <button
                      className="editBtn"
                      onClick={() => handleEdit(task)}
                      title="Edit task"
                    >
                      Edit
                    </button>
                  </td>
                  <td className="actionCell">
                    <button
                      className="deleteBtn"
                      onClick={() => handleDeleteTask(task._id)}
                      title="Delete task"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;
