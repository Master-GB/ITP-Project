import React, { useState, useEffect } from "react";
import axios from "axios";
import ViewTasks from "./ViewTasks";
import { Button } from "./CNTButton";
import StandardNav from "./Nav"; // Import the updated Nav component
import { FiSearch } from "react-icons/fi";
import "./Task.css";
import { Link } from 'react-router-dom';

const URL = "http://localhost:8090/tasks";

const fetchHandler = async () => {
  try {
    const res = await axios.get(URL);
    return res.data;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return { tasks: [] };
  }
};

function Task() {
  const [allTasks, setAllTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [noResults, setNoResults] = useState(false);
  const [sortBy, setSortBy] = useState("none"); // none, priority, status
  const [sortOrder, setSortOrder] = useState("asc"); // asc, desc

  useEffect(() => {
    fetchHandler().then((data) => {
      setAllTasks(data.tasks || []);
      setFilteredTasks(data.tasks || []);
    });
  }, []);

  // Auto-search effect
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredTasks(allTasks);
      setNoResults(false);
      return;
    }

    const filtered = allTasks.filter((task) => 
      Object.values(task).some((field) =>
        field && field.toString().toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
    
    setFilteredTasks(filtered);
    setNoResults(filtered.length === 0);
  }, [searchQuery, allTasks]);

  const handleSort = (sortType) => {
    setSortBy(sortType);
    const sortedTasks = [...filteredTasks].sort((a, b) => {
      if (sortType === "priority") {
        const priorityOrder = { High: 3, Medium: 2, Low: 1 };
        const aValue = priorityOrder[a.priority || "Low"];
        const bValue = priorityOrder[b.priority || "Low"];
        return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
      } else if (sortType === "status") {
        const statusOrder = { Completed: 4, Ongoing: 3, Pending: 2, Rejected: 1 };
        const aValue = statusOrder[a.status || "Pending"];
        const bValue = statusOrder[b.status || "Pending"];
        return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
      }
      return 0;
    });
    setFilteredTasks(sortedTasks);
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    handleSort(sortBy);
  };

  return (
    <div className="task-app-container">
      <StandardNav />
      <div className="task-container">
        <header className="task-header">
          <h1>Task Management</h1>
          <h2>Manage & track volunteer tasks</h2>
          <Link to={"/createtask"}>
            <Button className="create-task-button">+ Create New Task</Button>
          </Link>
        </header>

        <div className="task-controls">
          <div className="task-search-container">
            <FiSearch className="task-search-icon" />
            <input 
              onChange={(e) => setSearchQuery(e.target.value)}
              value={searchQuery}
              name="search" 
              type="text" 
              placeholder="Search tasks..." 
              className="task-search-input" 
            />
          </div>

          <div className="task-sort-container">
            <select 
              value={sortBy} 
              onChange={(e) => handleSort(e.target.value)}
              className="task-sort-select"
            >
              <option value="none">Sort by...</option>
              <option value="priority">Priority</option>
              <option value="status">Status</option>
            </select>
            {sortBy !== "none" && (
              <button 
                onClick={toggleSortOrder} 
                className="task-sort-order-button"
              >
                {sortOrder === "asc" ? "↑ Ascending" : "↓ Descending"}
              </button>
            )}
          </div>
        </div>

        {noResults ? (
          <div className="no-results">
            <p>No Tasks Found</p>
          </div>
        ) : (
          <div className="task-grid">
            {filteredTasks.length > 0 ? (
              filteredTasks.map((task, i) => <ViewTasks key={i} viewtasks={task} />)
            ) : (
              <p className="no-tasks">No tasks available</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Task;
