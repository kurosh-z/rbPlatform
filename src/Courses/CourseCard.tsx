import React, { useState } from 'react'
// import pendulum from '../assets/courseThumbs/pendulum.jpeg'
import { css } from '@emotion/core'
import { useTheme } from 'emotion-theming'
import { Theme } from '../theme/types'
import { a, useSpring, useSprings } from '@react-spring/web'
import { GotoBtn } from '../components'

type CoruseCardPros = {
  src: string
  title: string
  zooming?: number
  description: string[]
}

export const CourseCard: React.FC<CoruseCardPros> = ({
  src,
  title,
  description,
}) => {
  const theme = useTheme<Theme>()
  const shaddows = theme.createshadows(theme.palette.gray.dark)
  const coursecard = css({
    // gridColumn: 'span 1',
    cursor: 'pointer',
    overflow: 'hidden',
    boxShadow: shaddows['md'],

    borderRadius: `${theme.radii.md} ${theme.radii.md} ${theme.radii.lg} ${theme.radii.md}`,
    width: 350,
    height: 430,
    '.card__content': {
      width: '100%',
      height: '100%',
      position: 'relative',
    },
    '.card__front': {
      position: 'absolute',
      borderRadius: `${theme.radii.md} ${theme.radii.md} ${theme.radii.lg} ${theme.radii.md}`,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      height: '100%',
      width: '100%',
      // overflow: 'hidden',
      background: theme.palette.white.lightest,
      alignItems: 'center',
      '.imgwrapper': {
        width: '90%',
        height: 350,
        overflow: 'hidden',
        background: `url(${src})`,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
      },
      '.card__media': {
        width: '100%',
        maxHeight: '100%',
        display: 'block',
        marginTop: 5,
        marginLeft: 'auto',
        marginRight: 'auto',
      },
      '.card__textwrapper': {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        width: '90%',
        height: 80,
        marginBottom: 10,
        // background: theme.palette.blue.light,
        color: theme.palette.gray.dark,
      },
      '.card__text': {
        // fontFamily: 'Rosario',
        display: 'block',
        textAlign: 'center',
        // marginTop: 12,
        fontSize: theme.typography.fontSizes[2],
        fontWeight: theme.typography.fontWeights.bold,
        willChange: 'font-size',
        transition: 'transform .4s ease-in-out',
        // lineHeight: '80px',
        height: '2rem',
        width: '100%',
      },
      '&:hover': {
        '.card__text': {
          // fontSize: theme.typography.fontSizes[1],
          transform: 'scale(.9)',
          transition: 'transform .4s ease-in-out',
        },
      },
    },
    '.card__details': {
      display: 'flex',
      flexDirection: 'column',
      position: 'absolute',
      height: '100%',
      width: '100%',
      background: theme.palette.aubergine.base,
    },
    '.details__list': {
      height: '100%',
      width: '100%',
      position: 'relative',
      top: 30,
      left: 20,
      display: 'flex',
      flexDirection: 'column',
      // alignItems: 'center',
      justifyContent: 'left',
      color: theme.palette.white.base,
      listStyle: '',
    },
    '.list__item': {
      fontSize: '1.1rem',
      lineHeight: '2rem',
      listStyle: 'inside',
      width: '90%',
    },
    '.details__btn': {
      alignSelf: 'flex-end',
    },
  })
  // const [hover, setHover] = useState(false)
  const [spring, setSpring] = useSpring(() => ({
    transform: 'scale(1.0)',
  }))
  const [dSprings, setdSprings] = useSpring(() => ({
    opacity: 0 as any,
  }))
  const [springs, setSprings] = useSprings(description.length, () => ({
    mleft: 0,
    opacity: 0,
  }))
  const [clicked, setClicked] = useState(false)

  return (
    <>
      <a.div
        className="coursecard"
        css={coursecard}
        style={spring}
        onMouseOver={() => {
          setSpring({ transform: 'scale(1.1)' })
        }}
        onMouseLeave={() => {
          setdSprings({ opacity: 0, delay: 100 })
          setSpring({ transform: 'scale(1)' })
        }}
        onClick={() => {
          setdSprings({ opacity: 1 })
          if (!clicked) {
            setSprings(i => ({
              delay: i * 100,
              from: { mleft: -300 },
              to: { mleft: 0, opacity: 1 },
            }))
            setClicked(true)
          }
        }}
      >
        <a.div className="card__content">
          <div className="card__front">
            <a.div className="imgwrapper" />
            <div className="card__textwrapper">
              <span className="card__text">{title}</span>
            </div>
          </div>
          <a.div className="card__details" style={dSprings}>
            <a.ul className="details__list">
              {springs.map(({ mleft, opacity }, i) => {
                return (
                  <ALi
                    key={i}
                    marginLeft={mleft}
                    opacity={opacity}
                    text={description[i]}
                  />
                )
              })}
            </a.ul>
            <GotoBtn btn_text={'goto Course'} className="details__btn" />
          </a.div>
        </a.div>
      </a.div>
    </>
  )
}

const LI: React.FC<{ text: string; marginLeft: number; opacity: number }> = ({
  text,
  marginLeft,
  opacity,
}) => {
  return (
    <li
      className="list__item"
      style={{ marginLeft: marginLeft + 'px', opacity }}
    >
      <span> {text} </span>
    </li>
  )
}

const ALi = a(LI)
