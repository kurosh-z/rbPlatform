import chorma from 'chroma-js';
import * as BABYLON from 'babylonjs';

export const rgba2Color4 = (color: number[]) => {
  return new BABYLON.Color4(
    ...chorma(`rgba(${color[0]},${color[1]},${color[2]},${color[3]})`).gl()
  );
};
export const rgba2Color3 = (color: number[]) => {
  return new BABYLON.Color3(
    ...chorma(`rgb(${color[0]},${color[1]},${color[2]})`).gl().slice(0, 3)
  );
};

export const hex2Color4 = (color: string) => {
  return new BABYLON.Color4(...chorma(color).gl());
};
export const hex2Color3 = (color: string) => {
  return new BABYLON.Color3(...chorma(color).gl().slice(0, 3));
};
