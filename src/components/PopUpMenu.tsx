import React, { useRef, useEffect, useMemo, memo } from 'react'
import { css as emoCSS } from '@emotion/core'
import { alpha } from '../theme'
import {
  useTransition,
  useSpring,
  config,
  a,
  SpringHandle,
} from '@react-spring/web'

import { useSCPopUPStore } from '../appState'
import shallow from 'zustand/shallow'

type PopupContainerProps = {
  transform: string
  background: string
  opacity: number
}

const PopupContainer: React.FC<PopupContainerProps> = ({
  transform,
  background,
  opacity,
  children,
}) => {
  const popup_css = useMemo(
    () =>
      emoCSS({
        userSelect: 'none',
        position: 'absolute',
        margin: 'auto',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        height: 80,
        width: 120,
        background: '#302f36',
        borderRadius: 5,
        transformOrigin: 'center center',
        cursor: 'pointer',
        boxShadow: '-2px 10px 10px -5px rgba(0, 0, 0, 0.1)',
        willChange: 'transfrom',
        '.popup__item': {
          textAlign: 'center',
          lineHeight: '30px',
          width: 100,
          height: 30,
          borderRadius: 3,
          background: alpha('white', 0.7),
          '&:focus': {
            outline: 'none',
          },
          transition: 'box-shadow .1s ease-in-out, font-weight .1s ease-in-out',
          '&:hover': {
            boxShadow: 'inset 0 -3em 3em rgba(255,255,255,0.5)',
            fontWeight: 'bold',
          },
        },
      }),
    [],
  )
  return (
    <div
      className="popup__container"
      css={popup_css}
      style={{
        opacity,
        background,
        transform,
        display: opacity > 0 ? 'flex' : 'none',
      }}
    >
      {children}
    </div>
  )
}

const Container = a(PopupContainer)

type PopUpMenuProps = {
  setCallback: () => void
  cancelCallback: () => void
}

const _PopUpMenu: React.FC<PopUpMenuProps> = ({
  setCallback,
  cancelCallback,
}) => {
  const { open, isEnabled } = useSCPopUPStore(
    state => ({ open: state.open, isEnabled: state.isEnabled }),
    shallow,
  )

  const springRef = useRef<
    SpringHandle<{
      opacity: number
      background: string
      transform: string
    }>
  >(null)
  const contSpring = useSpring({
    ref: springRef,
    config: config.stiff,
    transform: open ? 'scale(1.0)' : 'scale(0.4)',
    background: open ? alpha('#fc9e19', 0.9) : '#fc9e19',
    opacity: open ? 1 : 0,
  })

  const transRef = useRef<SpringHandle>(null)
  const transitions = useTransition(open ? ['set', 'cancel'] : [], {
    ref: transRef,
    keys: (item: any) => item,
    unique: true,
    trail: 40,
    from: { opacity: 0 as any, transform: 'scale(0)' },
    enter: { opacity: 1 as any, transform: 'scale(1)' },
    leave: { opacity: 0 as any, transform: 'scale(0)' },
  })

  useEffect(() => {
    ;(async () => {
      if (springRef.current && transRef.current && open) {
        await springRef.current.start()
        await transRef.current.start()
      } else if (springRef.current && transRef.current && !open) {
        await transRef.current.start()
        await springRef.current.start()
      }
    })()
  }, [open])

  return (
    <>
      {isEnabled && (
        <Container
          opacity={contSpring.opacity}
          transform={contSpring.transform}
          background={contSpring.background}
        >
          {transitions((styles, item) => {
            return (
              <a.span
                className="popup__item"
                role="button"
                tabIndex={item === 'set' ? 1 : 0}
                style={styles}
                onClick={item === 'set' ? setCallback : cancelCallback}
              >
                {item}
              </a.span>
            )
          })}
        </Container>
      )}
    </>
  )
}

export const PopUpMenu = memo(_PopUpMenu)
