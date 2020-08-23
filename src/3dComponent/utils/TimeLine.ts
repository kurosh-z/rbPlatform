import * as BABYLON from 'babylonjs';
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
  Quaternion,
  Color3,
  Color4,
  Matrix,
  EasingFunction,
  AnimationGroup,
} from 'babylonjs';
import { isNumber } from './isFunctions';

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
  | BezierCurveEase;
type EasingMode = 'easeInOut' | 'easeIn' | 'easeOut';

export class TimeLine {
  fps: number;
  _totalTime = 0;
  _lastPos = 0;
  animationGroup: AnimationGroup;
  constructor({
    fps,
    animationGroup,
  }: {
    fps: number;
    animationGroup: AnimationGroup;
  }) {
    this.animationGroup = animationGroup;
    this.fps = fps;
  }
  getAnimationType(el: any) {
    if (isNumber(el)) {
      return BABYLON.Animation.ANIMATIONTYPE_FLOAT;
    }
    if (el instanceof Vector3) {
      return BABYLON.Animation.ANIMATIONTYPE_VECTOR3;
    }
    if (el instanceof Color3) {
      return BABYLON.Animation.ANIMATIONTYPE_COLOR3;
    }
    if (el instanceof Color4) {
      return BABYLON.Animation.ANIMATIONTYPE_COLOR4;
    }
    if (el instanceof Quaternion) {
      return BABYLON.Animation.ANIMATIONTYPE_QUATERNION;
    }
    if (el instanceof Matrix) {
      return BABYLON.Animation.ANIMATIONTYPE_MATRIX;
    } else {
      throw new Error(`typeof ${el}: ${typeof el} is not animatable!`);
    }
  }
  setEasingMode(easingFunc: EasingFunction, easingMode: EasingMode) {
    if (easingMode === 'easeIn') {
      easingFunc.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEIN);
    }
    if (easingMode === 'easeOut') {
      easingFunc.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEOUT);
    }
    if (easingMode === 'easeInOut') {
      easingFunc.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);
    }
  }

  pos2frame(pos: number) {
    return this.fps * pos;
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
  }: {
    target: T;
    from?: {
      [P in keyof T]?: T[P];
    };
    to: {
      [P in keyof T]?: T[P];
    };
    duration: number;
    pos?: number;
    easingFunc?: EASING;
    easingMode?: 'easeInOut' | 'easeIn' | 'easeOut';
    name?: string;
    loop?: boolean;
  }) {
    this.setEasingMode(easingFunc, easingMode);

    for (const anim_key in to) {
      const anim = new BABYLON.Animation(
        name,
        anim_key,
        this.fps,
        this.getAnimationType(to[anim_key]),
        loop
          ? BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
          : BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
      );

      const keys = [
        {
          frame: this.pos2frame(pos),
          value:
            from !== undefined
              ? from[anim_key] !== undefined
                ? from[anim_key]
                : target[anim_key]
              : target[anim_key],
        },
        {
          frame: this.pos2frame(pos + duration),
          value: to[anim_key],
        },
      ];
      anim.setKeys(keys);
      anim.setEasingFunction(easingFunc);
      this.animationGroup.addTargetedAnimation(anim, target);
      if (duration + pos > this._totalTime) {
        this._totalTime = duration + pos;
        this.animationGroup.normalize(0, this.pos2frame(this._totalTime));
      }
    }
  }
}
