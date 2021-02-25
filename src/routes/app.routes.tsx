import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import Dashboard from '../pages/Dashboard';

const AppStack = createStackNavigator();

const AppRoutes: React.FC = () => {
  return (
    <AppStack.Navigator
      headerMode="none"
      screenOptions={{cardStyle: {backgroundColor: '#312e38'}}}>
      <AppStack.Screen key={30} name="Dashboard" component={Dashboard} />
    </AppStack.Navigator>
  );
};
export default AppRoutes;
