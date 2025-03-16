document.addEventListener('DOMContentLoaded', () => {
    // Check if Supabase is properly initialized
    if (typeof supabaseClient === 'undefined') {
        console.error('Supabase client is not initialized. Check your supabase-config.js file.');
        alert('Error: Database connection failed. Check console for details.');
    }

    const holes = document.querySelectorAll('.hole');
    const scoreDisplay = document.getElementById('score');
    const timeDisplay = document.getElementById('timer');
    const startButton = document.getElementById('start-button');
    const leaderboardButton = document.getElementById('leaderboard-button');
    const leaderboardModal = document.getElementById('leaderboard-modal');
    const scoreModal = document.getElementById('score-modal');
    const finalScoreDisplay = document.getElementById('final-score');
    const scoreForm = document.getElementById('score-form');
    const leaderboardBody = document.getElementById('leaderboard-body');
    const closeButtons = document.querySelectorAll('.close');
    
    let score = 0;
    let timeLeft = 30;
    let gameInterval;
    let popupInterval;
    let isPlaying = false;
    
    // Create meme elements for each hole
    holes.forEach(hole => {
        const meme = document.createElement('div');
        meme.classList.add('meme');
        meme.style.backgroundImage = "url('assets/meme.jpg')";
        
        // Add click event to score points
        meme.addEventListener('click', () => {
            if (isPlaying && meme.classList.contains('active')) {
                score++;
                scoreDisplay.textContent = score;
                meme.classList.remove('active');
                
                // Add sound effect if you want
                // const hitSound = new Audio('assets/hit.mp3');
                // hitSound.play();
            }
        });
        
        hole.appendChild(meme);
    });
    
    // Start game function
    function startGame() {
        if (isPlaying) return;
        
        isPlaying = true;
        score = 0;
        timeLeft = 30;
        scoreDisplay.textContent = score;
        timeDisplay.textContent = timeLeft;
        startButton.disabled = true;
        leaderboardButton.disabled = true;
        
        // Timer countdown
        gameInterval = setInterval(() => {
            timeLeft--;
            timeDisplay.textContent = timeLeft;
            
            if (timeLeft <= 0) {
                clearInterval(gameInterval);
                clearInterval(popupInterval);
                isPlaying = false;
                startButton.disabled = false;
                leaderboardButton.disabled = false;
                
                // Show score submission modal
                finalScoreDisplay.textContent = score;
                scoreModal.style.display = 'block';
                
                // Hide any active memes
                document.querySelectorAll('.meme.active').forEach(meme => {
                    meme.classList.remove('active');
                });
            }
        }, 1000);
        
        // Random meme popup
        popupInterval = setInterval(() => {
            const randomHole = getRandomHole();
            popupMeme(randomHole);
        }, 1000);
    }
    
    // Get random hole
    function getRandomHole() {
        const index = Math.floor(Math.random() * holes.length);
        return holes[index];
    }
    
    // Popup meme
    function popupMeme(hole) {
        const meme = hole.querySelector('.meme');
        meme.classList.add('active');
        
        // Hide meme after random time
        setTimeout(() => {
            meme.classList.remove('active');
        }, Math.random() * 800 + 600); // Random time between 600ms and 1400ms
    }
    
    // Display leaderboard
    async function displayLeaderboard() {
        // Clear existing entries
        leaderboardBody.innerHTML = '';
        
        // Show loading indicator
        const loadingRow = document.createElement('tr');
        loadingRow.innerHTML = '<td colspan="4">Loading leaderboard...</td>';
        leaderboardBody.appendChild(loadingRow);
        
        try {
            // Fetch leaderboard data
            const leaderboardData = await fetchLeaderboard();
            
            // Clear loading indicator
            leaderboardBody.innerHTML = '';
            
            // Display leaderboard entries
            if (leaderboardData.length === 0) {
                const emptyRow = document.createElement('tr');
                emptyRow.innerHTML = '<td colspan="4">No scores yet. Be the first!</td>';
                leaderboardBody.appendChild(emptyRow);
            } else {
                leaderboardData.forEach((entry, index) => {
                    const row = document.createElement('tr');
                    const date = new Date(entry.created_at).toLocaleDateString();
                    
                    row.innerHTML = `
                        <td>${index + 1}</td>
                        <td>${entry.username}</td>
                        <td>${entry.score}</td>
                        <td>${date}</td>
                    `;
                    
                    leaderboardBody.appendChild(row);
                });
            }
        } catch (error) {
            console.error('Error displaying leaderboard:', error);
            leaderboardBody.innerHTML = '<tr><td colspan="4">Error loading leaderboard. Please try again.</td></tr>';
        }
    }
    
    // Event Listeners
    
    // Start button event
    startButton.addEventListener('click', startGame);
    
    // Leaderboard button event
    leaderboardButton.addEventListener('click', () => {
        leaderboardModal.style.display = 'block';
        displayLeaderboard();
    });
    
    // Score form submission
    scoreForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const username = document.getElementById('username').value.trim();
        
        if (username) {
            // Disable submit button to prevent multiple submissions
            const submitButton = scoreForm.querySelector('button');
            submitButton.disabled = true;
            submitButton.textContent = 'Submitting...';
            
            try {
                // Submit score to Supabase
                const success = await submitScore(username, score);
                
                if (success) {
                    // Close score modal
                    scoreModal.style.display = 'none';
                    
                    // Show leaderboard
                    leaderboardModal.style.display = 'block';
                    displayLeaderboard();
                } else {
                    throw new Error('Failed to submit score');
                }
            } catch (error) {
                console.error('Error submitting score:', error);
                alert('Failed to submit score. Please try again.');
                submitButton.disabled = false;
                submitButton.textContent = 'Submit Score';
            }
        }
    });
    
    // Close modal buttons
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            leaderboardModal.style.display = 'none';
        });
    });
    
    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === leaderboardModal) {
            leaderboardModal.style.display = 'none';
        }
    });
}); 