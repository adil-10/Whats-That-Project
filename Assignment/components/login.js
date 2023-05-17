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
  //check if a user is logged in, is so send user to homepage
  async componentDidMount() {
    try {
      const userId = await AsyncStorage.getItem("@user_id");
      const sessionToken = await AsyncStorage.getItem(
        "@session_token"
      );
      if (userId && sessionToken) {
        this.props.navigation.navigate("tabNav");
      }

    } catch (error) {
      console.error(error);
    }
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
  // call to login user
  loginUser = async () => {
    const navigation = this.props.navigation;

    const { email, password } = this.state;

    // validations
    if (email == "" || password == "") {
      this.showModal('Ensure email and password field are not empty');
      return false;
    }

    if (typeof email != "string" || typeof password != "string") {
      this.showModal('Enter valid characters');
      return false;
    }

    if (!this.validateEmail(email)) {
      this.showModal('Email invalid format');
      return false;
    }

    //API call to login user
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
          this.showModal('Invalid Email or Password');
          return false;
        }
        else if (response.status === 500) {
          this.showModal('Internal Server Error');
          return false;
        }
        const responseJson = await response.json();
        if (response.status === 200) {
          //generate store active userid and session token within asyncstorage
          await AsyncStorage.setItem('@user_id', responseJson.id);
          await AsyncStorage.setItem('@session_token', responseJson.token);
          navigation.navigate('tabNav');
          this.showModal('User successfully logged in');
          return false;
        }
        console.log(response.status)
      })
      .catch((error) => {
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