import { StyleSheet, Text, View } from "react-native";
import React, { useState, useEffect } from "react";
import * as Location from "expo-location";
import * as LocationGeocoding from "expo-location";
import { Octicons } from "@expo/vector-icons";
import { ScrollView } from "react-native";
import { Pressable } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { TextInput } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import Carousel from "../../components/Carousel";

export default function index() {
  const [locationService, setLocationService] = useState(false);
  const [displaycurrentAdd, setDisplaycurrentAdd] = useState(
    "Fetching our Locetion..."
  );
  useEffect(() => {
    checklocetionEnable();
    getCurrentLocetion();
  }, []);

  const checklocetionEnable = async () => {
    let enable = await Location.hasServicesEnabledAsync();
    if (!enable) {
      Alert.alert(
        "Locetion Service Is Not Enable",
        "Plese Enable You Location!",
        [{ text: "Ok" }],
        { cancelable: false }
      );
    } else {
      setLocationService(true);
    }
  };

  const getCurrentLocetion = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission Is Not Granted",
        "Plese Enable You Location!",
        [{ text: "Ok", onPress: () => getCurrentLocetion() }],
        { cancelable: false }
      );
    }

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });

    const { coords } = await Location.getCurrentPositionAsync();

    if (coords) {
      const { latitude, longitude } = coords;

      const res = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      const address = await LocationGeocoding.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      const streetAddress = address[0].name;

      for (let item of res) {
        let address = `${item.name}, ${item.postalCode}, ${item.city}`;
        setDisplaycurrentAdd(address);
      }
    }
  };
  return (
    <ScrollView className="flex-1 bg-[#f8f8f8]">
      <View className="flex-row items-center gap-3 p-4">
        <Octicons name="location" size={24} color="#EF2850" />
        <View className="flex-1">
          <Text style={{ fontSize: hp(2.3) }} className="font-bold">
            Deliver to
          </Text>
          <Text>{displaycurrentAdd}</Text>
        </View>
        <Pressable className="bg-[#6CB4EE] w-10 h-10 rounded-full justify-center items-center ">
          <Text style={{ fontSize: hp(2.5) }} className="font-bold">
            P
          </Text>
        </Pressable>
      </View>
      <View className='flex flex-row justify-between border border-[#c0c0c0] rounded-xl px-7 py-2 mt-4 mx-4'>
        <TextInput placeholder="Search for food, hotels" />
        <AntDesign name="search1" size={24} color="#ef2b50" />
      </View>
      <Carousel/>
    </ScrollView>
  );
}

const styles = StyleSheet.create({});
