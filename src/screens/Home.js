import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  TextInput,
  Button,
  Image,
} from 'react-native';
import Item from '../Components/Item'
import Ionicons from 'react-native-vector-icons/Ionicons'
import React, { useEffect, useRef, useState } from 'react';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { openDatabase } from 'react-native-sqlite-storage';
import { ScrollView } from 'react-native-gesture-handler';
let db = openDatabase({ name: 'UserDatabase4.db' });
const Home = () => {
  const searchRef = useRef();
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  var [search, setSearch] = useState('');
  const [userList, setUserList] = useState([]);


  const onSearch = (text) => {
    if (text == '') {
      setUserList(getData);
    }
    else {
      let tempList = userList.filter(item => {
        return item.name.toLowerCase().indexOf(text.toLowerCase()) > -1
      });
      setUserList(tempList);
    }

  }

  useEffect(() => {
    getData(userList);
  }, [isFocused]);
  const getData = () => {
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM table_user', [], (tx, results) => {
        var temp = [];
        for (let i = 0; i < results.rows.length; ++i)
          temp.push(results.rows.item(i));
        let templist = temp.sort((a, b) =>
          a.name > b.name ? 1 : -1);
        setUserList(templist);
      });
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
              'User will be deleted',
              [
                {
                  text: 'Ok',
                  onPress: () => {
                    getData();
                  },
                },
              ],
              { cancelable: false },
            );
          } else {
            Alert.alert('Please insert a valid User Id');
          }
        },
      );
    });
  };
  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
     
      <View style={{
        height: 50,
        backgroundColor:'white',
        borderColor: 'grey',
        borderWidth: 0.5,
        flexDirection: 'row',
        alignItems: 'center',
        marginTop:10,
        marginLeft: 15,
        marginRight: 15,
        borderRadius: 10
      }}>
        <TextInput
          ref={searchRef}
          placeholder='Search Contacts...'
          style={{ width: '76%', height: 50 }}
          value={search}
          onChangeText={txt => {
            onSearch(txt);
            setSearch(txt);
          }} />
        {search == '' ? null : (
          <TouchableOpacity
            style={{ marginRight: 15 }}
            onPress={() => {
              searchRef.current.clear();
              onSearch=getData();
              setSearch='';

            }}>
            <Image source={require('../images/close.png')} 
              style={{width:16,height:16,opacity:0.5,marginLeft:140,marginTop:19}}
            />
          
          </TouchableOpacity>
          
        )}
      </View>

      <ScrollView style={{marginBottom:0}}>
        <FlatList
          data={userList}
          renderItem={({ item, index }) => {
            return(
              <Item item={item} index={index}/>
            )
          }}
        />
        </ScrollView>
        <Ionicons
          name='add-circle'
          size={50}
          color='green'
          style={styles.addIcon}
          onPress={() => navigation.navigate('AddUser')}
        />
        
        
    </View>
  );
};
export default Home;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  drawerButton: {
    marginLeft: 10,
  },
  addIcon: {
    bottom:10,
    right: 40,
    position: 'absolute',
    zIndex: 1
  },
  searchBox: {
    borderWidth: 1,
    paddingLeft: 15,
    borderRadius: 10,
  },
  searchIn: {
    fontWeight: 'bold'
  },
  searchImg: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexDirection: 'row',
    ...StyleSheet.absoluteFill,
  },
  addNewBtn: {
    backgroundColor: 'purple',
    width: 150,
    height: 50,
    borderRadius: 20,
    position: 'absolute',
    bottom: 20,
    right: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    color: 'orange',
    fontSize: 18,
  },
  
  itemText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
  },
  belowView: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    marginTop: 20,
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    height: 50,
  },
  icons: {
    width: 24,
    height: 24,
  },
});
