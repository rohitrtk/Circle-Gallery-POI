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
 *  - look-at: Makes the primitive look at the specified target.
 */
AFRAME.registerPrimitive('a-media-circle', {
  // Default components
  defaultComponents: {
    'media-circle': {},
    'look-at': ''
  },

  // Property mappings
  mappings: {
    'color'       : 'media-circle.color',
    'transparent' : 'media-circle.material.transparent',
    'opacity'     : 'media-circle.opacity',
    'names'   : 'media-circle.names'
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
 *  - opacity: Components opacity level
 */
AFRAME.registerComponent('media-circle', {
  // Editable properties
  schema: {
    names         : {type: 'string', default: ''},
    opacity       : {type: 'number', default: 1.0}
  },

  init: function() {
    let el = this.el;
    let data = this.data;

    // Graphical stuff
    el.setAttribute('geometry', 'primitive:circle; radius:1; scale: 1 1 1');
    el.setAttribute('material', `color: #180647; transparent: true; opacity: ${data.opacity}; shader: flat`);
    el.classList.remove('clickable');

    // Get names array by splitting the data on space
    names = data.names.split(' ');
    if(names === '') {
      throw new Error('Media circle needs names');
    }
    
    this.numMedia = names.length;

    // Array of video, audio, and gallery names
    this.vNames = [];
    this.aNames = [];
    this.gNames = [];

    for(const n of names) {
      let m = n.split('_');
      //let prefix = n.substring(0, 2);
      //let name = n.substring(2, n.length);

      switch(m[0]) {
        case 'v':
          this.vNames.push(m[1]);
          break;
        case 'a':
          this.aNames.push(m[1]);
          break;
        case 'g':
          this.gNames.push(m[1]);
          break;
      }
    }

    this.numVideo   = this.vNames.length;
    this.numAudio   = this.aNames.length;
    this.numGallery = this.gNames.length;

    // Media counters
    let vc = this.numVideo;
    let ac = this.numAudio;
    let gc = this.numGallery;

    let angle = 2 * Math.PI / this.numMedia;
    for(let i = 0; i < this.numMedia; i++) {
      // Math stuff
      let x = Math.cos(angle * i);
      let y = Math.sin(angle * i);
      let f = 0.6;    // Controls the placement of the buttons
      let g = 0.985   // Controls the ending placement of the lines

      // Draw buttons
      let temp = null;
      
      // Load all videos, then all audio, then all galleries
      if(vc > 0) {        // Load videos if we still have videos to load
        vc--;
        temp = document.createElement('a-video-player');
        temp.setAttribute('name', `${this.vNames[vc]}`);
      } else if(ac > 0) { // Load audio if we still have audio to load
        ac--;
        temp = document.createElement('a-audio-player');
        temp.setAttribute('name', `${this.aNames[ac]}`);
      } else if(gc > 0) { // Load galleries if we still have galleries to load
        gc--;
        temp = document.createElement('a-image-gallery');
        temp.setAttribute('name', `${this.gNames[gc]}`);
      }
      
      temp.setAttribute('position', `${f * x} ${f * y} 0.001`);
      temp.setAttribute('scale', '0.4 0.4 0.4');
      temp.setAttribute('material', `opacity: ${data.opacity};`);
      
      el.appendChild(temp);

      // Draw lines
      let line = document.createElement('a-entity');
      line.setAttribute('class', 'line');
      line.setAttribute('line', `start:0 0 0.001; end: ${g * x} ${g * y} 0.001; color: #FFFFFF; opacity: ${data.opacity}`);
      line.setAttribute('rotation', `0 0 ${THREE.Math.radToDeg(1.5 * angle)}`);

      el.appendChild(line);
    }

    // Draw outline
    let outline = document.createElement('a-ring');
    outline.setAttribute('class', 'ring');
    outline.setAttribute('color', '#000000');
    outline.setAttribute('radius-inner', '0.99');
    outline.setAttribute('radius-outer', '1.01');
    outline.setAttribute('opacity', data.opacity);
    
    el.appendChild(outline);
  },

  // Class name button check
  cnbCheck: function(cn) {
    return cn.includes('imagegallery') || cn.includes('videoplayer') || cn.includes('audioplayer');
  },

  update: function() {
    let el = this.el;
    let data = this.data;
    
    try {
      el.setAttribute('material', `color: #180647; transparent: true; opacity: ${data.opacity}; shader: flat`);
      for(let child of el.children) {
        let childClass = child.getAttribute('class');
        
        if(childClass === null) {
          console.log('Child class null!');
          continue;
        }

        if(this.cnbCheck(childClass)) {
          child.setAttribute('material', `opacity: ${data.opacity};`);
        } else if(childClass == 'line') {
          child.setAttribute('line', `opacity: ${data.opacity}`);
        } else if(childClass == 'ring') {
          child.setAttribute('opacity', data.opacity);
        }
      }
    } catch(error) {
      console.log(error);
    }
  }
});