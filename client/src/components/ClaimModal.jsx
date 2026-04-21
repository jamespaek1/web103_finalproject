import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../App';
import { useToast } from './Toast';
import Spinner from './Spinner';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

function ClaimModal({ eventId, claimedRecipeIds = [], onClose, onClaimed }) {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { user } = useContext(AuthContext);
  const addToast = useToast();

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const res = await fetch(`${API_URL}/api/recipes`);
        const data = await res.json();
        setRecipes(data);
      } catch (err) {
        addToast('Failed to load recipes', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchRecipes();
  }, []);

  const handleClaim = async () => {
    if (!selectedRecipe) return;
    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/api/event-dishes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_id: eventId,
          recipe_id: selectedRecipe,
          claimed_by: user?.id || 1,
          notes
        })
      });
      if (res.ok) {
        onClaimed();
        onClose();
      } else {
        addToast('This dish is already claimed', 'error');
      }
    } catch (err) {
      addToast('Failed to claim dish', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Claim a dish</h3>
          <button className="btn-close" onClick={onClose} disabled={submitting}>X</button>
        </div>
        <div className="modal-body">
          {loading ? <Spinner /> : (
            <>
              <p className="modal-label">Select a recipe:</p>
              <div className="modal-recipe-list">
                {recipes.map((recipe) => {
                  const isClaimed = claimedRecipeIds.includes(recipe.id);
                  return (
                    <div key={recipe.id}
                      className={`modal-recipe-item ${selectedRecipe === recipe.id ? 'selected' : ''} ${isClaimed ? 'claimed' : ''}`}
                      onClick={() => !isClaimed && setSelectedRecipe(recipe.id)}>
                      <div>
                        <p className="dish-name">{recipe.name} {isClaimed && <span className="claimed-badge">Already claimed</span>}</p>
                        <p className="dish-meta">{recipe.category} · {recipe.rating} stars</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <textarea placeholder="Notes (optional)" value={notes}
                onChange={(e) => setNotes(e.target.value)} className="modal-notes" disabled={submitting} />
            </>
          )}
        </div>
        <div className="modal-footer">
          <button className="btn-primary" onClick={handleClaim} disabled={!selectedRecipe || submitting}>
            {submitting ? 'Claiming...' : 'Claim dish'}
          </button>
          <button className="btn-secondary" onClick={onClose} disabled={submitting}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default ClaimModal;