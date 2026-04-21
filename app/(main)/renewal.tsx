import { generatePolicyCopyUrl, getMotorPolicies, getXMotorPolicies } from "@/src/api/policyApi";
import { useSearch } from "@/src/context/SearchContext";
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
    RefreshControl,
    ScrollView,
    View,
    Text,
    TouchableOpacity,
    ActivityIndicator,
    Image,
    Linking,
    FlatList,
    LayoutAnimation,
    Platform,
    UIManager,
} from "react-native";
import { Animated, Easing } from "react-native";
import {
    CaretDownIcon,
    CaretUpIcon,
    EnvelopeIcon,
    PhoneIcon,
} from "phosphor-react-native";
import { Progress, ProgressFilledTrack } from "@/components/ui/progress";
import { calculatePolicyProgress, formatDate } from "@/src/helper/helper";
import { showAppToast } from "@/utils/toastUtils";
import { useToast } from "@/components/ui/toast";
import { getMotorRenewals, getXMotorRenewals } from "@/src/api/renewalApi";
import config from "@/src/config/config";
// import { accordionButtonColors, accordionColors } from "@/src/constants/contants";

if (Platform.OS === "android") {
    UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

const accordionColors = [
    "#C9E6F8",
    "#EFFFE1",
    "#FEE5D9",
    "#F1ECFD",
];

const accordionButtonColors = [
    "#84C8F9",
    "#DEF3A1",
    "#FFBDA4",
    "#B4A5DC",
]
export default function MyRenewals() {
    const toast = useToast();
    const { search } = useSearch();
    const [allPolicies, setAllPolicies] = useState<any[]>([]);
    const [policies, setPolicies] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [lobType, setLobType] = useState('motor');
    const [tabLoading, setTabLoading] = useState(false);
    const [offset, setOffset] = useState(0);
    const limit = 10;
    const [totalCount, setTotalCount] = useState(0);

    const slideAnim = useRef(new Animated.Value(0)).current;

    const TABS = [
        { key: "motor", label: "Motor", type: "motor" },
        { key: "non-motor", label: "Non-Motor", type: "nonmotor" },
        { key: "health", label: "Health", type: "health" },
        { key: "life", label: "Life", type: "life" },
        { key: "travel", label: "Travel", type: "travel" },
        { key: "other", label: "Other", type: "other" },
    ];

    const STATUSTABS = [
        { key: "expiring", label: "Expiring", type: "expiring" },
        { key: "expired", label: "Expired", type: "expired" },
    ]

    const [statusType, setStatusType] = useState("expiring");

    const TAB_WIDTH = 100;
    const HORIZONTAL_PADDING = 2;
    const TAB_SPACING = 8;
    const [activeIndex, setActiveIndex] = useState(0);
    const scrollRef = useRef<ScrollView>(null);

    const [statusIndex, setStatusIndex] = useState(0);
    const statusSlideAnim = useRef(new Animated.Value(0)).current;
    const statusScrollRef = useRef<ScrollView>(null);

    const STATUS_TAB_WIDTH = 176;

    const switchStatusTab = (index: number, type: string) => {
        setStatusIndex(index);
        setStatusType(type); // ✅ store API value
        setOffset(0);
        setExpandedId(null);

        setPolicies([]);
        setTabLoading(true);

        fetchRenewals(false, 0, lobType, type); // ✅ pass status

        Animated.timing(statusSlideAnim, {
            toValue: index,
            duration: 250,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
        }).start();

        statusScrollRef.current?.scrollTo({
            x: Math.max(0, index * STATUS_TAB_WIDTH - STATUS_TAB_WIDTH),
            animated: true,
        });
    };

    const statusTranslateX = statusSlideAnim.interpolate({
        inputRange: [0, STATUSTABS.length - 1],
        outputRange: [
            HORIZONTAL_PADDING,
            HORIZONTAL_PADDING +
            (STATUS_TAB_WIDTH + TAB_SPACING) * (STATUSTABS.length - 1),
        ],
    });

    const switchTab = (index: number, type: string) => {
        if (type === lobType) return;

        setActiveIndex(index);
        setLobType(type);
        setOffset(0);
        setExpandedId(null);

        setPolicies([]);        // ✅ Clear old list immediately
        setTabLoading(true);    // ✅ Show skeleton

        fetchRenewals(false, 0, type, statusType);

        Animated.timing(slideAnim, {
            toValue: index,
            duration: 250,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
        }).start();

        scrollRef.current?.scrollTo({
            x: Math.max(0, index * TAB_WIDTH - TAB_WIDTH),
            animated: true,
        });
    };

    const translateX = slideAnim.interpolate({
        inputRange: [0, TABS.length - 1],
        outputRange: [
            HORIZONTAL_PADDING,
            HORIZONTAL_PADDING +
            (TAB_WIDTH + TAB_SPACING) * (TABS.length - 1),
        ],
    });

    const fetchRenewals = async (
        isLoadMore = false,
        customOffset?: number,
        type?: string,
        status?: string
    ) => {
        try {
            if (isLoadMore) {
                setLoading(true);
            } else {
                setTabLoading(true);
            }

            const finalOffset = customOffset ?? offset;
            const finalType = type ?? lobType;
            const finalStatus = status ?? statusType;

            let res;

            if (finalType === "motor") {
                res = await getMotorRenewals(search, finalOffset, limit, finalStatus);
            } else {
                res = await getXMotorRenewals(search, finalType, finalOffset, limit, finalStatus);
            }

            if (res?.status) {
                setTotalCount(res.count);

                const data = Array.isArray(res.data) ? res.data : [];

                if (isLoadMore) {
                    setPolicies(prev => [...prev, ...data]);
                } else {
                    setPolicies(data);
                }
            }
        } catch (error) {
            console.log("Error fetching policies:", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
            setTabLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            setOffset(0);
            setExpandedId(null);
            fetchRenewals(false, 0, lobType, statusType);
        }, [])
    );
    const isFirstRender = useRef(true);
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return; // for Skip first mount
        }
        if (search !== undefined) {
            const delay = setTimeout(() => {
                setOffset(0);
                setExpandedId(null);
                fetchRenewals(false, 0, lobType, statusType);
            }, 500);

            return () => clearTimeout(delay);
        }
    }, [search]);

    const onRefresh = async () => {
        setRefreshing(true);
        setOffset(0);
        setExpandedId(null);
        await fetchRenewals(false, 0, lobType, statusType);
    };

    const handleLoadMore = async () => {
        if (loading) return;

        const newOffset = policies.length;
        setOffset(newOffset);
        await fetchRenewals(true, newOffset, lobType, statusType);
    };

    const hasMore = policies.length < totalCount;

    // const openPolicy = async (
    //     policy_pdf_url?: string,
    //     policy_pdf?: string,
    //     server_type?: string
    // ) => {
    //     try {
    //         if (!policy_pdf_url) return;

    //         const finalUrl = server_type
    //             ? `${config.s3URL}/${policy_pdf}`
    //             : policy_pdf_url;

    //         const supported = await Linking.canOpenURL(finalUrl);

    //         if (supported) {
    //             await Linking.openURL(finalUrl);
    //         } else {
    //             showAppToast(toast, "error", "Error", "Cannot open URL");
    //         }
    //     } catch (error) {
    //         console.log("Open policy error:", error);
    //         showAppToast(toast, "error", "Error", "Something went wrong");
    //     }
    // };

    const openPolicy = async (
        policy_pdf_url?: string,
        policy_pdf?: string,
        server_type?: string
    ): Promise<void> => {
        try {
            let finalUrl: string | undefined;


            if (server_type && server_type == 'S3') {
                try {
                    const res = await generatePolicyCopyUrl(policy_pdf);
                    finalUrl = res?.temp_url
                } catch (error: any) {
                    console.log('error while url: ', error?.response?.data)
                }
            } else {
                finalUrl = policy_pdf_url;
            }
            if (!finalUrl) {
                showAppToast(toast, "error", "Error", "Invalid file URL");
                return;
            }
            const supported = await Linking.canOpenURL(finalUrl);

            if (supported) {
                await Linking.openURL(finalUrl);
            } else {
                showAppToast(toast, "error", "Error", "Cannot open URL");
            }
        } catch (error) {
            console.log("Open policy error:", error);
            showAppToast(toast, "error", "Error", "Something went wrong");
        }
    };

    const openURL = async (url: any) => {
        try {
            const supported = await Linking.canOpenURL(url);
            if (supported) {
                await Linking.openURL(url);
            } else {
                showAppToast(toast, "error", "Error", "Cannot open URL");
            }
        } catch (error) {
            console.log("Open policy error:", error);
            showAppToast(toast, "error", "Error", "Something went wrong");
        }
    }

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
        const isExpanded = expandedId === item?.id;
        const bgColor = accordionColors[index % accordionColors.length];
        const buttonColor = accordionButtonColors[index % accordionButtonColors.length];
        const progressValue = calculatePolicyProgress(
            item?.policy_start_date,
            item?.policy_end_date
        );
        return (
            <View
                style={{ backgroundColor: bgColor }}
                className="min-h-[70px] my-[10px] justify-center rounded-[12px]"
            >
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                        LayoutAnimation.configureNext(
                            LayoutAnimation.Presets.easeInEaseOut
                        );
                        setExpandedId(prev =>
                            prev === item.id ? null : item.id
                        );
                    }}
                    className="p-3"
                >
                    <View className="flex-row items-center p-[5px] gap-2">
                        <View className="bg-white h-[42px] w-[42px]  items-center justify-center rounded-[8px]">
                            <Image
                                source={
                                    item?.insurer_logo
                                        ? { uri: item?.insurer_logo }
                                        : require("@/assets/images/digit.png")
                                }
                                resizeMode="contain"
                                className="w-[40px] h-[40px]"
                            />
                        </View>

                        <View className="flex-1 gap-1">
                            <Text ellipsizeMode="tail" className="text-black text-[16px] leading-none font-biorhyme-semibold capitalize">
                                {/* {lobType == 'motor' ? item?.full_name || '' : item?.customer_name || ''} */}
                                {(lobType === "motor"
                                    ? item?.full_name
                                    : item?.customer_name
                                )?.toLowerCase() || "N/A"}
                            </Text>
                            <View className="flex-row flex-wrap items-start">
                                <Text className="text-[#6C6060] text-[11px] leading-none font-kanit ml-1">
                                    {lobType == 'motor' ? `Vehicle No. - ${item?.vehicle_number}` : `Policy No. - ${item?.policy_number}`}
                                </Text>
                                {/* {(lobType == 'motor' ? item?.mobile : item?.customer_mobile) && (
                                    <View className="flex-row items-center mr-3">
                                        <PhoneIcon size={14} weight="light" color="#6C6060" />
                                        <Text className="text-[#6C6060] text-[11px] leading-none font-kanit ml-1">
                                            {lobType == 'motor' ? item?.mobile || '' : item?.customer_mobile || ''}
                                        </Text>
                                    </View>
                                )}
                                {(lobType == 'motor' ? item?.email : item?.customer_email) && (
                                    <View className="flex-row items-center flex-1">
                                        <EnvelopeIcon size={14} weight="light" color="#6C6060" />
                                        <Text
                                            numberOfLines={1}
                                            ellipsizeMode="tail"
                                            className="text-[#6C6060] text-[11px] leading-none font-kanit ml-1 flex-1"
                                        >
                                            {lobType == 'motor' ? item?.email || '' : item?.customer_email || ''}
                                        </Text>
                                    </View>
                                )} */}
                            </View>
                        </View>

                        <View className="w-[18px] h-[18px] border-[1px] border-[#6C6060] items-center justify-center rounded-[5px] ">
                            {isExpanded ? (
                                <CaretUpIcon size={14} color="#6C6060" />
                            ) : (
                                <CaretDownIcon size={14} color="#6C6060" />
                            )}
                        </View>
                    </View>
                </TouchableOpacity>

                {isExpanded && (
                    <View className="px-4 pb-3">
                        <View className="flex-row  items-center gap-2 mb-[5px]">
                            <Text className="text-[14px] text-black font-kanit-medium">{lobType == 'motor' ? item?.vehicle_category_name || '' : item?.lob || ''}</Text>
                            <View className="w-[5px] h-[5px] bg-[#000] rounded-full"></View>
                            <Text className="text-[14px] text-black font-kanit-medium">{lobType == 'motor' ? item?.vehicle_number || '' : item?.plan_name || ''}</Text>
                        </View>
                        <View className="flex-row flex-1 items-center justify-between mb-[10px]">
                            <View className="flex-1">
                                <Text className="text-[13px] text-[#6C6060] font-kanit-medium">{item?.insurer_name}</Text>
                                <Text className="text-[12px] text-[#6C6060] font-kanit">{lobType == 'motor' ? item?.vehicle_policy_type || '' : 'Policy No.'} - {item?.policy_number || ''}</Text>
                            </View>
                            {item?.renewal_payment_link && (
                                <TouchableOpacity
                                    onPress={() => openURL(item?.renewal_payment_link)}
                                    className="h-[30px] w-[120px] items-center justify-center rounded-[16px] bg-[#C22424]"
                                >
                                    <Text className="text-white text-[12px] font-kanit-medium">Renew Now !</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                        <Progress value={progressValue} size="xs" className="bg-[#D4D6DD] mb-[10px]" orientation="horizontal">
                            <ProgressFilledTrack style={{ backgroundColor: buttonColor }} />
                        </Progress>
                        <Text className="text-[#6C6060] text-[12px] font-kanit mb-[5px]">
                            {`From: ${formatDate(item?.policy_start_date)} | To: ${formatDate(item?.policy_end_date)}`}
                        </Text>

                        <View className="flex-row  items-center gap-2 ">
                            <Text className="text-[15px] text-black font-kanit-medium">{item?.user?.name || ''}</Text>
                            <View className="w-[5px] h-[5px] bg-[#6C6060] rounded-full"></View>
                            <Text className="text-[12px] text-[#6C6060] font-kanit">(Advisor)</Text>
                        </View>
                        <View className="flex-row flex-wrap items-start gap-y-1 mb-2">
                            <View className="flex-row items-center mr-3">
                                <View className="w-[5px] h-[5px] bg-[#6C6060] rounded-full mr-2"></View>
                                <PhoneIcon size={14} weight="light" color="#6C6060" />
                                <TouchableOpacity onPress={() => item?.user?.mobile && Linking.openURL(`tel:${item?.user?.mobile}`)}>
                                    <Text className="text-[#6C6060] underline text-[11px] font-kanit ml-1">
                                        {item?.user?.mobile || ''}
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            <View className="flex-row items-center flex-1">
                                <View className="w-[5px] h-[5px] bg-[#6C6060] rounded-full mr-2"></View>
                                <EnvelopeIcon size={14} weight="light" color="#6C6060" />
                                <TouchableOpacity onPress={() => item?.user?.email && Linking.openURL(`mailto:${item?.user?.email}`)}>
                                    <Text
                                        numberOfLines={1}
                                        ellipsizeMode="tail"
                                        className="text-[#6C6060] underline text-[11px] font-kanit ml-1 flex-1"
                                    >
                                        {item?.user?.email || ''}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        {/* {(item?.policy_pdf_url || item?.policy_pdf) && (
                            <View className="flex-1 items-end ">
                                <TouchableOpacity
                                    onPress={() =>
                                        openPolicy(
                                            item?.policy_pdf_url,
                                            item?.policy_pdf
                                        )
                                    }
                                    style={{ backgroundColor: buttonColor }}
                                    className="h-[30px] w-[120px] items-center justify-center rounded-[16px]"
                                >
                                    <Text className="text-black text-[12px] font-kanit-medium">View Policy Copy</Text>
                                </TouchableOpacity>
                            </View>
                        )} */}
                        <View className="flex-row items-center w-full">

                            {item?.expire_in?.msg && (
                                <Text
                                    className={`text-[14px] font-biorhyme-semibold ${item?.expire_in?.msg === "Expired"
                                        ? "text-[#C22424]"
                                        : "text-[#24C279]"
                                        }`}
                                >
                                    {item?.expire_in?.msg === "Expired"
                                        ? "Expired!"
                                        : `${item?.expire_in?.days ?? 0} Days left!`}
                                </Text>
                            )}

                            {/* {(item?.policy_pdf && item?.policy_pdf !== 'null') && ( */}
                            {(item?.policy_pdf && item?.policy_pdf !== 'null') && (
                                <View className="flex-1 items-end ">
                                    <TouchableOpacity
                                        onPress={() =>
                                            openPolicy(
                                                item?.policy_pdf_url,
                                                item?.policy_pdf,
                                                item?.server_type
                                            )
                                        }
                                        style={{ backgroundColor: buttonColor }}
                                        className="h-[30px] w-[120px] items-center justify-center rounded-[16px]"
                                    >
                                        <Text className="text-black text-[12px] font-kanit-medium">View Policy Copy</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                    </View>
                )}
            </View>
        );
    };



    return (
        <View className="flex-1 py-[20px]">
            <View className="h-[60px] bg-[#ffffff14] rounded-[53px] relative overflow-hidden justify-center mb-3">
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    ref={scrollRef}
                    contentContainerStyle={{
                        paddingHorizontal: HORIZONTAL_PADDING,
                        alignItems: "center",
                    }}
                >
                    <Animated.View
                        style={{
                            width: TAB_WIDTH,
                            transform: [{ translateX }],
                        }}
                        className="absolute h-[48px] bg-[#84C8F9] rounded-[53px] left-[3px] top-[6px]"
                    />

                    {TABS.map((tab, index) => {
                        const isActive = activeIndex === index;

                        return (
                            <TouchableOpacity
                                key={tab.key}
                                onPress={() => switchTab(index, tab.type)}
                                style={{ width: TAB_WIDTH, marginHorizontal: 4 }}
                                className={`h-[48px] items-center justify-center rounded-[53px] ${!isActive && "bg-[#1C1C1C]"
                                    }`}
                            >
                                <Text
                                    className={`text-[16px] font-kanit-medium ${isActive ? "text-black" : "text-white"
                                        }`}
                                >
                                    {tab.label}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </View>
            <View className="h-[60px] bg-[#ffffff14] rounded-[53px] relative overflow-hidden justify-center mb-3">
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    ref={statusScrollRef}
                    contentContainerStyle={{
                        paddingHorizontal: HORIZONTAL_PADDING,
                        alignItems: "center",
                    }}
                >
                    {/* Animated Background */}
                    <Animated.View
                        style={{
                            width: STATUS_TAB_WIDTH,
                            transform: [{ translateX: statusTranslateX }],
                        }}
                        className="absolute h-[48px] bg-[#84C8F9] rounded-[53px] left-[3px] top-[6px]"
                    />

                    {STATUSTABS.map((tab, index) => {
                        const isActive = statusIndex === index;

                        return (
                            <TouchableOpacity
                                key={tab.key}
                                onPress={() => switchStatusTab(index, tab.type)}
                                style={{ width: STATUS_TAB_WIDTH, marginHorizontal: 4 }}
                                className={`h-[48px] items-center justify-center rounded-[53px] ${!isActive && "bg-[#1C1C1C]"
                                    }`}
                            >
                                <Text
                                    className={`text-[16px] font-kanit-medium ${isActive ? "text-black" : "text-white"
                                        }`}
                                >
                                    {tab.label}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </View>
            {
                tabLoading ? (
                    <View>
                        {[...Array(5)].map((_, i) => (
                            <SkeletonItem key={i} />
                        ))}
                    </View>
                ) : (
                    <FlatList
                        key={lobType}
                        data={policies}
                        keyExtractor={(item, index) =>
                            item?.id ? item.id.toString() : `renewal-${index}`
                        }
                        renderItem={renderItem}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{
                            flexGrow: 1,
                            justifyContent: policies.length === 0 ? "center" : "flex-start",
                        }}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                            />
                        }
                        ListEmptyComponent={
                            <View className="flex-1 items-center justify-center">
                                <Image source={require('@/assets/images/empty.png')} className="w-[293px] h-[180px]" resizeMode="contain" />
                                <Text className="text-gray-400 text-[15px] font-kanit">
                                    No policies found
                                </Text>
                            </View>
                        }
                        ListFooterComponent={
                            <View className="my-[10px]">
                                {hasMore && (
                                    <View className="items-center">
                                        <TouchableOpacity
                                            onPress={handleLoadMore}
                                            className="bg-[#84C8F9] flex-row gap-2 h-[40px] w-1/3 justify-center items-center rounded-full"
                                        >
                                            {loading && (
                                                <ActivityIndicator size="small" color="#000" />
                                            )}
                                            <Text className="text-black font-semibold">
                                                {loading ? "Loading..." : "Load More"}
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                )}

                                {!hasMore && policies.length > 0 && (
                                    <Text className="text-center text-gray-500 mt-4">
                                        No more policies
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