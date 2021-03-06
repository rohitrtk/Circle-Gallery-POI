Utility.CHECK_AFRAME();
/*
 * POI(Point of Interest) Primitive : <a-poi>
 * 
 * Indicates a point of interest in the scene. POI will have a mediacircle
 * object which is to be faded in or out upon cursor hover.
 */
AFRAME.registerPrimitive('a-poi', {
  defaultComponents: {
    'geometry' : {primitive: 'plane'},
    'material' : {},
    'poi'      : {},
  },

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
  schema: {
    name    :{ type: 'string', default: '' },
    src     :{ type: 'string', default: '' },
    color   :{ type: 'string', default: '' }
  },

  dependencies: ['medialoader'],

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

    const mlEl = document.querySelector('#medialoader');
    mlEl.addEventListener('loaded', () => {
      const ml = mlEl.components.medialoader;
      const sources = ml.dict[this.name];
      
      if(sources !== undefined) {
        this.mediaCircle = document.createElement('a-media-circle');
        this.mediaCircle.object3D.position.set(0, 0, 0.01);
        this.mediaCircle.setAttribute('opacity', this.opacity);
        this.mediaCircle.setAttribute('image', sources.image);
        this.mediaCircle.setAttribute('video', sources.video);
        this.mediaCircle.setAttribute('audio', sources.audio);
        //console.log(sources);
      }
  
      el.appendChild(this.mediaCircle);
    });
  },

  events: {
    // Setting child event listeners for fading in/out
    mouseenter: function(event) {
      if(this.mediaCircle === undefined) {
        return;
      }

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
      if(this.mediaCircle === undefined) {
        return;
      }

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
    if(this.mediaCircle === undefined) {
      return;
    }

    this.mediaCircle.setAttribute('animation__fade', {
      easing: 'easeInOutSine',
      property: 'opacity',
      to: this.opacity,
      dur: 1000
    });
  }
});
