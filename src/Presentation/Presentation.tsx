import React, { useState, useEffect } from 'react'
import { css } from '@emotion/core'
import { useTheme } from 'emotion-theming'
import { Theme } from '../theme/types'
import { alpha } from '../theme'
import { useSpring, a } from '@react-spring/web'
import { sConfigs } from '../utils'
import value_icon from '../assets/presentation/value.png'
import partner_icon from '../assets/presentation/partner.png'
import activity_icon from '../assets/presentation/activities.png'
import revenue_icon from '../assets/presentation/revenue.png'

const computeWindowScale = function (
  config = { maxScale: 3, minScale: 0, width: 1024, height: 768 },
) {
  var hScale = window.innerHeight / config.height,
    wScale = window.innerWidth / config.width,
    scale = hScale > wScale ? wScale : hScale

  if (config.maxScale && scale > config.maxScale) {
    scale = config.maxScale
  }

  if (config.minScale && scale < config.minScale) {
    scale = config.minScale
  }

  return scale
}

const S01: React.FC = () => {
  const theme = useTheme<Theme>()
  const s01 = css({
    width: 800,
    height: 600,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignContent: 'center',
    p: { marginLeft: 30 },
    b: {
      fontWeight: 'bold',
    },
  })

  return (
    <div css={s01}>
      <p>
        Aren’t you just <b>bored</b> with all those slide-based university
        lectures?
      </p>
    </div>
  )
}
const S02: React.FC = () => {
  const theme = useTheme<Theme>()
  const s02 = css({
    width: 800,
    height: 400,

    p: { marginLeft: 30, marginTop: 200 },
    b: {
      fontWeight: 'bold',
    },
  })

  return (
    <div css={s02}>
      <p>
        Would you like to <strong>learn</strong> with{' '}
        <strong>stunning visualizations</strong> and get an
        <strong> intuitive </strong> feeling for complex subjects?
      </p>
    </div>
  )
}

const S03: React.FC = () => {
  const theme = useTheme<Theme>()

  const s03 = css({
    h1: {
      transform: 'translateZ(50px)',
      fontSize: '100px',
    },
    '.try': {
      fontSize: '50px',
      position: 'absolute',
      top: '-0.5em',
      left: '1.5em',
      transform: 'translateZ(20px)',
    },
    '.footnote': {
      fontSize: 30,
    },
  })
  return (
    <div className="title" css={s03}>
      <span className="try">then you should try</span>
      <h1>
        Learn platform<sup>*</sup>
      </h1>
      <span className="footnote">
        <sup>*</sup> namenlos!
      </span>
    </div>
  )
}

const S04: React.FC = () => {
  const theme = useTheme<Theme>()
  return (
    <p>
      It’s a new <strong> Learn Platform </strong>
      based on the <strong>power of Web Graphic </strong>
      in modern browsers.
    </p>
  )
}
const S05: React.FC = () => {
  const theme = useTheme<Theme>()
  const big = css({
    width: 600,
    textAlign: 'center',
    fontSize: '60px',
    lineHeight: 1,
    '.big': { display: 'block', fontSize: 250, lineHeight: '250px' },
    '.subjects': {
      fontSize: '30px',
      lineHeight: '140px',
    },
  })
  return (
    <div css={big}>
      <p>
        Learn <b className="big">big</b>{' '}
        <span className="subjects"> subjects </span> <b>easily</b>
      </p>
    </div>
  )
}
const S06: React.FC = () => {
  const theme = useTheme<Theme>()
  const tiny = css({})
  return (
    <div className="tiny" css={tiny}>
      <p>
        and see <b>tiny</b> ideas behind them
      </p>
    </div>
  )
}

const S07: React.FC = () => {
  const theme = useTheme<Theme>()
  const pitch = css({
    '.iteractive': {
      display: 'inline-block',
      cursor: 'pointer',
      transition: 'transform .5s ease-in-out',
      '&:hover': {
        transform: 'rotate(-10deg)',
        transition: 'transform .5s ',
      },
    },
    '.future': {
      fontWeight: 'bold',
    },
  })

  return (
    <div className="pitch" css={pitch}>
      <p>
        Eine <b className="iteractive">interaktive</b>, Learnplattform zum
        <b className="tief"> tieferen </b> Verständnis von
        ingenieurwissenschaftlichen Theorien zusammen mit
        <b className="real_life"> Real-Life-Projekten</b> welche Wissenslücken
        frühzeitig erkennt und den Lernprozess entsprechend individuell anpasst,
        für jeden, der <span className="future">zukunftsorientiert</span> und
        hinterfragend lernen möchte.
      </p>
    </div>
  )
}
const S08: React.FC = () => {
  const theme = useTheme<Theme>()
  const value_prop = css({
    display: 'flex',
    flexDirection: 'row',
    marginLeft: 20,
    padding: 3,
    '.list': {
      li: {
        listStyle: 'disc',
        marginLeft: 40,
        marginTop: 10,
        marginBottom: 10,
      },
    },
    '.border': {
      display: 'absolute',
      width: 2,
      height: 350,
      border: `1px solid ${theme.palette.orange.light}`,
      transform: 'translateY(20px)',
      margin: 20,
    },
    '.title': {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      margin: 30,
    },
    '.title__icon': {
      margin: 20,
      width: 40,
      height: 40,
      overflow: 'hidden',
      background: `url(${value_icon})`,
      backgroundSize: 'contain',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
    },
    '.title__text': {
      textAlign: 'center',
      width: 200,
      display: 'inline-block',
      //   display: 'flex',
      //   flexDirection: 'column',
      //   justifyItems: 'center',
      //   alignContent: 'center',
    },
  })
  return (
    <div className="value" css={value_prop}>
      <div className="title">
        <div className="title__icon" />
        <h3 className="title__text">
          <span className="center">Value</span> Proposition
        </h3>
      </div>
      <div className="border" />
      <ul className="list">
        <li>
          <p>
            <b>Interactive</b> environment helps learn complex subjects{' '}
            <b>quickly</b> and get an <b>intuitive feeling</b> before get lost
            in calculations.
          </p>
        </li>
        <li>
          <p>
            <b>project based</b> learning helps getting real employable skills
            for careers of the future.
          </p>
        </li>
        <li>
          <p>
            It <b>predicts</b> the gaps in knowledge quickly and adjust itself
            to fullfill them.
          </p>
        </li>
        <li>
          <p>
            <b>self-paced</b> learning
          </p>
        </li>
        <li>
          <p>
            learn <b>anytime</b> <b>anywhere</b>
          </p>
        </li>
      </ul>
    </div>
  )
}
const S09: React.FC = () => {
  const theme = useTheme<Theme>()
  const partner = css({
    display: 'flex',
    flexDirection: 'row',
    marginLeft: 20,
    padding: 3,
    '.list': {
      li: {
        listStyle: 'disc',
        marginLeft: 40,
        marginTop: 10,
        marginBottom: 10,
      },
      marginTop: 'auto',
      marginBottom: 'auto',
    },
    '.border': {
      display: 'absolute',
      width: 2,
      height: 350,
      border: `1px solid ${theme.palette.orange.light}`,
      transform: 'translateY(20px)',
      margin: 20,
    },
    '.title': {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      margin: 30,
    },
    '.title__icon': {
      margin: 20,
      width: 50,
      height: 50,
      overflow: 'hidden',
      background: `url(${partner_icon})`,
      backgroundSize: 'contain',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
    },
    '.title__text': {
      textAlign: 'center',
      width: 200,
      display: 'inline-block',
      //   display: 'flex',
      //   flexDirection: 'column',
      //   justifyItems: 'center',
      //   alignContent: 'center',
    },
  })
  return (
    <div className="value" css={partner}>
      <div className="title">
        <div className="title__icon" />
        <h3 className="title__text">
          <span className="center">Key</span> Partners
        </h3>
      </div>
      <div className="border" />
      <ul className="list">
        <li>
          <p>Universites</p>
        </li>

        <li>
          <p>Leading technology Companies</p>
        </li>
        <li>
          <p>PhD Students</p>
        </li>
      </ul>
    </div>
  )
}
const S10: React.FC = () => {
  const theme = useTheme<Theme>()
  const key_activities = css({
    display: 'flex',
    flexDirection: 'row',
    marginLeft: 20,
    padding: 3,
    '.list': {
      li: {
        listStyle: 'disc',
        marginLeft: 40,
        marginTop: 10,
        marginBottom: 10,
      },
      marginTop: 'auto',
      marginBottom: 'auto',
    },
    '.border': {
      display: 'absolute',
      width: 2,
      height: 350,
      border: `1px solid ${theme.palette.orange.light}`,
      transform: 'translateY(20px)',
      margin: 20,
    },
    '.title': {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      margin: 30,
    },
    '.title__icon': {
      margin: 20,
      width: 50,
      height: 50,
      overflow: 'hidden',
      background: `url(${activity_icon})`,
      backgroundSize: 'contain',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
    },
    '.title__text': {
      textAlign: 'center',
      width: 200,
      display: 'inline-block',
      //   display: 'flex',
      //   flexDirection: 'column',
      //   justifyItems: 'center',
      //   alignContent: 'center',
    },
  })
  return (
    <div className="value" css={key_activities}>
      <div className="title">
        <div className="title__icon" />
        <h3 className="title__text">
          <span className="center">Key</span> Activities
        </h3>
      </div>
      <div className="border" />
      <ul className="list">
        <li>
          <p>Developing a machine learning model for pattern recognition</p>
        </li>

        <li>
          <p>Deployment on a Cloud Service (AWS) </p>
        </li>
        <li>
          <p>Developing courses</p>
        </li>
      </ul>
    </div>
  )
}
const S11: React.FC = () => {
  const theme = useTheme<Theme>()
  const revenue = css({
    display: 'flex',
    flexDirection: 'row',
    marginLeft: 20,
    padding: 3,
    '.list': {
      li: {
        listStyle: 'disc',
        marginLeft: 40,
        marginTop: 10,
        marginBottom: 10,
      },
      marginTop: 'auto',
      marginBottom: 'auto',
    },
    '.border': {
      display: 'absolute',
      width: 2,
      height: 350,
      border: `1px solid ${theme.palette.orange.light}`,
      transform: 'translateY(20px)',
      margin: 20,
    },
    '.title': {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      margin: 30,
    },
    '.title__icon': {
      margin: 0,
      width: 70,
      height: 70,
      overflow: 'hidden',
      background: `url(${revenue_icon})`,
      backgroundSize: 'contain',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
    },
    '.title__text': {
      textAlign: 'center',
      width: 200,
      display: 'inline-block',
      //   display: 'flex',
      //   flexDirection: 'column',
      //   justifyItems: 'center',
      //   alignContent: 'center',
    },
  })
  return (
    <div className="value" css={revenue}>
      <div className="title">
        <div className="title__icon" />
        <h3 className="title__text">
          <span className="center">Revenue</span> Streams
        </h3>
      </div>
      <div className="border" />
      <ul className="list">
        <li>
          <p>subscription billing</p>
        </li>

        <li>
          <p>pay per course </p>
        </li>
        <li>
          <p>business subscription</p>
        </li>
        <li>
          <p>sponsors</p>
        </li>
      </ul>
    </div>
  )
}
const S12: React.FC = () => {
  return (
    <div className="intersting">
      <p style={{ fontSize: 40 }}>Want to know more?</p>
    </div>
  )
}
const S13: React.FC = () => {
  const contact = css({
    transformStyle: 'preserve-3d',
    b: {
      transform: 'translateZ(40px)',
    },
    '.tel_mail': {
      marginTop: 20,
    },
    '.drop_me': {
      fontSize: 40,
    },
  })
  return (
    <div className="in-3d" css={contact}>
      <div className="drop_me">
        <b className="drop">drop</b> <span className="me">me</span>{' '}
        <span className="noticed"> a line</span>{' '}
        <span className="its">
          or <b>call</b> me:
        </span>{' '}
      </div>
      <div className="tel_mail">
        <p>+49 1728034022</p>
        <p>kurosh.zamany@gmail.com</p>
      </div>
    </div>
  )
}
const Data = [
  {
    pos: [-1000, -1500, 0],
    rotZ: 0,
    rotX: 0,
    rotY: 0,
    scale: 1,
    background: '#f5f4f4',
    Comp: S01,
  },
  {
    pos: [-0, -1500, 0],
    rotZ: 0,
    rotX: 0,
    rotY: 0,
    scale: 1,
    background: '#f5f4f4',
    Comp: S02,
  },
  { pos: [-0, 0, 0], rotZ: 0, rotX: 0, rotY: 0, scale: 4, Comp: S03 },

  {
    pos: [850, 2300, 0],
    rotZ: 90,
    rotX: 0,
    rotY: 0,
    scale: 5,
    Comp: S04,
  },
  {
    pos: [3500, 2100, 0],
    rotZ: 180,
    rotX: 0,
    rotY: 0,
    scale: 12,
    width: 600,
    dOpacity: 0.03,
    Comp: S05,
  },
  {
    pos: [2180, 2590, -6000],
    rotZ: 300,
    rotX: 0,
    rotY: 0,
    scale: 1,
    width: 600,
    Comp: S06,
  },
  {
    pos: [4500, -3500, 0],
    rotZ: 270,
    rotX: 0,
    rotY: 0,
    scale: 10,
    scalingDelay: 0,
    positioningDelay: 500,
    width: 600,
    Comp: S07,
  },
  {
    pos: [7600, -3500, 0],
    rotZ: 300,
    rotX: 0,
    rotY: 0,
    scale: 6,
    scalingDelay: 0,
    positioningDelay: 500,
    width: 900,
    Comp: S08,
  },
  {
    pos: [9600, -3500, 0],
    rotZ: 300,
    rotX: 0,
    rotY: 0,
    scale: 6,
    scalingDelay: 0,
    positioningDelay: 500,
    width: 900,
    Comp: S09,
  },
  {
    pos: [11000, -3500, 0],
    rotZ: 300,
    rotX: 0,
    rotY: 0,
    scale: 6,
    scalingDelay: 0,
    positioningDelay: 500,
    width: 900,
    Comp: S10,
  },
  {
    pos: [12200, -3500, 0],
    rotZ: 300,
    rotX: 0,
    rotY: 0,
    scale: 6,
    scalingDelay: 0,
    positioningDelay: 500,
    width: 900,
    Comp: S11,
  },
  {
    pos: [12200, -2500, 0],
    rotZ: 350,
    rotX: 0,
    rotY: 0,
    scale: 3,
    scalingDelay: 0,
    positioningDelay: 500,
    width: 900,
    Comp: S12,
  },
  {
    pos: [12500, -2300, -100],
    rotZ: 350,
    rotX: -40,
    rotY: 0,
    scale: 3,
    scalingDelay: 0,
    positioningDelay: 500,
    width: 900,
    Comp: S13,
  },
]

export const Presentation: React.FC = () => {
  const windowScale = computeWindowScale()
  const root = css({
    position: 'absolute',
    left: '50%',
    top: '50%',
    transformOrigin: 'left top 0px',
    transform: `perspective(${6000 / windowScale}px) scale(${windowScale})`,
    willChange: 'transform',
  })

  const canvas = css({
    position: 'absolute',
    transformOrigin: 'left top 0px',
    transformStyle: 'preserve-3d',
    willChange: 'transform',
    transform:
      'rotateZ(0deg) rotateY(0deg) rotateX(0deg) translate3d(0px, 0px, 0px)',

    strong: {
      fontWeight: 'bold',
    },
  })
  const targetScale = (1 / Data[0]['scale']) * windowScale
  const perspective = 6000 / targetScale

  const [rSpring, setRoot] = useSpring(() => ({
    transform: `perspectivce(${perspective}px) scale(${targetScale})`,
    // config: { ease: easeQuad, duration: 1000 },
    config: sConfigs.molasses,
  }))
  const [canSpring, setCanvas] = useSpring(() => ({
    config: sConfigs.slow,
    // config: sConfigs.,
    transform: `rotateZ(${-Data[0][
      'pos'
    ]}deg) rotateY(0deg) rotateX(0deg) translate3d(${-Data[0][
      'pos'
    ][0]}px, ${-Data[0]['pos'][1]}px, ${-Data[0]['pos'][2]}px)`,
  }))
  const [active, setActive] = useState(0)
  useEffect(() => {
    const windowScale = computeWindowScale()
    const targetScale = (1 / Data[active]['scale']) * windowScale
    const currScale =
      (1 / Data[active - 1 > 0 ? active - 1 : 0]['scale']) * windowScale
    const zoomIn = targetScale > currScale

    const perspective = 6000 / targetScale
    const rotZ = Data[active]['rotZ']
    const currRotZ = Data[active - 1 > 0 ? active - 1 : 0]['rotZ']
    const rotX = Data[active]['rotX']
    const pos = Data[active]['pos']
    const scalingDelay =
      'scalingDelay' in Data[active] ? Data[active]['scalingDelay'] : 200
    const posDelay =
      'positioningDelay' in Data[active]
        ? Data[active]['positioningDelay']
        : undefined
    setRoot({
      transform: `perspective(${perspective}px) scale(${targetScale})`,
      config: sConfigs.molasses,
      // delay: 300,
      delay: scalingDelay,
    })
    //   if (zoomIn === false) {
    //     setCanvas({
    //       transform: `rotateZ(${-Data[active - 1 > 0 ? active - 1 : 0][
    //         'rotZ'
    //       ]}deg) rotateY(0deg) rotateX(0deg) translate3d(${-pos[0]}px, ${-pos[1]}px, ${-pos[2]}px)`,
    //       //   delay: zoomIn ? 0 : 200,
    //     })
    //   }
    if (rotX) {
      ;(async () => {
        await setCanvas({
          transform: `rotateZ(${-currRotZ}deg) rotateY(0deg) rotateX(${-rotX}deg) translate3d(${-pos[0]}px, ${-pos[1]}px, ${-pos[2]}px)`,
          // delay: zoomIn ? 0 : 230,
          delay: zoomIn ? 30 : posDelay ? posDelay : 200,
        })
        await setCanvas({
          transform: `rotateZ(${-rotZ}deg) rotateY(0deg) rotateX(${-rotX}deg) translate3d(${-pos[0]}px, ${-pos[1]}px, ${-pos[2]}px)`,
          // delay: zoomIn ? 0 : 230,
          // delay: zoomIn ? 30 : posDelay ? posDelay : 200,
        })
      })()
    } else
      setCanvas({
        transform: `rotateZ(${-rotZ}deg) rotateY(0deg) rotateX(${-rotX}deg) translate3d(${-pos[0]}px, ${-pos[1]}px, ${-pos[2]}px)`,
        // delay: zoomIn ? 0 : 230,
        delay: zoomIn ? 30 : posDelay ? posDelay : 200,
      })
    //   await setCanvas({
    //     transform: `rotateZ(${-rotZ}deg) rotateY(0deg) rotateX(0deg) translate3d(${-pos[0]}px, ${-pos[1]}px, ${-pos[2]}px)`,
    //   })

    window.scrollTo(0, 0)
  }, [window.innerHeight, window.innerWidth, active])

  useEffect(() => {
    document.body.style.cssText = `overflow: hidden; `
    document.onkeydown = ev => {
      switch (ev.key) {
        case 'ArrowRight':
          setActive(curr => {
            return (curr + 1) % Data.length
          })

          break
        case 'ArrowLeft':
          setActive(curr => {
            let rest = (curr - 1) % Data.length
            if (rest < 0) rest = 0
            return rest
          })

          break
      }
    }
  }, [])
  return (
    <a.div className="presentation" css={root} style={rSpring}>
      <a.div className="canvas" css={canvas} style={canSpring}>
        {Data.map(
          (
            { Comp, scale, pos, rotZ, rotX, width, background, dOpacity },
            index,
          ) => (
            <Slide
              scale={scale}
              pos={pos}
              rotZ={rotZ}
              rotX={rotX}
              key={index}
              width={width}
              background={background}
              opacity={
                index === active ? 1 : dOpacity !== undefined ? dOpacity : 0.05
              }
            >
              <Comp />
            </Slide>
          ),
        )}
      </a.div>
    </a.div>
  )
}

type SlideProps = {
  pos: number[]
  scale?: number
  rotX?: number
  rotY?: number
  rotZ?: number
  width?: number
  opacity?: number
  background?: string
}

const Slide: React.FC<SlideProps> = ({
  pos,
  scale = 1,
  rotX = 0,
  rotY = 0,
  rotZ = 0,
  width = 900,
  opacity = 1,
  background,
  children,
}) => {
  const theme = useTheme<Theme>()
  const slide = css({
    width,
    position: 'absolute',
    background: background ? background : 'transparent',
    transformStyle: 'preserve-3d',
    perspective: 'inherit',
    fontSize: theme.typography.fontSizes[4],
    fontFamily: "'PT Serif', Arial, sans-serif",
  })

  const spring = useSpring({
    opacity: opacity as any,
    config: sConfigs.slow,
  })
  return (
    <a.div
      className="slide"
      css={slide}
      style={{
        opacity: spring.opacity,
        transformStyle: 'preserve-3d',
        transform: `translate(-50%, -50%) translate3d(${pos[0]}px,${pos[1]}px, ${pos[2]}px) rotateX(${rotX}deg) rotateY(${rotY}deg) rotateZ(${rotZ}deg) scale(${scale})`,
        // transform: `translate3d(${pos[0]}px,${pos[1]}px, ${pos[2]}px) rotate(0deg)`,
      }}
    >
      {children}
    </a.div>
  )
}
