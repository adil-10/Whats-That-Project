import React, { Component } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Text, TextInput, View, Modal, Alert, TouchableOpacity, StyleSheet } from 'react-native';
import validator from 'validator';

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      confirmPassword: '',
      isModalVisible: false,
      modalMessage: '',
    };
    this.addUser = this.addUser.bind(this);
  }

  //toggle open and close modal
  closeModal = () => {
    this.setState({ isModalVisible: false });
  };

  showModal = (message) => {
    this.setState({
      isModalVisible: true,
      modalMessage: message,
    });
    setTimeout(() => {
      this.setState({ isModalVisible: false });
    }, 2000);
  };


  validateEmail = (email) => {
    return validator.isEmail(email);
  }

  validatePassword = (password) => {
    const passwdregex = /^(?=.*[0-9])(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
    return passwdregex.test(password);
  }

  //adding a user 
  addUser() {
    const { first_name, last_name, email, password, confirmPassword } = this.state;
    const navigation = this.props.navigation;
    // make sure email and password isnt empty
    if (first_name == '' || last_name == '' || email == '' || password == '' || confirmPassword == '') {
      this.showModal('Ensure email and password field are not empty');
      return false;
    }

    if (typeof email != 'string' || typeof password != 'string' || typeof first_name != 'string' || typeof last_name != 'string') {
      this.showModal('Enter valid characters');
      return false;
    }

    //call to validate email adn password, if requirements not met return false
    if (!this.validateEmail(email)) {
      this.showModal('Email invalid format');
      return false;
    }

    if (!this.validatePassword(password)) {
      this.showModal('Enter strong password : \n 1 special symbol \n 1 uppercase character \n and a minimum of 8 charactes');
      return false;
    }

    if (confirmPassword != password) {
      this.showModal('Passwords must match');
      return false;
    }

    //call to create an account

    let toSend = {
      first_name: this.state.first_name,
      last_name: this.state.last_name,
      email: this.state.email,
      password: this.state.password
    };

    console.log("HERE", toSend)
    return fetch("http://127.0.0.1:3333/api/1.0.0/user", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(toSend)
    })
      //API response
      .then((response) => {
        console.log(response.status)
        if (response.status === 201) {
          this.showModal('User Created Successfully');
          return false;
        }

        else if (response.status === 400) {
          this.showModal('User already exists');
          return false;
        }
        else if (response.status === 500) {
          this.showModal('Internal Server Error');
          return false;
        }
      })
      .catch((error) => {
        console.log(error)
      })
  }

  //what user sees
  render() {

    const navigation = this.props.navigation;
    return (
      <View style={styles.container}>

        <Text style={styles.title} >Whats That</Text>

        <TextInput style={styles.emailPasswordInput}
          placeholder='Forename'
          onChangeText={first_name => this.setState({ first_name })}
          value={this.state.first_name}
          placeholderTextColor="gray"
        />

        <TextInput style={styles.emailPasswordInput}
          placeholder='Surname'
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
          onChangeText={password => this.setState({ password })}
          value={this.state.password}
          secureTextEntry={true}
          placeholderTextColor="gray"
        />

        <TextInput style={styles.emailPasswordInput}
          placeholder="Confirm Password"
          onChangeText={confirmPassword => this.setState({ confirmPassword })}
          value={this.state.confirmPassword}
          secureTextEntry={true}
          placeholderTextColor="gray"
        />

        <TouchableOpacity style={styles.loginButton}
          onPress={this.addUser}>

          <Text>Sign Up</Text>

        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text>Have an account?</Text>
        </TouchableOpacity>

        <Modal visible={this.state.isModalVisible} animationType='slide' transparent={true}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>{this.state.modalMessage}</Text>
          </View>
        </Modal>

      </View>
    );
  }
}

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
  },
  modalContainer: {
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalText: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 20,
    backgroundColor: '#333',
    borderRadius: 10,
  },
});

  // / sort background colour out
  // sort button bolour out
  // add logo to centre of page