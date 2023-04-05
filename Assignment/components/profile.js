import React, { Component } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Text, TextInput, View, Button, Alert, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import validator from 'validator';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import CameraTakePicture from './components/camera-takephoto';

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      first_name: '',
      last_name: '',
      email: ''
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
        first_name: json.first_name,
        last_name: json.last_name,
        email: json.email
      });
    }
    catch (error) {
      console.log(error);
    }
  };

  componentDidMount() {
    this.getData();
  }

  // update user info
  updateUser = async () => {
    const userId = await AsyncStorage.getItem('@user_id');
    let toSend = {
      first_name: this.state.first_name,
      last_name: this.state.last_name,
      email: this.state.email,
    };

    return fetch("http://127.0.0.1:3333/api/1.0.0/user/" + userId, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': await AsyncStorage.getItem('@session_token')
      },
      body: JSON.stringify(toSend)
    })
      .then((response) => {
        console.log('user updated')
      })
      .catch((error) => {
        console.log(error)
      })
  }

  //logout delete session token and id
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
    const navigation = this.props.navigation;
    return (
      <View style={styles.container}>

        {/* <TouchableOpacity style={styles.buttonDesign} onPress={() => CameraTakePicture()}>
          <CameraTakePicture />
        </TouchableOpacity> */}

        <TextInput
          style={styles.inputBox}
          placeholder="First Name"
          placeholderTextColor="gray"
          onChangeText={(text) => this.setState({ first_name: text })}
          value={this.state.first_name}
        />

        <TextInput
          style={styles.inputBox}
          placeholder="Last Name"
          placeholderTextColor="gray"
          onChangeText={(text) => this.setState({ last_name: text })}
          value={this.state.last_name}
        />

        <TextInput style={styles.inputBox}
          placeholder="Email"
          placeholderTextColor="gray"
          onChangeText={(text) => this.setState({ email: text })}
          value={this.state.email}
        />

        <TouchableOpacity style={styles.buttonDesign} onPress={() => this.updateUser()}>
          <Text>Update</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonDesign} onPress={() => navigation.navigate('ChangePass')}>
          <Text>Change Password</Text>
        </TouchableOpacity>

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

  buttonDesign: {
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