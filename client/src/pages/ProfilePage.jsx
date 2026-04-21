import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Spinner from '../components/Spinner';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

function ProfilePage() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/api/users/${id}`);
        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error('Error fetching user:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  if (loading) return <Spinner />;
  if (!user) return <p>User not found</p>;

  return (
    <div className="page">
      <div className="profile-header">
        {user.avatar_url ? (
          <img src={user.avatar_url} alt={user.name} className="avatar-img" />
        ) : (
          <div className="avatar">{user.name.charAt(0)}</div>
        )}
        <div>
          <h2>{user.name}</h2>
          <p className="card-subtitle">{user.email}</p>
          <p className="card-meta">{user.bio}</p>
        </div>
      </div>

      <div className="section">
        <h3>Hosting ({user.hosted_events?.length || 0})</h3>
        <div className="card-list">
          {user.hosted_events?.map((event) => (
            <Link to={`/events/${event.id}`} key={event.id} className="card card-link">
              <h4 className="card-title">{event.title}</h4>
              <p className="card-meta">
                {new Date(event.event_date).toLocaleDateString()} · {event.location}
              </p>
            </Link>
          ))}
          {user.hosted_events?.length === 0 && <p className="empty-state">Not hosting any events</p>}
        </div>
      </div>

      <div className="section">
        <h3>RSVPed ({user.rsvped_events?.length || 0})</h3>
        <div className="card-list">
          {user.rsvped_events?.map((event) => (
            <Link to={`/events/${event.id}`} key={event.id} className="card card-link">
              <h4 className="card-title">{event.title}</h4>
              <p className="card-meta">
                {new Date(event.event_date).toLocaleDateString()} · {event.location}
              </p>
            </Link>
          ))}
          {user.rsvped_events?.length === 0 && <p className="empty-state">No RSVPs yet</p>}
        </div>
      </div>

      <div className="section">
        <h3>Claimed dishes ({user.claimed_dishes?.length || 0})</h3>
        <div className="dish-list">
          {user.claimed_dishes?.map((dish) => (
            <div key={dish.id} className="dish-item">
              <div>
                <p className="dish-name">{dish.recipe_name}</p>
                <p className="dish-meta">For: {dish.event_title}</p>
              </div>
            </div>
          ))}
          {user.claimed_dishes?.length === 0 && <p className="empty-state">No dishes claimed</p>}
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;