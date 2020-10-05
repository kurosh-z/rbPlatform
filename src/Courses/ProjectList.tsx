import React from 'react'
import { CourseCard } from './CourseCard'
import pendulum from '../assets/courseThumbs/pendulum03.jpeg'
import manipulator from '../assets/courseThumbs/DHertenberg.png'
import humanoid from '../assets/courseThumbs/biped01.png'
import hexacopter from '../assets/courseThumbs/hexacopter.png'
import ros from '../assets/courseThumbs/ros2.png'

export const ProjectList: React.FC = () => {
  return (
    <>
      <CourseCard
        src={pendulum}
        title={'Triple Inverted Pendulum'}
        description={['Kinematics and Dynamics']}
      />
      <CourseCard
        src={manipulator}
        title={'Manipulator Robot'}
        description={[
          'Kinematics and Dynamics',
          'Inverse Kinematics',
          'Differential Kinematics',
          'Motion Control',
        ]}
      />
      <CourseCard
        src={humanoid}
        title={'Humanoid Robot'}
        description={[
          'Kinematic Modeling',
          'Underactuated Robot Dynamics',
          'Dyanmic Model',
          'Balance Control',
          'Iterative Optimization',
        ]}
      />
      <CourseCard
        src={hexacopter}
        title={'Hexacopter Dynamics and Control'}
        description={['Kinematics and Dynamics']}
      />
      <CourseCard
        src={ros}
        title={'Manipulator in ROS'}
        description={['Kinematics and Dynamics']}
      />
    </>
  )
}
