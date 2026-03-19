import { useEffect, useMemo, useRef, useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, FlatList, Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  Extrapolate,
} from "react-native-reanimated";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CheckIcon } from "phosphor-react-native";

interface Slide {
  id: string;
  image: any;
  title: string;
  description: string;
  buttonText: string;
  subtitle?: string;
  list?: string[];
}

export default function Welcome() {

  const { width, height } = Dimensions.get("window");

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // useEffect(() => {
  //   const checkAuth = async () => {
  //     const token = await AsyncStorage.getItem("token");
  //     const user = await AsyncStorage.getItem("user");

  //     if (token && user) {
  //       setIsLoggedIn(true);
  //     }
  //   };

  //   checkAuth();
  // }, []);


  const slides = [
    {
      id: "1",
      image: require("../assets/images/insurance.png"),
      title: "Welcome, Sub Agent",
      subtitle: "View your policy details anytime",
      description:
        "Access your assigned policies, renewals, and earnings in one place.",
      buttonText: "Next",
    },
    {
      id: "2",
      image: require("../assets/images/policies.png"),
      title: "View Policies",
      description: "See all policies assigned to\n you with full details",
      list: [
        "Access policy list",
        "Customer information"
      ],
      buttonText: "Next",
    },
    {
      id: "3",
      image: require("../assets/images/alerts.png"),
      title: "Track Renewals",
      description: "Stay ahead by tracking \nupcoming policy renewals",
      list: [
        "Upcoming renewals",
        "Expiry date tracking"
      ],
      buttonText: "Next",
    },
    {
      id: "4",
      image: require("../assets/images/ledger.png"),
      title: "View Your Ledger",
      subtitle: "Track commissions & payments",
      description:
        isLoggedIn
          ? "Go directly to your dashboard."
          : "Login to view policies, renewals, \nand your earnings.",
      buttonText: isLoggedIn ? "Go to Dashboard" : "Login Now",
    },
  ];

  const flatListRef = useRef<FlatList<any> | null>(null);

  const [currentIndex, setCurrentIndex] = useState(0);

  const scrollX = useSharedValue(0);

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
      });
    } else {
      if (isLoggedIn) {
        router.replace("/(main)/dashboard");
      } else {
        router.replace("/(auth)/login");
      }
    }
  };


  const handleSkip = () => {
    if (isLoggedIn) {
      router.replace("/(main)/dashboard");
    } else {
      router.replace("/(auth)/login");
    }
  };

  // useEffect(() => {
  //   const checkAuth = async () => {
  //     const token = await AsyncStorage.getItem("token");
  //     const user = await AsyncStorage.getItem("user");
  //     setIsLoggedIn(!!(token && user));
  //   };

  //   checkAuth();
  // }, []);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });



  return (
    <View className="flex-1">
      <TouchableOpacity className="absolute items-center justify-center w-[100px] h-[43px] right-0 top-5 z-10"
        onPress={handleSkip}
      >
        <Text className="text-[#A3A3A3] font-kanit-light text-lg">Skip</Text>
      </TouchableOpacity>
      <Animated.FlatList
        ref={flatListRef}
        data={slides}
        horizontal
        pagingEnabled
        scrollEnabled={true}
        showsHorizontalScrollIndicator={false}
        onScroll={scrollHandler}
        keyExtractor={(item) => item.id}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(
            e.nativeEvent.contentOffset.x / width
          );
          setCurrentIndex(index);
        }}
        renderItem={({ item }) => (
          <View className="flex-1 px-5 items-center gap-8 justify-center" style={{ width }}>
            <Image
              source={item.image}
              className="w-[293px] h-[180px]"
              resizeMode="contain"
            />

            <View className="gap-[5px] items-center mb-4">
              {item.title && (
                <Text className="font-biorhyme-bold text-center text-white text-[28px]">
                  {item.title}
                </Text>
              )}

              {item.subtitle && (
                <Text className="font-kanit text-center text-white text-[20px] mb-4">
                  {item.subtitle}
                </Text>
              )}

              <Text className="font-kanit text-center text-[#A3A3A3] text-[20px]">
                {item.description}
              </Text>

              {item.list && (
                <View className="mt-8">
                  {item.list.map((point: any, index: any) => (
                    <View key={index} className="flex-row gap-[10px] items-center " >
                      <View className="w-[24px] h-[24px] items-center justify-center rounded-[50%] bg-[#3D4E3F]">
                        <CheckIcon size={20} color="white" />
                      </View>
                      <Text className="font-kanit text-center text-white text-[20px]">
                        {point}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </View>

            <View className="w-full">
              <TouchableOpacity onPress={handleNext} className="bg-[#DEF3A1] py-4 rounded-full items-center mb-8">
                <Text className="text-black text-xl font-kanit-medium">
                  {item.buttonText}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <View className="w-full px-5 absolute bottom-[60px] items-center">
        <View className="flex-row gap-[10px]">
          {slides.map((_, index) => {
            const animatedDotStyle = useAnimatedStyle(() => {
              const widthAnim = interpolate(
                scrollX.value / width,
                [index - 1, index, index + 1],
                [8, 16, 8],
                Extrapolate.CLAMP
              );
              return {
                width: widthAnim,
              };
            });

            return (
              <Animated.View
                key={index}
                className={`h-[8px] rounded-[4px] ${currentIndex == index ? 'bg-[#fff]' : ' bg-[#615D5D]'}`}
                style={[animatedDotStyle]}
              />
            );
          })}
        </View>
      </View>
    </View>
  );
}

