// Check that AFRAME has been defined and can be used
if (typeof AFRAME === 'undefined') {
    throw new Error('Component attempted to register before AFRAME was available.')
  }
  
  /**
   * Audio player primitive : <a-audio-player>
   *
   * Wrapper for the audio player component
   */
  AFRAME.registerPrimitive('a-audio-player', {
    // Default components
    defaultComponents: {
      'audio-player': {}
    },
  
    // Default mappings
    mappings: {
      'name'  : 'audio-player.name'
    }
  });
  
  /**
   * Audio player component : audio-player
   *
   * Interactable button that opens up an audio viewer when clicked. Component
   * also takes a name which specifies what audio file is played when the
   * component is clicked.
   */
  AFRAME.registerComponent('audio-player', {
    // Editable properties
    schema: {
      name: { type: 'string' }
    },
  
    init: function() {
      let el = this.el;
      let data = this.data;
  
      // Material stuff
      this.defaultColour    = '#FFFFFF';
      this.selectedColour   = '#f5b942';
      this.srcImage         = '#audioIcon';
  
      el.setAttribute('geometry', 'primitive:plane; width:1; height:1');
      el.setAttribute('material', `color: ${this.defaultColour}; src: ${this.srcImage}; transparent: true`);
      el.classList.add('audioplayer');
      el.classList.add('clickable');
  
      this.name = data.name;
    },
  
    isViewerOpen: function() {
      return !!document.getElementById('viewer');
    },

    events: {
      // Create viewer on click
      click: function(event) {
        if(this.isViewerOpen()) {
          return;
        }

        let camera = document.getElementById('camera');
        let viewer = document.createElement('a-entity');

        camera.append(viewer);
        viewer.setAttribute('id', 'viewer');
        viewer.setAttribute('audio-player-viewer', `name: ${this.name};`);

        console.log('Playing audio');
      },
  
      // Highlighting stuff
      mouseenter: function(event) {
        if(this.isViewerOpen()) {
          return;
        }

        this.el.setAttribute('material', `color: ${this.selectedColour}`);
      },
  
      mouseleave: function(event) {
        this.el.setAttribute('material', `color: ${this.defaultColour}`);
      }
    },
  
    multiple: true
  });

  /**
   * Audio player viewer component : audio-player-viewer
   * 
   * ...
   */

AFRAME.registerComponent('audio-player-viewer', {
  // Editable properties
  schema: {
    name: {type: 'string'}
  },

  init: function() {
    let el = this.el;
    let data = this.data;

    this.name = data.name;
    
    this.audioEl = document.createElement('a-sound');
    el.appendChild(this.audioEl);
    this.audioEl.setAttribute('geometry', 'primitive: plane');
    this.audioEl.setAttribute('position', '0 0 -0.5');
    this.audioEl.setAttribute('audio-handler', `name: ${this.name}`);
  },

  multiple: false
});

AFRAME.registerComponent('audio-handler', {
  schema: {
    name: {type: 'string'}
  },
  
  init: function() {
    let data = this.data;
    let el = this.el;

    this.audio = el.components.sound;
    console.log(this.audio);
    el.setAttribute('src', `#${data.name}`);
    el.classList.add('clickable');
    el.addEventListener('click', (event) => {
      this.audio.playSound();
    });
  }
})