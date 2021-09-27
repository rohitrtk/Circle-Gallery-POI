/*
  Jarrod W. - September 19th, 2021 - Updated September 23rd, 2021
*/

if (typeof AFRAME === 'undefined') {
	throw new Error('Component attempted to register before AFRAME was available.');
  }
  
  
  AFRAME.registerPrimitive('a-camera-rig', {
	defaultComponents :{
	  'camera-rig'           :{},
	},
	mappings: {
	}
  });
  
   /*
	*  Camera Rig Component
	*
	*   Events:
	*       -"update-camera": On the document. Calls updateCamera(event.details).
	* 
	*   Functions:
	*       -updateCamera(json): Calls all other update functions; used for the event handler
	*           JSON Breakdown:
	*               camera: string; Switch the active camera.
	*               toggleLook: true; Toggle looking.
	*               toggleMovement: true; Toggle movement.
	*       -changeCamera(string): Change the active camera
	*       -toggleMovements(): Toggle
	*       -toggleLook(): Toggle
	*
	*   Variables:
	*       -curCam: (String) The ID for the current camera when not active.
	*/
  AFRAME.registerComponent('camera-rig', {
	schema          :{
		curCam          :{type: 'string'},
	},
      init() {
	  var data = this.data;
	  var el = this.el;
	  var cursorData = this.cursorData = {}; // used to store cursor data. probably not efficient

	  for (const child of el.children) {
		cursorData[child.getAttribute('id')] = child.getAttribute('cursor'); // store for swapping
		if (child.getAttribute('camera') && child.getAttribute('camera')['active'] === true) { // prep proper cam
			data.curCam = child.getAttribute('id');
			child.setAttribute('id', 'camera');
		} else child.removeAttribute('cursor'); // only make unusable disabled cams
	  }
	  
  
	  // register event listener to listen for update event
	  document.addEventListener(`update-camera`, (e) => {
		  console.log(e.detail);
		this.updateCamera(e.detail);
	  });
	},
	updateCamera(info) {
		if (info.camera) this.changeCamera(info.camera);
		if (info.toggleLook) this.toggleLook();
		if (info.toggleMovement) this.toggleMovement();
	},
	changeCamera(cam) {
		if (cam == "camera") { // don't do that. don't be that guy. (Swapping to camera while on camera will lead to loss of cursor data and previous ID)
			console.error(`'camera' is already active!`);
			return;
		}
		var camera = document.getElementById(cam);
		if (!camera) { // scree.
			console.error(`'${cam}' is not a valid camera!'`);
			return;
		}

		var curCamera = document.getElementById('camera');
		curCamera.setAttribute('id', this.data.curCam); // return original ID
		curCamera.removeAttribute('cursor'); // remove interactability

		// move child elements - please have any HUD elements parented to the rig instead.
		for (const child of curCamera.children) {
			if (!child.classList.contains("locked")) camera.appendChild(child);
		}

		this.data.curCam = camera.getAttribute('id'); // swap out ID
		camera.setAttribute('id', 'camera');

		camera.setAttribute('cursor', this.cursorData[cam]); // enable cursor
		camera.setAttribute('camera', 'active', true);
	},
	toggleMovement() {
		document.getElementById('rig').setAttribute('wasd-controls', 'enabled', !document.getElementById('rig').getAttribute('wasd-controls').enabled);
	},
	toggleLook() {
		document.getElementById('rig').setAttribute('look-controls', 'enabled', !document.getElementById('rig').getAttribute('look-controls').enabled);
	},
  });