import React, { Component } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Text, TextInput, View, Modal, Alert, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

export default class ChangePass extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      confirmPassword: '',
      password: '',
      isModalVisible: false,
      modalMessage: ''
    };
  }

  closeModal = () => {
    this.setState({ isModalVisible1: false });
  };

  updateUser = async () => {
    const passwdregex = /^(?=.*[0-9])(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
    const { password, confirmPassword } = this.state;

    if (password == '' || confirmPassword == '') {
      this.setState({
        isModalVisible: true,
        modalMessage: 'Ensure fields are not empty',
      });
      setTimeout(() => {
        this.setState({ isModalVisible: false }); // close the modal after 2 seconds
      }, 2000);
      return false;
    }

    if (this.state.confirmPassword != this.state.password) {
      this.setState({
        isModalVisible: true,
        modalMessage: 'Passwords do not match',
      });
      // throw 'invalid email or pass'
      setTimeout(() => {
        this.setState({ isModalVisible: false }); // close the modal after 2 seconds
      }, 2000);
      return false;
    }

    if (!passwdregex.test(this.state.password)) {
      this.setState({
        isModalVisible: true,
        modalMessage: 'Enter a valid password',
      });
      // throw 'invalid email or pass'
      setTimeout(() => {
        this.setState({ isModalVisible: false }); // close the modal after 2 seconds
      }, 2000);
      return false;
      // return passwdregex.test(this.state.userData.password);
    }

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
        if (response.status === 400) {
          this.setState({
            isModalVisible: true,
            modalMessage: 'Bad request',
          });
          // throw 'invalid email or pass'
          setTimeout(() => {
            this.setState({ isModalVisible: false }); // close the modal after 2 seconds
          }, 2000);
        }
        if (response.status === 401) {
          this.setState({
            isModalVisible: true,
            modalMessage: 'Unauthorised',
          });
          // throw 'invalid email or pass'
          setTimeout(() => {
            this.setState({ isModalVisible: false }); // close the modal after 2 seconds
          }, 2000);
        }
        if (response.status === 404) {
          this.setState({
            isModalVisible: true,
            modalMessage: 'User not found',
          });
          // throw 'invalid email or pass'
          setTimeout(() => {
            this.setState({ isModalVisible: false }); // close the modal after 2 seconds
          }, 2000);
        }
        if (response.status === 500) {
          this.setState({
            isModalVisible: true,
            modalMessage: 'Network error',
          });
          // throw 'invalid email or pass'
          setTimeout(() => {
            this.setState({ isModalVisible: false }); // close the modal after 2 seconds
          }, 2000);
        }
        if (response.status === 403) {
          this.setState({
            isModalVisible: true,
            modalMessage: 'Forbidden',
          });
          // throw 'invalid email or pass'
          setTimeout(() => {
            this.setState({ isModalVisible: false }); // close the modal after 2 seconds
          }, 2000);
        }
        if (response.status === 200) {
          this.setState({
            isModalVisible: true,
            modalMessage: 'Update Complete',
          });
          // throw 'invalid email or pass'
          setTimeout(() => {
            this.setState({ isModalVisible: false }); // close the modal after 2 seconds
          }, 2000);
        }

        console.log('user updated')
      })
      .catch((error) => {
        console.log(error)
      })
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
})
