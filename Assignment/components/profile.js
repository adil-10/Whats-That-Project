import React, { Component } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Text, TextInput, View, Modal, Alert, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import validator from 'validator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DisplayImage from '../MAD_2223_Hardware-master/src/views/display';
export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      first_name: '',
      last_name: '',
      email: '',
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
  //display user data
  //display user data
  //display user data
  getData = async () => {
    try {
      const userId = await AsyncStorage.getItem('@user_id');

      let response = await fetch("http://127.0.0.1:3333/api/1.0.0/user/" + userId, {
        method: 'GET',
        headers: {
          'X-Authorization': await AsyncStorage.getItem('@session_token'),
        },
      });

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
      else if (response.status === 404) {
        this.setState({
          isModalVisible: true,
          modalMessage: 'User not found',
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
        // throw 'invalid email or pass'
        setTimeout(() => {
          this.setState({ isModalVisible: false }); // close the modal after 2 seconds
        }, 2000);
      }
      else if (response.status === 200) {
        let json = await response.json();
        this.setState({
          isLoading: false,
          first_name: json.first_name,
          last_name: json.last_name,
          email: json.email
        });
      }
    }
    catch (error) {
      console.log(error);
    }
  };



  componentDidMount() {
    // const cameraSendToServer = new CameraSendToServer();
    // const container = document.getElementById('container');

    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.getData();
      // container.appendChild(cameraSendToServer.render());
    });

  }

  componentWillUnmount() {
    console.log("Profile unmounted");
    this.unsubscribe();
  }

  // update user info
  updateUser = async () => {
    const userId = await AsyncStorage.getItem('@user_id');
    const { first_name, last_name, email } = this.state;

    if (first_name == '' || last_name == '' || email == '') {
      this.setState({
        isModalVisible: true,
        modalMessage: 'Ensure textboxes are not empty',
      });
      setTimeout(() => {
        this.setState({ isModalVisible: false }); // close the modal after 2 seconds
      }, 2000);
      return false;
    }

    if (typeof email != 'string' || typeof first_name != 'string' || typeof last_name != 'string') {
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

    let toSend = {
      first_name: this.state.first_name,
      last_name: this.state.last_name,
      email: this.state.email,
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

  //logout delete session token and id
  logout = async () => {
    const navigation = this.props.navigation;
    console.log('logout');
    try {
      let response = await fetch("http://127.0.0.1:3333/api/1.0.0/logout", {
        method: 'POST',
        headers: {
          'X-Authorization': await AsyncStorage.getItem('@session_token'),
        },
      });

      if (response.status === 401) {
        console.log('Unauthorised');
        await AsyncStorage.removeItem('@session_token');
        await AsyncStorage.removeItem('@user_id');
        navigation.navigate('Login');
        this.setState({
          isModalVisible: true,
          modalMessage: 'Unauthorised',
        });
        setTimeout(() => {
          this.setState({ isModalVisible: false }); // close the modal after 2 seconds
        }, 2000);
      }
      else if (response.status === 500) {
        console.log('Unauthorised');
        await AsyncStorage.removeItem('@session_token');
        await AsyncStorage.removeItem('@user_id');
        navigation.navigate('Login');
        this.setState({
          isModalVisible: true,
          modalMessage: 'Network Error',
        });
        setTimeout(() => {
          this.setState({ isModalVisible: false }); // close the modal after 2 seconds
        }, 2000);
      }
      else if (response.status === 200) {
        await AsyncStorage.removeItem('@session_token');
        await AsyncStorage.removeItem('@user_id');

        this.setState({
          isModalVisible: true,
          modalMessage: 'Logout successful',
        });
        console.log(this.state.isModalVisible)
        setTimeout(() => {
          this.setState({ isModalVisible: false }); // close the modal after 2 seconds
        }, 2000);
        navigation.navigate('Login');
      }
      else {
        this.setState({
          isModalVisible: true,
          modalMessage: 'Something went wrong',
        });
        setTimeout(() => {
          this.setState({ isModalVisible: false }); // close the modal after 2 seconds
        }, 2000);
      }
    }
    catch (error) {
      console.log(error);
    }
  };

  render() {
    const navigation = this.props.navigation;
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Whats That</Text>
        </View>

        <View style={styles.container2}>

          <TouchableOpacity style={styles.profileImage} onPress={() => this.props.navigation.navigate("CameraSendToServer")}>
            <DisplayImage />
          </TouchableOpacity>

          <TextInput
            style={styles.inputBox}
            placeholder="First Name"
            placeholderTextColor="gray"
            onChangeText={(text) => this.setState({ first_name: text })}
            value={this.state.first_name}
          />

          <TextInput
            style={styles.inputBox}
            placeholder="Last Name"
            placeholderTextColor="gray"
            onChangeText={(text) => this.setState({ last_name: text })}
            value={this.state.last_name}
          />

          <TextInput style={styles.inputBox}
            placeholder="Email"
            placeholderTextColor="gray"
            onChangeText={(text) => this.setState({ email: text })}
            value={this.state.email}
          />

          <TouchableOpacity style={styles.buttonDesign} onPress={() => this.updateUser()}>
            <Text>Update</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.buttonDesign} onPress={() => navigation.navigate('ChangePass')}>
            <Text>Change Password</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.buttonDesign} onPress={() => this.logout()}>
            <Text>Logout</Text>
          </TouchableOpacity>

        </View>
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
    width: '100%',
  },
  container2: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#075e54',
  },
  headerText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 30,
  },
  inputBox: {
    borderWidth: 1,
    borderColor: 'gray',
    width: '100%',
    height: 50,
    marginVertical: '2%',
    paddingHorizontal: 5,
    color: 'black',
    textAlign: 'center',
    justifyContent: 'center',
  },
  profileImage: {
    profileImage: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: 'white',
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: 'black',
      overflow: 'hidden', // this is important to clip the image to the circle
    },

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
//isfocuseffect