import React from 'react';
import AdminTabs from '../components/Admin/AdminTabs';

const AdminPage = ({ tasks }) => {
  return (
    <div className="h-full">
      <AdminTabs tasks={tasks} />
    </div>
  );
};

export default AdminPage; 