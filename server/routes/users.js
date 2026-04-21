const express = require('express');
const router = express.Router();
const pool = require('../config/database');

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users ORDER BY name ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    if (user.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const hosted = await pool.query('SELECT * FROM events WHERE host_id = $1', [id]);
    const rsvps = await pool.query(`
      SELECT e.* FROM events e
      JOIN rsvps r ON r.event_id = e.id
      WHERE r.user_id = $1
    `, [id]);
    const dishes = await pool.query(`
      SELECT ed.*, r.name AS recipe_name, e.title AS event_title
      FROM event_dishes ed
      JOIN recipes r ON ed.recipe_id = r.id
      JOIN events e ON ed.event_id = e.id
      WHERE ed.claimed_by = $1
    `, [id]);

    res.json({
      ...user.rows[0],
      hosted_events: hosted.rows,
      rsvped_events: rsvps.rows,
      claimed_dishes: dishes.rows
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;