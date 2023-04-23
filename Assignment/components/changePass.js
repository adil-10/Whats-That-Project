import React, { Component } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Text, TextInput, View, Button, Alert, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import validator from 'validator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

export default class ChangePass extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      confirmPassword: '',
      password: ''
    };
  }

  updateUser = async () => {
    const userId = await AsyncStorage.getItem('@user_id');
    let toSend = {
      password: this.state.password,
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
        console.log('password changed')
      })
      .catch((error) => {
        console.log(error)
      })
  }


  validData = () => {

    const passwdregex = /^(?=.*[0-9])(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;

    if (this.state.confirmPassword != this.state.password) {
      this.setState({ Message: 'Passwords do not match' })
      return false;
    }
    if (this.state.password != passwdregex) {
      return passwdregex.test(this.state.userData.password);
    }

  }

  render() {
    return (

      <View style={styles.container}>
        <View style={styles.Iconleft}>
          <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
        </View>
        <TextInput
          style={styles.inputBox}
          placeholder="Enter New Password"
          placeholderTextColor="gray"
          onChangeText={(text) => this.setState({ password: text })}
          secureTextEntry={true}
          value={this.state.password}
        />

        <TextInput
          style={styles.inputBox}
          placeholder="Confirm Password"
          onChangeText={confirmPassword => this.setState({ confirmPassword })}
          value={this.state.confirmPassword}
          secureTextEntry={true}
          placeholderTextColor="gray"
        />

        <TouchableOpacity
          style={styles.buttonDesign}
          onPress={() => this.updateUser()}>
          <Text>update password</Text>
        </TouchableOpacity>



      </View>
    );
  }
}



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

  Iconleft: {
    position: 'absolute',
    top: 0,
    left: 0,
    marginLeft: 15,
    marginTop: 10,
  },
  inputBox: {
    borderWidth: 1,
    borderColor: 'gray',
    width: '100%',
    height: 50,
    marginVertical: '2%',
    paddingHorizontal: 5,
    color: 'black',
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
