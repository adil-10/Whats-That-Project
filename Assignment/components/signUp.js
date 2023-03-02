import React, { Component } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Text, TextInput, View, Button, Alert, TouchableOpacity, StyleSheet } from 'react-native';
import validator from 'validator';

class SignUp extends Component {
  constructor(props){
    super(props);
    this.state = {
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      confirmPassword: '',
      Message: '',
    };
  }

  signUp = () => {
    this.setState({ Message: '' }); // clear error message
    const isValid = this.validData(); // validate the input data
    if (isValid) {
      if(this.addUser())
        navigation.navigate('Login');
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
    
    const { first_name, last_name, email, password, confirmPassword } = this.state;

    // make sure email and password isnt empty
    if (first_name == '' || last_name == '' ||email == '' || password == '' || confirmPassword == ''){
      this.setState({Message: 'Ensure no fields are empty'});
      return false;
    }

    if (typeof email != 'string' || typeof password != 'string'){
      this.setState({Message: 'Enter valid characters'});
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
    
    if(confirmPassword != password){
      this.setState({Message: 'Passwords do not match'})
      return false;
    }
    return true;
  }
 
  addUser(){

    let toSend = {
      first_name: this.state.first_name,
      last_name: this.state.last_name,
      email: this.state.email,
      password: this.state.password
    };

    console.log("HERE",toSend)
    return fetch("http://127.0.0.1:3333/api/1.0.0/user",{
      method: 'POST',
      headers: {
        'Content-Type' : 'application/json'
      },
      body: JSON.stringify(toSend)
    })
    .then((response) => {
      console.log('user created')
    })
    .catch((error) => {
      console.log(error)
    })
  }

  //what user sees
  render() {
    const { Message } = this.state;
    const navigation = this.props.navigation;
    return (
      <View style={styles.container}>   

      <Text style={styles.title} >Whats That</Text>

      <TextInput style={styles.emailPasswordInput} 
        placeholder = 'Forename'
        onChangeText={first_name => this.setState({ first_name })}
        value={this.state.first_name}
        placeholderTextColor="gray"
      />

      <TextInput style={styles.emailPasswordInput} 
        placeholder = 'Surname'
        onChangeText={last_name => this.setState({ last_name })}
        value={this.state.last_name}
        placeholderTextColor="gray"
        />

      <TextInput style={styles.emailPasswordInput} 
        placeholder="Email"
        onChangeText={email => this.setState({ email })}
        value={this.state.email}
        placeholderTextColor="gray"
      /> 

      <TextInput style={styles.emailPasswordInput} 
         placeholder="Password"
         onChangeText={password => this.setState({ password})}
         value={this.state.password}
         secureTextEntry={true}
         placeholderTextColor="gray"
      /> 

      <TextInput style={styles.emailPasswordInput} 
         placeholder="Confirm Password"
         onChangeText={confirmPassword => this.setState({ confirmPassword})}
         value={this.state.confirmPassword}
         secureTextEntry={true}
         placeholderTextColor="gray"
      /> 

      <TouchableOpacity style={styles.loginButton} 
      onPress={this.signUp}>

        <Text>Sign Up</Text>

      </TouchableOpacity>

      {Message ? <Text>{Message}</Text> : null}
      
      <StatusBar style="auto" />

    </View>
    );
  }}

  export default SignUp

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      paddingTop: 50,
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
      height: 30,
      marginVertical: '2%',
      paddingHorizontal: 5,
      color: 'black',
    },
    loginButton: {
      marginVertical: 10,
      padding: 10,
      width: 300,
      textAlign: 'center',
      backgroundColor: '#c8ada4',
      borderWidth: 1,
      borderRadius: 10,
      borderColor: 'black',
    }
  });

  // / sort background colour out
  // sort button bolour out
  // add logo to centre of page