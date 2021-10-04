/**
 * Utilities class for functions that seem useful
 */
class Utility {
  /**
   * @param   {function}  func        - The function whos performance is being evaluated
   * @param   {boolean}   logMessage  - Log the functions performance?
   * @returns {number}                - The time in ms the function took to run
   */
  static timeToRun(func, logMessage=true) {
    let y = performance.now();
    func();
    let x = performance.now();

    let executionTime = (x - y).toFixed(4);

    if(logMessage) {
      console.log(`Function ${func.name} executed in ${executionTime}ms`);
    }

    return executionTime;
  }

  /**
   * @param   {number} min  - Minimum number the rand function can generate
   * @param   {number} max  - Maximum number the rand function can generate
   * @returns {number}      - A random integer between min(inclusive) and max(exclusive)
   */
  static randomInt(min=0, max=10) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  /**
   * @param   {number} min  - Minimum number the rand function can generate
   * @param   {number} max  - Maximum number the rand functio can generate
   * @returns {number}      - A random float between min(inclusive) and max(exclusive)
   */
  static randomFloat(min=0, max=10) {
    return (Math.random() * (max - min)) + min;
  }

  /**
   * @param   {string} str  - The string to reverse
   * @returns {string}      - The string given as input backwards
   */
  static reverseString(str) {
    return str.split('').reverse().join('');
  }

  /**
   * @returns {string} - A randomly generated hexadecimal string with a
   *  minimum of #000000 and maximum of #ffffff
   */
  static randomColourHex() {
    let colour = '#';

    for(let i = 0; i < 6; i++) {
      let n = this.randomInt(0, 16);
      
      if(n > 9) {
        n += 87
        colour += String.fromCharCode(n);
        continue;
      }

      colour += n;
    }

    return colour;
  }

  /**
   * @returns {r: number, g: number, b: number} - An object
   *  with 3 numbers, each of which are random between 0 and 256
   */
  static randomColourRgb() {
    return {
      r: this.randomInt(0, 256),
      g: this.randomInt(0, 256),
      b: this.randomInt(0, 256)
    }
  }

  /**
   * @param {string} - Source as a string
   * @returns {
   *  name      : string,
   *  id        : string,
   *  extension : string}
   */
  static srcSplitter(src) {
    const fileName  = src.split('/').at(-1);
    const fullName  = fileName.split('.');
    const extension = fullName.at(-1);
    const name      = fullName.at(0).split('_').at(0);
    const id        = fullName.at(0);

    return {
      name: name,
      id: id,
      extension: extension
    };
  }
}
