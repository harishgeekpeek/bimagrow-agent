import { useState } from "react";
import { View, TouchableOpacity, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, ScrollView, Keyboard, Image, TextInput } from "react-native";
import { Text } from "@/components/ui/text";
import OTPInput from "@/components/customs/otpInput";
import { router } from "expo-router";
import { getMPIN } from "@/utils/mpin";
import { Divider } from "@/components/ui/divider";
import SecurePinInput from "@/components/customs/SecurePinInput";
import { useToast } from "@/components/ui/toast";
import { showAppToast } from "@/utils/toastUtils";

export default function UnlockMPIN() {
    const [enteredPin, setEnteredPin] = useState("");
    const toast = useToast();
    const handleUnlock = async (code: any) => {
        const savedPin = await getMPIN();

        if (code === savedPin) {
            router.replace("/(main)/dashboard");
        } else {
            showAppToast(toast, "error", "Error", 'Wrong MPIN.');
        }
    };
    const isValid = enteredPin.length === 4;

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyboardShouldPersistTaps="handled"
                >
                    <View className="flex-1 px-5 gap-6 items-center justify-center">
                        <Image
                            source={require('@/assets/images/lock.png')}
                            className="w-[295px] h-[181px]"
                            resizeMode="contain"
                        />
                        <Text numberOfLines={1} className="text-white text-[28px] font-biorhyme-bold text-center">Unlock Dashboard</Text>
                        <View>
                            <Text numberOfLines={2} className="text-[18px] text-center text-[#A3A3A3] font-kanit">Enter your 4-digit MPIN to access your{'\n'}dashboard.</Text>
                        </View>

                        <View className="bg-[#171716] items-center justify-center gap-2 w-[180px] h-[50px] rounded-[50px] my-[15px] p-5">
                            {/* <SecurePinInput
                                onComplete={(code) => setEnteredPin(code)}
                            /> */}
                            <SecurePinInput
                                // onComplete={(code) => setEnteredPin(code)}
                                onComplete={(code: string) => {
                                    setEnteredPin(code);
                                    handleUnlock(code);
                                }}
                            />
                        </View>
                        <View className="w-full">
                            <TouchableOpacity
                                disabled={!isValid}
                                onPress={() => handleUnlock(enteredPin)}
                                className={`py-4 rounded-full items-center bg-[#DEF3A1]`}
                                style={{ opacity: isValid ? 1 : 0.5 }}
                            >
                                <Text className="text-black text-xl font-kanit">
                                    Unlock
                                </Text>
                            </TouchableOpacity>

                        </View>
                    </View>
                </ScrollView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}