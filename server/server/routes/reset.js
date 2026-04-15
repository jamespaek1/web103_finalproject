const express = require('express');
const router = express.Router();
const pool = require('../config/database');

router.post('/', async (req, res) => {
  try {
    await pool.query(`
      DROP TABLE IF EXISTS event_dishes CASCADE;
      DROP TABLE IF EXISTS rsvps CASCADE;
      DROP TABLE IF EXISTS recipes CASCADE;
      DROP TABLE IF EXISTS events CASCADE;
      DROP TABLE IF EXISTS users CASCADE;
    `);

    await pool.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        bio TEXT DEFAULT '',
        avatar_url TEXT DEFAULT '',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE events (
        id SERIAL PRIMARY KEY,
        host_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        title TEXT NOT NULL,
        description TEXT DEFAULT '',
        event_date DATE NOT NULL,
        event_time TIME NOT NULL,
        location TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE recipes (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT DEFAULT '',
        category TEXT NOT NULL CHECK (category IN ('appetizer','main','side','dessert','drink')),
        image_url TEXT DEFAULT '',
        rating NUMERIC(2,1) DEFAULT 0,
        created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE event_dishes (
        id SERIAL PRIMARY KEY,
        event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
        recipe_id INTEGER REFERENCES recipes(id) ON DELETE CASCADE,
        claimed_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
        notes TEXT DEFAULT '',
        claimed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(event_id, recipe_id)
      );
      CREATE TABLE rsvps (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, event_id)
      );
    `);

    const users = await pool.query(`
      INSERT INTO users (name, email, bio) VALUES
      ('Tom Strzyz', 'tom@example.com', 'Loves grilling and outdoor cooking'),
      ('Dongping Guo', 'dongping@example.com', 'Specializes in Asian fusion dishes'),
      ('James Paek', 'james@example.com', 'BBQ enthusiast and home chef'),
      ('Eman Gurung', 'eman@example.com', 'Passionate about baking and desserts')
      RETURNING id
    `);
    const [t, d, j, e] = users.rows;

    const evts = await pool.query(`
      INSERT INTO events (host_id, title, description, event_date, event_time, location) VALUES
      (${t.id}, 'Summer BBQ Potluck', 'Bring your best summer dishes!', '2026-07-15', '16:00', 'Central Park'),
      (${j.id}, 'Friendsgiving Dinner', 'Our annual Friendsgiving celebration.', '2026-11-22', '18:00', '123 Oak St'),
      (${d.id}, 'Game Night Snacks', 'Board games and great food.', '2026-08-03', '19:00', 'Dongpings Place')
      RETURNING id
    `);
    const [bbq, fg, gn] = evts.rows;

    const recs = await pool.query(`
      INSERT INTO recipes (name, description, category, rating, created_by) VALUES
      ('BBQ Pulled Pork Sliders', 'Slow-cooked pulled pork with tangy coleslaw', 'main', 4.8, ${j.id}),
      ('Classic Lemonade', 'Fresh-squeezed lemons with the right sweetness', 'drink', 4.5, ${e.id}),
      ('Grilled Corn Salad', 'Charred corn with lime and cotija cheese', 'side', 4.2, ${t.id}),
      ('Chocolate Brownies', 'Rich fudgy brownies with a crackly top', 'dessert', 4.9, ${e.id}),
      ('Spinach Artichoke Dip', 'Creamy baked dip with crispy bread', 'appetizer', 4.6, ${d.id}),
      ('Mango Salsa', 'Fresh mango, red onion, cilantro, lime', 'appetizer', 4.3, ${t.id}),
      ('Teriyaki Chicken Skewers', 'Grilled chicken with homemade teriyaki', 'main', 4.7, ${d.id}),
      ('Watermelon Agua Fresca', 'Blended watermelon with lime and mint', 'drink', 4.4, ${j.id})
      RETURNING id
    `);
    const [pork, lem, corn, brown, dip, salsa, teri, agua] = recs.rows;

    await pool.query(`
      INSERT INTO event_dishes (event_id, recipe_id, claimed_by) VALUES
      (${bbq.id}, ${corn.id}, ${t.id}),
      (${bbq.id}, ${lem.id}, ${e.id}),
      (${bbq.id}, ${pork.id}, ${j.id}),
      (${fg.id}, ${brown.id}, ${e.id}),
      (${fg.id}, ${teri.id}, ${d.id}),
      (${gn.id}, ${dip.id}, ${d.id}),
      (${gn.id}, ${salsa.id}, ${t.id})
    `);

    await pool.query(`
      INSERT INTO rsvps (user_id, event_id) VALUES
      (${t.id}, ${bbq.id}), (${d.id}, ${bbq.id}), (${j.id}, ${bbq.id}), (${e.id}, ${bbq.id}),
      (${j.id}, ${fg.id}), (${e.id}, ${fg.id}), (${d.id}, ${fg.id}), (${t.id}, ${fg.id}),
      (${t.id}, ${gn.id}), (${d.id}, ${gn.id}), (${j.id}, ${gn.id})
    `);

    res.json({ message: 'Database reset to default state' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;