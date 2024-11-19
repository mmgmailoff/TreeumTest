import React, {useState, useCallback, useEffect} from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Image,
} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {getAlbumTracks} from '../../routes/apiRoutes';
import {RootStackParamList} from '../../navigation';
import {AlbumData} from '../../types';

interface Props {
  route: RouteProp<RootStackParamList, 'Album'>;
  navigation: NativeStackNavigationProp<RootStackParamList, 'Album'>;
}

const AlbumScreen: React.FC<Props> = ({route, navigation}) => {
  const {artist, album} = route.params as any;
  const [dataAlbum, setDataAlbum] = useState<AlbumData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const handleOpenArtist = useCallback(() => {
    if (dataAlbum?.artist) {
      navigation.navigate('Artist', {artist: dataAlbum.artist});
    }
  }, [dataAlbum, navigation]);

  useEffect(() => {
    const fetchApi = async () => {
      try {
        const data = await getAlbumTracks(artist, album);
        setDataAlbum(data.album);
        console.log('data.album', data.album);
      } catch (error) {
        console.error('Error fetching album tracks:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchApi();
  }, [artist, album]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.artist} onPress={handleOpenArtist}>
        Artist: {dataAlbum?.artist}
      </Text>
      {dataAlbum?.image && dataAlbum.image[3] && (
        <Image source={{uri: dataAlbum.image[3]['#text']}} style={styles.pic} />
      )}
      <Text style={styles.title}>Tracks for Album: {album}</Text>
      {dataAlbum?.tracks?.track && dataAlbum.tracks.track.length > 0 ? (
        <FlatList
          data={dataAlbum.tracks.track}
          keyExtractor={item => item.name}
          renderItem={({item}) => (
            <View style={styles.trackContainer}>
              <Text style={styles.trackName}>{item.name}</Text>
            </View>
          )}
        />
      ) : (
        <Text style={styles.noTracks}>No tracks available.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    paddingVertical: 15,
  },
  pic: {
    width: 200,
    height: 200,
  },
  trackContainer: {
    padding: 10,
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  trackName: {
    fontSize: 14,
    color: '#555',
  },
  noTracks: {
    fontSize: 20,
    color: '#999',
    textAlign: 'center',
    marginTop: 20,
  },
  artist: {
    fontSize: 20,
    paddingVertical: 8,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});

export default AlbumScreen;
