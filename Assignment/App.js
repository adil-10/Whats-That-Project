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
import BlockedContacts from './components/blockedContacts';
import SearchContact from './components/searchContact';
import NewChat from './components/newChat';
import Chat from './components/chat';

import CameraBasic from './MAD_2223_Hardware-master/src/views/camera';
import CameraTakePicture from './MAD_2223_Hardware-master/src/views/camera-takephoto';
import CameraSendToServer from './MAD_2223_Hardware-master/src/views/camera-sendtoserver';
import DisplayImage from './MAD_2223_Hardware-master/src/views/display';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const HomeTab = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name='HomePage' component={HomePage} options={{ headerShown: false }} />
      <Tab.Screen name='Contacts' component={Contacts} options={{ headerShown: false }} />
      {/* <Tab.Screen name='BlockedContacts' component={BlockedContacts} options={{ headerShown: false }} /> */}
      <Tab.Screen name='Profile' component={Profile} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
}

export default class App extends Component {
  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name='Login' component={Login} options={{ headerShown: false }} />
          <Stack.Screen name='SignUp' component={SignUp} options={{ headerShown: false }} />
          <Stack.Screen name='ChangePass' component={ChangePass} options={{ headerShown: false }} />
          <Stack.Screen name='SearchContact' component={SearchContact} options={{ headerShown: false }} />
          <Stack.Screen name='NewChat' component={NewChat} options={{ headerShown: false }} />
          <Stack.Screen name='Chat' component={Chat} options={{ headerShown: false }} />
          <Stack.Screen name='HomePage' component={HomeTab} options={{ headerShown: false }} />

          <Stack.Screen name='CameraBasic' component={CameraBasic} options={{ headerShown: false }} />
          <Stack.Screen name='CameraTakePicture' component={CameraTakePicture} options={{ headerShown: false }} />
          <Stack.Screen name='CameraSendToServer' component={CameraSendToServer} options={{ headerShown: false }} />
          <Stack.Screen name='DisplayImage' component={DisplayImage} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    )
  }
}