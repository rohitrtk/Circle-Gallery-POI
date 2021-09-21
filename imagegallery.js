// Check that AFRAME has been defined and can be used
if (typeof AFRAME === 'undefined') {
  throw new Error('Component attempted to register before AFRAME was available.')
}

/*
 * Image gallery primitive : <a-image-gallery>
 * 
 * Used to build image galleries. Contains the image
 * gallery component by default. 
 */
AFRAME.registerPrimitive('a-image-gallery', {
  // Default components
  defaultComponents: {
    'image-gallery': {}
  },

  // Property mappings
  mappings: {
    'name'      : 'image-gallery.name',
  }
});

/*
 * Image gallery component : image-gallery
 * 
 * Contains the geometry for the image gallery and is responsible for
 * opening an image gallery viewer if the gallery is clicked. Geometry is
 * set to a transparent plane with a set source for an icon. Galleries should
 * usually be appended to a media circle. Image gallery has one property, which
 * is the name which should be a prefix of all images that will be available
 * in the gallery.
 */
AFRAME.registerComponent('image-gallery', {
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
    this.srcImage         = '#galleryIcon'; 

    el.setAttribute('geometry', 'primitive:plane; width:1; height:1');
    el.setAttribute('material', `color: ${this.defaultColour}; src: ${this.srcImage}; transparent: true`);
    el.classList.add('imagegallery');
    el.classList.add('clickable');
    
    this.name = data.name;
  },

  // Returns true if an image gallery viewer is already open
  isViewerOpen: function() {
    return !!document.getElementById('viewer');
  },

  events: {
    // If there is no open viewer, create a new image gallery viewer and
    // append it to the camera as a child
    click: function(event) {
      if(this.isViewerOpen() || this.el.getAttribute('material').opacity < 0.5) {
        return;
      } 

      let camera = document.getElementById('camera');
      let viewer = document.createElement('a-entity');
      
      camera.appendChild(viewer);
      viewer.setAttribute('id', 'viewer');
      viewer.setAttribute('image-gallery-viewer', `name: ${this.name};`);
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
 * Image gallery viewer component : image-gallery-viewer
 * 
 * Contains the outline for viewing images in an image gallery. The name is
 * the prefix of some set of images to be loaded in.
 *  Example: Suppose we have the following images in html: potato32.jpg, hellokitty12.png,
 *  potato.png, roflcopterz.gif. If an image gallery is passed 'potato' as its name
 *  parameter, potato32.jpg and potato.png would be loaded into the gallery while
 *  the others are not loaded.
 */
AFRAME.registerComponent('image-gallery-viewer', {
  defaultComponents: {
    name: {type: 'string'}
  },

  init: function() {
    let el = this.el;
    let data = this.data;
    
    this.name = data.name;

    // Must be called before setting images!
    this.loadImages();
    
    this.imageIndex = 0;

    el.setAttribute('position', '0 0 -0.5');
    el.setAttribute('scale', '0.5 0.5')

    // Main window
    this.mw = document.createElement('a-plane');
    el.appendChild(this.mw);
    this.mw.setAttribute('color', '#FFFFFF');
    this.mw.setAttribute('position', '0 0.25 0');
    this.mw.setAttribute('width', '1.4');
    this.mw.setAttribute('height', '0.9');
    this.mw.setAttribute('shader', 'flat');

    // Left window
    this.lw = document.createElement('a-plane');
    this.mw.appendChild(this.lw);
    this.lw.setAttribute('position', '-0.6 -0.6 0.1');
    this.lw.setAttribute('width', '0.4');
    this.lw.setAttribute('height', '0.2');
    this.lw.setAttribute('rotation', '0 35 0');
    this.lw.setAttribute('opacity', '0.6');
    this.lw.setAttribute('shader', 'flat');
    this.lw.classList.add('clickable');
    this.lw.addEventListener('click', (event) => {
      this.imageIndex = Math.max(0, this.imageIndex - 1);
      this.updateWindows();
    });

    // Right Window
    this.rw = document.createElement('a-plane');
    this.mw.appendChild(this.rw);
    this.rw.setAttribute('position', '0.6 -0.6 0.1');
    this.rw.setAttribute('width', '0.4');
    this.rw.setAttribute('height', '0.2');
    this.rw.setAttribute('rotation', '0 -35 0');
    this.rw.setAttribute('opacity', '0.6');
    this.rw.setAttribute('shader', 'flat');
    this.rw.classList.add('clickable');
    this.rw.addEventListener('click', (e) => {
      this.imageIndex = Math.min(this.images.length - 1, this.imageIndex + 1);
      this.updateWindows();
    });

    // Close Window
    this.cw = document.createElement('a-circle');
    this.mw.appendChild(this.cw);
    this.cw.setAttribute('position', '0.555 0.3 0.1');
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
  },

  // Loads the images given an image name prefix
  loadImages: function() {
    // Throw an error if the name is blank
    if(this.name === '' || this.name === undefined) {
      throw new Error('Image gallery viewer needs a name!');
    }

    this.images = [];

    let images = document.getElementsByTagName('img');

    for(let i = 0; i < images.length; i++) {
      let n = images[i].src.split('.');
      let m = n[n.length - 2].split('/');
      let name = m[m.length - 1];
      
      if(name.includes(this.name)) {
        this.images.push(images[i].src);
      }
    }

    if(images.length == 0) {
      throw new Error(`Could not find any images with prefix ${this.name}`);
    }
  },
})