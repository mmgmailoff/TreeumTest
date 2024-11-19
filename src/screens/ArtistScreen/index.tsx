import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {fetchMyArtistInfo} from '../../routes/apiRoutes';
import {RootStackParamList} from '../../navigation';

interface Props {
  route: RouteProp<RootStackParamList, 'Artist'>;
}

const ArtistScreen: React.FC<Props> = ({route}) => {
  const {artist} = route.params;
  const [bio, setBio] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchApi = async () => {
      try {
        const data = await fetchMyArtistInfo(artist);
        setBio(data.artist);
      } catch (error) {
        console.error('Error fetching artist info:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchApi();
  }, [artist]);

  if (loading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!bio) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.errorText}>
          No information available for the artist.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Text style={styles.artistName}>Bio of {bio.name}</Text>
      <Text style={styles.bioText}>{bio?.bio?.content}</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  scrollContainer: {
    padding: 16,
    backgroundColor: '#fff',
  },
  artistName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
    textAlign: 'center',
  },
  bioText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#555',
    textAlign: 'justify',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
});

export default ArtistScreen;
