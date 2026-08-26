const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const requireAuth = require('../middleware/requireAuth');

router.post('/', requireAuth, async (req, res) => {
  try {
    const { event_id } = req.body;
    const result = await pool.query(
      'INSERT INTO rsvps (user_id, event_id) VALUES ($1, $2) RETURNING *',
      [req.user.id, event_id]
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
      'DELETE FROM rsvps WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, req.user.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'RSVP not found' });
    }
    res.json({ message: 'RSVP removed', rsvp: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
