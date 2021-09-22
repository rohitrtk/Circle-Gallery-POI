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

    el.setAttribute('position', '0 0.1 -0.5');
    el.setAttribute('scale', '0.5 0.5');
    
    this.name = data.name;
    
    for(let v of document.querySelectorAll('video')) {
      console.log(`${v.src} | ${this.name}`);

      if(v.src.includes(this.name)) {
        this.video  = v;
        this.src    = v.src;
        break;
      }
    }
    
    // The video window that gets displayed
    this.vidWindow = document.createElement('a-video');
    el.appendChild(this.vidWindow);
    this.vidWindow.setAttribute('src', this.src);
    this.video.autoplay = false;
    this.vidWindow.setAttribute('width', 2);
    this.vidWindow.setAttribute('height', 9/8);
    //this.vidWindow.setAttribute('volume-controller', `video: ${this.name}`);
    this.vidWindow.classList.add('clickable');
    
    // Click closes the video viewer
    this.vidWindow.addEventListener('click', (event) => {
      if(event.target !== this.vidWindow) {
        return;
      }

      //let v = document.querySelector(this.src);
      //console.log(v);
      //console.log(document.querySelector('#csclip'));
      
      // Pause the video to prevent it from playing while the viewer
      // isn't being displayed and reset the time to the start before
      // removing the element
      this.video.pause();
      
      this.video.currentTime = 0;

      el.remove();
    });

    // Play and pause controls
    //this.ppc = document.createElement('a-image');
    //el.appendChild(this.ppc);
    //this.ppc.setAttribute('position', ' 0 -0.6 0.1');
    //this.ppc.setAttribute('scale', '0.075 0.075');
    //this.ppc.setAttribute('play-pause.video', `video: ${this.video}`);
    //this.ppc.classList.add('clickable');

    // Play and then pause to get the video to display
    this.video.play();
    this.video.pause();
  },

  multiple: false
});

/*
 * Play pause component : play-pause
 *
 * Simple play/pause component.
 */ /*
AFRAME.registerComponent('play-pause', {
  schema: {
    video: {type: {}}
  },

  init: function() {
    let el = this.el;
    let data = this.data;

    this.video = data.video;
    this.video.loop = true;
    this.video.volume = 1;
    
    // Play and then pause to get the first frame of the video to appear
    // as opposed to a black screen
    this.video.play();
    this.video.pause();

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

/*
 * Volume controller component : volume-controller
 *
 *
 
AFRAME.registerComponent('volume-controller', {
  schema: {
    video: {type: {}}
  },

  init: function() {
    let el = this.el;
    let data = this.data;
    let video = data.video;
    let volDelta = 0.2;
    
    this.volUp = document.createElement('a-image');
    el.appendChild(this.volUp);
    this.volUp.setAttribute('src', '#volumeUpIcon');
    this.volUp.setAttribute('position', '0.2 -0.6 0.1');
    this.volUp.setAttribute('scale', '0.075 0.075');
    this.volUp.classList.add('clickable');
    this.volUp.addEventListener('click', (event) => {
      video.volume = Math.min(video.volume + volDelta, 1);
      
      if(video.volume > 0) {
        this.volDown.setAttribute('src', '#volumeDownIcon');
      }
    });

    this.volDown = document.createElement('a-image');
    el.appendChild(this.volDown);
    this.volDown.setAttribute('src', '#volumeDownIcon');
    this.volDown.setAttribute('position', '-0.2 -0.6 0.1');
    this.volDown.setAttribute('scale', '0.075 0.075');
    this.volDown.classList.add('clickable');
    this.volDown.addEventListener('click', (event) => {
      video.volume = Math.max(video.volume - volDelta, 0);
      
      if(video.volume < volDelta) {
        this.volDown.setAttribute('src', '#volumeMuteIcon');
      }
    });
  }
});*/