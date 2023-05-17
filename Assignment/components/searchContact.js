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
      searchClicked: false,
      isModalVisible: false,
      modalMessage: ''
    };
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

  // search user
  SearchUser = async () => {
    try {
      const search = this.state.search;
      const search_in = this.state.search_in;
      const limit = this.state.limit;
      const offset = this.state.offset;
      //api call url, passing in search in, offset and limit, rendering 8 contacts per page, search with everything (firstname, lastname etc)
      let response = await fetch("http://127.0.0.1:3333/api/1.0.0/search?q=" + search + "&search_in=" + search_in + "&limit=" + limit + "&offset=" + offset, {
        method: 'GET',
        headers: {
          'X-Authorization': await AsyncStorage.getItem('@session_token'),
        },
      });
      //response
      if (response.status === 400) {
        this.showModal('Bad request');
        return false;
      }
      else if (response.status === 401) {
        this.showModal('Unauthorised');
        return false;
      }
      else if (response.status === 500) {
        this.showModal('Network Error');
        return false;
      }
      //success
      else if (response.status === 200) {
        let json = await response.json();
        this.setState({
          isLoading: false,
          userData: json,
          searchClicked: true,
        });
      }
    }
    catch (error) {
      console.log(error);
    }
  };
  //add contact after searching, passing user id as a param for url
  addContact = async (user_id) => {
    //sending user id to api
    let toSend = {
      user_id: user_id,
    };
    return fetch("http://127.0.0.1:3333/api/1.0.0/user/" + user_id + "/contact", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        //check if users session token from async storage
        'X-Authorization': await AsyncStorage.getItem('@session_token')
      },
      body: JSON.stringify(toSend)
    })
      //responses
      .then((response) => {
        if (response.status === 200) {
          this.showModal('User added');
          return false;
        }
        else if (response.status === 400) {
          this.showModal('You can not add yourself');
          return false;
        }
        else if (response.status === 401) {
          this.showModal('Unauthorised');
          return false;
        }
        else if (response.status === 404) {
          this.showModal('User not found');
          return false;
        }
        else if (response.status === 500) {
          this.showModal('Network Error');
          return false;
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
      //used to show the limit and offset of the [age]
      const { offset, searchClicked } = this.state;
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

          {/* Flatlist to display users searched for */}
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
          {/* only enable next and previous buttons when search button clicked and searchClicked is true */}
          {searchClicked && (
            <View style={styles.nextButtonContainer}>
              <View style={styles.next}>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({ offset: (offset + 5) }, () => {
                      this.SearchUser();
                    });
                  }}
                >
                  <Text>Next</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.previous}>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({ offset: (offset - 5) }, () => {
                      this.SearchUser();
                    });
                  }}
                >
                  <Text>Previous</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          {/* modal for validadtions and api responses */}
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
    justifyContent: 'center',
    alignItems: 'center',
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
  nextButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: '35%'
  },
  next: {
    padding: 10
  }
});
