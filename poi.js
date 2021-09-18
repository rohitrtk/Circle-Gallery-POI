/*
  Jarrod W. - September 16th, 2021; Updated September 17th, 2021
  POI Component to allow for toggling any children of the primary object.
*/

if (typeof AFRAME === 'undefined') {
  throw new Error('Component attempted to register before AFRAME was available.')
}

/*
 * POI Primitive
 * 
 * 
 *
 */
AFRAME.registerPrimitive('a-poi', {
  defaultComponents: {
    poi                 :{},
    geometry            :{primitive:'plane'},
  },

  mappings: {
    'src'               :'poi.src',
    'raycast-collider'  :'poi.raycastCollider',
    'color'             :'poi.color',
    'toggle-cast'       :'poi.needsCast',
    'toggles'           :'poi.toggles',
  }
});

/*
 * POI Component
 * 
 * Controls displaying and hiding POI children and specific classes
 * Children with the poi-child class will fade in or out on focus
 * Elements with the <needsCast> class will be faded in or out on click
 * 
 * Available properties are:
 *  -src
 *  -color: (Color) The colour of the main POI point
 *  -hovering: (number) Used to determine POI visiblity
 *  -displaying: (boolean) Used to determine POI visiblity
 *  -raycastCollider: (string) The classname used for the raycaster
 *  -needsCast: (string) Classes to give raycast colliders on toggle
 *  -toggles: (string) The class to toggle on or off on POI click
 */
AFRAME.registerComponent('poi', {
  schema: {
    src             :{type: 'string'},
    color           :{default: 'red'},
    hovering        :{type: 'number', default: 0},
    displaying      :{type: 'boolean', default: false},
    raycastCollider :{type: 'string', default: 'interactable'},
    needsCast       :{type: 'string'},
    toggles         :{type: 'string'},
  },

  init () {
    console.log("a");
    let el = this.el; // the HTML object of the poi
    let data = this.data; // the schema of the poi
    el.setAttribute('src', data.src);

    // event handlers
    el.addEventListener("mouseenter", (e) => {
      if (e.target !== this.el) return; // if the target isn't this exact object
      if (el.getAttribute('visible') !== true) return; // if it isn't visble
      //event.stopPropagation();
      data.hovering += 1;
      //console.log(data.hovering)
    })
    el.addEventListener("mouseleave", (e) => {
      if (e.target !== this.el) return;
      if (el.getAttribute('visible') !== true) return;
      //event.stopPropagation();
      data.hovering -= 1;
      //console.log(data.hovering)
    })
    el.addEventListener("click", (e) => {
      el.dispatchEvent(new CustomEvent('poiClicked', { details: el.getAttribute('id') }));
      /*let toToggle = document.getElementsByClassName(data.toggles);
      for (const elem of toToggle) {
        if (elem.classList.contains(data.needsCast)) {
          if (elem.getAttribute('opacity') == 0) elem.classList.add(data.raycastCollider);
          else elem.classList.remove(data.raycastCollider);
        }
        elem.setAttribute('animation', `property: opacity; to: ${elem.getAttribute('opacity') > 0 ? 0 : 1}; dur: 1000; easing: easeInOutSine`);//'visible', !elem.getAttribute('visible'))
      }*/
    });
    console.log("b")
    for (const child of el.children) { // run through children and set up any necessary code
      console.log("ba")
      if (!child.classList.contains("poi-child")) return; // return if this isn't meant to be toggled by the POI
      console.log("bb")
      child.addEventListener("mouseenter", (e) => {
        if (e.target !== child) return;
        if (data.displaying === false) return;
        data.hovering += 1;
      })
      child.addEventListener("mouseleave", (e) => {
        if (e.target !== child) return;
        if (data.displaying === false) return;
        data.hovering -= 1;
      })
    }
    console.log("c");
    el.setAttribute('material', `color:${data.color}`); // need to set material rather than colour
    console.log("d")
    if (data.src) el.setAttribute('material', `src:${data.src}`);
  },
  tick(t, dT) {
    let data = this.data;
    if (data.hovering < 0) data.hovering = 0;
    if ((data.hovering == 0 && data.displaying)
    || (data.hovering > 0 && !data.displaying)) { // should we switch visiblities?
      data.displaying = !data.displaying;
      for (const child of this.el.children) {
        if (!child.classList.contains("poi-child")) return;
        
        child.setAttribute('animation__fade', `property: opacity; to: ${data.displaying ? 1 : 0}; dur: 1000; easing: easeInOutSine`);
        // add or remove the raycasting collider to allow for objects to be looked at without interfering with original POI
        if (data.displaying) child.classList.add(data.raycastCollider);
        else child.classList.remove(data.raycastCollider);
        //child.setAttribute('visible', !child.getAttribute('visible'));
      }
    }
  }
});