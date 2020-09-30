import { SpringConfig, config } from '@react-spring/web'

const FAST: SpringConfig = { friction: 20, mass: 2, tension: 40 }
const FASTER: SpringConfig = { friction: 14, tension: 75 }
const SLOW: SpringConfig = { friction: 30, mass: 2, tension: 40 }
const VSLOW: SpringConfig = { friction: 100, mass: 3, tension: 80 }

export const sConfigs = { FAST, SLOW, VSLOW, FASTER, ...config }
