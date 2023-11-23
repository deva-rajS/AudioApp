import React, {useState, useEffect, useRef} from 'react';
import {View, Text, Image, StyleSheet, TouchableHighlight} from 'react-native';
import Slider from '@react-native-community/slider';
import {library} from '@fortawesome/fontawesome-svg-core';
import {
  faForwardStep,
  faBackwardStep,
  faCirclePlay,
  faPause,
  faShuffle,
  faRepeat,
  faChevronDown,
  faEllipsis,
} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  onButtonPress,
  playNextTrack,
  playPreviousTrack,
  seek,
} from './src/MyFunctions/Functions';

var Sound = require('react-native-sound');
library.add(
  faCirclePlay,
  faPause,
  faForwardStep,
  faBackwardStep,
  faShuffle,
  faRepeat,
  faChevronDown,
  faEllipsis,
);

const Tracks = [
  {
    link: 'https://file-examples.com/storage/fe02dbc794655b5e699ae4d/2017/11/file_example_MP3_700KB.mp3',
    title: 'Sample 1',
  },
  {
    link: 'https://commondatastorage.googleapis.com/codeskulptor-demos/pyman_assets/ateapill.ogg',
    title: 'Sample 2',
  },
  {
    link: 'https://commondatastorage.googleapis.com/codeskulptor-demos/riceracer_assets/music/lose.ogg',
    title: 'Sample 3',
  },
];
export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [resumePosition, setResumePosition] = useState(0);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [audioTrack, setAudioTrack] = useState(Tracks);
  const whoosh = useRef(null);

  useEffect(() => {
    return () => {
      if (whoosh.current) {
        whoosh.current.release();
      }
    };
  }, []);
  useEffect(() => {
    if (isPlaying) {
      start();
    }
  }, [currentTrackIndex]);

  const start = () => {
    if (whoosh.current) {
      whoosh.current.release();
    }

    Sound.setCategory('Playback');
    whoosh.current = new Sound(
      audioTrack[currentTrackIndex].link,
      '',
      error => {
        if (error) {
          console.log('failed to load the sound', error);
          return;
        }
        setDuration(whoosh.current.getDuration());
        setIsPlaying(true);
        if (resumePosition > 0) {
          whoosh.current.setCurrentTime(resumePosition);
          whoosh.current.play(success => {
            if (success) {
              setIsPlaying(false);
              setCurrentTime(0);
              whoosh.current.release();
            } else {
              console.log('playback failed due to audio decoding errors');
            }
          });
        } else {
          whoosh.current.play(success => {
            if (success) {
              // setIsPlaying(false);
              setCurrentTime(0);
              whoosh.current.release();
              playNextTrack(
                currentTrackIndex,
                setCurrentTrackIndex,
                stop,
                audioTrack,
              );
            } else {
              console.log('playback failed due to audio decoding errors');
            }
          });
        }
      },
    );
    const id = setInterval(() => {
      whoosh.current.getCurrentTime(seconds => {
        setCurrentTime(seconds);
      });
    }, 1000);
    return () => {
      clearInterval(id);
    };
  };

  const pause = () => {
    if (whoosh.current) {
      whoosh.current.pause(() => {
        setIsPlaying(false);
        setResumePosition(currentTime);
      });
    }
  };

  const stop = () => {
    if (whoosh.current) {
      whoosh.current.stop(() => {
        setIsPlaying(false);
        setCurrentTime(0);
        setResumePosition(0);
      });
    }
  };

  const playNextTrackHandler = () => {
    playNextTrack(currentTrackIndex, setCurrentTrackIndex, stop, audioTrack);
  };

  const playPreviousTrackHandler = () => {
    playPreviousTrack(currentTrackIndex, setCurrentTrackIndex, stop);
  };

  const onButtonPressHandler = () => {
    onButtonPress(isPlaying, pause, start);
  };

  const seekHandler = value => {
    seek(whoosh, value, duration, setCurrentTime);
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <FontAwesomeIcon icon={faChevronDown} size={23} />
        <Text>Favourite</Text>
        <FontAwesomeIcon icon={faEllipsis} size={23} />
      </View>
      <View style={styles.albumContainer}>
        <Image source={require('./album.jpeg')} style={styles.albumArtwork} />
      </View>
      <View style={styles.playerContainer}>
        <Text style={styles.title}>{audioTrack[currentTrackIndex].title}</Text>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={1}
          minimumTrackTintColor="#5d6161"
          maximumTrackTintColor="#5d6161"
          thumbTintColor="#5d6161"
          value={currentTime / duration}
          onSlidingComplete={seekHandler}
        />
        <View style={styles.timerContainer}>
          <Text>{`${Math.floor(currentTime)}`}</Text>
          <Text>{`${Math.floor(duration)}`}</Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableHighlight
            style={styles.btnPlay}
            onPress={playPreviousTrackHandler}
            underlayColor="transparent">
            <FontAwesomeIcon icon={faShuffle} size={23} />
          </TouchableHighlight>
          <TouchableHighlight
            style={styles.btnPlay}
            onPress={playPreviousTrackHandler}
            underlayColor="transparent">
            <FontAwesomeIcon icon={faBackwardStep} size={32} />
          </TouchableHighlight>
          <TouchableHighlight
            style={styles.btnPlay}
            onPress={onButtonPressHandler}
            underlayColor="transparent">
            {isPlaying ? (
              <FontAwesomeIcon icon={faPause} size={52} />
            ) : (
              <FontAwesomeIcon icon={faCirclePlay} size={52} />
            )}
          </TouchableHighlight>
          <TouchableHighlight
            style={styles.btnPlay}
            onPress={playNextTrackHandler}
            underlayColor="transparent">
            <FontAwesomeIcon icon={faForwardStep} size={32} />
          </TouchableHighlight>
          <TouchableHighlight
            style={styles.btnPlay}
            onPress={playNextTrackHandler}
            underlayColor="transparent">
            <FontAwesomeIcon icon={faRepeat} size={23} />
          </TouchableHighlight>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    height: '100%',
  },
  header: {
    flex: 1,
    flexDirection: 'row',
    width: '90%',
    justifyContent: 'space-between',
    marginTop: 30,
  },
  albumContainer: {
    flex: 6,
    width: 380,
  },
  playerContainer: {
    flex: 3,
    width: '100%',
  },
  title: {
    fontSize: 20,
    alignSelf: 'flex-start',
    marginLeft: 20,
    marginBottom: 10,
  },
  albumArtwork: {
    flex: 1,
    width: undefined,
    height: undefined,
    marginBottom: 60,
  },
  slider: {
    marginHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  btnPlay: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnInner: {
    fontSize: 70,
  },
  timerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 25,
  },
});
