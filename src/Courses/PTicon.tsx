import React, { useMemo, useState, useEffect } from 'react'
import { useSpring, a, useTransition } from '@react-spring/web'
import { sConfigs } from '../utils'
import { useTheme } from 'emotion-theming'
import { css } from '@emotion/core'
import { Theme } from '../theme/types'
import { alpha } from '../theme'
import { PATH_TH, PATH_PR } from './PTLogo'

type PTiconProps = React.HTMLAttributes<HTMLDivElement> & {
  type: 'project' | 'theory'
  href: string
}
const PTicon: React.FC<PTiconProps> = ({
  type,
  href,
  className,
  onMouseOver,
  onMouseLeave,
  ...rest
}) => {
  const theme = useTheme<Theme>()
  const ptIcon = useMemo(
    () =>
      css({
        position: 'fixed',
        // display: 'flex',
        left: 45,
        top: 80,
        // width: 270,
        height: 54,
        cursor: 'pointer',
        // transform: 'rotate(90deg)',
        '&:hover .btn__icon': {
          stroke: alpha(theme.palette.orange.dark, 1),
          transition: 'stroke 0.2s ease-in-out',
        },
        zIndex: 10000,
        '.btn__link': {
          width: '100%',
          height: '100%',
        },
        '.btn__text': {
          fill: theme.palette.orange.dark,
        },
        '.btn__icon': {
          // marginLeft: -20,
          position: 'absolute',
          transform: 'translate(0px,0px) scale(.8)',
          stroke: alpha(theme.palette.orange.dark, 0.7),
          transition: 'stroke 0.2s ease-in-out transform 0.2s ease-in-out',
          willChange: 'stroke, transform, opacity',
        },
        '.icon__circle': {
          transform: 'translate(25px,25px)',
        },
        '.arrow__head': {
          transform: 'translate(35px,25px)',
        },
        '.arrow__shaft': {
          transform: 'translate(15px,25px)',
          willChange: 'transform, opacity',
        },
      }),
    [theme],
  )
  const [hovered, setHover] = useState(false)
  const [arrowSpring, setArrowSpring] = useSpring<{
    opacity: any // a workearound for bug in useSpring type
    transform: string
  }>(() => ({
    opacity: 1,
    transform: 'translate(0px,0px)',
    config: sConfigs.slow,
  }))

  useEffect(() => {
    setArrowSpring({
      from: {
        opacity: hovered ? 0 : 1,
        transform: hovered ? 'translate(-20px,0px)' : 'translate(0px,0px)',
      },
      to: { opacity: 1, transform: 'translate(0px,0px)' },
      loop: hovered,
    })
  }, [hovered])

  const transition = useTransition(type === 'project' ? PATH_PR : PATH_TH, {
    // keys: item => PATH.findIndex(item),
    unique: true,
    trail: 40,
    from: { opacity: 0 as any },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
  })

  const iconTrans = useTransition(
    type === 'project' ? ['svg_icon-project'] : ['svg_icon-thoery'],
    {
      unique: true,
      trail: 40,
      config: sConfigs.molasses,
      from: {
        opacity: 0 as any,
        transform:
          type === 'project'
            ? 'translate(-5px,0px) scale(.8)'
            : 'translate(-25px,0px) scale(.8)',
      },
      enter: {
        delay: 500,
        opacity: 1,
        transform:
          type === 'project'
            ? 'translate(0px,0px) scale(.8)'
            : 'translate(-20px,0px) scale(.8)',
      },
      leave: {
        config: sConfigs.FASTER,
        opacity: 0,
        transform:
          type === 'project'
            ? 'translate(0px,0px) scale(.8)'
            : 'translate(0px,0px) scale(.8)',
      },
    },
  )

  return (
    <div
      className={'btn__wrapper ' + className}
      css={ptIcon}
      onMouseOver={event => {
        setHover(true)
        if (onMouseOver) onMouseOver(event)
      }}
      onMouseLeave={event => {
        setHover(false)
        if (onMouseLeave) onMouseLeave(event)
      }}
      {...rest}
    >
      <a className="btn__link" href={href}>
        <svg
          className="btn__text"
          viewBox="-38 -20 440 110"
          xmlns="http://www.w3.org/2000/svg"
          height="50"
          width="180"
          fillRule="evenodd"
        >
          {transition((style, item, _, idx) => (
            <a.g className="pticon" style={style} key={idx}>
              <g className="lettergroup" key={idx}>
                <path className={'svg_letter'} d={item} />
              </g>
            </a.g>
          ))}
        </svg>

        {iconTrans((style, item, _, idx) => (
          <a.svg
            // width="40"
            key={idx}
            height="54"
            viewBox="0 0 50 50"
            className="btn__icon"
            style={style}
          >
            <g>
              <circle
                cx="0"
                cy="0"
                r="22"
                fill="transparent"
                strokeWidth="3"
                className="icon__circle"
              />
            </g>
            <a.g className="icon__arrow" style={arrowSpring}>
              <path
                fill="none"
                strokeWidth="3"
                strokeLinecap="round"
                className="arrow__shaft"
                d="M 0 0 L 20 0 Z"
              />

              <path
                fill="none"
                strokeWidth="3"
                strokeLinecap="round"
                className="arrow__head"
                d="M 0 0 L -9 8 M 0 0 L -9 -8 Z"
              />
            </a.g>
          </a.svg>
        ))}
      </a>
    </div>
  )
}

export default PTicon
