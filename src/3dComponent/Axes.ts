import { Scene, Vector3 } from 'babylonjs'
import { Arrow, ArrowConfigs } from './Arrow'
import { hex2Color3 } from './utils'
import { ScaleLinear } from 'd3-scale'

const AXES_DIR = (type: 'x' | 'y' | 'z', cScale: (arg: number) => number) => {
  if (type === 'x') return new Vector3(cScale(1), 0, 0)
  if (type === 'y') return new Vector3(0, cScale(1), 0)
  if (type === 'z') return new Vector3(0, 0, cScale(1))
  else throw new Error('type should be one of x , y or z')
}
const AXIS_COLORS = {
  x: hex2Color3('#f5422f'),
  y: hex2Color3('#1cad1a'),
  z: hex2Color3('#1667e0'),
}
type AxesConfig = Omit<ArrowConfigs, 'pointForSmallVectors'> & {
  size?: number
  showTicks?: boolean
  showAxes?: boolean
  numTicks?: number
}

export class Axes extends Arrow {
  type: 'x' | 'y' | 'z'
  xTicks?: number[]
  yTicks?: number[]
  zTiccks?: number[]
  showTicks: boolean
  showAxes: boolean
  cScale: ScaleLinear<number, number>
  numTicks: number
  constructor({
    type,
    scene,
    cScale,
    config = {} as AxesConfig,
  }: {
    type: 'x' | 'y' | 'z'
    scene: Scene
    config?: AxesConfig
    cScale: ScaleLinear<number, number>
  }) {
    const {
      size = 6,
      color = AXIS_COLORS[type],
      alpha = 1,
      showAxes = true,
      showTicks = false,
      numTicks = 10,
    } = config
    const vector = AXES_DIR(type, cScale).scale(size)
    super({
      scene,
      vector,
      config: { pointForSmallVectors: false, color, alpha },
    })
    this.type = type
    this.cScale = cScale
    this.numTicks = numTicks
    this.showAxes = showAxes
    this.showTicks = showTicks
  }
  drawTicks() {
    if (this.showTicks && this.showAxes) {
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
    }
  }
}
