Utility.CHECK_AFRAME();

/*
 * Image gallery primitive : <a-image-gallery>
 * 
 * Used to build image galleries. Contains the image
 * gallery component by default. 
 */
AFRAME.registerPrimitive('a-image-gallery', {
  defaultComponents: {
    'image-gallery': {}
  },

  mappings: {
    'images': 'image-gallery.images'
  }
});

/*
 * Image gallery component : image-gallery
 * 
 * Contains the geometry for the image gallery and is responsible for
 * opening an image gallery viewer if the gallery is clicked. Geometry is
 * set to a transparent plane with a set source for an icon. Galleries should
 * usually be appended to a media circle. Image gallery takes in an array
 * of strings. Each string corresponds to an image source.
 */
AFRAME.registerComponent('image-gallery', {
  schema: {
    images: { type: 'array', default: [] }
  },

  init: function() {
    let el = this.el;
    const data = this.data;

    // Material stuff
    this.defaultColour    = '#FFFFFF';
    this.selectedColour   = '#f5b942';
    this.srcImage         = '#galleryIcon'; 

    el.setAttribute('geometry', {
      primitive: 'plane',
      width: 1,
      height: 1
    });
    el.setAttribute('material', {
      color: this.defaultColour,
      src: this.srcImage,
      transparent: true
    });
    el.classList.add('imagegallery');
    el.classList.remove('clickable');

    this.images = data.images;
  },

  // Returns true if a viewer is already open
  isViewerOpen: function() {
    return !!document.getElementById('viewer');
  },

  events: {
    // If there is no open viewer, create a new image gallery viewer and
    // append it to the camera as a child
    click: function(event) {
      if(this.isViewerOpen()) {
        return;
      } 

      let viewer = document.createElement('a-image-gallery-viewer');
      viewer.setAttribute('images', this.images);
      
      let camera = document.getElementById('rig');
      camera.appendChild(viewer);
    },

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
 * Image gallery viewer primitive : <a-image-gallery-viewer>
 * 
 * Wrapper for the image gallery viewer component
 */
AFRAME.registerPrimitive('a-image-gallery-viewer', {
  defaultComponents: {
    'image-gallery-viewer' : {}
  },

  mappings: {
    images: 'image-gallery-viewer.images'
  }
});

/*
 * Image gallery viewer component : image-gallery-viewer
 * 
 * Contains the functionallity for viewing images in an image gallery. Takes
 * in an array of strings. Each string is an image source to be displayed
 * by the viewer.
 */
AFRAME.registerComponent('image-gallery-viewer', {
  defaultComponents: {
    images: { type: 'array', default: [] }
  },

  init: function() {
    let el = this.el;
    const data = this.data;
    
    this.imageIndex = 0;
    this.images = data.images;
    // No clue why aframe decides to convert images to a string
    // even though quite clearly we want it as an array
    if(typeof(this.images) === 'string') {
      this.images = this.images.split(',');
    }

    el.setAttribute('id', 'viewer');

    // Main window
    this.mw = document.createElement('a-layer');
    this.mw.object3D.position.set(0, 0.1, -0.5);
    this.mw.object3D.scale.set(0.5, 0.5);
    this.mw.setAttribute('id', 'igv_mainWindow');
    el.appendChild(this.mw);

    this.lw = document.createElement('a-layer');
    this.lw.object3D.position.set(-0.4, -0.1, -0.5);
    this.lw.object3D.rotation.set(0, THREE.Math.degToRad(31), 0);
    this.lw.object3D.scale.set(0.15, 0.15);
    this.lw.setAttribute('id', 'igv_leftWindow');
    this.lw.addEventListener('click', (event) => {
      this.imageIndex = Math.max(0, this.imageIndex - 1);
      this.updateWindows();
    });
    el.appendChild(this.lw);

    this.rw = document.createElement('a-layer');
    this.rw.object3D.position.set(0.4, -0.1, -0.5);
    this.rw.object3D.rotation.set(0, THREE.Math.degToRad(-31), 0);
    this.rw.object3D.scale.set(0.15, 0.15);
    this.rw.setAttribute('id', 'igv_rightWindow');
    this.rw.addEventListener('click', (event) => {
      this.imageIndex = Math.min(this.images.length - 1, this.imageIndex + 1);
      this.updateWindows();
    });
    el.appendChild(this.rw);
    
    // Close Window
    this.cw = document.createElement('a-circle');
    this.mw.appendChild(this.cw);
    this.cw.object3D.position.set(0.47, 0.42, 0.1);
    this.cw.object3D.scale.set(0.4, 0.4);
    this.cw.setAttribute('id', 'igv_closeWindow');
    this.cw.setAttribute('color', '#FFFFFF');
    this.cw.setAttribute('transparent', 'true');
    this.cw.setAttribute('radius', '0.1');
    this.cw.setAttribute('src', '#exit');
    this.cw.setAttribute('shader', 'flat');
    this.cw.classList.add('clickable');
    this.cw.addEventListener('click', (e) => {
      el.remove();
    });

    // Background for the close window icon
    this.cwb = document.createElement('a-circle');
    this.cw.appendChild(this.cwb);
    this.cwb.setAttribute('color', '#000000');
    this.cwb.setAttribute('radius', '0.1');
    
    this.updateWindows();
  },

  // Updates the images on the middle, left, and right windows. Also hides
  // the right and left windows if necessary.
  updateWindows: function() {
    this.lw.setAttribute('visible', this.imageIndex > 0 ? 'true' : 'false');
    this.rw.setAttribute('visible', this.imageIndex < this.images.length - 1 ? 'true' : 'false');
    
    this.mw.setAttribute('src', this.images[this.imageIndex]);
    this.rw.setAttribute('src', this.images[this.imageIndex + 1]);
    this.lw.setAttribute('src', this.images[this.imageIndex - 1]);
  }
});
