import React, { Component } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

import Login from './components/login';
import SignUp from './components/signUp';

export default class App extends Component {
  render(){
    return (
      <View style={styles.container}>
        {/* <Login/> */}
        <SignUp/>
      </View>
    )}
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});