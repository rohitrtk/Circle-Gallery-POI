Utility.CHECK_AFRAME();

/*
 * Media circle primitive : <a-media-circle>
 * 
 * Designed to contain various media buttons which can be clicked.
 * All functionality for the buttons will be contained in their own
 * functions.
 */
AFRAME.registerPrimitive('a-media-circle', {
  defaultComponents: {
    'mediacircle': {}
  },

  mappings: {
    'color'       : 'mediacircle.color',
    'transparent' : 'mediacircle.material.transparent',
    'opacity'     : 'mediacircle.opacity',
    'image'       : 'mediacircle.image',
    'video'       : 'mediacircle.video',
    'audio'       : 'mediacircle.audio'
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
AFRAME.registerComponent('mediacircle', {
  schema: {
    image: { type: 'array', default: [] },
    video: { type: 'array', default: [] },
    audio: { type: 'array', default: [] },
    opacity: { type: 'number', default: 1.0 }
  },

  dependencies: ['poi'],

  init: function () {
    let el = this.el;
    const data = this.data;

    // Graphical stuff
    el.setAttribute('geometry', {
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

    // Media counter object
    let mediaCounters = {
      v: data.video.length,
      a: data.audio.length,
      g: 1 // TEMP
    };

    let numMedia = 0;
    for (const property in mediaCounters) {
      numMedia += mediaCounters[property];
    }

    let angle = 2 * Math.PI / numMedia;
    for (let i = 0; i < numMedia; i++) {
      // Draw button and append for each media
      let temp = this.loadMedia(mediaCounters);
      el.appendChild(temp);
      temp.object3D.scale.set(0.4, 0.4, 0.4);
      temp.setAttribute('material', {
        opacity: data.opacity
      });

      if (numMedia <= 1) {
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
        start: { x: 0, y: 0, z: 0.001 },
        end: { x: g * x, y: g * y, z: 0.001 },
        color: '#FFFFFF',
        opacity: data.opacity
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
  cnbCheck: function (cc) {
    return cc.contains('imagegallery') || cc.contains('videoplayer') || cc.contains('audioplayer');
  },

  loadMedia: function (counters) {
    const data = this.data;
    let media = null;

    // Load all videos, then all audio, then all galleries
    if (counters.v > 0) {        // Load videos if we still have videos to load
      counters.v--;
      media = document.createElement('a-video-player');
      media.setAttribute('src', data.video[counters.v]);
    } else if (counters.a > 0) { // Load audio if we still have audio to load
      counters.a--;
      media = document.createElement('a-audio-player');
      media.setAttribute('source', data.audio[counters.a]);
    } else if (counters.g > 0) { // Load galleries if we still have galleries to load
      counters.g--;
      media = document.createElement('a-image-gallery');
      media.setAttribute('images', data.image);
    }

    return media;
  },

  update: function () {
    let el = this.el;
    const data = this.data;

    try {
      el.setAttribute('material', {
        color: '#180647',
        transparent: true,
        opacity: data.opacity,
        shader: 'flat'
      });

      for (let child of el.children) {
        const childClass = child.classList;

        if (childClass === null) {
          console.log('Child class null!');
          continue;
        }

        if (this.cnbCheck(childClass)) {
          child.setAttribute('material', {
            opacity: data.opacity
          });
        } else if (childClass.contains('line')) {
          child.setAttribute('line', {
            opacity: data.opacity
          });
        } else if (childClass.contains('ring')) {
          child.setAttribute('opacity', data.opacity);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
});