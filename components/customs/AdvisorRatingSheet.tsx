import { useState } from "react";
import {
    View,
    TouchableOpacity,
    Text,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
    Actionsheet,
    ActionsheetContent,
    ActionsheetDragIndicator,
    ActionsheetDragIndicatorWrapper,
    ActionsheetBackdrop,
} from "@/components/ui/actionsheet";
import { Textarea, TextareaInput } from "@/components/ui/textarea";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    advisorName?: string;
    onSubmit?: (data: any) => void;
}

const NEGATIVE_OPTIONS = [
    "Premium was not competitive",
    "Benefits were not clearly explained",
    "Plan options were limited",
    "Did not suggest the best policy for my needs",
    "Lack of transparency in terms & conditions",
];

const POSITIVE_OPTIONS = [
    "Competitive Premium",
    "Clearly explained benefits & features",
    "Multiple plan options provided",
    "Recommended the best policy as per my needs",
    "Transparent and trustworthy advice",
];

export default function AdvisorRatingSheet({
    isOpen,
    onClose,
    advisorName,
    onSubmit,
}: Props) {
    const insets = useSafeAreaInsets();

    const [rating, setRating] = useState(0);
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
    const [comment, setComment] = useState("");

    const isNegative = rating > 0 && rating <= 3;
    const options = isNegative ? NEGATIVE_OPTIONS : POSITIVE_OPTIONS;

    const toggleOption = (option: string) => {
        if (selectedOptions.includes(option)) {
            setSelectedOptions(selectedOptions.filter(o => o !== option));
        } else {
            if (selectedOptions.length >= 3) return; // max 3
            setSelectedOptions([...selectedOptions, option]);
        }
    };

    const handleSubmit = () => {
        if (rating === 0) return;
        if (selectedOptions.length === 0) return;

        const payload = {
            rating: rating,
            feedback_type: isNegative ? "Negative" : "Positive",
            feedback_tags: selectedOptions,
            comment,
            device_type: Platform.OS,
            platForm_type: "Mobile",
        };

        onSubmit?.(payload);

        // reset
        setRating(0);
        setSelectedOptions([]);
        setComment("");

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

                    <ActionsheetDragIndicatorWrapper>
                        <ActionsheetDragIndicator />
                    </ActionsheetDragIndicatorWrapper>

                    {/* Title */}
                    <Text className="text-white text-[22px] font-biorhyme-medium text-center mt-4 mb-2">
                        Rate Advisor
                    </Text>

                    {/* Advisor Name */}
                    <Text className="text-[#DEF3A1] text-[18px] text-center mt-1 font-kanit mb-6">
                        {advisorName || ""}
                    </Text>

                    {/* Stars */}
                    <View className="flex-row justify-center mb-4">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <TouchableOpacity
                                key={star}
                                onPress={() => {
                                    setRating(star);
                                    setSelectedOptions([]); // reset options on change
                                }}
                                className="mx-2"
                            >
                                <Ionicons
                                    name={star <= rating ? "star" : "star-outline"}
                                    size={36}
                                    color="#FFD700"
                                // color="#DEF3A1"
                                />
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Conditional Questions */}
                    {rating > 0 && (
                        <>
                            <Text className="text-white font-kanit text-[16px] mb-2">
                                {isNegative
                                    ? "What went wrong?"
                                    : "What worked well for you?"}
                            </Text>

                            <Text className="text-[#A3A3A3] font-kanit-light text-[12px] mb-3">
                                Select up to 3 options
                            </Text>

                            {/* Options */}
                            <View className="flex-row flex-wrap gap-2 mb-4">
                                {options.map((opt) => {
                                    const selected = selectedOptions.includes(opt);
                                    return (
                                        <TouchableOpacity
                                            key={opt}
                                            onPress={() => toggleOption(opt)}
                                            className={`px-3 py-2 rounded-full border ${selected
                                                ? "bg-[#DEF3A1] border-[#DEF3A1]"
                                                : "border-[#444]"
                                                }`}
                                        >
                                            <Text
                                                className={`text-[14px] font-kanit-light ${selected ? "text-black" : "text-white"
                                                    }`}
                                            >
                                                {opt}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>

                            {/* Comment Box */}
                            <Textarea className="mb-6 w-full rounded-[8px] border-0 bg-[#292D25]">
                                <TextareaInput
                                    placeholder="Tell us more (optional)"
                                    placeholderTextColor="#888"
                                    value={comment}
                                    onChangeText={setComment}
                                    textAlignVertical="top"
                                    className="text-white font-kanit-light text-[14px]"
                                />
                            </Textarea>
                        </>
                    )}

                    {/* Submit Button */}
                    <View className="flex-row justify-center gap-4 pb-6">
                        <TouchableOpacity
                            disabled={rating === 0 || selectedOptions.length === 0}
                            onPress={handleSubmit}
                            className={`px-10 py-3 rounded-[8px] items-center justify-center text-center ${rating === 0 || selectedOptions.length === 0
                                ? "bg-gray-500"
                                : "bg-[#DEF3A1]"
                                } min-w-[240px]`}
                        >
                            <Text className="text-black text-center text-[16px] font-kanit-medium">
                                Submit
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ActionsheetContent>
            </KeyboardAvoidingView>
        </Actionsheet>
    );
}
