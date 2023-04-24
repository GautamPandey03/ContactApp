import {View, Text} from 'react-native';
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import Home from './screens/Home';
import UserDetails from './screens/UserDetails'
import AddUser from './screens/AddUser';
import EditUser from './screens/EditUser';
const Stack = createStackNavigator();
const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          component={Home}
          name={'Home'}
          options={{headerShown: false}}
        />
        <Stack.Screen
          component={AddUser}
          name={'AddUser'}
          options={{headerShown: true}}
        />
        <Stack.Screen
          component={EditUser}
          name={'EditUser'}
          options={{headerShown: true}}
        />
        <Stack.Screen
        component={UserDetails}
        name={'UserDetails'}
        options={{headerShown:true}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
