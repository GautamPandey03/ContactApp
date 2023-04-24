import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { openDatabase } from 'react-native-sqlite-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
let db = openDatabase({ name: 'UserDatabase4.db' });
const EditUser = () => {
  const route = useRoute();
  console.log(route.params.data);
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [landline, setLandline] = useState(route.params.data.landline);
  const [phoneNumber, setPhoneNumber] = useState(route.params.data.phoneNumber);
  const validateName = () => {
    const regex = /^[a-zA-z ]{2,20}$/;
    return regex.test(name);
  };
  const validatePhone = () => {
    const regex = /^[0-9]{10}$/;
    return regex.test(phoneNumber);
  };
  const validateLandline = () => {
    const regex = /^[0-9]{10}$/;
    return regex.test(landline);
  };
  const updateUser = () => {
    if (!validateName()) {
      Alert.alert('Enter a valid name');
    }
    else if (!validatePhone()) {
      Alert.alert('Enter a valid phone number');
    } else if (!validateLandline()) {
      Alert.alert('Enter a valid landline number');
    }
    else {
      db.transaction(tx => {
        tx.executeSql('SELECT * FROM table_user WHERE phoneNumber=?',
          [phoneNumber],
          (_, { rows }) => {
            if (rows.length > 0) {
              Alert.alert('Phone number already exists in contact list!!');

            }
            else {
              tx.executeSql(
                'UPDATE table_user set name=?, landline=? , phoneNumber=? where user_id=?',
                [name, landline, phoneNumber, route.params.data.id],
                (tx, results) => {
                  console.log('Results', results.rowsAffected);
                  if (results.rowsAffected > 0) {
                    Alert.alert(
                      'Success',
                      'User updated successfully',
                      [
                        {
                          text: 'Ok',
                          onPress: () => navigation.navigate('Home'),
                        },
                      ],
                      { cancelable: false },
                    );
                  } else Alert.alert('Updation Failed');
                },
              );
            }
          }
        )

            });
      }
    };
    useEffect(() => {
      setName(route.params.data.name);
      setLandline(route.params.data.landline);
      setPhoneNumber(route.params.data.phoneNumber);
    }, []);

    return (
      <View style={styles.container}>
        <TextInput
          placeholder="Enter User Name"
          style={styles.input}
          value={name}
          onChangeText={txt => setName(txt)}
        />
        <TextInput
          placeholder="Enter User Landline Number"
          value={landline}
          keyboardType='numeric'
          maxLength={10}
          onChangeText={txt => setLandline(txt)}
          style={[styles.input, { marginTop: 20 }]}
        />
        <TextInput
          placeholder="Enter User Phone Number"
          value={phoneNumber}
          keyboardType='numeric'
          maxLength={10}
          onChangeText={txt => setPhoneNumber(txt)}
          style={[styles.input, { marginTop: 20 }]}
        />
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => {
            updateUser();
          }}>
          <Text style={styles.btnText}>Save User</Text>
        </TouchableOpacity>
      </View>
    );
  };

  export default EditUser;
  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    input: {
      width: '80%',
      height: 50,
      borderRadius: 10,
      borderWidth: 0.3,
      alignSelf: 'center',
      paddingLeft: 20,
      marginTop: 100,
    },
    addBtn: {
      backgroundColor: 'green',
      width: '80%',
      height: 50,
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 30,
      alignSelf: 'center',
    },
    btnText: {
      color: '#orange',
      fontSize: 18,
    },
  });
