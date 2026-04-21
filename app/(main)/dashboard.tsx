import { useToast } from "@/components/ui/toast";
import { getDashboardDataApi } from "@/src/api/dashboardApi";
import { showAppToast } from "@/utils/toastUtils";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Image, RefreshControl, ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function Dashboard() {
    const [loading, setLoading] = useState<boolean>(false);
    const [refreshing, setRefreshing] = useState(false);
    const [data, setData] = useState<{ advisortotal?: number; policytotal?: number, renewaltotal?: number }>({})
    const toast = useToast();
    const formatNumber = (num?: number | null) => {
        if (num == null) return "0"; // handles undefined & null

        if (num >= 1_000_000_000)
            return (num / 1_000_000_000).toFixed(1).replace(".0", "") + "B";

        if (num >= 1_000_000)
            return (num / 1_000_000).toFixed(1).replace(".0", "") + "M";

        if (num >= 1_000)
            return (num / 1_000).toFixed(1).replace(".0", "") + "K";

        return num.toString();
    };


    const fetchDashboardData = async () => {
        try {
            setLoading(true)

            let res = await getDashboardDataApi();
            if (res.status) {
                setData(res.data)
            }

        } catch (error) {
            console.log('error while loading dashboard data', error)
            showAppToast(toast, "error", "Error", 'Failed to load dashboard data.');
        } finally {
            setLoading(false)
            setRefreshing(false);
        }
    }


    useFocusEffect(
        useCallback(() => {
            fetchDashboardData();
        }, [])
    );
    const onRefresh = async () => {
        setRefreshing(true);
        await fetchDashboardData();
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
                <View
                    className="bg-[#FEE5D9] w-[48%] rounded-[16px] p-[20px]"
                >
                    <Image source={require('@/assets/images/bg-vector.png')} className="absolute right-0 top-1 w-[87px] h-[90px]" />
                    <Text className="text-[20px] font-kanit-medium mb-[8px] text-black">
                        Policies
                    </Text>
                    <Text className="text-[32px] font-biorhyme-extrabold mb-[36px] text-[#674009]">
                        {formatNumber(data?.policytotal)}
                    </Text>
                    <TouchableOpacity
                        onPress={() => router.push('/policy')}
                        className="bg-[#FFBDA4] h-[48px] border-[1px] border-black items-center justify-center rounded-full"
                    >
                        <Text className="text-black text-[16px] font-kanit-medium">
                            See Details
                        </Text>
                    </TouchableOpacity>
                </View>

                <View
                    className="bg-[#C9E6F8] w-[48%] rounded-[16px] p-[20px]"
                >
                    <Image source={require('@/assets/images/bg-vector.png')} className="absolute right-0 top-1 w-[87px] h-[90px]" />
                    <Text className="text-[20px] font-kanit-medium mb-[8px] text-black">
                        Renewals
                    </Text>
                    <Text className="text-[32px] font-biorhyme-extrabold mb-[36px] text-[#000]" numberOfLines={1}>
                        {formatNumber(data.renewaltotal)}
                    </Text>
                    <TouchableOpacity
                        className="bg-[#84C8F9] h-[48px] border-[1px] border-black items-center justify-center rounded-full"
                        onPress={() => router.push('/renewal')}
                    >
                        <Text className="text-black text-[16px] font-kanit-medium">
                            See Details
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    )
}