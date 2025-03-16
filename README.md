# Whack-a-Meme Game

A simple "Whack-a-Mole" style game where you click on the meme face as it pops up from different holes. Features a leaderboard powered by Supabase.

Play the game here: https://abdurrafay2004.github.io/Whack-a-pratyay/

## How to Play

1. Download or clone this repository
2. Save your meme image as `meme.jpg` in the `assets` folder
3. Set up Supabase (see below)
4. Open `index.html` in your web browser
5. Click the "Start Game" button
6. Click on the meme face whenever it appears to score points
7. Try to get as many points as possible before the 30-second timer runs out!
8. Enter your username to save your score to the leaderboard

## Supabase Setup

1. Create a free account at [Supabase](https://supabase.com/)
2. Create a new project
3. In the SQL Editor, run the following SQL to create the leaderboard table:

```sql
CREATE TABLE leaderboard (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL,
  score INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create an index for faster sorting
CREATE INDEX leaderboard_score_idx ON leaderboard (score DESC);
```

4. Go to Project Settings > API and copy your project URL and anon key
5. Open `supabase-config.js` and replace the placeholder values with your actual Supabase URL and anon key:

```javascript
const SUPABASE_URL = 'https://your-project-id.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key';
```

## Technologies Used

- HTML
- CSS
- JavaScript (Vanilla, no frameworks)
- Supabase (Backend as a Service)

## Customization

- You can change the game duration by modifying the `timeLeft` variable in `script.js`
- You can adjust the speed of the meme popups by changing the interval time in the `startGame` function
- You can add sound effects by uncommenting the audio code in the click event handler

## License

This project is open source and available for anyone to use and modify. 