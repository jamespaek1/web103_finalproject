const pool = require('./database');

const createTables = async () => {
  const query = `
    DROP TABLE IF EXISTS event_dishes CASCADE;
    DROP TABLE IF EXISTS rsvps CASCADE;
    DROP TABLE IF EXISTS recipes CASCADE;
    DROP TABLE IF EXISTS events CASCADE;
    DROP TABLE IF EXISTS users CASCADE;

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
      category TEXT NOT NULL CHECK (category IN ('appetizer', 'main', 'side', 'dessert', 'drink')),
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
  `;

  await pool.query(query);
  console.log('Tables created successfully');
};

const seedData = async () => {
  const users = await pool.query(`
    INSERT INTO users (name, email, bio) VALUES
    ('Tom Strzyz', 'tom@example.com', 'Loves grilling and outdoor cooking'),
    ('Dongping Guo', 'dongping@example.com', 'Specializes in Asian fusion dishes'),
    ('James Paek', 'james@example.com', 'BBQ enthusiast and home chef'),
    ('Eman Gurung', 'eman@example.com', 'Passionate about baking and desserts')
    RETURNING id
  `);

  const [tom, dongping, james, eman] = users.rows;

  const events = await pool.query(`
    INSERT INTO events (host_id, title, description, event_date, event_time, location) VALUES
    (${tom.id}, 'Summer BBQ Potluck', 'Bring your best summer dishes! Grill will be going and plenty of seating. BYOB welcome.', '2026-07-15', '16:00', 'Central Park'),
    (${james.id}, 'Friendsgiving Dinner', 'Our annual Friendsgiving celebration. Bring a dish that reminds you of home!', '2026-11-22', '18:00', '123 Oak St'),
    (${dongping.id}, 'Game Night Snacks', 'Board games and great food. Bring something easy to snack on while playing!', '2026-08-03', '19:00', 'Dongpings Place')
    RETURNING id
  `);

  const [bbq, friendsgiving, gamenight] = events.rows;

  const recipes = await pool.query(`
    INSERT INTO recipes (name, description, category, image_url, rating, created_by) VALUES
    ('BBQ Pulled Pork Sliders', 'Slow-cooked pulled pork with tangy coleslaw on mini buns', 'main', '', 4.8, ${james.id}),
    ('Classic Lemonade', 'Fresh-squeezed lemons with just the right amount of sweetness', 'drink', '', 4.5, ${eman.id}),
    ('Grilled Corn Salad', 'Charred corn with lime, cotija cheese, and chili powder', 'side', '', 4.2, ${tom.id}),
    ('Chocolate Brownies', 'Rich fudgy brownies with a crackly top', 'dessert', '', 4.9, ${eman.id}),
    ('Spinach Artichoke Dip', 'Creamy baked dip with crispy bread for dipping', 'appetizer', '', 4.6, ${dongping.id}),
    ('Mango Salsa', 'Fresh mango, red onion, cilantro, and lime juice', 'appetizer', '', 4.3, ${tom.id}),
    ('Teriyaki Chicken Skewers', 'Grilled chicken glazed with homemade teriyaki sauce', 'main', '', 4.7, ${dongping.id}),
    ('Watermelon Agua Fresca', 'Blended watermelon with lime and a hint of mint', 'drink', '', 4.4, ${james.id})
    RETURNING id
  `);

  const [pork, lemonade, corn, brownies, dip, salsa, skewers, agua] = recipes.rows;

  await pool.query(`
    INSERT INTO event_dishes (event_id, recipe_id, claimed_by, notes) VALUES
    (${bbq.id}, ${corn.id}, ${tom.id}, 'Will bring extra for seconds'),
    (${bbq.id}, ${lemonade.id}, ${eman.id}, 'Making a big batch'),
    (${bbq.id}, ${pork.id}, ${james.id}, ''),
    (${friendsgiving.id}, ${brownies.id}, ${eman.id}, 'Double batch'),
    (${friendsgiving.id}, ${skewers.id}, ${dongping.id}, ''),
    (${gamenight.id}, ${dip.id}, ${dongping.id}, 'Bringing chips too'),
    (${gamenight.id}, ${salsa.id}, ${tom.id}, '')
  `);

  await pool.query(`
    INSERT INTO rsvps (user_id, event_id) VALUES
    (${tom.id}, ${bbq.id}),
    (${dongping.id}, ${bbq.id}),
    (${james.id}, ${bbq.id}),
    (${eman.id}, ${bbq.id}),
    (${james.id}, ${friendsgiving.id}),
    (${eman.id}, ${friendsgiving.id}),
    (${dongping.id}, ${friendsgiving.id}),
    (${tom.id}, ${friendsgiving.id}),
    (${tom.id}, ${gamenight.id}),
    (${dongping.id}, ${gamenight.id}),
    (${james.id}, ${gamenight.id})
  `);

  console.log('Seed data inserted successfully');
};

const reset = async () => {
  try {
    await createTables();
    await seedData();
    console.log('Database reset complete');
  } catch (err) {
    console.error('Error resetting database:', err);
  } finally {
    pool.end();
  }
};

reset();