import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  FlatList,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import React, {useState, useEffect} from 'react';
import {openDatabase} from 'react-native-sqlite-storage';
let db = openDatabase({name: 'UserDatabase4.db'});
import {useRoute, useIsFocused} from '@react-navigation/native';
const UserDetails = ({navigation}) => {
  const route = useRoute();
  const isFocused = useIsFocused();
  const [userList, setUserList] = useState([]);
  useEffect(() => {
    getData();
  }, [isFocused]);
  const getData = () => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM table_user ORDER BY name',
        [],
        (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i)
            temp.push(results.rows.item(i));
          setUserList(temp);
        },
      );
    });
  };
  let deleteUser = id => {
    db.transaction(tx => {
      tx.executeSql(
        'DELETE FROM  table_user where user_id=?',
        [id],
        (tx, results) => {
          console.log('Results', results.rowsAffected);
          if (results.rowsAffected > 0) {
            Alert.alert(
              'Success',
              'User deleted successfully',
              [
                {
                  text: 'Ok',
                  onPress: () => {
                    getData();
                  },
                },
              ],
              {cancelable: false},
            );
          } else {
            alert('Please insert a valid User Id');
          }
        },
      );
    });
  };
  return (
    <View style={{flex: 1, backgroundColor: 'skyblue'}}>
      <View>
        <View
          style={{
            width: '100%',
            height: 60,
            flexDirection: 'row',
            alignItems: 'center',
            paddingLeft: 20,
          }}></View>
        <Image
          source={require('../images/user.png')}
          style={{width: 60, height: 60, marginTop: 50, alignSelf: 'center'}}
        />
        <Text
          style={{
            color: 'black',
            alignSelf: 'center',
            marginTop: 20,
            fontSize: 30,
          }}>
          {route.params.data.name}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'flex-start',
            alignItems: 'center',
            height: 60,
            marginTop: 50,
          }}>
          <FontAwesome name="phone" size={30} marginLeft={10} color="#333" />

          <Text
            style={{
              color: 'black',
              alignSelf: 'flex-start',
              marginTop: 6,
              marginLeft: 10,
              fontSize: 30,
            }}>
            {route.params.data.phoneNumber}
          </Text>
        </View>
      </View>
    </View>
  );
};
export default UserDetails;
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  textContainer: {
    marginLeft: 20,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  phone: {
    fontSize: 16,
    color: '#999',
  },
  container: {
    flex: 1,
  },
  icons: {
    width: 24,
    height: 24,
  },
});
