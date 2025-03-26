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
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchHandler().then((data) => {
      setTasks(data.tasks || []);
    });
  }, [])

  const [searchQuery, setSearchQuery] = useState("");
  const [noResults, setNoResults] = useState(false);

  const handleSearch = () => {
    fetchHandler().then((data) => {
      const filteredTask = data.tasks.filter((viewtasks) => 
        Object.values(viewtasks).some((field)=>
          field.toString().toLowerCase().includes(searchQuery.toLowerCase())
        ))
        setTasks(filteredTask);
        setNoResults(filteredTask.length === 0);
    });
  }

  return (
    <div className="app-container">
      <StandardNav />
      <div className="task-container">
        <header className="header">
          <h1>Task Management</h1>
          <h2>Manage & track volunteer tasks</h2>
          <Link to={"/createtask"}>
          <Button className="create-task-button">+ Create New Task</Button>
          </Link>
        </header>
        <div className="search-container">
          <FiSearch className="search-icon" />
          <input onChange={(e)=> setSearchQuery(e.target.value)} name="search" type="text" placeholder="Search tasks..." className="search-input" />

          <button onClick={handleSearch} className="search-button">Search</button>

        </div>

        {noResults ? (

          <div>
            <p>No Tasks Found</p>
          </div>
        ):(
        <div className="task-grid">
          {tasks.length > 0 ? (
            tasks.map((task, i) => <ViewTasks key={i} viewtasks={task} />)
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
