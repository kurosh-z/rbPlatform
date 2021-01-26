import { Vector3, Scene, Color3 } from 'babylonjs'
import { Line } from './Line'
import { hex2Color3 } from './utils'

export type GridArgs = {
  scene: Scene
  h_ticks: number[]
  v_ticks: number[]
  h_lenght?: number
  v_lenght?: number
  max_h_lenght?: number
  max_v_lenght?: number
  h_color?: Color3
  v_color?: Color3
}

export class Grids {
  scene: Scene
  private h_ticks: number[]
  private v_ticks: number[]
  private _h_lenght: number
  private _v_lenght: number
  private _max_h_lenght: number
  private _max_v_lenght: number
  private _h_color?: Color3
  private _v_color?: Color3
  private h_lines: Line[]
  private v_lines: Line[]
  h_margin = 0.5
  v_margin = 0.5

  constructor({ scene, h_ticks, v_ticks, ...rest }: GridArgs) {
    this.scene = scene
    this.h_ticks = h_ticks
    this.v_ticks = v_ticks
    const {
      h_lenght = 12.6,
      v_lenght = 6.6,
      max_h_lenght = (window.innerWidth / 1680) * 12.2 - this.h_margin,
      max_v_lenght = (window.innerHeight / 953) * 6.6 - this.v_margin,
      h_color = hex2Color3('#29292b'),
      v_color = hex2Color3('#6e6f70'),
    } = rest

    this._h_color = h_color
    this._v_color = v_color
    this._h_lenght = h_lenght
    this._v_lenght = v_lenght
    this._max_h_lenght = max_h_lenght
    this._max_v_lenght = max_v_lenght

    const { h_lines, v_lines } = this.createMeshes()
    this.h_lines = h_lines
    this.v_lines = v_lines
  }
  get h_length() {
    return this._h_lenght
  }
  get v_length() {
    return this._v_lenght
  }
  set h_length(length: number) {
    this._h_lenght = length
    let idx = 0
    for (let tick of this.v_ticks) {
      const p1 = new Vector3(
        -this._max_h_lenght / 2 + this.h_margin / 2,
        tick,
        0,
      )
      const p2 = new Vector3(
        -this._max_h_lenght / 2 + this.h_margin / 2 + this._h_lenght,
        tick,
        0,
      )
      this.h_lines[idx].updatePoints(p1, p2)
      idx++
    }
  }
  set v_length(length: number) {
    this._v_lenght = length
    let idx = 0
    for (let tick of this.h_ticks) {
      const p1 = new Vector3(tick, this._max_v_lenght / 2, 0.01)
      const p2 = new Vector3(
        tick,
        this._max_v_lenght / 2 - this._v_lenght,
        0.01,
      )
      this.v_lines[idx].updatePoints(p1, p2)
      idx++
    }
  }

  createMeshes() {
    const h_lines: Line[] = []
    for (let tick of this.v_ticks) {
      const p1 = new Vector3(-this._h_lenght / 2, tick, 0.01)
      const p2 = new Vector3(this._h_lenght / 2, tick, 0.01)
      h_lines.push(
        new Line({
          p1,
          p2,
          scene: this.scene,
          options: { color: this._h_color },
        }),
      )
    }
    // vetical lines
    const v_lines: Line[] = []
    for (let tick of this.h_ticks) {
      const p1 = new Vector3(tick, -this._v_lenght / 2, 0)
      const p2 = new Vector3(tick, this._v_lenght / 2, 0)
      v_lines.push(
        new Line({
          p1,
          p2,
          scene: this.scene,
          options: { color: this._v_color },
        }),
      )
    }

    return { h_lines, v_lines }
  }
  dispose() {
    for (const line of this.v_lines) {
      line.dispose()
    }
  }
  removeFromScene() {
    for (const line of this.v_lines) {
      line.removeFromScene()
    }
  }
  add2Scene() {
    for (const line of this.v_lines) {
      line.add2Scene()
    }
  }
}
