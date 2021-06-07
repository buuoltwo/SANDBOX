/*
 * @Descripttion : 简易版 Promise
 * @Author       : zhangming
 * @Date         : 2021-04-26 11:30:30
 * @LastEditors  : zhangming
 * @LastEditTime : 2021-04-29 16:20:12
 */

// window.MyPromise = Promise

const PENDING = 'pending'
const RESOLVED = 'resolved'
const REJECTED = 'rejected'

function MyPromise(fn) {
  const that = this
  that.state = PENDING
  that.value = null
  that.resolvedCallbacks = []
  that.rejectedCallbacks = []

  function resolve(val) {
    setTimeout(() => {
      if (that.state === PENDING) {
        that.value = val
        that.state = RESOLVED

        that.resolvedCallbacks.map((cb) => cb(val))
      }
    }, 0)
  }
  function reject(val) {
    setTimeout(() => {
      if (that.state === PENDING) {
        that.value = val
        that.state = REJECTED
        that.rejectedCallbacks.map((cb) => cb(val))
      }
    }, 0)
  }
  try {
    fn(resolve, reject)
  } catch (e) {
    console.log(error)
  }
}

MyPromise.prototype.then = function (onFullfilled, onRejected) {
  const that = this

  onFullfilled = typeof onFullfilled === 'function' ? onFullfilled : (v) => v
  onRejected =
    typeof onRejected === 'function'
      ? onRejected
      : (fault) => {
          throw fault
        }

  that.resolvedCallbacks.push(onFullfilled)
  that.rejectedCallbacks.push(onRejected)
}

window.MyPromise = MyPromise
