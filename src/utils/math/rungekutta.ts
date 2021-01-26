type R = number[]
type Func = (r: R, t: number) => R

export function rungekutta(func: Func, r: R, t: number, h: number) {
  /** 
Runge-Kutta 4 method for solving 1st order differential equations

Usage: xNew = rk4(func, r, t, h) 

Given a function  f(x, t, h) = dx/dt and initial starting 
conditions for x, rk4() returns the next values of x. 
@param func:  user defined function for the 1st order differential equations
@param r: dependent variable(s)
@param t: independent variable(s)
@param h: independent variable step value
*/

  const k1 = func(r, t)
  const k1x = h * k1[0]
  const k1y = h * k1[1]

  const k2 = func([r[0] + 0.5 * k1x, r[1] + 0.5 * k1y], t + 0.5 * h)
  const k2x = h * k2[0]
  const k2y = h * k2[1]

  const k3 = func([r[0] + 0.5 * k2x, r[1] + 0.5 * k2y], t + 0.5 * h)
  const k3x = h * k3[0]
  const k3y = h * k3[1]

  const k4 = func([r[0] + 0.5 * k3x, r[1] + 0.5 * k3y], t + h)
  const k4x = h * k4[0]
  const k4y = h * k4[1]

  const resx = (k1x + 2 * k2x + 2 * k3x + k4x) / 6
  const resy = (k1y + 2 * k2y + 2 * k3y + k4y) / 6

  return [resx, resy]
}
