const express = require('express');
const cors = require('cors');
require('dotenv').config();

const eventsRouter = require('./routes/events');
const recipesRouter = require('./routes/recipes');
const rsvpsRouter = require('./routes/rsvps');
const eventDishesRouter = require('./routes/event_dishes');
const usersRouter = require('./routes/users');
const resetRouter = require('./routes/reset');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to PotluckHub API' });
});

app.use('/api/events', eventsRouter);
app.use('/api/recipes', recipesRouter);
app.use('/api/rsvps', rsvpsRouter);
app.use('/api/event-dishes', eventDishesRouter);
app.use('/api/users', usersRouter);
app.use('/api/reset', resetRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});