import React from 'react'
// import pendulum from '../assets/courseThumbs/pendulum.jpeg'
import { css } from '@emotion/core'
import { useTheme } from 'emotion-theming'
import { Theme } from '../theme/types'

type CoruseCardPros = {
  src: string
  title: string
  zooming?: number
}
export const CourseCard: React.FC<CoruseCardPros> = ({
  src,
  title,
  zooming = 100,
}) => {
  const theme = useTheme<Theme>()
  const shaddows = theme.createshadows(theme.palette.gray.dark)
  const coursecard = css({
    // gridColumn: 'span 1',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: 350,
    width: 300,
    overflow: 'hidden',
    background: theme.palette.white.lightest,
    borderRadius: theme.radii.md,
    boxShadow: shaddows['md'],
    alignItems: 'center',
    '.card__media': {
      maxWidth: zooming + '%',
      maxHeight: zooming + '0%',
      display: 'block',
      marginTop: 5,
    },
    '.card__text': {
      fontFamily: 'Rosario',
      color: theme.palette.gray.dark,
      display: 'block',
      textAlign: 'center',
      marginBottom: 10,
      // marginTop: 12,
      fontSize: theme.typography.fontSizes[3],
      fontWeight: theme.typography.fontWeights.bold,
    },
  })
  // const text = css({

  // })
  return (
    <>
      <li className="coursecard" css={coursecard}>
        <img className="card__media" src={src} />
        <span className="card__text">{title}</span>
      </li>
    </>
  )
}
