import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import EventsPage from './pages/EventsPage';
import EventDetailPage from './pages/EventDetailPage.jsx';
import RecipesPage from './pages/RecipesPage';
import ProfilePage from './pages/ProfilePage';
import './css/App.css';

function App() {
  return (
    <Router>
      <nav className="navbar">
        <Link to="/" className="nav-title">PotluckHub</Link>
        <div className="nav-links">
          <Link to="/">Events</Link>
          <Link to="/recipes">Recipes</Link>
          <Link to="/users/1">Profile</Link>
        </div>
      </nav>
      <main className="main-content">
        <Routes>
          <Route path="/" element={<EventsPage />} />
          <Route path="/events/:id" element={<EventDetailPage />} />
          <Route path="/recipes" element={<RecipesPage />} />
          <Route path="/users/:id" element={<ProfilePage />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;