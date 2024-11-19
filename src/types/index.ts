export type AlbumType = {
  id: string;
  name: string;
  artist: string;
};

export type Track = {
  name: string;
};

export type AlbumData = {
  artist: string;
  image: {'#text': string}[];
  tracks?: {track: Track[]};
};

export type Album = {
  name: string;
  artist: {name: string} | string;
  image: {'#text': string}[];
};
