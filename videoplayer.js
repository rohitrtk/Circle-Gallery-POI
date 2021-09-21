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

  events: {
    click: function(event) {
      console.log('Playing video');
    },

    mouseenter: function(event) {
      this.el.setAttribute('material', `color: ${this.selectedColour}`);
    },

    mouseleave: function(event) {
      this.el.setAttribute('material', `color: ${this.defaultColour}`);
    }
  },

  multiple: true
});