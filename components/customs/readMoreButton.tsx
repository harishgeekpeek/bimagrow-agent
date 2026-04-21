import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

const ReadMoreText = ({ text }: { text: string }) => {
    const [expanded, setExpanded] = useState(false);
    const [showToggle, setShowToggle] = useState(false);
    return (
        <View className="flex-1">
            <Text
                numberOfLines={expanded ? undefined : 3}
                onTextLayout={(e) => {
                    if (e.nativeEvent.lines.length > 3) {
                        setShowToggle(true);
                    }
                }}
                className="text-[14px] text-[#A3A3A3] font-kanit-light mb-2"
            >
                {text}
            </Text>

            {showToggle && (
                <TouchableOpacity onPress={() => setExpanded(!expanded)}>
                    <Text className="text-[12px] text-[#DCF49F] font-kanit">
                        {expanded ? "Read Less" : "Read More"}
                    </Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

export default ReadMoreText;