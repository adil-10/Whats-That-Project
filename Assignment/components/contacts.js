import React, { Component } from 'react';
import { Text, Modal, View, Button, Image, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MenuProvider, Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';

export default class Contacts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      user_id: '',
      userData: [],
      isLoading: true,
      isModalVisible: false,
      accountFound: null,
      isModalVisible1: false,
      modalMessage: ''
    };
  }
  closeModal = () => {
    this.setState({ isModalVisible1: false });
  };
  // getUserPhoto = async (user_id) => {

  //   const response = await fetch(`http://localhost:3333/api/1.0.0/user/${user_id}/photo`, {
  //     method: "GET",
  //     headers: {
  //       'Accept': 'image/png',
  //       'X-Authorization': await AsyncStorage.getItem('@session_token'),
  //     }
  //   });
  //   if (response.ok) {
  //     const resBlob = await response.blob();
  //     return URL.createObjectURL(resBlob);
  //   } else {
  //     console.log('Error retrieving user photo');
  //     return null;
  //   }
  // };

  //display user data

  displayContacts = async () => {
    try {
      let response = await fetch("http://127.0.0.1:3333/api/1.0.0/contacts", {
        method: 'GET',
        headers: {
          'X-Authorization': await AsyncStorage.getItem('@session_token'),
        },
      });
      if (response.status === 401) {
        this.setState({
          isModalVisible1: true,
          modalMessage: 'Unauthorised',
        }); console.log(isModalVisible1)
        // throw 'invalid email or pass'
        setTimeout(() => {
          this.setState({ isModalVisible1: false }); // close the modal after 2 seconds
        }, 2000);
      }
      else if (response.status === 500) {
        this.setState({
          isModalVisible1: true,
          modalMessage: 'Network Error',
        });
        // throw 'invalid email or pass'
        setTimeout(() => {
          this.setState({ isModalVisible1: false }); // close the modal after 2 seconds
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

  displayBlockedContacts = async () => {
    try {
      const userId = await AsyncStorage.getItem('@user_id');
      let response = await fetch("http://127.0.0.1:3333/api/1.0.0/blocked", {
        method: 'GET',
        headers: {
          'X-Authorization': await AsyncStorage.getItem('@session_token'),
        },
      });
      if (response.status === 401) {
        this.setState({
          isModalVisible1: true,
          modalMessage: 'Unauthorised',
        }); console.log('unauthorised')
        // throw 'invalid email or pass'
        setTimeout(() => {
          this.setState({ isModalVisible1: false }); // close the modal after 2 seconds
        }, 2000);
      }
      else if (response.status === 500) {
        this.setState({
          isModalVisible1: true,
          modalMessage: 'Network Error',
        });
        // throw 'invalid email or pass'
        setTimeout(() => {
          this.setState({ isModalVisible1: false }); // close the modal after 2 seconds
        }, 2000);
      }
      else if (response.status === 200) {
        let json = await response.json();
        console.log('ok')
        this.setState({
          isLoading: false,
          userData1: json,
        });
      }
    }
    catch (error) {
      console.log(error);
    }
  };

  unBlock = async (user_id) => {
    return fetch("http://127.0.0.1:3333/api/1.0.0/user/" + user_id + "/block", {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': await AsyncStorage.getItem('@session_token'),
      },
    })
      .then((response) => {
        if (response.status === 200) {
          this.setState({
            isModalVisible1: true,
            modalMessage: 'User Blocked',
          });
          // throw 'invalid email or pass'
          setTimeout(() => {
            this.setState({ isModalVisible1: false }); // close the modal after 2 seconds
          }, 2000);
          this.displayBlockedContacts();
          this.displayContacts();
        }
        else if (response.status === 400) {
          this.setState({
            isModalVisible1: true,
            modalMessage: 'You can not block yourself',
          });
          // throw 'invalid email or pass'
          setTimeout(() => {
            this.setState({ isModalVisible1: false }); // close the modal after 2 seconds
          }, 2000);
        }
        else if (response.status === 401) {
          this.setState({
            isModalVisible1: true,
            modalMessage: 'Unauthorised',
          });
          // throw 'invalid email or pass'
          setTimeout(() => {
            this.setState({ isModalVisible1: false }); // close the modal after 2 seconds
          }, 2000);
        }
        else if (response.status === 404) {
          this.setState({
            isModalVisible1: true,
            modalMessage: 'User not found',
          });
          // throw 'invalid email or pass'
          setTimeout(() => {
            this.setState({ isModalVisible1: false }); // close the modal after 2 seconds
          }, 2000);
        }
        else if (response.status === 500) {
          this.setState({
            isModalVisible1: true,
            modalMessage: 'Network Error',
          });
          // throw 'invalid email or pass'
          setTimeout(() => {
            this.setState({ isModalVisible1: false }); // close the modal after 2 seconds
          }, 2000);
        }
      })
      .catch((error) => {
        console.log('error:', error);
      })
  }

  componentWillUnmount() {
    console.log("HomePage unmounted");
    this.displayContacts();
    clearInterval(this.interval);
  }
  componentDidMount() {

    this.displayContacts();
    this.displayBlockedContacts();
    this.interval = setInterval(() => this.displayContacts(), 5000);
    // this.getUserPhoto();
  }

  deleteContact = async (user_id) => {
    return fetch("http://127.0.0.1:3333/api/1.0.0/user/" + user_id + "/contact", {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': await AsyncStorage.getItem('@session_token'),
      },
    })

      .then((response) => {
        if (response.status === 200) {
          this.setState({
            isModalVisible1: true,
            modalMessage: 'User Deleted',
          });
          // throw 'invalid email or pass'
          setTimeout(() => {
            this.setState({ isModalVisible1: false }); // close the modal after 2 seconds
          }, 2000);
          this.displayContacts();
        }
        else if (response.status === 400) {
          this.setState({
            isModalVisible1: true,
            modalMessage: 'You can not remove yourself',
          });
          // throw 'invalid email or pass'
          setTimeout(() => {
            this.setState({ isModalVisible1: false }); // close the modal after 2 seconds
          }, 2000);
        }
        else if (response.status === 401) {
          this.setState({
            isModalVisible1: true,
            modalMessage: 'Unauthorised',
          });
          // throw 'invalid email or pass'
          setTimeout(() => {
            this.setState({ isModalVisible1: false }); // close the modal after 2 seconds
          }, 2000);
        }
        else if (response.status === 404) {
          this.setState({
            isModalVisible1: true,
            modalMessage: 'User not found',
          });
          // throw 'invalid email or pass'
          setTimeout(() => {
            this.setState({ isModalVisible1: false }); // close the modal after 2 seconds
          }, 2000);
        }
        else if (response.status === 500) {
          this.setState({
            isModalVisible1: true,
            modalMessage: 'Network Error',
          });
          // throw 'invalid email or pass'
          setTimeout(() => {
            this.setState({ isModalVisible1: false }); // close the modal after 2 seconds
          }, 2000);
        }
      })
      .catch((error) => {
        console.log(error);
      })
  }

  blockUser = async (user_id) => {
    return fetch("http://127.0.0.1:3333/api/1.0.0/user/" + user_id + "/block", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': await AsyncStorage.getItem('@session_token'),
      },
    })
      .then((response) => {
        if (response.status === 200) {
          this.setState({
            isModalVisible1: true,
            modalMessage: 'User Blocked',
          });
          // throw 'invalid email or pass'
          setTimeout(() => {
            this.setState({ isModalVisible1: false }); // close the modal after 2 seconds
          }, 2000);
          this.displayContacts();
          this.displayBlockedContacts();
        }
        else if (response.status === 400) {
          this.setState({
            isModalVisible1: true,
            modalMessage: 'You can not block yourself',
          });
          // throw 'invalid email or pass'
          setTimeout(() => {
            this.setState({ isModalVisible1: false }); // close the modal after 2 seconds
          }, 2000);
        }
        else if (response.status === 401) {
          this.setState({
            isModalVisible1: true,
            modalMessage: 'Unauthorised',
          });
          // throw 'invalid email or pass'
          setTimeout(() => {
            this.setState({ isModalVisible1: false }); // close the modal after 2 seconds
          }, 2000);
        }
        else if (response.status === 404) {
          this.setState({
            isModalVisible1: true,
            modalMessage: 'User not found',
          });
          // throw 'invalid email or pass'
          setTimeout(() => {
            this.setState({ isModalVisible1: false }); // close the modal after 2 seconds
          }, 2000);
        }
        else if (response.status === 500) {
          this.setState({
            isModalVisible1: true,
            modalMessage: 'Network Error',
          });
          // throw 'invalid email or pass'
          setTimeout(() => {
            this.setState({ isModalVisible1: false }); // close the modal after 2 seconds
          }, 2000);
        }
      })
      .catch((error) => {
        console.log('error:', error);
      })
  }

  toggleModal = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  }


  // display search user in flat list
  render() {
    const navigation = this.props.navigation;
    if (this.state.isLoading) {
      return (
        <View>
          <ActivityIndicator />
        </View>
      );
    }
    else {
      return (
        <View style={styles.container}>

          <View style={styles.header}>
            <Text style={styles.headerText}>Whats That</Text>
          </View>

          <TouchableOpacity
            style={styles.searchButton}
            onPress={() => navigation.navigate("SearchContact")}>
            <Text style={styles.searchButtonText}> Click here to search</Text>
          </TouchableOpacity>

          <FlatList
            data={this.state.userData}
            renderItem={({ item }) => {
              // this.getUserPhoto(item.user_id);
              return (
                <View>
                  <View style={styles.contactsView}>
                    <View>
                      {/* <View style={styles.imageView}>
                        {this.state.photo &&
                          <Image
                            source={{ uri: this.state.photo }}
                            style={{ width: "100%", height: "100%" }}
                          />
                        }
                      </View> */}
                      <Text style={styles.textView}>{item.first_name} {item.last_name}</Text>
                      <Text style={styles.textView}>{item.email}</Text>
                    </View>

                    <View style={styles.Icon}>
                      <MenuProvider style={{ flexDirection: 'column', padding: 14 }}>
                        <Menu>
                          <MenuTrigger text='...' customStyles={{ triggerText: { fontSize: 20, fontWeight: 'bold' } }} />
                          <MenuOptions>
                            <MenuOption onSelect={() => this.deleteContact(item.user_id)} text='Delete' />
                            <MenuOption onSelect={() => this.blockUser(item.user_id)} text='Block' />
                          </MenuOptions>
                        </Menu>
                      </MenuProvider>
                    </View>
                  </View>
                  <View style={styles.separator} />
                </View>
              );
            }}

            keyExtractor={({ user_id }, index) => user_id}
          />
          <View style={styles.blockImageStyle}>
            <TouchableOpacity style={styles.addStyle} onPress={this.toggleModal}>
              <Image style={styles.imageStyle} source={{ uri: "https://images.freeimages.com/fic/images/icons/2463/glossy/512/user_male_block.png" }} />
            </TouchableOpacity>
          </View>

          <Modal visible={this.state.isModalVisible} animationType="slide">
            <View style={styles.modalContent}>
              <FlatList
                data={this.state.userData1}
                renderItem={({ item }) => (
                  <View style={styles.contactView}>
                    <View style={styles.contactInfo}>
                      <Text style={styles.modalName}>{item.first_name} {item.last_name}</Text>
                      <Text style={styles.modalData}>{item.email}</Text>
                    </View>
                    <TouchableOpacity style={styles.unblockButton} onPress={() => this.unBlock(item.user_id)}>
                      <Text style={styles.buttonText}>Unblock</Text>
                    </TouchableOpacity>
                  </View>
                )}
                keyExtractor={({ user_id }, index) => user_id}
              />
              <TouchableOpacity style={styles.closeButton} onPress={() => this.toggleModal()}>
                <Text style={styles.buttonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </Modal>

          <Modal visible={this.state.isModalVisible1} animationType='slide' transparent={true}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalText}>{this.state.modalMessage}</Text>
            </View>
          </Modal>
        </View>
      );
    }
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    width: '100%',
    // paddingTop: 20,
    // paddingHorizontal: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    width: '100%',
    backgroundColor: '#075e54',
  },
  headerText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 30,
  },
  imageView: {
    width: 200,
    height: 200,
    borderRadius: 150,
    overflow: "hidden",
    marginVertical: '15%',
    color: 'black',
    textAlign: 'center',
    justifyContent: 'center',
  },
  Icon: {
    right: 0,
    marginRight: 10
  },
  searchButton: {
    marginBottom: 25,
    width: '100%',
    height: 30,
    textAlign: 'center',
    justifyContent: 'center',
  },
  searchButtonText: {
    marginTop: 30
  },
  contactsView: {
    paddingTop: 5,
    width: 400,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden', // set overflow to 'hidden'
  },
  textView: {
    fontSize: 15,
    maxWidth: '100%', // set a fixed maximum width for the text
    overflow: 'hidden', // set overflow to 'hidden'
    whiteSpace: 'nowrap', // prevent wrapping of text
    textOverflow: 'ellipsis', // show ellipsis (...) for truncated text
  },
  buttonView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  removeButton: {
    backgroundColor: '#EE5249',
    padding: 7.5,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 35
  },
  blockButton: {
    backgroundColor: '#DB56EB',
    padding: 7.5,
    marginLeft: 7.5,
    marginRight: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',

  },
  separator: {
    borderBottomColor: 'gray',
    borderBottomWidth: 1,
    marginBottom: 10,
    paddingTop: 5,
    width: '100%',
  },
  blockImageStyle: {
    marginLeft: '75%',
    paddingLeft: '8%',
  },
  addStyle: {
    alignSelf: 'flex-start',
  },
  imageStyle: {
    width: 60,
    height: 60,
    zIndex: 1
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
  contactView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  contactInfo: {
    flex: 1,
  },
  modalName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  modalData: {
    fontSize: 16,
    color: 'gray',
  },
  unblockButton: {
    backgroundColor: '#DB56EB',
    borderRadius: 5,
    padding: 10,
  },
  closeButton: {
    alignSelf: 'center',
    borderRadius: 5,
    borderWidth: 1,
    padding: 10,
    marginTop: 20,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'Black',
    textAlign: 'center',
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
//component will focus 