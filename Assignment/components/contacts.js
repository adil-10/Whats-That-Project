import React, { Component } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Text, TextInput, View, Button, Alert, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import validator from 'validator';
import AsyncStorage from '@react-native-async-storage/async-storage';

class Contacts extends Component{
    constructor(props) {
        super(props);
        this.state = {
          isLoading: true,
          email: '',
          emailResult: '',
          accountFound: null
        };
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
      
          if (json[0]?.email === email) { 
            this.setState({
              emailResult: email,
              accountFound: true
            });
          } 
          else {
            this.setState({
              emailResult: "Email not found: please try again",
              accountFound: false
            });
          }
        } 
        catch (error) {
          console.log(error);
        }
      };
      
      
      
    
    render(){
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
                    style={styles.addButton}>
                        <Text>Add</Text></TouchableOpacity>
                </View>
                )}

                {/* if account not found show text result, email not found */}
                {this.state.accountFound === false && (
                    <Text>{this.state.emailResult}</Text>  
                )}

            </View>
        );
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
      borderWidth: 1,
      borderColor: 'black',
      width: '100%',
      height: 50,
      marginVertical: '2%',
      paddingHorizontal: 5,
      color: 'black',
      flexDirection: 'row',
      alignItems: 'center',
      textAlign: 'center',
      justifyContent: 'space-between', // Updated to use space-between for horizontal alignment
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