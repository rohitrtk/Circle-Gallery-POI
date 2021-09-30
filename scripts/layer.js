// Check that AFRAME has been defined and can be used
if (typeof AFRAME === 'undefined') {
  throw new Error('Component attempted to register before AFRAME was available.');
}

/**
 * Wrapper for clickable layer primitive
 */
AFRAME.registerPrimitive('a-layer', {
  // Default components
  defaultComponents: {
    'clickable-layer': {}
  },

  // Default mappings
  mappings: {
    'src'           : 'clickable-layer.src', 
    'width'         : 'clickable-layer.width',
    'height'        : 'clickable-layer.height',
    'click-enabled' : 'clickable-layer.clickEnabled'
  }
});

/**
 * Clickable layer component to work with clicks and other events. Creates
 * a layer component with a given source and attaches it to this element.
 * Creates another entity with a plane primitive for geometry and with the
 * same dimensions as the layer. The purpose is to use that plane to interact
 * with when the layer gets clicked as for whatever reason, when we add the
 * clickable functionallity to a regular entity with a layer component,
 * the click event fails to trigger.
 * 
 * Properties:
 *  - src: The source link for the layer
 *  - width: The width of the layer
 *  - height: The height of the layer
 */
AFRAME.registerComponent('clickable-layer', {
  schema: {
    src           : {type: 'string', default: ''},
    width         : {type: 'number', default: 1.080},
    height        : {type: 'number', default: 1.080},
    clickEnabled  : {type: 'boolean', default: true}
  },

  init: function() {
    let el = this.el;
    let data = this.data;

    this.plane = document.createElement('a-entity');
    this.plane.setAttribute('geometry', {
      primitive : 'plane',
      width     : data.width,
      height    : data.height,
      buffer    : true
    });
    this.plane.setAttribute('material', {
      transparent : true,
      color       : '#FFF',
      shader      : 'flat',
      opacity     : data.opacity
    });

    if(this.data.clickEnabled) {
      this.plane.classList.add('clickable');
      this.plane.classList.add('clickablePlane');
    }

    el.appendChild(this.plane);
  },

  update: function() {
    let el = this.el;
    let data = this.data;
    
    el.setAttribute('layer', {
      type    : 'quad',
      src     : data.src,
      width   : data.width,
      height  : data.height
    });
  }
});