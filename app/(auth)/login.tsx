import { useCallback, useState } from "react";
import {
    View, Image, TouchableOpacity, TextInput, Keyboard, TouchableWithoutFeedback,
    KeyboardAvoidingView,
    Platform,
    ScrollView
} from "react-native";
import { Text } from "@/components/ui/text";
import { router, useFocusEffect } from "expo-router";
import { Divider } from "@/components/ui/divider";
import { getcontactsupportApi, sendOTPApi } from "@/src/api/authApi";
import { Linking } from "react-native";
import { useToast } from "@/components/ui/toast";
import { showAppToast } from "@/utils/toastUtils";
import { CaretLeftIcon, PhoneCallIcon, PhoneIcon } from "phosphor-react-native";

export default function LoginScreen() {
    const [callNumber, setCallNumber] = useState<string | null>(null);
    const [whatsappNumber, setWhatsappNumber] = useState<string | null>(null);
    const [phone, setPhone] = useState("");
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const validatePhone = (number: string) => {
        const phoneRegex = /^[6-9]\d{9}$/; // Indian 10 digit mobile
        return phoneRegex.test(number);
    };

    const fetchContactSupportDetails = async () => {
        try {
            const res = await getcontactsupportApi();

            if (res.status) {
                const data = res.data;

                const call = data.find((item: any) => item.type === "Call");
                const whatsapp = data.find((item: any) => item.type === "Whatsapp");

                if (call) setCallNumber(call.mobile_number);
                if (whatsapp) setWhatsappNumber(whatsapp.mobile_number);
            }
        } catch (error: any) {
            console.error("Error while fetch details");
        }
    };

    const handleCallPress = () => {
        if (callNumber) {
            Linking.openURL(`tel:${callNumber}`);
        }
    };

    const handleWhatsappPress = () => {
        if (whatsappNumber) {
            Linking.openURL(`https://wa.me/${whatsappNumber}`);
        }
    };


    useFocusEffect(
        useCallback(() => {
            fetchContactSupportDetails();
        }, [])
    );

    const handleSendOTP = async () => {
        if (!phone.trim()) {
            showAppToast(toast, "error", "Error", 'Please enter your phone number.');
            return;
        }

        if (!validatePhone(phone)) {
            showAppToast(toast, "error", "Error", 'Please enter a valid 10-digit mobile number.');
            return;
        }

        try {
            setLoading(true);

            const res = await sendOTPApi(phone, "SMS");

            if (res.status) {
                showAppToast(toast, "success", "Sent", "OTP sent successfully!");
                // router.push({
                //     pathname: "/(auth)/verify-otp",
                //     params: { mobile: phone },
                // });
                router.replace({
                    pathname: "/(auth)/verify-otp",
                    params: { mobile: phone },
                });
            } else {
                showAppToast(toast, "error", "Error", res?.message || 'Failed to send OTP.');
                console.log('error while send otp--', res?.message)
            }
        } catch (error: any) {
            showAppToast(toast, "error", "Error", error?.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };


    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyboardShouldPersistTaps="handled"

                >
                    <View className="flex-1">

                        <TouchableOpacity className="absolute items-center bg-[#1E1F1A] w-[48px] h-[48px] rounded-full justify-center left-5 top-5 z-10"
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
                        <View className="flex-1 px-5 gap-8 items-center justify-center">
                            <Image
                                source={require('@/assets/images/login.png')}
                                className="w-[295px] h-[181px]"
                                resizeMode="contain"
                            />
                            <Text className="text-white text-[28px] font-biorhyme-bold text-center">Login in{'\n'}your account</Text>

                            <View className="bg-[#171716] justify-center gap-2 w-full h-[98px] rounded-[18px] p-5">
                                <View className="gap-[15px] flex-row items-center w-full mb-1">
                                    <PhoneIcon size={24} color="#DEF3A1" />
                                    <View className="w-[90%]">
                                        <Text className="text-[#A3A3A3] text-[15px] font-kanit-light">Phone</Text>
                                        <TextInput
                                            placeholder="Enter your phone number"
                                            placeholderTextColor="#6B6B6B"
                                            keyboardType="phone-pad"
                                            maxLength={10}
                                            value={phone}
                                            onChangeText={setPhone}
                                            className="text-white text-[16px] !p-0 !m-0 font-kanit-light"
                                        />
                                    </View>
                                </View>
                                <Divider className="bg-[#A3A3A3] relative" />
                            </View>
                            <View className="w-full">
                                <TouchableOpacity
                                    onPress={handleSendOTP}
                                    disabled={loading}
                                    className={`py-4 rounded-full items-center ${loading ? "bg-gray-400" : "bg-[#DEF3A1]"
                                        }`}
                                >
                                    <Text className="text-black text-xl font-kanit">
                                        {loading ? "Sending..." : "Send OTP"}
                                    </Text>
                                </TouchableOpacity>

                            </View>

                            <View className="gap-[30px]">
                                <Text className="text-[14px] text-[#A3A3A3] font-kanit text-center">For Any Help / Support</Text>
                                <View className="flex-row gap-[50px]">
                                    <TouchableOpacity className="border-[1px] border-[#84C8F9] w-[120px] rounded-full items-center justify-center h-[50px] bg-[#171716]"
                                        onPress={handleCallPress}
                                    >
                                        <PhoneCallIcon size={24} color="#84C8F9" />
                                    </TouchableOpacity>
                                    <TouchableOpacity className="border-[1px] border-[#DEF3A1] w-[120px] rounded-full items-center justify-center h-[50px] bg-[#171716]"
                                        onPress={handleWhatsappPress}
                                    >
                                        <Image source={require('@/assets/images/whatsapp.png')} className="w-[24px] h-[24px]" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}
