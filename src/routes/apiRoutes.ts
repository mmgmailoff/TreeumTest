import fetchService from './fetchService';

type FetchParams = {
  method: string;
  [key: string]: string;
};

const fetchData = async <T>(params: FetchParams): Promise<T> => {
  return fetchService.get('/', params);
};

export const fetchMyArtistInfo = async (artist: string) => {
  return fetchData({
    method: 'artist.getinfo',
    artist,
  });
};

export const getTopAlbums = async (tag: string) => {
  return fetchData({
    method: 'tag.gettopalbums',
    tag,
  });
};

export const getAlbumTracks = async (artist: string, album: string) => {
  return fetchData({
    method: 'album.getinfo',
    artist,
    album,
  });
};

export const searchAlbums = async (album: string) => {
  return fetchData({
    method: 'album.search',
    album,
  });
};
