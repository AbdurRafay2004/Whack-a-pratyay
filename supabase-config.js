// Supabase configuration
// Replace these with your actual Supabase URL and anon key
const SUPABASE_URL = 'https://hzmnjxhbbiitlclqyfyd.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6bW5qeGhiYmlpdGxjbHF5ZnlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIxMzIxMjIsImV4cCI6MjA1NzcwODEyMn0.osz2Vy0dieU8xJyuQFmaCz9cUYz6KR2vVq9OYsu23dQ';

// Initialize the Supabase client
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Table name for leaderboard
const LEADERBOARD_TABLE = 'leaderboard';

// Function to fetch leaderboard data
async function fetchLeaderboard() {
    try {
        const { data, error } = await supabaseClient
            .from(LEADERBOARD_TABLE)
            .select('*')
            .order('score', { ascending: false })
            .limit(10);
        
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        return [];
    }
}

// Function to submit a new score
async function submitScore(username, score) {
    try {
        const { data, error } = await supabaseClient
            .from(LEADERBOARD_TABLE)
            .insert([
                { 
                    username: username,
                    score: score,
                    created_at: new Date().toISOString()
                }
            ]);
        
        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Error submitting score:', error);
        return false;
    }
} 