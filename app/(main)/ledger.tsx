import { useSearch } from "@/src/context/SearchContext";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
    RefreshControl,
    View,
    Text,
    TouchableOpacity,
    ActivityIndicator,
    Image,
    FlatList,
    LayoutAnimation,
    Platform,
    UIManager,
    Linking,
} from "react-native";
import {
    CaretDownIcon,
    CaretUpIcon,
    EnvelopeSimpleIcon,
    FileTextIcon,
    ListNumbersIcon,
    PhoneIcon,
    UserCircleIcon,
} from "phosphor-react-native";
import { useToast } from "@/components/ui/toast";
import { getAdvisors } from "@/src/api/advisorsApi";
import { Divider } from "@/components/ui/divider";
import { getLedger } from "@/src/api/ledgerApi";
import { useAuth } from "@/src/context/AuthContext";

if (Platform.OS === "android") {
    UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

const cardColors = [
    "#F1ECFD",
    "#FEE5D9",
    "#C9E6F8",
    "#EFFFE1",
];
const cardTextColors = [
    "#B4A5DC",
    "#FFBDA4",
    "#84C8F9",
    "#DEF3A1",
]
export default function MyAdvisor() {
    const toast = useToast();
    const { search } = useSearch();
    const { user } = useAuth();
    const [advisors, setAdvisors] = useState<any[]>([]);
    const [ledgerData, setLedgerData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false)
    const [totalPayable, setTotalPayable] = useState(0);
    const [totalReceivable, setTotalReceivable] = useState(0);
    const [refreshing, setRefreshing] = useState(false);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [offset, setOffset] = useState(0);
    const limit = 10;
    const [totalCount, setTotalCount] = useState(0);


    const fetchLedgerData = async (
        isLoadMore = false,
        customOffset?: number,
    ) => {
        try {
            if (isLoadMore) {
                setLoadingMore(true)
            } else {
                setLoading(true);
            }

            const finalOffset = customOffset ?? offset;

            const res = await getLedger(search, finalOffset, limit);

            if (res?.status) {
                setTotalCount(res.count);
                setTotalPayable(res?.dueCredit || 0);
                setTotalReceivable(res?.dueDebit || 0);

                const data = Array.isArray(res.data) ? res.data : [];

                if (isLoadMore) {
                    setLedgerData(prev => [...prev, ...data]);
                } else {
                    setLedgerData(data);
                }
            }
        } catch (error) {
            console.log("Error fetching ledger data:", error);
        } finally {
            setLoading(false);
            setLoadingMore(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            setOffset(0);
            setExpandedId(null);
            fetchLedgerData(false, 0);
        }, [])
    );
    const isFirstRender = useRef(true);
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        if (search !== undefined) {
            const delay = setTimeout(() => {
                setOffset(0);
                setExpandedId(null);
                fetchLedgerData(false, 0);
            }, 500);

            return () => clearTimeout(delay);
        }
    }, [search]);

    const onRefresh = async () => {
        setRefreshing(true);
        setOffset(0);
        setExpandedId(null);
        await fetchLedgerData(false, 0);
    };

    const handleLoadMore = async () => {
        if (loadingMore) return;

        const newOffset = ledgerData.length;
        setOffset(newOffset);
        await fetchLedgerData(true, newOffset);
    };

    const hasMore = ledgerData.length < totalCount;

    const SkeletonItem = () => (
        <View className="min-h-[70px] flex-row gap-2 my-[10px] rounded-[12px] bg-[#ffffff14] p-4">
            <View className="bg-[#ffffff14] h-[42px] w-[42px] rounded-[8px]" />
            <View className="flex-1">
                <View className="h-[20px] w-1/2 bg-[#ffffff14] rounded mb-2" />
                <View className="h-[15px] w-full bg-[#ffffff14] rounded" />
            </View>
        </View>
    );

    const renderItem = ({ item, index }: any) => {
        const isExpanded = expandedId === item?.user_id;
        const bgColor = cardColors[index % cardColors.length];
        const textColor = cardTextColors[index % cardColors.length];
        return (
            <View
                style={{ backgroundColor: bgColor }}
                className="my-[10px] gap-[15px] p-[15px] justify-center rounded-[12px]"
            >
                <View className="flex-row items-center justify-between">
                    <View className="flex-1">
                        <Text numberOfLines={2} ellipsizeMode="tail" className="text-black text-[18px] font-biorhyme-semibold capitalize">{(item?.name)?.toLowerCase() || 'N/A'}</Text>
                        <Text numberOfLines={1} ellipsizeMode="tail" className="text-black text-[14px] font-kanit capitalize">{`Type: ${(item?.type)?.toLowerCase() || ''}`}</Text>
                    </View>
                    <View className="bg-[#1F1F1F] h-[40px] w-[40px]  items-center justify-center rounded-full">
                        <Text style={{ color: textColor }} className=" text-[18px] font-kanit">{item?.type == "credit" ? 'Cr' : 'Dr'}</Text>
                    </View>
                </View>
                <View className="flex-row items-center justify-between">
                    <View className="flex-1">
                        <Text numberOfLines={1} ellipsizeMode="tail" className="text-black text-[14px] font-kanit">Balance amount</Text>
                        <Text numberOfLines={1} ellipsizeMode="tail" className={`${item?.type == "credit" ? 'text-[#24C279]' : 'text-[#C22424]'} text-[24px] leading-none font-biorhyme-bold`}>{`₹${Number(item?.balance).toFixed(2)}`}</Text>
                    </View>
                    <TouchableOpacity
                        style={{ backgroundColor: textColor }}
                        className="h-[30px] border px-2 flex-row items-center justify-center gap-1 rounded-[16px]"
                        onPress={() => router.push({ pathname: '/ledger-detail', params: { id: item?.id }, })}
                    >
                        <FileTextIcon size={16} weight="bold" />
                        <Text className="text-black text-[12px] font-kanit-medium">View Statement</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };


    return (
        <View className="flex-1 py-[20px]">
            {
                loading ? (
                    <View>
                        {[...Array(5)].map((_, i) => (
                            <SkeletonItem key={i} />
                        ))}
                    </View>
                ) : (
                    <FlatList
                        data={ledgerData}
                        keyExtractor={(item, index) =>
                            item.user_id?.toString() || index.toString()
                        }
                        renderItem={renderItem}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{
                            flexGrow: 1,
                            justifyContent: ledgerData.length === 0 ? "center" : "flex-start",
                        }}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                            />
                        }
                        ListHeaderComponent={
                            <View className="bg-[#F1ECFD] rounded-[16px] w-full p-[3px] mb-3">
                                <Image source={require('@/assets/images/bg-vector.png')} className="absolute rotate-90 right-0 top-0 w-[117px] h-[117px]" />
                                <View className="p-[17px] flex-1 flex-row items-center gap-[10px]">
                                    <View className="bg-[#1F1F1F] h-[44px] w-[44px]  items-center justify-center rounded-full">
                                        <UserCircleIcon size={32} weight="fill" color="#B4A5DC" />
                                    </View>
                                    <View className="flex-1 gap-1">
                                        <Text ellipsizeMode="tail" className="text-black text-[18px] font-biorhyme-bold">{user?.name || ""}</Text>
                                    </View>
                                </View>
                                <View className="flex-row flex-wrap items-center justify-between bg-[#1F1F1F] rounded-[13px] w-full p-[15px]">
                                    <View className="w-[40%] flex-1">
                                        <Text className="text-[#A3A3A3] text-[14px] font-kanit-light">Total Receivable</Text>
                                        <Text className="text-[#B4A5DC] text-[24px] font-kanit-medium" ellipsizeMode="tail" numberOfLines={1}>{`₹${Number(totalReceivable).toFixed(2)}`}</Text>
                                    </View>
                                    <View className="w-[20%] items-center">
                                        <Divider className="bg-[#A3A3A3] w-[60%] rotate-90" />
                                    </View>
                                    <View className="w-[40%] flex-1">
                                        <Text className="text-[#A3A3A3] text-[14px] font-kanit-light">Total Payable</Text>
                                        <Text className="text-[#B4A5DC] text-[24px] font-kanit-medium" ellipsizeMode="tail" numberOfLines={1}>{`₹${Number(totalPayable).toFixed(2)}`}</Text>
                                    </View>
                                    <View className="w-full pt-3 items-center">
                                        <Divider className="bg-[#A3A3A3] " />
                                    </View>
                                </View>
                            </View>
                        }
                        ListEmptyComponent={
                            <View className="flex-1 items-center justify-center">
                                <Image source={require('@/assets/images/empty.png')} className="w-[293px] h-[180px]" resizeMode="contain" />
                                <Text className="text-gray-400 text-[15px] font-kanit">
                                    No ledger data found
                                </Text>
                            </View>
                        }
                        ListFooterComponent={
                            <View className="my-[10px]">
                                {hasMore && (
                                    <View className="items-center">
                                        <TouchableOpacity
                                            onPress={handleLoadMore}
                                            className="bg-[#B4A5DC] flex-row gap-2 h-[40px] w-1/3 justify-center items-center rounded-full"
                                        >
                                            {loadingMore && (
                                                <ActivityIndicator size="small" color="#000" />
                                            )}
                                            <Text className="text-black font-semibold">
                                                {loadingMore ? "Loading..." : "Load More"}
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                )}

                                {!hasMore && ledgerData.length > 0 && (
                                    <Text className="text-center text-gray-500 mt-4">
                                        No more ledger data.
                                    </Text>
                                )}
                            </View>
                        }
                    />
                )
            }
        </View>
    );
}