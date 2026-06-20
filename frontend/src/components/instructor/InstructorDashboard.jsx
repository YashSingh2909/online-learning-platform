import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

const navItems = [
  { to: '/instructor/dashboard', label: 'Dashboard', icon: 'D' },
  { to: '/instructor/courses', label: 'My Courses', icon: 'C' },
  { to: '/instructor/create-course', label: 'Create Course', icon: '+' },
  { to: '/profile', label: 'Profile', icon: 'P' },
];

export default function InstructorDashboard() {
  return (
    <div className="dashboard-page">
      <div className="dashboard-bg">
        <div className="dashboard-orb dashboard-orb-1"></div>
        <div className="dashboard-orb dashboard-orb-2"></div>
      </div>

      <div className="dashboard-container">
        <div className="instructor-layout">
          <aside className="instructor-sidebar">
            <div className="sidebar-card">
              <p className="sidebar-label">Instructor</p>
              <h2 className="sidebar-title">Studio</h2>
              <p className="sidebar-text">Manage your courses, lessons, quizzes and assignments.</p>
              <nav className="sidebar-actions">
                {navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) => (isActive ? 'sidebar-action' : 'sidebar-action-outline')}
                  >
                    <span style={{ marginRight: '0.5rem' }}>{item.icon}</span>
                    {item.label}
                  </NavLink>
                ))}
              </nav>
            </div>
          </aside>

          <main className="instructor-content">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
