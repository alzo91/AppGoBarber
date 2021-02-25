import React, {
  createContext,
  useContext,
  useCallback,
  useState,
  useEffect,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

interface AuthData {
  token: string;

  user: object;
}

interface SignInCredentials {
  email: string;

  password: string;
}

interface AuthContexData {
  loading: boolean;
  user: object;

  signIn(credentials: SignInCredentials): Promise<void>;

  sigOut(): Promise<void>;
}

const AuthContext = createContext<AuthContexData>({} as AuthContexData);

// const useAuth = useContext(AuthContext);

const AuthProvider: React.FC = ({children}) => {
  const [data, setData] = useState<AuthData>({} as AuthData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    /** loadStorageData */
    (async () => {
      const [token, user] = await AsyncStorage.multiGet([
        '@GoBarber:token',
        '@GoBarber:user',
      ]);

      if (!!token[1] && !!user[1]) {
        setData({token: token[1], user: JSON.parse(user[1])});
      }
      setLoading(false);
    })();
  }, []);

  const signIn = useCallback(async ({email, password}) => {
    // console.log('email', email, 'password', password);

    try {
      const response = await api.post('sessions', {email, password});

      console.log(response.data.user);

      const {token, user} = response.data;

      await AsyncStorage.multiSet([
        ['@GoBarber:token', String(token)],
        ['@GoBarber:user', JSON.stringify(user)],
      ]);

      setData({token, user});
    } catch (err) {
      console.log(err);
    }
  }, []);

  const sigOut = useCallback(async () => {
    await AsyncStorage.multiRemove(['@GoBarber:token', '@GoBarber:user']);

    setData({} as AuthData);
  }, []);

  return (
    <AuthContext.Provider value={{loading, user: data.user, sigOut, signIn}}>
      {children}
    </AuthContext.Provider>
  );
};

function useAuth(): AuthContexData {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used withIn a AuthProvider');
  }

  return context;
}

export {AuthContext, AuthProvider, useAuth};
