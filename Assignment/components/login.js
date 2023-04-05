import React, { Component } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Text, TextInput, View, Button, Alert, TouchableOpacity, StyleSheet } from 'react-native';
import validator from 'validator';
import AsyncStorage from '@react-native-async-storage/async-storage';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      Message: ""
    };
  }

  login = () => {
    const navigation = this.props.navigation;
    const isValid = this.validData(); // validate the input data
    if (isValid) {
      this.loginUser();
    }
  }

  validateEmail = (email) => {
    return validator.isEmail(email);
  }

  validatePassword = (password) => {
    const passwdregex = /^(?=.*[0-9])(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
    return passwdregex.test(password);
  }

  //validation
  validData = () => {

    const { email, password } = this.state;

    // make sure email and password isnt empty
    if (email == "" || password == "") {
      this.setState({ Message: "Ensure email and password field aren't empty" });
      return false;
    }

    if (typeof email != "string" || typeof password != "string") {
      this.setState({ Message: "Enter valid characters" });
      return false;
    }

    //call to validate email adn password, if requirements not met return false
    if (!this.validateEmail(email)) {
      this.setState({ Message: "Email invalid format" });
      return false;
    }

    // if (!this.validatePassword(password)){
    //   this.setState({Message: "Enter strong password : \n 1 special symbol \n 1 uppercase character \n and a minimum of 8 charactes"});
    //   return false;
    // }

    return true;
  }

  loginUser = async () => {
    const navigation = this.props.navigation;

    return fetch("http://127.0.0.1:3333/api/1.0.0/login", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "email": this.state.email,
        "password": this.state.password
      })
    })

      .then(async (response) => {
        const responseJson = await response.json();
        console.log(responseJson)
        await AsyncStorage.setItem('@user_id', responseJson.id)
        await AsyncStorage.setItem('@session_token', responseJson.token);
        this.props.navigation.navigate('HomePage')
      })
      .catch((error) => {
        console.log(error)
      })
  }

  //what user sees
  render() {
    const navigation = this.props.navigation;
    const { Message } = this.state;
    return (
      <View style={styles.container}>

        <Text style={styles.title} >Whats That</Text>

        <TextInput style={styles.emailPasswordInput}
          placeholder="Email"
          onChangeText={email => this.setState({ email })}
          value={this.state.email}
          placeholderTextColor="gray"
        />

        <TextInput style={styles.emailPasswordInput}
          placeholder="Password"
          onChangeText={password => this.setState({ password })}
          value={this.state.password}
          secureTextEntry={true}
          placeholderTextColor="gray"
        />
        {/* <View style={styles.buttonsContainer}> */}

        <TouchableOpacity style={styles.loginButton}
          onPress={this.login}>
          <Text>log in</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.createButton}
          onPress={() => navigation.navigate('SignUp')}>
          <Text>Create Account</Text>
        </TouchableOpacity>
        {/* </View> */}

        {Message ? <Text>{Message}</Text> : null}

        <StatusBar style="auto" />

      </View>
    );
  }
}

export default Login

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
  title: {
    color: 'black',
    fontSize: 50,
    fontWeight: 'bold',
    marginVertical: '5%',
  },
  emailPasswordInput: {
    borderWidth: 1,
    borderColor: 'gray',
    width: '100%',
    height: 50,
    marginVertical: '2%',
    paddingHorizontal: 5,
    color: 'black',
  },

  loginButton: {
    marginVertical: 10,
    padding: 10,
    width: '75%',
    textAlign: 'center',
    justifyContent: 'center',
    backgroundColor: '#c8ada4',
    borderWidth: 1,
    borderRadius: 10,
    borderColor: 'black',
  },
  createButton: {
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
});