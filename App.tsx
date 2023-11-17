import React, {useState, useEffect} from 'react';
import {View, Text, Button, Image, StyleSheet} from 'react-native';
import TrackPlayer, {
  useTrackPlayerEvents,
  TrackPlayerEvents,
} from 'react-native-track-player';

export default function App() {
  const [playbackState, setPlaybackState] = useState(null);
  const [buttonText, setButtonText] = useState('Play');

  useEffect(() => {
    const startPlayer = async () => {
      try {
        // Check if player is already initialized
        const isPlayerInitialized = await TrackPlayer.isInitialized();
        if (!isPlayerInitialized) {
          await TrackPlayer.setupPlayer();
          console.log('Player is set up');
        }

        await TrackPlayer.add({
          id: 'trackID',
          url: require('./track.mp3').uri,
          title: 'Track Title',
          artist: 'Track Artist',
          artwork: require('./album.jpeg'),
        });

        const playbackStateSubscription = TrackPlayer.addEventListener(
          'playback-state',
          ({state}) => {
            setPlaybackState(state);
            if (state === TrackPlayer.STATE_PLAYING) {
              setButtonText('Pause');
            } else {
              setButtonText('Play');
            }
          },
        );

        TrackPlayer.play();

        return () => {
          TrackPlayer.removeEventListener(
            'playback-state',
            playbackStateSubscription,
          );
        };
      } catch (error) {
        console.error('Error setting up player:', error);
      }
    };

    startPlayer();
  }, []);

  const onButtonPress = async () => {
    console.log('played');
    if (playbackState === TrackPlayer.STATE_PLAYING) {
      await TrackPlayer.pause();
    } else {
      await TrackPlayer.play();
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
