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

  mappings: {
    'src': 'webcam-player.src'
  }
});

/**
 * Webcam player component : webcam-player
 * 
 * Streams the users webcam on to a plane in the scene.
 * 
 * Properties:
 *  - src: The webcam source
 */
AFRAME.registerComponent('webcam-player', {
  schema: {
    'src': {type: 'string', default: ''}
  },

  init: function() {
    let el = this.el;
    
    this.streamEnabled = false;

    // Layer that webcam will be streamed onto
    let layer = document.createElement('a-layer');
    layer.setAttribute('click-enabled', false);
    layer.setAttribute('src', this.data.src);
    el.appendChild(layer);

    // Enable/disable stream button
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

    // Button text
    let text = document.createElement('a-text');
    text.setAttribute('value', 'ON');
    text.setAttribute('color', '#000000');
    text.setAttribute('align', 'center');
    text.object3D.position.set(0, 0, 0.03);
    edb.appendChild(text);

    // Stream disabled icon
    let icon = document.createElement('a-image');
    icon.object3D.position.set(0, 0, 0.05);
    icon.setAttribute('src', '#webcamOffIcon');
    layer.appendChild(icon);
    
    // Button click event listener
    edb.addEventListener('click', event => {
      this.streamEnabled = !this.streamEnabled;
      this.stream().catch(err => {
        console.log(err.message);
        this.streamEnabled = !this.streamEnabled;
      });

      text.setAttribute('value', this.streamEnabled ? 'OFF' : 'ON');
      icon.setAttribute('visible', this.streamEnabled ? false : true);
    });
  },

  // Starts/stops the stream
  stream: async function() {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true
    });

    let $video = document.getElementById('webcam');
    $video.srcObject = stream;
    $video.onloadeddata = () => {
      if(this.streamEnabled) {
        $video.play();
        return;
      }

      $video.pause();
    }
  }
});