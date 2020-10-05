import React, { useLayoutEffect, useState } from 'react'
import { a, useTransition } from '@react-spring/web'
import { sConfigs } from '../utils'
import { NavPanel } from '../components'
import { useTheme } from 'emotion-theming'
import { css } from '@emotion/core'
import { Theme } from '../theme/types'
import shallow from 'zustand/shallow'
import { useUiStore } from '../appState'
import PTLogo from './PTLogo'
import PTicon from './PTicon'
import { ProjectList } from './ProjectList'
import { TheoryList } from './TheoryList'

export const CoursePage: React.FC = () => {
  const theme = useTheme<Theme>()
  const setCoursePage = useUiStore(state => state.setIsCoursePage, shallow)
  useLayoutEffect(() => {
    setCoursePage(true)
    document.body.style.cssText = `background-color: ${theme.palette.white.dark}`
  }, [])
  const courseList = css({
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 430px))',
    gridAutoRows: 500,
    marginTop: 60,
    alignItems: 'center',
    justifyContent: 'center',
    width: 'calc(100vw - 40px)',
    margin: '160px 20px 20px auto',
    overflow: 'hidden',
    position: 'absolute',
  })
  const [listTrans, setListTrans] = useState<
    ({ project: 'close' | 'open' } | { theory: 'close' | 'open' })[]
  >([{ project: 'open' }])

  const currTrans = listTrans[listTrans.length - 1]
  const currList =
    'project' in currTrans && currTrans['project'] === 'open'
      ? 'project'
      : 'theoery'
  const cardTransitions = useTransition(currList, {
    from: { left: '20px', opacity: 0 },
    enter: { opacity: 1 as any, config: sConfigs.molasses },
    leave: { opacity: 0, config: sConfigs.default },
  })

  return (
    <div className="projectpage">
      <NavPanel
        background_color={theme.palette.white.base}
        textColor_closed={theme.palette.aubergine.base}
        textColor_opened={theme.palette.white.base}
      />
      <PTLogo trans={listTrans} />
      <PTicon
        type={
          'project' in listTrans[listTrans.length - 1] ? 'theory' : 'project'
        }
        href="#"
        onClick={() => {
          setListTrans(() =>
            'project' in listTrans[listTrans.length - 1]
              ? [{ project: 'close' }, { theory: 'open' }]
              : [{ theory: 'close' }, { project: 'open' }],
          )
        }}
      />
      {cardTransitions((style, item, _, index) => (
        <a.div
          className="courselist"
          css={courseList}
          style={style}
          key={index}
        >
          {item === 'project' ? <ProjectList /> : <TheoryList />}
        </a.div>
      ))}
    </div>
  )
}
