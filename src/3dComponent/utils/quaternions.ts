import { Vector3, Quaternion } from 'babylonjs';
import { J, K } from './constants';

export const rotationQuaternionJToV2 = (v2: Vector3) => {
  const _v2 = v2.clone().normalize();
  let angle = 0;
  let axes = Vector3.Cross(J, _v2);
  if (axes.cross(J).length() < 0.001) {
    const dot = Vector3.Dot(J, _v2);
    angle = dot > 0 ? 0 : Math.PI;
    axes = K;
  } else {
    const dot = Vector3.Dot(J, _v2);
    angle = -Math.abs(dot) >= 0.001 ? Math.acos(dot) : Math.acos(dot);
  }
  const quat = Quaternion.RotationAxis(axes, angle);

  return quat;
};
