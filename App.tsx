import React, {useState, useEffect} from 'react';
import {View, Text, Button, Image, StyleSheet} from 'react-native';
var Sound = require('react-native-sound');
let whoosh;

export default function App() {
  const [buttonText, setButtonText] = useState('Play');
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    return () => {
      if (whoosh) {
        whoosh.release();
      }
    };
  }, []);

  const start = () => {
    Sound.setCategory('Playback');
    console.log('play');
    whoosh = new Sound(
      'https://file-examples.com/storage/fe83b11fb06553bbba686e7/2017/11/file_example_MP3_700KB.mp3',
      '',
      error => {
        console.log('playing');
        if (error) {
          console.log('failed to load the sound', error);
          return;
        }
        console.log(
          'duration in seconds: ' +
            whoosh.getDuration() +
            'number of channels: ' +
            whoosh.getNumberOfChannels(),
        );
        console.log('played');
        setIsPlaying(true);
        whoosh.play(success => {
          if (success) {
            console.log('successfully finished playing');
            setIsPlaying(false);
          } else {
            console.log('playback failed due to audio decoding errors');
          }
        });
      },
    );
  };

  const pause = () => {
    whoosh.pause(() => {
      setIsPlaying(false);
      console.log('paused');
    });
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
      <Button title={buttonText} onPress={onButtonPress} />
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
});
