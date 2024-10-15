import { Image, StyleSheet, Platform, View, Text, Dimensions, SafeAreaView, FlatList, TouchableOpacity } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
const { height, width } = Dimensions.get('window');
import { useEffect, useState } from 'react';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { Link, router } from 'expo-router';

export default function HomeScreen() {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const [data, setData] = useState()
  const [favourite, setFavourite] = useState<string[]>([]);


  useEffect(() => {
    FetchUserData()
    GetFavourites()
  }, [])

  const FetchUserData = async () => {
    try {
      const result = await fetch(`https://reqres.in/api/users?page=2`)
      const data = await result.json()
      setData(data.data)
    }
    catch (error) {
      console.error(error)
    }
  }


  type UserData = {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    avatar: string;
  };

  const GetFavourites = async () => {
    const storedFavorites = await AsyncStorage.getItem('favorites');
    if (storedFavorites) {
      setFavourite(JSON.parse(storedFavorites))
    }
  };


  const ShowUserList: React.FC<{ data: UserData }> = ({ data }) => {

    const [added, setAdded] = useState<number | undefined>(undefined);


    const SaveFavouite = async (id: number) => {
      const favarr = [...favourite]
      const data = id.toString()
      const result = favourite.includes(data)
      if (result) {
        const FiltereData = favarr.filter((item) => item !== data)
        await AsyncStorage.setItem('favorites', JSON.stringify(FiltereData));
        GetFavourites()
        return
      }
      favarr.push(data)
      if (favarr.length > 0) {
        const UpdatedValue = removeDuplicates(favarr)
        setFavourite(UpdatedValue)
        await AsyncStorage.setItem('favorites', JSON.stringify(UpdatedValue));
      }
    }

    useEffect(() => {
      checkFavourite()
    }, [data])

    const checkFavourite = () => {
      const result = favourite.includes(data.id.toString())
      if (result === true) {
        setAdded(data.id)
      }
    }

    function removeDuplicates(arr: string[]): string[] {
      const uniqueArray: string[] = [];
      for (let i = 0; i < arr.length; i++) {
        if (!uniqueArray.includes(arr[i])) {
          uniqueArray.push(arr[i]);
        }
      }
      return uniqueArray;
    }

    return (
      <View style={{ marginTop: 10, height: 70, alignItems: 'center', width: width - 40, flexDirection: "row", gap: 25, }} >
        <Image source={{ uri: data?.avatar }} style={{ height: 50, width: 50, borderRadius: 25 }} />
        <View style={{ height: 50, justifyContent: "center", width: "60%", }} >
          <Text style={{ color: colorScheme === 'dark' ? 'white' : 'black', fontSize: 18, fontWeight: "900" }}>
            {data.first_name} {data.last_name}
          </Text>
          <Text style={{ color: colorScheme === 'dark' ? 'white' : 'black', fontSize: 15, fontWeight: "400" }}>
            {data.email}
          </Text>
        </View>
        <TouchableOpacity style={{ height: 50, justifyContent: "center", alignItems: 'center', width: 50 }} onPress={() => SaveFavouite(data.id)}>
          {added === data.id ?
            <MaterialIcons name="favorite" size={30} color="red" />
            :
            <MaterialIcons name="favorite-border" size={30} color="red" />
          }
        </TouchableOpacity>
      </View>
    );
  };



  return (
    <SafeAreaView style={styles.main_view}>
      <FlatList
        data={data}
        renderItem={({ item }) => <ShowUserList data={item} />}
        keyExtractor={(item, index) => item.id}
      />
      <TouchableOpacity onPress={() => router.push('favourite')} style={{ backgroundColor: "blue", padding: 10, borderRadius: 12, marginTop: 20 }} >
        <Text style={{ color: "white", fontSize: 15, fontWeight: "600" }}>
          See Fav user List
        </Text>
      </TouchableOpacity>
    </SafeAreaView >
  );
}

const styles = StyleSheet.create({
  main_view: {
    paddingTop: Platform.OS === 'android' ? 50 : 0,
    alignItems: 'center'
    // backgroundColor: "red"
  }
});
