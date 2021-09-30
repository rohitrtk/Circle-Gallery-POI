// Check that AFRAME has been defined and can be used
if (typeof AFRAME === 'undefined') {
  throw new Error('Component attempted to register before AFRAME was available.');
}

/**
 * Wrapper for the webcam player : <a-webcam-player>
 */
AFRAME.registerPrimitive('a-webcam-player', {
  defaultComponents: {
    'webcam-player': {}
  },

  mappings: {}
});

/**
 * Webcam player component : webcam-player
 */
AFRAME.registerComponent('webcam-player', {
  init: function() {
    let el = this.el;
    
    let layer = document.createElement('a-layer');
    layer.setAttribute('click-enabled', false);
    layer.setAttribute('src', '#webcam');
    el.appendChild(layer);

    let edb = document.createElement('a-entity');
    edb.setAttribute('geometry', {
      primitive: 'box',
      width: 0.5,
      height: 0.25,
      depth: 0.05
    });
    edb.setAttribute('material', {
      color: '#e6e6e6',
      shader: 'flat'
    });
    edb.object3D.position.set(0, -0.75, 0);
    edb.classList.add('clickable');
    layer.appendChild(edb);

    this.streamEnabled = false;

    edb.addEventListener('click', event => {
      this.streamEnabled = !this.streamEnabled;

      if(this.streamEnabled) {
        this.startStream().catch(err => {
          console.log(`Unable to start stream: ${err.message}`);
          this.streamEnabled = false;
        });
      } else {
        this.stopStream().catch(err => {
          console.log(`Unable to stop stream: ${err.message}`);
          this.streamEnabled = true;
        });
      }
    });

    
  },

  startStream: async function() {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true
    });

    let $video = document.getElementById('webcam');
    $video.srcObject = stream;
    $video.onloadeddata = () => {
      $video.play();
      console.log($video);
    }
  },

  stopStream: async function() {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true
    });

    let $video = document.getElementById('webcam');
    $video.srcObject = stream;
    $video.onloadeddata = () => {
      $video.pause();
    }
  }
});
