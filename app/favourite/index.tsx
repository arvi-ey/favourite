import Ionicons from '@expo/vector-icons/Ionicons';
import { Image, StyleSheet, Platform, View, Text, Dimensions, SafeAreaView, FlatList, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from '@/hooks/useColorScheme';
const { height, width } = Dimensions.get('window');
import { useNavigation } from '@react-navigation/native';
import { useLayoutEffect } from 'react';

export default function TabTwoScreen() {
    const colorScheme = useColorScheme();
    const [favourite, setFavourite] = useState<string[]>([]);
    const navigation = useNavigation();

    useEffect(() => {

        GetFavourites()
    }, [])

    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'Favourite User',
        });
    }, [navigation]);


    interface User {
        id: number;
        email: string;
        first_name: string;
        last_name: string;
        avatar: string;
    }

    const GetFavourites = async () => {
        const storedFavorites = await AsyncStorage.getItem('favorites');
        if (storedFavorites) {
            setFavourite(JSON.parse(storedFavorites))
        }
    };


    const ShowFavouriteUserList = ({ data }: { data: string }) => {
        const [userData, setUserData] = useState<User | null>(null);
        useEffect(() => {
            GetSingleuser(data)
        }, [])

        const GetSingleuser = async (id: string) => {
            const result = await fetch(`https://reqres.in/api/users/${id}`)
            const data = await result.json()
            setUserData(data.data)
        }



        return (
            <View style={{ marginTop: 10, height: 70, alignItems: 'center', width: width - 40, flexDirection: "row", gap: 25, }} >
                <Image source={{ uri: userData?.avatar }} style={{ height: 50, width: 50, borderRadius: 25 }} />
                <View style={{ height: 50, justifyContent: "center", width: "60%", }} >
                    <Text style={{ color: colorScheme === 'dark' ? 'white' : 'black', fontSize: 18, fontWeight: "900" }}>
                        {userData?.first_name} {userData?.last_name}
                    </Text>
                    <Text style={{ color: colorScheme === 'dark' ? 'white' : 'black', fontSize: 15, fontWeight: "400" }}>
                        {userData?.email}
                    </Text>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.main_view}>
            <FlatList
                data={favourite}
                renderItem={({ item }) => <ShowFavouriteUserList data={item} />}
                keyExtractor={(item) => item.toString()}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    main_view: {
        flex: 1,
        alignItems: 'center'
    }
});
