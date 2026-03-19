import { useRef, useEffect, useState } from "react";
import {
    View,
    TextInput,
    StyleSheet,
    Pressable,
    Keyboard,
    Text,
    Animated,
    NativeSyntheticEvent,
    TextInputSelectionChangeEventData,
} from "react-native";

interface OTPInputProps {
    length?: number;
    onComplete?: (otp: string) => void;
}

const OTPInput = ({ length = 6, onComplete }: OTPInputProps) => {
    const inputRef = useRef<TextInput>(null);
    const [value, setValue] = useState("");
    const [selection, setSelection] = useState({ start: 0, end: 0 });
    const blinkAnim = useRef(new Animated.Value(0)).current;

    // 🔥 blinking cursor
    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(blinkAnim, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                }),
                Animated.timing(blinkAnim, {
                    toValue: 0,
                    duration: 500,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    useEffect(() => {
        if (value.length === length) {
            Keyboard.dismiss();
            onComplete?.(value);
        }
    }, [value]);

    const handleChange = (text: string) => {
        const cleaned = text.replace(/\D/g, "");

        // If user pasted full OTP
        if (cleaned.length > 1) {
            const newValue = cleaned.slice(0, length);
            setValue(newValue);
            setSelection({ start: newValue.length, end: newValue.length });
            return;
        }

        setValue(cleaned);
    };

    const handleSelectionChange = (
        e: NativeSyntheticEvent<TextInputSelectionChangeEventData>
    ) => {
        setSelection(e.nativeEvent.selection);
    };

    const handleBoxPress = (index: number) => {
        inputRef.current?.focus();

        setTimeout(() => {
            inputRef.current?.setNativeProps({
                selection: { start: index, end: index },
            });
        }, 0);
    };

    const activeIndex = selection.start;

    return (
        <View style={styles.container}>
            {/* Hidden Input */}
            <TextInput
                ref={inputRef}
                value={value}
                onChangeText={handleChange}
                onSelectionChange={handleSelectionChange}
                keyboardType="number-pad"
                textContentType="oneTimeCode"
                autoComplete="sms-otp"
                importantForAutofill="yes"
                maxLength={length}
                style={styles.hiddenInput}
            />

            {/* Visual Boxes */}
            {Array.from({ length }).map((_, index) => {
                const digit = value[index] || "";
                const isActive = index === activeIndex;

                return (
                    <Pressable
                        key={index}
                        onPress={() => handleBoxPress(index)}
                        style={[
                            styles.input,
                            digit && styles.filledInput,
                            isActive && styles.activeInput,
                        ]}
                    >
                        {digit ? (
                            <Text style={styles.digitText}>{digit}</Text>
                        ) : isActive ? (
                            <Animated.View
                                style={[styles.cursor, { opacity: blinkAnim }]}
                            />
                        ) : null}
                    </Pressable>
                );
            })}
        </View>
    );
};

export default OTPInput;

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    hiddenInput: {
        position: "absolute",
        opacity: 0,
        width: 1,
        height: 1,
    },
    input: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: "#171716",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#ffffff",
    },
    filledInput: {
        borderColor: "#DEF3A1",
    },
    activeInput: {
        borderColor: "#DEF3A1",
    },
    digitText: {
        fontSize: 22,
        color: "#FFFFFF",
    },
    cursor: {
        width: 2,
        height: 24,
        backgroundColor: "#FFFFFF",
        borderRadius: 1,
    },
});