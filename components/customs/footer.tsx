import { useEffect, useState } from "react";
import { View, TouchableOpacity } from "react-native";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
} from "react-native-reanimated";

import {
    ChartPieSliceIcon,
    ShieldCheckIcon,
    ArrowsClockwiseIcon,
    BookBookmarkIcon,
} from "phosphor-react-native";

import { router, usePathname } from "expo-router";

const CONTAINER_HEIGHT = 80;
const CIRCLE_SIZE = 50;

const TABS = [
    { icon: ChartPieSliceIcon, color: "#DCF49F", url: "/dashboard" },
    { icon: ShieldCheckIcon, color: "#FFBDA4", url: "/policy" },
    { icon: ArrowsClockwiseIcon, color: "#84C8F9", url: "/renewal" },
    { icon: BookBookmarkIcon, color: "#B4A5DC", url: "/ledger" },
];

export default function Footer() {
    const pathname = usePathname();
    const [containerWidth, setContainerWidth] = useState(0);

    const translateX = useSharedValue(0);
    const activeColor = useSharedValue(TABS[0]?.color);

    const TAB_WIDTH = containerWidth / TABS.length;
    const centerOffset = (TAB_WIDTH - CIRCLE_SIZE) / 2;
    const verticalOffset = (CONTAINER_HEIGHT - CIRCLE_SIZE) / 2;

    // 🔥 Detect active tab from current route
    const activeIndex =
        TABS.findIndex((tab) => pathname.startsWith(tab.url)) || 0;

    // 🔥 Update animation when route changes
    useEffect(() => {
        if (containerWidth === 0) return;

        const index =
            TABS.findIndex((tab) => pathname.startsWith(tab.url)) || 0;

        translateX.value = withTiming(index * TAB_WIDTH, {
            duration: 300,
        });

        activeColor.value = TABS[index]?.color;
    }, [pathname, containerWidth]);

    const handlePress = (url: string) => {
        router.push(url);
    };

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateX: translateX.value + centerOffset,
                },
            ],
            backgroundColor: activeColor.value,
        };
    });

    return (
        <View>
            <View
                onLayout={(event) => {
                    setContainerWidth(event.nativeEvent.layout.width);
                }}
                style={{
                    height: CONTAINER_HEIGHT,
                    backgroundColor: "#1C1C1C",
                    borderRadius: 999,
                    flexDirection: "row",
                    alignItems: "center",
                    overflow: "hidden",
                }}
            >
                {/* 🔥 Animated Floating Circle */}
                {containerWidth > 0 && (
                    <Animated.View
                        style={[
                            {
                                position: "absolute",
                                width: CIRCLE_SIZE,
                                height: CIRCLE_SIZE,
                                borderRadius: CIRCLE_SIZE / 2,
                                top: verticalOffset,
                            },
                            animatedStyle,
                        ]}
                    />
                )}

                {/* 🔥 Tabs */}
                {TABS.map((tab, index) => {
                    const Icon = tab.icon;
                    const isActive =
                        pathname.startsWith(tab.url);

                    return (
                        <TouchableOpacity
                            key={index}
                            activeOpacity={0.8}
                            onPress={() => handlePress(tab.url)}
                            style={{
                                width: TAB_WIDTH,
                                height: CONTAINER_HEIGHT,
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <Icon
                                size={30}
                                color={isActive ? "#000" : "#FFF"}
                            />
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
}