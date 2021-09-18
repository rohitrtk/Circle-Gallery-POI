// Check that AFRAME has been defined and can be used
if (typeof AFRAME === 'undefined') {
  throw new Error('Component attempted to register before AFRAME was available.')
}

/*
 * Media circle primitive : <a-media-circle>
 * 
 * Designed to contain various media buttons which can be clicked.
 * All functionality for the buttons will be contained in their own
 * functions.
 * 
 * Properties:
 *  - media-circle: The main component of the primitive. Most functionality
 *      stems from this component.
 *  - look-at: Makes the primitive look at the specified target. By default,
 *      the target is the camera. This should not be changed.
 */
AFRAME.registerPrimitive('a-media-circle', {
  // Default components
  defaultComponents: {
    'media-circle': {},
    'look-at': '#camera'
  },

  // Property mappings
  mappings: {
    'geometry'    : 'media-circle.geometry',
    'scale'       : 'media-circle.scale',
    'color'       : 'media-circle.color',
    'transparent' : 'media-circle.material.transparent',
    'opacity'     : 'media-circle.material.opacity',
    'num-video'   : 'media-circle.numVideo',
    'num-audio'   : 'media-circle.numAudio',
    'num-gallery' : 'media-circle.numGallery'
  }
});

/*
 * Media circle component : media-circle
 * 
 * Can contain various media components for images, audio, and video. Details
 * on the number of medias are to be passed in through properties. With these numbers
 * button positions are calculated and then spawned.
 * 
 * Properties:
 *  - numVideo: The number of videos this media circle has available to watch
 *  - numAudio: The number of audios this media circle has available to listen
 *  - numGallery: The number of galleries this media circle has available to browse
 */
AFRAME.registerComponent('media-circle', {
  // Editable properties
  schema: {
    numVideo      : {type: 'number', default: 0},
    numAudio      : {type: 'number', default: 0},
    numGallery    : {type: 'number', default: 0}
  },

  init: function() {
    let el = this.el;
    let data = this.data;

    // Graphical stuff
    el.setAttribute('geometry', 'primitive:circle; radius:1; scale: 1 1 1');
    el.setAttribute('material', 'color: #180647; transparent: true; opacity: 0.9; shader: flat');
  
    // Get number of medias
    this.numVideo   = data.numVideo;
    this.numAudio   = data.numAudio;
    this.numGallery = data.numGallery;
    this.numMedia   = this.numVideo + this.numAudio + this.numGallery;

    // Media counters
    let vc = this.numVideo;
    let ac = this.numAudio;
    let gc = this.numGallery;

    let angle = 2 * Math.PI / this.numMedia;
    for(let i = 0; i < this.numMedia; i++) {
      // Math stuff
      let f = 0.6;
      let x = f * Math.cos(angle * i);
      let y = f * Math.sin(angle * i);

      // Draw buttons
      let temp = null;
      
      // Load all videos, then all audio, then all galleries
      if(vc > 0) {        // Load videos if we still have videos to load
        //temp = document.createElement('...');
        vc--;
        continue;
      } else if(ac > 0) { // Load audio if we still have audio to load
        // temp = document.createElement('...');
        ac--;
        continue;
      } else if(gc > 0) { // Load galleries if we still have galleries to laod
        temp = document.createElement('a-image-gallery');
        temp.setAttribute('name', 'dalek');
        gc--;
      }

      temp.setAttribute('position', `${x} ${y} 0.001`);
      temp.setAttribute('scale', '0.4 0.4 0.4');
      
      el.appendChild(temp);

      // Draw lines
      let line = document.createElement('a-entity');
      line.setAttribute('line', `start:0 0 0.001; end: ${x / f} ${y / f} 0.001; color: #000000`);
      line.setAttribute('rotation', `0 0 ${THREE.Math.radToDeg(1.5 * angle)}`);
      el.appendChild(line);
    }

    // Draw outline
    let outline = document.createElement('a-ring');
    outline.setAttribute('color', '#000000');
    outline.setAttribute('radius-inner', '0.99');
    outline.setAttribute('radius-outer', '1.01');
    
    el.appendChild(outline);
  }
});