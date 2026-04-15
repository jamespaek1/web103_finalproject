const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// GET all recipes with optional filter and sort
router.get('/', async (req, res) => {
  try {
    const { category, sort } = req.query;
    let query = 'SELECT * FROM recipes';
    const params = [];

    if (category && category !== 'all') {
      params.push(category);
      query += ` WHERE category = $${params.length}`;
    }

    if (sort === 'rating') {
      query += ' ORDER BY rating DESC';
    } else {
      query += ' ORDER BY name ASC';
    }

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single recipe
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM recipes WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Recipe not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create recipe
router.post('/', async (req, res) => {
  try {
    const { name, description, category, image_url, created_by } = req.body;
    const result = await pool.query(
      `INSERT INTO recipes (name, description, category, image_url, created_by)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [name, description, category, image_url, created_by]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH update recipe
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, category, image_url } = req.body;
    const result = await pool.query(
      `UPDATE recipes
       SET name = COALESCE($1, name),
           description = COALESCE($2, description),
           category = COALESCE($3, category),
           image_url = COALESCE($4, image_url)
       WHERE id = $5 RETURNING *`,
      [name, description, category, image_url, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Recipe not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE recipe
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM recipes WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Recipe not found' });
    }
    res.json({ message: 'Recipe deleted', recipe: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;