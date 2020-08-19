import React from 'react';
import { Observable, Scene } from 'babylonjs';

export class CanvasState {
  currentScene: Scene;
  isDebugLayerEnabled = false;
  onSceneRegistered = new Observable<{ scene: Scene }>();
  onSceneRegisterCallbacks: React.MutableRefObject<(arg?: any) => void>[] = [];
  constructor() {
    this.onSceneRegistered.add(({ scene }) => {
      this.currentScene = scene;
      const cbList = this.onSceneRegisterCallbacks;
      if (cbList.length) {
        for (const cb of cbList) {
          cb.current(scene);
        }
      }
    });
  }
  public showDebugLayer() {
    this.isDebugLayerEnabled = true;
    if (this.currentScene) {
      this.currentScene.debugLayer.show();
    }
  }
  public hideDebugLayer() {
    this.isDebugLayerEnabled = false;
    if (this.currentScene) {
      this.currentScene.debugLayer.hide();
    }
  }
}
