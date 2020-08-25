import * as BABYLON from 'babylonjs';
import { Vector3, Color3, Scene } from 'babylonjs';
import { hex2Color3 } from './utils';

export class Point {
  private _position: Vector3;
  private _color: Color3;
  private _alpha: number;
  private _diameter = 0.1;
  private _mesh!: BABYLON.Mesh;
  private _material!: BABYLON.StandardMaterial;
  scene: Scene;

  constructor({
    position,
    color = hex2Color3('#2067f5'),
    alpha = 1,
    scene,
  }: {
    position: Vector3;
    color?: Color3;
    alpha?: number;
    scene: BABYLON.Scene;
  }) {
    this._position = position;
    this._color = color;
    this._alpha = alpha;
    this.scene = scene;

    this._createMesh();
  }
  get position() {
    return this._position;
  }
  set position(newPos: Vector3) {
    this._position = newPos;
    this._mesh.position = newPos;
  }
  get color() {
    return this._color;
  }
  set color(color: Color3) {
    this._color = color;
    this._material.emissiveColor = color;
  }
  get alpha() {
    return this._alpha;
  }
  set alpha(alpha: number) {
    this._alpha = alpha;
    this._material.alpha = alpha;
  }

  _createMesh() {
    const mesh = BABYLON.MeshBuilder.CreateSphere(
      'point',
      { diameter: this._diameter },
      this.scene
    );
    mesh.position.copyFrom(this._position);
    const material = new BABYLON.StandardMaterial('point_material', this.scene);
    material.disableLighting = true;
    material.emissiveColor = this._color;
    material.alpha = this._alpha;
    mesh.material = material;

    this._mesh = mesh;
    this._material = material;
  }
  removeFromScene() {
    this.scene.removeMesh(this._mesh);
  }
  add2Scene() {
    this.scene.addMesh(this._mesh);
  }
}
