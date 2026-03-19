import { router, Stack, usePathname } from "expo-router";
import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Image, ImageBackground, View } from "react-native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

import {
    Kanit_300Light,
    Kanit_400Regular,
    Kanit_500Medium,
    Kanit_700Bold,
} from "@expo-google-fonts/kanit";

import {
    BioRhyme_400Regular,
    BioRhyme_500Medium,
    BioRhyme_600SemiBold,
    BioRhyme_700Bold,
    BioRhyme_800ExtraBold
} from "@expo-google-fonts/biorhyme";
import { useEffect } from "react";
import { AuthProvider, useAuth } from "@/src/context/AuthContext";
import { useToast } from "@/components/ui/toast";
import { setupAxiosInterceptors } from "@/src/api/setupAxiosInterceptors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getMPIN } from "@/utils/mpin";

SplashScreen.preventAutoHideAsync();


export default function RootLayout() {
    const [fontsLoaded] = useFonts({
        Kanit_300Light,
        Kanit_400Regular,
        Kanit_500Medium,
        Kanit_700Bold,
        BioRhyme_400Regular,
        BioRhyme_500Medium,
        BioRhyme_600SemiBold,
        BioRhyme_700Bold,
        BioRhyme_800ExtraBold,
    });

    useEffect(() => {
        if (!fontsLoaded) return;
        // uncomment to unloack logic
        const init = async () => {
            const token = await AsyncStorage.getItem("token");
            const user = await AsyncStorage.getItem("user");
            const savedMPIN = await getMPIN();

            if (token && user && savedMPIN) {
                router.replace("/(auth)/unlock-mpin");
            }

            await SplashScreen.hideAsync();
        };

        init();
    }, [fontsLoaded]);

    if (!fontsLoaded) return null;


    function AppWithInterceptors() {
        const { logoutUser } = useAuth();
        const toast = useToast();

        useEffect(() => {
            setupAxiosInterceptors(logoutUser, toast);
        }, [logoutUser]);

        return (
            <Stack
                screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: "transparent" },
                    animation: 'none',
                }}
            />
        )
    }

    return (
        <SafeAreaProvider>
            <ImageBackground
                source={require("../assets/bg.png")}
                resizeMode="cover"
                className="flex-1"
            >
                <SafeAreaView
                    className="flex-1 bg-transparent"
                    edges={["top", "left", "right", "bottom"]}
                >
                    <AuthProvider>
                        <GluestackUIProvider>
                            <AppWithInterceptors />
                        </GluestackUIProvider>
                    </AuthProvider>
                </SafeAreaView>
            </ImageBackground>
        </SafeAreaProvider>
    );
}