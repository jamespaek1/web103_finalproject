import { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

function ClaimModal({ eventId, onClose, onClaimed }) {
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const res = await fetch(`${API_URL}/api/recipes`);
        const data = await res.json();
        setRecipes(data);
      } catch (err) {
        console.error('Error fetching recipes:', err);
      }
    };
    fetchRecipes();
  }, []);

  const handleClaim = async () => {
    if (!selectedRecipe) return;
    try {
      const res = await fetch(`${API_URL}/api/event-dishes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_id: eventId,
          recipe_id: selectedRecipe,
          claimed_by: 1,
          notes
        })
      });
      if (res.ok) {
        onClaimed();
        onClose();
      }
    } catch (err) {
      console.error('Error claiming dish:', err);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Claim a dish</h3>
          <button className="btn-close" onClick={onClose}>X</button>
        </div>
        <div className="modal-body">
          <p className="modal-label">Select a recipe:</p>
          <div className="modal-recipe-list">
            {recipes.map((recipe) => (
              <div key={recipe.id}
                className={`modal-recipe-item ${selectedRecipe === recipe.id ? 'selected' : ''}`}
                onClick={() => setSelectedRecipe(recipe.id)}>
                <div>
                  <p className="dish-name">{recipe.name}</p>
                  <p className="dish-meta">{recipe.category} · {recipe.rating} stars</p>
                </div>
              </div>
            ))}
          </div>
          <textarea placeholder="Notes (optional)" value={notes}
            onChange={(e) => setNotes(e.target.value)} className="modal-notes" />
        </div>
        <div className="modal-footer">
          <button className="btn-primary" onClick={handleClaim} disabled={!selectedRecipe}>Claim dish</button>
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default ClaimModal;