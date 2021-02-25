import React from 'react';

import {createStackNavigator} from '@react-navigation/stack';

import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';

import Forgot from '../pages/Forgot';

const Auth = createStackNavigator();

const AuthRoutes: React.FC = () => {
  return (
    <Auth.Navigator
      headerMode="none"
      screenOptions={{
        headerShown: false,
        cardStyle: {backgroundColor: '#312e38'},
      }}>
      <Auth.Screen key={10} name="SignIn" component={SignIn} />
      <Auth.Screen key={20} name="SignUp" component={SignUp} />

      <Auth.Screen key={40} name="Forgot" component={Forgot} />
    </Auth.Navigator>
  );
};

export default AuthRoutes;
