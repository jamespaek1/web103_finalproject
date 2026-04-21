const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const pool = require('./database');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    done(null, result.rows[0] || null);
  } catch (err) {
    done(err, null);
  }
});

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK_URL || 'http://localhost:3001/auth/github/callback'
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails?.[0]?.value || `${profile.username}@github.com`;
      const existing = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

      if (existing.rows.length > 0) {
        const user = existing.rows[0];
        await pool.query(
          'UPDATE users SET avatar_url = $1 WHERE id = $2',
          [profile.photos?.[0]?.value || '', user.id]
        );
        return done(null, user);
      }

      const result = await pool.query(
        'INSERT INTO users (name, email, bio, avatar_url) VALUES ($1, $2, $3, $4) RETURNING *',
        [profile.displayName || profile.username, email, '', profile.photos?.[0]?.value || '']
      );
      return done(null, result.rows[0]);
    } catch (err) {
      return done(err, null);
    }
  }
));