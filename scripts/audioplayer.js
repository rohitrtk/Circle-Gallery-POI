// Check that AFRAME has been defined and can be used
if (typeof AFRAME === 'undefined') {
    throw new Error('Component attempted to register before AFRAME was available.');
  }
  
  /**
   * Audio player primitive : <a-audio-player>
   *
   * Wrapper for the audio player component.
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
  
      el.setAttribute('geometry', {
        primitive:  'plane',
        width:      1,
        height:     1
      });
      el.setAttribute('material', {
        color:        this.defaultColour,
        src:          this.srcImage,
        transparent:  true
      });
      el.classList.add('audioplayer');
      el.classList.add('clickable');
  
      this.name = data.name;
    },
  
    // Returns true if any type of viewer is open
    isViewerOpen: function() {
      return !!document.getElementById('viewer');
    },

    events: {
      // Create viewer on click
      click: function(event) {
        if(this.isViewerOpen()) {
          return;
        }

        let camera = document.getElementById('rig');
        let viewer = document.createElement('a-entity');

        camera.append(viewer);
        viewer.setAttribute('id', 'viewer');
        viewer.setAttribute('audio-player-viewer', {
          name: this.name
        });

        console.log('Playing audio');
      },
  
      // Highlighting stuff
      mouseenter: function(event) {
        if(this.isViewerOpen()) {
          return;
        }

        this.el.setAttribute('material', {
          color: this.selectedColour
        });
      },
  
      mouseleave: function(event) {
        this.el.setAttribute('material', {
          color: this.defaultColour
        });
      }
    },
  
    multiple: true
  });

  /**
   * Audio player viewer component : audio-player-viewer
   * 
   * The viewer for the audio player. Is displayed once the user clicks
   * on an audio player component. A player button is displayed and on click
   * will change to a pause button and start playing audio. The audio is determined
   * by what is this components name which links to a source in the AMS.
   */
  AFRAME.registerComponent('audio-player-viewer', {
    // Editable properties
    schema: {
      name: {type: 'string'}
    },
    
    init: function() {
    this.name = this.data.name;

    // Background
    this.bg = document.createElement('a-plane');
    this.el.appendChild(this.bg);
    this.bg.object3D.position.set(0, -0.15, -0.5);
    this.bg.object3D.scale.set(0.125, 0.125, 1);
    this.bg.setAttribute('width', '0.5');
    this.bg.setAttribute('height', '0.5');
    this.bg.setAttribute('color', '#db6973');
    this.bg.classList.add('clickable');

    // Play/pause image
    this.player = document.createElement('a-image');
    this.bg.appendChild(this.player);
    this.player.object3D.position.set(0, 0.25, 0.1);
    this.player.setAttribute('src', '#playIcon');
    this.player.setAttribute('width', '0.5');
    this.player.setAttribute('height', '0.5');
    this.player.setAttribute('sound', `src: #${this.name}`);
    this.player.classList.add('clickable');

    // Get the sound component
    this.audio = this.player.components.sound;
    
    // Is the audio playing?
    this.isPlaying = false;

    

    // Audio image
    this.pp = document.createElement('a-image');
    this.bg.appendChild(this.pp);
    this.pp.object3D.position.set(0, 0.75, 0.1);
    this.pp.object3D.scale.set(0.5, 0.5, 1);
    this.pp.setAttribute('src', '#exit');
    this.pp.classList.add('clickable');

    // Close button (pp) event listener
    this.pp.addEventListener('click', (event) => {
      this.audio.stopSound();
      this.el.remove();
    })

    // Player event listener
    this.player.addEventListener('click', (event) => {
      if(this.isPlaying) {
        this.audio.playSound();
        
        this.player.setAttribute('src', '#pauseIcon');
      } else {
        this.audio.pauseSound();
        this.player.setAttribute('src', '#playIcon');
      }
      this.isPlaying = !this.isPlaying;
    });
  },

  multiple: false
});
