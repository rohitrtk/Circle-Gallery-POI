// Check that AFRAME has been defined and can be used
if (typeof AFRAME === 'undefined') {
  throw new Error('Component attempted to register before AFRAME was available.');
}

/**
 * Waypoint network primitive : <a-waypoint-network>
 * 
 * Wrapper for the waypoint-network component.
 */
AFRAME.registerPrimitive('a-waypoint-network', {
  defaultComponents: {
    'waypoint-network': {}
  }
});

/**
 * Waypoint network component : waypoint-netowork
 * 
 * Can contain a grouping of waypoints and has functionallity
 * for travesring said waypoints. The waypoints in the network,
 * will automatically register the orderering from first to last
 * and give each waypoint its next and previous waypoint if applicable.
 */
AFRAME.registerComponent('waypoint-network', {
  init: function () {
    this.waypoints = [];
    
    for (let child of this.el.children) {
      if (!child.classList.contains('waypoint')) {
        continue;
      }

      this.waypoints.push(child);
    }

    // For each waypoint, set the next waypoint and the previous waypoint.
    // If a waypoint is the start or end of the network, it will have
    // a blank string as its value.
    const it  = this.makeWaypointIterator(0, this.waypoints.length);
    let wp    = it.next();
    let pwp   = wp;
    
    while(!wp.done) {
      wp = it.next();
      
      if(wp.done) {
        break;
      }

      pwp.value.setAttribute('waypoint', 'nextWaypoint', wp.value.getAttribute('id'));
      wp.value.setAttribute('waypoint', 'prevWaypoint', pwp.value.getAttribute('id'));

      pwp = wp;
    }

    this.el.classList.add('waypointNetwork');
  },

  // Returns an iterator for the waypoints
  makeWaypointIterator: function*(start = 0, end = Infinity) {
    let count = 0;

    for(let i = start; i < end; i++) {
      count++;
      yield this.waypoints[i];
    }

    return count;
  }
});

/**
 * Waypoint primitive : <a-waypoint>
 * 
 * Wrapper for the waypoint component
 */
AFRAME.registerPrimitive('a-waypoint', {
  defaultComponents: {
    'waypoint': {}
  },

  mappings: {
    'next-waypoint' : 'waypoint.nextWaypoint',
    'prev-waypoint' : 'waypoint.prevWaypoint'
  }
});

/**
 * Waypoint component
 * 
 * Contains the fuctionallity for the waypoints. Each waypoint knows how to animate
 * the camera rigs position to the waypoints position. It also contains data on the
 * next and previous waypoint.
 * 
 * Properties:
 *  - nextWaypoint: Id of the next waypoint
 *  - prevWaypoint: Id of the previous waypoint
 */
AFRAME.registerComponent('waypoint', {
  schema: {
    'nextWaypoint': { type: 'string', default: '' },
    'prevWaypoint': { type: 'string', default: '' }
  },

  init: function () {
    let el    = this.el;
    let data  = this.data;

    this.position     = el.object3D.position;
    this.nextWaypoint = data.nextWaypoint;
    this.prevWaypoint = data.prevWaypoint;
    
    el.setAttribute('geometry', {
      primitive: 'circle',
      radius: 0.25
    });

    el.object3D.rotation.set(-Math.PI / 2, 0, 0);

    // Material stuff
    this.defaultColour      = '#FFFFFF';
    this.highlightedColour  = '#f5b942';

    el.setAttribute('material', {
      color: '#FFFFFF',
      shader: 'flat'
    });

    el.classList.add('waypoint');
  },

  events: {
    click: function(event) {
      // I have no idea how the interpreter knows what rig is, it just does
      rig.setAttribute('animation', {
        property:   'position',
        to: { 
          x: this.position.x,
          y: this.position.y + 1.6,
          z: this.position.z
        },
        from:       rig.object3D.position,
        easing:     'easeInCubic',
        autoplay:   true,
        dur:        1000
      });
    },
    
    mouseenter: function(event) {
      this.el.setAttribute('material', {
        color: this.highlightedColour
      });
    },

    mouseleave: function(event) {
      this.el.setAttribute('material', {
        color: this.defaultColour
      });
    }
  }
});