// Check that AFRAME has been defined and can be used
if (typeof AFRAME === 'undefined') {
    throw new Error('Component attempted to register before AFRAME was available.')
  }
  
  /*
   * Video player primitive : <a-video-player>
   *
   * ...
   */
  AFRAME.registerPrimitive('a-audio-player', {
    // Default components
    defaultComponents: {
      'audio-player': {}
    },
  
    // Default mappings
    mappings: {
      'name'  : 'audio-player.name'
    }
  });
  
  AFRAME.registerComponent('audio-player', {
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
      this.srcImage         = '#audioIcon';
  
      el.setAttribute('geometry', 'primitive:plane; width:1; height:1');
      el.setAttribute('material', `color: ${this.defaultColour}; src: ${this.srcImage}; transparent: true`);
      el.classList.add('audioplayer');
      el.classList.add('clickable');
  
      this.name = data.name;
    },
  
    events: {
      click: function(event) {
        console.log('Playing audio');
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