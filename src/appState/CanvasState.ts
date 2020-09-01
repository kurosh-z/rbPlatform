import { Scene } from 'babylonjs'
import { immer } from './zustandImmer'
import create from 'zustand'

interface ICanvasPureStates {
  currentScene: Scene | null
  isDebugLayerEnabled: boolean
}
interface ICanvasMiddlewares {
  setCurrentScene: (scene: Scene) => void
  showDebugLayer: () => void
  hideDebugLayer: () => void
}

type ICanvasState = ICanvasPureStates & ICanvasMiddlewares

export const useCanvasStore = create<ICanvasState>(
  immer(set => ({
    currentScene: null,
    isDebugLayerEnabled: false,
    setCurrentScene: (scene: Scene) => {
      set(state => {
        state.currentScene = scene
      })
    },
    showDebugLayer: () => {
      set(state => {
        state.isDebugLayerEnabled = true
        if (state.currentScene) {
          state.currentScene.debugLayer.show()
        }
      })
    },
    hideDebugLayer: () => {
      set(state => {
        state.isDebugLayerEnabled = false
        if (state.currentScene) {
          state.currentScene.debugLayer.hide()
        }
      })
    },
  })),
)
