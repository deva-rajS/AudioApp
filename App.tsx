import React, {useState, useEffect, useRef} from 'react';
import {View, Text, Button, Image, StyleSheet} from 'react-native';
import Slider from '@react-native-community/slider';

// var Slider = require('react-native-slider');
var Sound = require('react-native-sound');

export default function App() {
  const [buttonText, setButtonText] = useState('Play');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [resumePosition, setResumePosition] = useState(0);
  const whoosh = useRef(null);

  useEffect(() => {
    return () => {
      if (whoosh.current) {
        whoosh.current.release();
      }
    };
  }, []);

  const start = () => {
    Sound.setCategory('Playback');
    whoosh.current = new Sound(
      'https://file-examples.com/storage/fe02dbc794655b5e699ae4d/2017/11/file_example_MP3_700KB.mp3',
      '',
      error => {
        if (error) {
          console.log('failed to load the sound', error);
          return;
        }
        setDuration(whoosh.current.getDuration());
        setIsPlaying(true);
        if (resumePosition > 0) {
          // If there is a resume position, set it and resume
          whoosh.current.setCurrentTime(resumePosition);
          whoosh.current.play(success => {
            if (success) {
              setIsPlaying(false);
              setCurrentTime(0); // Reset currentTime when playback completes
              whoosh.current.release(); // Release resources
            } else {
              console.log('playback failed due to audio decoding errors');
            }
          });
        } else {
          // If no resume position, start from the beginning
          whoosh.current.play(success => {
            if (success) {
              setIsPlaying(false);
              setCurrentTime(0); // Reset currentTime when playback completes
              whoosh.current.release(); // Release resources
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

  const seek = value => {
    if (whoosh.current) {
      const newPosition = value * duration;
      whoosh.current.setCurrentTime(newPosition);
      setCurrentTime(newPosition);
    }
  };

  const onButtonPress = async () => {
    if (isPlaying) {
      pause();
      setButtonText('Play');
    } else {
      start();
      setButtonText('Pause');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Track Title</Text>
      <Image source={require('./album.jpeg')} style={styles.albumArtwork} />
      <Slider
        style={{width: 200}}
        minimumValue={0}
        maximumValue={1}
        value={currentTime / duration}
        onSlidingComplete={seek}
      />
      <Text>{`${Math.floor(currentTime)} / ${Math.floor(duration)}`}</Text>
      <View style={styles.buttonContainer}>
        <Button title="Previous" onPress={stop} />
        <Button title={buttonText} onPress={onButtonPress} />
        <Button title="Next" onPress={stop} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
  },
  albumArtwork: {
    width: 200,
    height: 200,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    width: '80%',
  },
});
