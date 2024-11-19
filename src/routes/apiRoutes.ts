import fetchService from './fetchService';

export const fetchMyArtistInfo = async (artist: string) => {
  return fetchService.get('/', {
    method: 'artist.getinfo',
    artist,
  });
};

export const getTopAlbums = async (tag: string) => {
  return fetchService.get('/', {
    method: 'tag.gettopalbums',
    tag,
  });
};

export const getAlbumTracks = async (artist: string, album: string) => {
  return fetchService.get('/', {
    method: 'album.getinfo',
    artist: artist,
    album: album,
  });
};

export const searchAlbums = async (album: string) => {
  return fetchService.get('/', {
    method: 'album.search',
    album,
  });
};
