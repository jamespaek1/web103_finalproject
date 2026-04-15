import { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const CATEGORIES = ['all', 'appetizer', 'main', 'side', 'dessert', 'drink'];

function RecipesPage() {
  const [recipes, setRecipes] = useState([]);
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState('name');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', category: 'main', image_url: '', created_by: 1 });

  useEffect(() => {
    fetchRecipes();
  }, [category, sort]);

  const fetchRecipes = async () => {
    try {
      const params = new URLSearchParams();
      if (category !== 'all') params.append('category', category);
      params.append('sort', sort);
      const res = await fetch(`${API_URL}/api/recipes?${params}`);
      const data = await res.json();
      setRecipes(data);
    } catch (err) {
      console.error('Error fetching recipes:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingId ? `${API_URL}/api/recipes/${editingId}` : `${API_URL}/api/recipes`;
      const method = editingId ? 'PATCH' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        resetForm();
        fetchRecipes();
      }
    } catch (err) {
      console.error('Error saving recipe:', err);
    }
  };

  const handleEdit = (recipe) => {
    setForm({ name: recipe.name, description: recipe.description, category: recipe.category, image_url: recipe.image_url, created_by: recipe.created_by });
    setEditingId(recipe.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this recipe?')) return;
    try {
      await fetch(`${API_URL}/api/recipes/${id}`, { method: 'DELETE' });
      fetchRecipes();
    } catch (err) {
      console.error('Error deleting recipe:', err);
    }
  };

  const resetForm = () => {
    setForm({ name: '', description: '', category: 'main', image_url: '', created_by: 1 });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="page">
      <div className="page-header">
        <h2>Recipe library</h2>
        <button className="btn-primary" onClick={() => { resetForm(); setShowForm(!showForm); }}>
          + Add recipe
        </button>
      </div>

      {showForm && (
        <form className="form-card" onSubmit={handleSubmit}>
          <input type="text" placeholder="Recipe name" value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <textarea placeholder="Description" value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
            <option value="appetizer">Appetizer</option>
            <option value="main">Main</option>
            <option value="side">Side</option>
            <option value="dessert">Dessert</option>
            <option value="drink">Drink</option>
          </select>
          <input type="text" placeholder="Image URL (optional)" value={form.image_url}
            onChange={(e) => setForm({ ...form, image_url: e.target.value })} />
          <div className="form-actions">
            <button type="submit" className="btn-primary">{editingId ? 'Update' : 'Add'}</button>
            <button type="button" className="btn-secondary" onClick={resetForm}>Cancel</button>
          </div>
        </form>
      )}

      <div className="filter-bar">
        <div className="filter-pills">
          {CATEGORIES.map((cat) => (
            <button key={cat}
              className={`pill ${category === cat ? 'pill-active' : ''}`}
              onClick={() => setCategory(cat)}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
        <select className="sort-select" value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="name">Sort: A-Z</option>
          <option value="rating">Sort: Rating</option>
        </select>
      </div>

      <div className="recipe-grid">
        {recipes.map((recipe) => (
          <div key={recipe.id} className="recipe-card">
            <div className="recipe-image">
              {recipe.image_url ? <img src={recipe.image_url} alt={recipe.name} /> : <span>No image</span>}
            </div>
            <div className="recipe-info">
              <h4>{recipe.name}</h4>
              <p className="recipe-category">{recipe.category}</p>
              <div className="recipe-footer">
                <span className="recipe-rating">{recipe.rating} stars</span>
                <div className="recipe-actions">
                  <button className="btn-tiny" onClick={() => handleEdit(recipe)}>Edit</button>
                  <button className="btn-tiny btn-danger" onClick={() => handleDelete(recipe.id)}>Del</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecipesPage;