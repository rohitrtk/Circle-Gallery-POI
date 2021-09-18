let scene = document.getElementById('scene');
let ground = document.createElement('a-circle');
scene.appendChild(ground);
ground.setAttribute('position', '0 0 0');
ground.setAttribute('rotation', '-90 0 0');
ground.setAttribute('color', '#90de91');

let radius = 5;
ground.setAttribute('radius', radius);

let numPoints = Math.floor(Math.random() * 10);
let theta = 360 / numPoints;

//let particleEmitter = 'preset: dust;positionSpread: 0.5 0.5 0.5;'
//  + 'maxAge:1.5;size:0.25;particleCount:10;rotationAngle:3.14;'

for(let i = 0; i < 9; i++) {
  let tc = document.createElement('a-sphere');
  ground.appendChild(tc);

  let beta = THREE.Math.degToRad(theta * i);
  let xPos = Math.cos(beta) * radius; 
  let yPos = Math.sin(beta) * radius;

  tc.object3D.position.set(xPos, yPos, 0.6);
  tc.object3D.rotation.set(Math.PI / 2, 0, 0);
  
  tc.setAttribute('radius', '0.5');
  tc.setAttribute('color', '#FF0000');
  //tc.setAttribute('particle-system', particleEmitter);
  //tc.setAttribute('rotation', '-30 -100 -20');
}