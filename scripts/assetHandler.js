/*
 *  Jarrod Wardell
 *  September 17th, 2021 - Updated September 23rd, 2021
 * 
 *  Used to allow loading of low res files while waiting for high res to load in
 *  Also allows for SVGs to appear as high resolution
 */

if (typeof AFRAME === 'undefined') {
    throw new Error('Component attempted to register before AFRAME was available.')
  }
  
  
  AFRAME.registerPrimitive('a-asset-handler', {
    defaultComponents :{
      'asset-handler' :{},
    },
    mappings          :{
      'load-low'        : 'asset-handler.loadLow',
      'assets'          : 'asset-handler.assets',
      'asset-classes'   : 'asset-handler.assetClasses',
      'asset-manager'   : 'asset-handler.assetManager',
    }
  });
  
  /*
   *  Asset Handler
   * 
   *  Allows for loading of low-res images prior to loading high res images based on setting.
   *  Uses default file endings to determine asset type.
   * 
   *  - loadLow: (Boolean) Load the low-res images first? (Default true)
   *  - assets: (Array) The images to load. High-res files should be named the same as their low-res counterparts with "-h" appended.
   *  - assetClasses: (Array) What classes to give each of these assets
   *  - assetManager: (String) The ID for the asset manager.
   * 
   */
  AFRAME.registerComponent('asset-handler', {
    schema            :{
      'loadLow'         :{type:'boolean', default: true},
      'assets'          :{type:'array'},
      'assetClasses'    :{type:'array'},
      'assetManager'    :{type:'string'},
    },
    getTagType(asset) {
      let ext = asset.split(".").pop();
      if (ext == "jpg" || ext == "jpeg" || ext == "png" || ext == "gif") {
        return "img";
      }
      if (ext == "svg") {
          return "canvas";
      }
      throw new Error(`Invalid media extension! ${ext}`);
    },
    makeHigh(asset) {
        let ext = asset.split(".").pop();
        return `${this.getFileName(asset)}-h.${ext}`;
    },
    getFileName(asset) {
        return asset.replace(/\.[^/.]+$/, "");
    },
    init () {
      var data = this.data;
      if (data.assetManager == "" || !document.getElementById(data.assetManager)) {
          console.error("Missing asset manager ID!");
          return;
      }
      var manager = document.getElementById(data.assetManager);
  
      if (data.loadLow) {
        for (let i = 0; i < data.assets.length; i++) {
          let ext = this.getTagType(data.assets[i]);
  
          // creating the HTML element
          let node = document.createElement(ext);
          node.classList.add(data.assetClasses[i]);
          manager.appendChild(node);
          node.setAttribute('id', this.getFileName(data.assets[i]));
          if (ext == "canvas") {
            
            continue;
          }
          node.setAttribute('src', data.assets[i]);
          console.log(`Loaded low res ${this.getFileName(data.assets[i])}`);
          document.dispatchEvent(new CustomEvent('lowResLoad', { detail: this.getFileName(data.assets[i]) }));
  
          // loading new image and swapping it in on completion
          var toSwap = new Image;

          let refToThis = this; // this ceases to be this in the onload event
          toSwap.onload = function() {
              node.src = this.src;
              console.log(`Exchanged low res for high res ${refToThis.makeHigh(data.assets[i])}`);
              // might be smart to fire an event here; if the file is in use it won't update until the next load in unless forced
              document.dispatchEvent(new CustomEvent('highResLoad', { detail: refToThis.getFileName(data.assets[i]) }));
          }
          toSwap.src = this.makeHigh(data.assets[i]);
        }
      } else {
        for (let i = 0; i < data.assets.length; i++) {
          let ext = this.getTagType(data.assets[i]);
          let node = document.createElement(ext);
          node.classList.add(data.assetClasses[i]);
          node.setAttribute('src', this.makeHigh(data.assets[i]));
          node.setAttribute('id', this.getFileName(data.assets[i]));
          manager.appendChild(node);
          console.log(`Loaded ${data.assets[i]}`)
          document.dispatchEvent(new CustomEvent('highResLoad', { detail: this.getFileName(data.assets[i]) }));
        }
      }
    },
  });