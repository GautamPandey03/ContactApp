import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {openDatabase} from 'react-native-sqlite-storage';
import {useNavigation} from '@react-navigation/native';
let db = openDatabase({name: 'UserDatabase4.db'});
const AddUser = () => {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [landline, setLandline] = useState('');
  const [phoneNumber,setPhoneNumber] = useState('');
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
  const [agree, setAgree] = useState(false);
  const saveUser = () => {
    if (!name || !landline || !phoneNumber) {
      Alert.alert('Please fill all details');
    } else if (!validateName()) {
      Alert.alert('Please enter a valid name');
    } else if (!validateLandline()) {
      Alert.alert('Please enter a valid landline number');
    } else if (!validatePhone()) {
      Alert.alert('Please enter a valid phone number');
    } else {
      console.log(name, landline, phoneNumber);
      db.transaction(function (tx) {
        tx.executeSql(
          'SELECT * FROM table_user WHERE phoneNumber=?',
          [phoneNumber],
          (_, {rows}) => {
            if (rows.length > 0) {
              Alert.alert('OOPS! Phone number already exists in contact list!!');
            } else {
              tx.executeSql(
                'INSERT INTO table_user (name, landline, phoneNumber) VALUES (?,?,?)',
                [name, landline, phoneNumber],
                (tx, results) => {
                  console.log('Results', results.rowsAffected);
                  if (results.rowsAffected > 0) {
                    Alert.alert(
                      'Success',
                      'Great Registered Successfully',
                      [
                        {
                          text: 'Ok',
                          onPress: () => navigation.navigate('Home'),
                        },
                      ],
                      {cancelable: false},
                    );
                  } else Alert.alert('Registration Failed');
                },
                error => {
                  console.log(error);
                },
              );
            }
          },
        );
      });
    }
  };
  useEffect(() => {
    db.transaction(txn => {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='table_user'",
        [],
        (tx, res) => {
          console.log('item:', res.rows.length);
          if (res.rows.length == 0) {
            txn.executeSql('DROP TABLE IF EXISTS table_user', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS table_user(user_id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, landline TEXT NOT NULL, phoneNumber TEXT UNIQUE NOT NULL)',
              [],
            );
          }
        },
        error => {
          console.log(error);
        },
      );
    });
  }, []);
  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Enter Name"
        style={styles.input}
        value={name}
        onChangeText={setName}
      />
      <TextInput
        placeholder="Enter Landline Number"
        value={landline}
        keyboardType="numeric"
        maxLength={10}
        onChangeText={setLandline}
        style={[styles.input, {marginTop: 20}]}
      />
      <TextInput
        placeholder="Enter Mobile Number"
        value={phoneNumber}
        keyboardType="numeric"
        onChangeText={setPhoneNumber}
        maxLength={10}
        style={[styles.input, {marginTop: 20}]}
      />
      <TouchableOpacity
        style={[
          styles.buttonStyle,
          {
            backgroundColor: agree ? 'orange' : 'green',
          },
        ]}
        onPress={() => {
          saveUser();
        }}>
        <Text style={styles.btnText}>Save User</Text>
      </TouchableOpacity>
    </View>
  );
};
export default AddUser;
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
  buttonStyle: {
    width: '80%',
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    alignSelf: 'center',
  },
  btnText: {
    color: '#fff',
    fontSize: 18,
  },
});
