if (typeof AFRAME === 'undefined') {
  throw new Error('Component attempted to register before AFRAME was available.');
}

AFRAME.registerPrimitive('a-media-loader', {
  defaultComponents: {
    'medialoader': {}
  }
});

/**
 * Media loader component : medialoader
 * 
 * This component should be attached to the main scene. Upon initialization, component
 * will find the div element with an id of "media" in the html file. Once found, component
 * will loop through every child of the div and get it's "src" component (since everything
 * in this div is some type of media, it should have a src). First we get the file name
 * and then we split the file name on "_". The reason being is that we create a dictionary
 * where each key is the part of the file name before the "_". Component then stores all
 * sources with the same part of the file name as an array of values.
 */
AFRAME.registerComponent('medialoader', {
  init: function() {
    let el = this.el;
    
    this.dict = {};

    for(const media of el.children) {
      let src = media.src;

      if(src === undefined) {
        continue;
      }

      let extension = src.split('.').at(-1);
      let fileName = src.split('/').at(-1);
      let name = fileName.split('_').at(0);
      
      if(this.dict[name] === undefined) {
        this.dict[name] = {
          image: [],
          video: [],
          audio: []
        };
      }
      
      if(extension.includes('jpg') || extension.includes('png')) {
        this.dict[name].image.push(src);
      } else if(extension.includes('mp4')) {
        this.dict[name].video.push(src);
      } else if(extension.includes('mp3')) {
        this.dict[name].audio.push(src);
      } else {
        throw new Error(`Unknown media type for file ${name}`);
      }
    }
  }
});
