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
        //   searchQuery: '',
          email: '',
          emailResult: ''
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
          this.setState({
            emailResult: this.state.email
          });
        } 
        catch (error) {
          console.log(error);
        }
      };
      
    
    render(){
        return(
            <View style={styles.container}>
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

                <View style={styles.chatView}>
                    <Text>{this.state.emailResult}</Text>
                </View>
            </View>
        );
    }
}

export default Contacts;

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
    chatView: {
        borderWidth: 1,
        borderColor: 'black',
        width: '100%',
        height: 50,
        marginVertical: '2%',
        paddingHorizontal: 5,
        color: 'black',
        textAlign: 'center',
        justifyContent: 'center',
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

    buttonDesign:{
        marginVertical: 10,
        padding: 10,
        width: '75%',
        textAlign: 'center',
        justifyContent: 'center',
        backgroundColor: '#c8ada4',
        borderWidth: 1,
        borderRadius: 10,
        borderColor: 'black',
    }
})
