import React, { useState, useEffect, useCallback } from 'react'
import { a, useSprings } from '@react-spring/web'
// import { useScrollPosition } from '../utils'
import { useTheme } from 'emotion-theming'
import { Theme } from '../theme/types'
import { alpha } from '../theme'
import { css } from '@emotion/core'
// import { usePrevious } from '../utils'
import m01 from '../assets/faces/m01.jpeg'
import w01 from '../assets/faces/w01.jpeg'
import w02 from '../assets/faces/w02.jpeg'
import m02 from '../assets/faces/m02.jpeg'

var DATA = [
  {
    name: 'Laura Schöne',
    url: w01,
    text: 'the top resource I recommend for learning Robotics.',
  },
  {
    name: 'Ronald Lacroix',
    url: m01,
    text:
      ' I’ve started a new career path, and I’m now able to practice my analytics and machine learning skills on a daily basis.',
  },
  {
    name: '',
    url: m02,
    text:
      'I developed the confidence to apply for positions I might otherwise have skipped. This eventually resulted in getting a job at Amazon!',
  },
  {
    name: '',
    url: w02,
    text:
      'The skills I learned in the Machine Learning Course helped me land a Lead Data Science role before I even graduated',
  },
]

const TcardContainer: React.FC = ({ children }) => {
  const theme = useTheme<Theme>()
  const card = css({
    width: 300,
    height: 300,
    margin: 'auto',
    position: 'inherit',
    overflow: 'hidden',
    [theme.mediaQueries.sm]: {
      width: 490,
    },
    // background: theme.palette.lime.light,
  })
  return (
    <div className="card_container" css={card}>
      {children}
    </div>
  )
}
// const ATcardContainer = a(TcardContainer)
const CardContent: React.FC<{
  transform: string
  display: 'none' | 'flex'
  url: string
  text: string
}> = ({ transform, display, url, text }) => {
  const theme = useTheme<Theme>()
  const cardWrapper = css({
    // display: 'flex',
    position: 'absolute',
    flexDirection: 'row',
    height: 300,
    width: '100%',
    top: '35%',
    justifyContent: 'center',
    alignItems: 'center',
    // background: theme.palette.orange.light,
    '.imgwrapper': {
      minWidth: 80,
      minHeight: 80,
      maxWidth: 80,
      maxHeight: 80,
      overflow: 'hidden',
      marginRight: '1rem',
      '.avatar': {
        maxWidth: '100%',
        height: 'auto',
        borderRadius: '4rem',
      },
    },

    '.textwrapper': {
      maxWidth: 200,
    },
    '.quotationmark': {
      width: 25,
    },
    '.wrapper__text': {
      // fontFamily: 'Roboto',
      fontSize: theme.typography.fontSizes[1],
      // textAlign: 'justify',
      // display: 'block',
    },
    [theme.mediaQueries.sm]: {
      height: 300,
      '.textwrapper': {
        maxWidth: 400,
      },
      '.quotationmark': {
        width: 40,
      },
      '.wrapper__text': {
        fontSize: theme.typography.fontSizes[2],
      },
      '.imgwrapper': {
        minWidth: 100,
        minHeight: 100,
        overflow: 'hidden',
        marginRight: '1rem',
        '.avatar': {
          borderRadius: '4rem',
        },
      },
    },
  })
  return (
    <>
      {display === 'flex' && (
        <a.div css={cardWrapper} style={{ transform, display }}>
          <figure className="imgwrapper">
            <img className="avatar" src={url} />
          </figure>
          <div className="textwrapper">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill={theme.palette.orange.dark}
              viewBox="0 -45 200 200"
              className="quotationmark"
            >
              <g>
                <path d="M86.448 54.327L74.632 35.5c-16.194 7.322-28.078 18.199-35.584 32.494-5.699 10.808-8.548 28.171-8.548 52.158V164.5h51.708v-56.202H57.049c.556-15.619 3.128-27.474 7.784-35.632 4.587-8.089 11.815-14.225 21.615-18.339z"></path>
                <path d="M147.816 72.736c4.656-8.158 11.884-14.295 21.684-18.409L157.685 35.5c-16.263 7.322-28.147 18.199-35.654 32.494-5.699 10.738-8.549 28.101-8.549 52.158V164.5h51.708v-56.202h-25.159c.557-15.55 3.129-27.404 7.785-35.562z"></path>
              </g>
            </svg>
            <span className="wrapper__text">{text}</span>
          </div>
        </a.div>
      )}
    </>
  )
}
const AcardContent = a(CardContent)

const TCard: React.FC<{ index: number; direction: 'left' | 'right' }> = ({
  index,
  direction,
}) => {
  const [trProps, setProps] = useSprings<{
    transform: string
    display: 'flex' | 'none'
  }>(DATA.length, (i: number) => ({
    transform: `translate3d(${i * window.innerWidth}px,0,0)`,
    display: 'flex',
    // config: config.slow,
  }))
  // const connRref = userRef<SpringHandle>(null)

  // const prevIndex = usePrevious(index)
  useEffect(() => {
    setProps(i => {
      if (direction === 'left') {
        if (i === index) {
          // console.log('to middle', 'i:', i, 'index:', index)

          return {
            to: { display: 'flex', transform: `translate3d(${0}px, -50%,0)` },
            from: {
              display: 'flex',
              transform: `translate3d(${-window.innerWidth}px, -50%,0)`,
            },
          }
        }
        // || (index ===0 && prevIndex !===0 && index===DATA.length-1)
        if (i === index + 1 || (i === 0 && index === 0)) {
          // console.log('go left', 'i:', i, 'index:', index)
          return {
            to: {
              display: 'flex',
              transform: `translate3d(${window.innerWidth}px, -50%,0)`,
            },
            from: {
              display: 'flex',
              transform: `translate3d(${0}px, -50%,0)`,
            },
          }
        } else {
          return { display: 'none' }
        }
      }
      if (direction === 'right') {
        if (i === index) {
          // console.log('to middle', 'i:', i, 'index:', index)

          return {
            to: { display: 'flex', transform: `translate3d(${0}px, -50%,0)` },
            from: {
              display: 'flex',
              transform: `translate3d(${window.innerWidth}px, -50%,0)`,
            },
          }
        }
        // || (index ===0 && prevIndex !===0 && index===DATA.length-1)
        if (i === index - 1 || (i === DATA.length - 1 && index === 0)) {
          // console.log('go left', 'i:', i, 'index:', index)
          return {
            to: {
              display: 'flex',
              transform: `translate3d(${-window.innerWidth}px, -50%,0)`,
            },
            from: {
              display: 'flex',
              transform: `translate3d(${0}px, -50%,0)`,
            },
          }
        } else {
          return { display: 'none' }
        }
      } else {
        return { display: 'none' }
      }
    })
  }, [index, direction])
  return (
    <TcardContainer>
      {trProps.map(({ transform, display }, i) => {
        const url = DATA[i].url
        const text = DATA[i].text

        return (
          <AcardContent
            key={i}
            url={url}
            text={text}
            display={display}
            transform={transform}
          />
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
    top: '60%',
    left: arrow_type === 'left' ? 10 : 'auto',
    right: arrow_type === 'right' ? 10 : 'auto',
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
      width: 20,
      height: 30,

      ':hover': {
        stroke: alpha(theme.palette.orange.light, 0.5),
        fill: alpha(theme.palette.orange.light, 0.5),
        transition: 'stroke .1s ease-out , fill .1s ease-out',
      },
    },
    [theme.mediaQueries.sm]: {
      left: arrow_type === 'left' ? 30 : 'auto',
      right: arrow_type === 'right' ? 30 : 'auto',
      '.arrowsvg': {
        width: 22,
        height: 41,
      },
    },
    [theme.mediaQueries.md]: {
      left: arrow_type === 'left' ? 110 : 'auto',
      right: arrow_type === 'right' ? 110 : 'auto',
    },
    [theme.mediaQueries.lg]: {
      left: arrow_type === 'left' ? 200 : 'auto',
      right: arrow_type === 'right' ? 200 : 'auto',
    },
    [theme.mediaQueries.xl]: {
      left: arrow_type === 'left' ? 'calc(50% - 400px)' : 'auto',
      right: arrow_type === 'right' ? 'calc(50% - 400px)' : 'auto',
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
        // width="22px"
        // height="41"
        onClick={onClick}
      >
        <polygon points="20.3,40.8 0,20.5 20.3,0.2 21,0.9 1.3,20.5 21,40.1 "></polygon>
      </svg>
    </div>
  )
}

const Testemonials: React.FC = () => {
  const theme = useTheme<Theme>()
  const testemonials = css({
    display: 'block',
    marginTop: 200,
    position: 'relative',
    width: '100%',
    background: theme.palette.white.dark,
    height: 400,
    '.title': {
      paddingTop: 65,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      fontSize: theme.typography.fontSizes[4],
      fontWeight: theme.typography.fontWeights.medium,
    },
    '.title__upper, .title__lower': {
      display: 'block',
    },
    '.success': {
      display: 'block',
      fontSize: theme.typography.fontSizes[0],
      fontWeight: theme.typography.fontWeights.light,
      textTransform: 'uppercase',
    },
    '.svg-icon': {
      position: 'absolute',
      transfom: 'translateX(-50%)',
      left: 'calc(50% - 30px)',
      top: '0px',
      fill: theme.palette.orange.light,
    },
  })
  const [cState, setCstate] = useState<{ idx: number; dir: 'left' | 'right' }>({
    idx: 0,
    dir: 'left',
  })

  const leftCb = useCallback(() => {
    setCstate(({ idx }) => {
      let ret = (idx - 1) % DATA.length
      while (ret < 0) {
        ret += DATA.length
      }
      return { idx: ret, dir: 'left' }
    })
  }, [])
  const rightCb = useCallback(() => {
    setCstate(({ idx }) => {
      return { idx: (idx + 1) % DATA.length, dir: 'right' }
    })
  }, [])

  return (
    <>
      <section className="testemonials__container" css={testemonials}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="svg-icon"
          viewBox="0 0 20 20"
          width="62"
        >
          <path d="M13.962,8.885l-3.736,3.739c-0.086,0.086-0.201,0.13-0.314,0.13S9.686,12.71,9.6,12.624l-3.562-3.56C5.863,8.892,5.863,8.611,6.036,8.438c0.175-0.173,0.454-0.173,0.626,0l3.25,3.247l3.426-3.424c0.173-0.172,0.451-0.172,0.624,0C14.137,8.434,14.137,8.712,13.962,8.885 M18.406,10c0,4.644-3.763,8.406-8.406,8.406S1.594,14.644,1.594,10S5.356,1.594,10,1.594S18.406,5.356,18.406,10 M17.521,10c0-4.148-3.373-7.521-7.521-7.521c-4.148,0-7.521,3.374-7.521,7.521c0,4.147,3.374,7.521,7.521,7.521C14.148,17.521,17.521,14.147,17.521,10"></path>
        </svg>
        <div className="title">
          <span className="success">student success </span>
          <span className="title__upper">What our students</span>
          <span className="title__lower">have to say</span>
        </div>
        <Arrow arrow_type="left" onClick={leftCb} />
        <TCard index={cState.idx} direction={cState.dir} />
        <Arrow arrow_type="right" onClick={rightCb} />
      </section>
      <div
        style={{
          height: 200,
          width: '100%',
          background: theme.palette.gray.lightest,
        }}
      />
    </>
  )
}

export default Testemonials
