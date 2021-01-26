import * as BABYLON from 'babylonjs'
import { Nullable, Scene, Observer } from 'babylonjs'
/**
 * Builds a new timer. A timer can delay an action, and repeat this action X times
 * @param time The time in milliseconds
 * @param scene The scene
 * @param callback The callback function called when the timer is finished
 * @param options.autostart If set to true, the timer will autostart. False by default.
 *@param options.autodestroy If set to true, the timer will autodestroy at the end of all callback functions. False by default
 *@param options.repeat If set, the callback action will be repeated the specified number of times. 1 by default. Set to -1 if repeat infinitely
 *@param options.immediate If set, the callback action will be called before waiting 'time' ms. false by default.
 */
export class Timer {
  private scene: BABYLON.Scene
  private registeredFunction: () => void
  private onRenderObserver: Nullable<Observer<Scene>> = null
  /** The timer max time (in ms) */

  /** The timer current time */
  public currentTime: number
  public cbMaxTime = 1000
  private cbTime = 0
  /** True if the timer is finished, false otherwise */
  public isOver: boolean
  /** True if the timer is paused, false otherwise */
  public paused: boolean
  /** True if the timer has been started, false otherwise */
  public started: boolean
  /** Function to be repeated when the timer is finished */
  public callback: (t: number) => void
  /** Function to be called when the timer is finished (no more repeat counts) */
  public onFinish: Nullable<() => void>
  /**If set, the callback action will be repeated the specified number of times */
  public repeat: number
  /** Should the timer start directly after its creation ? */
  public autostart: boolean
  /** Should the timer call 'callback function' immediately after starting ? */
  public immediate: boolean
  /** Should the timer destroy itself after completion ? */
  public autodestroy: boolean

  constructor(
    cbMaxtime: number,
    scene: BABYLON.Scene,
    callback: (t: number) => void,
    options: {
      repeat?: number
      autostart?: boolean
      autodestroy?: boolean
      immediate?: boolean
    } = {},
  ) {
    this.scene = scene

    this.currentTime = 0
    this.cbMaxTime = cbMaxtime
    this.cbTime = cbMaxtime
    // True if the timer is finished, false otherwise
    this.isOver = false

    // True if the timer is paused, false otherwise
    this.paused = false

    // True if the timer has been started, false otherwise
    this.started = false

    // Function to be repeated when the timer is finished
    this.callback = callback

    // Function to be called when the timer is finished (no more repeat counts)
    this.onFinish = null

    //If set, the callback action will be repeated the specified number of times
    this.repeat = options.repeat || 1

    // Should the timer start directly after its creation ?
    this.autostart = options.autostart || false

    // Should the timer destroy itself after completion ?
    this.autodestroy = options.autodestroy || false

    // Should the timer call 'callback function' immediately after starting ?
    this.immediate = options.immediate || false

    this.registeredFunction = () => {
      if (this.started && !this.isOver && !this.paused) {
        this.update()
      }
    }

    // scene.registerBeforeRender(this.registeredFunction)

    // Start the timer is set to autostart
    if (this.autostart) {
      this.start()
    }
  }

  /**
   * Reset the timer. Do not reset its options!
   */
  public reset() {
    this.currentTime = 0
    this.isOver = false
    this.started = false
    this.paused = false
  }

  /**
   * Start the timer
   */
  public start() {
    this.started = true
    if (this.onRenderObserver) {
      this.scene.onBeforeRenderObservable.remove(this.onRenderObserver)
    }
    this.currentTime = this.scene.getEngine().getDeltaTime()
    this.onRenderObserver = this.scene.onBeforeRenderObservable.add(() => {
      this.update()
    })
  }

  /**
   * Pause the timer
   */
  public pause() {
    this.paused = true
  }

  /**
   * Stop the timer, and reset it.
   * @param destroy If set to true, the timer is deleted.
   */
  public stop(destroy: boolean) {
    this.started = false
    this.reset()
    if (this.autodestroy || destroy) {
      this.destroy()
    }
  }

  /**
   * Destory the timer
   * @private
   */
  private destroy() {
    // Unregister update function
    this.scene.onBeforeRenderObservable.remove(this.onRenderObserver)
  }

  /**
   * Unpause the timer
   */
  public resume() {
    this.paused = false
  }

  /**
   * The update function
   * @private
   */
  private update() {
    // console.log('dlta', this.scene.getEngine().getDeltaTime())
    // console.log('curr', this.currentTime)
    const deltat = this.scene.getEngine().getDeltaTime()
    this.currentTime += deltat
    this.cbTime -= deltat
    if (this.cbTime <= 0) {
      window.requestAnimationFrame(this.callback)
      this.cbTime = this.cbMaxTime
    }
    // if (this.repeat > 0 || this.repeat == -1) {
    //   this.reset()
    //   this.start()
    // } else {
    //   // Call the onFinish action
    //   if (this.onFinish) {
    //     this.onFinish()
    //   }
    //   // Autodestroy
    //   if (this.autodestroy) {
    //     this.destroy()
    //   }
    // }
  }
}
