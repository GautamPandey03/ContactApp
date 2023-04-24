import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { openDatabase } from 'react-native-sqlite-storage';
import { Swipeable } from 'react-native-gesture-handler';
let db = openDatabase({ name: 'UserDatabase4.db' });

const Item = ({ item, index }) => {
    const navigation = useNavigation();
    const [userList, setUserList] = useState([]);
    const isFocused = useIsFocused();
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



    const leftSwipe = () => {
        return (
            <View style={{ backgroundColor: 'white', height: 100, flexDirection: 'row' }}>
                <TouchableOpacity style={{
                    width: 100,
                    height: 100,
                    backgroundColor: 'blue',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
                    onPress={() => {
                        navigation.navigate('EditUser', {
                            data: {
                                name: item.name,
                                landline: item.landline,
                                phoneNumber: String(item.phoneNumber),
                                id: item.user_id,
                            },
                        });
                    }}>
                    <Image
                        source={require('../images/edit.png')}
                        style={{ width: 30, height: 30, tintColor: 'white' }}
                    />
                </TouchableOpacity>
                <TouchableOpacity style={{
                    width: 100,
                    height: 100,
                    backgroundColor: 'red',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
                    onPress={() => {
                        deleteUser(item.user_id);
                    }}
                >
                    <Image
                        source={require('../images/delete.png')}
                        style={{ width: 30, height: 30, tintColor: 'white' }}
                    />
                </TouchableOpacity>

            </View>
        )
    }

    const colors = ['#FF5733', '#C70039', '#900C3F', '#581845', '#1E8449', '#2874A6', '#7D3C98', '#2E4053', '#922B21', '#6E2C00'];

    return (
        <Swipeable renderLeftActions={leftSwipe}>
            <View>
                <TouchableOpacity style={{
                    width: '90%',
                    height: 70,
                    alignSelf: 'center',
                    borderWidth: 0.5,
                    borderColor: '#fff',
                    borderRadius: 10,
                    marginTop: 10,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
                    onPress={() => {
                        navigation.navigate('UserDetails', {
                            data: {
                                name: item.name,
                                landline: String(item.landline),
                                phoneNumber: String(item.phoneNumber),
                                id: item.user_id,
                            },
                        });

                    }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Image
                            source={require('../images/user.png')}
                            style={{ width: 40, height: 40, marginLeft: 15 }}
                        />
                        <View style={{ padding: 10 }}>
                            <Text style={{ color: colors[index % colors.length], fontSize: 24 }}>{item.name}</Text>
                        </View>
                    </View>
                    {<View style={{ alignItems: 'flex-end' }}>
                        <TouchableOpacity
                            onPress={() => {
                                navigation.navigate('EditUser', {
                                    data: {
                                        name: item.name,
                                        landline: item.landline,
                                        phoneNumber: String(item.phoneNumber),
                                        id: item.user_id,
                                    },
                                });
                            }}>
                            <Image
                                source={require('../images/edit.png')}
                                style={styles.icons}
                            />
                        </TouchableOpacity>
                        
                    </View> }
                </TouchableOpacity>
            </View>
        </Swipeable>
    );
};
export default Item;
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    drawerButton: {
        marginLeft: 10,
    },
    addIcon: {
        bottom: 10,
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
        color: '#fff',
        fontSize: 18,
    },
    // userItem: {
    //   width: '100%',
    //   backgroundColor: '#fff',
    //   padding: 10,
    // },
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