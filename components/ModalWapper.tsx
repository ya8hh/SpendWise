import { colors, spacingY } from "@/constants/theme";
import { ModalWrapperProps } from "@/types";
import React from "react";
import { Platform, StyleSheet, View } from "react-native";

const ModalWapper = ({
  style,
  children,
  bg = colors.neutral800,
}: ModalWrapperProps) => {
  return (
    <View style={[styles.container, style && style, { backgroundColor: bg }]}>
      {children}
    </View>
  );
};

export default ModalWapper;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === "ios" ? spacingY._15 : 50,
    paddingBottom: Platform.OS === "ios" ? spacingY._20 : spacingY._10,
  },
});
