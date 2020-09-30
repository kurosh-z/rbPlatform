import create from 'zustand'
import { immer } from './zustandImmer'
import { Draft } from 'immer'

type UiPureState = Readonly<{
  nav: 'opened' | 'closed' | 'progress'
  navToggle: 'open' | 'close'
  isMobile: boolean
  isCoursePage: boolean
}>

type UiMiddlewares = {
  toggleNavPanel: () => void
  setNavFinished: () => void
  setNavProgress: () => void
  setIsMobile: (arg: boolean) => void
  setIsCoursePage: (arg: boolean) => void
}

export type UiState = UiPureState & UiMiddlewares
export const initUiState: UiPureState = {
  nav: 'closed',
  navToggle: 'close',
  isMobile: false,
  isCoursePage: false,
}
export const useUiStore = create(
  immer<Draft<UiState>>(set => ({
    ...initUiState,
    setIsCoursePage: isCoursePage => {
      set(state => {
        state.isCoursePage = isCoursePage
      })
    },
    setIsMobile: isMobile => {
      set(state => {
        state.isMobile = isMobile
      })
    },
    setNavProgress: () => {
      set(state => {
        state.nav = 'progress'
      })
    },
    setNavFinished: () => {
      set(state => {
        state.navToggle === 'open'
          ? state.nav === 'opened'
          : (state.nav = 'closed')
      })
    },
    toggleNavPanel: () => {
      set(state => {
        state.navToggle === 'open'
          ? (state.navToggle = 'close')
          : (state.navToggle = 'open')
      })
    },
  })),
)
