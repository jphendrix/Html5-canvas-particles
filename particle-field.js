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

const C = 10;
const BACK_COLOR = 'black';
const MAX_PARTICLES = 25;
let MAX_SIZE = 100.00;

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

	let v = randomRange(0,C)/10;
  particle.xSpeed = randomRange((-1) * v, v);
  particle.ySpeed = randomRange((-1) * v, v);

  particle.size = MAX_SIZE;
  particle.color = `rgb(${randomRange(0, 255)}, ${randomRange(0, 255)}, ${randomRange(0, 255)}, ${.5})`

	MAX_SIZE = MAX_SIZE * 0.75;
  return particle;
}

function generateParticles() {
  for (var i = 0; i < MAX_PARTICLES; i++) {
    particleArray.push(createParticle());
  }
}

//Distiance
function D(p1,p2){
	let d = Math.max(Math.sqrt(Math.pow(p2.x-p1.x,2) + Math.pow(p2.y-p1.y,2)),1.0);
	if(isNaN(d)){ console.log('D',p1,p2,d); return  500;}
	return d;
}

//Force of g between two objects
function Fg(p1,p2){
	let d=D(p1,p2);
	let f = ((((p1.size*p2.size)/20)/(Math.pow(d,1)))/Math.pow(p1.size,3))*2.5;
	if(isNaN(f)){ console.log('F',p1,p2,f); return  0;}
	return f;
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

  for (var i = 0; i < particleArray.length; i++) {

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

    for(let p=0; p< particleArray.length; p++){
      if(p!=i){
        let particle2 = particleArray[p];

        applyF(particle,particle2);
				applyF(particle2,particle);
      }
    }

		particle.tail.unshift({x:particle.x,y:particle.y});
		particle.tail.pop();

    particle.x +=particle.xSpeed;
    particle.y +=particle.ySpeed;

    //bounce
		if(i==0){
			if (particle.x >= window.innerWidth || particle.x <= window.innerWidth) {
	      particle.xSpeed *= -1;
	    }

	    if (particle.y >= window.innerHeight || particle.y <= window.innerHeight) {
	      particle.ySpeed *= -1;
	    }
		}else{

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
