import React, { Component } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Text, TextInput, View, Button, Alert, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator} from 'react-native';
import validator from 'validator';
import AsyncStorage from '@react-native-async-storage/async-storage';

class Contacts extends Component{
    constructor(props) {
        super(props);
        this.state = {
          isLoading: true,
          email: '',
          emailResult: '',
          accountFound: null,
          userData: []
        };
      }

        //display user data
  displayContacts = async () => {
    try {
      const userId = await AsyncStorage.getItem('@user_id');

      let response = await fetch("http://127.0.0.1:3333/api/1.0.0/contacts", {
        method: 'GET',
        headers: {
          'X-Authorization': await AsyncStorage.getItem('@session_token'),
        },
      });
      let json = await response.json();
      this.setState({
        isLoading: false,
        userData: json,
      });
    } 
    catch (error) {
      console.log(error);
    }
  };

  componentDidMount() {
    this.displayContacts();
  }
      //needs validation for if email not found
      SearchUser = async () => {
        try {
          const userId = await AsyncStorage.getItem('@user_id');
          const email = this.state.email;
          let response = await fetch("http://127.0.0.1:3333/api/1.0.0/search?q=" + email, {
            method: 'GET',
            headers: {
              'X-Authorization': await AsyncStorage.getItem('@session_token'),
            },
          });
      
          let json = await response.json();
          // if email matches email in DB, store email in email result, get id of user, to be used later to add 
          if (json[0]?.email === email) { 
            this.setState({
              emailResult: email,
              accountFound: true,
              //get user id of searched contact
              user_id: json[0].user_id,
            });
          } 
          else {
            this.setState({
              emailResult: "Email not found: please try again",
              accountFound: false,
            });
          }
        } 
        catch (error) {
          console.log(error);
        }
      };
      
      addContact = async () => {
        const userId = await AsyncStorage.getItem('@user_id');
        const user_id =  parseInt(this.state.user_id);

        let toSend = {
          user_id: user_id,
          };

        return fetch("http://127.0.0.1:3333/api/1.0.0/user/"  + user_id + "/contact" ,{
          method: 'POST',
          headers: {
            'Content-Type' : 'application/json',
            'X-Authorization': await AsyncStorage.getItem('@session_token')
          },
          body: JSON.stringify(toSend)
        })
        .then(async (response) => {
            console.log('user added');
        })
        .catch((error) => {
          console.log('error:', error);
        })
        }
      
    render(){
      if(this.state.isLoading){
        return(
          <View>
            <ActivityIndicator />
          </View>
        );
      }
      else{
        return(
            <View style={styles.container}>
                <View style={styles.inputContainer}>
                <TextInput
                style={styles.inputBox}
                placeholder="Enter email"
                placeholderTextColor="gray"
                onChangeText={(text) => this.setState({ email: text })}/>
                
                <TouchableOpacity 
                style={styles.buttonDesign} 
                onPress={() => this.SearchUser()}>
                    <Text> Search</Text>
                </TouchableOpacity>
                </View>
                
                {/* if account found email address */}
                {this.state.accountFound === true && (
                <View style={styles.chatView}>
                    <Text>{this.state.emailResult}</Text>
                    <TouchableOpacity 
                    style={styles.addButton}
                    onPress={() => this.addContact()}>
                        <Text>Add</Text></TouchableOpacity>
                </View>
                )}

                {/* if account not found show text result, email not found */}
                {this.state.accountFound === false && (
                    <Text>{this.state.emailResult}</Text>  
                )}
                {/* <View style={styles.chatView}> */}
                <FlatList
                data={this.state.userData}
                renderItem={({item}) =>(
                  <View>
                    <Text>{item.first_name} {item.last_name} {item.email}</Text>
                    <TouchableOpacity
                    title="delete"
                    onPress={() =>console.log("Success")}/>
              </View>
              )}
              keyExtractor={({user_id}, index) => user_id}
              />
              {/* </View> */}
            </View>
        );
    }
}
}

export default Contacts;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white',
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
      width: '100%',
      paddingTop: 20,
      paddingHorizontal: 20,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      marginVertical: 10,
      paddingHorizontal: 5,
    },
    chatView: {
      borderWidth: 0.5,
      borderRadius: 5,
      borderColor: 'black',
      width: '100%',
      height: 50,
      marginVertical: '2%',
      paddingHorizontal: 5,
      color: 'black',
      flexDirection: 'row',
      alignItems: 'center',
      textAlign: 'center',
      justifyContent: 'space-between',
    },
    inputBox: {
      borderWidth: 1,
      borderColor: 'gray',
      width: '60%',
      height: 50,
      marginVertical: '2%',
      paddingHorizontal: 5,
      color: 'black',
      textAlign: 'center',
      justifyContent: 'center',
    },
    buttonDesign: {
      marginVertical: 10,
      paddingVertical: 5,
      paddingHorizontal: 10,
      width: '35%',
      textAlign: 'center',
      justifyContent: 'center',
      backgroundColor: '#c8ada4',
      borderWidth: 1,
      borderRadius: 10,
      borderColor: 'black',
    },
    addButton: {
      marginVertical: 10,
      paddingVertical: 5,
      paddingHorizontal: 10,
      width: '25%',
      borderWidth: 1,
      borderRadius: 10,
      borderColor: 'black',
      backgroundColor: 'green'
    }
      
  });

  //need to style how the contacts will look