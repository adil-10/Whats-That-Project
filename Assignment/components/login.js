import React, { Component } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Text, TextInput, View, Modal, Alert, TouchableOpacity, StyleSheet } from 'react-native';
import validator from 'validator';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      isModalVisible: false,
      modalMessage: ''
    };
  }
  closeModal = () => {
    this.setState({ isModalVisible: false });
  };

  validateEmail = (email) => {
    return validator.isEmail(email);
  }

  validatePassword = (password) => {
    const passwdregex = /^(?=.*[0-9])(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
    return passwdregex.test(password);
  }

  loginUser = async () => {
    const navigation = this.props.navigation;

    const { email, password } = this.state;

    // make sure email and password isnt empty
    if (email == "" || password == "") {
      this.setState({
        isModalVisible: true,
        modalMessage: 'Ensure email and password field are not empty',
      });
      setTimeout(() => {
        this.setState({ isModalVisible: false }); // close the modal after 2 seconds
      }, 2000);
      return false;
    }

    if (typeof email != "string" || typeof password != "string") {
      this.setState({
        isModalVisible: true,
        modalMessage: 'Enter valid characters',
      });
      setTimeout(() => {
        this.setState({ isModalVisible: false }); // close the modal after 2 seconds
      }, 2000);

      return false;
    }

    //call to validate email adn password, if requirements not met return false
    if (!this.validateEmail(email)) {
      this.setState({
        isModalVisible: true,
        modalMessage: 'Email invalid format',
      });
      setTimeout(() => {
        this.setState({ isModalVisible: false }); // close the modal after 2 seconds
      }, 2000);
      return false;
    }

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
        if (response.status === 400) {
          this.setState({
            isModalVisible: true,
            modalMessage: 'Invalid Email or Password',
          });
          // throw 'invalid email or pass'
          setTimeout(() => {
            this.setState({ isModalVisible: false }); // close the modal after 2 seconds
          }, 2000);

        }
        else if (response.status === 500) {
          this.setState({
            isModalVisible: true,
            modalMessage: 'Internal Server Error',
          });
          setTimeout(() => {
            this.setState({ isModalVisible: false }); // close the modal after 2 seconds
          }, 2000);
          // throw 'network error'
        }
        const responseJson = await response.json();
        if (response.status === 200) {

          await AsyncStorage.setItem('@user_id', responseJson.id);
          await AsyncStorage.setItem('@session_token', responseJson.token);
          navigation.navigate('tabNav');
          this.setState({
            isModalVisible: true,
            modalMessage: 'User successfully logged in',
          });
          setTimeout(() => {
            this.setState({ isModalVisible: false }); // close the modal after 2 seconds
          }, 2000);


        }
        console.log(response.status)
      })
      .catch((error) => {
        // this.setState('error: ', error)
        console.log(error)
      });
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
          onPress={() => this.loginUser()}>
          <Text>log in</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.createButton}
          onPress={() => navigation.navigate('SignUp')}>
          <Text>Create Account</Text>
        </TouchableOpacity>
        {/* </View> */}


        <Modal visible={this.state.isModalVisible} animationType='slide' transparent={true}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>{this.state.modalMessage}</Text>
          </View>
        </Modal>



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