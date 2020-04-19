var ship;
var shipimg;
var asteroids = [];
var kwikib = [];
var ass;
let bg;
var lasers = [];
var game;
var pixelated;
var pew;
var kevin;
var lol;
var ifgameover = 0;

function preload() {
  pixelated = loadFont('pixelated_font/pixelated.ttf');
  shipimg = loadImage('img/ship.png')
  kwikib[0] = loadImage('img/asteroid0.png');
  kwikib[1] = loadImage('img/asteroid1.png');
  kwikib[2] = loadImage('img/asteroid2.png');
  kwikib[3] = loadImage('img/asteroid3.png');
  kwikib[4] = loadImage('img/asteroid4.png');
  bg = loadImage('img/bg.jpg');
  kevin = loadSound('img/kevin.mp3')
  lol = loadSound('img/loludied.mp3')
  pew = loadSound('img/PEW.mp3');


}

function setup() {
  createCanvas(windowWidth, windowHeight);
  game = new Game();
  ship = new Ship();
  for (var i = 0; i < 50; i++) {
    asteroids.push(new Asteroid());
  }
  soundFormats('mp3', 'ogg');

}

function RESET(){
  game = new Game();
  asteroids.length = 0;

  ship = new Ship();
  for (let i = 0; i < 50; i++) {
    asteroids.push(new Asteroid());
  }
  lol.stop();
 
}


function Game() {
  this.state = 0;

}

function draw() {
  background(bg);
  switch (game.state) {
    case 0:
      start();
      break;
    case 1:
      for (var i = lasers.length-1 ; i >=0; i--) {
        lasers[i].render();
        lasers[i].update();

        for (var j = asteroids.length - 1 ; j >= 0 ; j--) {

          if (lasers[i].hits(asteroids[j])) {
            if (asteroids[j].r > 50){

            var newAsteroids = asteroids[j].breakup();
            console.log(newAsteroids);
            asteroids = asteroids.concat(newAsteroids);
          } 
            asteroids.splice(j, 1);
            lasers.splice(i,1);
            break;
          }
        }
      }
      ship.render()
      ship.turn();
      ship.update();
      ship.edges();
      for (var i = 0; i < asteroids.length; i++) {
        asteroids[i].render();
        asteroids[i].update();
        asteroids[i].edges();
        if (ship.hits(asteroids[i])){
          ifgameover = 1;
          kevin.stop();
          
          
          RESET();
          
        }
        

      }
      break;
  }

 
}

function start() {

  displayBeginGame();
  if (keyIsDown(ENTER)) {
    game.state++; // go to tutorial
    lol.stop();
    kevin.play();

  }
}

function displayBeginGame() {
  if(lol.isPlaying()){
    
  }else {
  lol.play()

  }

  if (ifgameover== 0){
  background(bg);
  textAlign(CENTER);
  fill(255);
  stroke(255);
  if (frameCount % 45 > 22) fill(0); // make text flash
  else fill(255);
  if (width > 1200) textFont(pixelated, 200);
  else textFont(pixelated, 100);
  text('Asteroids Wars', width / 2, height / 2 - 100);

  textFont(pixelated, 30);
  text("Created by JA3BU9 & GITSALAH", width / 2, height / 2 + 400);
  

  textFont('monospace', 40);
  fill(255);
  text("press 'ENTER' to play", width / 2, height / 2 + 40);
} else {
  background(bg);
  textAlign(CENTER);
  fill(255);
  stroke(255);
  if (frameCount % 45 > 22) fill(0); // make text flash
  else fill(255);
  if (width > 1200) textFont(pixelated, 200);
  else textFont(pixelated, 200);
  text('LOL U DIED!!!', width / 2, height / 2 - 100);

  textFont(pixelated, 30);
  text("Created by JA3BU9 & GITSALAH", width / 2, height / 2 + 400);

  textFont('monospace', 40);
  fill(255);
  text("press 'ENTER' to play", width / 2, height / 2 + 40);

}
}



function keyReleased() {
  ship.setRotation(0);
  ship.boosting(false)

}

function keyPressed() {
  if (keyCode == UP_ARROW) {
    ship.boosting(true);
    
  } else if (key == ' ') {
    lasers.push(new Laser(ship.pos, ship.heading));
    pew.play();

  } else if (keyCode == RIGHT_ARROW) {
    ship.setRotation(0.1);
  } else if (keyCode == LEFT_ARROW) {
    ship.setRotation(-0.1)
  } 
  
}




function Asteroid(pos, s) {
  if (pos) {
    this.pos = pos.copy();
  } else {
    this.pos = createVector(-(random(width)), -(random(height)));
  }
  if (s){
     this.r = s*0.5;

  } else {
  this.r = random(40, 200);

  }
  this.vel = p5.Vector.random2D();
  var r = floor(random(0, kwikib.length));

  this.update = function () {
    this.pos.add(this.vel);

  }


  this.render = function () {
    push();
    imageMode(CENTER)

    translate(this.pos.x, this.pos.y)
    image(kwikib[r], 0, 0, this.r, this.r)
    pop();
  }

  this.breakup = function () {
    var newA = [];
    newA[0] = new Asteroid(this.pos, this.r);
    newA[1] = new Asteroid(this.pos, this.r);
    return newA;


  }



  this.edges = function () {
    if (this.pos.x > width + this.r) {
      this.pos.x = -this.r;
    } else if (this.pos.x < -this.r) {
      this.pos.x = width + this.r;
    }

    if (this.pos.y > height + this.r) {
      this.pos.y = -this.r;
    } else if (this.pos.y < -this.r) {
      this.pos.y = height + this.r;
    }
  }
}


function Ship() {
  this.pos = createVector(width / 2, height / 2);
  this.r = 80;
  this.heading = 0;
  this.rotation = 0;
  this.vel = createVector(1, 0);
  this.isBoosting = false;


  this.boosting = function (b) {
    this.isBoosting = b;
  }

  this.update = function () {
    if (this.isBoosting) {
      this.boost();
    }
    this.pos.add(this.vel);

    this.vel.mult(0.97)
  }
  this.boost = function () {
    var force = p5.Vector.fromAngle(this.heading);
    force.mult(0.5)
    this.vel.add(force);
  }


  this.hits = function(asteroid){
    var d = dist (this.pos.x, this.pos.y , asteroid.pos.x, asteroid.pos.y)
    if (d< (this.r + asteroid.r)/2){
      return true;
    } else {
      return false;
    }
  }


  this.render = function () {
    push();
    translate(this.pos.x, this.pos.y)
    imageMode(CENTER)
    rotate(this.heading + PI / 2)
    image(shipimg, 0, 0, this.r, this.r + this.r * 1 / 3)
    pop();
  }


  this.edges = function () {
    if (this.pos.x > width + this.r) {
      this.pos.x = -this.r;
    } else if (this.pos.x < -this.r) {
      this.pos.x = width + this.r;
    }

    if (this.pos.y > height + this.r) {
      this.pos.y = -this.r;
    } else if (this.pos.y < -this.r) {
      this.pos.y = height + this.r;
    }
  }


  this.setRotation = function (a) {
    this.rotation = a;
  }


  this.turn = function () {
    this.heading += this.rotation;
  }

}

function Laser(spos, angle) {
  this.pos = createVector(spos.x, spos.y);
  this.vel = p5.Vector.fromAngle(angle);
  this.vel.mult(10);

  this.update = function () {
    this.pos.add(this.vel);
  }
  this.render = function () {
    push()
    stroke(255);
    strokeWeight(4);
    point(this.pos.x, this.pos.y)
    pop()
  }

  this.hits = function (asteroid) {
    var d = dist(this.pos.x, this.pos.y, asteroid.pos.x, asteroid.pos.y);
    if (d < asteroid.r) {
      return true;
    } else {
      return false;
    }
  }

}






































//JA3BU9 & GITSALAH