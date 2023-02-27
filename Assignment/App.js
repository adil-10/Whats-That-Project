import React, { Component } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';


import Login from './components/login';
import SignUp from './components/signUp';
import HomePage from './components/homePage';

const Stack = createNativeStackNavigator();
export default class App extends Component {
  render(){
    return (
        <NavigationContainer> 
          <Stack.Navigator initialRouteName='Login'>
            <Stack.Screen name='Login' component={Login}/>
            <Stack.Screen name='SignUp' component={SignUp}/>
            {/* <Stack.Screen name='Page3' component={Page3}/> */}
          </Stack.Navigator>
        </NavigationContainer>
        // <Login/>
    )}
}

//style={{flex:1}}