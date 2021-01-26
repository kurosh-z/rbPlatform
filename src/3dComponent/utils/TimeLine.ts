import * as BABYLON from 'babylonjs'
import {
  CircleEase,
  BackEase,
  BounceEase,
  CubicEase,
  ElasticEase,
  ExponentialEase,
  PowerEase,
  QuadraticEase,
  QuarticEase,
  QuinticEase,
  SineEase,
  BezierCurveEase,
  Vector3,
  Vector2,
  Quaternion,
  Color3,
  Color4,
  Matrix,
  EasingFunction,
  AnimationGroup,
} from 'babylonjs'
import { isNumber } from './isFunctions'

type EASING =
  | CircleEase
  | BackEase
  | BounceEase
  | CubicEase
  | ElasticEase
  | ExponentialEase
  | PowerEase
  | QuadraticEase
  | QuarticEase
  | QuinticEase
  | SineEase
  | BezierCurveEase
type EasingMode = 'easeInOut' | 'easeIn' | 'easeOut'

export class TimeLine {
  fps: number
  _totalTime = 0
  _labels: { [k: string]: number } = {}
  animationGroup: AnimationGroup
  constructor({
    fps = 60,
    animationGroup,
  }: {
    fps?: number
    animationGroup: AnimationGroup
  }) {
    this.animationGroup = animationGroup
    this.fps = fps
  }
  getAnimationType(el: any) {
    if (isNumber(el)) {
      return BABYLON.Animation.ANIMATIONTYPE_FLOAT
    }
    if (el instanceof Vector3) {
      return BABYLON.Animation.ANIMATIONTYPE_VECTOR3
    }
    if (el instanceof Vector2) {
      return BABYLON.Animation.ANIMATIONTYPE_VECTOR2
    }
    if (el instanceof Color3) {
      return BABYLON.Animation.ANIMATIONTYPE_COLOR3
    }
    if (el instanceof Color4) {
      return BABYLON.Animation.ANIMATIONTYPE_COLOR4
    }
    if (el instanceof Quaternion) {
      return BABYLON.Animation.ANIMATIONTYPE_QUATERNION
    }
    if (el instanceof Matrix) {
      return BABYLON.Animation.ANIMATIONTYPE_MATRIX
    } else {
      throw new Error(`typeof ${el}: ${typeof el} is not animatable!`)
    }
  }
  setEasingMode(easingFunc: EasingFunction, easingMode: EasingMode) {
    if (easingMode === 'easeIn') {
      easingFunc.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEIN)
    }
    if (easingMode === 'easeOut') {
      easingFunc.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEOUT)
    }
    if (easingMode === 'easeInOut') {
      easingFunc.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT)
    }
  }

  time2frame(pos: number) {
    return this.fps * pos
  }
  getAbsoluteTime(pos: number, label: string) {
    return label ? this._labels[label] + pos : this._totalTime + pos
  }
  getAbsoluteFrame(pos: number, label: string) {
    this.time2frame(this.getAbsoluteTime(pos, label))
  }

  add<T>({
    target,
    from,
    to,
    duration,
    pos = 0,
    easingFunc = new CubicEase(),
    easingMode = 'easeInOut',
    name = 'animation',
    loop = false,
    origin,
    label,
  }: {
    target: T
    from?: {
      [P in keyof T]?: T[P]
    }
    to: {
      [P in keyof T]?: T[P]
    }
    duration: number
    pos?: number
    easingFunc?: EASING
    easingMode?: 'easeInOut' | 'easeIn' | 'easeOut'
    name?: string
    loop?: boolean
    label?: string
    origin?: string
  }) {
    // setting the label
    if (label) {
      this._labels[label] = this._totalTime
      if (target === undefined) return this
    }

    // prepare easing function
    this.setEasingMode(easingFunc, easingMode)

    // calculate begin and end time of animation
    let beginTime: number
    if (origin) {
      if (this._labels[origin] === undefined) {
        throw new Error(`origin should be a valid label!`)
      }
      beginTime = this._labels[origin] + pos
    } else {
      beginTime = this._totalTime + pos
    }

    // const beginTime = this._totalTime + _pos;
    const endTime = beginTime + duration

    // create animations for each property
    for (const target_prop in to) {
      const anim = new BABYLON.Animation(
        name,
        target_prop,
        this.fps,
        this.getAnimationType(to[target_prop]),
        loop
          ? BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
          : BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT,
      )

      if (beginTime < 0) {
        throw new Error(
          `beginTime of the animation cannot be negative! it happens if totalTime + pos < 0`,
        )
      }

      const keys = [
        {
          frame: this.time2frame(beginTime),
          value:
            from !== undefined
              ? from[target_prop] !== undefined
                ? from[target_prop]
                : target[target_prop]
              : target[target_prop],
        },
        {
          frame: this.time2frame(endTime),
          value: to[target_prop],
        },
      ]

      anim.setKeys(keys)
      anim.setEasingFunction(easingFunc)
      this.animationGroup.addTargetedAnimation(anim, target)
    }
    // if pos<0 endTime can be smaller than total time , in this case we dont have to normalize otehrwise:
    if (endTime > this._totalTime) {
      this._totalTime = endTime
      this.animationGroup.normalize(0, this.time2frame(this._totalTime))
    }
    return this
  }
}
