import React, { Component } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';


import Login from './components/login';
import SignUp from './components/signUp';
import HomePage from './components/homePage';
import Contacts from './components/contacts';
import Profile from './components/profile';
import ChangePass from './components/changePass';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const HomeTab = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name='HomePage' component={HomePage} />
      <Tab.Screen name='Contacts' component={Contacts}/>
      <Tab.Screen name='Profile' component={Profile}/>
    </Tab.Navigator>
  );
}

export default class App extends Component {
  render(){
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name='Login' component={Login}/>
          <Stack.Screen name='SignUp' component={SignUp}/>
          <Stack.Screen name='ChangePass' component={ChangePass}/>
          <Stack.Screen name='HomePage' component={HomeTab} options={{ headerShown: false }}/>
        </Stack.Navigator>
      </NavigationContainer>
    )
  }
}