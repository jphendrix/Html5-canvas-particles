/**
 * Canvas Particles
 *
 * based on work of Diego Vilariño & John Finley
 * https://github.com/dieg0v/Html5-canvas-particles
 * https://github.com/jpfinley/Html5-canvas-particles
 */

/** begin RequestAnimationFrame.js
 *
 * Provides requestAnimationFrame in a cross browser way.
 * http://paulirish.com/
 */
if (!window.requestAnimationFrame) {

  window.requestAnimationFrame = (function() {
    return window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function(callback) {
        window.setTimeout(callback, 1000 / 60);
      };
  })();
}

const C = 5;
const BACK_COLOR = 'black';
const MAX_PARTICLES = 50;
const NOW_PARTICLES = 3;
const MIN_SIZE = 1;
const MAX_SIZE = 100000;

var canvas;
var c;
var particleArray = [];

function randomRange(min, max) {
  return ((Math.random() * (max - min)) + min);
}

function createParticle() {

  var particle = {};

	particle.tail = [];
  particle.x = randomRange(0, window.innerWidth);
  particle.y = randomRange(0, window.innerHeight);

	for(let i=0; i<500; i++){
		particle.tail.push({x:particle.x,y:particle.y});
	}

	let v = randomRange(0,C)/100;
  particle.xSpeed = randomRange((-1) * v, v);
  particle.ySpeed = randomRange((-1) * v, v);

  particle.size = randomRange(MIN_SIZE, MAX_SIZE)/1000;
  particle.color = `rgb(${randomRange(0, 255)}, ${randomRange(0, 255)}, ${randomRange(0, 255)}, ${.5})`

  return particle;
}

function generateParticles() {
  for (var i = 0; i < MAX_PARTICLES; i++) {
    particleArray.push(createParticle());
  }
}

//Distiance
function D(p1,p2){
	return Math.max(Math.sqrt(Math.pow(p2.x-p1.x,2) + Math.pow(p2.y-p1.y,2)),1.0);
}

//Force of g between two objects
function Fg(p1,p2){
	var d = D(p1,p2);
	return ((((p1.size*p2.size)/20)/(Math.pow(d,1)))/Math.pow(p1.size,3))*2.5;
}

function applyF(p1,p2){
	var F = Fg(p1,p2);

	if(p1.x > p2.x){
		p1.xSpeed -= F * (1-(Math.abs(p1.xSpeed)/C));
	}else{
			p1.xSpeed += F * (1-(Math.abs(p1.xSpeed)/C));
	}

	if(p1.y > p2.y){
		p1.ySpeed -= F * (1-(Math.abs(p1.xSpeed)/C));
	}else{
		p1.ySpeed += F * (1-(Math.abs(p1.xSpeed)/C));
	}


}

function draw() {
	c.fillStyle = BACK_COLOR;
  c.fillRect(0, 0, window.innerWidth, window.innerHeight);

  for (var i = 0; i < NOW_PARTICLES; i++) {

    var particle = particleArray[i];
    c.beginPath();
    c.fillStyle = particle.color;

    var radius = particle.size / 2;
    c.arc(particle.x, particle.y, radius, 0, 2 * Math.PI, false);
		c.fill()
		c.beginPath()
		c.moveTo(particle.x,particle.y)
		for(let t=0; t<particle.tail.length; t++){
			c.lineTo(particle.tail[t].x,particle.tail[t].y);
		}
		c.strokeStyle = particle.color;
		c.stroke();

    c.closePath();

    for(let p=0; p< NOW_PARTICLES; p++){
      if(p!=i){
        let particle2 = particleArray[p];

        applyF(particle,particle2);
				applyF(particle2,particle);
      }
    }

		particle.tail.unshift({x:particle.x,y:particle.y});
		particle.tail.pop();

    particle.x = Math.max(Math.min(particle.x + particle.xSpeed,window.innerWidth),0);
    particle.y = Math.max(Math.min(particle.y + particle.ySpeed,window.innerHeight),0)

    //bounce and evaporation

		let  factor = 0.95;
		if(particle.xSpeed > C){
			particle.xSpeed = C;
		}

		if(particle.ySpeed > C){
			particle.ySpeed = C;
		}

		if(particle.xSpeed < C*-1){
			particle.xSpeed = C*-1;
		}

		if(particle.ySpeed < C*-1){
			particle.ySpeed = C*-1;
		}

    if (particle.x >= window.innerWidth || particle.x <= 0) {
      particle.xSpeed *= factor*-1;
      particle.ySpeed *= factor;
      particle.size *= factor;
    }

    if (particle.y >= window.innerHeight || particle.y <= 0) {
      particle.ySpeed *= factor*-1;
      particle.xSpeed *= factor;
      particle.size *= factor;
    }

    //recycle particles that fly off the screen
    if (particle.x < -(particle.size) ||
      particle.y < -(particle.size) ||
      particle.x > window.innerWidth + particle.size ||
      particle.y > window.innerHeight + particle.size) {
      particleArray[i] = createParticle();
    }
  }
}

function animate() {
  requestAnimationFrame(animate);
  draw();
}

$(window).resize(function() {
  var canvas = document.getElementById('canvas');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

window.onload = function() {
  canvas = document.getElementById("canvas");
  c = canvas.getContext("2d");
  c.canvas.width = window.innerWidth;
  c.canvas.height = window.innerHeight;

  generateParticles();
  animate();
}
