import React from 'react';
import { motion } from 'framer-motion';
import { format, formatDistanceToNow } from 'date-fns';

const TaskHistoryFeed = ({ taskHistory = [], getEmployeeColor = () => '#4B5563' }) => {
  // Sort task history by date (newest first)
  const sortedHistory = [...(taskHistory || [])].sort((a, b) => {
    return new Date(b.timestamp || Date.now()) - new Date(a.timestamp || Date.now());
  });
  
  return (
    <div className="h-full">
      <div className="h-[calc(100%-2rem)] overflow-y-auto pr-2">
        {sortedHistory && sortedHistory.length > 0 ? (
          <ul className="space-y-3">
            {sortedHistory.map((item, index) => {
              if (!item) return null; // Skip invalid items
              
              const employeeName = item.employeeName || 'Unknown Employee';
              const employeeId = item.employeeId;
              const employeeFirstLetter = employeeName.charAt(0) || '?';
              const taskName = item.taskName || 'Unknown Task';
              const timestamp = item.timestamp ? new Date(item.timestamp) : new Date();
              const action = item.action || 'updated';
              const itemId = item.id || `task-history-${index}`;
              const employeeColor = getEmployeeColor && employeeId ? getEmployeeColor(employeeId) : '#4B5563';
              
              return (
                <motion.li
                  key={itemId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="glass-card px-2.5 py-1 hover:bg-slate-800/50 transition-all duration-300"
                >
                  <div className="flex items-center space-x-2.5">
                    <div 
                      className="w-6 h-6 rounded-full flex items-center justify-center shadow-sm"
                      style={{ 
                        background: `linear-gradient(135deg, ${employeeColor}, ${adjustColor(employeeColor, -30)})` 
                      }}
                    >
                      <span className="text-[0.8rem] font-bold text-white">{employeeFirstLetter}</span>
                    </div>
                    <div className="flex-1 min-w-0 grid grid-cols-[minmax(0,1fr)_auto] gap-x-2">
                      <p className="text-[0.8rem] text-slate-200 line-clamp-1">
                        <span 
                          className="font-medium" 
                          style={{ color: employeeColor }}
                        >
                          {employeeName}
                        </span>{' '}
                        <span className="text-slate-300">{action}</span>{' '}
                        <span className="text-slate-200">{taskName}</span>
                      </p>
                      <p className="text-[0.8rem] text-slate-400 text-right whitespace-nowrap">
                        {formatDistanceToNow(timestamp)} atrás
                      </p>
                    </div>
                  </div>
                </motion.li>
              );
            })}
          </ul>
        ) : (
          <div className="p-6 text-center text-slate-400 glass-card">
            Nenhuma tarefa disponível no histórico.
          </div>
        )}
      </div>
    </div>
  );
};

// Helper function to adjust color brightness
const adjustColor = (color, amount) => {
  return '#' + color.replace(/^#/, '').replace(/../g, color => 
    ('0' + Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2)
  );
};

export default TaskHistoryFeed;
