/*
  Jarrod W. - September 19th, 2021
*/

if (typeof AFRAME === 'undefined') {
    throw new Error('Component attempted to register before AFRAME was available.')
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
   */
  AFRAME.registerComponent('camera-rig', {
    schema          :{
        curCam          :{type: 'string'},
    },
    init () {
      var data = this.data;
      var el = this.el;
      var cursorData = this.cursorData = {};

      for (const child of el.children) {
        cursorData[child.getAttribute('id')] = child.getAttribute('cursor');
        if (child.getAttribute('camera') && child.getAttribute('camera')['active'] === true) {
            data.curCam = child.getAttribute('id');
            child.setAttribute('id', 'camera');
        } else child.removeAttribute('cursor');
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
        var camera = document.getElementById(cam);
        if (!camera) {
            console.error(`'${cam}' is not a valid camera!'`);
            return;
        }

        var curCamera = document.getElementById('camera');
        curCamera.setAttribute('id', this.data.curCam);
        curCamera.removeAttribute('cursor');

        //camera.setAttribute('position', curCamera.getAttribute('position'));
        //camera.setAttribute('rotation', curCamera.getAttribute('rotation'));

        // move HUD elements
        for (const child of curCamera.children) {
            if (!child.classList.contains("locked")) camera.appendChild(child);
        }
        //camera.object3D.position.set(curCamera.object3D.position);
        //camera.object3D.quaternion.set(curCamera.object3D.quaternion);
        this.data.curCam = camera.getAttribute('id');
        camera.setAttribute('id', 'camera');
        camera.setAttribute('cursor', this.cursorData[cam])
        camera.setAttribute('camera', 'active', true);
    },
    toggleMovement() {
        document.getElementById('rig').setAttribute('wasd-controls', 'enabled', !document.getElementById('rig').getAttribute('wasd-controls').enabled);
    },
    toggleLook() {
        document.getElementById('rig').setAttribute('look-controls', 'enabled', !document.getElementById('rig').getAttribute('look-controls').enabled);
    },
  });