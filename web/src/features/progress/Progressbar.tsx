import React from 'react';
import { Box, createStyles, Text, Transition } from '@mantine/core';
import { useNuiEvent } from '../../hooks/useNuiEvent';
import { fetchNui } from '../../utils/fetchNui';
import type { ProgressbarProps } from '../../typings';

const ITEM_COUNT = 30;

const useStyles = createStyles(() => ({
  progressContainer: {
    zIndex: 5,
    color: '#a63c3c',
    width: '22%',
    position: 'fixed',
    bottom: '4vh',
    left: '0',
    right: '0',
    marginLeft: 'auto',
    marginRight: 'auto',
    fontFamily: "'Poppins', sans-serif",
  },
  progressLabels: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressLabel: {
    fontSize: '1.3vh',
    position: 'relative',
    color: '#ffffff',
    zIndex: 10,
    fontWeight: 550,
  },
  progressPercentage: {
    fontSize: '1.3vh',
    position: 'relative',
    color: '#ffffff',
    zIndex: 10,
    fontWeight: 400,
  },
  progressBarContainer: {
    width: '100%',
    height: '3.5vh',
    background: 'rgba(28, 29, 39, 0.45)',
    overflow: 'hidden',
    position: 'relative',
    display: 'block',
    whiteSpace: 'nowrap',
    borderRadius: 2,
    border: '1px solid rgb(61, 63, 79)',
  },
  itemContainer: {
    width: 'calc(100% - 10px)',
    height: '100%',
    left: '5.5px',
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    overflow: 'hidden',
    gap: '1.6px',
  },
  item: {
    width: '100%',
    height: '1.2vh',
    backgroundColor: 'rgba(0, 0, 0, 0.450)',
    clipPath: 'polygon(75% 0%, 100% 50%, 75% 100%, 0% 100%, 25% 50%, 0% 0%)',
  },
  filled: {
    backgroundColor: '#a63c3c !important',
  },
}));

const Progressbar: React.FC = () => {
  const { classes } = useStyles();
  const [visible, setVisible] = React.useState(false);
  const [label, setLabel] = React.useState('Loading...');
  const [duration, setDuration] = React.useState(0);
  const [progress, setProgress] = React.useState(0);

  const filledItemsCount = Math.floor((progress / 100) * ITEM_COUNT);

  useNuiEvent('progressCancel', () => setVisible(false));

  useNuiEvent<ProgressbarProps>('progress', (data) => {
    setLabel(data.label);
    setDuration(data.duration);
    setVisible(true);
    setProgress(0);

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsedTime = Date.now() - startTime;
      const currentProgress = Math.min(100, (elapsedTime / data.duration) * 100);
      setProgress(currentProgress);

      if (currentProgress >= 100) {
        clearInterval(interval);
        setTimeout(() => setVisible(false), 500);
      }
    }, 40);

    return () => clearInterval(interval);
  });

  return (
    <Transition
      mounted={visible}
      transition={{
        in: { opacity: 1, transform: 'scale(1)' },
        out: { opacity: 0, transform: 'scale(0.95)' },
        common: { transformOrigin: 'bottom' },
        transitionProperty: 'transform, opacity',
      }}
      duration={400}
      timingFunction="ease-out"
      onExited={() => fetchNui('progressComplete')}
    >
      {(styles) => (
        <Box className={classes.progressContainer} style={styles}>
          <Box className={classes.progressLabels}>
            <Text className={classes.progressLabel}>{label}</Text>
            <Text className={classes.progressPercentage}>{`${Math.round(progress)}%`}</Text>
          </Box>
          <Box className={classes.progressBarContainer}>
            <Box className={classes.itemContainer}>
              {Array.from({ length: ITEM_COUNT }).map((_, index) => (
                <Box key={index} className={`${classes.item} ${index < filledItemsCount ? classes.filled : ''}`} />
              ))}
            </Box>
          </Box>
        </Box>
      )}
    </Transition>
  );
};

export default Progressbar;
