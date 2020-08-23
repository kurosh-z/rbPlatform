import * as BABYLON from 'babylonjs';
import { Vector3, AnimationGroup, Nullable } from 'babylonjs';
import { CanvasState } from '../../appState';
import { Vector, Line, Grids } from '../../3dComponent';
import { linspace } from '../../3dComponent/utils';

export class Canvas {
  _canvas: HTMLCanvasElement;
  _engine: BABYLON.Engine;
  _scene: BABYLON.Scene;
  _camera: BABYLON.Camera;
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
    return new BABYLON.Engine(
      this._canvas,
      true,
      {
        preserveDrawingBuffer: true,
        stencil: true,
      },
      true
    );
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
      vector: new BABYLON.Vector3(1, 1, 0),
      color: new BABYLON.Color3(0.8, 0.3, 0.4),
      scene,
    });

    const anims = new BABYLON.Animation(
      'vec_anim',
      'vec',
      60,
      BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
      BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
    );
    let keys = [
      { value: vec.vec, frame: 100 },
      { value: new Vector3(0, 3, -2), frame: 400 },
    ];
    anims.setKeys(keys);
    const easing = new BABYLON.QuadraticEase();
    easing.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);
    anims.setEasingFunction(easing);
    this.lectureAnimGroup = new AnimationGroup('lecture_anims', scene);
    this.lectureAnimGroup.addTargetedAnimation(anims, vec);

    // line animation:
    const l1 = new Line({
      scene,
      p1: new Vector3(1, -2, 1),
      p2: new Vector3(0, 2, 1),
    });
    const lineAnim = new BABYLON.Animation(
      'lineanim',
      'p2',
      60,
      BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
      BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
    );
    keys = [
      { value: l1.p2, frame: 0 },
      { value: new Vector3(3, 5, 0), frame: 300 },
    ];
    lineAnim.setKeys(keys);
    lineAnim.setEasingFunction(easing);
    // this.lectureAnimGroup.addTargetedAnimation(lineAnim, l1);
    this.lectureAnimGroup.normalize(0, 300);
    scene.animationGroups.push(this.lectureAnimGroup);

    const h_ticks = linspace({ start: -6, stop: 6, num: 38 });
    const v_ticks = linspace({ start: -3, stop: 3, num: 18 });
    new Grids({ scene, h_ticks, v_ticks });

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
    camera.setPosition(new BABYLON.Vector3(0, 0, 8));
    // This attaches the camera to the canvas
    camera.attachControl(this._canvas, true);
    new BABYLON.AxesViewer(scene, 1);
    this._camera = camera;

    return scene;
  }
}
