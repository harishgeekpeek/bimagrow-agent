import { useAuth } from "@/src/context/AuthContext";
import { BellIcon, CaretLeftIcon, MagnifyingGlassIcon, SignOutIcon, UserCircleIcon } from "phosphor-react-native";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import ProfileDrawer from "./sidebar";
import { router } from "expo-router";
import AppPopover from "../common/AppPopover";

interface HeaderProps {
    type: "dashboard" | "page";
    title?: string;
    onSearch?: (value: string) => void;
}

export default function Header(
    {
        type,
        title = "",
    }: HeaderProps
) {
    const { user, logoutUser } = useAuth();
    const [showDrawer, setShowDrawer] = useState(false);

    return (
        <>
            {type == 'dashboard' ?
                (<View className="flex-row w-full items-center justify-between">
                    <View className="flex-row items-center flex-1 mr-3">
                        <TouchableOpacity
                            className=""
                            onPress={() => setShowDrawer(true)}
                        >
                            <UserCircleIcon size={48} weight="fill" color="#FFFFFF" />
                        </TouchableOpacity>

                        <View className="ml-2 flex-1">
                            <AppPopover
                                trigger={(triggerProps) => (
                                    <Text
                                        {...triggerProps}
                                        numberOfLines={1}
                                        ellipsizeMode="tail"
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
                    <View className="flex-row items-center gap-2">
                        <TouchableOpacity className="items-center bg-[#23261D] w-[40px] h-[40px] rounded-full justify-center">
                            <MagnifyingGlassIcon size={20} color="#FFFFFF" />
                        </TouchableOpacity>

                        <TouchableOpacity className="items-center bg-[#23261D] w-[40px] h-[40px] rounded-full justify-center">
                            <BellIcon size={20} color="#FFFFFF" />
                        </TouchableOpacity>

                        <TouchableOpacity className="items-center bg-[#23261D] w-[40px] h-[40px] rounded-full justify-center"
                            onPress={logoutUser}
                        >
                            <SignOutIcon size={20} color="#FFFFFF" />
                        </TouchableOpacity>
                    </View>
                </View>) :
                (<View className="flex-row w-full gap-4 items-center justify-between">
                    <TouchableOpacity className=" items-center bg-[#1E1F1A] w-[48px] h-[48px] rounded-full justify-center"
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
                    <View className="flex-1">
                        <Text className="text-[18px] text-center text-white font-biorhyme-semibold" numberOfLines={1} ellipsizeMode="tail">{title || ''}</Text>
                    </View>
                    <TouchableOpacity className=" items-center bg-[#24271E] w-[48px] h-[48px] rounded-full justify-center">
                        <MagnifyingGlassIcon size={24} color="white" />
                    </TouchableOpacity>
                </View>)
            }

            <ProfileDrawer
                showDrawer={showDrawer}
                setShowDrawer={setShowDrawer}
            />
        </>
    )
}