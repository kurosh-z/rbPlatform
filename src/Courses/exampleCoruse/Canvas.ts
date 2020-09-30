import * as BABYLON from 'babylonjs'
import { Vector3, AnimationGroup } from 'babylonjs'
import { scaleLinear, ScaleLinear } from 'd3-scale'

import { useCanvasStore, useSCPopUPStore } from '../../appState'
import { Arrow, Grids, PulsingPoint, Axes } from '../../3dComponent'
import { isEvenNum, hex2Color4, TimeLine } from '../../3dComponent/utils'
import { Palette } from '../../theme/types'

export class Canvas {
  _canvas: HTMLCanvasElement
  _engine!: BABYLON.Engine
  _scene!: BABYLON.Scene
  _camera!: BABYLON.Camera
  lectureAnimGroup!: AnimationGroup
  timeline!: TimeLine
  palette: Palette
  cScale!: ScaleLinear<number, number>
  _domain!: number[]
  _range!: number[]

  constructor({
    canvas,
    palette,
    options,
  }: {
    canvas: HTMLCanvasElement
    palette: Palette
    options?: {
      domain: number[]
      range: number[]
    }
  }) {
    const { domain = [-20, 20], range = [-6, 6] } =
      options !== undefined ? options : {}
    this._domain = domain
    this._range = range
    this._canvas = canvas
    this.palette = palette
    this.init()
    //@ts-ignore
    useCanvasStore.setState(state => {
      state.currentScene = this._scene
    })
    this.createGridAnimation()
    this.createArrowAnimation()

    this.render()
  }
  setCanvasScale() {
    const scale = scaleLinear().domain(this._domain).range(this._range)
    this.cScale = scale
  }
  render() {
    this._engine.runRenderLoop(() => {
      this._scene.render()
    })
    window.addEventListener('resize', () => {
      this._engine.resize()
    })
  }
  createDefaultEngine() {
    this._engine = new BABYLON.Engine(
      this._canvas,
      true,
      {
        preserveDrawingBuffer: true,
        stencil: true,
      },
      true,
    )
  }
  init() {
    this.createDefaultEngine()
    this.setCanvasScale()

    if (!this._canvas || !this._engine) {
      throw new Error('canvas or eignine cannot be null')
    }
    const scene = new BABYLON.Scene(this._engine)
    scene.useRightHandedSystem = true
    scene.clearColor = hex2Color4(this.palette.white.dark)
    // add lights:
    new BABYLON.HemisphericLight(
      'ambient_light',
      new BABYLON.Vector3(-4, 4, 10),
      scene,
    )
    new BABYLON.DirectionalLight(
      'directional_light',
      new BABYLON.Vector3(-4, 4, 10),
      scene,
    )

    // Parameters: alpha, beta, radius, target position, scene
    const camera = new BABYLON.ArcRotateCamera(
      'Camera',
      0,
      0,
      10,
      new BABYLON.Vector3(0, 0, 0),
      scene,
    )

    // Positions the camera overwriting alpha, beta, radius
    camera.setPosition(new BABYLON.Vector3(0, 0, 8))
    // This attaches the camera to the canvas
    camera.attachControl(this._canvas, true)
    // new BABYLON.AxesViewer(scene, 1);
    this.lectureAnimGroup = new AnimationGroup('lecture_anims', scene)
    this.timeline = new TimeLine({
      fps: 60,
      animationGroup: this.lectureAnimGroup,
    })
    this._camera = camera
    this._scene = scene
  }

  createGridAnimation() {
    // const h_ticks = linspace({ start: -6, stop: 6, num: 38 });

    const h_ticks = this.cScale.ticks(50).map(val => this.cScale(val))
    // console.log(h_ticks);
    const zeroIdx = (h_ticks.length - 1) / 2

    const v_ticks = []
    if (isEvenNum(zeroIdx)) {
      for (let i = 0; i <= zeroIdx; i++) {
        v_ticks.push(h_ticks[i + zeroIdx / 2])
      }
    } else {
      for (let i = 0; i <= zeroIdx + 1; i++) {
        v_ticks.push(h_ticks[i + (zeroIdx - 1) / 2])
      }
    }

    let grids = new Grids({
      scene: this._scene,
      h_ticks,
      v_ticks,
      h_lenght: 0,
      v_lenght: 0,
    })

    this.timeline
      .add({
        target: grids,
        from: { h_length: 0 },
        to: { h_length: 12.6 },
        duration: 1.5,
        name: 'hgrids_animation',
      })
      .add({
        target: grids,
        from: { v_length: 0 },
        to: { v_length: 6.6 },
        duration: 1.5,
        pos: -1.5,
        name: 'vgrids_animation',
      })
  }
  cVector3(x: number, y: number, z: number) {
    return new Vector3(this.cScale(x), this.cScale(y), this.cScale(z))
  }

  createArrowAnimation() {
    const x_axes = new Axes({
      scene: this._scene,
      type: 'x',
      cScale: this.cScale,
    })
    const y_axes = new Axes({
      scene: this._scene,
      type: 'y',
      cScale: this.cScale,
    })

    const vec = new Arrow({
      vector: this.cVector3(5, 3, 0),
      scene: this._scene,
      config: { pointForSmallVectors: false },
    })

    this.timeline.add({
      target: vec,
      to: { vec: this.cVector3(-2, 1, 0) },
      duration: 1,
      pos: 0,
      name: 'vec_animation',
    })

    const pPoint = new PulsingPoint({
      position: this.cVector3(2, 3, 0),
      scene: this._scene,
    })
    const dragBehavior = pPoint.getPointerdragBehavior({
      dragPlaneNormal: new Vector3(0, 0, 1),
    })
    dragBehavior.onDragStartObservable.add(() => {
      useSCPopUPStore.setState(state => ({
        ...state,
        isEnabled: true,
      }))
    })
    dragBehavior.onDragEndObservable.add(() => {
      useSCPopUPStore.setState(state => ({
        ...state,
        open: true,
      }))
    })
  }
}
