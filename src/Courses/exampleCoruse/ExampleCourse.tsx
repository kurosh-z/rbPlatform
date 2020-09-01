import React, { useEffect, useRef, useCallback } from 'react'
import { css as emoCSS } from '@emotion/core'
import { useTheme } from 'emotion-theming'
import { Theme } from '../../theme/types'
import { AnimationBar } from '../../components'
import { PopUpMenu } from '../../components/PopUpMenu'
import { Canvas } from './Canvas'

export const ExampleCourse: React.FC = () => {
  const canv = useRef<HTMLCanvasElement>(null)
  const courseRef = useRef<Canvas | null>(null)
  const theme = useTheme<Theme>()

  useEffect(() => {
    if (canv.current) {
      courseRef.current = new Canvas({
        canvas: canv.current,
        palette: theme.palette,
      })
    }
  }, [])
  const mathbox = emoCSS({
    display: 'grid',
    gridTemplateRows: 'auto 80px',
    marginTop: 0,
    width: '100vw',
    height: 'calc(100vh - 80px)',
  })
  const setCallback = useCallback(() => {}, [])
  const cancelCallback = useCallback(() => {}, [])
  return (
    <div className="exmapleCourse">
      <header
        className="course__header"
        css={emoCSS({
          background: theme.palette.orange.base,
          width: '100vw',
          position: 'relative',
          top: '0px',
          height: '80px',
          color: 'white',
          backgroundColor: theme.palette.aubergine.base,
        })}
      >
        Learn Babylonjs
      </header>
      <div className="mathbox" css={mathbox}>
        <canvas
          css={emoCSS`
          width: 100%;
          height: 100%;
        `}
          className="mathbox__canvas"
          ref={canv}
        />
        <AnimationBar />
        <PopUpMenu setCallback={setCallback} cancelCallback={cancelCallback} />
      </div>
    </div>
  )
}
