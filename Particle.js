function Particle(x, y) {
    this.x = x;
    this.y = y;
    this.r = random(2, 10);

    this.loc = createVector(this.x, this.y);
    this.vel = createVector(random(-1, 1), random(-1, 1));
    this.acc = createVector(0, 0);

    this.infected = false;
	this.contact = 0;
    this.lifeTime = int(random(150, 200));
    this.currentTime = 0;
    this.rMult = 1;


    this.show = function() {
        if (this.infected) {
            noStroke();
            fill(random(255));
            ellipse(this.loc.x, this.loc.y, this.r * this.rMult, this.r * this.rMult);
            fill(0);
            ellipse(this.loc.x, this.loc.y, this.r, this.r);
        } else {
            noFill();
            stroke(255, 100);
            ellipse(this.loc.x, this.loc.y, this.r, this.r);
        }
    };


    this.update = function() {
		if (this.contact > 0) {
			this.infected = true;
		}
        if (this.infected) {
            this.currentTime++;
            this.rMult += 0.05;
        }
        this.vel.add(this.acc);
        this.vel.limit(4);
        this.loc.add(this.vel);
        this.acc.mult(0);
    };


    this.applyForce = function(f) {
        this.f = f;
        this.acc.add(f);
    };


    this.edges = function() {
        if (this.loc.x < 0) {
            this.loc.x = 0;
            this.vel.x *= -1;
        }
        if (this.loc.x > width) {
            this.loc.x = width;
            this.vel.x *= -1;
        }
        if (this.loc.y < 0) {
            this.loc.y = 0;
            this.vel.y *= -1;
        }
        if (this.loc.y > height) {
            this.loc.y = height;
            this.vel.y *= -1;
        }
    };
}
