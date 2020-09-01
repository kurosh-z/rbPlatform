import create from 'zustand'
import { immer } from './zustandImmer'

interface SCPopupMenuPureState {
  open: boolean
  isEnabled: boolean
}

interface SCPopupMenuMiddlewares {
  setOpen: (open: boolean) => void
  setEnable: (enabled: boolean) => void
}
type SCPopUpMenuState = SCPopupMenuPureState & SCPopupMenuMiddlewares

const intialState: SCPopupMenuPureState = {
  open: false,
  isEnabled: false,
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
  })),
)
