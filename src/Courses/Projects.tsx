import React, { useLayoutEffect } from 'react'
import { NavPanel } from '../components'
import { useTheme } from 'emotion-theming'
import { css } from '@emotion/core'
import { Theme } from '../theme/types'
import shallow from 'zustand/shallow'
import { useUiStore } from '../appState'
import { CourseCard } from './CourseCard'
import ProjectsLLogo from './ProjectsLogo'
import pendulum from '../assets/courseThumbs/pendulum03.jpeg'
import manipulator from '../assets/courseThumbs/DHertenberg.png'
import humanoid from '../assets/courseThumbs/biped01.png'
import hexacopter from '../assets/courseThumbs/hexacopter.png'
import ros from '../assets/courseThumbs/ros2.png'

export const Projects: React.FC = () => {
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
    position: 'relative',
  })
  return (
    <div className="projectpage">
      <NavPanel
        background_color={theme.palette.white.base}
        textColor_closed={theme.palette.aubergine.base}
        textColor_opened={theme.palette.white.base}
      />
      <ProjectsLLogo />

      <div className="courselist" css={courseList}>
        <CourseCard src={pendulum} title={'Triple Inverted Pendulum'} />
        <CourseCard src={manipulator} title={'Manipulator Robot'} />
        <CourseCard src={humanoid} title={'Humanoid Robot'} />
        <CourseCard
          src={hexacopter}
          title={'Hexacopter Dynamics and Control'}
        />
        <CourseCard src={ros} title={'Manipulator in ROS'} />
      </div>
    </div>
  )
}
