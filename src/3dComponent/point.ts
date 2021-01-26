import * as BABYLON from 'babylonjs'
import {
  Vector3,
  Color3,
  Scene,
  Animation,
  AnimationGroup,
  PointerDragBehavior,
  TransformNode,
  Nullable,
} from 'babylonjs'
import { hex2Color3 } from './utils'

export class Point {
  private _position: Vector3
  private _color: Color3
  private _alpha: number
  private _diameter: number
  private _material!: BABYLON.StandardMaterial
  private _parent: Nullable<TransformNode> = null
  pinterDragBehavior: PointerDragBehavior | null = null
  mesh!: BABYLON.Mesh
  animations: Animation[] = []
  scene: Scene

  constructor({
    position,
    color = hex2Color3('#2067f5'),
    alpha = 1,
    diameter = 0.12,
    scene,
  }: {
    position: Vector3
    color?: Color3
    alpha?: number
    diameter?: number
    scene: BABYLON.Scene
  }) {
    this._position = position
    this._color = color
    this._alpha = alpha
    this._diameter = diameter
    this.scene = scene

    this._createMesh()
  }
  get position() {
    return this._position
  }
  set position(newPos: Vector3) {
    this._position = newPos
    this.mesh.position = newPos
  }
  get color() {
    return this._color
  }
  set color(color: Color3) {
    this._color = color
    this._material.emissiveColor = color
  }
  get alpha() {
    return this._alpha
  }
  set alpha(alpha: number) {
    this._alpha = alpha
    this._material.alpha = alpha
  }
  get diameter() {
    return this._diameter
  }
  set diameter(size: number) {
    this._diameter = this.diameter
    this.mesh.scaling.copyFromFloats(size, size, size)
  }
  get parent() {
    return this._parent
  }
  set parent(parent: TransformNode | null) {
    this._parent = parent
    this.mesh.parent = parent
  }
  _createMesh() {
    const mesh = BABYLON.MeshBuilder.CreateSphere(
      'point',
      { diameter: 1 },
      this.scene,
    )
    mesh.scaling.copyFromFloats(this._diameter, this._diameter, this._diameter)

    mesh.position.copyFrom(this._position)
    const material = new BABYLON.StandardMaterial('point_material', this.scene)
    material.disableLighting = true
    material.emissiveColor = this._color
    material.alpha = this._alpha
    mesh.material = material
    this.mesh = mesh
    this._material = material
  }
  removeFromScene() {
    this.scene.removeMesh(this.mesh)
  }
  add2Scene() {
    this.scene.addMesh(this.mesh)
  }
}

type PulsingPointOptions = {
  color?: Color3
  alpha?: number
}
export class PulsingPoint {
  _color: Color3
  _alpha: number
  _cPoint: Point
  _pPoint: Point
  _node: TransformNode
  actionManager: BABYLON.ActionManager
  scene: Scene
  private _position: Vector3
  private _pulsingAnimations!: AnimationGroup
  private _pointerDragBehavior: Nullable<PointerDragBehavior> = null

  constructor({
    position,
    scene,
    options,
  }: {
    position: Vector3
    scene: BABYLON.Scene
    options?: PulsingPointOptions
  }) {
    this.scene = scene
    this._position = position
    const { color = hex2Color3('#2067f5'), alpha = 0.3 } =
      options !== undefined ? options : {}
    this._color = color
    this._alpha = alpha
    this._cPoint = new Point({ position: Vector3.Zero(), scene, color })
    this._pPoint = new Point({
      position: Vector3.Zero(),
      scene,
      alpha,
      diameter: 0.3,
    })
    const node = new TransformNode('pulsing_point', scene)
    this._cPoint.parent = node
    this._pPoint.parent = node
    node.position.copyFrom(position)
    this._node = node
    // create action manager on core point to triger mouse events on hover
    const coreActionManager = new BABYLON.ActionManager(scene)
    this._cPoint.mesh.actionManager = coreActionManager
    this.actionManager = coreActionManager

    this.createPulsingAnimation()
  }
  // getter and setters
  get position() {
    return this._position
  }
  set position(newPos: Vector3) {
    this._position = newPos
    this._node.position.copyFrom(newPos)
  }

  createPulsingAnimation() {
    const diameterAnim = new Animation(
      'pulsing_diameter',
      'diameter',
      60,
      Animation.ANIMATIONTYPE_FLOAT,
      Animation.ANIMATIONLOOPMODE_CYCLE,
    )
    const alphaAnim = new Animation(
      'pulsing_alpha',
      'alpha',
      60,
      Animation.ANIMATIONTYPE_FLOAT,
      Animation.ANIMATIONLOOPMODE_CYCLE,
    )
    const diamKeyframes = [
      {
        frame: 0,
        value: 0,
      },
      {
        frame: 60 * 1,
        value: 0.35,
      },
    ]
    const alphaKeyframes = [
      {
        frame: 0,
        value: 1,
      },
      {
        frame: 60 * 1,
        value: 0.01,
      },
    ]
    diameterAnim.setKeys(diamKeyframes)
    // const easingFunc = new BABYLON.QuadraticEase();
    // easingFunc.setEasingMode(EasingFunction.EASINGMODE_EASEOUT);
    diameterAnim.setKeys(diamKeyframes)
    alphaAnim.setKeys(alphaKeyframes)
    // alphaAnim.setEasingFunction(easingFunc);
    this._pPoint.animations.push(diameterAnim)
    this._pPoint.animations.push(alphaAnim)

    const pulsingAnimation = new AnimationGroup('pulsing_animation', this.scene)
    pulsingAnimation.addTargetedAnimation(diameterAnim, this._pPoint)
    pulsingAnimation.addTargetedAnimation(alphaAnim, this._pPoint)
    pulsingAnimation.play(true)
    this._pulsingAnimations = pulsingAnimation
  }
  start() {
    if (!this._pulsingAnimations.isPlaying) {
      this._pulsingAnimations.play(true)
    }
  }
  stop() {
    if (this._pulsingAnimations.isPlaying) {
      this._pulsingAnimations.stop()
      this._pPoint.alpha = 0
    }
  }
  getPointerdragBehavior(options?: {
    dragAxis?: Vector3 | undefined
    dragPlaneNormal?: Vector3 | undefined
  }) {
    if (this._pointerDragBehavior) return this._pointerDragBehavior
    const pointerDragBehavior = new PointerDragBehavior(options)
    pointerDragBehavior.useObjectOrientationForDragging = false
    this._node.addBehavior(pointerDragBehavior)
    this._pointerDragBehavior = pointerDragBehavior
    return pointerDragBehavior
  }
}
