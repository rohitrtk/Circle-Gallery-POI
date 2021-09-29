// Check that AFRAME has been defined and can be used
if (typeof AFRAME === 'undefined') {
  throw new Error('Component attempted to register before AFRAME was available.');
}

/**
 * Wrapper for custom layer primitive
 */
AFRAME.registerPrimitive('a-layer', {
  defaultComponents: {
    'custom-layer': {}
  },

  mappings: {
    'src'   : 'custom-layer.src', 
    'width' : 'custom-layer.width',
    'height': 'custom-layer.height'
  }
});

/**
 * Custom layer component to work with clicks
 */
AFRAME.registerComponent('custom-layer', {
  schema: {
    src     : {type: 'string', default: ''},
    width   : {type: 'number', default: 1.080},
    height  : {type: 'number', default: 1.080}
  },

  init: function() {
    let el = this.el;
    let data = this.data;

    el.setAttribute('layer', {
      type  : 'quad',
      src   : data.src
    });

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
      shader      : 'flat'
    });
    this.plane.classList.add('clickable');
    
    this.plane.addEventListener('click', event => {
      console.log('clicked');
    });

    el.appendChild(this.plane);
  }
});
