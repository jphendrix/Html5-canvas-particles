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
let config = {
	sun_a:{count:1,min_size:100, max_size:100, position:'center'},
	sun_b:{count:1,min_size:50, max_size:50},
	planet:{count:5,min_size:5, max_size:25},
	moon:{count:7,min_size:1, max_size:5},
}

var canvas;
var c;
var particleArray = [];

function randomRange(min, max) {
  return ((Math.random() * (max - min)) + min);
}

function createParticle(args) {
  var particle = {};

	particle.tail = [];

	console.log(args);
	switch(args.position){
		case 'center':
			particle.x = window.innerWidth/2;
			particle.y = window.innerHeight/2;
			break;
		default:
			particle.x = randomRange(0, window.innerWidth);
		  particle.y = randomRange(0, window.innerHeight);
			break;
	}


	for(let i=0; i<500; i++){
		particle.tail.push({x:particle.x,y:particle.y});
	}

	let v = randomRange(0,C)/10;
  particle.xSpeed = randomRange((-1) * v, v);
  particle.ySpeed = randomRange((-1) * v, v);

  particle.size = randomRange(args.min_size, args.max_size);
  particle.color = `rgb(${randomRange(0, 255)}, ${randomRange(0, 255)}, ${randomRange(0, 255)}, ${.5})`
  return particle;
}

function generateParticles() {
	for(let key in config){
		for(let i=0; i<config[key].count; i++){
				particleArray.push(createParticle(config[key]));
		}
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

function move(){
	for(let p1=0; p1<particleArray.length; p1++){
		let particle1 = particleArray[p1];
		for(let p2=0; p2<particleArray.length; p2++){
			if(p1!=p2){
				let particle2 = particleArray[p2];
				applyF(particle1,particle2);
				applyF(particle2,particle1);
			}
		}
		particle1.tail.unshift({x:particle1.x,y:particle1.y});
		particle1.tail.pop();

		particle1.x +=particle1.xSpeed;
		particle1.y +=particle1.ySpeed;

		//bounce
		if(p1==0){
			if (particle1.x >= window.innerWidth || particle1.x <= window.innerWidth) {
				particle1.xSpeed *= -1;
			}

			if (particle1.y >= window.innerHeight || particle1.y <= window.innerHeight) {
				particle1.ySpeed *= -1;
			}
		}
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
  }
}

function animate() {
  requestAnimationFrame(animate);
  draw();
	move();
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
