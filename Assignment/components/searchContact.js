//style next page button
//use modals for validations
import React, { Component } from 'react';
import { Text, TextInput, View, Modal, Alert, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

class SearchContact extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      search: '',
      search_in: 'all',
      limit: 8,
      offset: 0,
      accountFound: null,
      user_id: '',
      userData: [],
      isModalVisible: false,
      modalMessage: ''
    };
  }
  closeModal = () => {
    this.setState({ isModalVisible1: false });
  };

  // change so you can search first and last name too
  //needs validation for if email not found
  SearchUser = async () => {
    try {

      const user_id = this.state.user_id;
      const search = this.state.search;
      const search_in = this.state.search_in;
      const limit = this.state.limit;
      const offset = this.state.offset;
      let response = await fetch("http://127.0.0.1:3333/api/1.0.0/search?q=" + search + "&search_in=" + search_in + "&limit=" + limit + "&offset=" + offset, {
        method: 'GET',
        headers: {
          'X-Authorization': await AsyncStorage.getItem('@session_token'),
        },
      });

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
      else if (response.status === 401) {
        this.setState({
          isModalVisible: true,
          modalMessage: 'Unauthorised',
        });
        // throw 'invalid email or pass'
        setTimeout(() => {
          this.setState({ isModalVisible: false }); // close the modal after 2 seconds
        }, 2000);
      }
      else if (response.status === 500) {
        this.setState({
          isModalVisible: true,
          modalMessage: 'Network Error',
        });
        // throw 'invalid email or pass'
        setTimeout(() => {
          this.setState({ isModalVisible: false }); // close the modal after 2 seconds
        }, 2000);
      }
      else if (response.status === 200) {
        let json = await response.json();
        console.log('ok it worked')
        this.setState({
          isLoading: false,
          userData: json,
        });
      }
    }
    catch (error) {
      console.log(error);
    }
  };


  addContact = async (user_id) => {
    let toSend = {
      user_id: user_id,
    };
    return fetch("http://127.0.0.1:3333/api/1.0.0/user/" + user_id + "/contact", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': await AsyncStorage.getItem('@session_token')
      },
      body: JSON.stringify(toSend)
    })
      .then((response) => {
        if (response.status === 200) {
          this.setState({
            isModalVisible: true,
            modalMessage: 'User added',
          });
          // throw 'invalid email or pass'
          setTimeout(() => {
            this.setState({ isModalVisible: false }); // close the modal after 2 seconds
          }, 2000);
          this.SearchUser();
        }
        else if (response.status === 400) {
          this.setState({
            isModalVisible: true,
            modalMessage: 'You can not add yourself',
          });
          // throw 'invalid email or pass'
          setTimeout(() => {
            this.setState({ isModalVisible: false }); // close the modal after 2 seconds
          }, 2000);
        }
        else if (response.status === 401) {
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
            modalMessage: 'Network Error',
          });
          // throw 'invalid email or pass'
          setTimeout(() => {
            this.setState({ isModalVisible: false }); // close the modal after 2 seconds
          }, 2000);
        }
      })
      .catch((error) => {
        console.log('error:', error);
      })
  }



  render() {
    if (this.state.isLoading) {
      return (
        <View>
          <ActivityIndicator />
        </View>
      );
    }
    else {
      const { offset } = this.state;
      return (
        <View style={styles.container}>

          <View style={styles.header}>
            <Text style={styles.headerText}>Whats That</Text>
            <View style={styles.Iconleft}>
              <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                <Ionicons name="arrow-back" size={24} color="black" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.inputBox}
              placeholder="Enter email"
              placeholderTextColor="gray"
              onChangeText={(text) => this.setState({ search: text })} />

            <TouchableOpacity
              style={styles.searchButton}
              onPress={() => this.SearchUser()}>
              <Text> Search</Text>
            </TouchableOpacity>
          </View>

          {this.state.Message ? <Text>{this.state.Message}</Text> : null}

          <FlatList
            data={this.state.userData}
            renderItem={({ item }) => (

              <View>
                <View style={styles.contactsView}>
                  <View>
                    <Text style={styles.textView}>{item.given_name} {item.family_name}</Text>
                    <Text style={styles.textView}>{item.email}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => this.addContact(item.user_id)}>
                    <Text>Add</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            keyExtractor={({ user_id }, index) => user_id}
          />

          <TouchableOpacity
            onPress={() => {
              this.setState({ offset: (offset + 5) }, () => {
                this.SearchUser();
              });
            }}
          ><Text>Next Page</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              this.setState({ offset: (offset - 5) }, () => {
                this.SearchUser();
              });
            }}
          ><Text>previous Page</Text>
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
}
export default SearchContact;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#075e54',
    width: '100%'
  },
  headerText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 30,
  },
  Iconleft: {
    position: 'absolute',
    top: 0,
    left: 0,
    marginLeft: 15,
    marginTop: 10,
  },
  //search box
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 10,
    paddingTop: 5,
    paddingBottom: 5,
    // paddingHorizontal: 5,
    paddingVertical: 20,
  },
  inputBox: {
    borderWidth: 1,
    borderColor: 'gray',
    width: '100%',
    height: 50,
    marginVertical: '2%',
    marginRight: 10,
    paddingHorizontal: 5,
    color: 'black',
    textAlign: 'center',
    justifyContent: 'center',
  },
  searchButton: {
    marginVertical: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    width: '25%',
    height: 45,
    textAlign: 'center',
    justifyContent: 'center',
    backgroundColor: '#c8ada4',
    borderWidth: 1,
    borderRadius: 10,
    borderColor: 'black',
  },
  // contacts
  contactsView: {
    borderBottomColor: 'gray',
    borderBottomWidth: 1,
    marginBottom: 10,
    paddingTop: 5,
    width: 395,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden', // set overflow to 'hidden'
  },
  textView: {
    fontSize: 15,
    paddingLeft: 10,
    width: '100%', // set a fixed maximum width for the text
    overflow: 'hidden', // set overflow to 'hidden'
    whiteSpace: 'nowrap', // prevent wrapping of text
    textOverflow: 'ellipsis', // show ellipsis (...) for truncated text
  },
  addButton: {
    width: '20%',
    textAlign: 'center',
    marginVertical: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: 'black',
    backgroundColor: '#72F3A6',
    marginLeft: 10, // Add this line
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
