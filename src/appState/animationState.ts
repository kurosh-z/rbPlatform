import { AnimationGroup } from 'babylonjs'
import create from 'zustand'

import { immer } from './zustandImmer'

interface AnimationPureState {
  currentGroup: AnimationGroup | null
  groupIndex: number
  playing: boolean
  playRequest: boolean
}
interface AnimationMiddlewares {
  setCurrentGroup: (group: AnimationPureState['currentGroup']) => void
  setGroupIndex: (groupIndex: AnimationPureState['groupIndex']) => void
  setPlaying: (play: boolean) => void
  setPlayRequest: (request: boolean) => void
}
type AnimationState = AnimationPureState & AnimationMiddlewares

const initialAnimationState: AnimationPureState = {
  playing: false,
  playRequest: false,
  currentGroup: null,
  groupIndex: 0,
}

export const useAnimationStore = create(
  immer<AnimationState>(set => ({
    ...initialAnimationState,
    setCurrentGroup: group => {
      set(state => {
        state.currentGroup = group
      })
    },
    setGroupIndex: index => {
      set(state => {
        state.groupIndex = index
      })
    },
    setPlayRequest: request => {
      set(state => {
        state.playRequest = request
      })
    },
    setPlaying: play => {
      set(state => {
        state.playing = play
      })
    },
  })),
)
