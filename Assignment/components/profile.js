import React, { Component } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Text, TextInput, View, Button, Alert, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import validator from 'validator';
import AsyncStorage from '@react-native-async-storage/async-storage';

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      userData: { first_name: '', last_name: '', email: '' },
    };
  }


  //display user data
  getData = async () => {
    try {
      const userId = await AsyncStorage.getItem('@user_id');

      let response = await fetch("http://127.0.0.1:3333/api/1.0.0/user/" + userId, {
        method: 'GET',
        headers: {
          'X-Authorization': await AsyncStorage.getItem('@session_token'),
        },
      });
      let json = await response.json();
      this.setState({
        isLoading: false,
        userData: json
      });
    } 
    catch (error) {
      console.log(error);
    }
  };

  componentDidMount() {
    this.getData();
  }

  //logout delete session token adn id
  logout = async () => {
    const navigation = this.props.navigation;
    console.log('logout');
    try {
      let response = await fetch("http://127.0.0.1:3333/api/1.0.0/logout", {
        method: 'POST',
        headers: {
          'X-Authorization': await AsyncStorage.getItem('@session_token'),
        },
      });

      if (response.status === 200) {
        await AsyncStorage.removeItem('@session_token');
        await AsyncStorage.removeItem('@user_id');
        navigation.navigate('Login');
      } 
      else if (response.status === 401) {
        console.log('Unauthorised');
        await AsyncStorage.removeItem('@session_token');
        await AsyncStorage.removeItem('@user_id');
        navigation.navigate('Login');
      } 
      else {
        throw 'Something went wrong';
      }
    } 
    catch (error) {
      console.log(error);
    }
  };
    
  render() {
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.inputBox}
          placeholder="First Name"
          placeholderTextColor="gray"
          value={this.state.userData.first_name}
        />
        <TextInput
          style={styles.inputBox}
          placeholder="Last Name"
          placeholderTextColor="gray"
          value={this.state.userData.last_name}
        />
        <TextInput style={styles.inputBox}
          placeholder="Email"
          placeholderTextColor="gray"
          value={this.state.userData.email}
        />
        <TouchableOpacity style={styles.buttonDesign} onPress={() => this.logout()}>
          <Text>Logout</Text>
        </TouchableOpacity>
      </View>
    );
  }
}


export default Profile;

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
    inputBox: {
        borderWidth: 1,
        borderColor: 'gray',
        width: '100%',
        height: 50,
        marginVertical: '2%',
        paddingHorizontal: 5,
        color: 'black',
        textAlign: 'center',
        justifyContent: 'center',
      },

    buttonDesign:{
        marginVertical: 10,
        padding: 10,
        width: '75%',
        textAlign: 'center',
        justifyContent: 'center',
        backgroundColor: '#c8ada4',
        borderWidth: 1,
        borderRadius: 10,
        borderColor: 'black',
    }
})

// post method to show data of user needed 
// authstack needs doing for navigation\
// logoin post method needs finishiong
// compound didmound