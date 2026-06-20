import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setDropdownOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header-inner">
        <Link to="/" className="logo">
          <div className="logo-icon">E</div>
          <span className="logo-text">EduSphere</span>
        </Link>

        {!user && (
          <nav className="nav-desktop">
            <Link to="/courses" className={`nav-link ${location.pathname === '/courses' ? 'active' : ''}`}>
              Courses
            </Link>
            <Link to="/about" className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`}>
              About Us
            </Link>
            <Link to="/help" className={`nav-link ${location.pathname === '/help' ? 'active' : ''}`}>
              Help
            </Link>
          </nav>
        )}

        {user && (
          <nav className="nav-desktop">
            <Link to="/dashboard" className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}>
              Dashboard
            </Link>
            <Link to="/progress" className={`nav-link ${location.pathname === '/progress' ? 'active' : ''}`}>
              Progress
            </Link>
            <Link to="/quizzes" className={`nav-link ${location.pathname.startsWith('/quiz') ? 'active' : ''}`}>
              Quizzes
            </Link>
            <Link to="/assignments" className={`nav-link ${location.pathname === '/assignments' ? 'active' : ''}`}>
              Assignments
            </Link>
            <Link to="/notifications" className={`nav-link ${location.pathname === '/notifications' ? 'active' : ''}`}>
              Notifications
            </Link>
            <Link to="/certificates" className={`nav-link ${location.pathname === '/certificates' ? 'active' : ''}`}>
              Certificates
            </Link>
            {user.role === 'instructor' && (
              <Link to="/instructor/dashboard" className={`nav-link ${location.pathname.startsWith('/instructor') ? 'active' : ''}`}>
                Instructor
              </Link>
            )}
            {user.role === 'admin' && (
              <Link to="/admin" className={`nav-link ${location.pathname === '/admin' ? 'active' : ''}`}>
                Admin
              </Link>
            )}

          </nav>
        )}

        <div className="header-actions">
          {user ? (
            <div className="user-menu" ref={dropdownRef}>
              <button onClick={() => setDropdownOpen(!dropdownOpen)} className="user-btn">
                <div className="user-avatar">{user.name?.charAt(0).toUpperCase()}</div>
                <span className="user-name">Welcome, {user.name}</span>
                <svg className={`chevron ${dropdownOpen ? 'open' : ''}`} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>

              {dropdownOpen && (
                <div className="dropdown-menu">
                  <div className="dropdown-header">
                    <p>Signed in as</p>
                    <p className="dropdown-email">{user.email}</p>
                    <p className="dropdown-role">{user.role}</p>
                  </div>
                  <div className="dropdown-links">
                    <Link to="/dashboard" className="dropdown-item">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                      </svg>
                      Dashboard
                    </Link>
                    <Link to="/progress" className="dropdown-item">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                      </svg>
                      My Progress
                    </Link>
                    <Link to="/certificates" className="dropdown-item">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>
                      </svg>
                      Certificates
                    </Link>
                    {user.role === 'admin' && (
                      <Link to="/admin" className="dropdown-item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.816 2.87 2.402l-1.204 6.047m-5.292-2.465a3.536 3.536 0 012.044-1.876c.476.09 1.072.42 1.56.92l2.582 3.423m0 0l2.572-3.423a3.536 3.536 0 011.56-.921c.974 0 1.55.786 1.55 1.756V19.5a2 2 0 01-2 2h-1C9.224 21.5 8.5 20.786 8.5 19.5v-3.756a1.724 1.724 0 011.573-1.876c.426.156.92.42 1.56.92l2.582-3.423"/>
                        </svg>
                        Admin Panel
                      </Link>
                    )}
                  </div>
                  <div className="dropdown-divider"></div>
                  <button onClick={handleLogout} className="dropdown-item danger">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                    </svg>
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="btn-outline" style={{ marginRight: '0.5rem' }}>Log in</Link>
              <Link to="/register" className="btn-primary">Register</Link>
            </>
          )}

          {user && (
            <button onClick={() => setDropdownOpen(!dropdownOpen)} className="mobile-menu-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
            </button>
          )}
        </div>
      </div>

      {user && dropdownOpen && (
        <nav className="mobile-nav">
          <Link to="/dashboard" className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}>
            Dashboard
          </Link>
          <Link to="/progress" className={`nav-link ${location.pathname === '/progress' ? 'active' : ''}`}>
            Progress
          </Link>
          <Link to="/quizzes" className={`nav-link ${location.pathname.startsWith('/quiz') ? 'active' : ''}`}>
            Quizzes
          </Link>
          <Link to="/assignments" className={`nav-link ${location.pathname === '/assignments' ? 'active' : ''}`}>
            Assignments
          </Link>
          <Link to="/notifications" className={`nav-link ${location.pathname === '/notifications' ? 'active' : ''}`}>
            Notifications
          </Link>
          <Link to="/certificates" className={`nav-link ${location.pathname === '/certificates' ? 'active' : ''}`}>
            Certificates
          </Link>
          {user.role === 'admin' && (
            <Link to="/admin" className={`nav-link ${location.pathname === '/admin' ? 'active' : ''}`}>
              Admin
            </Link>
          )}
          {user.role === 'instructor' && (
            <Link to="/instructor/dashboard" className={`nav-link ${location.pathname.startsWith('/instructor') ? 'active' : ''}`}>
              Instructor
            </Link>
          )}
        </nav>
      )}
    </header>
  );
}
