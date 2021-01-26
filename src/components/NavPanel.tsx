import React, { useState, useMemo, useEffect } from 'react'
import { a, useSpring } from '@react-spring/web'
import shallow from 'zustand/shallow'
import { css as emoCSS } from '@emotion/core'
import { useTheme } from 'emotion-theming'
import { Theme } from '../theme/types'
import { alpha } from '../theme/colors'
import Button from '../components/Button/Button'
import BurgerBtn from '../components/Button/BurgerBtn'
import SidePanel from './SidePanel'
import { useScrollPosition } from '../utils'
import { useUiStore } from '../appState'
// import { UiState } from '../appState/types'

function useNavBackground({
  scrolled,
  theme,
  background_color,
}: {
  scrolled: boolean
  theme: Theme
  background_color: string
}) {
  //   const uiState = useUiState()
  const [navState, navToggle] = useUiStore(
    state => [state.nav, state.navToggle],
    shallow,
  )

  const [{ navBackColor }, setNavBackColor] = useSpring<{
    navBackColor: string
  }>(() => ({
    // navBackColor: alpha(theme.palette.aubergine.base, 0),
    navBackColor:'transparent',
    config: {
      mass: 1,
      friction: 60,
      tension: 140,
    },
  }))

 
    if (background_color !== 'transparent') {
      const closed = navState === 'closed'
      const closing = navState === 'progress' && navToggle === 'close'
  
      {
        // if it's closed or closing we do the animation
        if (closed || closing) {
          setNavBackColor({
            navBackColor: scrolled
              ? alpha(background_color, 0.95)
              : alpha(background_color, 0),
          })
        }
        //else if it's openning we do the animation to change the value stored in navBackColor but we return the end value!
        else {
          setNavBackColor({
            navBackColor: alpha(background_color, 0),
          })
          return alpha(background_color, 0)
        }
      }
    } else if(background_color === 'transparent'){
      setNavBackColor({
        navBackColor:'transparent'
      })
    }
    else
    {
      setNavBackColor({
        navBackColor: scrolled
          ? alpha(theme.palette.aubergine.dark, 0.95)
          : alpha(theme.palette.aubergine.dark, 0),
      })
    }
 
  return navBackColor
}

const ABurgerBtn = a(BurgerBtn)
interface NavPanelProps {
  background_color?: string
  textColor_opened: string
  textColor_closed: string
  conceptVisibility?: boolean
  navCB?: () => void
}
// page panel:
const NavPanel: React.FC<NavPanelProps> = ({
  background_color = '#2c142e',
  textColor_opened,
  textColor_closed,
  conceptVisibility = true,
}) => {
  // getting theme from emotion
  const theme = useTheme<Theme>()

  const [scrolled, setScrolled] = useState(false)
  useScrollPosition(({ currPos }) => {
    if (currPos.y < -80) setScrolled(true)
    else if (currPos.y > -80) setScrolled(false)
  }, [])

  const [navToggle, isCoursePage, isMobile, toggleNavPanel] = useUiStore(
    state => [
      state.navToggle,
      state.isCoursePage,
      state.isMobile,
      state.toggleNavPanel,
    ],
    shallow,
  )

  const navBackColor = useNavBackground({
    scrolled,
    theme,
    background_color,
  })

  // const [sidepanelOn, sidepaneltoggle] = useState<boolean>(false)
  const [{ textColor }, setTextColor] = useSpring(() => ({
    textColor: textColor_closed,
  }))
  setTextColor({
    textColor: navToggle === 'open' ? textColor_opened : textColor_closed,
  })

  const navpanel = useMemo(
    () =>
      emoCSS({
        position: 'fixed',
        display: 'flex',
        top: 0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100vw',
        height: '80px',
        // borderBottom: `2px solid ${theme.seperator.default}`,
        zIndex: theme.zIndices.fixed,
        '.headerpanel': {
          position: 'fixed',
          display: 'flex',
          top: 0,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: isCoursePage ? 'flex-end' : 'space-between',
          width: '100vw',
          height: '80px',
          // borderBottom: `2px solid ${theme.seperator.default}`,
          zIndex: theme.zIndices.fixed,
        },
        '.header__nav': {
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',

          '.nav__concept': {
            color: theme.palette.white.base,
            fontSize: theme.typography.fontSizes[1],
            fontWeight: theme.typography.fontWeights.bold,
            textAlign: 'center',
            textTransform: 'uppercase',
            textDecoration: 'none',
            marginRight: '1em',
          },
        },
        '.nav__btn': {
          margin: 'auto 1.5rem auto .5rem',
          alignSelf: 'center',
        },
        '.header__logoContainer': {
          width: '200px',
          height: '100%',
          padding: '1%',
          '& .header__logo': {
            width: '100%',
            height: '100%',
          },
        },

        '.nav__overlay': {
          width: '100vw',
          height: '100vh',
          position: 'fixed',
          top: 0,
          left: 0,
          backgroundColor: alpha(theme.palette.gray.lightest, 0.3),
          visibility: 'visible',
          willChange: 'background-color, visibility',
          transition: 'background-color .5s ease-in-out',

          '&.hidden': {
            visibility: 'hidden',
            backgroundColor: alpha(theme.palette.gray.light, 0.0),
            transition:
              'visibility 1s ease-in-out, background-color .6s ease-in-out ',
          },
        },
      }),
    [theme, isCoursePage],
  )

  return (
    <div className="navpanel" css={navpanel}>
      <a.header
        className="headerpanel"
        style={{
          background: navBackColor,
        }}
      >
        {!isCoursePage && (
          <a href="#" className="header__logoContainer">
            <img
              className="header__logo"
              src="https://drive.google.com/uc?id=18ghVt5qnGDcZ8srU6_RojYE2YQpt5SE4"
            />
          </a>
        )}

        <nav className="header__nav">
          <a.a
            href="#"
            className="nav__concept"
            style={{
              color: textColor,
              visibility: conceptVisibility && isMobile ? 'visible' : 'hidden',
            }}
          >
            concept
          </a.a>

          <ABurgerBtn
            text={isMobile ? undefined : 'navigation'}
            burgerCB={() => {
              toggleNavPanel()
            }}
            color={textColor}
          />
          {!isCoursePage && (
            <Button
              borderRad="xl"
              size={isMobile ? 'sm' : 'lg'}
              className="nav__btn"
            >
              log in
            </Button>
          )}
        </nav>
      </a.header>
      <SidePanel />
      <div
        className={
          navToggle === 'open' ? 'nav__overlay' : 'nav__overlay hidden'
        }
      />
    </div>
  )
}

export default NavPanel
