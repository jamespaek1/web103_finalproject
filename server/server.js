const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
require('dotenv').config();
require('./config/passport');

const eventsRouter = require('./routes/events');
const recipesRouter = require('./routes/recipes');
const rsvpsRouter = require('./routes/rsvps');
const eventDishesRouter = require('./routes/event_dishes');
const usersRouter = require('./routes/users');
const resetRouter = require('./routes/reset');
const authRouter = require('./routes/auth');
const uploadRouter = require('./routes/upload');

const app = express();
const PORT = process.env.PORT || 3001;

const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

app.use(cors({
  origin: CLIENT_URL,
  credentials: true
}));
app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET || 'potluckhub-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 24 * 60 * 60 * 1000
  }
}));

app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to PotluckHub API' });
});

app.use('/auth', authRouter);
app.use('/api/events', eventsRouter);
app.use('/api/recipes', recipesRouter);
app.use('/api/rsvps', rsvpsRouter);
app.use('/api/event-dishes', eventDishesRouter);
app.use('/api/users', usersRouter);
app.use('/api/reset', resetRouter);
app.use('/api/upload', uploadRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});