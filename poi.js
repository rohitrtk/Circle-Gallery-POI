if (typeof AFRAME === 'undefined') {
  throw new Error('Component attempted to register before AFRAME was available.')
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
  // Default components
  defaultComponents: {
    poi                 :{},
    geometry            :{primitive:'plane'},
  },

  // Default mappings
  mappings: {
    'src'               :'poi.src',
    'raycast-collider'  :'poi.raycastCollider',
    'color'             :'poi.color',
    'toggle-cast'       :'poi.needsCast',
    'toggles'           :'poi.toggles',
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
 *    <a-media-circle ...> <== THIS IS DISPLAYED ON HOVER
 *  </a-poi>
 * 
 * Properties:
 *  - src: Default src for component
 *  - color: Default colour for component
 */
AFRAME.registerComponent('poi', {
  // Default components
  schema: {
    src     :{type: 'string'},
    color   :{type: 'string', default: 'red'}
  },

  init: function() {
    let el = this.el;
    let data = this.data;

    el.setAttribute('material', `color: ${data.color}; shader: flat;`);
    el.setAttribute('src', data.src);
    el.setAttribute('class', 'clickable');
    
    // Used for opacity animation
    this.opacity = 0;

    // Throttling tick function to run twice per second as opposed to 90 times per second
    // https://aframe.io/docs/1.2.0/introduction/best-practices.html#tick-handlers
    this.tick = AFRAME.utils.throttleTick(this.tick, 500, this);

    // Get first child element and use that for fade in/out
    this.o = el.children[0];
    if(this.o === undefined) {
      throw new Error('POI has no child component.');
    }

    this.o.setAttribute('opacity', this.opacity);
    if(this.o.getAttribute('class') !== 'clickable')
    {
      this.o.setAttribute('class', 'clickable');
    }

    // Setting child event listeners for fading in/out
    this.o.addEventListener('mouseenter', (event) => {
      if(event.target !== this.o) {
        return;
      }
      
      this.opacity = Math.min(this.opacity + 1, 100);
      console.log('Mouse Enter!');
    });

    this.o.addEventListener('mouseleave', (event) => {
      if(event.target !== this.o) {
        return;
      }
      
      this.opacity = Math.max(this.opacity - 1, 0);
      console.log('Mouse Leave!');
    });
  },

  tick: function(t, dt) {
    if(this.o !== undefined) {
      this.o.setAttribute('animation__fade', `property: opacity; to: ${this.opacity}; dur: 1000; easing: easeInOutSine`);
    }
  }
});
