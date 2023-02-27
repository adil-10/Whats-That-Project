import React, { Component } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Text, TextInput, View, Button, Alert, TouchableOpacity, StyleSheet } from 'react-native';
import validator from 'validator';

class SignUp extends Component {
  constructor(props){
    super(props);
    this.state = {
      firstName: '',
      surName: '',
      email: '',
      password: '',
      confirmPassword: '',
      Message: ''
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
    
    const { firstName, surName, email, password, confirmPassword } = this.state;

    // make sure email and password isnt empty
    if (firstName == '' || surName == '' ||email == '' || password == '' || confirmPassword == ''){
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

  //what user sees
  render() {
    const { Message } = this.state;
    const navigation = this.props.navigation;
    return (
      <View style={styles.container}>   

      <Text style={styles.title} >Whats That</Text>

      <TextInput style={styles.emailPasswordInput} 
        placeholder = 'Forename'
        onChangeText={firstName => this.setState({ firstName })}
        value={this.state.firstName}
        placeholderTextColor="gray"
      />

      <TextInput style={styles.emailPasswordInput} 
        placeholder = 'Surname'
        onChangeText={surName => this.setState({ surName })}
        value={this.state.surName}
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
      onPress={this.login}
      onPress={() => navigation.navigate('Login')}>

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
      backgroundColor: '#90EE90',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      paddingTop: 50,
      paddingHorizontal: 20,
    },
    title: {
      flex: 1,
      color: 'black',
      fontSize: 30,
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
      backgroundColor: 'white',
      borderWidth: 1,
      borderRadius: 5,
      borderColor: 'black',
    }
  });

  // / sort background colour out
  // sort button bolour out
  // add logo to centre of page