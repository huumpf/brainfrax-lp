new Q5("global");

const ptMinCount = 3;
const ptMaxCount = 4;

const ptMinDist = 80;
const ptDistVar = 10;
const ptMaxDist = ptMinDist + ptDistVar;

const minVel = .2;
const maxVel = .3;

const maxRot = .2;

const polyCount = 500;

let polys = [];
let currentID = 0;

function setup() {
  createCanvas(window.innerWidth, window.innerHeight * 3);

  for (let i = 0; i < polyCount; i++) {
    let poly = createPoly()
    polys.push(poly);
  }
  polys.sort(function(a, b) { return a.z - b.z; });
  for (let i = 0; i < 900; i++) {
    polys.forEach(poly => {
      movePoly(poly);
    });
  }
}

function draw() {
  background(10);
  polys.forEach(poly => {
    movePoly(poly);
    drawPoly(poly);
    if (isOutOfBounds(poly)) {
      terminate(poly);
      polys.push(createPoly());
      polys.sort(function(a, b) { return a.z - b.z; });
    }
  });
}

function createPoly() {
  let poly = {
    id: 0,
    z: 0,
    points: [],
    pos: createVector(0, 0),
    vel: createVector(0, 0),
    origin: 0,
    angle: 0,
    rotation: 0
  };

  // ID
  poly.id = currentID;
  currentID++;

  // Z value
  poly.z = random(0, 1);
  poly.z = Math.pow(poly.z, 3);

  // Create Points
  let ptCount = floor(random(ptMinCount, ptMaxCount + 1));
  let ptsPos = [];
  for (let i = 0; i < ptCount; i++) {
    ptsPos.push(random(0,1));
  }
  ptsPos.sort((a, b) => a - b);
  for (let i = 0; i < ptsPos.length; i++) {
    let angle = ptsPos[i] * 360;
    let pt = Vector.fromAngle(radians(angle), (ptMinDist + random(0, ptDistVar)) * poly.z);
    poly.points.push(pt);
  }

  // Origin (Top, Right, Bottom, Left)
  poly.origin = floor(random(1, 5));
  
  // Initial Position
  if (poly.origin == 1) {
    poly.origin = "right";
    poly.pos.x = width + ptMaxDist;
    poly.pos.y = random(0 - ptMaxDist, height + ptMaxDist);
  } else {
    poly.origin = "left";
    poly.pos.x = 0 - ptMaxDist;
    poly.pos.y = random(0 - ptMaxDist, height + ptMaxDist);
  }

  // Velocity
  if (poly.origin == "left") {
    poly.vel = Vector.fromAngle(0, random(minVel, maxVel) * (poly.z + .5));
  } else {
    poly.vel = Vector.fromAngle(PI, random(minVel, maxVel) * (poly.z + .5));
  }

  // Rotation
  poly.rotation = random(-maxRot, maxRot);

  return poly;
}

function movePoly(poly) {
  poly.pos = poly.pos.add(poly.vel);
  poly.angle += poly.rotation;
}

function drawPoly(poly) {
  // Set Color
  let col = map(poly.z, 0, 1, 22, 50);
  fill(col);
  noStroke();
  // Draw Shape
  push();
  translate(poly.pos.x, poly.pos.y);
  rotate(radians(poly.angle));
  beginShape();
  for (let i = 0; i < poly.points.length; i++) {
    vertex(poly.points[i].x, poly.points[i].y);
  }
  endShape(CLOSE);
  pop();
}

function isOutOfBounds(poly) {
  if (poly.origin == "left") {
    if (poly.pos.x > width + ptMinDist + ptDistVar) return true;
  } else if (poly.origin == "right") {
    if (poly.pos.x < 0 - ptMinDist - ptDistVar) return true;
  } else {
    return false;
  }
}

function terminate(poly) {
  let i = polys.indexOf(poly);
  polys.splice(i, 1);
}