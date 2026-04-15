const express = require('express');
const router = express.Router();
const pool = require('../config/database');

router.post('/', async (req, res) => {
  try {
    const { user_id, event_id } = req.body;
    const result = await pool.query(
      'INSERT INTO rsvps (user_id, event_id) VALUES ($1, $2) RETURNING *',
      [user_id, event_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM rsvps WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'RSVP not found' });
    }
    res.json({ message: 'RSVP removed', rsvp: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;