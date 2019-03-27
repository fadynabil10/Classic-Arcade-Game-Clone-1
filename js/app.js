// Global variabless
const INITIAL_X = 202; // Initial X coordinate for the player
const INITIAL_Y = 415; // Initial Y coordinate for the player
const COLLIDED  = 50; // Collision measurement - interval of 50 points for each side that will count as a collision
const speeds = [300, 230, 400]; // Initial speeds
let score = 0; // Initial scores

// Common parent for Enemies and Player .
class Element {
  constructor(x, y, sprite) {
    this.x = x;
    this.y = y;
    this.sprite = sprite;
  }

  // Draw game elements on the screen
  render() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }
}

// Enemy
class Enemy extends Element {
  constructor(x, y, sprite = 'images/enemy-bug.png') {
    super(x, y, sprite);
    this.speed = speeds[Math.floor(Math.random() * speeds.length)];
  }

  update(dt) {
    // Movement is multiplied by 'dt' so it will ensure the game runs at the same speed for all computers
    this.x += this.speed * dt;
    // Canvas width is set to 505 (see engine.js line 28), therefore when the enemy reaches this point, or further, they will be set back to point 0 on the x-axis
    if (this.x >= 505) {
      this.x = 0;
    }
  }
}

// Player
class Player extends Element {
  constructor(x, y, sprite = 'images/char-cat-girl.png') {
    super(x, y, sprite);
  }

  // Gets the player back to the initial position
  reset(x, y) {
    this.x = x;
    this.y = y;
  }

  // The player wins the game when they reach the water
  update() {
    // Water reached?
    if (this.y <= 0) {
      this.reset(INITIAL_X, INITIAL_Y); // Go back to the start
      alertify.alert('You win!', 'Congratulations!<br>You got Catgirl to the water!');
      score += 1; // Score goes up
      $('#score').text(score);
    }
  }

  /**
   * Handles key input received by the player:
   * 1. Walks one square when left key, right key, up key or down key is pressed
   * 2. Does not let player wander off canvas.
   */
  handleInput(key) {
    if (key === 'left' && this.x > 0) {
      this.x -= 101;
    } else if (key === 'right' && this.x < 400) {
      this.x += 101;
    } else if (key === 'up' && this.y > 0) {
      this.y -= 93;
    } else if (key === 'down' && this.y < 400) {
      this.y += 93;
    }
  }
}

// Instantiating all enemies
const allEnemies = [
  new Enemy(0, 60),
  new Enemy(202, 145),
  new Enemy(404, 230)
];

// Instantiating the player
const player = new Player(INITIAL_X, INITIAL_Y);

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
  const allowedKeys = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down'
  };
  player.handleInput(allowedKeys[e.keyCode]);
});

/**
 * 1. Checks if the player collided with an enemy
 * 2. Resets score back to zero
 * 3. Shows the player an alert informing that a collision happened
 * 4. Resets player's position back to the start
 */
function checkCollisions(allEnemies, player) {
  for (enemy of allEnemies) {
    if ((player.y >= enemy.y - COLLIDED && player.y <= enemy.y + COLLIDED) && (player.x >= enemy.x - COLLIDED && player.x <= enemy.x + COLLIDED)) {
      // Without the collision interval, player and enemy will never share the same coordinates, so there is a need to calculate an area around the player that would count as a collision
      // console.log('Player y = ', player.y);
      // console.log('Player x = ', player.x);
      // console.log('Enemy y = ', enemy.y);
      // console.log('Enemy x = ', enemy.x);
      // console.log('enemy.y - COLLIDED = ', enemy.y - COLLIDED);
      // console.log('enemy.y + COLLIDED', enemy.y + COLLIDED);
      alertify.alert('Collision detected!', 'Oops, looks like Catgirl just hit a bug!<br>Your score is <strong>reset</strong> and you go back to the start!');
      score = 0;
      $('#score').text(score);
      player.reset(INITIAL_X, INITIAL_Y);
    }
  }
};
