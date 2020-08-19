import * as BABYLON from 'babylonjs';
import { Vector } from '../../3dComponent/Vector';
import { Vector3, AnimationGroup, Nullable } from 'babylonjs';
import { CanvasState } from '../../appState';

export class Canvas {
  _canvas: HTMLCanvasElement;
  _engine: BABYLON.Engine;
  _scene: BABYLON.Scene;
  lectureAnimGroup: Nullable<AnimationGroup> = null;
  canvState: CanvasState;

  constructor({
    canvas,
    canvState,
  }: {
    canvas: HTMLCanvasElement;
    canvState: CanvasState;
  }) {
    this._canvas = canvas;
    this._engine = this.createDefaultEngine();
    this._scene = this.createStartingScene();
    canvState.onSceneRegistered.notifyObservers({ scene: this._scene });
    this.canvState = canvState;
    this.render();
  }

  render() {
    this._engine.runRenderLoop(() => {
      this._scene.render();
    });
    window.addEventListener('resize', () => {
      this._engine.resize();
    });
  }
  createDefaultEngine() {
    return new BABYLON.Engine(this._canvas, true, {
      preserveDrawingBuffer: true,
      stencil: true,
    });
  }

  createStartingScene() {
    if (!this._canvas || !this._engine) {
      throw new Error('canvas or eignine cannot be null');
    }
    const scene = new BABYLON.Scene(this._engine);
    // scene.useRightHandedSystem = true;
    const background_color = new BABYLON.Color4(0, 0, 0, 0.3);
    scene.clearColor = background_color;
    // add lights:
    new BABYLON.HemisphericLight(
      'ambient_light',
      new BABYLON.Vector3(-4, 4, 10),
      scene
    );
    new BABYLON.DirectionalLight(
      'directional_light',
      new BABYLON.Vector3(-4, 4, 10),
      scene
    );
    const vec = new Vector({
      vector: new BABYLON.Vector3(0, 0, 0.5),
      color: new BABYLON.Color3(0.8, 0.3, 0.4),
      scene,
    });
    vec.buildMeshes();
    const anims = new BABYLON.Animation(
      'test',
      'vec',
      60,
      BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
      BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
    );
    const keys = [
      { value: vec.vec, frame: 0 },
      { value: new Vector3(3, 0, 0), frame: 300 },
    ];
    anims.setKeys(keys);
    const easing = new BABYLON.QuadraticEase();
    easing.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);
    anims.setEasingFunction(easing);
    this.lectureAnimGroup = new AnimationGroup('lecture_anims', scene);
    this.lectureAnimGroup.addTargetedAnimation(anims, vec);
    scene.animationGroups.push(this.lectureAnimGroup);
    // Parameters: alpha, beta, radius, target position, scene
    const camera = new BABYLON.ArcRotateCamera(
      'Camera',
      0,
      0,
      10,
      new BABYLON.Vector3(0, 0, 0),
      scene
    );

    // Positions the camera overwriting alpha, beta, radius
    camera.setPosition(new BABYLON.Vector3(6, 5, 6));
    // This attaches the camera to the canvas
    camera.attachControl(this._canvas, true);

    // const box1 = BABYLON.Mesh.CreateBox("Box1", 0.5, scene);

    var materialBox = new BABYLON.StandardMaterial('texture1', scene);
    materialBox.diffuseColor = BABYLON.Color3.FromHexString('#44a832');
    // box1.material = materialBox;
    // showAxis(3, scene)
    new BABYLON.AxesViewer(scene, 1);

    return scene;
  }
}
