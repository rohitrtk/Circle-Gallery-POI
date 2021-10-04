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
    const el = this.el;
    
    this.dict = {};

    checkMedia = (tagName) => {
      if(tagName === 'VIDEO' || tagName === 'A-ASSET-ITEM' ||
        tagName === 'IMG' || tagName === 'AUDIO') {
          return true;
        }
      return false;
    }

    for(const media of el.children) {
      if(!checkMedia(media.tagName)) {
        continue;
      }
      
      const src       = media.tagName === 'A-ASSET-ITEM' ? media.getAttribute('src') : media.src;
      const ss        = Utility.srcSplitter(src);
      const name      = ss.name;
      const extension = ss.extension;

      if(this.dict[name] === undefined) {
        this.dict[name] = {
          image: [],
          video: [],
          audio: []
        };
      }
      
      if(extension.includes('jpg') || extension.includes('png')) {
        this.dict[name].image.push(src);
        media.id = 'g_' + ss.id;
      } else if(extension.includes('mp4')) {
        this.dict[name].video.push(src);
        media.id = 'v_' + ss.id;
      } else if(extension.includes('mp3')) {
        this.dict[name].audio.push(src);
        media.id = 'a_' + ss.id;
      } else {
        throw new Error(`Unknown media type for file ${name}`);
      }
    }
  }
});
