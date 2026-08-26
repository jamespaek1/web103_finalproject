const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const requireAuth = require('../middleware/requireAuth');

router.post('/', requireAuth, async (req, res) => {
  try {
    const { event_id, recipe_id, notes } = req.body;
    const result = await pool.query(
      'INSERT INTO event_dishes (event_id, recipe_id, claimed_by, notes) VALUES ($1, $2, $3, $4) RETURNING *',
      [event_id, recipe_id, req.user.id, notes || '']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'DELETE FROM event_dishes WHERE id = $1 AND claimed_by = $2 RETURNING *',
      [id, req.user.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Dish claim not found' });
    }
    res.json({ message: 'Dish unclaimed', dish: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
