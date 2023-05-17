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
    //reference - access method of display image
    this.displayImageRef = React.createRef();
  }

  componentDidMount() {
    const displayImage = new DisplayImage();
    this.getData();
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      // Call the get_profile_image method on the reference 
      this.displayImageRef.current.get_profile_image();
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  //toggle and close modal
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
  //display user data
  getData = async () => {
    try {
      //user id of logged in user from async
      const userId = await AsyncStorage.getItem('@user_id');
      // API call get method
      let response = await fetch("http://127.0.0.1:3333/api/1.0.0/user/" + userId, {
        method: 'GET',
        headers: {
          'X-Authorization': await AsyncStorage.getItem('@session_token'),
        },
      });
      //responses
      if (response.status === 401) {
        this.showModal('Unauthorised');
        return;
      }
      else if (response.status === 404) {
        this.showModal('User not found');
        return;
      }
      else if (response.status === 500) {
        this.showModal('Internal Server Error');
        return;
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

  // update user info
  updateUser = async () => {
    //get user id form async storage
    const userId = await AsyncStorage.getItem('@user_id');
    const { first_name, last_name, email } = this.state;

    //validations
    if (first_name == '' || last_name == '' || email == '') {
      this.showModal('Ensure textboxes are not empty');
      return false;
    }

    if (typeof email != 'string' || typeof first_name != 'string' || typeof last_name != 'string') {
      this.showModal('Enter valid characters');
      return false;
    }

    if (!this.validateEmail(email)) {
      this.showModal('Enter valid email');
      return false;
    }

    let toSend = {
      first_name: this.state.first_name,
      last_name: this.state.last_name,
      email: this.state.email,
    };

    //API call patch method
    return fetch("http://127.0.0.1:3333/api/1.0.0/user/" + userId, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        //check if users session token is active
        'X-Authorization': await AsyncStorage.getItem('@session_token')
      },
      body: JSON.stringify(toSend)
    })
      //response
      .then((response) => {
        if (response.status === 400) {
          this.showModal('Bad request');
          return false;
        }
        if (response.status === 401) {
          this.showModal('Unauthorised');
          return false;
        }
        if (response.status === 404) {
          this.showModal('User not found');
          return false;
        }
        if (response.status === 500) {
          this.showModal('Network error');
          return false;
        }
        if (response.status === 403) {
          this.showModal('Forbidden');
          return false;
        }
        if (response.status === 200) {
          this.showModal('Update Complete');
          return false;
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
      //api call post
      let response = await fetch("http://127.0.0.1:3333/api/1.0.0/logout", {
        method: 'POST',
        headers: {
          //check if session token is active
          'X-Authorization': await AsyncStorage.getItem('@session_token'),
        },
      });
      //response
      if (response.status === 401) {
        console.log('Unauthorised');
        await AsyncStorage.removeItem('@session_token');
        await AsyncStorage.removeItem('@user_id');
        navigation.navigate('Login');
        this.showModal('Unauthorised');
        return false;
      }
      else if (response.status === 500) {
        await AsyncStorage.removeItem('@session_token');
        await AsyncStorage.removeItem('@user_id');
        navigation.navigate('Login');
        this.showModal('Network Error');
        return false;
      }
      else if (response.status === 200) {
        //remove the user id and session token from async storage
        await AsyncStorage.removeItem('@session_token');
        await AsyncStorage.removeItem('@user_id');
        this.showModal('Logout successful');
        navigation.navigate('Login');
        return false;
      }
      else {
        this.showModal('Something went wrong');
        return false;
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
            {/* render display image with reference attribute set to displayImageRef */}
            <DisplayImage ref={this.displayImageRef} />
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