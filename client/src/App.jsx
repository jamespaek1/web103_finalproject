import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { useState, useEffect, createContext } from 'react';
import { ToastProvider } from './components/Toast';
import EventsPage from './pages/EventsPage';
import EventDetailPage from './pages/EventDetailPage';
import RecipesPage from './pages/RecipesPage';
import ProfilePage from './pages/ProfilePage';
import './css/App.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const AuthContext = createContext();

function ProtectedRoute({ user, children }) {
  if (!user) {
    return (
      <div className="login-prompt">
        <h2>Please log in to access this page</h2>
        <a href={`${API_URL}/auth/github`} className="btn-github">Log in with GitHub</a>
      </div>
    );
  }
  return children;
}

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${API_URL}/auth/me`, { credentials: 'include' });
        const data = await res.json();
        setUser(data.user);
      } catch (err) {
        console.error('Auth check failed:', err);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch(`${API_URL}/auth/logout`, { method: 'POST', credentials: 'include' });
      setUser(null);
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  if (loading) {
    return <div className="spinner-container"><div className="spinner"></div><p>Loading...</p></div>;
  }

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <ToastProvider>
        <Router>
          <nav className="navbar">
            <Link to="/" className="nav-title">PotluckHub</Link>
            <div className="nav-links">
              <Link to="/">Events</Link>
              <Link to="/recipes">Recipes</Link>
              {user ? (
                <>
                  <Link to={`/users/${user.id}`}>Profile</Link>
                  <button className="btn-nav-logout" onClick={handleLogout}>Logout</button>
                </>
              ) : (
                <a href={`${API_URL}/auth/github`} className="btn-nav-login">Login with GitHub</a>
              )}
            </div>
          </nav>
          <main className="main-content">
            <Routes>
              <Route path="/" element={<EventsPage />} />
              <Route path="/events/:id" element={
                <ProtectedRoute user={user}>
                  <EventDetailPage />
                </ProtectedRoute>
              } />
              <Route path="/recipes" element={<RecipesPage />} />
              <Route path="/users/:id" element={
                <ProtectedRoute user={user}>
                  <ProfilePage />
                </ProtectedRoute>
              } />
            </Routes>
          </main>
        </Router>
      </ToastProvider>
    </AuthContext.Provider>
  );
}

export default App;