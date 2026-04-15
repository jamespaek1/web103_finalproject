import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ClaimModal from '../components/ClaimModal';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

function EventDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', event_date: '', event_time: '', location: '' });

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      const res = await fetch(`${API_URL}/api/events/${id}`);
      const data = await res.json();
      setEvent(data);
      setForm({
        title: data.title,
        description: data.description,
        event_date: data.event_date?.split('T')[0] || '',
        event_time: data.event_time,
        location: data.location
      });
    } catch (err) {
      console.error('Error fetching event:', err);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await fetch(`${API_URL}/api/events/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      setEditing(false);
      fetchEvent();
    } catch (err) {
      console.error('Error updating event:', err);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    try {
      await fetch(`${API_URL}/api/events/${id}`, { method: 'DELETE' });
      navigate('/');
    } catch (err) {
      console.error('Error deleting event:', err);
    }
  };

  const handleUnclaim = async (dishId) => {
    try {
      await fetch(`${API_URL}/api/event-dishes/${dishId}`, { method: 'DELETE' });
      fetchEvent();
    } catch (err) {
      console.error('Error unclaiming dish:', err);
    }
  };

  if (!event) return <p>Loading...</p>;

  return (
    <div className="page">
      <button className="btn-link" onClick={() => navigate('/')}>← Back to events</button>

      {editing ? (
        <form className="form-card" onSubmit={handleUpdate}>
          <input type="text" value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <textarea value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <input type="date" value={form.event_date}
            onChange={(e) => setForm({ ...form, event_date: e.target.value })} required />
          <input type="time" value={form.event_time}
            onChange={(e) => setForm({ ...form, event_time: e.target.value })} required />
          <input type="text" value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })} required />
          <div className="form-actions">
            <button type="submit" className="btn-primary">Save</button>
            <button type="button" className="btn-secondary" onClick={() => setEditing(false)}>Cancel</button>
          </div>
        </form>
      ) : (
        <>
          <div className="detail-header">
            <div>
              <h2>{event.title}</h2>
              <p className="card-subtitle">Hosted by {event.host_name}</p>
              <p className="card-meta">
                {new Date(event.event_date).toLocaleDateString()} · {event.event_time} · {event.location}
              </p>
              <p className="detail-description">{event.description}</p>
            </div>
            <div className="detail-actions">
              <button className="btn-secondary" onClick={() => setEditing(true)}>Edit</button>
              <button className="btn-danger" onClick={handleDelete}>Delete</button>
            </div>
          </div>

          <div className="badge-success">{event.rsvps?.length || 0} attending</div>

          <div className="section">
            <div className="section-header">
              <h3>Claimed dishes</h3>
              <button className="btn-primary" onClick={() => setShowModal(true)}>+ Claim a dish</button>
            </div>
            <div className="dish-list">
              {event.dishes?.map((dish) => (
                <div key={dish.id} className="dish-item">
                  <div>
                    <p className="dish-name">{dish.recipe_name}</p>
                    <p className="dish-meta">{dish.category} · Claimed by {dish.claimed_by_name}</p>
                  </div>
                  <button className="btn-small btn-secondary" onClick={() => handleUnclaim(dish.id)}>Unclaim</button>
                </div>
              ))}
              {event.dishes?.length === 0 && <p className="empty-state">No dishes claimed yet</p>}
            </div>
          </div>

          <div className="section">
            <h3>RSVPs</h3>
            <div className="rsvp-list">
              {event.rsvps?.map((rsvp) => (
                <span key={rsvp.id} className="rsvp-badge">{rsvp.user_name}</span>
              ))}
            </div>
          </div>
        </>
      )}

      {showModal && (
        <ClaimModal
          eventId={id}
          onClose={() => setShowModal(false)}
          onClaimed={fetchEvent}
        />
      )}
    </div>
  );
}

export default EventDetailPage;