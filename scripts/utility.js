class Utility {
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

  static randomInt(min=0, max=10) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  static randomFloat(min=0, max=10) {
    return (Math.random() * (max - min)) + min;
  }

  static reverseString(str) {
    return str.split('').reverse().join('');
  }
}