let scene   = document.getElementById('scene');
let ground  = document.createElement('a-circle');

scene.appendChild(ground);
ground.object3D.position.set(0, 0, 0);
ground.object3D.rotation.set(-Math.PI / 2, 0, 0);
ground.setAttribute('color', '#90de91');
ground.setAttribute('radius', 9);

/*
let numPoints = Math.floor(Math.random() * 10);
let theta = 360 / numPoints;

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
}
*/