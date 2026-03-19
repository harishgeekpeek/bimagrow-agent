import { useState } from "react";
import {
    View,
    Modal,
    TouchableOpacity,
    Text,
    ImageBackground,
    Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { requestAppReview } from "@/utils/appReview";

const { width } = Dimensions.get("window");

interface Props {
    visible: boolean;
    onClose: () => void;
}

export default function AppReviewModal({ visible, onClose }: Props) {
    const [rating, setRating] = useState(0);

    const handleSubmit = async () => {
        if (rating === 0) return;

        if (rating >= 4) {
            await requestAppReview();
        } else {
            console.log("Low rating:", rating);
            // Optional: navigate to feedback screen
        }

        onClose();
    };

    return (
        <Modal visible={visible} transparent animationType="fade">
            {/* Overlay */}
            <View className="flex-1 bg-black/80 items-center justify-center">

                {/* Full Width Container */}
                <ImageBackground
                    source={require("@/assets/model-bg.png")}
                    resizeMode="cover"
                    style={{ width: width - 25 }}
                    className="py-12 px-6"
                >
                    {/* Title */}
                    <Text className="text-white text-2xl font-bold text-center mb-4">
                        Rate This App
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
                                    size={30}
                                    color="#FFD700"
                                />
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Buttons */}
                    <View className="flex-row justify-center space-x-4 mb-4">
                        <TouchableOpacity
                            onPress={onClose}
                            className="bg-white/10 px-8 py-3 rounded-full"
                        >
                            <Text className="text-white text-base">
                                Maybe later
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            disabled={rating === 0}
                            onPress={handleSubmit}
                            className={`px-10 py-3 rounded-full ${rating === 0
                                ? "bg-lime-300/40"
                                : "bg-lime-300"
                                }`}
                        >
                            <Text className="text-black font-semibold text-base">
                                Submit
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ImageBackground>
            </View>
        </Modal>
    );
}