const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// GET all events
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT e.*, u.name AS host_name,
        (SELECT COUNT(*) FROM rsvps WHERE event_id = e.id) AS rsvp_count,
        (SELECT COUNT(*) FROM event_dishes WHERE event_id = e.id) AS dish_count
      FROM events e
      JOIN users u ON e.host_id = u.id
      ORDER BY e.event_date ASC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single event
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const event = await pool.query(`
      SELECT e.*, u.name AS host_name
      FROM events e
      JOIN users u ON e.host_id = u.id
      WHERE e.id = $1
    `, [id]);

    if (event.rows.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const dishes = await pool.query(`
      SELECT ed.*, r.name AS recipe_name, r.category, u.name AS claimed_by_name
      FROM event_dishes ed
      JOIN recipes r ON ed.recipe_id = r.id
      LEFT JOIN users u ON ed.claimed_by = u.id
      WHERE ed.event_id = $1
    `, [id]);

    const rsvps = await pool.query(`
      SELECT r.*, u.name AS user_name
      FROM rsvps r
      JOIN users u ON r.user_id = u.id
      WHERE r.event_id = $1
    `, [id]);

    res.json({
      ...event.rows[0],
      dishes: dishes.rows,
      rsvps: rsvps.rows
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create event
router.post('/', async (req, res) => {
  try {
    const { host_id, title, description, event_date, event_time, location } = req.body;
    const result = await pool.query(
      `INSERT INTO events (host_id, title, description, event_date, event_time, location)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [host_id, title, description, event_date, event_time, location]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH update event
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, event_date, event_time, location } = req.body;
    const result = await pool.query(
      `UPDATE events
       SET title = COALESCE($1, title),
           description = COALESCE($2, description),
           event_date = COALESCE($3, event_date),
           event_time = COALESCE($4, event_time),
           location = COALESCE($5, location)
       WHERE id = $6 RETURNING *`,
      [title, description, event_date, event_time, location, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE event
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM events WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json({ message: 'Event deleted', event: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;