// Check that AFRAME has been defined and can be used
if (typeof AFRAME === 'undefined') {
  throw new Error('Component attempted to register before AFRAME was available.')
}

/*
 * Video player primitive : <a-video-player>
 *
 * Wraps the video player component into a primitive. 
 */
AFRAME.registerPrimitive('a-video-player', {
  // Default components
  defaultComponents: {
    'video-player': {}
  },

  // Default mappings
  mappings: {
    'name'  : 'video-player.name'
  }
});

/*
 * Video player component : video-player
 *
 * Interactable button that opens a video viewer when clicked. Component
 * also takes a name which specifies what video file is played when 
 * component is clicked.
 * 
 * Properties:
 *  - name: Defines the name of the video that this primitive
 *  should be playing.
 */
AFRAME.registerComponent('video-player', {
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
    this.srcImage         = '#videosIcon';

    el.setAttribute('geometry', 'primitive:plane; width:1; height:1');
    el.setAttribute('material', `color: ${this.defaultColour}; src: ${this.srcImage}; transparent: true`);
    el.classList.add('videoplayer');
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
      let viewer = document.createElement('a-video');

      camera.append(viewer);
      viewer.setAttribute('id', 'viewer');
      viewer.setAttribute('video-player-viewer', `name: ${this.name};`);

      console.log('Playing video');
    },

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

/*
 * Video player viewer component : video-player-viewer
 *
 * Viewer component for the video player. Appens an a-video primitive
 * to the user camera rig together with a play/pause button. Clicking the
 * video closes the video player viewer.
 */
AFRAME.registerComponent('video-player-viewer', {
  schema: {
    name: { type: 'string' }
  },

  init: function() {
    let el = this.el;
    let data = this.data;

    this.name = data.name;

    el.setAttribute('position', '0 0.1 -0.5');
    el.setAttribute('scale', '0.5 0.5');

    // The video that gets displayed
    this.vid = document.createElement('a-video');
    el.appendChild(this.vid);
    this.vid.setAttribute('src', '#csclip1');
    this.vid.setAttribute('width', 2);
    this.vid.setAttribute('height', 9/8);
    this.vid.setAttribute('volume-slider', '');
    this.vid.classList.add('clickable');
    
    // Click closes the video viewer
    this.vid.addEventListener('click', (event) => {
      if(event.target !== this.vid) {
        return;
      }

      let v = document.querySelector('#csclip1');
      
      // Pause the video to prevent it from playing while the viewer
      // isn't being displayed and reset the time to the start before
      // removing the element
      v.pause();
      v.currentTime = 0;

      el.remove();
    });
    
    // Play and pause controls
    this.ppc = document.createElement('a-image');
    el.appendChild(this.ppc);
    this.ppc.setAttribute('position', ' 0 -0.6 0.1');
    this.ppc.setAttribute('scale', '0.075 0.075');
    this.ppc.setAttribute('play-pause', '');
    this.ppc.classList.add('clickable');
  },

  multiple: false
});

/*
 * Play pause component : play-pausre
 *
 * Simple play/pause component.
 */
AFRAME.registerComponent('play-pause', {
  schema: {
    name: { type: 'string' }
  },

  init: function() {
    let el = this.el;

    // === === Should probably move this section
    this.video = document.querySelector('#csclip1');
    this.video.loop = true;
    this.video.volume = 0.1;
    
    // Play and then pause to get the first frame of the video to appear
    // as opposed to a black screen
    this.video.play();
    this.video.pause();
    // === ===

    // Set the current icon to the play since the video is now paused
    el.setAttribute('src', '#playIcon');
    el.classList.add('clickable');
  },

  events: {
    click: function(event) {
      console.log('clicked');
      
      if(this.video.paused) {
        this.video.play();
        this.el.setAttribute('src', '#pauseIcon');
      } else {
        this.video.pause();
        this.el.setAttribute('src', '#playIcon');
      }
    }
  },

  multiple: false
});

AFRAME.registerComponent('volume-slider', {
  schema: {

  },

  init: function() {
    let el = this.el;
    let data = this.data;

    this.volumeBar = document.createElement('a-plane');
    el.appendChild(this.volumeBar);
    this.volumeBar.setAttribute('position', '0 -0.62 0');
    this.volumeBar.setAttribute('width', 0.25);
    this.volumeBar.setAttribute('height', 0.0075);

    this.volumeCir = document.createElement('a-circle');
    this.volumeBar.appendChild(this.volumeCir);
    this.volumeCir.setAttribute('position', '0 0 0.001');
    this.volumeCir.setAttribute('radius', 0.025);
    this.volumeCir.setAttribute('color', '#000000');
    this.volumeCir.classList.add('clickable');
  }
});