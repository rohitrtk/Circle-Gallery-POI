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
    'waypoint-network': {},
    'class': 'waypointNetwork'
  }
});

/**
 * Waypoint network component : waypoint-netowork
 * 
 * Designed to contain waypoints in an entity (as opposed to stuffing
 * waypoints into an a-entity component).
 */
AFRAME.registerComponent('waypoint-network', {
  init: function () {
    this.waypoints = [];

    for (const child of this.el.children) {
      if (!child.classList.contains('waypoint')) {
        continue;
      }

      this.waypoints.push(child);
    }
  }
});

/**
 * Waypoint primitive : <a-waypoint>
 * 
 * Wrapper for the waypoint component
 */
AFRAME.registerPrimitive('a-waypoint', {
  defaultComponents: {
    'waypoint': {},
    'class': 'waypoint'
  }
});

/**
 * Waypoint component
 * 
 * ...
 */
AFRAME.registerComponent('waypoint', {
  schema: {
    'name'        : { type: 'string', default: '' },
    'position'    : { type: 'vec3',   default: {x: 0, y: 0.1, z: 0}},
    'nextWaypoint': { type: 'string', default: null },
    'prevWaypoint': { type: 'string', default: null }
  },

  init: function () {
    let el    = this.el;
    let data  = this.data;

    this.position     = data.position;
    this.nextWaypoint = data.nextWaypoint;
    this.prevWaypoint = data.prevWaypoint;

    el.setAttribute('geometry', {
      primitive: 'circle',
      radius: 0.25
    });

    el.object3D.position.set(this.position.x, this.position.y, this.position.z);
    el.object3D.rotation.set(-Math.PI / 2, 0, 0);

    el.setAttribute('material', {
      color: '#FFFFFF',
      shader: 'flat'
    });
  }
});