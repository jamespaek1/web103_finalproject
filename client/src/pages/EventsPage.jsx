import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';
import { useToast } from '../components/Toast';
import Spinner from '../components/Spinner';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [clickedBtns, setClickedBtns] = useState({});
  const [form, setForm] = useState({ title: '', description: '', event_date: '', event_time: '', location: '' });
  const { user } = useContext(AuthContext);
  const addToast = useToast();
  const navigate = useNavigate();

  useEffect(() => { fetchEvents(); }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/events`);
      const data = await res.json();
      setEvents(data);
    } catch (err) {
      addToast('Failed to load events', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.event_date || !form.event_time || !form.location) {
      addToast('Please fill in all required fields', 'error');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/api/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, host_id: user?.id || 1 })
      });
      if (res.ok) {
        setForm({ title: '', description: '', event_date: '', event_time: '', location: '' });
        setShowForm(false);
        fetchEvents();
        addToast('Event created successfully!');
      } else {
        addToast('Failed to create event', 'error');
      }
    } catch (err) {
      addToast('Failed to create event', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRsvp = async (eventId) => {
    const btnKey = `rsvp-${eventId}`;
    if (clickedBtns[btnKey]) return;
    setClickedBtns(prev => ({ ...prev, [btnKey]: true }));
    try {
      const res = await fetch(`${API_URL}/api/rsvps`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user?.id || 1, event_id: eventId })
      });
      if (res.ok) {
        fetchEvents();
        addToast('RSVPed successfully!');
      } else {
        addToast('Already RSVPed to this event', 'error');
        setClickedBtns(prev => ({ ...prev, [btnKey]: false }));
      }
    } catch (err) {
      addToast('Failed to RSVP', 'error');
      setClickedBtns(prev => ({ ...prev, [btnKey]: false }));
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="page">
      <div className="page-header">
        <h2>Upcoming events</h2>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>+ Create event</button>
      </div>

      {showForm && (
        <form className="form-card" onSubmit={handleSubmit}>
          <input type="text" placeholder="Event title" value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })} required disabled={submitting} />
          <textarea placeholder="Description" value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })} disabled={submitting} />
          <input type="date" value={form.event_date}
            onChange={(e) => setForm({ ...form, event_date: e.target.value })} required disabled={submitting} />
          <input type="time" value={form.event_time}
            onChange={(e) => setForm({ ...form, event_time: e.target.value })} required disabled={submitting} />
          <input type="text" placeholder="Location" value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })} required disabled={submitting} />
          <div className="form-actions">
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? 'Creating...' : 'Create'}
            </button>
            <button type="button" className="btn-secondary" onClick={() => setShowForm(false)} disabled={submitting}>Cancel</button>
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
              <button className="btn-small btn-primary"
                onClick={() => handleRsvp(event.id)}
                disabled={clickedBtns[`rsvp-${event.id}`]}>
                {clickedBtns[`rsvp-${event.id}`] ? 'RSVPed' : 'RSVP'}
              </button>
              <button className="btn-small btn-secondary" onClick={() => navigate(`/events/${event.id}`)}>View details</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EventsPage;