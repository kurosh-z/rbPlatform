import * as BABYLON from 'babylonjs';
import {
  Vector3,
  TransformNode,
  Color3,
  Scene,
  Nullable,
  Animation,
} from 'babylonjs';
import { rotationQuaternionJToV2, hex2Color3 } from './utils';

export class Vector {
  origin = new Vector3(0, 0, 0);
  private _vec: Vector3;
  color: Color3;
  visibility: number;
  _diam = 0.04;
  _headDiam = 0.14;
  _headHeigth = 0.18;
  scene: Scene;
  _arrow: Nullable<TransformNode> = null;
  animations: Animation[] = [];

  constructor({
    vector,
    color = hex2Color3('#2368e8'),
    origin,
    visiblity = 1,
    scene,
  }: {
    vector: Vector3;
    color?: Color3;
    origin?: Vector3;
    visiblity?: number;
    scene: BABYLON.Scene;
  }) {
    this._vec = vector;
    this.color = color;
    this.visibility = visiblity;
    this.scene = scene;
    if (origin) {
      this.origin = origin;
    }
    this._buildMeshes();
  }

  calculatShaftHeight() {
    const vec = this._vec;
    const mag = vec.length() - this._headHeigth;
    return mag;
  }
  _calculateRotationQuaternion() {
    const quat1 = rotationQuaternionJToV2(this._vec);
    return quat1;
    // const _vec = this._vec.clone().normalize();
    // let angle = 0;
    // let axes = Vector3.Cross(J, _vec);
    // if (axes.cross(J).length() < 0.001) {
    //   angle = axes.y < 0 ? 0 : Math.PI;
    //   axes = K;
    // } else {
    //   const dot = Vector3.Dot(J, _vec);
    //   angle = -Math.abs(dot) >= 0.001 ? Math.acos(dot) : Math.acos(dot);
    // }
    // const quat = Quaternion.RotationAxis(axes, angle);
    // console.log(quat, quat1);
    // return quat;
  }

  set vec(to: Vector3) {
    this._updateVec(to);
  }
  get vec() {
    return this._vec;
  }
  _updateVec(vec: Vector3) {
    this._vec = vec;
    const quat = this._calculateRotationQuaternion();
    this._arrow.rotationQuaternion = quat;
    const children = this._arrow.getChildMeshes();
    const shaft = children[0].name === 'vec_shaft' ? children[0] : children[1];
    const head = children[0].name === 'vec_head' ? children[0] : children[1];
    const h = this.calculatShaftHeight();
    shaft.scaling.y = h;
    shaft.position.set(0, h / 2, 0);
    head.position.set(0, h, 0);
  }
  _buildMeshes() {
    const arrow = new TransformNode('vector');
    const h = this.calculatShaftHeight();
    const shaft = BABYLON.MeshBuilder.CreateCylinder(
      'vec_shaft',
      { height: 1, diameter: this._diam },
      this.scene
    );
    shaft.scaling.y = h;
    const head = BABYLON.MeshBuilder.CreateCylinder(
      'vec_head',
      {
        diameterBottom: this._headDiam,
        diameterTop: 0,
        height: this._headHeigth,
      },
      this.scene
    );

    const mat = new BABYLON.StandardMaterial('vec_mat', this.scene);
    mat.diffuseColor = BABYLON.Color3.Blue();
    shaft.material = mat;
    head.material = mat;

    //  this._calculateRotationMatrix(J, this._vec
    shaft.parent = arrow;
    head.parent = arrow;
    this._arrow = arrow;

    const quat = this._calculateRotationQuaternion();
    arrow.rotationQuaternion = quat;
    shaft.position.set(0, h / 2, 0);
    head.position.set(0, h, 0);
  }
}
