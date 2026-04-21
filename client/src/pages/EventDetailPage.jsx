import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';
import { useToast } from '../components/Toast';
import Spinner from '../components/Spinner';
import ClaimModal from '../components/ClaimModal';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

function EventDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const addToast = useToast();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [clickedBtns, setClickedBtns] = useState({});
  const [form, setForm] = useState({ title: '', description: '', event_date: '', event_time: '', location: '' });

  useEffect(() => { fetchEvent(); }, [id]);

  const fetchEvent = async () => {
    setLoading(true);
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
      addToast('Failed to load event', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await fetch(`${API_URL}/api/events/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      setEditing(false);
      fetchEvent();
      addToast('Event updated successfully!');
    } catch (err) {
      addToast('Failed to update event', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    setSubmitting(true);
    try {
      await fetch(`${API_URL}/api/events/${id}`, { method: 'DELETE' });
      addToast('Event deleted');
      navigate('/');
    } catch (err) {
      addToast('Failed to delete event', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUnclaim = async (dishId) => {
    const btnKey = `unclaim-${dishId}`;
    if (clickedBtns[btnKey]) return;
    setClickedBtns(prev => ({ ...prev, [btnKey]: true }));
    try {
      await fetch(`${API_URL}/api/event-dishes/${dishId}`, { method: 'DELETE' });
      fetchEvent();
      addToast('Dish unclaimed');
    } catch (err) {
      addToast('Failed to unclaim dish', 'error');
      setClickedBtns(prev => ({ ...prev, [btnKey]: false }));
    }
  };

  if (loading) return <Spinner />;
  if (!event) return <p>Event not found</p>;

  const claimedRecipeIds = event.dishes?.map(d => d.recipe_id) || [];

  return (
    <div className="page">
      <button className="btn-link" onClick={() => navigate('/')}>← Back to events</button>

      {editing ? (
        <form className="form-card" onSubmit={handleUpdate}>
          <input type="text" value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })} required disabled={submitting} />
          <textarea value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })} disabled={submitting} />
          <input type="date" value={form.event_date}
            onChange={(e) => setForm({ ...form, event_date: e.target.value })} required disabled={submitting} />
          <input type="time" value={form.event_time}
            onChange={(e) => setForm({ ...form, event_time: e.target.value })} required disabled={submitting} />
          <input type="text" value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })} required disabled={submitting} />
          <div className="form-actions">
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? 'Saving...' : 'Save'}
            </button>
            <button type="button" className="btn-secondary" onClick={() => setEditing(false)} disabled={submitting}>Cancel</button>
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
              <button className="btn-secondary" onClick={() => setEditing(true)} disabled={submitting}>Edit</button>
              <button className="btn-danger" onClick={handleDelete} disabled={submitting}>
                {submitting ? 'Deleting...' : 'Delete'}
              </button>
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
                  <button className="btn-small btn-secondary"
                    onClick={() => handleUnclaim(dish.id)}
                    disabled={clickedBtns[`unclaim-${dish.id}`]}>
                    {clickedBtns[`unclaim-${dish.id}`] ? 'Unclaiming...' : 'Unclaim'}
                  </button>
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
          claimedRecipeIds={claimedRecipeIds}
          onClose={() => setShowModal(false)}
          onClaimed={() => { fetchEvent(); addToast('Dish claimed!'); }}
        />
      )}
    </div>
  );
}

export default EventDetailPage;