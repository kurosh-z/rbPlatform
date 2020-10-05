import React, { useMemo } from 'react'
import { css } from '@emotion/core'
import { useTheme } from 'emotion-theming'
import { Theme } from '../../theme/types'

type GotoBtnProps = React.HTMLAttributes<HTMLDivElement> & {
  btn_text: string
}
const GotoBtn: React.FC<GotoBtnProps> = ({
  btn_text,
  className,
  children,
  ...rest
}) => {
  const theme = useTheme<Theme>()
  const btn = useMemo(
    () =>
      css({
        height: 60,
        width: 180,
        color: theme.palette.orange.light,
        fontWeight: theme.typography.fontWeights.bold,

        '.goto-btn': {
          display: 'flex',
          height: 30,
          justifyContent: 'flex-start',
          alignItems: 'center',
          position: 'relative',

          '&:hover .btn__vline': {
            transform: 'scale3d(1,0,1)',
            transition:
              'transform .2s cubic-bezier(.075,.82,.165,1),-webkit-transform .2s cubic-bezier(.075,.82,.165,1)',
          },
          '&:hover .btn__hline': {
            width: 24,
            transition:
              'width .2s cubic-bezier(.075,.82,.165,1),-webkit-transform .2s cubic-bezier(.075,.82,.165,1)',
          },
          '&:hover .btn__arrowrright': {
            visibility: 'visible',
            marginLeft: 14,
            transition:
              'margin-left .2s cubic-bezier(.075,.82,.165,1),-webkit-transform .2s cubic-bezier(.075,.82,.165,1)',
          },
        },
        '.btn__arrowrright': {
          display: 'block',
          visibility: 'hidden',
          position: 'relative',
          width: 15,
          height: 15,
          fill: theme.palette.orange.light,
          marginRight: 8,
          marginLeft: 0,
        },

        '.line': {
          display: 'inline-block',
          position: 'absolute',
          background: theme.palette.orange.light,
        },
        '.btn__vline': {
          width: 2,
          height: '100%',
          transition:
            'transform .2s cubic-bezier(.075,.82,.165,1),-webkit-transform .2s cubic-bezier(.075,.82,.165,1)',
        },
        '.btn__hline': {
          height: 2,
          width: 0,
          top: 'calc(50% - 1px)',
          transition:
            'width .2s cubic-bezier(.075,.82,.165,1),-webkit-transform .2s cubic-bezier(.075,.82,.165,1)',
        },
      }),
    [theme],
  )
  return (
    <div
      className={'btn__wrapper ' + className}
      css={btn}
      role="button"
      {...rest}
    >
      <a className="goto-btn">
        <span className="btn__vline line" />
        <span className="btn__hline line" />

        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 18.1 32"
          className="btn__arrowrright"
        >
          <path
            className="arrow_path"
            d="M17.5 14.7L3.1.5C2.4-.2 1.2-.2.5.5c-.7.7-.7 1.9 0 2.6L13.6 16 .5 28.9c-.7.7-.7 1.9 0 2.6.4.3.9.5 1.3.5s.9-.2 1.3-.5l14.4-14.2c.8-.7.8-1.9 0-2.6z"
          ></path>
        </svg>
        <span className="btn__label">{btn_text}</span>
      </a>
    </div>
  )
}

export default GotoBtn
