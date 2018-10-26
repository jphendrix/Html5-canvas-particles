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

var C = 100;
var SUN_X = 500;
var SUN_Y = 500;
var BACK_COLOR = 'black';
var MAX_PARTICLES = 60;
var NOW_PARTICLES = 50;
var VELOCITY = 0.50;
var MIN_SIZE = 3;
var MAX_SIZE = 10;
var COLORS = [
  // thanks http://flatuicolors.com/
  '#1abc9c' /* aqua */ , '#16a085' /* aqua */ , '#2ecc71' /* green */ , '#27ae60' /* green */ , '#3498db' /* blue */ , '#2980b9' /* blue */ , '#9b59b6' /* purple */ , '#8e44ad' /* purple */ , '#f1c40f' /* yellow */ , '#f39c12' /* orange */ , '#e67e22' /* orange */ , '#d35400' /* orange */ , '#e74c3c' /* red */
  //,'#000000' /* black */
  //,'#a9a9a9' /* black */
  , '#ffffff' /* white */ , '#d3d3d3' /* white */
];

var canvas;
var c;
var particleArray = [];

function randomRange(min, max) {
  return ((Math.random() * (max - min)) + min);
}

function createParticle() {

  var particle = {};

  particle.x = randomRange(0, window.innerWidth);
  particle.y = randomRange(0, window.innerHeight);

  particle.xSpeed = randomRange((-1) * VELOCITY, VELOCITY);
  particle.ySpeed = randomRange((-1) * VELOCITY, VELOCITY);

  particle.size = randomRange(MIN_SIZE, MAX_SIZE);
  particle.color = COLORS[Math.floor(Math.random() * COLORS.length)];

  return particle;
}

function generateParticles() {
  for (var i = 0; i < MAX_PARTICLES; i++) {
    particleArray.push(createParticle());
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
    c.fill();

    c.closePath();

    var Fg = function(p1,p2){
      var D = function(x1,x2,y1,y2){
        return Math.max(Math.sqrt(Math.pow(x2-x1,2) + Math.pow(y2-y1,2)),1.0);
      }
      var R = D(p1.x,p2.x,p1.y,p2.y)/2;

      return (((p1.size*p2.size)/20)/(Math.pow(R,2)))/p1.size;
    }

    var applyF = function(p1,p2){
      var F = Fg(p1,p2);

      if(p1.x > p2.x){
        p1.xSpeed -= F;
      }else{
        p1.xSpeed += F;
      }

      if(p1.y > p2.y){
        p1.ySpeed -= F;
      }else{
        p1.ySpeed += F;
      }
    }
    for(let p=0; p< NOW_PARTICLES; p++){
      if(p!=i){
        let particle2 = particleArray[p];
        applyF(particle,particle2);
      }
    }
    applyF(particle,{x:SUN_X,y:SUN_Y,size:100});

    particle.x = Math.max(Math.min(particle.x + particle.xSpeed,window.innerWidth),0);
    particle.y = Math.max(Math.min(particle.y + particle.ySpeed,window.innerHeight),0)

    //bounce and evaporation

    if (particle.x >= window.innerWidth || particle.x <= 0) {
      particle.xSpeed *= -0.25;
      particle.ySpeed *= 0.25;
      particle.size *= 0.75;
    }
    if (particle.y >= window.innerHeight || particle.y <= 0) {
      particle.ySpeed *= -0.25;
      particle.xSpeed *= 0.25;
      particle.size *= 0.75;
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

$(window).click(function(e){
  SUN_X = e.pageX;
  SUN_Y = e.pageY;

  console.log(SUN_X,SUN_Y);
});

window.onload = function() {
  canvas = document.getElementById("canvas");
  c = canvas.getContext("2d");
  c.canvas.width = window.innerWidth;
  c.canvas.height = window.innerHeight;

  generateParticles();
  animate();
}
