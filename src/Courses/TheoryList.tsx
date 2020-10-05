import React from 'react'
import { CourseCard } from './CourseCard'
import dynamicalSys from '../assets/courseThumbs/dynamicalSys.png'
import mpc from '../assets/courseThumbs/mpc.jpg'

export const TheoryList: React.FC = () => {
  return (
    <>
      <CourseCard
        src={dynamicalSys}
        title={'Linear System Theory'}
        description={[
          'Mathematical Descriptions of Systems',
          'Linear time-invariant (LTI) systems',
          'Discrete-time  Systems',
          'State-Space Solutions and Realizations',
          'Stability',
          'Observability',
          'Controllability',
        ]}
      />
      <CourseCard
        src={mpc}
        title={'Linear Model Predictive Control'}
        description={[
          'Mathematical Descriptions of Systems',
          'Linear time-invariant (LTI) systems',
          'Discrete-time  Systems',
          'State-Space Solutions and Realizations',
          'Stability',
          'Observability',
          'Controllability',
        ]}
      />
    </>
  )
}
