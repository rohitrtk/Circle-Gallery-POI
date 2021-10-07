/*
 *  Jarrod Wardell
 *  October 7th, 2021
 * 
 *  Creates and deals with skybox background.
 */

if (typeof AFRAME === 'undefined') {
    throw new Error('Component attempted to register before AFRAME was available.')
  }
    
    
  AFRAME.registerPrimitive('a-skybox', {
    defaultComponents :{
      'skybox'   :{},
    },
    mappings          :{
      'image'           : 'skybox.image',
      'radius'          : 'skybox.radius',
      'fadetime'        : 'skybox.fadetime',
      'low-res-underlap': 'skybox.shrink',
    }
  });
  
  /*
   *  Skybox
   * 
   *  Loads in 360 image as the background, and fades to a higher res version once it loads.
   *  Requires assetHandler.js (In the future hardcode this probably)
   *  Should be placed prior to assetHandler on page, or low res might not load
   * 
   *  - image   : (String) The ID of the image asset
   *  - radius  : (Number) The radius of the skybox
   *  - fadetime: (Number) The time (in seconds) to transition from low res to high res
   *  - shrink  : (Number) The percentage of underlap for the low-res image. Needs to be higher as the radius increases
   * 
   *  - makeSky() (a-sky) : Makes a sky object using schema, and returns it
   */
  AFRAME.registerComponent('skybox', {
    schema            :{
      'image'           :{type:'string'},
      'radius'          :{type:'number', default: 500},
      'fadetime'        :{type:'number', default: 10}, // 10s isn't easily noticeable
      'shrink'          :{type:'number', default: 2}, // 2% works nicely until a radius of ~1000
    },
    init() {
      let sky;
      document.addEventListener('lowResLoad', (e) => {
        if (e.detail.toUpperCase() === this.data.image.toUpperCase()) {
          sky = this.makeSky();
        }
      });
      document.addEventListener('highResLoad', (e) => {
        if (e.detail.toUpperCase() === this.data.image.toUpperCase()) {
          if (sky != null) sky.setAttribute('radius', this.data.radius - (this.data.radius / (100 / this.data.shrink)));
          console.log(this.data.radius - (this.data.radius / (100 / this.data.shrink)))
          this.makeSky();
          
          if (sky != null) {
            sky.setAttribute('animation', `property: opacity; from: 1; to: 0; dur: ${this.data.fadetime * 1000};`);
            sky.addEventListener('animationcomplete', () => {
              sky.remove();
            });
          }
        }
      });
    },
    makeSky() {
      let data = this.data;
      let el = this.el;
      let sky = document.createElement('a-sky');
      sky.setAttribute('src', `#${data.image}`);
      sky.setAttribute('radius', data.radius);
  
      el.appendChild(sky);
      return sky;
    },
  });