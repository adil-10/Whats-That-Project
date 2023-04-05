import React, { Component } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Text, TextInput, View, Button, Alert, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import validator from 'validator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MenuProvider, Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';

class HomePage extends Component {

  componentDidMount() {
    const navigation = this.props.navigation;
    console.log("HomePage mounted");
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });
  }

  componentWillUnmount() {
    console.log("HomePage unmounted");
    this.unsubscribe();
  }


  checkLoggedIn = async () => {
    const navigation = this.props.navigation;
    const value = await AsyncStorage.getItem('@session_token');

    if (value != null) {
      this.props.navigation.navigate('HomePage');
    }

    if (value == null) {
      this.props.navigation.navigate('Login');
    }
  };

  render() {
    const navigation = this.props.navigation;
    return (
      <View style={styles.container}>

        <View style={styles.Icon}>
          <MenuProvider style={{ flexDirection: 'column', padding: 25 }}>
            <Menu>
              <MenuTrigger text='...' customStyles={{ triggerText: { fontSize: 20, fontWeight: 'bold' } }} />                                <MenuOptions>
                <MenuOption onSelect={() => navigation.navigate('NewChat')} text='New Chat' />
              </MenuOptions>
            </Menu>
          </MenuProvider>
        </View>

        <Text>Hello, I am the home page</Text>
      </View>
    );
  }
}

export default HomePage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  Icon: {
    position: 'absolute',
    top: 0,
    right: 0,
    padding: 15,
  },
})