import * as React from 'react';
import { useRef, useCallback, useState, useEffect, useMemo } from 'react';
import { Observer, AnimationGroup, Scene } from 'babylonjs';
import { css as emoCSS } from '@emotion/core';
import { useTheme } from 'emotion-theming';
import { Theme } from '../theme/types';
import { CanvasState } from '../appState';
import { useNotify } from '../utils';
//@ts-ignore
import play_icon from '../assets/icons/icon_play.svg';
//@ts-ignore
import pause_icon from '../assets/icons/icon_pause.svg';

export const AnimationBar: React.FC<{ canvState: CanvasState }> = ({
  canvState,
}) => {
  const [currentGroup, setCurrentGroup] = useState<AnimationGroup>(null);
  const [playing, setPlaying] = useState<boolean>(null);
  const [playRequest, setPlayRequest] = useState(false);
  const [sliderPos, setSliderPos] = useState('0');
  const [scene, sceneRef] = useNotify<Scene>();

  useEffect(() => {
    canvState.onSceneRegisterCallbacks.push(sceneRef);
  }, []);
  useEffect(() => {
    if (scene) {
      setCurrentGroup(scene.animationGroups[0]);
    }
  }, [scene]);

  const sliderSyncObserver = useRef<Observer<Scene>>(null);

  const pauseCallback = useCallback(() => {
    if (!currentGroup) return;
    currentGroup.pause();
    setPlaying(() => false);
  }, [currentGroup]);

  const playCallback = useCallback(() => {
    if (!currentGroup) return;
    currentGroup.play();
    setPlaying(() => true);
  }, [currentGroup]);

  useEffect(() => {
    const getCurrentPosition = () => {
      if (!currentGroup) {
        return '0';
      }
      let targetedAnimations = currentGroup.targetedAnimations;
      if (targetedAnimations.length > 0) {
        let runtimeAnimations =
          currentGroup.targetedAnimations[0].animation.runtimeAnimations;
        if (runtimeAnimations.length > 0) {
          const currframe = runtimeAnimations[0].currentFrame;
          //prevent animation to jum to the first frame at thte end!
          if (Math.abs(currframe - currentGroup.to) < 1) {
            setPlaying(false);
            currentGroup.pause();
            return currentGroup.to.toString();
          }
          return currframe.toString();
        }
      }
      return '0';
    };
    if (scene) {
      scene.onBeforeRenderObservable.remove(sliderSyncObserver.current);
      sliderSyncObserver.current = scene.onBeforeRenderObservable.add(() => {
        setSliderPos(() => getCurrentPosition());
      });
    }
  }, [scene, currentGroup]);

  const sliderInput = useCallback(
    (evt: React.FormEvent<HTMLInputElement>) => {
      if (!currentGroup) {
        return;
      }

      let value = parseFloat((evt.target as HTMLInputElement).value);

      if (!currentGroup.isPlaying) {
        currentGroup.play();
        currentGroup.goToFrame(value);
        currentGroup.pause();
      } else {
        currentGroup.pause();
        currentGroup.goToFrame(value);
        // we don't wanna play until mouse is up again so we request play on mouseUp event!
        setPlayRequest(() => true);
      }
      setSliderPos(() => value.toString());
    },
    [currentGroup]
  );

  const theme = useTheme<Theme>();
  const animBar = useMemo(
    () =>
      emoCSS({
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        color: 'white',
        minHeight: '30px',
        height: '80px',
        backgroundColor: theme.palette.aubergine.base,
        width: '100%',
        gridRow: 2,
        '.animationBar__playBtn': {
          height: '70px',
          width: '70px',
          border: 'none',
          cursor: 'pointer',
          background: 'transparent',
        },
        '.animationBar__slider': {
          WebkitAppearance: 'none',
          cursor: 'pointer',
          width: 'calc(100% - 160px)',
          maxWidth: 1200,
          outline: 'none',
          marginLeft: 20,
          marginRight: 10,
          background: 'transparent',
        },
        '.animationBar__slider::-webkit-slider-runnable-track': {
          height: 2,
          webkitAppearance: 'none',
          backgroundColor: 'white',
        },
        //mozila
        '.animationBar__slider::-moz-rrangeprogress': {
          backgroundColor: 'white',
          height: 2,
        },
        '.animationBar__slider::-moz-range-thumb': {
          width: 20,
          height: 20,
          border: '2px solid white',
          borderRadius: '50%',
          background: theme.palette.aubergine.base,
        },
        '.animationBar__slider::-moz-range-track': {
          backgroundColor: 'white',
          height: 2,
        },
      }),
    [theme]
  );

  return (
    <div className='animationBar' css={animBar}>
      <button className='animationBar__playBtn'>
        {!currentGroup && (
          <img
            src={play_icon}
            onClick={() => {
              console.log('empty');
            }}
          />
        )}
        {currentGroup && !playing && (
          <img src={play_icon} onClick={playCallback} />
        )}
        {currentGroup && playing && (
          <img src={pause_icon} onClick={pauseCallback} />
        )}
      </button>
      <input
        className='animationBar__slider'
        type='range'
        min={currentGroup ? currentGroup.from : 0}
        max={currentGroup ? currentGroup.to : 100}
        step='any'
        value={sliderPos}
        onChange={() => {}}
        onInput={(evt) => sliderInput(evt)}
        onMouseUp={() => {
          if (playRequest && currentGroup) {
            currentGroup.play();
            setPlayRequest(false);
          }
        }}
      />
    </div>
  );
};
