import { colors } from "@/constants/theme";
import { ImageUploadProps } from "@/types";
import * as Icons from "phosphor-react-native";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
const ImageUpload = ({
  file = null,
  onSelect,
  onClear,
  containerStyle,
  imageStyle,
  placeholder = "",
}: ImageUploadProps) => {
  return (
    <View>
      {!file && (
        <TouchableOpacity>
          <Icons.UploadSimpleIcon color={colors.neutral200} />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default ImageUpload;

const styles = StyleSheet.create({});
