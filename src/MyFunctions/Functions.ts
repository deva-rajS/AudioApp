export const playNextTrack = (
  currentTrackIndex,
  setCurrentTrackIndex,
  stop,
  audioTrack,
) => {
  if (currentTrackIndex < audioTrack.length - 1) {
    setCurrentTrackIndex(currentTrackIndex + 1);
    stop();
  } else {
    setCurrentTrackIndex(currentTrackIndex - (audioTrack.length - 1));
    stop();
  }
};
export const playPreviousTrack = (
  currentTrackIndex,
  setCurrentTrackIndex,
  stop,
) => {
  if (currentTrackIndex > 0) {
    setCurrentTrackIndex(currentTrackIndex - 1);
    stop();
  } else {
    setCurrentTrackIndex(currentTrackIndex + 1);
    stop();
  }
};

export const seek = (whoosh, value, duration, setCurrentTime) => {
  if (whoosh.current) {
    const newPosition = value * duration;
    whoosh.current.setCurrentTime(newPosition);
    setCurrentTime(newPosition);
  }
};

export const onButtonPress = async (isPlaying, pause, start) => {
  if (isPlaying) {
    pause();
  } else {
    start();
  }
};
