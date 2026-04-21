import ReadMoreText from "@/components/customs/readMoreButton";
import { useToast } from "@/components/ui/toast";
import { getDashboardDataApi } from "@/src/api/dashboardApi";
import { getNotifications } from "@/src/api/notificationApi";
import { showAppToast } from "@/utils/toastUtils";
import { router, useFocusEffect } from "expo-router";
import { ArrowsClockwiseIcon, CakeIcon } from "phosphor-react-native";
import { useCallback, useState } from "react";
import { Image, RefreshControl, ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function Notifications() {
    const [loading, setLoading] = useState<boolean>(false);
    const [refreshing, setRefreshing] = useState(false);
    const [data, setData] = useState({})
    const toast = useToast();

    const fetchNotifications = async () => {
        try {
            setLoading(true)

            let res = await getNotifications();
            if (res.status) {
                setData(res.data)
            }

        } catch (error) {
            console.log('error while loading notifications', error)
            showAppToast(toast, "error", "Error", 'Failed to load notifications.');
        } finally {
            setLoading(false)
            setRefreshing(false);
        }
    }


    useFocusEffect(
        useCallback(() => {
            fetchNotifications();
        }, [])
    );
    const onRefresh = async () => {
        setRefreshing(true);
        await fetchNotifications();
    };

    return (
        <ScrollView showsVerticalScrollIndicator={false} refreshControl={
            <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={["#000"]}
                tintColor="#000"
                progressBackgroundColor={'#DCF49F'}
            />
        }>
            <View className="flex-row flex-wrap justify-between gap-y-[20px] py-[20px]">
                <Text className="text-[14px] font-kanit text-white">Today</Text>
                <View className="w-full flex-row gap-[10px] bg-[#1C1C1C] rounded-[12px] p-[10px]">
                    <View className="pt-1">
                        <ArrowsClockwiseIcon size={18} color="white" />
                    </View>
                    <View className="flex-1">
                        <Text className="text-[16px] text-white font-kanit mb-1">Renewal</Text>
                        {/* <Text className="text-[14px] text-[#A3A3A3] font-kanit-light mb-2">Hi Harish Joping, Your Client MARCH 26’s Policy No MARCH20021997 for AP01MJ2003 expires on 26/04/2026. Renew now!</Text> */}
                        <ReadMoreText text="Hi Harish Joping, Your Client MARCH 26’s Policy No MARCH20021997 for AP01MJ2003 expires on 26/04/2026. Renew now!" />
                        <Text className="text-[12px] text-[#A3A3A3] font-kanit-light">34 min ago</Text>
                    </View>
                </View>

                <Text className="text-[14px] font-kanit text-white">Yesterday</Text>
                <View className="w-full flex-row gap-[10px] bg-[#1C1C1C] rounded-[12px] p-[10px]">
                    <View className="pt-1">
                        <CakeIcon size={18} color="white" />
                    </View>
                    <View className="flex-1">
                        <Text className="text-[16px] text-white font-kanit mb-1">Birthday</Text>
                        {/* <Text className="text-[14px] text-[#A3A3A3] font-kanit-light mb-2">Hi Harish Joping, Just a quick reminder that today is MARCH 26’s birthday. Please make sure to wish them on time and mainting a warm connection. Small gestures like this help build strong and lasting relationships. Thank you for your support and dedication! Best regards, Harish Joping.</Text> */}
                        <ReadMoreText text="Hi Harish Joping, Just a quick reminder that today is MARCH 26’s birthday. Please make sure to wish them on time and mainting a warm connection. Small gestures like this help build strong and lasting relationships. Thank you for your support and dedication! Best regards, Harish Joping." />
                        <Text className="text-[12px] text-[#A3A3A3] font-kanit-light">1 day ago</Text>
                    </View>
                </View>

                <Text className="text-[14px] font-kanit text-white">Previous</Text>
                <View className="w-full flex-row gap-[10px] bg-[#1C1C1C] rounded-[12px] p-[10px]">
                    <View className="pt-1">
                        <CakeIcon size={18} color="white" />
                    </View>
                    <View className="flex-1">
                        <Text className="text-[16px] text-white font-kanit mb-1">Payment due</Text>
                        <Text className="text-[14px] text-[#A3A3A3] font-kanit-light mb-2">Hi Harish Joping, ₹3,675.67 is due with Yashwant Vaishnav ji. Please clear the outstanding amount at the earliest and view your statement.</Text>
                        <Text className="text-[12px] text-[#A3A3A3] font-kanit-light">3 day ago</Text>
                    </View>
                </View>
            </View>
        </ScrollView>
    )
}