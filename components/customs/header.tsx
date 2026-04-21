import { useAuth } from "@/src/context/AuthContext";
import { useSearch } from "@/src/context/SearchContext";
import {
    BellIcon,
    CaretLeftIcon,
    MagnifyingGlassIcon,
    SignOutIcon,
    UserCircleIcon,
    XIcon,
} from "phosphor-react-native";
import { usePathname } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
    Text,
    TouchableOpacity,
    View,
    TextInput,
    Animated,
    Easing,
} from "react-native";
import ProfileDrawer from "./sidebar";
import { router } from "expo-router";
import AppPopover from "../common/AppPopover";
import AppReviewModal from "../common/AppReviewModal";
import AppReviewSheet from "../common/AppReviewSheet";
import { Badge, BadgeText } from "../ui/badge";

interface HeaderProps {
    type: "dashboard" | "page";
    title?: string;
    onSearch?: (value: string) => void;
}

export default function Header({
    type,
    title = "",
    onSearch,
}: HeaderProps) {
    const pathname = usePathname();
    const { user, logoutUser } = useAuth();
    const { search, setSearch, isSearchEnabled } = useSearch();
    const [shouldRenderSearch, setShouldRenderSearch] = useState(false);

    const [showDrawer, setShowDrawer] = useState(false);
    const [isSearching, setIsSearching] = useState(false);

    // Animation values
    const searchSlide = useRef(new Animated.Value(0)).current;
    const titleFade = useRef(new Animated.Value(1)).current;

    const openSearch = () => {
        setShouldRenderSearch(true);
        setIsSearching(true);

        Animated.parallel([
            Animated.timing(titleFade, {
                toValue: 0,
                duration: 150,
                useNativeDriver: true,
            }),
            Animated.timing(searchSlide, {
                toValue: 1,
                duration: 300,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
            }),
        ]).start();
    };


    const closeSearch = () => {
        Animated.parallel([
            Animated.timing(searchSlide, {
                toValue: 0,
                duration: 250,
                easing: Easing.in(Easing.ease),
                useNativeDriver: true,
            }),
            Animated.timing(titleFade, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
            }),
        ]).start(() => {
            setIsSearching(false);
            setShouldRenderSearch(false);
            setSearch("");
            onSearch?.("");
        });
    };

    useEffect(() => {
        setIsSearching(false);
        setShouldRenderSearch(false);
        searchSlide.setValue(0);
        titleFade.setValue(1);
    }, [pathname]);

    // Reset when route disables search
    useEffect(() => {
        if (!isSearchEnabled) {
            setIsSearching(false);
            searchSlide.setValue(0);
            titleFade.setValue(1);
        }
    }, [isSearchEnabled]);

    const searchTranslate = searchSlide.interpolate({
        inputRange: [0, 1],
        outputRange: [60, 0],
    });

    return (
        <>
            {type === "dashboard" ? (
                <View className="flex-row w-full items-center justify-between">
                    <View className="flex-row items-center flex-1 mr-3">
                        <TouchableOpacity onPress={() => setShowDrawer(true)}>
                            <UserCircleIcon size={48} weight="fill" color="#FFFFFF" />
                        </TouchableOpacity>

                        <View className="ml-2 flex-1">
                            <AppPopover
                                trigger={(triggerProps) => (
                                    <Text
                                        {...triggerProps}
                                        numberOfLines={1}
                                        className="text-white text-[15px] font-biorhyme-medium"
                                    >
                                        Hello, {user?.name || ""}
                                    </Text>
                                )}
                            >
                                <Text className="text-white font-kanit">
                                    {user?.name || ""}
                                </Text>
                            </AppPopover>

                            <Text className="text-[#A3A3A3] text-[13px] font-kanit">
                                Welcome Back
                            </Text>
                        </View>
                    </View>

                    <View className="flex-row items-center gap-2 relative">
                        {/* <TouchableOpacity className="items-center bg-[#23261D] w-[40px] h-[40px] rounded-full justify-center">
                            <MagnifyingGlassIcon size={20} color="#FFFFFF" />
                        </TouchableOpacity> */}
                        <TouchableOpacity className="items-center bg-[#23261D] w-[48px] h-[48px] rounded-full justify-center"
                            onPress={() => router.push('/notification')}
                        >
                            <View className="w-[8px] h-[8px] z-10 absolute bg-red-600 rounded-full top-[14px] right-[14px]"></View>
                            <BellIcon size={24} color="#FFFFFF" />
                        </TouchableOpacity>

                        {/* <TouchableOpacity
                            className="items-center bg-[#23261D] w-[40px] h-[40px] rounded-full justify-center"
                            onPress={logoutUser}
                        >
                            <SignOutIcon size={20} color="#FFFFFF" />
                        </TouchableOpacity> */}
                    </View>
                </View>
            ) : (
                <View className="flex-row w-full items-center gap-3">
                    {/* BACK BUTTON */}
                    <TouchableOpacity
                        className="items-center bg-[#1E1F1A] w-[48px] h-[48px] rounded-full justify-center"
                        onPress={() => {
                            if (router.canGoBack()) {
                                router.back();
                            } else {
                                router.replace("/");
                            }
                        }}
                    >
                        <CaretLeftIcon size={24} color="white" />
                    </TouchableOpacity>

                    {/* TITLE + SEARCH */}
                    <View className="flex-1 overflow-hidden h-[48px] justify-center">
                        {/* TITLE (fade only) */}
                        <Animated.View style={{ opacity: titleFade }}>
                            <Text
                                className="text-[18px] text-center text-white font-biorhyme-semibold"
                                numberOfLines={1}
                            >
                                {title}
                            </Text>
                        </Animated.View>

                        {/* SEARCH INPUT */}
                        {shouldRenderSearch && isSearchEnabled && (
                            <Animated.View
                                style={{
                                    transform: [{ translateX: searchTranslate }],
                                }}
                                className="absolute w-full flex-row items-center bg-[#24271E] rounded-full px-4 h-[48px]"
                            >
                                <MagnifyingGlassIcon size={20} color="#FFFFFF" />
                                <TextInput
                                    value={search}
                                    onChangeText={(text) => {
                                        setSearch(text);
                                        onSearch?.(text);
                                    }}
                                    placeholder="Search..."
                                    placeholderTextColor="#999"
                                    className="flex-1 text-white"
                                    returnKeyType="search"
                                    autoFocus
                                />

                                <TouchableOpacity onPress={closeSearch}>
                                    <XIcon size={20} color="white" />
                                </TouchableOpacity>
                            </Animated.View>
                        )}
                    </View>

                    {/* SEARCH ICON */}
                    {!isSearching && isSearchEnabled && (
                        <TouchableOpacity
                            className="items-center bg-[#24271E] w-[48px] h-[48px] rounded-full justify-center"
                            onPress={openSearch}
                        >
                            <MagnifyingGlassIcon size={24} color="white" />
                        </TouchableOpacity>
                    )}
                </View>
            )}

            <ProfileDrawer
                showDrawer={showDrawer}
                setShowDrawer={setShowDrawer}
            />
        </>
    );
}

