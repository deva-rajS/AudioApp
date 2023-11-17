import React, {useEffect, useState} from 'react';
import {View, Text, Button, Image, StyleSheet} from 'react-native';
import TrackPlayer, {usePlaybackState} from 'react-native-track-player';

export default function App() {
  const [playerState, setPlayerState] = useState(null);

  useEffect(() => {
    const startPlayer = async () => {
      await TrackPlayer.setupPlayer();

      await TrackPlayer.add({
        id: 'trackID',
        url: require('./track.mp3').uri,
        title: 'Track Title',
        artist: 'Track Artist',
        artwork: require('./album.jpeg'),
      });

      TrackPlayer.play();
    };

    startPlayer();
  }, []);

  useEffect(() => {
    const fetchPlayerState = async () => {
      const state = await TrackPlayer.getState();
      setPlayerState(state);
    };

    fetchPlayerState();
  }, [playerState]);

  const onButtonPress = async () => {
    if (playerState === TrackPlayer.STATE_PLAYING) {
      await TrackPlayer.pause();
    } else {
      await TrackPlayer.play();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Track Title</Text>
      <Image source={require('./album.jpeg')} style={styles.albumArtwork} />
      <Button title="Play/Pause" onPress={onButtonPress} />
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
