import React, { useState, useRef, useEffect } from 'react'
// import pendulum from '../assets/courseThumbs/pendulum.jpeg'
import { css } from '@emotion/core'
import { useTheme } from 'emotion-theming'
import { Theme } from '../theme/types'
import { a, useSpring } from '@react-spring/web'
import { GotoBtn } from '../components'

type CoruseCardPros = {
  src: string
  title: string
  zooming?: number
}
export const CourseCard: React.FC<CoruseCardPros> = ({ src, title }) => {
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
      '.circle': {
        position: 'absolute',
        bottom: -15,
        right: -15,
      },
      '.circlepath': {
        strokeDasharray: 128,
        strokeDashoffset: 128,
        stroke: theme.palette.orange.light,
      },
      '&:hover': {
        '.card__text': {
          // fontSize: theme.typography.fontSizes[1],
          transform: 'scale(.9)',
          transition: 'transform .4s ease-in-out',
        },
        '.circlepath': {
          transition:
            'stroke-dashoffset .8s cubic-bezier(0.56, 0.00, 1.00, 0.90)',
          strokeDashoffset: 0,
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
      fontSize: theme.typography.fontSizes[2],
      lineHeight: '2rem',
      listStyle: 'inside',
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
    opacity: 0,
  }))
  const circleRef = useRef<SVGCircleElement | null>(null)
  // useEffect(() => {
  //   if (circleRef.current) {
  //     console.log(circleRef.current.getTotalLength())
  //   }
  // }, [])
  // })
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
        }}
      >
        <a.div className="card__content">
          <div className="card__front">
            <a.div className="imgwrapper" />
            <div className="card__textwrapper">
              <span className="card__text">{title}</span>
            </div>
            <svg width="40" height="40" viewBox="0 0 45 45" className="circle">
              <circle
                className="circlepath"
                ref={circleRef}
                r="20"
                cx="22"
                cy="22"
                strokeWidth="3"
                fill="transparent"
              ></circle>
            </svg>
          </div>
          <a.div className="card__details" style={dSprings}>
            <a.ul className="details__list">
              <a.li className="list__item">Kinematics</a.li>
              <a.li className="list__item">Inverse Kinematics</a.li>
              <a.li className="list__item">Differential Kinematics</a.li>
              <a.li className="list__item">Trajectory Planning</a.li>
              <a.li className="list__item">Motion Control</a.li>
            </a.ul>
            <GotoBtn label={'goto Course'} className="details__btn" />
          </a.div>
        </a.div>
      </a.div>
    </>
  )
}
