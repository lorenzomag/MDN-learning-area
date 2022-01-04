// setup canvas

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

const counterSpan = document.querySelector('#ball-count');

// function to generate random number

function random(min, max) {
  const num = Math.floor(Math.random() * (max - min + 1)) + min;
  return num;
}


// Shape object
function Shape(x, y, velX, velY, exists) {
  this.x = x;
  this.y = y;
  this.velX = velX;
  this.velY = velY;
  this.exists = exists;
}

// Ball object

function Ball(x, y, velX, velY, exists, color, size) {
  Shape.call(this, x, y, velX, velY, exists);
  this.color = color;
  this.size = size;
}
Ball.prototype = Object.create(Shape.prototype);
Object.defineProperty(Ball.prototype, 'constructor', {
  value: Ball,
  enumerable: false,
  writable: true
});

Ball.prototype.draw = function () {
  if (this.exists) {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
  }
}

Ball.prototype.update = function () {
  if ((this.x + this.size) >= width) {
    this.velX *= -1;
  }
  if ((this.x - this.size) <= 0) {
    this.velX *= -1;
  }
  if ((this.y + this.size) >= height) {
    this.velY *= -1;
  }
  if ((this.y - this.size) <= 0) {
    this.velY *= -1;
  }

  this.x += this.velX;
  this.y += this.velY;
}

Ball.prototype.collisionDetect = function () {
  for (let j = 0; j < balls.length; j++) {
    if (!(this === balls[j])) {
      const dx = this.x - balls[j].x;
      const dy = this.y - balls[j].y;
      const distance = Math.sqrt(dx ** 2 + dy ** 2);

      if (distance < this.size + balls[j].size) {
        balls[j].color = this.color = `rgb(${random(0, 255)},${random(0, 255)},${random(0, 255)})`;
      }
    }
  }
}

// Evil circle

function EvilCircle(x, y, exists) {
  Shape.call(this, x, y, 20, 20, exists);
  this.color = 'white';
  this.size = 10;
}

EvilCircle.prototype = Object.create(Shape.prototype);
Object.defineProperty(EvilCircle.prototype, 'constructor', {
  value: EvilCircle,
  enumerable: false,
  writable: true
})

EvilCircle.prototype.draw = function () {
  ctx.beginPath();
  ctx.strokeStyle = this.color;
  ctx.lineWidth = 3;
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
  ctx.stroke();
}

EvilCircle.prototype.checkBounds = function () {
  if ((this.x + this.size) >= width) {
    this.x -= 5;
  }
  if ((this.x - this.size) <= 0) {
    this.x += 5;
  }
  if ((this.y + this.size) >= height) {
    this.y -= 5;
  }
  if ((this.y - this.size) <= 0) {
    this.y += 5;
  }
}

EvilCircle.prototype.setControls = function () {
  let _this = this;
  window.addEventListener('keydown', function (event) {
    if (event.key === 'a') {
      _this.x -= _this.velX;
    } else if (event.key === 'd') {
      _this.x += _this.velX;
    } else if (event.key === 'w') {
      _this.y -= _this.velY;
    } else if (event.key === 's') {
      _this.y += _this.velY;
    }
  });

  window.addEventListener('pointermove', function (event) {
    _this.x = event.clientX;
    _this.y = event.clientY;
  });
}

EvilCircle.prototype.collisionDetect = function () {
  for (let j = 0; j < balls.length; j++) {
    if (balls[j].exists) {
      const dx = this.x - balls[j].x;
      const dy = this.y - balls[j].y;
      const distance = Math.sqrt(dx ** 2 + dy ** 2);

      if (distance < this.size + balls[j].size) {
        balls[j].exists = false;
      }
    }
  }
}
// Make balls

let balls = [];

while (balls.length < 25) {
  let size = random(10, 20);
  let ball = new Ball(
    random(0 + size, width - size),
    random(0 + size, height - size),
    random(-7, 7),
    random(-7, 7),
    true,
    `rgb(${random(0, 255)},${random(0, 255)},${random(0, 255)})`,
    size
  );
  balls.push(ball);
}

// Make Evil Circle

let evilC = new EvilCircle(Math.floor(width / 2), Math.floor(height / 2), true);
evilC.setControls();

// Create loop function

function loop() {
  ctx.fillStyle = 'rgba(0,0,0,0.5)';
  ctx.fillRect(0, 0, width, height);
  evilC.draw();
  evilC.checkBounds();
  evilC.collisionDetect();
  let counter = 0;
  for (let i = 0; i < balls.length; i++) {
    if (balls[i].exists) {
      counter++;
      balls[i].draw();
      balls[i].update();
      balls[i].collisionDetect();
    }
  }
  counterSpan.textContent = counter;
  requestAnimationFrame(loop);
}

// Run loop

loop();