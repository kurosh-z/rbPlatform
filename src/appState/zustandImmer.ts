import { StateCreator } from 'zustand'
import { produce } from 'immer'

export const immer = <T>(
  config: StateCreator<T, (fn: (state: T) => void) => void>,
): StateCreator<T> => (set, get, api) =>
  config((fn) => set(produce(fn) as (state: T) => T), get, api)
