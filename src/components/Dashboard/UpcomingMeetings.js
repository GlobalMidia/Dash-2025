import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

const UpcomingMeetings = ({ meetings = [], employees = [] }) => {
  // Sort meetings by date and time
  const upcomingMeetings = (meetings || [])
    .filter(meeting => meeting && meeting.datetime && new Date(meeting.datetime) > new Date())
    .sort((a, b) => new Date(a.datetime || Date.now()) - new Date(b.datetime || Date.now()));
  
  // Find employee by ID to get profile picture and details
  const getEmployeeDetails = (employeeId) => {
    if (!employeeId || !employees) return { profilePic: null, name: 'Unknown', color: '#4B5563' };
    
    const employee = employees.find(emp => emp && emp.id === employeeId);
    return employee 
      ? { 
          profilePic: employee.profile_picture,
          name: employee.name || 'Unknown',
          color: employee.color || '#4B5563'
        }
      : { profilePic: null, name: 'Unknown', color: '#4B5563' };
  };
  
  return (
    <div className="h-full">
      <div className="h-[calc(100%-2rem)] overflow-y-auto pr-2">
        <div className="grid grid-cols-1 auto-rows-min gap-3">
          {upcomingMeetings && upcomingMeetings.length > 0 ? (
            upcomingMeetings.map((meeting, index) => {
              if (!meeting) return null;
              
              const meetingTitle = meeting.title || 'Untitled Meeting';
              const meetingDuration = meeting.duration || '?';
              const participants = meeting.participants || [];
              
              return (
                <motion.div
                  key={meeting.id || `meeting-${Math.random()}`}
                  className="bg-gradient-to-r from-slate-800/30 to-slate-900/30 rounded-lg border border-slate-700/30 hover:border-purple-500/20 transition-all duration-300"
                  whileHover={{ y: -2, boxShadow: '0 8px 16px -6px rgba(0, 0, 0, 0.3)' }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <div className="flex items-center">
                    {/* Enhanced Date Display */}
                    <div className="w-16 bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 p-2 h-full flex flex-col items-center justify-center text-center rounded-l-lg border-r border-purple-500/20">
                      <div className="text-xl font-bold text-purple-300">
                        {format(new Date(meeting.datetime), 'dd')}
                      </div>
                      <div className="text-[0.65rem] font-medium text-purple-200 uppercase tracking-wider">
                        {format(new Date(meeting.datetime), 'MMM')}
                      </div>
                      <div className="mt-1 text-sm font-medium text-purple-100">
                        {format(new Date(meeting.datetime), 'HH:mm')}
                      </div>
                    </div>

                    {/* Meeting Info */}
                    <div className="flex-1 min-w-0 p-2">
                      <h3 className="text-sm font-semibold text-slate-100 truncate pr-6">{meetingTitle}</h3>
                      
                      {/* Participants */}
                      <div className="flex items-center mt-2">
                        <div className="flex -space-x-2">
                          {participants.slice(0, 4).map((participantId) => {
                            const { profilePic, name, color } = getEmployeeDetails(participantId);
                            return (
                              <div
                                key={participantId}
                                className="w-6 h-6 rounded-full border-2 border-slate-800 overflow-hidden"
                                style={{
                                  background: `linear-gradient(135deg, ${color}, ${adjustColor(color, -30)})`
                                }}
                                title={name}
                              >
                                {profilePic ? (
                                  <img
                                    src={profilePic}
                                    alt={name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <span className="text-[0.65rem] font-bold text-white">
                                      {name.charAt(0)}
                                    </span>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                        {participants.length > 4 && (
                          <span className="text-xs text-slate-400 ml-1">
                            +{participants.length - 4}
                          </span>
                        )}
                        <span className="text-[0.65rem] text-slate-400 ml-auto">
                          {meetingDuration}min
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="text-center text-slate-400 py-4">
              Nenhuma reunião encontrada.
            </div>
          )}
        </div>
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

export default UpcomingMeetings;
