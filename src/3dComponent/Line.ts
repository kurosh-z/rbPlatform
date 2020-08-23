import * as BABYLON from 'babylonjs';
import { Vector3, Scene } from 'babylonjs';
import { rotationQuaternionJToV2, J } from './utils';
import chroma from 'chroma-js';

type LineOption = {
  color?: string;
  thickness?: number;
  fatLine?: boolean;
};
export class Line {
  _color: string;
  scene: Scene;
  _p1: Vector3;
  _p2: Vector3;
  thickness: number;
  fatLine: boolean;
  _mesh: BABYLON.Mesh;

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
    const { color = '#4e5052', thickness = 1.5, fatLine = true } =
      options instanceof Object ? options : {};
    this._p1 = p1;
    this._p2 = p2;
    this._color = color;
    this.thickness = thickness;
    this.fatLine = fatLine;
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
  }
  set p2(p2: Vector3) {
    this._p2 = p2;
    const v2 = this._p2.clone().add(this._p1.clone().scale(-1));
    const quat = rotationQuaternionJToV2(v2);
    this._mesh.rotationQuaternion = quat;
  }
  set color(color: string) {
    this._color = color;
    if (this.fatLine) {
      this._mesh.edgesColor = new BABYLON.Color4(...chroma(this._color).gl());
    }
  }
  _createMesh() {
    // Creation of a line with lengh 1 along J axes
    const lineMesh = BABYLON.Mesh.CreateLines(
      'lineMesh',
      [Vector3.Zero(), J],
      this.scene
    );

    // EdgesRendering on lines to make it  fat
    if (this.fatLine) {
      lineMesh.enableEdgesRendering();
      lineMesh.edgesWidth = this.thickness;
      lineMesh.edgesColor = new BABYLON.Color4(...chroma(this._color).gl());
    }
    const dir = this._p2.clone().add(this._p1.clone().scale(-1));
    const mag = dir.length();
    lineMesh.scaling.y = mag;
    // const line = new TransformNode('line');
    // lineMesh.parent = line;
    const quat = rotationQuaternionJToV2(dir);
    lineMesh.rotationQuaternion = quat;
    lineMesh.position.set(this._p1.x, this._p1.y, this._p1.z);
    return lineMesh;
  }
}
