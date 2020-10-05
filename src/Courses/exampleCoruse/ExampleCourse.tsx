import React, { useLayoutEffect, useRef, useCallback } from 'react'
import { css as emoCSS } from '@emotion/core'
import shallow from 'zustand/shallow'
import { useTheme } from 'emotion-theming'
import { Theme } from '../../theme/types'
import { AnimationBar } from '../../components'
import { PopUpMenu, NavPanel } from '../../components'
import { useUiStore } from '../../appState'
import { Canvas } from './Canvas'
import { CoursePage } from '../CoursePage'

const ExampleCourse: React.FC = () => {
  const canv = useRef<HTMLCanvasElement>(null)
  const courseRef = useRef<Canvas | null>(null)
  const theme = useTheme<Theme>()
  const setCoursePage = useUiStore(state => state.setIsCoursePage, shallow)

  useLayoutEffect(() => {
    setCoursePage(true)
    if (canv.current) {
      courseRef.current = new Canvas({
        canvas: canv.current,
        palette: theme.palette,
      })
    }
  }, [])
  const content = emoCSS({
    marginTop: 80,
    width: '100vw',
    // height: 'calc(100vh - 80px)',
  })
  const mathbox = emoCSS({
    position: 'relative',
    top: 80,
    width: '100vw',
    height: 'calc(100vh - 80px)',
    // background: theme.palette.red.base,
  })
  const setCallback = useCallback(() => {}, [])
  const cancelCallback = useCallback(() => {}, [])
  return (
    <div className="coursepage">
      <NavPanel
        textColor_closed={theme.palette.aubergine.base}
        textColor_opened={theme.palette.white.base}
      />
      <CoursePage />
      <main className="content" css={content}>
        <div className="mathbox" css={mathbox}>
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
          <PopUpMenu
            setCallback={setCallback}
            cancelCallback={cancelCallback}
          />
        </div>
      </main>
    </div>
  )
}

export default ExampleCourse
