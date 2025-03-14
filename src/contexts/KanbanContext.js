import React, { createContext, useState, useEffect, useContext } from 'react';
import { getData, setData, dataKeys } from '../data/localStorageUtils';

const KanbanContext = createContext();

export const KanbanProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [draggedTask, setDraggedTask] = useState(null);

  useEffect(() => {
    const storedTasks = getData(dataKeys.TASKS);
    if (storedTasks) {
      setTasks(storedTasks);
    }
  }, []);

  useEffect(() => {
    setData(dataKeys.TASKS, tasks);
  }, [tasks]);

  // Update the setTasks function to ensure state and storage are always in sync
  const updateTasks = (newTasks) => {
    setTasks(newTasks);
    setData(dataKeys.TASKS, newTasks);
  };

  const handleDragStart = (e, task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', task.id);
    e.target.classList.add('dragging');
  };

  const handleDrop = (e, employeeId) => {
    e.preventDefault();
    if (draggedTask) {
      const updatedTasks = tasks.map((task) => {
        if (task.id === draggedTask.id) {
          return { ...task, employeeId };
        }
        return task;
      });
      updateTasks(updatedTasks);
    }
    setDraggedTask(null);
  };

  const getEmployeeTasks = (employeeId) => {
    return tasks.filter(task => {
      const taskEmployeeId = parseInt(task.employeeId, 10);
      const targetEmployeeId = parseInt(employeeId, 10);
      return taskEmployeeId === targetEmployeeId;
    });
  };

  const value = {
    tasks,
    setTasks: updateTasks, // Use the new updateTasks function
    draggedTask,
    setDraggedTask,
    handleDragStart,
    handleDrop,
    getEmployeeTasks,
  };

  return (
    <KanbanContext.Provider value={value}>
      {children}
    </KanbanContext.Provider>
  );
};

export const useKanban = () => {
  return useContext(KanbanContext);
};
