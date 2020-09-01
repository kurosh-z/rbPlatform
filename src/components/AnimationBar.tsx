import * as React from 'react'
import { useRef, useCallback, useState, useEffect, useMemo } from 'react'
import { Observer, Scene } from 'babylonjs'
import { css as emoCSS } from '@emotion/core'
import { useTheme } from 'emotion-theming'
import { Theme } from '../theme/types'
import { useAnimationStore, useCanvasStore } from '../appState'
import shallow from 'zustand/shallow'
//@ts-ignore
import play_icon from '../assets/icons/icon_play.svg'
//@ts-ignore
import pause_icon from '../assets/icons/icon_pause.svg'

const selector = state => ({
  currentGroup: state.currentGroup,
  setCurrentGroup: state.setCurrentGroup,
  playing: state.playing,
  setPlaying: state.setPlaying,
  playRequest: state.playRequest,
  setPlayRequest: state.playRequest,
  groupIndex: state.groupIndex,
})
export const AnimationBar: React.FC = () => {
  const {
    currentGroup,
    setCurrentGroup,
    playing,
    setPlaying,
    playRequest,
    setPlayRequest,
    groupIndex,
  } = useAnimationStore(selector, shallow)
  const currentScene = useCanvasStore(state => state.currentScene)
  const [sliderPos, setSliderPos] = useState('0')
  const sliderSyncObserver = useRef<Observer<Scene> | null>(null)

  useEffect(() => {
    if (currentScene) {
      setCurrentGroup(currentScene.animationGroups[groupIndex])
    }
  }, [currentScene, groupIndex])

  const pauseCallback = useCallback(() => {
    if (!currentGroup) return
    currentGroup.pause()
    setPlaying(false)
  }, [currentGroup])

  const playCallback = useCallback(() => {
    if (!currentGroup) return
    currentGroup.play()
    setPlaying(true)
  }, [currentGroup])

  useEffect(() => {
    const getCurrentPosition = () => {
      if (!currentGroup) {
        return '0'
      }
      let targetedAnimations = currentGroup.targetedAnimations
      if (targetedAnimations.length > 0) {
        let runtimeAnimations =
          currentGroup.targetedAnimations[0].animation.runtimeAnimations
        if (runtimeAnimations.length > 0) {
          const currframe = runtimeAnimations[0].currentFrame
          //prevent animation to jum to the first frame at thte end!
          if (Math.abs(currframe - currentGroup.to) < 1) {
            setPlaying(false)
            currentGroup.pause()
            return currentGroup.to.toString()
          }
          return currframe.toString()
        }
      }
      return '0'
    }
    if (currentScene) {
      currentScene.onBeforeRenderObservable.remove(sliderSyncObserver.current)
      sliderSyncObserver.current = currentScene.onBeforeRenderObservable.add(
        () => {
          setSliderPos(() => getCurrentPosition())
        },
      )
    }
  }, [currentScene, currentGroup])

  const sliderInput = useCallback(
    (evt: React.FormEvent<HTMLInputElement>) => {
      if (!currentGroup) {
        return
      }

      let value = parseFloat((evt.target as HTMLInputElement).value)

      if (!currentGroup.isPlaying) {
        currentGroup.play()
        currentGroup.goToFrame(value)
        currentGroup.pause()
      } else {
        currentGroup.pause()
        currentGroup.goToFrame(value)
        // we don't wanna play until mouse is up again so we request play on mouseUp event!
        setPlayRequest(true)
      }
      setSliderPos(() => value.toString())
    },
    [currentGroup],
  )

  const theme = useTheme<Theme>()
  const animBar = useMemo(
    () =>
      emoCSS({
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        color: 'white',
        minHeight: '30px',
        height: '80px',
        backgroundColor: theme.palette.aubergine.base,
        width: '100%',
        gridRow: 2,
        '.animationBar__playBtn': {
          height: '70px',
          width: '70px',
          border: 'none',
          cursor: 'pointer',
          background: 'transparent',
        },
        '.animationBar__slider': {
          WebkitAppearance: 'none',
          cursor: 'pointer',
          width: 'calc(100% - 160px)',
          maxWidth: 1200,
          outline: 'none',
          marginLeft: 20,
          marginRight: 10,
          background: 'transparent',
        },
        '.animationBar__slider::-webkit-slider-runnable-track': {
          height: 2,
          webkitAppearance: 'none',
          backgroundColor: 'white',
        },
        //mozila
        '.animationBar__slider::-moz-rrangeprogress': {
          backgroundColor: 'white',
          height: 2,
        },
        '.animationBar__slider::-moz-range-thumb': {
          width: 20,
          height: 20,
          border: '2px solid white',
          borderRadius: '50%',
          background: theme.palette.aubergine.base,
        },
        '.animationBar__slider::-moz-range-track': {
          backgroundColor: 'white',
          height: 2,
        },
      }),
    [theme],
  )

  return (
    <div className="animationBar" css={animBar}>
      <button className="animationBar__playBtn">
        {!currentGroup && (
          <img
            src={play_icon}
            onClick={() => {
              console.log('empty')
            }}
          />
        )}
        {currentGroup && !playing && (
          <img src={play_icon} onClick={playCallback} />
        )}
        {currentGroup && playing && (
          <img src={pause_icon} onClick={pauseCallback} />
        )}
      </button>
      <input
        className="animationBar__slider"
        type="range"
        min={currentGroup ? currentGroup.from : 0}
        max={currentGroup ? currentGroup.to : 100}
        step="any"
        value={sliderPos}
        onChange={() => {}}
        onInput={evt => sliderInput(evt)}
        onMouseUp={() => {
          if (playRequest && currentGroup) {
            currentGroup.play()
            setPlayRequest(false)
          }
        }}
      />
    </div>
  )
}
