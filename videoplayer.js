// Check that AFRAME has been defined and can be used
if (typeof AFRAME === 'undefined') {
  throw new Error('Component attempted to register before AFRAME was available.');
}

/*
 * USE OF VIDEOPLAYER.JS
 *
 * In the html, the media circle defines the various media sources (g_abc, a_xyz, v_123). The
 * source of interest is "v_...". After the underscore, the name should match both the actual
 * video id and mp4 file. As such, the id and mp4 name should also match.
 */

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

      let camera = document.getElementById('rig');
      let viewer = document.createElement('a-entity');

      camera.append(viewer);
      viewer.setAttribute('id', 'viewer');
      viewer.setAttribute('video-player-viewer', `name: ${this.name};`);
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

/*
 * Video player viewer component : video-player-viewer
 *
 * Viewer component for the video player. Appens an a-video primitive
 * to the user camera rig together with a play/pause button. Clicking the
 * video closes the video player viewer.
 */
AFRAME.registerComponent('video-player-viewer', {
  // Editable properties
  schema: {
    name: { type: 'string' }
  },

  init: function() {
    let el = this.el;
    let data = this.data;

    el.object3D.position.set(0, 0.1, -0.5);
    el.object3D.scale.set(0.5, 0.5, 1);
    
    this.name = data.name;

    // Video window that gets displayed
    this.video = document.createElement('a-video');
    el.appendChild(this.video);

    this.video.setAttribute('src', `#${this.name}`);
    this.video.setAttribute('width', 2);
    this.video.setAttribute('height', 9/8);
    this.video.setAttribute('play-pause', `name: ${this.name}`);
    this.video.setAttribute('volume-controller', `name: ${this.name}`);
    this.video.classList.add('clickable');
    
    // The actual video that can be played, paused, etc.
    let v = document.querySelector(`#${this.name}`);
    v.play();
    v.pause();
    v.volume = 0.5;

    // Close the video and reset properties on click
    this.video.addEventListener('click', (event) => {
      if(event.target !== this.video) {
        return;
      }
      v.pause();
      v.currentTime = 0;

      el.remove();
    });
  },

  multiple: false
});

/*
 * Play pause component : play-pause
 *
 * Simple play/pause component.
 */ 
AFRAME.registerComponent('play-pause', {
  schema: {
    name: {type: 'string'}
  },

  init: function() {
    let el = this.el;
    let data = this.data;

    this.video = document.querySelector(`#${data.name}`);

    // Create icon to the play since the video is now paused
    this.ppc = document.createElement('a-image');
    el.appendChild(this.ppc);
    this.ppc.object3D.position.set(0, -0.65, 0);
    this.ppc.object3D.scale.set(0.1, 0.1, 1);
    this.ppc.setAttribute('src', '#playIcon');
    this.ppc.classList.add('clickable');

    this.video.addEventListener('ended', (event) => {
      this.ppc.setAttribute('src', '#playIcon');
    });
  },

  events: {
    // If the video is playing, set the button to pause and
    // if the video is paused, set the button to play
    click: function(event) {
      if(event.target !== this.ppc) {
        return;
      }
      
      if(this.video.paused) {
        this.video.play();
        this.ppc.setAttribute('src', '#pauseIcon');
      } else {
        this.video.pause();
        this.ppc.setAttribute('src', '#playIcon');
      }
    }
  },

  multiple: false
});

/*
 * Volume controller component : volume-controller
 *
 * Simple volumer controller component
 */
AFRAME.registerComponent('volume-controller', {
  // Editable properties
  schema: {
    name: {type: 'string'}
  },

  init: function() {
    let el = this.el;
    let data = this.data;

    this.video = document.querySelector(`#${data.name}`);

    let volDelta = 0.2;
    
    this.volUp = document.createElement('a-image');
    el.appendChild(this.volUp);
    this.volUp.setAttribute('src', '#volumeUpIcon');
    this.volUp.object3D.position.set(0.2, -0.6, 0.1);
    this.volUp.object3D.scale.set(0.075, 0.075, 1);
    this.volUp.classList.add('clickable');
    this.volUp.addEventListener('click', (event) => {
    this.video.volume = Math.min(this.video.volume + volDelta, 1);
      if(this.video.volume > 0) {
        this.volDown.setAttribute('src', '#volumeDownIcon');
      }
    });

    this.volDown = document.createElement('a-image');
    el.appendChild(this.volDown);
    this.volDown.setAttribute('src', '#volumeDownIcon');
    this.volDown.object3D.position.set(-0.2, -0.6, 0.1);
    this.volDown.object3D.scale.set(0.075, 0.075, 1);
    this.volDown.classList.add('clickable');
    this.volDown.addEventListener('click', (event) => {
    this.video.volume = Math.max(this.video.volume - volDelta, 0);
      if(this.video.volume < volDelta) {
        this.volDown.setAttribute('src', '#volumeMuteIcon');
      }
    });
  }
});
