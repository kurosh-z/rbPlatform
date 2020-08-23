import { Vector3, Scene } from 'babylonjs';
import { Line } from './Line';

export type GridArgs = {
  scene: Scene;
  h_ticks: number[];
  v_ticks: number[];
  h_lenght?: number;
  v_lenght?: number;
  h_color?: string;
  v_color?: string;
};

export class Grids {
  scene: Scene;
  h_ticks: number[];
  v_ticks: number[];
  h_lenght: number;
  v_lenght: number;
  h_color?: string;
  v_color?: string;
  constructor({ scene, h_ticks, v_ticks, ...rest }: GridArgs) {
    this.scene = scene;
    this.h_ticks = h_ticks;
    this.v_ticks = v_ticks;
    const {
      h_lenght = 12.6,
      v_lenght = 6.5,
      h_color = '#29292b',
      v_color = '#6e6f70',
    } = rest;
    this.h_color = h_color;
    this.v_color = v_color;
    this.h_lenght = h_lenght;
    this.v_lenght = v_lenght;

    this.createMeshes();
  }
  createMeshes() {
    const horzLines: Line[] = [];
    for (let tick of this.v_ticks) {
      const p1 = new Vector3(-this.h_lenght / 2, tick, 0);
      const p2 = new Vector3(this.h_lenght / 2, tick, 0);
      horzLines.push(
        new Line({
          p1,
          p2,
          scene: this.scene,
          options: { color: this.h_color },
        })
      );
    }
    // vetical lines
    const verLines: Line[] = [];
    for (let tick of this.h_ticks) {
      const p1 = new Vector3(tick, -this.v_lenght / 2, 0);
      const p2 = new Vector3(tick, this.v_lenght / 2, 0);
      verLines.push(
        new Line({
          p1,
          p2,
          scene: this.scene,
          options: { color: this.v_color },
        })
      );
    }
  }
}
