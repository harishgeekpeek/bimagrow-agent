import { useRef, useEffect, useState } from "react";
import {
    View,
    TextInput,
    StyleSheet,
    Pressable,
    Keyboard,
    Animated,
    NativeSyntheticEvent,
    TextInputSelectionChangeEventData,
} from "react-native";

interface SecurePinInputProps {
    length?: number;
    onComplete?: (pin: string) => void;
    autoFocus?: boolean;
}

const SecurePinInput = ({
    length = 4,
    onComplete,
    autoFocus = true,
}: SecurePinInputProps) => {
    const inputRef = useRef<TextInput>(null);
    const [value, setValue] = useState("");
    const [selection, setSelection] = useState({ start: 0, end: 0 });
    const blinkAnim = useRef(new Animated.Value(0)).current;

    // 🔥 Auto focus
    useEffect(() => {
        if (autoFocus) {
            setTimeout(() => inputRef.current?.focus(), 150);
        }
    }, []);

    // 🔥 Blinking cursor
    useEffect(() => {
        const loop = Animated.loop(
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
        );

        loop.start();
        return () => loop.stop();
    }, []);

    // 🔥 Complete handler
    useEffect(() => {
        if (value.length === length) {
            Keyboard.dismiss();
            onComplete?.(value);
        }
    }, [value]);

    const handleChange = (text: string) => {
        const cleaned = text.replace(/\D/g, "");
        const newValue = cleaned.slice(0, length);

        setValue(newValue);
        setSelection({
            start: newValue.length,
            end: newValue.length,
        });
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
            setSelection({ start: index, end: index });
        }, 0);
    };

    const activeIndex = Math.min(selection.start, length - 1);

    return (
        <View style={styles.container}>
            {/* Hidden real input */}
            <TextInput
                ref={inputRef}
                value={value}
                onChangeText={handleChange}
                onSelectionChange={handleSelectionChange}
                keyboardType="number-pad"
                secureTextEntry={false}
                maxLength={length}
                style={styles.hiddenInput}
                caretHidden
            />

            {/* Visual PIN Boxes */}
            {Array.from({ length }).map((_, index) => {
                const isFilled = index < value.length;
                const isActive = index === activeIndex;

                return (
                    <Pressable
                        key={index}
                        onPress={() => handleBoxPress(index)}
                        style={[
                            styles.box,
                            isFilled && styles.filledBox,
                            isActive && styles.activeBox,
                        ]}
                    >
                        {isFilled ? (
                            <View style={styles.dot} />
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

export default SecurePinInput;

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 14,
    },
    hiddenInput: {
        position: "absolute",
        opacity: 0,
        width: 1,
        height: 1,
    },
    box: {
        width: 56,
        height: 56,
        borderRadius: 16,
        backgroundColor: "#171716",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#ffffff",
    },
    filledBox: {
        borderColor: "#DEF3A1",
    },
    activeBox: {
        borderColor: "#DEF3A1",
    },
    dot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: "#FFFFFF",
    },
    cursor: {
        width: 2,
        height: 24,
        backgroundColor: "#FFFFFF",
        borderRadius: 1,
    },
});