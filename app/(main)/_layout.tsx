import Footer from "@/components/customs/footer";
import Header from "@/components/customs/header";
import { useAuth } from "@/src/context/AuthContext";
import { SearchProvider, useSearch } from "@/src/context/SearchContext";
import { router, Slot, usePathname } from "expo-router";
import { ArrowsClockwiseIcon, BellIcon, ChartPieSliceIcon, MagnifyingGlassIcon, ShieldCheckIcon, SignOutIcon, UserCircleIcon, UsersThreeIcon } from "phosphor-react-native";
import { useState } from "react";
import { View, Text, TouchableOpacity, Dimensions } from "react-native";

function LayoutContent() {
    const pathname = usePathname();
    const { setSearch, isSearchEnabled } = useSearch();

    const type = pathname.startsWith("/dashboard")
        ? "dashboard"
        : "page";

    const getTitle = () => {
        switch (pathname) {
            case "/policy":
                return "My Policy";
            case "/renewal":
                return "My Renewal";
            case "/ledger":
                return "My Ledger";
            case "/ledger-detail":
                return "My Ledger";
            case "/notification":
                return "Notification";
            default:
                return "";
        }
    };

    return (
        <View className="flex-1 p-5">
            <Header
                type={type}
                title={getTitle()}
                onSearch={isSearchEnabled ? (value) => setSearch(value) : undefined}
            />

            <View className="flex-1">
                <Slot />
            </View>
            {pathname !== '/notification' && (
                <Footer />
            )}
        </View>
    );
}


export default function MainLayout() {
    return (
        <SearchProvider>
            <LayoutContent />
        </SearchProvider>
    );
}
