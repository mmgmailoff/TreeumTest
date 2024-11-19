import React, {useEffect, useState, useCallback} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
} from 'react-native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {getTopAlbums} from '../../routes/apiRoutes';
import {storage} from '../../navigation';
import {RootStackParamList} from '../../navigation';

interface Album {
  name: string;
  artist: {name: string};
  image: {'#text': string}[];
}

interface Props {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
}

const HomeScreen: React.FC<Props> = ({navigation}) => {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const handleOpenAlbum = useCallback(
    (item: Album) =>
      navigation.navigate('Album', {
        artist: item.artist.name,
        album: item.name,
      }),
    [navigation],
  );

  const handleOpenArtist = useCallback(
    (item: Album) => navigation.navigate('Artist', {artist: item.artist.name}),
    [navigation],
  );

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const data = await getTopAlbums('disco');
        console.log('data', data);
        const dataAlbums = Array.isArray(data?.albums?.album)
          ? data.albums.album
          : [];
        setAlbums(dataAlbums);
      } catch (error) {
        console.error('Error fetching albums:', JSON.stringify(error));
      } finally {
        setLoading(false);
      }
    };

    fetchAlbums();
  }, []);

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.greeting}>
        <Text style={styles.textGreeting}>
          {`Hello ${storage.getString('email') ?? ''}`}
        </Text>
      </View>
      <View style={styles.container}>
        <View style={styles.scrollWrapper}>
          {loading ? (
            <ActivityIndicator size="large" />
          ) : (
            <FlatList
              data={albums}
              keyExtractor={item => item.name}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={styles.albumItem}
                  onPress={() => handleOpenAlbum(item)}
                  onLongPress={() => handleOpenArtist(item)}>
                  {item.image.length > 0 && (
                    <Image
                      source={{uri: item.image[2]['#text']}}
                      style={styles.albumImage}
                    />
                  )}
                  <View style={styles.textWrap}>
                    <Text style={[styles.mb10]}>Album: {item.name}</Text>
                    <Text style={[styles.fs12]}>
                      Artist: {item.artist.name}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  scrollWrapper: {
    flex: 1,
  },
  greeting: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  textGreeting: {
    paddingTop: 10,
    fontSize: 15,
    fontWeight: '500',
  },
  albumItem: {
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  albumImage: {
    width: 70,
    height: 70,
  },
  mb10: {
    marginBottom: 10,
    fontSize: 13,
  },
  fs12: {
    fontSize: 12,
  },
  textWrap: {
    paddingLeft: 10,
    flexShrink: 1,
    paddingVertical: 5,
  },
});

export default HomeScreen;
