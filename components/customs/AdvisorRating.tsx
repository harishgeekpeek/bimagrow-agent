import { Ionicons } from "@expo/vector-icons";
import { View, Text, TouchableOpacity } from "react-native";

type Props = {
    ratingData?: any;
    advisorId: number | string;
    policyId: number | string;
    onRatePress?: (advisorId: any, policyId: any) => void;
    buttonColor?: string;
};

const StarRating = ({ rating = 0 }) => {
    return (
        <View className="flex-row items-center">
            {[1, 2, 3, 4, 5].map((i) => (
                // <Text
                //     key={i}
                //     className={`text-[18px] ${i <= rating ? "text-yellow-500" : "text-gray-300"
                //         }`}
                // >
                //     ★
                // </Text>
                <Ionicons
                    key={i}
                    name={i <= rating ? "star" : "star-outline"}
                    size={16}
                    color="#FFD700"
                />
            ))}
        </View>
    );
};

const AdvisorRating: React.FC<Props> = ({
    ratingData,
    advisorId,
    policyId,
    onRatePress,
    buttonColor,
}) => {
    if (ratingData) {
        return (
            <View className="flex-row items-center gap-2">
                <StarRating rating={ratingData.rating} />
                {/* <Text className="text-[12px] text-[#6C6060] font-kanit">
                    {ratingData.feedback_type}
                </Text> */}
            </View>
        );
    }

    return (
        <TouchableOpacity
            onPress={() => onRatePress?.(advisorId, policyId)}
            // style={{ backgroundColor: buttonColor }}
            className="items-center justify-center flex-row gap-2"
        >
            <Text className="text-black text-[12px]  font-kanit">
                Rate Advisor
            </Text>
            <StarRating />
        </TouchableOpacity>

    );
};

export default AdvisorRating;