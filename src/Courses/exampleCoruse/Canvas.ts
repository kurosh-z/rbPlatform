import * as BABYLON from 'babylonjs';
import { Vector3, AnimationGroup, LinesMesh } from 'babylonjs';
import { CanvasState } from '../../appState';
import { Vector, Line, Grids } from '../../3dComponent';
import { linspace, hex2Color4, TimeLine } from '../../3dComponent/utils';
import { Palette } from '../../theme/types';

export class Canvas {
  _canvas: HTMLCanvasElement;
  _engine: BABYLON.Engine;
  _scene!: BABYLON.Scene;
  _camera!: BABYLON.Camera;
  lectureAnimGroup!: AnimationGroup;
  timeline!: TimeLine;
  canvState: CanvasState;
  palette: Palette;

  constructor({
    canvas,
    canvState,
    palette,
  }: {
    canvas: HTMLCanvasElement;
    canvState: CanvasState;
    palette: Palette;
  }) {
    this._canvas = canvas;
    this.palette = palette;
    this._engine = this.createDefaultEngine();
    this.init();
    this.createGridAnimation();
    // this.createLineAnimation();
    // notify state about the scene
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
  init() {
    if (!this._canvas || !this._engine) {
      throw new Error('canvas or eignine cannot be null');
    }
    const scene = new BABYLON.Scene(this._engine);
    scene.useRightHandedSystem = true;
    scene.clearColor = hex2Color4(this.palette.white.dark);
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
    this.lectureAnimGroup = new AnimationGroup('lecture_anims', scene);
    this.timeline = new TimeLine({
      fps: 60,
      animationGroup: this.lectureAnimGroup,
    });
    this._camera = camera;
    this._scene = scene;
  }

  createGridAnimation() {
    const h_ticks = linspace({ start: -6, stop: 6, num: 38 });
    const v_ticks = linspace({ start: -3, stop: 3, num: 18 });
    const grids = new Grids({
      scene: this._scene,
      h_ticks,
      v_ticks,
      h_lenght: 0,
      v_lenght: 0,
    });
    this.timeline.add({
      target: grids,
      from: { h_length: 0 },
      to: { h_length: 12.6 },
      duration: 1.8,
      name: 'hgrids_animation',
    });
    this.timeline.add({
      target: grids,
      from: { v_length: 0 },
      to: { v_length: 6.6 },
      duration: 1.5,
      name: 'vgrids_animation',
    });
  }
  createLineAnimation() {
    const line = new Line({
      scene: this._scene,
      p1: new Vector3(0, -2, 0),
      p2: new Vector3(2, 2, 0),
    });

    this.timeline.add({
      target: line,
      to: { p2: new Vector3(0, 0, 0) },
      from: { p2: new Vector3(-2, 2, 0) },
      duration: 2,
      name: 'line_animation',
    });
  }

  // createStartingScene() {
  //   const h_ticks = linspace({ start: -6, stop: 6, num: 38 });
  //   const v_ticks = linspace({ start: -3, stop: 3, num: 18 });
  //   new Grids({ scene, h_ticks, v_ticks });

  //   // Parameters: alpha, beta, radius, target position, scene
  //   const camera = new BABYLON.ArcRotateCamera(
  //     'Camera',
  //     0,
  //     0,
  //     10,
  //     new BABYLON.Vector3(0, 0, 0),
  //     scene
  //   );

  //   // Positions the camera overwriting alpha, beta, radius
  //   camera.setPosition(new BABYLON.Vector3(0, 0, 8));
  //   // This attaches the camera to the canvas
  //   camera.attachControl(this._canvas, true);
  //   new BABYLON.AxesViewer(scene, 1);
  //   this._camera = camera;

  //   return scene;
  // }
}
