class TournamentGame {
    constructor() {
        this.players = [
            "Cesar", "Hannah", "Jay", "Aren", 
            "Nhu", "Nishant", "Angel"
        ];
        
        this.categories = [
            "Best at cooking",
            "Most likely to become famous",
            "Best dancer",
            "Most likely to win a trivia contest",
            "Most likely to travel the world",
            "Best at telling jokes",
            "Most likely to become a millionaire",
            "Best at keeping secrets",
            "Most likely to win a reality TV show",
            "Best at giving advice",
            "Most likely to become a superhero",
            "Best at organizing events",
            "Most likely to write a bestselling book",
            "Best at making friends",
            "Most likely to invent something amazing",
            "Best at sports",
            "Most likely to become a teacher",
            "Best at solving puzzles",
            "Most likely to start their own business",
            "Most likely to become a YouTuber",
            "Best at karaoke",
            "Most likely to win a hot dog eating contest",
            "Best at parallel parking",
            "Most likely to become a stand-up comedian",
            "Best at remembering birthdays",
            "Most likely to survive on a deserted island",
            "Best at giving pep talks",
            "Most likely to become a professional gamer",
            "Best at making people laugh",
            "Most likely to become an artist"
        ];
        
        this.usedCategories = [];
        this.scores = {};
        this.currentRound = 0;
        this.totalRounds = 30;
        this.currentPlayers = [null, null]; // Track current players
        
        this.initializeScores();
        this.bindEvents();
    }
    
    initializeScores() {
        this.players.forEach(player => {
            this.scores[player] = 0;
        });
    }
    
    bindEvents() {
        document.getElementById('start-btn').addEventListener('click', () => {
            this.showHostIntro();
        });
        
        document.getElementById('continue-btn').addEventListener('click', () => {
            this.startGame();
        });
    }
    
    showHostIntro() {
        this.showScreen('host-intro');
    }
    
    startGame() {
        this.showScreen('game-screen');
        this.nextRound();
    }
    
    shufflePlayer(playerNumber) {
        const otherPlayerName = playerNumber === 1 
            ? document.getElementById('player2').querySelector('.player-name').textContent
            : document.getElementById('player1').querySelector('.player-name').textContent;
        
        // Get available players (excluding the other current player)
        const availablePlayers = this.players.filter(player => player !== otherPlayerName);
        const newPlayer = availablePlayers[Math.floor(Math.random() * availablePlayers.length)];
        
        const playerElement = document.getElementById(`player${playerNumber}`);
        const playerImage = playerElement.querySelector('.player-image');
        const playerName = playerElement.querySelector('.player-name');
        
        // Update player
        playerName.textContent = newPlayer;
        playerImage.src = `images/${newPlayer.toLowerCase()}.png`;
        playerImage.onerror = () => {
            playerImage.src = 'images/default.png';
        };
        
        // Update current players tracking
        this.currentPlayers[playerNumber - 1] = newPlayer;
        
        // Re-bind click event
        playerElement.onclick = () => this.vote(newPlayer);
    }
    
    nextRound() {
        this.currentRound++;
        
        if (this.currentRound > this.totalRounds) {
            this.showResults();
            return;
        }
        
        document.getElementById('round-counter').textContent = 
            `Round ${this.currentRound} of ${this.totalRounds}`;
        
        const category = this.getUniqueCategory();
        document.getElementById('category').textContent = category;
        
        const [player1, player2] = this.getTwoRandomPlayers();
        this.currentPlayers = [player1, player2];
        
        const player1Element = document.getElementById('player1');
        const player2Element = document.getElementById('player2');
        
        // Update player names
        player1Element.querySelector('.player-name').textContent = player1;
        player2Element.querySelector('.player-name').textContent = player2;
        
        // Update player images
        const player1Image = player1Element.querySelector('.player-image');
        const player2Image = player2Element.querySelector('.player-image');
        
        player1Image.src = `images/${player1.toLowerCase()}.png`;
        player1Image.onerror = () => {
            player1Image.src = 'images/default.png';
        };
        
        player2Image.src = `images/${player2.toLowerCase()}.png`;
        player2Image.onerror = () => {
            player2Image.src = 'images/default.png';
        };
        
        player1Element.onclick = () => this.vote(player1);
        player2Element.onclick = () => this.vote(player2);
    }
    
    getUniqueCategory() {
        const availableCategories = this.categories.filter(cat => 
            !this.usedCategories.includes(cat)
        );
        
        if (availableCategories.length === 0) {
            this.usedCategories = [];
            return this.categories[Math.floor(Math.random() * this.categories.length)];
        }
        
        const category = availableCategories[Math.floor(Math.random() * availableCategories.length)];
        this.usedCategories.push(category);
        return category;
    }
    
    getTwoRandomPlayers() {
        const shuffled = [...this.players].sort(() => 0.5 - Math.random());
        return [shuffled[0], shuffled[1]];
    }
    
    vote(winner) {
        this.scores[winner]++;
        
        const winnerElement = winner === document.getElementById('player1').querySelector('.player-name').textContent 
            ? document.getElementById('player1') 
            : document.getElementById('player2');
        
        winnerElement.style.background = '#667eea';
        winnerElement.style.color = 'white';
        winnerElement.style.transform = 'scale(1.05)';
        
        document.getElementById('player1').onclick = null;
        document.getElementById('player2').onclick = null;
        
        // Just a brief pause before next round, no celebration
        setTimeout(() => {
            this.resetPlayerStyles();
            this.nextRound();
        }, 1500);
    }
    
    showCelebrationResults(winner, sortedPlayers) {
        this.showScreen('results-screen');
        
        // Set winner info
        const winnerImg = document.getElementById('winner-image');
        const winnerName = document.getElementById('winner-name');
        
        winnerImg.src = `images/${winner.toLowerCase()}.png`;
        winnerImg.onerror = () => {
            winnerImg.src = 'images/default.png';
        };
        winnerName.textContent = winner;
        
        // Populate leaderboard
        const leaderboard = document.getElementById('leaderboard');
        const medals = ['🥇', '🥈', '🥉'];
        const classes = ['first', 'second', 'third'];
        
        leaderboard.innerHTML = sortedPlayers
            .slice(0, 3)
            .map(([player, score], index) => `
                <div class="leaderboard-item ${classes[index]}">
                    <span>
                        <span class="medal">${medals[index]}</span>
                        <img src="images/${player.toLowerCase()}.png" 
                             onerror="this.src='images/default.png'" 
                             class="leaderboard-image">
                        ${player}
                    </span>
                    <span>${score} wins</span>
                </div>
            `).join('');
        
        // Start confetti
        this.createConfetti();
    }
    
    createConfetti() {
        const confettiContainer = document.getElementById('confetti-container');
        confettiContainer.innerHTML = '';
        
        const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff'];
        
        for (let i = 0; i < 100; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti-piece';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.animationDelay = Math.random() * 3 + 's';
            confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
            confettiContainer.appendChild(confetti);
        }
    }
    
    resetPlayerStyles() {
        const players = [document.getElementById('player1'), document.getElementById('player2')];
        players.forEach(player => {
            player.style.background = '#f7fafc';
            player.style.color = '#333';
            player.style.transform = 'scale(1)';
        });
    }
    
    showResults() {
        const sortedPlayers = Object.entries(this.scores)
            .sort(([,a], [,b]) => b - a);
        
        const tournamentWinner = sortedPlayers[0][0];
        
        this.showCelebrationResults(tournamentWinner, sortedPlayers);
    }
    
    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.add('hidden');
        });
        document.getElementById(screenId).classList.remove('hidden');
    }
}

// Make game instance globally accessible for shuffle buttons
let game;

document.addEventListener('DOMContentLoaded', () => {
    game = new TournamentGame();
});





