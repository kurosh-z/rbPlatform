import React, { useLayoutEffect, useEffect, useRef, useCallback } from 'react'
import * as Babylon from 'babylonjs'
import { css as emoCSS } from '@emotion/core'
import shallow from 'zustand/shallow'
import { useTheme } from 'emotion-theming'
import { Theme } from '../../theme/types'
import { AnimationBar } from '../../components'
import { PopUpMenu, NavPanel } from '../../components'
import {PopUpMenuProps}  from '../../components/types'
import { useUiStore, useSCPopUPStore } from '../../appState'
import { Canvas } from './Canvas'
// import { CoursePage } from '../CoursePage'
import { useSpring, a, SpringStartFn } from '@react-spring/web'
import Latex  from '../../latex-spring/Latex'
import '../fonts.css'


const ExampleCourse: React.FC = () => {
  const canv = useRef<HTMLCanvasElement>(null)
  const courseRef = useRef<Canvas | null>(null)
  const theme = useTheme<Theme>()
  const setCoursePage = useUiStore(state => state.setIsCoursePage, shallow)
  const CompRef = useRef(new Circle({}))
  useLayoutEffect(() => {
    setCoursePage(true)
    if (canv.current) {
      courseRef.current = new Canvas({
        canvas: canv.current,
        palette: theme.palette,
        circle: CompRef.current,
      })
    }
  }, [])
  const content = emoCSS({
    marginTop: 80,
    width: '100vw',
    // height: 'calc(100vh - 80px)',
  })
  const mathbox = emoCSS({
    // position: 'relative',
    top: 0,
    width: '100vw',
    height: 'calc(100vh - 80px)',
    // background: theme.palette.red.base,
  })
  const setCallback = useCallback<PopUpMenuProps['setCallback']>(({setOpen}) => {
    setOpen(false)
    useSCPopUPStore.getState().onSetCancel.notifyObservers({state:'set'})
  }, [])
  const cancelCallback = useCallback<PopUpMenuProps['cancelCallback']>(({setOpen}) => {
    setOpen(false)
  }, [])
  return (
    <div className="coursepage">
      <NavPanel
        textColor_closed={theme.palette.aubergine.base}
        textColor_opened={theme.palette.white.base}
        background_color={'white'}
      />
      {/* <CoursePage /> */}
      <main className="content" css={content}>
        <div className="mathbox" css={mathbox}>
        <PopUpMenu
            setCallback={setCallback}
            cancelCallback={cancelCallback}
            
          />
          <canvas
            css={emoCSS`
          border: 1px solid ${theme.palette.yellow.dark};
          border-radius: ${theme.radii.md};
          margin-left: 2.5%;
          width: 95%;
          height: 100%;
        `}
            className="mathbox__canvas"
            ref={canv}
          />
          <AnimationBar />
          {/* <CompRef.current.Comp /> */}
          
        </div>
     
      </main>
    </div>
  )
}

export class Circle {
  Comp: React.FC
  setProps:
    | SpringStartFn<{
        transform: string
      }>
    | undefined
  _radius: number
  _pos: Babylon.Vector2
  constructor({
    radius = 30,
    pos = new Babylon.Vector2(300, -400),
  }: {
    radius?: number
    pos?: Babylon.Vector2
  }) {
    this._radius = radius
    this._pos = pos
    this.Comp = () => {
      const [springs, setSprings] = useSpring(() => ({
        transform: `translate(0px, 0px )`,
        immediate: true,
      }))
      useEffect(() => {
        this.setProps = setSprings
      }, [setSprings])

      return (
        <svg
        className={'mathbox__svg'}
        style={{
          position:'absolute',
          overflow:'visible',
          fill: 'black',
          marginTop: 10,
          left: 200,
          pointerEvents:'none',
          transform:'translate(0, 100px)'
      }}
      viewBox='0 0 1400 1400'
      >
        <Latex
          style={
            {overflow:'visible',}
          }
            svgHeight={0}
            svgWidth={0}
            font_size={1.6}
            className={'m_1stCol'}
            math_formula={String.raw`
    \anim<test>{
    \begin{matrix}
    a_{11}  \\
    a_{21}\\
    \vdots  \\ 
    a_{n1} 
    \end{matrix} 
    }`}
        >
          <Latex.Anim id='test' style={springs} />
        </Latex>
        <Latex
          style={
            {overflow:'visible',
             transform:'translate(50px,0px)'  
          }
          }
            svgHeight={0}
            svgWidth={0}
            font_size={1.6}
            className={'m_2ndCol'}
            math_formula={String.raw`
    \begin{matrix}
    a_{21}\\
    a_{22}  \\
    \vdots \\ 
    a_{n2} 
    \end{matrix} `}
        >
        </Latex>
       </svg>
      )
    }
  }
  set pos(pos: Babylon.Vector2) {
    this._pos = pos
    if (this.setProps) {
      this.setProps({ transform: `translate(${pos.x}px, ${pos.y}px)` })
    }
  }

}

export default ExampleCourse
