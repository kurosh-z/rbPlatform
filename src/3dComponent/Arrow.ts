import * as BABYLON from 'babylonjs'
import {
  Vector3,
  TransformNode,
  Color3,
  Scene,
  AnimationGroup,
} from 'babylonjs'
import { Point } from './point'
import { TimeLine } from './utils'
import { rotationQuaternionJToV2, hex2Color3 } from './utils'

export type ArrowConfigs = {
  color?: Color3
  origin?: Vector3
  alpha?: number
  pointForSmallVectors?: boolean
}

export class Arrow {
  origin = new Vector3(0, 0, 0)
  private _vec: Vector3
  color: Color3
  alpha: number
  _diam = 0.04
  _headDiam = 0.14
  _headHeigth = 0.18
  scene: Scene
  _node!: TransformNode
  _material!: BABYLON.StandardMaterial
  _zeroPoint!: Point
  pointForSmallVectors: boolean
  _zeroActiv = false
  private _userAnimGroup?: BABYLON.AnimationGroup

  constructor({
    vector,
    scene,
    config,
  }: {
    vector: Vector3
    scene: BABYLON.Scene
    config?: ArrowConfigs
  }) {
    const {
      color = hex2Color3('#2067f5'),
      alpha = 1,
      pointForSmallVectors = true,
    } = config || {}
    this._vec = vector
    this.scene = scene
    this.pointForSmallVectors = pointForSmallVectors
    this.color = color
    this.alpha = alpha

    this._createMeshes()
  }

  calculatShaftHeight() {
    return this._vec.length() - this._headHeigth
  }
  _calculateRotationQuaternion() {
    const quat1 = rotationQuaternionJToV2(this._vec)
    return quat1
  }

  set vec(to: Vector3) {
    this._updateVec(to)
  }
  get vec() {
    return this._vec
  }
  scale(scale: number) {
    this._vec = this._vec.scale(scale)
    const h = this.calculatShaftHeight()
    const children = this._node.getChildMeshes()
    const shaft = children[0].name === 'vec_shaft' ? children[0] : children[1]
    const head = children[0].name === 'vec_head' ? children[0] : children[1]
    shaft.scaling.y = h
    shaft.position.set(0, h / 2, 0)
    head.position.set(0, h + this._headHeigth / 2, 0)
  }
  private _updateVec(vec: Vector3, forceUpdate = false) {
    if (
      vec.x === this._vec.x &&
      vec.y === this._vec.y &&
      vec.z === this.vec.z &&
      !forceUpdate
    ) {
      return
    }
    this._vec = vec
    const quat = this._calculateRotationQuaternion()
    this._node.rotationQuaternion = quat
    const children = this._node.getChildMeshes()
    const shaft = children[0].name === 'vec_shaft' ? children[0] : children[1]
    const head = children[0].name === 'vec_head' ? children[0] : children[1]
    const h = this.calculatShaftHeight()
    if (h < 0.005 && this._zeroActiv === false) {
      if (this.pointForSmallVectors) {
        this.scene.removeMesh(shaft)
        this.scene.removeMesh(head)
        this._zeroPoint.add2Scene()
      } else {
        this.scene.removeMesh(head)
      }

      this._zeroActiv = true
      return
    }
    if (h >= 0.005 && this._zeroActiv === true) {
      if (this.pointForSmallVectors) {
        this.scene.addMesh(shaft)
        this.scene.addMesh(head)
        this._zeroPoint.removeFromScene()
      } else {
        this.scene.addMesh(head)
      }
      this._zeroActiv = false
    }

    shaft.scaling.y = h
    shaft.position.set(0, h / 2, 0)
    head.position.set(0, h + this._headHeigth / 2, 0)
  }
  _createMeshes() {
    const arrow = new TransformNode('vector')
    const h = this.calculatShaftHeight()
    const shaft = BABYLON.MeshBuilder.CreateCylinder(
      'vec_shaft',
      { height: 1, diameter: this._diam },
      this.scene,
    )
    shaft.scaling.y = h
    const head = BABYLON.MeshBuilder.CreateCylinder(
      'vec_head',
      {
        diameterBottom: this._headDiam,
        diameterTop: 0,
        height: this._headHeigth,
      },
      this.scene,
    )

    const mat = new BABYLON.StandardMaterial('vec_mat', this.scene)
    mat.emissiveColor = this.color
    mat.alpha = this.alpha
    // mat.specularColor = this.color.clone().subtract(new Color3(0.1, 0.1, 0.1));
    mat.disableLighting = true
    this._material = mat
    shaft.material = mat
    head.material = mat

    //  this._calculateRotationMatrix(J, this._vec
    shaft.parent = arrow
    head.parent = arrow
    this._node = arrow
    // update direction and magnitude
    this._updateVec(this._vec, true)
    const point = new Point({
      position: Vector3.Zero(),
      scene: this.scene,
    })
    point.removeFromScene()
    this._zeroPoint = point
  }
  removeFromScene() {
    const meshes = this._node.getChildMeshes()
    for (const mesh of meshes) {
      this.scene.removeMesh(mesh)
    }
  }
  add2Scene() {
    const meshes = this._node.getChildMeshes()
    for (const mesh of meshes) {
      this.scene.addMesh(mesh)
    }
  }
  dispose() {
    const meshes = this._node.getChildMeshes()
    for (const mesh of meshes) {
      mesh.dispose()
    }
    this._material.dispose()
  }

  get userAnimGroup() {
    if (this._userAnimGroup) {
      return this._userAnimGroup
    }
    this._userAnimGroup = new AnimationGroup('userAnimGroup', this.scene)
    return this._userAnimGroup
  }
  animTo(to: Vector3) {
    const t = new TimeLine({ fps: 60, animationGroup: this.userAnimGroup })
    t.add({
      target: this as Arrow,
      to: { vec: to },
      duration: 0.5,
      name: 'vecUserAnim',
    })
    this.userAnimGroup.start()
  }
}
