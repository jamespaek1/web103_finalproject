import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

function EventsPage() {
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ host_id: 1, title: '', description: '', event_date: '', event_time: '', location: '' });
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await fetch(`${API_URL}/api/events`);
      const data = await res.json();
      setEvents(data);
    } catch (err) {
      console.error('Error fetching events:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        setForm({ host_id: 1, title: '', description: '', event_date: '', event_time: '', location: '' });
        setShowForm(false);
        fetchEvents();
      }
    } catch (err) {
      console.error('Error creating event:', err);
    }
  };

  const handleRsvp = async (eventId) => {
    try {
      await fetch(`${API_URL}/api/rsvps`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: 1, event_id: eventId })
      });
      fetchEvents();
    } catch (err) {
      console.error('Error RSVPing:', err);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h2>Upcoming events</h2>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          + Create event
        </button>
      </div>

      {showForm && (
        <form className="form-card" onSubmit={handleSubmit}>
          <input type="text" placeholder="Event title" value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <textarea placeholder="Description" value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <input type="date" value={form.event_date}
            onChange={(e) => setForm({ ...form, event_date: e.target.value })} required />
          <input type="time" value={form.event_time}
            onChange={(e) => setForm({ ...form, event_time: e.target.value })} required />
          <input type="text" placeholder="Location" value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })} required />
          <div className="form-actions">
            <button type="submit" className="btn-primary">Create</button>
            <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </form>
      )}

      <div className="card-list">
        {events.map((event) => (
          <div key={event.id} className="card">
            <div className="card-row">
              <div>
                <h3 className="card-title">{event.title}</h3>
                <p className="card-subtitle">Hosted by {event.host_name}</p>
                <p className="card-meta">
                  {new Date(event.event_date).toLocaleDateString()} · {event.event_time} · {event.location}
                </p>
              </div>
              <div className="card-stats">
                <p>{event.rsvp_count} RSVPs</p>
                <p>{event.dish_count} dishes</p>
              </div>
            </div>
            <div className="card-actions">
              <button className="btn-small btn-primary" onClick={() => handleRsvp(event.id)}>RSVP</button>
              <button className="btn-small btn-secondary" onClick={() => navigate(`/events/${event.id}`)}>View details</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EventsPage;