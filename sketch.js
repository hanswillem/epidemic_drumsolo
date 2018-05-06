/*
Epidemic Drum Solo
A drum solo that behaves like an epidemic
made with p5js
*/


var p;
var k;
var snd;
var started;
var maxPop;
var drg;


function preload() {
    snd = [
        loadSound('audio/BD1000.WAV'),
        loadSound('audio/CP.WAV'),
        loadSound('audio/OH00.WAV'),
        loadSound('audio/SD0010.WAV')
    ];
}


function setup() {
    createCanvas(windowWidth, windowHeight);
    noFill();
    started = false;
    p = [];
    k = 0;
    maxPop = 100;
    createPopulation(maxPop);
}


function draw() {
    background(0);
    if (!drg) {
        for (var i = 0; i < p.length; i++) {
            var f = createVector(random(-0.25, 0.25), random(-0.25, 0.25));
            p[i].applyForce(f);
            p[i].show();
            p[i].update();
            p[i].edges();
        }
    }
    infect();
    killParticles();
    hud();
}


//creates the population
function createPopulation(n) {
    for (var i = 0; i < n; i++) {
        p.push(new Particle(random(width), random(height)));
    }
}


//checks if infected particles are close to non-effected particles,
//if so the non-effected particles get infected by the infected particles
function infect() {
    for (var i = 0; i < p.length; i++) {
        var op = p.slice();
        op.splice(i, 1);
        for (var j = 0; j < op.length; j++) {
            var d = p[i].loc.dist(op[j].loc);
            var rad = ((p[i].r / 2) * p[i].rMult) + (op[j].r / 2);
            if (d < rad) {
                if (p[i].infected === true && op[j].infected === false) {
                    op[j].contact++;
                    playSample(op[j]);
                }
            }
        }
    }
}


//kills the particles that are at the end of their lifetime
function killParticles() {
    for (var i = p.length - 1; i >= 0; i--) {
        if (p[i].currentTime > p[i].lifeTime) {
            playSample(p[i]);
            p.splice(i, 1);
            k++;
        }
    }
}


//returns the number of infected particles
function getInfected() {
    var a = [];
    for (var i = 0; i < p.length; i++) {
        if (p[i].infected) {
            a.push(p[i]);
        }
    }
    return a;
}


//writes the hud to the screen
function hud() {
    noStroke();
    fill(255);
    textSize(24);
    text('population: ' + Math.floor(maxPop), 10, 30);
    text('infected: ' + getInfected().length, 10, 60);
    text('died: ' + k, 10, 90);
    if (!started) {
        textSize(36);
        var t = 'PRESS SPACE BAR TO START EPIDEMIC DRUM SOLO';
        text(t, (width / 2) - (textWidth(t) / 2), height / 2);
    } else {
        textSize(24);
        var t = 'press ESC to restart';
        text(t, 10, windowHeight - 20);
    }
    if (started && getInfected().length === 0) {
        restart();
    }
}


//infects a randon particle when the spacebar is pressed
function keyPressed() {
    if (keyCode === 32) {
        var r = int(random(p.length));
        p[r].infected = true;
        if (!started) {
            started = true;
        }
    }
    if (keyCode === 27) {
        restart();
    }
}


//plays a random sample from the audio folder
function playSample(particle) {
    var i = Math.floor(Math.random() * snd.length);
    var panning = map(particle.loc.x, 0, width, -1.0, 1.0);
    snd[i].pan(panning);
    snd[i].setVolume(0.25 + (Math.random() * 0.75));
    snd[i].play();
}


//starts dragging the population value if the mouse is over the population number
function mousePressed() {
    if (!started) {
        if (mouseX > 130 && mouseX < 180 && mouseY > 8 && mouseY < 33) {
            drg = true;
            noCursor();
        }
    }
}


//runs changePopulation() when the mouse is dragged
function mouseDragged() {
    if (drg) {
        changePopulation();
    }
}


//ends dragging the population value
function mouseReleased() {
    if (drg) {
        maxPop = Math.floor(maxPop);
        restart();
    }
    drg = false;
    cursor(ARROW);
}


//changes the population size
function changePopulation() {
    if (Math.abs(mouseX - pmouseX) > 0.5) {
        if (mouseX < pmouseX) {
            if (maxPop > 25) {
                maxPop -= 1;
            }
        } else {
            if (maxPop < 300) {
                maxPop += 1;
            }
        }
    }
}


//resets and restarts the sketch
function restart() {
    started = false;
    p = [];
    k = 0;
    createPopulation(maxPop);
}
