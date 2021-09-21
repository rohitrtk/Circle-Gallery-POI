// Check that AFRAME has been defined and can be used
if (typeof AFRAME === 'undefined') {
  throw new Error('Component attempted to register before AFRAME was available.')
}

/*
 * Video player primitive : <a-video-player>
 *
 * ...
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

    this.vid = document.createElement('a-video');
    el.appendChild(this.vid);
    this.vid.setAttribute('src', '#csclip1');
    this.vid.setAttribute('width', 2);
    this.vid.setAttribute('height', 9/8);
    this.vid.classList.add('clickable');
    
    this.controls = document.createElement('a-image');
    el.appendChild(this.controls);
    this.controls.setAttribute('position', ' 0 -0.6 0.1');
    this.controls.setAttribute('scale', '0.1 0.1');
    this.controls.setAttribute('play-pause', '');
    this.controls.classList.add('clickable');
    
    this.vid.addEventListener('click', (event) => {
      if(event.target !== this.vid) {
        return;
      }

      el.remove();
    });
  },

  multiple: false
})

AFRAME.registerComponent('play-pause', {
  schema: {
    name: { type: 'string' }
  },

  init: function() {
    let el = this.el;

    this.video = document.querySelector('#csclip1');
    this.video.loop = true;

    // Play and then pause to get the first frame of the video to appear
    // as opposed to a black screen
    this.video.play();
    this.video.pause();
    
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
  }
})