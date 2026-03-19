import { useState } from "react";
import { View, TouchableOpacity, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, ScrollView, Image } from "react-native";
import { Text } from "@/components/ui/text";
import { router, useLocalSearchParams } from "expo-router";
import OTPInput from "@/components/customs/otpInput";
import { saveMPIN } from "@/utils/mpin";
import SecurePinInput from "@/components/customs/SecurePinInput";
import { useToast } from "@/components/ui/toast";
import { showAppToast } from "@/utils/toastUtils";

export default function ConfirmMPIN() {
    const { mpin, code } = useLocalSearchParams();
    const [confirmPin, setConfirmPin] = useState("");
    const toast = useToast();
    const handleConfirm = async (entercode: any) => {
        if (entercode !== code) {
            showAppToast(toast, "error", "Error", 'MPIN does not match.');
            return;
        }

        await saveMPIN(entercode);
        router.replace("/(main)/dashboard");
    };
    const isValid = confirmPin.length === 4;


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
                        <Text numberOfLines={1} className="text-white text-[28px] font-biorhyme-bold text-center">Confirm MPIN</Text>
                        <View>
                            <Text numberOfLines={2} className="text-[18px] text-center text-[#A3A3A3] font-kanit">Re-enter your MPIN to confirm{'\n'}it’s correct.</Text>
                        </View>
                        <View className="items-center mb-4">
                            <View className="bg-[#171716] items-center justify-center gap-2 w-[180px] h-[50px] rounded-[50px] my-[15px] p-5">
                                <SecurePinInput
                                    // onComplete={(code) => setConfirmPin(code)}
                                    onComplete={(code: string) => {
                                        setConfirmPin(code);
                                        handleConfirm(code);
                                    }}
                                />
                            </View>
                            <Text className="text-[#A3A3A3] text-[14px] font-kanit">Use a 4-digit number you can remeber easily</Text>
                        </View>
                        <View className="w-full">
                            <TouchableOpacity
                                disabled={!isValid}
                                onPress={() => handleConfirm(confirmPin)}
                                className={`py-4 rounded-full items-center bg-[#DEF3A1]`}
                                // className={`py-4 rounded-full items-center ${isValid ? "bg-[#DEF3A1]" : "bg-[#3A3A3A]"
                                //     }`}
                                style={{ opacity: isValid ? 1 : 0.5 }}
                            >
                                <Text className="text-black text-xl font-kanit">
                                    Confirm
                                </Text>
                            </TouchableOpacity>

                        </View>
                    </View>
                </ScrollView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}