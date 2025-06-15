import React from 'react';

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <div style={{ padding: '2rem', color: '#fff', background: '#111', minHeight: '100vh' }}>
      <h1>Welcome, {user?.name || 'User'}! 💪</h1>
      <p>This is your dashboard.</p>
    </div>
  );
};

export default Dashboard;
