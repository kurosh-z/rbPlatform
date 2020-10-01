import React, { useState, useRef, useCallback } from 'react'
import { useTransition, a, SpringHandle } from '@react-spring/web'
// import { useScrollPosition } from '../utils'
import { useTheme } from 'emotion-theming'
import { Theme } from '../theme/types'
import { alpha } from '../theme'
import { css } from '@emotion/core'
import m01 from '../assets/faces/m01.jpeg'
import w01 from '../assets/faces/w01.jpeg'

const DATA = [
  {
    name: 'Laura Schöne',
    url: w01,
    text: 'the top resource I recommend for learning Robotics.',
  },
  {
    name: 'Ronald Lacroix',
    url: w01,
    text:
      ' I’ve started a new career path, and I’m now able to practice my analytics and machine learning skills on a daily basis.',
  },
  {
    name: '',
    url: m01,
    text:
      'I developed the confidence to apply for positions I might otherwise have skipped. This eventually resulted in getting a job at Amazon!',
  },
]

const TcardContainer: React.FC = ({ children }) => {
  const theme = useTheme<Theme>()
  const card = css({
    width: '70%',
    height: 300,
    margin: 'auto',
    position: 'inherit',
    overflow: 'hidden',
    // background: theme.palette.lime.light,
  })
  return (
    <div className="card_container" css={card}>
      {children}
    </div>
  )
}
// const ATcardContainer = a(TcardContainer)

const TCard: React.FC<{ index: number }> = ({ index }) => {
  const theme = useTheme<Theme>()
  // const transRef = useRef<SpringHandle>(null)
  const transitions = useTransition(DATA[index], {
    // ref: transRef,
    key: item => item.name,
    unique: true,
    // trail: 30,
    from: { opacity: 0, transform: 'translate3d(80%,0,0) scale(0.5)' },
    enter: { opacity: 1, transform: 'translate3d(0%,0,0) scale(1)' },
    leave: { opacity: 0, transform: 'translate3d(-80%,0,0) scale(0.5)' },
  })
  // const connRref = userRef<SpringHandle>(null)
  const cardWrapper = css({
    display: 'flex',
    position: 'absolute',
    flexDirection: 'row',
    height: 300,
    width: 800,
    justifyContent: 'center',
    alignItems: 'center',
    // background: theme.palette.orange.light,
    '.imgwrapper': {
      width: 130,
      height: 130,
      overflow: 'hidden',
      marginRight: '1rem',
      '.avatar': {
        maxWidth: '100%',
        height: 'auto',
        borderRadius: '4rem',
      },
    },

    '.textwrapper': {
      maxWidth: 400,
    },
    '.quotationmark': {},
    '.wrapper__text': {
      fontFamily: 'Roboto',
      fontSize: theme.typography.fontSizes[3],
      textJustify: 'auto',
    },
  })
  return (
    <TcardContainer>
      {transitions((style, items) => {
        return (
          <a.div css={cardWrapper} key={items.name} style={{ ...style }}>
            <figure className="imgwrapper">
              <img className="avatar" src={items.url} />
            </figure>
            <div className="textwrapper">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill={theme.palette.orange.dark}
                height="40"
                width="40"
                viewBox="0 -45 200 200"
                className="quotationmark"
              >
                <g>
                  <path d="M86.448 54.327L74.632 35.5c-16.194 7.322-28.078 18.199-35.584 32.494-5.699 10.808-8.548 28.171-8.548 52.158V164.5h51.708v-56.202H57.049c.556-15.619 3.128-27.474 7.784-35.632 4.587-8.089 11.815-14.225 21.615-18.339z"></path>
                  <path d="M147.816 72.736c4.656-8.158 11.884-14.295 21.684-18.409L157.685 35.5c-16.263 7.322-28.147 18.199-35.654 32.494-5.699 10.738-8.549 28.101-8.549 52.158V164.5h51.708v-56.202h-25.159c.557-15.55 3.129-27.404 7.785-35.562z"></path>
                </g>
              </svg>
              <span className="wrapper__text">{items.text}</span>
            </div>
          </a.div>
        )
      })}
    </TcardContainer>
  )
}

type ArrowProps = {
  arrow_type: 'left' | 'right'
  onClick?:
    | ((event: React.MouseEvent<SVGSVGElement, MouseEvent>) => void)
    | undefined
}

const Arrow: React.FC<ArrowProps> = ({ arrow_type, onClick }) => {
  const theme = useTheme<Theme>()
  const arrow = css({
    position: 'absolute',

    // background: theme.palette.violet.light,
    top: '50%',
    left: arrow_type === 'left' ? 120 : 'auto',
    right: arrow_type === 'right' ? 120 : 'auto',
    transform: 'translate(0, -50%)',
    '.arrowsvg': {
      margin: 'auto',
      transform: arrow_type === 'right' ? 'matrix(-1,0,0,1,0,0)' : '',
      strokeWidth: '1.4',
      stroke: theme.palette.orange.light,
      fill: theme.palette.orange.light,
      willChange: 'stroke, fill',
      transition: 'stroke .1s ease-out , fill .1s ease-out',
      cursor: 'pointer',
      ':hover': {
        stroke: alpha(theme.palette.orange.light, 0.5),
        fill: alpha(theme.palette.orange.light, 0.5),
        transition: 'stroke .1s ease-out , fill .1s ease-out',
      },
    },
  })
  return (
    <div className="arrow" css={arrow}>
      <svg
        className="arrowsvg"
        xmlns="http://www.w3.org/2000/svg"
        //   x="0px"
        //   y="0px"
        viewBox="0 0 21 41"
        //   enableBackground="new 0 0 21 41"
        width="22px"
        height="41"
        onClick={onClick}
      >
        <polygon points="20.3,40.8 0,20.5 20.3,0.2 21,0.9 1.3,20.5 21,40.1 "></polygon>
      </svg>
    </div>
  )
}

const Testemonials: React.FC = () => {
  const theme = useTheme<Theme>()
  const [idx, setIdx] = useState(0)

  const leftCb = useCallback(() => {
    setIdx((idx: number) => {
      console.log((idx - 1) % DATA.length)
      return (idx - 1) % DATA.length
    })
  }, [])
  const rightCb = useCallback(() => {
    setIdx((idx: number) => {
      console.log((idx + 1) % DATA.length)
      return (idx + 1) % DATA.length
    })
  }, [])

  const testemonials = css({
    display: 'block',
    position: 'relative',
    width: '100%',
    background: theme.palette.white.dark,
    height: 300,
  })
  return (
    <section className="testemonials__container" css={testemonials}>
      <Arrow arrow_type="left" onClick={leftCb} />
      <TCard index={idx} />
      <Arrow arrow_type="right" onClick={rightCb} />
    </section>
  )
}

export default Testemonials
