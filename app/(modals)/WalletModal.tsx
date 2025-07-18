import BackButton from "@/components/BackButton";
import Button from "@/components/Button";
import Header from "@/components/Header";
import ImageUpload from "@/components/ImageUpload";
import Input from "@/components/Input";
import ModalWrapper from "@/components/ModalWapper";
import Typo from "@/components/Typo";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { useAuth } from "@/context/authContext";
import { updateUser } from "@/services/userService";
import { WalletType } from "@/types";
import { verticalScale } from "@/utils/styling";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";

const WalletModal = () => {
  const { user, updateUserData } = useAuth();
  const [wallet, setWallet] = useState<WalletType>({
    name: "",
    image: null,
  });
  const [loading, setLoading] = useState(false);

  //selecting image from the agllery
  const onPickImage = async () => {
    // Ask permissions
    const { status: galleryStatus } =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    const { status: cameraStatus } =
      await ImagePicker.requestCameraPermissionsAsync();

    if (galleryStatus !== "granted" || cameraStatus !== "granted") {
      Alert.alert(
        "Permission denied",
        "Please allow camera and gallery access."
      );
      return;
    }

    // Alert to choose Camera or Gallery
    Alert.alert(
      "Select Image Source",
      "Choose where to pick the image from:",
      [
        {
          text: "Camera",
          onPress: async () => {
            const result = await ImagePicker.launchCameraAsync({
              mediaTypes: ["images"],
              allowsEditing: true,
              aspect: [4, 3],
              quality: 1,
            });

            if (!result.canceled) {
              //   setUserData((prev) => ({ ...prev, image: result.assets[0] }));
            }
          },
        },
        {
          text: "Gallery",
          onPress: async () => {
            const result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ["images"],
              allowsEditing: true,
              aspect: [4, 3],
              quality: 1,
            });

            if (!result.canceled) {
              //   setUserData((prev) => ({ ...prev, image: result.assets[0] }));
            }
          },
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ],
      { cancelable: true }
    );
  };
  const onSubmit = async () => {
    let { name, image } = wallet;
    if (!name.trim()) {
      Alert.alert("User", "Please fill all the fields");
      return; //  Return early on error without calling updateUser
    }

    //   updateUser only when validation passes
    setLoading(true);
    const res = await updateUser(user?.uid as string, wallet);
    setLoading(false);

    if (res.success) {
      updateUserData(user?.uid as string);
      router.back();
    } else {
      Alert.alert("User", res.msg);
    }
  };
  return (
    <ModalWrapper>
      <View style={styles.container}>
        <Header
          title="New Wallet"
          leftIcon={<BackButton />}
          style={{ marginBottom: spacingY._10 }}
        />
        {/* form -scrol view */}
        <ScrollView contentContainerStyle={styles.form}>
          <View style={styles.inputContainer}>
            <Typo> Wallet Name</Typo>
            <Input
              placeholder=" Salary"
              value={wallet.name}
              onChangeText={(value) => setWallet({ ...wallet, name: value })}
            />
          </View>
          <View style={styles.inputContainer}>
            <Typo> Wallet Icon</Typo>
            {/* image input */}
            <ImageUpload />
          </View>
        </ScrollView>
      </View>
      <View style={styles.footer}>
        <Button loading={loading} onPress={onSubmit} style={{ flex: 1 }}>
          <Typo color={colors.black} size={18} fontWeight={"700"}>
            Add Wallet
          </Typo>
        </Button>
      </View>
    </ModalWrapper>
  );
};

export default WalletModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: spacingY._20,
  },
  form: {
    gap: spacingY._30,
    marginTop: spacingY._15,
  },
  avatarContainer: {
    position: "relative",
    alignSelf: "center",
  },
  avatar: {
    alignSelf: "center",
    backgroundColor: colors.neutral200,
    height: verticalScale(135),
    width: verticalScale(135),
    borderRadius: 200,
    borderWidth: 1,
    borderColor: colors.neutral500,
  },
  editIcon: {
    position: "absolute",
    bottom: spacingY._5,
    right: spacingY._7,
    borderRadius: 100,
    backgroundColor: colors.neutral100,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
    padding: spacingY._7,
  },
  inputContainer: {
    gap: spacingY._10,
  },
  footer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: spacingX._20,
    gap: verticalScale(20),
    paddingTop: spacingY._15,
    borderTopColor: colors.neutral700,
    marginBottom: spacingY._5,
    borderTopWidth: 1,
  },
});
