import * as BABYLON from 'babylonjs';
import { Vector3, Scene, Color4, Color3 } from 'babylonjs';
import { rotationQuaternionJToV2, J } from './utils';
import { hex2Color3 } from './utils';

type LineOption = {
  color?: BABYLON.Color3;
  alpha?: number;
  useVertexAlpha?: boolean;
};
export class Line {
  private _color: BABYLON.Color3;
  private _alpha: number;
  private _p1: Vector3;
  private _p2: Vector3;
  private _mesh: BABYLON.LinesMesh;
  useVertexAlpha: boolean;
  scene: Scene;

  constructor({
    scene,
    p1,
    p2,
    options,
  }: {
    p1: Vector3;
    p2: Vector3;
    scene: Scene;
    options?: LineOption;
  }) {
    const { color = hex2Color3('#4e5052'), alpha = 1, useVertexAlpha = false } =
      options instanceof Object ? options : {};
    this._p1 = p1;
    this._p2 = p2;
    this._color = color;
    this._alpha = alpha === undefined ? 1 : alpha;
    this.useVertexAlpha = useVertexAlpha;
    this.scene = scene;
    this._mesh = this._createMesh();
  }

  get p1() {
    return this._p1;
  }
  get p2() {
    return this._p2;
  }
  set p1(p1: Vector3) {
    this._p1 = p1;
    const v2 = this._p2.clone().add(this._p1.clone().scale(-1));
    const quat = rotationQuaternionJToV2(v2);
    this._mesh.rotationQuaternion = quat;
    this._mesh.scaling.y = v2.length();
    this._mesh.position.set(this._p1.x, this._p1.y, this._p1.z);
  }
  set p2(p2: Vector3) {
    this._p2 = p2;
    const v2 = this._p2.clone().add(this._p1.clone().scale(-1));
    const quat = rotationQuaternionJToV2(v2);
    this._mesh.rotationQuaternion = quat;
    this._mesh.scaling.y = v2.length();
    this._mesh.position.set(this._p1.x, this._p1.y, this._p1.z);
  }
  updatePoints(p1: Vector3, p2: Vector3) {
    this._p1 = p1;
    this._p2 = p2;
    const v2 = this._p2.clone().add(this._p1.clone().scale(-1));
    const quat = rotationQuaternionJToV2(v2);
    this._mesh.rotationQuaternion = quat;
    this._mesh.scaling.y = v2.length();
    this._mesh.position.set(this._p1.x, this._p1.y, this._p1.z);
  }
  set color(color: Color3) {
    this._color = color;
  }
  get alpha() {
    return this._alpha;
  }
  set alpha(alpha: number) {
    this._alpha = alpha;
    this._mesh.alpha = alpha;
  }

  _createMesh() {
    // Creation of a line with lengh 1 along J axes
    const lineMesh = BABYLON.MeshBuilder.CreateLines(
      'lineMesh',
      {
        points: [Vector3.Zero(), J],
        useVertexAlpha: this.useVertexAlpha,
      },
      this.scene
    );

    lineMesh.color = this._color;
    lineMesh.alpha = this._alpha;

    const dir = this._p2.clone().add(this._p1.clone().scale(-1));
    const mag = dir.length();
    lineMesh.scaling.y = mag;
    const quat = rotationQuaternionJToV2(dir);
    lineMesh.rotationQuaternion = quat;
    lineMesh.position.set(this._p1.x, this._p1.y, this._p1.z);

    return lineMesh;
  }
}
