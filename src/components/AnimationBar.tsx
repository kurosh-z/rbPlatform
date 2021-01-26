import * as React from 'react'
import { useRef, useCallback, useState, useEffect, useMemo } from 'react'
import { Observer, Scene } from 'babylonjs'
import { useSpring, a } from '@react-spring/web'
import { sConfigs } from '../utils'
import { css as emoCSS } from '@emotion/core'
import { useTheme } from 'emotion-theming'
import { Theme } from '../theme/types'
import { brighten, alpha } from '../theme'
import { useAnimationStore, useCanvasStore } from '../appState'
import { AnimationState } from '../appState/types'

import shallow from 'zustand/shallow'
//@ts-ignore
import play_icon from '../assets/icons/icon_play.svg'
//@ts-ignore
import pause_icon from '../assets/icons/icon_pause.svg'

const selector = (state: AnimationState) => ({
  currentGroup: state.currentGroup,
  setCurrentGroup: state.setCurrentGroup,
  playing: state.playing,
  setPlaying: state.setPlaying,
  playRequested: state.playRequested,
  setPlayRequest: state.setPlayRequest,
  groupIndex: state.groupIndex,
})

type AnimBarProps={
  playCb?: ((event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void) | undefined
  pauseCb?: ((event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void) | undefined
}
export const AnimationBar: React.FC<AnimBarProps> = ({playCb, pauseCb}) => {
  const {
    currentGroup,
    setCurrentGroup,
    playing,
    setPlaying,
    playRequested,
    setPlayRequest,
    groupIndex,
  } = useAnimationStore(selector, shallow)
  const theme = useTheme<Theme>()
  const currentScene = useCanvasStore(state => state.currentScene)
  const [sliderPos, setSliderPos] = useState('0')

  const [sliderColor, setSliderColor] = useSpring(() => ({
    background: `linear-gradient(90deg,${theme.palette.green.base} 0%, ${alpha(
      theme.palette.gray.lightest,
      0.3,
    )} 0% 100%)`,
    config:sConfigs.stiff,
    // immediate: true,
  }))

  const [mouseDown, setMouseDown] = useState(false)
  const [hovered, setHover] = useState(false)
  const sliderSyncObserver = useRef<Observer<Scene> | null>(null)
  useEffect(() => {
    if (currentScene) {
      setCurrentGroup(currentScene.animationGroups[groupIndex])
    }
  }, [currentScene, groupIndex])

  const pauseCallback = useCallback((ev) => {
    if (!currentGroup) return
    if(pauseCb) pauseCb(ev)
    document.body.classList.remove('disable-scroll')
    currentGroup.pause()
    setPlaying(false)
  }, [currentGroup])

  const playCallback = useCallback((ev) => {
    window.scrollTo(0,10)
    if (!currentGroup) return
    if(playCb) playCb(ev)
    document.body.classList.add('disable-scroll')
    currentGroup.play()
    setPlaying(true)
  }, [currentGroup])

  useEffect(() => {
    const getCurrentPosition = () => {
      if (!currentGroup) {
        return 0
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
            return currentGroup.to
          }
          return currframe
        }
      }
      return 0
    }
    if (currentScene) {
      currentScene.onBeforeRenderObservable.remove(sliderSyncObserver.current)
      
      sliderSyncObserver.current = currentScene.onBeforeRenderObservable.add(
        () => {
          const currPos = getCurrentPosition()
          const totalFrames = currentGroup ? currentGroup.to : 100
          const posPrecentage = (currPos * 100) / totalFrames
          setSliderColor(() => ({
            background: `linear-gradient(90deg,${
              theme.palette.green.base
            } ${posPrecentage}%, ${alpha(
              theme.palette.gray.lightest,
              0.3,
            )} ${posPrecentage}% 100%)`,
            immediate: true,
          }))
          setSliderPos(() => currPos.toString())
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

  const animBar = useMemo(
    () =>
      emoCSS({
        position: 'absolute',
        bottom: 0,
        width: '95%',
        marginLeft: '2.5%',
        marginBottom: 0,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        color: 'white',
        minHeight: '30px',
        height: '46px',
        backgroundColor: alpha(theme.palette.white.base, 0.5),
        borderRadius: theme.radii.sm,
        zIndex: 100,

        '.animationBar__playBtn': {
          height: '70px',
          width: '70px',
          border: 'none',
          cursor: 'pointer',
          fill: theme.palette.orange.dark,
          background: 'transparent',
          '&:focus': {
            outline: 'none',
          },
        },
        '.animationBar__slider': {
          WebkitAppearance: 'none',
          cursor: 'pointer',
          width: 'calc(100% - 160px)',
          height: 5,
          maxWidth: 1200,
          outline: 'none',
          marginLeft: 20,
          marginRight: 10,
          // background: 'transparent',
          borderRadius: theme.radii.md,
        },
        // '.animationBar__slider::-webkit-slider-runnable-track': {
        //   height: 2,
        //   webkitAppearance: 'none',
        //   backgroundColor: 'yellow',
        // },
        // //mozila
        // '.animationBar__slider::-moz-rrangeprogress': {
        //   backgroundColor: 'yellow',
        //   height: 2,
        // },
        // '.animationBar__slider::-moz-range-thumb': {
        //   width: 20,
        //   height: 20,
        //   border: '2px solid white',
        //   borderRadius: '50%',
        //   background: theme.palette.aubergine.base,
        // },
        // '.animationBar__slider::-moz-range-track': {
        //   backgroundColor: 'yelllow',
        //   height: 2,
        // },
        '.animationBar__slider::-webkit-slider-runnable-track': {
          width: 500,
          border: 'none',
          borderRadius: 3,
          WebkitAppearance: 'none',
        },
        '.animationBar__slider::-webkit-slider-thumb': {
          opacity:0,
          display:'none',
          height: 18,
          width: 18,
          borderRadius: '510%',
          background: theme.palette.aubergine.base,
          border: `2px solid ${theme.palette.white.base}`,
          marginTop: -8,
          cursor: 'pointer',
          willChange: 'box-shadow background',
          transition: 'box-shadow .3s ease-in-out , background .3s ease-in-out',
        },
        
        '.animationBar__slider::-moz-range-thumb':{
          opacity:0
        }
        // '.clicked::-webkit-slider-thumb': {
        //   boxShadow: `0 0 0 12px ${alpha(theme.palette.white.base, 0.25)}`,
        //   background: brighten(theme.palette.aubergine.base, 0.9),
        //   transition:
        //     'box-shadow .25s ease-in-out , background .25s ease-in-out',
        // },
        // '.hovered::-webkit-slider-thumb': {
        //   boxShadow: `0 0 0 8px ${alpha(theme.palette.white.base, 0.2)}`,
        //   background: brighten(theme.palette.aubergine.base, 0.9),
        //   transition:
        //     'box-shadow .25s ease-in-out , background .25s ease-in-out',
        // },
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
          <div
            className="btn__icon"
            onClick={playCallback}
            style={{
              width: 70,
              height: 70,
              backgroundColor: theme.palette.aubergine.base,
              mask: `url(${play_icon}) no-repeat center / contain`,
              WebkitMask: `url(${play_icon}) no-repeat center / contain`,
            }}
          />
        )}
        {currentGroup && playing && (
          <div
            style={{
              width: 70,
              height: 70,
              backgroundColor: theme.palette.aubergine.base,
              mask: `url(${pause_icon}) no-repeat center / contain`,
              WebkitMask: `url(${pause_icon}) no-repeat center / contain`,
            }}
            onClick={pauseCallback}
          />
        )}
      </button>
      <a.input
        className={
          mouseDown
            ? `animationBar__slider clicked`
            : hovered
            ? 'animationBar__slider hovered'
            : 'animationBar__slider'
        }
        type="range"
        style={sliderColor}
        min={currentGroup ? currentGroup.from : 0}
        max={currentGroup ? currentGroup.to : 100}
        step="any"
        value={sliderPos}
        onChange={() => {}}
        onInput={evt => sliderInput(evt)}
        onMouseOver={() => {
          setHover(true)
        }}
        onMouseOut={() => {
          setHover(false)
        }}
        onMouseDown={() => setMouseDown(true)}
        onMouseUp={() => {
          if (playRequested && currentGroup) {
            currentGroup.play()
            setPlayRequest(false)
          }
          setMouseDown(false)
        }}
      />
    </div>
  )
}
