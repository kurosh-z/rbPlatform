import React from 'react'

export type OnClick =
  | ((event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void)
  | undefined
export type OnMouseDown = React.DOMAttributes<HTMLDivElement>
