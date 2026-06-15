import React from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  ViewStyle,
} from "react-native";

import { useColors } from "@/hooks/useColors";

type Props = {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  variant?: "primary" | "outline";
};

export function GoldButton({
  label,
  onPress,
  loading = false,
  disabled = false,
  style,
  variant = "primary",
}: Props) {
  const colors = useColors();
  const isPrimary = variant === "primary";

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.button,
        isPrimary
          ? { backgroundColor: colors.primary }
          : {
              backgroundColor: "transparent",
              borderWidth: 1,
              borderColor: colors.primary,
            },
        (disabled || loading) && { opacity: 0.5 },
        pressed && { opacity: 0.8, transform: [{ scale: 0.98 }] },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          color={isPrimary ? colors.primaryForeground : colors.primary}
          size="small"
        />
      ) : (
        <Text
          style={[
            styles.label,
            { color: isPrimary ? colors.primaryForeground : colors.primary },
          ]}
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 52,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});
