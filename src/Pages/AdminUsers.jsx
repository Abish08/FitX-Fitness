// // src/Pages/AdminUsers.jsx
// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { getAllUsers, deleteUser, updateUserRole } from '../services/api';
// import '../Styles/AdminUsers.css';

// const AdminUsers = () => {
//   const navigate = useNavigate();
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Load real users from backend
//   useEffect(() => {
//     const loadUsers = async () => {
//       try {
//         const result = await getAllUsers();
//         if (result.success) {
//           setUsers(result.data.users);
//         } else {
//           console.error('Failed to load users:', result.message);
//         }
//       } catch (err) {
//         console.error('Error fetching users:', err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadUsers();
//   }, []);

//   const handleDelete = async (userId) => {
//     if (window.confirm('Are you sure you want to delete this user?')) {
//       const result = await deleteUser(userId);
//       if (result.success) {
//         setUsers(users.filter(u => u.id !== userId));
//       } else {
//         alert('Failed to delete user');
//       }
//     }
//   };

//   const handleRoleChange = async (userId, newRole) => {
//     const result = await updateUserRole(userId, newRole);
//     if (result.success) {
//       setUsers(users.map(u => (u.id === userId ? { ...u, role: newRole } : u)));
//     } else {
//       alert('Failed to update role');
//     }
//   };

//   // ✅ Fixed: Proper logout function
//   const handleLogout = () => {
//     localStorage.removeItem('token'); // 🔐 Remove token
//     navigate('/admin-login');         // 🚪 Redirect
//   };

//   return (
//     <div className="admin-users">
//       {/* Admin Header */}
//       <header className="admin-header-nav">
//         <div className="admin-nav-container">
//           <div className="admin-brand">
//             <div className="admin-brand-icon">🦊</div>
//             <div className="admin-brand-text">
//               <h1 className="admin-brand-title">FitX Admin</h1>
//               <span className="admin-brand-subtitle">User Management</span>
//             </div>
//           </div>

//           <nav className="admin-nav-tabs">
//             <button className="admin-tab" onClick={() => navigate('/admin-dashboard')}>
//               <span className="tab-icon">📊</span>
//               <span className="tab-text">Overview</span>
//             </button>
//             <button className="admin-tab active">
//               <span className="tab-icon">👥</span>
//               <span className="tab-text">Users</span>
//             </button>
//             <button className="admin-tab" onClick={() => navigate('/admin/exercise-library')}>
//               <span className="tab-icon">📚</span>
//               <span className="tab-text">Content</span>
//             </button>
//           </nav>

//           <div className="admin-user-section">
//             <div className="admin-user-info">
//               <div className="admin-user-avatar">A</div>
//               <div className="admin-user-details">
//                 <span className="admin-user-name">Admin User</span>
//                 <span className="admin-user-role">Admin</span>
//               </div>
//             </div>
//             {/* ✅ Fixed: Now actually logs out */}
//             <button className="admin-logout-btn" onClick={handleLogout}>
//               <span className="logout-icon">🚪</span>
//               <span className="logout-text">Logout</span>
//             </button>
//           </div>
//         </div>
//       </header>

//       <div className="admin-layout">
//         <main className="admin-main">
//           <section className="admin-panel-section">
//             <h2 className="section-title">All Users</h2>
//             {loading ? (
//               <div className="loading-container">
//                 <div className="loading-spinner"></div>
//                 <p>Loading users...</p>
//               </div>
//             ) : (
//               <div className="user-list">
//                 {Array.isArray(users) && users.length > 0 ? (
//                   users.map(user => (
//                     <div key={user.id} className="user-item">
//                       <div className="user-info">
//                         <span className="user-email">{user.email}</span>
//                         <span className="user-role">{user.role}</span>
//                         <span className="user-last-active">
//                           Joined: {new Date(user.createdAt).toLocaleDateString()}
//                         </span>
//                       </div>
//                       <div className="user-actions">
//                         <select
//                           value={user.role}
//                           onChange={(e) => handleRoleChange(user.id, e.target.value)}
//                           className="action-btn-small"
//                         >
//                           <option value="user">User</option>
//                           <option value="admin">Admin</option>
//                         </select>
//                         <button
//                           onClick={() => handleDelete(user.id)}
//                           className="action-btn-small delete"
//                         >
//                           Delete
//                         </button>
//                       </div>
//                     </div>
//                   ))
//                 ) : (
//                   <p className="no-users">No users found.</p>
//                 )}
//               </div>
//             )}
//           </section>
//         </main>
//       </div>
//     </div>
//   );
// };

// export default AdminUsers;



// src/Pages/AdminUsers.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllUsers, updateUserRole, deleteUser } from '../services/api';
import '../Styles/AdminUsers.css';

const AdminUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

useEffect(() => {
  const loadUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const result = await getAllUsers();

      if (result.success && Array.isArray(result.data?.users)) {
        setUsers(result.data.users); // ✅ Now works
      } else {
        setError(result.message || 'Failed to load users');
      }
    } catch (err) {
      setError('Network error. Could not fetch users.');
    } finally {
      setLoading(false);
    }
  };

  loadUsers();
}, []);

  // Filter users based on search term
  const filteredUsers = users.filter((user) =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.firstName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (user.lastName?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  // Handle role change (Update)
  const handleRoleChange = async (userId, newRole) => {
    if (!window.confirm(`Change this user to ${newRole}?`)) return;

    try {
      const result = await updateUserRole(userId, newRole);
      if (result.success) {
        // Update local state
        setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
        setSuccess('User role updated successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(result.message || 'Failed to update role');
      }
    } catch (err) {
      setError('Error updating role. Please try again.');
    }
  };

  // Handle delete user (Delete)
  const handleDelete = async (user) => {
    if (!window.confirm(`Delete user: ${user.email}? This cannot be undone.`)) return;

    try {
      const result = await deleteUser(user.id);
      if (result.success) {
        setUsers(users.filter(u => u.id !== user.id));
        setSuccess(`User ${user.email} deleted successfully!`);
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(result.message || 'Failed to delete user');
      }
    } catch (err) {
      setError('Error deleting user. Please try again.');
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/admin-login');
  };

  return (
    <div className="admin-users">
      {/* Admin Header */}
      <header className="admin-header-nav">
        <div className="admin-nav-container">
          <div className="admin-brand">
            <div className="admin-brand-icon">🦊</div>
            <div className="admin-brand-text">
              <h1 className="admin-brand-title">FitX Admin</h1>
              <span className="admin-brand-subtitle">User Management</span>
            </div>
          </div>

          <nav className="admin-nav-tabs">
            <button className="admin-tab" onClick={() => navigate('/admin-dashboard')}>
              <span className="tab-icon">📊</span>
              <span className="tab-text">Overview</span>
            </button>
            <button className="admin-tab active">
              <span className="tab-icon">👥</span>
              <span className="tab-text">Users</span>
            </button>
            <button className="admin-tab" onClick={() => navigate('/admin/exercise-library')}>
              <span className="tab-icon">📚</span>
              <span className="tab-text">Content</span>
            </button>
          </nav>

          <div className="admin-user-section">
            <button className="admin-logout-btn" onClick={handleLogout}>
              <span className="logout-icon">🚪</span>
              <span className="logout-text">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="admin-layout">
        <main className="admin-main">
          <section className="admin-panel-section">

            {/* Success & Error Messages */}
            {success && <div className="message success">{success}</div>}
            {error && <div className="message error">{error}</div>}

            {/* Search Box */}
            <div className="search-box">
              <input
                type="text"
                placeholder="Search users by email or name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>

            {/* Loading State */}
            {loading ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading users...</p>
              </div>
            ) : filteredUsers.length === 0 ? (
              <p className="no-users">No users found.</p>
            ) : (
              /* User List */
              <div className="user-list">
                {filteredUsers.map(user => (
                  <div key={user.id} className="user-item">
                    <div className="user-info">
                      <strong>{user.firstName} {user.lastName}</strong>
                      <span>{user.email}</span>
                      <span className={`badge role-${user.role}`}>{user.role.toUpperCase()}</span>
                      <small>Joined: {new Date(user.createdAt).toLocaleDateString()}</small>
                    </div>
                    <div className="user-actions">
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        className="action-btn-small"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                      <button
                        onClick={() => handleDelete(user)}
                        className="action-btn-small delete"
                        disabled={user.role === 'admin' && users.filter(u => u.role === 'admin').length === 1}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
};

export default AdminUsers;