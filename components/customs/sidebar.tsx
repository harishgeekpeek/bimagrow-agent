import { View, ImageBackground, TouchableOpacity } from "react-native";
import {
    Drawer,
    DrawerBackdrop,
    DrawerContent,
    DrawerBody,
} from "@/components/ui/drawer";
import { Text } from "@/components/ui/text";
import { Divider } from "@/components/ui/divider";
import {
    UserCircleIcon,
    EnvelopeSimpleIcon,
    PhoneIcon,
    SignOutIcon,
} from "phosphor-react-native";
import { useAuth } from "@/src/context/AuthContext";
import AppPopover from "../common/AppPopover";

interface Props {
    showDrawer: boolean;
    setShowDrawer: (val: boolean) => void;
}

export default function ProfileDrawer({
    showDrawer,
    setShowDrawer,
}: Props) {
    const { user, logoutUser } = useAuth();
    return (
        <Drawer
            isOpen={showDrawer}
            size="lg"
            anchor="left"
            onClose={() => setShowDrawer(false)}
        >
            <DrawerBackdrop />

            <DrawerContent className="p-0 border-[0px]">

                <ImageBackground
                    source={require("../../assets/bg.png")}
                    resizeMode="cover"
                    style={{ flex: 1 }}
                >
                    <DrawerBody
                        className="flex-1 px-5 "
                        contentContainerStyle={{
                            flexGrow: 1,
                            justifyContent: "space-between",
                        }}
                    >

                        <View>
                            <View className="flex-row items-center">
                                <UserCircleIcon size={48} weight="fill" color="#FFFFFF" />
                                <View className="ml-2 flex-1">
                                    <AppPopover
                                        trigger={(triggerProps) => (
                                            <Text
                                                {...triggerProps}
                                                numberOfLines={1}
                                                ellipsizeMode="tail"
                                                className="text-white text-[15px] font-biorhyme-medium">
                                                {user?.name}
                                            </Text>
                                        )}
                                    >
                                        <Text className="text-white font-kanit">
                                            {user?.name}
                                        </Text>
                                        <Text className="text-[#A3A3A3] font-kanit text-[13px]">{user?.email}</Text>
                                    </AppPopover>
                                    {user?.email && (
                                        <Text
                                            numberOfLines={1}
                                            ellipsizeMode="tail"
                                            className="text-[#A3A3A3] font-kanit text-[13px]">
                                            {user?.email}
                                        </Text>
                                    )}
                                </View>

                            </View>
                            <Divider className="bg-[#A3A3A3] my-4" />
                            {
                                user?.email && (
                                    <>
                                        <View className="flex-row items-center">
                                            <View className="bg-[#2D3A22] p-2 rounded-lg mr-3">
                                                <EnvelopeSimpleIcon size={18} color="#FFFFFF" />
                                            </View>
                                            <View className="flex-1">
                                                <Text className="text-[#A3A3A3] font-kanit text-[12px]">
                                                    Email
                                                </Text>
                                                <AppPopover
                                                    trigger={(triggerProps) => (
                                                        <Text {...triggerProps} className="text-white font-kanit text-[14px]" numberOfLines={1} ellipsizeMode="tail">
                                                            {user?.email}
                                                        </Text>
                                                    )}
                                                >
                                                    <Text className="text-white font-kanit">
                                                        {user?.email}
                                                    </Text>
                                                </AppPopover>
                                            </View>
                                        </View>
                                        <Divider className="bg-[#A3A3A3] my-4" />
                                    </>
                                )
                            }
                            {
                                user?.mobile && (
                                    <View className="flex-row items-center">
                                        <View className="bg-[#2D3A22] p-2 rounded-lg mr-3">
                                            <PhoneIcon size={18} color="#FFFFFF" />
                                        </View>
                                        <View className="flex-1">
                                            <Text className="text-[#A3A3A3] font-kanit text-[12px]">
                                                Mobile
                                            </Text>
                                            <AppPopover
                                                trigger={(triggerProps) => (
                                                    <Text {...triggerProps} className="text-white font-kanit text-[14px]" numberOfLines={1} ellipsizeMode="tail">
                                                        {user?.mobile || "+91 0000000000"}
                                                    </Text>
                                                )}
                                            >
                                                <Text className="text-white font-kanit">
                                                    {user?.mobile || "+91 0000000000"}
                                                </Text>
                                            </AppPopover>
                                        </View>
                                    </View>
                                )
                            }
                        </View>

                        <View className="items-center">
                            <View className="w-full mb-4">
                                <TouchableOpacity
                                    onPress={logoutUser}
                                    className={`py-3 flex-row gap-2 justify-center rounded-[12px] items-center bg-[#C22424]`}
                                >
                                    <SignOutIcon size={20} color="#FFFFFF" />
                                    <Text className="text-white text-[16px] font-kanit">
                                        Logout
                                    </Text>
                                </TouchableOpacity>

                            </View>
                            <Text className="text-[#DEF3A1] font-kanit-light text-[16px]">
                                v1.0.0 © Bimagrow
                            </Text>
                        </View>

                    </DrawerBody>
                </ImageBackground>

            </DrawerContent>
        </Drawer>
    );
}
