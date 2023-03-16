import React, { Component } from 'react';
import { Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
    return (
      <View>
        <Text>Hello, I am the home page</Text>
      </View>
    );
  }
}

export default HomePage;
