import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import MainStack from './MainStack';
import AuthStack from './AuthStack';
import {MMKV} from 'react-native-mmkv';

export type RootStackParamList = {
  Auth: undefined;
  Home: undefined;
  Album: {artist: string; album: string};
  Artist: {artist: string};
};

export const storage = new MMKV();
// storage.clearAll();

const AppNavigator: React.FC = () => {
  const getToken: string | undefined = storage.getString('token');
  const [token, setToken] = useState<string | undefined>(getToken);

  useEffect(() => {
    const listener = storage.addOnValueChangedListener(() => {
      const getNewToken: string | undefined = storage.getString('token');
      getNewToken && setToken(getNewToken);
    });

    return () => {
      listener.remove();
    };
  }, []);

  return (
    <NavigationContainer>
      {token ? <MainStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default AppNavigator;
