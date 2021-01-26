import create from 'zustand'
import { immer } from './zustandImmer'
import { Vector3, Observable } from 'babylonjs'

type AttachedOBj<T extends object = {}> = {
  [key: string]: T
}
type AttachedObjects<T extends AttachedOBj = {}> = {
  [key: string]: T
}

interface SCPopupMenuPureState {
  open: boolean
  isEnabled: boolean
  pos: number[]
  canvPos: Vector3
  attached: AttachedObjects
  onSetCancel: Observable<{ state: 'set' | 'cancel' }>
}

interface SCPopupMenuMiddlewares {
  setOpen: (open: boolean) => void
  setEnable: (enabled: boolean) => void
  setPos: (pos: number[]) => void
  setCanvPos: (pos: Vector3) => void
  attach: (label: string, obj: object) => void
  detach: (label: string) => void
}
type SCPopUpMenuState = SCPopupMenuPureState & SCPopupMenuMiddlewares

const intialState: SCPopupMenuPureState = {
  open: false,
  isEnabled: false,
  pos: [0, 0],
  canvPos: Vector3.Zero(),
  attached: {},
  onSetCancel: new Observable(),
}

export const useSCPopUPStore = create<SCPopUpMenuState>(
  immer(set => ({
    ...intialState,
    setOpen: open => {
      set(state => {
        state.open = open
      })
    },
    setEnable: enabled => {
      set(state => {
        state.isEnabled = enabled
      })
    },
    setPos: pos => {
      set(state => {
        state.pos = pos
      })
    },
    setCanvPos: pos => {
      set(state => {
        state.canvPos = pos
      })
    },
    attach: (label, obj) => {
      set(state => {
        const attached = state.attached
        attached[label] = obj
        state.attached = attached
      })
    },
    detach: label => {
      set(state => {
        const attached = state.attached
        delete attached[label]
        state.attached = attached
      })
    },
  })),
)
