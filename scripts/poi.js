if (typeof AFRAME === 'undefined') {
  throw new Error('Component attempted to register before AFRAME was available.');
}

/*
 * POI(Point of Interest) Primitive : <a-poi>
 * 
 * Indicates a point of interest in the scene. POI will have a child
 * object which is to be faded in or out upon cursor hover. That child
 * object can then be interacted with, usually it'll be a mediacircle,
 * to display images, video, etc.
 *
 * Properties:
 *  - poi: The main component for this primitive. Contains all logic and functionallity
 *  - geometry: Contains info for the geometry of this object
 */
AFRAME.registerPrimitive('a-poi', {
  dependencies: [
    'medialoader'
  ],

  // Default components
  defaultComponents: {
    'geometry' : {primitive: 'plane'},
    'material' : {},
    'poi'      : {},
  },

  // Default mappings
  mappings: {
    'width'  : 'geometry.width',
    'height' : 'geometry.height',
    'color'  : 'poi.color',
    'src'    : 'poi.src',
    'name'   : 'poi.name'
  }
});

/*
 * POI(Point of Interest) Component : poi
 * 
 * Contains functionallity for fading in and out when cursor is hovered
 * over component. The mediacircle, or whatever wants to be displayed
 * when cursour is over component, should be defined as a child of this
 * object in the html. Note that the code only takes the first child
 * element, so any other elements after the first child will not be
 * taken into consideration for fade in/out.
 *  
 * Example:
 *  <a-poi ...>
 *    <a-media-circle ...></...> <== THIS IS DISPLAYED ON HOVER
 *    <a-some-thing-else></...>  <== THIS DOES NOT GET DISPLAYED ON HOVER
 *  </a-poi>
 * 
 * Properties:
 *  - src: Default src for component
 *  - color: Default colour for component
 */
AFRAME.registerComponent('poi', {
  // Default components
  schema: {
    name    :{type: 'string', default: ''},
    src     :{type: 'string', default: ''},
    color   :{type: 'string', default: ''}
  },

  init: function() {
    let el = this.el;
    let data = this.data;

    this.name = data.name;

    if(data.color === '') {
      data.color = Utility.randomColourHex();
    }
    
    el.setAttribute('material', {
      color: data.color,
      src: data.src,
      shader: 'flat'
    });
    el.classList.add('clickable');
    
    // Throttling tick function to run twice per second as opposed to 90 times per second
    this.tick = AFRAME.utils.throttleTick(this.tick, 500, this);
    
    // Used for opacity animation
    this.opacity = 0;

    this.mediaCircle = document.createElement('a-media-circle');
    this.mediaCircle.object3D.position.set(0, 0, 0.01);
    this.mediaCircle.setAttribute('opacity', this.opacity);

    let scene = document.querySelector('#scene');
    scene.addEventListener('loaded', () => {
      let ml = scene.components.medialoader;
      let sources = ml.dict[this.name];

      if(sources !== undefined) {
        this.mediaCircle.setAttribute('sources', sources);
      }
    });
  },

  events: {
    // Setting child event listeners for fading in/out
    mouseenter: function(event) {
      this.opacity = Math.min(this.opacity + 1, 100);
      this.mediaCircle.classList.add('clickable');
      
      for(const child of this.mediaCircle.children) {
        let c = child.classList;
        
        if(c.contains('imagegallery') || c.contains('videoplayer') || c.contains('audioplayer')) {
          c.add('clickable');
        }
      }
    },

    mouseleave: function(event) {
      this.opacity = Math.max(this.opacity - 1, 0);
      this.mediaCircle.classList.remove('clickable');
      
      for(const child of this.mediaCircle.children) {
        let c = child.classList;
        
        if(c.contains('imagegallery') || c.contains('videoplayer') || c.contains('audioplayer')) {
          c.remove('clickable');
        }
      }
    }
  },

  tick: function(t, dt) {
    if(this.mediaCircle !== undefined) {
      this.mediaCircle.setAttribute('animation__fade', {
        easing: 'easeInOutSine',
        property: 'opacity',
        to: this.opacity,
        dur: 1000
      });
    }
  }
});
