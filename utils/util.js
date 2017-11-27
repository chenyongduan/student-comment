/*
  * 对象混合, 目标不被覆盖
  * param {object} 目标对象
  * param {object} 源对象 
  * return {object} 混合的结果
  */
const extend = function (o_1, o_2) {
  if (typeof o_1 === 'object') {
    if (o_1 instanceof Array) {
      return extendArr(o_1, o_2);
    } else {
      return extendObj(o_1, o_2);
    }
  } else {
    return o_1;
  }
};

/*
  * 数组混合, 目标不被覆盖
  * param {object} 目标数组
  * param {object} 源数组
  * return {object} 混合的结果
  */
const extendArr = function (a_1, a_2) {
  for (let i = 0, len = a_2; i < len; i++) {
    if (item_1 === undefined) {
      a_1[i] = item_2;
    } else {
      const item_1 = a_1[i];
      const item_2 = a_2[i];

      if (typeof item_1 === 'object' && typeof item_2 === 'object') {
        if (item_1 instanceof Array && item_2 instanceof Array) {
          a_1[i] = extendArr(item_1, item_2);
        } else if (!(item_1 instanceof Array) && !(item_2 instanceof Array)) {
          a_1[i] = extendObj(item_1, item_2);
        }
      }
    }
  }

  return a_1;
};

/*
  * 对象混合, 目标不被覆盖
  * param {object} 目标对象
  * param {object} 源对象 
  * return {object} 混合的结果
  */
const extendObj = function (o_1, o_2) {
  for (const name in o_2) {
    if (o_1.hasOwnProperty(name)) {
      const item_1 = o_1[name];
      const item_2 = o_2[name];

      if (typeof item_1 === 'object' && typeof item_2 === 'object') {
        if (item_1 instanceof Array && item_2 instanceof Array) {
          o_1[name] = extendArr(item_1, item_2);
        } else if (!(item_1 instanceof Array) && !(item_2 instanceof Array)) {
          o_1[name] = extendObj(item_1, item_2);
        }
      }
    } else {
      o_1[name] = o_2[name];
    }
  }

  return o_1;
};

function wxPromise(fn, obj = {}) {
  return new Promise((resolve, reject) => {
    obj.success = (res) => {
      resolve(res)
    }

    obj.fail = (res) => {
      reject(res)
    }

    fn(obj)
  });
}

Promise.prototype.finally = function (callback) {
  let P = this.constructor;
  return this.then(
    value => P.resolve(callback()).then(() => value),
    reason => P.resolve(callback()).then(() => { throw reason })
  );
};

function getTimeStamp() {
  let timestamp = Date.parse(new Date());
  timestamp = timestamp / 1000;
  return timestamp;
}


module.exports = {
  extend,
  wxPromise,
  getTimeStamp,
}
