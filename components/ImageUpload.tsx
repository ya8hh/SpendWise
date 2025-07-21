import { colors, radius } from "@/constants/theme";
import { getFilePath } from "@/services/imageServices";
import { ImageUploadProps } from "@/types";
import { scale, verticalScale } from "@/utils/styling";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import * as Icons from "phosphor-react-native";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Typo from "./Typo";
const ImageUpload = ({
  file = null,
  onSelect,
  onClear,
  containerStyle,
  imageStyle,
  placeholder = "",
}: ImageUploadProps) => {
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      onSelect(result.assets[0]);
    }
  };
  return (
    <View>
      {!file && (
        <TouchableOpacity
          onPress={pickImage}
          style={[styles.inputContainer, containerStyle && containerStyle]}
        >
          <Icons.UploadSimpleIcon color={colors.neutral200} />
          {placeholder && <Typo size={13}>{placeholder}</Typo>}
        </TouchableOpacity>
      )}
      {file && (
        <View style={[styles.image, imageStyle && imageStyle]}>
          <Image
            style={{ flex: 1 }}
            source={getFilePath(file)}
            contentFit="cover"
            transition={100}
          />
          <TouchableOpacity onPress={onClear} style={styles.deleteIcon}>
            <Icons.XCircleIcon size={24} weight="fill" color={colors.white} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default ImageUpload;

const styles = StyleSheet.create({
  inputContainer: {
    height: verticalScale(54),
    backgroundColor: colors.neutral700,
    borderRadius: radius._15,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderColor: colors.neutral500,
    borderStyle: "dashed",
  },
  image: {
    height: scale(150),
    width: scale(150),
    borderRadius: radius._15,
    borderCurve: "continuous",
    overflow: "hidden",
  },
  deleteIcon: {
    position: "absolute",
    right: scale(6),
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 10,
  },
});
