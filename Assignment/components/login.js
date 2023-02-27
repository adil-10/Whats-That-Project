import React, { Component } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Text, TextInput, View, Button, Alert, TouchableOpacity, StyleSheet } from 'react-native';
import validator from 'validator';

class Login extends Component {
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

static navigationOptions = {
    header: null
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
         onChangeText={password => this.setState({ password})}
         value={this.state.password}
         secureTextEntry={true}
         placeholderTextColor="gray"
      /> 
      <View style={styles.buttonsContainer}>
        
      <TouchableOpacity 
      style={styles.loginButton} 
      onPress={() => {
        const isValid = this.validData();
        if (isValid) {
          navigation.navigate('HomePage');
        }
      }}>
        <Text>Log in</Text>
      </TouchableOpacity>

      <TouchableOpacity 
      style={styles.createButton}
      onPress={() => navigation.navigate('SignUp')}>
        <Text>Create Account</Text>
      </TouchableOpacity>
      </View>

      {Message ? <Text>{Message}</Text> : null}
      
      <StatusBar style="auto" />
    </View>
    );
  }}

  export default Login

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
    buttonsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '60%',
    },
    loginButton: {
      marginVertical: 10,
      padding: 10,
      width: '45%',
      textAlign: 'center',
      justifyContent: 'center',
      backgroundColor: 'white',
      borderWidth: 1,
      borderRadius: 5,
      borderColor: 'black',
    },
    createButton: {
      marginVertical: 10,
      padding: 10,
      width: '45%',
      textAlign: 'center',
      justifyContent: 'center',
      backgroundColor: 'white',
      borderWidth: 1,
      borderRadius: 5,
      borderColor: 'black',
    }
  });

