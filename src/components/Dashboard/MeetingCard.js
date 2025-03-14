import React from 'react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

const MeetingCard = ({ meeting, employees }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-slate-800/30 to-slate-900/30 rounded-lg border border-slate-700/30 overflow-hidden"
    >
      <div className="flex items-center">
        {/* Date Display */}
        <div className="w-24 bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 p-3 flex flex-col items-center justify-center text-center">
          <div className="text-2xl font-bold text-purple-300">
            {format(new Date(meeting.datetime), 'dd')}
          </div>
          <div className="text-xs font-medium text-purple-200 uppercase">
            {format(new Date(meeting.datetime), 'MMM')}
          </div>
          <div className="mt-1 text-sm font-semibold text-purple-100">
            {format(new Date(meeting.datetime), 'HH:mm')}
          </div>
        </div>

        {/* Meeting Info */}
        <div className="flex-1 p-3">
          <h4 className="font-medium text-slate-200 truncate">{meeting.title}</h4>
          <div className="flex items-center mt-2 space-x-2">
            <div className="flex -space-x-2">
              {meeting.participants?.slice(0, 3).map((participantId) => {
                const employee = employees.find(emp => emp.id === participantId);
                return employee ? (
                  <div
                    key={participantId}
                    className="w-6 h-6 rounded-full border-2 border-slate-800 overflow-hidden"
                    style={{
                      background: `linear-gradient(135deg, ${employee.color || '#6B7280'}, ${adjustColor(employee.color || '#6B7280', -30)})`
                    }}
                  >
                    <img
                      src={employee.profile_picture || '/default-avatar.png'}
                      alt={employee.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : null;
              })}
            </div>
            {meeting.participants?.length > 3 && (
              <span className="text-xs text-slate-400">
                +{meeting.participants.length - 3}
              </span>
            )}
            <span className="text-xs text-slate-500 ml-2">
              {meeting.duration}min
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MeetingCard;
