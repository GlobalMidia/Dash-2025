import React from 'react';
import { motion } from 'framer-motion';
import { format, isAfter, isBefore, addDays } from 'date-fns';

const DeadlinesSection = ({ tasks = [], employees = [] }) => {
  // Get tasks with deadlines and sort by deadline
  const tasksWithDeadlines = (tasks || [])
    .filter(task => task && task.deadline && task.status !== 'Complete')
    .sort((a, b) => new Date(a.deadline || Date.now()) - new Date(b.deadline || Date.now()));
  
  // Function to determine the status of a deadline
  const getDeadlineStatus = (deadline) => {
    if (!deadline) return 'neutral';
    
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const sevenDaysFromNow = addDays(today, 7);
    const twoDaysFromNow = addDays(today, 2);
    
    if (isBefore(deadlineDate, today)) {
      return 'overdue'; // Past deadline
    } else if (isBefore(deadlineDate, twoDaysFromNow)) {
      return 'urgent'; // 0-2 days away
    } else if (isBefore(deadlineDate, sevenDaysFromNow)) {
      return 'approaching'; // 2-7 days away
    } else {
      return 'neutral'; // More than 7 days away
    }
  };
  
  // Function to get status color for dark theme
  const getStatusColor = (status) => {
    switch (status) {
      case 'overdue':
        return {
          bg: 'bg-gradient-to-r from-red-900/70 to-rose-900/70',
          border: 'border-red-700/50',
          text: 'text-red-100'
        };
      case 'urgent':
        return {
          bg: 'bg-gradient-to-r from-amber-900/70 to-orange-900/70',
          border: 'border-amber-700/50',
          text: 'text-amber-100'
        };
      case 'approaching':
        return {
          bg: 'bg-gradient-to-r from-yellow-900/70 to-amber-800/70',
          border: 'border-yellow-700/50',
          text: 'text-yellow-100'
        };
      default:
        return {
          bg: 'bg-gradient-to-r from-slate-800/70 to-slate-900/70',
          border: 'border-slate-700/50',
          text: 'text-slate-200'
        };
    }
  };
  
  // Function to get the assigned employee name
  const getEmployeeName = (employeeId) => {
    if (!employeeId || !employees) return 'Unassigned';
    
    const employee = employees.find(employee => employee && employee.id === employeeId);
    return employee ? employee.name : 'Unassigned';
  };
  
  return (
    <div className="h-full">
      <div className="h-[calc(100%-2rem)] overflow-y-auto pr-2">
        <div className="grid grid-cols-2 auto-rows-min gap-3">
          {tasksWithDeadlines && tasksWithDeadlines.length > 0 ? (
            tasksWithDeadlines.map((task, index) => {
              if (!task) return null;
              
              const deadlineStatus = getDeadlineStatus(task.deadline);
              const statusColor = getStatusColor(deadlineStatus);
              const deadlineDate = task.deadline ? new Date(task.deadline) : new Date();
              const taskTitle = task.title || 'Untitled Task';
              const employeeName = getEmployeeName(task.assignedTo);
              
              return (
                <motion.div
                  key={task.id || `task-${Math.random()}`}
                  className={`glass-card p-2 rounded-lg shadow-lg border ${statusColor.border} backdrop-blur-md overflow-hidden h-20`}
                  whileHover={{ scale: 1.03, y: -3 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <div className="relative h-full">
                    <div className={`absolute inset-0 ${statusColor.bg} opacity-30 rounded-lg -m-2`}></div>
                    <div className="flex items-start justify-between relative z-10 h-full">
                      <div className="flex-1 pr-2">
                        <h3 className={`text-sm font-semibold mb-0.5 line-clamp-2 ${statusColor.text}`}>{taskTitle}</h3>
                        <p className="text-[0.65rem] opacity-90 text-slate-300 line-clamp-1">
                          Atribuído para: <span className="font-medium">{employeeName}</span>
                        </p>
                      </div>
                      
                      <div className="deadline-date flex flex-col items-center justify-center bg-slate-800/80 shadow-lg rounded-md p-1.5 w-10 h-10 border border-slate-700/30">
                        <span className="text-base font-bold leading-none">
                          {format(deadlineDate, 'd')}
                        </span>
                        <span className="text-[0.6rem] uppercase mt-0.5 leading-none">
                          {format(deadlineDate, 'MMM')}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="glass-card p-6 text-center text-slate-400">
              Nenhuma deadline encontrada.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeadlinesSection;
