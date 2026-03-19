import { useState } from "react";
import { View, TouchableOpacity, Text, KeyboardAvoidingView, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
    Actionsheet,
    ActionsheetContent,
    ActionsheetDragIndicator,
    ActionsheetDragIndicatorWrapper,
    ActionsheetBackdrop,
} from "@/components/ui/actionsheet";
import { requestAppReview, REVIEW_COMPLETED_KEY } from "@/utils/appReview";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export default function AppReviewSheet({ isOpen, onClose }: Props) {
    const [rating, setRating] = useState(0);
    const insets = useSafeAreaInsets();
    const handleSubmit = async () => {
        if (rating === 0) return;

        await AsyncStorage.setItem(REVIEW_COMPLETED_KEY, "true");

        if (rating >= 4) {
            await requestAppReview();
        }

        onClose();
    };

    return (
        <Actionsheet isOpen={isOpen} onClose={onClose}>
            <ActionsheetBackdrop />
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === "ios" ? insets.top + 40 : 0}
                style={{ flex: 1 }}
            >
                <ActionsheetContent className="bg-[#171716] rounded-t-3xl px-6 pb-10">

                    {/* Drag Indicator */}
                    <ActionsheetDragIndicatorWrapper>
                        <ActionsheetDragIndicator />
                    </ActionsheetDragIndicatorWrapper>

                    {/* Title */}
                    <Text className="text-white text-[22px] font-biorhyme-medium text-center mt-4 mb-6">
                        Your Experience Matters
                    </Text>

                    {/* Subtitle (Optional but recommended for insurance app) */}
                    <Text className="text-[#A3A3A3] text-[16px] text-center font-kanit mb-8">
                        Help us improve your insurance journey
                    </Text>

                    {/* Stars */}
                    <View className="flex-row justify-center mb-10">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <TouchableOpacity
                                key={star}
                                onPress={() => setRating(star)}
                                activeOpacity={0.7}
                                className="mx-2"
                            >
                                <Ionicons
                                    name={star <= rating ? "star" : "star-outline"}
                                    size={40}
                                    color="#FFD700"
                                />
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Buttons */}
                    <View className="flex-row justify-center gap-4 pb-6">
                        <TouchableOpacity
                            onPress={onClose}
                            className="bg-[#292D25] px-8 py-3 items-center justify-center rounded-[8px] min-w-[140px]"
                        >
                            <Text className="text-white text-center text-[14px] font-kanit-medium">Maybe Later</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            disabled={rating === 0}
                            onPress={handleSubmit}
                            className={`px-10 py-3 rounded-[8px] items-center justify-center text-center bg-[#DEF3A1] min-w-[140px]`}
                        >
                            <Text className="text-black text-center text-[14px] font-kanit-medium">
                                Submit
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ActionsheetContent>
            </KeyboardAvoidingView>
        </Actionsheet>
    );
}