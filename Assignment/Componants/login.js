import React, { Component } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Text, TextInput, View, Button, Alert, TouchableOpacity, StyleSheet } from 'react-native';
import validator from 'validator';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      email: "",
      password: "",
      Message: ""
    };
  }

  login = () => {

    const isValid = this.validData(); // validate the input data
    if (isValid) {
      const { email, password } = this.state;
      // this.setState({Message: `Email: ${email}\nPassword: ${password}`});
      this.setState({Message: "Success"});
    }
  }

  validateEmail = (email) => {
    return validator.isEmail(email);  
  }

  validatePassword = (password) => {
    return validator.isStrongPassword(password);
  }

 //validation
  validData = () => {
    
    const { email, password } = this.state;

    // make sure email and password isnt empty
    if (email == "" || password == ""){
      this.setState({Message: "Ensure email and password field aren't empty"});
      return false;
    }

    if (typeof email != "string" || typeof password != "string"){
      this.setState({Message: "Enter valid characters"});
      return false;
    }

    //call to validate email adn password, if requirements not met return false
    if (!this.validateEmail(email)){
      this.setState({Message: "Email invalid format"});
      return false;
    }
    
    if (!this.validatePassword(password)){
      this.setState({Message: "Enter strong password : \n 1 special symbol \n 1 uppercase character \n and a minimum of 8 charactes"});
      return false;
    }
    return true;
  }

  //what user sees
  render() {
    const { Message } = this.state;
    return (
      <View style={styles.container}>

      <Text style={styles.emailPasswordLabel} >Enter Email</Text>
      <TextInput style={styles.emailPasswordInput} 
        placeholder="Email"
        onChangeText={email => this.setState({ email })}
        value={this.state.email}
        placeholderTextColor="gray"
      /> 

      <Text style={styles.emailPasswordLabel}>Enter password</Text>
      <TextInput style={styles.emailPasswordInput} 
         placeholder="Password"
         onChangeText={password => this.setState({ password})}
         value={this.state.password}
         secureTextEntry={true}
         placeholderTextColor="gray"
      /> 

      <TouchableOpacity style={styles.loginButton} onPress={this.login}>
        <Text>Log in</Text>
      </TouchableOpacity>
      {Message ? <Text>{Message}</Text> : null}
      
      <StatusBar style="auto" />
    </View>
    );
  }}

  export default App

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'white',
    },
    emailPasswordInput: {
      color: '#fff',
      borderWidth: 1,
      borderColor: "thistle",
      borderRadius: 50,
      color: "black",
      margin: 0,
    },

    emailPasswordLabel: {
      margin: 0,
    },

    loginButton: {
      margin: 15,
    }
  });
