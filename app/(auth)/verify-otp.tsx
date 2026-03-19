import { useCallback, useState, useEffect } from "react";
import {
    View, Image, TouchableOpacity, TextInput, Keyboard, TouchableWithoutFeedback, KeyboardAvoidingView,
    Platform,
    ScrollView
} from "react-native";
import { Text } from "@/components/ui/text";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { Divider } from "@/components/ui/divider";
import { sendOTPApi, verifyOtpApi } from "@/src/api/authApi";
import { useToast } from "@/components/ui/toast";
import { showAppToast } from "@/utils/toastUtils";
import OTPInput from "@/components/customs/otpInput";
import { useAuth } from "@/src/context/AuthContext";
import { CaretLeftIcon, ClockIcon, NotePencilIcon } from "phosphor-react-native";
import { getMPIN } from "@/utils/mpin";

export default function VerifyOTP() {
    const { mobile } = useLocalSearchParams();
    const { loginUser } = useAuth();
    const toast = useToast();

    const [loading, setLoading] = useState(false);
    const [otpCode, setOtpCode] = useState("");

    const RESEND_TIME = 60;

    const [timer, setTimer] = useState(RESEND_TIME);
    const [isResendActive, setIsResendActive] = useState(false);


    const handleVerifyOTP = async (code?: string) => {
        const finalOtp = code || otpCode;

        if (finalOtp.length !== 6) {
            showAppToast(toast, "error", "Error", "Please enter 6-digit OTP");
            return;
        }

        try {
            setLoading(true);

            const res = await verifyOtpApi(String(mobile), finalOtp);

            if (res?.user?.token) {
                await loginUser(res.user, res.user.token);
                showAppToast(toast, "success", "Success", res.message);
                const savedMPIN = await getMPIN();

                if (savedMPIN) {
                    router.replace("/(auth)/unlock-mpin");
                } else {
                    router.replace("/(auth)/create-mpin");
                }

            } else {
                showAppToast(toast, "error", "Error", res?.message || "Invalid OTP");
            }
        } catch (error: any) {
            showAppToast(
                toast,
                "error",
                "Error",
                error?.response?.data?.message || "Verification failed"
            );
        } finally {
            setLoading(false);
        }
    };

    const handleResendOTP = async () => {
        if (!isResendActive) return;

        try {
            // setLoading(true);

            const res = await sendOTPApi(String(mobile), "Whatsapp");

            if (res?.status) {
                showAppToast(toast, "success", "Success", "OTP resent successfully");

                setTimer(RESEND_TIME);
                setIsResendActive(false);
            } else {
                showAppToast(toast, "error", "Error", "Failed to resend OTP");
            }
        } catch (error: any) {
            showAppToast(
                toast,
                "error",
                "Error",
                error?.response?.data?.message || "Something went wrong"
            );
        } finally {
            // setLoading(false);
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;

        return `${mins.toString().padStart(2, "0")}:${secs
            .toString()
            .padStart(2, "0")}`;
    };



    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        } else {
            setIsResendActive(true);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [timer]);

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
                    <View className="flex-1">

                        <TouchableOpacity className="absolute items-center bg-[#1E1F1A] w-[48px] h-[48px] rounded-full justify-center left-5 top-5 z-10"
                            onPress={() => {
                                if (router.canGoBack()) {
                                    router.back();
                                } else {
                                    router.replace("/(auth)/login");
                                }
                            }}
                        >
                            <CaretLeftIcon size={24} color="white" />
                        </TouchableOpacity>
                        <View className="flex-1 px-5 gap-4 items-center justify-center">
                            <Image
                                source={require('@/assets/images/verify-otp.png')}
                                className="w-[295px] h-[181px]"
                                resizeMode="contain"
                            />
                            <Text className="text-white text-[28px] font-biorhyme-bold text-center">Verify your{'\n'}OTP</Text>
                            <View>
                                <Text className="text-[16px] text-[#A3A3A3] font-kanit">We've sent a 6-digit OTP to</Text>
                                <TouchableOpacity onPress={() =>
                                    // router.push('/(auth)/login')
                                    router.replace('/(auth)/login')
                                } className="flex-row gap-4 items-center justify-center">
                                    <Text className="text-[#DEF3A1] text-[18px] font-kanit-medium">{mobile || ''}</Text>
                                    <NotePencilIcon size={20} color="#DEF3A1" />
                                </TouchableOpacity>
                            </View>

                            <View className="bg-[#171716] justify-center gap-2 w-full h-[98px] rounded-[18px] my-[15px] p-5">
                                <OTPInput
                                    onComplete={(code: string) => {
                                        setOtpCode(code);
                                        handleVerifyOTP(code);
                                    }}
                                />
                            </View>
                            <View className="flex-row items-center gap-2">
                                <Divider className="bg-[#A3A3A3] w-[40%]" />
                                <View className="flex-row items-center gap-1">
                                    <ClockIcon size={16} weight="fill" color="#A3A3A3" />
                                    <Text className="text-[#A3A3A3] font-kanit-light text-[16px]">{formatTime(timer)}</Text>
                                </View>
                                <Divider className="bg-[#A3A3A3] w-[40%]" />
                            </View>

                            <View className="items-center">
                                <Text className="text-[#A3A3A3] text-[15px] font-kanit">Haven't received it?</Text>
                                <TouchableOpacity className="flex-row items-center gap-2" onPress={handleResendOTP} disabled={!isResendActive}>
                                    <Text
                                        className={`text-[16px] font-kanit-medium ${isResendActive ? "text-[#DEF3A1]" : "text-gray-500"
                                            }`}
                                    >
                                        Resend Code On
                                    </Text>
                                    <Image source={require('@/assets/images/whatsapp.png')} className="w-[16px] h-[16px]" />
                                </TouchableOpacity>
                            </View>
                            <View className="w-full">
                                <TouchableOpacity
                                    onPress={() => handleVerifyOTP()}
                                    disabled={loading}
                                    className={`py-4 rounded-full items-center ${loading ? "bg-gray-400" : "bg-[#DEF3A1]"}`}
                                >
                                    <Text className="text-black text-xl font-kanit">
                                        {loading ? "Verifying..." : "Verify"}
                                    </Text>
                                </TouchableOpacity>

                            </View>
                        </View>
                    </View>
                </ScrollView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    )
}