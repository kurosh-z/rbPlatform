import * as BABYLON from 'babylonjs'
import { Vector3, AnimationGroup, Vector2, Scene, Plane } from 'babylonjs'
import { scaleLinear, ScaleLinear } from 'd3-scale'
import { useCanvasStore, useSCPopUPStore } from '../../appState'
import { Arrow, Grids, PulsingPoint, Axes, Line } from '../../3dComponent'
import { hex2Color4, TimeLine, hex2Color3 } from '../../3dComponent/utils'
import { range } from '../../utils'
import { brighten, alpha } from '../../theme'
import { Palette } from '../../theme/types'
import { Circle } from './ExampleCourse'
import flare from '../../assets/texture/flare.png'
import fire from '../../assets/texture/fire.png'

export class Canvas {
  _canvas: HTMLCanvasElement
  _engine!: BABYLON.Engine
  _scene!: BABYLON.Scene
  _camera!: BABYLON.Camera
  lectureAnimGroup!: AnimationGroup
  timeline!: TimeLine
  palette: Palette
  cScale!: ScaleLinear<number, number>
  cScaleBack!: ScaleLinear<number, number>
  _domain!: number[]
  _range!: number[]
  testcomp: Circle
  _maxWidth = (window.innerWidth / 1680) * 12.2
  _maxHeight = (window.innerHeight / 953) * 6.6

  constructor({
    canvas,
    palette,
    circle,
    options,
  }: {
    canvas: HTMLCanvasElement
    palette: Palette
    circle: Circle
    options?: {
      domain: number[]
      range: number[]
    }
  }) {
    const {
      domain = [-20, 20],
      range = [-this._maxWidth / 2 + 0.5, this._maxWidth / 2 - 0.5],
    } = options !== undefined ? options : {}

    this._domain = domain
    this._range = range
    this._canvas = canvas
    this.palette = palette
    this.testcomp = circle
    this.init()
    //@ts-ignore
    useCanvasStore.setState(state => {
      state.currentScene = this._scene
    })
    this.createParticles()
    //this.createGridAnimation()
    //this.createArrowAnimation()
    //this.createIntro()

    this.render()
  }
  createParticles() {
    const scene = this._scene
    // const pl = new BABYLON.PointLight('pl', new BABYLON.Vector3(0, 0, 0), scene)
    // pl.diffuse = new BABYLON.Color3(1, 1, 1)

    const X0: number[] = [],
      Y0: number[] = [], // to store initial starting locations
      X: number[] = [],
      Y: number[] = [], // to store current point for each curve
      xb = 4,
      yb = 3
    //// curve ////
    const N = 40, // 25^2 curves
      // discretize the vfield coords
      xp = range(N).map(i => xb * (-1 + (i * 2) / N)),
      yp = range(N).map(i => yb * (-1 + (i * 2) / N))
    // array of starting positions for each curve on a uniform grid

    const xMap = scaleLinear()
      .domain([-xb, xb])
      .range([this._maxWidth / 2, this._maxWidth / 2])
    const yMap = scaleLinear()
      .domain([-yb, yb])
      .range([this._maxHeight / 2, this._maxHeight / 2])
    for (var i = 0; i < N; i++) {
      for (var j = 0; j < N; j++) {
        X.push(xp[j]), Y.push(yp[i])
        X0.push(xp[j]), Y0.push(yp[i])
      }
    }
    const MaxAge = 5
    const randage = () => {
      // to randomize starting ages for each curve
      return Math.round(Math.random() * MaxAge)
    }
    // function F(x: number, y: number) {
    //   // const mu = 0.2
    //   // const fx = y
    //   // const fy = mu * (1 - Math.pow(x, 2) * y) - x

    //   // // const fx = x + 2 * y
    //   // // const fy = 3 * x + 2 * y

    //   const fx = y
    //   const fy = -Math.sin(1.5 * x) - 0.015 * y
    //   return [fx, fy]
    // }
    const gamma = 2,
      c = 10
    function F(x: number, y: number) {
      var rho = Math.sqrt(x * x + y * y),
        r = rho - 1,
        a = gamma * (1 - rho * rho),
        b = -gamma * c * r * r + 1
      return [x * a - b * y, y * a + b * x]
    }

    // Create a particle system
    var particleSystem = new BABYLON.ParticleSystem(
      'particles',
      100 * X0.length,
      scene,
    )

    // const particleSystem = new BABYLON.GPUParticleSystem(
    //   'particles',
    //   { capacity: X0.length },
    //   scene,
    // )

    //Texture of each particle
    particleSystem.particleTexture = new BABYLON.Texture(fire, scene)

    // Where the particles come from
    particleSystem.emitter = BABYLON.Vector3.Zero() // the starting location

    // Colors of all particles
    particleSystem.color1 = new BABYLON.Color4(0.7, 0.8, 1.0, 1.0)
    particleSystem.color2 = new BABYLON.Color4(0.2, 0.5, 1.0, 1.0)
    particleSystem.colorDead = new BABYLON.Color4(0, 0, 0.2, 0.0)

    // Size of each particle (random between...
    particleSystem.minSize = 0.01
    particleSystem.maxSize = 0.05

    // Life time of each particle (random between...
    particleSystem.minLifeTime = 0.2
    particleSystem.maxLifeTime = 1

    // Emission rate
    particleSystem.emitRate = X0.length * 10

    /******* Emission Space ********/
    particleSystem.createBoxEmitter(
      new BABYLON.Vector3(0, 0, 0),
      new BABYLON.Vector3(0, 0, 0),
      new BABYLON.Vector3(-9, -5, 0),
      new BABYLON.Vector3(9, 5, 0),
    )

    // Speed

    const dt = 0.012
    particleSystem.minEmitPower = 0
    particleSystem.maxEmitPower = 0
    particleSystem.updateSpeed = dt

    particleSystem.updateFunction = function (particles) {
      for (var i = 0; i < particles.length; i++) {
        var particle = particles[i]
        particle.age += this._scaledUpdateSpeed
        console.log(particle.age)
        if (particle.age > particle.lifeTime) {
          // incriment age of each curve, restart if MaxAge is reached

          // particle.age = randage()
          ;(X[i] = X0[i]), (Y[i] = Y0[i])
          particle.position.x = X[i]
          particle.position.y = Y[i]
          // Recycle
          particles.splice(i, 1)
          this._stockParticles.push(particle)
          i--
          continue
        } else {
          const dr = F(X[i], Y[i])
          X[i] += dr[0] * this._scaledUpdateSpeed
          Y[i] += dr[1] * this._scaledUpdateSpeed

          particle.position.x = X[i]
          particle.position.y = Y[i]
          particle.colorStep.scaleToRef(
            this._scaledUpdateSpeed,
            this._scaledColorStep,
          )
          particle.color.addInPlace(this._scaledColorStep)
          if (particle.color.a < 0) particle.color.a = 0
          // particle.angle += particle.angularSpeed * this._scaledUpdateSpeed
          // particle.direction.scaleToRef(
          //   this._scaledUpdateSpeed,
          //   this._scaledDirection,
          // )
          // particle.position.addInPlace(this._scaledDirection)
          // this.gravity = 0
          // scaleToRef(this._scaledUpdateSpeed, this._scaledGravity)
          // particle.direction.addInPlace(this._scaledGravity)
        }

        // if (particle.age >= particle.lifeTime) {
        //   // Recycle
        //   particles.splice(index, 1)
        //   this._stockParticles.push(particle)
        //   index--
        //   continue
        // }
      }
    }
    // Start the particle system
    particleSystem.start()
  }

  createIntro() {
    // SPS creation
    const scene = this._scene
    const X0: number[] = [],
      Y0: number[] = [], // to store initial starting locations
      X: number[] = [],
      Y: number[] = [], // to store current point for each curve
      xb = 4,
      yb = 3
    //// curve ////
    const N = 40, // 25^2 curves
      // discretize the vfield coords
      xp = range(N).map(i => xb * (-1 + (i * 2) / N)),
      yp = range(N).map(i => yb * (-1 + (i * 2) / N))
    // array of starting positions for each curve on a uniform grid
    for (var i = 0; i < N; i++) {
      for (var j = 0; j < N; j++) {
        X.push(xp[j]), Y.push(yp[i])
        X0.push(xp[j]), Y0.push(yp[i])
      }
    }
    var pl = new BABYLON.PointLight('pl', new BABYLON.Vector3(0, 0, 0), scene)
    pl.diffuse = new BABYLON.Color3(1, 1, 1)
    const model = BABYLON.MeshBuilder.CreateSphere(
      'model',
      { diameter: 0.05 },
      scene,
    )
    const trail = new BABYLON.TrailMesh('trail', model, scene, 0.01, 30, true)
    const mat = new BABYLON.StandardMaterial('mat1', scene)
    mat.diffuseColor = hex2Color3(this.palette.green.dark)
    trail.material = mat

    const SPS = new BABYLON.SolidParticleSystem('SPS', scene)
    SPS.addShape(model, X0.length)

    const mesh = SPS.buildMesh()
    mesh.material = mat
    mesh.position.y = -0.3
    // model.dispose()
    // SPS behavior definition

    function F(x: number, y: number) {
      // const mu = 0.2
      // const fx = y
      // const fy = mu * (1 - Math.pow(x, 2) * y) - x

      // // const fx = x + 2 * y
      // // const fy = 3 * x + 2 * y

      const fx = y
      const fy = -Math.sin(1.5 * x) - 0.015 * y
      return [fx, fy]
    }

    const xMap = scaleLinear()
      .domain([-xb, xb])
      .range([this._maxWidth / 2, this._maxWidth / 2])
    const yMap = scaleLinear()
      .domain([-yb, yb])
      .range([this._maxHeight / 2, this._maxHeight / 2])
    const MaxAge = 50, // # timesteps before restart
      age: number[] = []
    const randage = () => {
      // to randomize starting ages for each curve
      return Math.round(Math.random() * MaxAge)
    }

    // recycle
    SPS.recycleParticle = function (particle) {
      // Set particle new velocity, scale and rotation
      // As this function is called for each particle, we don't allocate new
      // memory by using "new BABYLON.Vector3()" but we set directly the
      // x, y, z particle properties instead

      return particle
    }
    // init
    SPS.initParticles = function () {
      // just recycle everything
      for (var i = 0; i < X0.length; i++) {
        age.push(randage())
      }
    }

    // update : will be called by setParticles()
    const dt = 0.05

    SPS.updateParticle = particle => {
      // some physics here

      const i = particle.idx
      const dr = F(X[i], Y[i])
      X[i] += dr[0] * dt
      Y[i] += dr[1] * dt

      particle.position.x = X[i]
      particle.position.y = Y[i]

      if (age[i]++ > MaxAge) {
        // incriment age of each curve, restart if MaxAge is reached
        age[i] = randage()
        ;(X[i] = X0[i]), (Y[i] = Y0[i])
        particle.position.x = X[i]
        particle.position.y = Y[i]
      }
      return particle
    }

    // init all particle values and set them once to apply textures, colors, etc
    SPS.initParticles()
    SPS.setParticles()

    // Tuning :
    SPS.computeParticleColor = false
    SPS.computeParticleTexture = false

    //scene.debugLayer.show();
    // animation
    scene.registerBeforeRender(() => {
      SPS.setParticles()
      pl.position = this._camera.position
      // SPS.mesh.rotation.y += 0.01
    })
  }
  setCanvasScale() {
    const scale = scaleLinear().domain(this._domain).range(this._range)
    const scaleBack = scaleLinear().domain(this._range).range(this._domain)
    this.cScale = scale
    this.cScaleBack = scaleBack
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
    scene.clearColor = hex2Color4('#181142')
    // add lights:
    const hemisLight = new BABYLON.HemisphericLight(
      'ambient_light',
      new BABYLON.Vector3(4, 4, 90),
      scene,
    )
    hemisLight.intensity = 0.1
    // const dirLight = new BABYLON.DirectionalLight(
    //   'directional_light',
    //   new BABYLON.Vector3(-1, 0, -10),
    //   scene,
    // )
    // // dirLight.intensity = 0

    // Parameters: alpha, beta, radius, target position, scene
    const camera = new BABYLON.ArcRotateCamera(
      'Camera',
      0,
      0,
      80,
      new BABYLON.Vector3(0, 0, 0),
      scene,
    )
    camera.lowerRadiusLimit = 2.5
    camera.upperRadiusLimit = 30

    // Positions the camera overwriting alpha, beta, radius
    camera.setPosition(new BABYLON.Vector3(0, 0, 9))
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
    // this.applyFadeEffect()
  }

  applyFadeEffect() {
    BABYLON.Effect.ShadersStore['fadePixelShader'] =
      'precision highp float;' +
      'varying vec2 vUV;' +
      'uniform sampler2D textureSampler; ' +
      'uniform float fadeLevel; ' +
      'void main(void){' +
      'vec4 baseColor = texture2D(textureSampler, vUV) * fadeLevel;' +
      'baseColor.a = 1.0;' +
      'gl_FragColor = baseColor;' +
      '}'

    var fadeLevel = 0.1
    var postProcess = new BABYLON.PostProcess(
      'Fade',
      'fade',
      ['fadeLevel'],
      null,
      1.0,
      this._camera,
    )
    postProcess.onApply = effect => {
      effect.setFloat('fadeLevel', fadeLevel)
    }
  }
  applyBlurEffect() {
    var kernel = 32.0
    const postProcess0 = new BABYLON.BlurPostProcess(
      'Horizontal blur',
      new BABYLON.Vector2(1.0, 0),
      kernel,
      0.4,
      this._camera,
    )
    const postProcess1 = new BABYLON.BlurPostProcess(
      'Vertical blur',
      new BABYLON.Vector2(0, 1.0),
      kernel,
      2.0,
      this._camera,
    )
  }
  createGridAnimation() {
    const h_ticks = this.cScale.ticks(20).map(t => this.cScale(t))
    const v_ticks = this.cScale
      .ticks(20)
      .map(t => this.cScale(t))
      .filter(val => Math.abs(val) <= 3)

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
        to: { h_length: this._maxWidth - 1 },
        duration: 1.5,
        name: 'hgrids_animation',
      })
      .add({
        target: grids,
        from: { v_length: 0 },
        to: { v_length: this._maxHeight - 0.5 },
        duration: 1.5,
        pos: -1.5,
        name: 'vgrids_animation',
      })
  }
  cVector3(x: number, y: number, z: number) {
    return new Vector3(this.cScale(x), this.cScale(y), this.cScale(z))
  }
  canvToUnscaledVec(vec: Vector3) {
    return new Vector3(
      this.cScaleBack(vec.x),
      this.cScaleBack(vec.y),
      this.cScaleBack(0),
    )
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
      vector: this.cVector3(0, 0, 0),
      scene: this._scene,
      config: { pointForSmallVectors: false },
    })

    this.timeline
      .add({
        target: this.testcomp,
        from: { pos: new Vector2(0, 0) },
        to: { pos: new Vector2(400, -30) },
        duration: 1,
        pos: 0,
        name: 'test',
      })
      .add({
        target: vec,
        to: { vec: new Vector3(this._maxWidth / 5, this._maxHeight / 3, 0) },
        duration: 6.2,
        pos: -1,
        name: 'vec_animation',
      })

    const xyPlane = BABYLON.MeshBuilder.CreatePlane(
      'xyPlane',
      {
        width: this._maxWidth,
        height: this._maxHeight,
        sideOrientation: BABYLON.Mesh.DOUBLESIDE,
      },
      this._scene,
    )

    const pmaterial = new BABYLON.StandardMaterial('planeMaterial', this._scene)
    pmaterial.backFaceCulling = true
    pmaterial.alpha = 0.7
    // pmaterial.emissiveColor = hex2Color3('#9b9d9e')
    pmaterial.emissiveColor = hex2Color3(brighten(this.palette.gray.light, 0.9))
    xyPlane.material = pmaterial
    // this._scene.onPointerDown = (ev, pickResult) => {
    //   if (pickResult.hit) {
    //     pickResult.pickedMesh?.metadata === 'xyPlane'
    //     vec.vec = pickResult.pickedPoint as Vector3
    //     // console.log(this.canvToUnscaledVec(pickResult.pickedPoint))
    //   }
    // }

    const pPoint = new PulsingPoint({
      position: this.cVector3(2, 3, 0),
      scene: this._scene,
    })

    const pActionManager = pPoint.actionManager
    pActionManager.registerAction(
      new BABYLON.ExecuteCodeAction(
        BABYLON.ActionManager.OnPointerOverTrigger,
        () => {
          this._canvas.style.cursor = 'pointer'
          pPoint.stop()
        },
      ),
    )
    useSCPopUPStore.getState().onSetCancel.add(({ state }) => {
      if (state === 'set') {
        const to = useSCPopUPStore.getState().canvPos.clone()
        vec.animTo(to)
      }
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
    dragBehavior.onDragStartObservable.add(() => {
      pPoint._cPoint.diameter = pPoint._cPoint.diameter * 1.2
    })
    dragBehavior.onDragEndObservable.add(() => {
      // console.log(this.canvToUnscaledVec(dragPlanePoint))

      pPoint._cPoint.diameter = pPoint._cPoint.diameter / 1.2
      const tm = this._scene.getTransformMatrix()
      const wm = pPoint._node.getWorldMatrix()
      const currPos = pPoint.position
      const viewport = this._scene.activeCamera!.viewport
      const coord = BABYLON.Vector3.Project(currPos, wm, tm, viewport)
      // const canvasLeft = window.innerWidth * 0.25
      const canvasWidth = window.innerWidth * 0.95
      const canvasTop = 68
      const canvasHeight = window.innerHeight - 80
      coord.x = coord.x * canvasWidth
      coord.y = coord.y * canvasHeight + canvasTop

      useSCPopUPStore.setState(state => ({
        ...state,
        pos: [coord.x, coord.y],
        open: true,
        canvPos: pPoint._node.position,
      }))
    })
  }
}

// const gamma = 2,
//   c = 10,
//   dt = 0.005,
//   X0: number[] = [],
//   Y0: number[] = [], // to store initial starting locations
//   X: number[] = [],
//   Y: number[] = [], // to store current point for each curve
//   xb = 5,
//   yb = 3
// //// curve ////
// const N = 30, // 25^2 curves
//   // discretize the vfield coords
//   xp = range(N).map(function (i) {
//     return xb * (-1 + (i * 2) / N)
//   }),
//   yp = range(N).map(function (i) {
//     return yb * (-1 + (i * 2) / N)
//   })
// // array of starting positions for each curve on a uniform grid
// for (var i = 0; i < N; i++) {
//   for (var j = 0; j < N; j++) {
//     X.push(xp[j]), Y.push(yp[i])
//     X0.push(xp[j]), Y0.push(yp[i])
//   }
// }
// // vfield
// function F(x: number, y: number) {
//   var rho = Math.sqrt(x * x + y * y),
//     r = rho - 1,
//     a = gamma * (1 - rho * rho),
//     b = -gamma * c * r * r + 1
//   return [x * a - b * y, y * a + b * x]
// }
// function F2(x: number, y: number) {
//   const mu = 0.2
//   // const fx = y
//   // const fy = mu * (1 - Math.pow(x, 2) * y) - x

//   // const fx = x + 2 * y
//   // const fy = 3 * x + 2 * y

//   const fx = y
//   const fy = -Math.sin(1.5 * x) - 0.015 * y
//   return [fx, fy]
// }

// const xMap = scaleLinear().domain([-xb, xb]).range([100, 1900])
// const yMap = scaleLinear().domain([-yb, yb]).range([100, 1900])
// const animAge = 0,
//   frameRate = 30, // ms per timestep (yeah I know it's not really a rate)
//   M = X.length,
//   MaxAge = 100, // # timesteps before restart
//   age: number[] = []
// const randage = () => {
//   // to randomize starting ages for each curve
//   return Math.round(Math.random() * 100)
// }
// for (var i = 0; i < M; i++) {
//   age.push(randage())
// }
// const pWidth = 11
// const pHeight = 6
// const plate = BABYLON.MeshBuilder.CreatePlane(
//   'ground',
//   {
//     width: pWidth,
//     height: pHeight,
//     sideOrientation: BABYLON.Mesh.DOUBLESIDE,
//   },
//   this._scene,
// )

// const texture = new BABYLON.DynamicTexture(
//   '2dtexture',
//   { width: 2000, height: 2000 },
//   this._scene,
//   false,
// )
// const plateMat = new BABYLON.StandardMaterial('g', this._scene)
// plateMat.emissiveColor = hex2Color3(this.palette.white.dark)
// plateMat.diffuseTexture = texture
// plate.material = plateMat

// const ctx = texture.getContext()
// // ctx.globalCompositeOperation = 'source-over'
// ctx.lineWidth = 2
// ctx.fillStyle = this.palette.white.light
// ctx.fillRect(0, 0, 2000, 2000)
// texture.update()

//     const updateField = () => {
//       ctx.fillStyle = 'rgba(250, 250, 250, 0.005)'

//       // ctx.fillStyle = alpha(this.palette.white.light, 0.5)
//       // ctx.fillStyle = this.palette.white.dark

//       ctx.fillRect(0, 0, 2000, 2000)
//       ctx.strokeStyle = alpha('#ffc71f', 1)
//       for (var i = 0; i < M; i++) {
//         // draw a single timestep for every curve
//         ctx.strokeStyle = alpha(this.palette.yellow.dark, 1)
//         var dr = F2(X[i], Y[i])
//         ctx.beginPath()
//         ctx.moveTo(xMap(X[i]), yMap(Y[i])) // the start point of the path
//         ctx.lineTo(xMap((X[i] += dr[0] * dt)), yMap((Y[i] += dr[1] * dt))) // the end point
//         if (age[i] > MaxAge / 2) {
//           ctx.strokeStyle = alpha(this.palette.orange.dark, 1)
//         }
//         ctx.stroke() // final draw command
//         if (age[i]++ > MaxAge) {
//           // incriment age of each curve, restart if MaxAge is reached
//           age[i] = randage()
//           ;(X[i] = X0[i]), (Y[i] = Y0[i])
//         }
//       }
//       texture.update()
//     }
//     let currTime = 0
//     this._scene.onBeforeRenderObservable.add(() => {
//       let delta = this._engine.getDeltaTime()
//       currTime += delta
//       if (currTime > 5) {
//         // window.requestAnimationFrame(updateField)
//         window.requestAnimationFrame(updateField)
//         currTime = 0
//       }
//     })
// create all pints for all times t =tFactor*dt =2000*.005
// let tFactor = 500
// const sphere = BABYLON.MeshBuilder.CreateSphere(
//   's',
//   { diameter: 0.04 },
//   this._scene,
// )

// const sourceMat = new BABYLON.StandardMaterial('sourceMat', this._scene)
// sphere.material = sourceMat
// const spheres: BABYLON.Mesh[] = []
// const trails: BABYLON.TrailMesh[] = []
// for (let i = 0; i < M; i++) {
//   // draw a single timestep for every curve
//   const p1 = new Vector3(xMap(X[i]), yMap(Y[i]), 0)
//   const sp = sphere.clone()
//   sp.position.copyFrom(p1)
//   spheres.push(sp)
//   const trail = new BABYLON.TrailMesh(
//     'trail',
//     sp,
//     this._scene,
//     0.02,
//     7,
//     true,
//   )
//   trail.material = sourceMat
//   trails.push(trail)
//   sp.visibility = 0

//   age.push(randage())
// }

// let currTime = 0
// this._scene.onBeforeRenderObservable.add(() => {
//   currTime += this._engine.getDeltaTime()
//   if (currTime > 10) {
//     let i = 0
//     for (const sp of spheres) {
//       const dr = F(X[i], Y[i])
//       const pos = new Vector3(
//         xMap((X[i] += dr[0] * dt)),
//         yMap((Y[i] += dr[1] * dt)),
//         0,
//       )
//       sp.position.copyFrom(pos)
//       if (age[i]++ > MaxAge) {
//         // incriment age of each curve, restart if MaxAge is reached
//         // age[i] = randage()
//         ;(X[i] = X0[i]), (Y[i] = Y0[i])
//       }
//       i++
//     }
//     currTime = 0
//   }
// })
