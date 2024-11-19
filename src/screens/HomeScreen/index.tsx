import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {getTopAlbums, searchAlbums} from '../../routes/apiRoutes';
import {storage} from '../../navigation';
import {RootStackParamList} from '../../navigation';
import {Album} from '../../types';

interface Props {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
}

const HomeScreen: React.FC<Props> = ({navigation}) => {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchVal, setSearchVal] = useState<string>('');

  function debounce(func: (...args: any[]) => void, delay: number) {
    let timer: NodeJS.Timeout;
    return (...args: any[]) => {
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        func(...args);
      }, delay);
    };
  }

  const handleOpenAlbum = useCallback(
    (item: Album) => {
      const artistName =
        typeof item.artist === 'string' ? item.artist : item.artist.name;
      navigation.navigate('Album', {
        artist: artistName,
        album: item.name,
      });
    },
    [navigation],
  );

  const handleOpenArtist = useCallback(
    (item: Album) => {
      const artistName =
        typeof item.artist === 'string' ? item.artist : item.artist.name;
      navigation.navigate('Artist', {artist: artistName});
    },
    [navigation],
  );

  const handleSearch = useCallback(
    debounce(async (val: string) => {
      if (val.trim()) {
        setLoading(true);
        try {
          const data = await searchAlbums(val);
          console.log('data search', data);
          const dataAlbums = Array.isArray(data?.results?.albummatches?.album)
            ? data?.results?.albummatches?.album
            : [];
          setAlbums(dataAlbums);
        } catch (error) {
          console.error('Error searching albums:', JSON.stringify(error));
        } finally {
          setLoading(false);
        }
      } else {
        fetchAlbums();
      }
    }, 300),
    [],
  );

  const handleInputChange = (text: string) => {
    setSearchVal(text);
    handleSearch(text);
  };

  const fetchAlbums = async () => {
    try {
      const data = await getTopAlbums('disco');
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

  useEffect(() => {
    fetchAlbums();
  }, []);

  return (
    <View style={styles.root}>
      <View style={styles.greeting}>
        <Text style={styles.textGreeting}>
          {`Hello ${storage.getString('email') ?? ''}`}
        </Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search albums..."
          value={searchVal}
          onChangeText={handleInputChange}
        />
      </View>
      <View style={styles.container}>
        <View style={styles.scrollWrapper}>
          {loading ? (
            <ActivityIndicator size="large" />
          ) : albums.length > 0 ? (
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
          ) : (
            <Text style={styles.noResults}>No search results found.</Text>
          )}
        </View>
      </View>
    </View>
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
  searchInput: {
    marginTop: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    width: '100%',
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
  noResults: {
    textAlign: 'center',
    fontSize: 16,
    color: '#999',
    marginTop: 20,
  },
});

export default HomeScreen;
