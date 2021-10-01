// Check that AFRAME has been defined and can be used
if (typeof AFRAME === 'undefined') {
  throw new Error('Component attempted to register before AFRAME was available.');
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
    'names'       : 'media-circle.names'
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
    el.setAttribute('geometry',  {
      primitive: 'circle',
      radius: 1
    });
    el.setAttribute('material', {
      color: '#180647',
      transparent: true,
      opacity: data.opacity,
      shader: 'flat'
    });
    el.object3D.scale.set(1, 1, 1);
    el.classList.remove('clickable');

    // Get names array by splitting the data on space
    let names = data.names.split(' ');
    if(names === '') {
      throw new Error('Media circle needs names');
    }
    
    this.numMedia = names.length;

    // Array of video, audio, and gallery names
    this.vNames = [];
    this.aNames = [];
    this.gNames = [];

    this.loadNames(names);

    // Media counter object
    let mediaCounters = {
      v: this.vNames.length,
      a: this.aNames.length,
      g: this.gNames.length
    }

    let angle = 2 * Math.PI / this.numMedia;
    for(let i = 0; i < this.numMedia; i++) {
      // Draw button and append for each media
      let temp = this.loadMedia(mediaCounters);
      el.appendChild(temp);
      temp.object3D.scale.set(0.4, 0.4, 0.4);
      temp.setAttribute('material', {
        opacity: data.opacity
      });
      
      if(this.numMedia <= 1) {
        temp.object3D.position.set(0, 0, 0.001);
        break;
      }
      
      // Math stuff
      let x = Math.cos(angle * i);
      let y = Math.sin(angle * i);
      let f = 0.6;    // Controls the placement of the buttons
      let g = 0.985   // Controls the ending placement of the lines
      
      temp.object3D.position.set(f * x, f * y, 0.001);

      // Draw lines
      let line = document.createElement('a-entity');
      line.setAttribute('line', {
        start:    {x: 0, y: 0, z:0.001},
        end:      {x: g * x, y: g * y, z: 0.001},
        color:    '#FFFFFF',
        opacity:  data.opacity
      });
      line.object3D.rotation.set(0, 0, 1.5 * angle);
      line.classList.add('line');

      el.appendChild(line);
    }

    // Draw outline
    let outline = document.createElement('a-ring');
    outline.setAttribute('color', '#000000');
    outline.setAttribute('radius-inner', '0.99');
    outline.setAttribute('radius-outer', '1.01');
    outline.setAttribute('opacity', data.opacity);
    outline.classList.add('ring');
    
    el.appendChild(outline);
  },

  // Class name button check
  cnbCheck: function(cc) {
    return cc.contains('imagegallery') || cc.contains('videoplayer') || cc.contains('audioplayer');
  },

  loadNames: function(namesArray) {
    for(const name of namesArray) {
      let type = name.charAt(0);
      let fn   = name.slice(2);

      switch(type) {
        case 'v':
          this.vNames.push(fn);
          break;
        case 'a':
          this.aNames.push(fn);
          break;
        case 'g':
          this.gNames.push(fn);
          break;
      }
    }
  },

  loadMedia: function(counters) {
    let media = null;

    // Load all videos, then all audio, then all galleries
    if(counters.v > 0) {        // Load videos if we still have videos to load
      counters.v--;
      media = document.createElement('a-video-player');
      media.setAttribute('name', `${this.vNames[counters.v]}`);
    } else if(counters.a > 0) { // Load audio if we still have audio to load
      counters.a--;
      media = document.createElement('a-audio-player');
      media.setAttribute('name', `${this.aNames[counters.a]}`);
    } else if(counters.g > 0) { // Load galleries if we still have galleries to load
      counters.g--;
      media = document.createElement('a-image-gallery');
      media.setAttribute('name', `${this.gNames[counters.g]}`);
    } else {
      throw new Error('An error occured looking for media.');
    }

    return media;
  },

  update: function() {
    let el = this.el;
    let data = this.data;
    
    try {
      el.setAttribute('material', {
        color: '#180647',
        transparent: true,
        opacity: data.opacity,
        shader: 'flat'
      });

      for(let child of el.children) {
        const childClass = child.classList;
        
        if(childClass === null) {
          console.log('Child class null!');
          continue;
        }

        if(this.cnbCheck(childClass)) {
          child.setAttribute('material', {
            opacity: data.opacity
          });
        } else if(childClass.contains('line')) {
          child.setAttribute('line', {
            opacity: data.opacity
          });
        } else if(childClass.contains('ring')) {
          child.setAttribute('opacity', data.opacity);
        }
      }
    } catch(error) {
        console.log(error);
    }
  }
});