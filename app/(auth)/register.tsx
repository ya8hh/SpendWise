import BackButton from "@/components/BackButton";
import Button from "@/components/Button";
import Input from "@/components/Input";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { useAuth } from "@/context/authContext";
import { verticalScale } from "@/utils/styling";
import { router } from "expo-router";
import * as Icons from "phosphor-react-native";
import React, { useRef, useState } from "react";
import { Alert, Pressable, StyleSheet, View } from "react-native";
const Register = () => {
  const nameRef = useRef("");
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const { register: registerUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = async () => {
    if (!emailRef.current || !passwordRef.current || !nameRef.current) {
      Alert.alert("Sign Up", "Please Enter All Credentials");
      return;
    }
    setIsLoading(true);
    const res = await registerUser(
      emailRef.current,
      passwordRef.current,
      nameRef.current
    );
    setIsLoading(false);
    console.log("register result:", res);
    if (!res.success) {
      Alert.alert("Sign Up", res.msg);
    }
  };
  return (
    <ScreenWrapper>
      <View style={styles.Container}>
        <BackButton iconSize={28} />
        <View style={{ marginTop: spacingY._20, gap: 5 }}>
          <Typo size={30} fontWeight={"800"}>
            Lets,
          </Typo>
          <Typo size={30} fontWeight={"800"}>
            Get Started
          </Typo>
        </View>
        {/* form for login */}
        <View style={styles.form}>
          <Typo size={16} color={colors.textLight}>
            Sign up and start to track you every penny
          </Typo>
          <Input
            placeholder="enter your name"
            onChangeText={(value) => (nameRef.current = value)}
            icon={
              <Icons.UserIcon
                size={verticalScale(26)}
                weight="fill"
                color={colors.neutral300}
              />
            }
          />
          <Input
            placeholder="enter your email"
            onChangeText={(value) => (emailRef.current = value)}
            keyboardType="email-address"
            icon={
              <Icons.AtIcon
                size={verticalScale(26)}
                weight="fill"
                color={colors.neutral300}
              />
            }
          />

          <Input
            placeholder="enter your password"
            onChangeText={(value) => (passwordRef.current = value)}
            secureTextEntry
            icon={
              <Icons.LockIcon
                size={verticalScale(26)}
                weight="fill"
                color={colors.neutral300}
              />
            }
          />
          <Button loading={isLoading} onPress={handleSubmit}>
            <Typo size={21} fontWeight="700" color={colors.black}>
              Sign Up
            </Typo>
          </Button>
        </View>
        {/* footer */}
        <View style={[styles.footer]}>
          <Typo size={15}>Already have an account?</Typo>
          <Pressable onPress={() => router.navigate("/(auth)/login")}>
            <Typo fontWeight={"700"} color={colors.primary} size={15}>
              Login{" "}
            </Typo>
          </Pressable>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default Register;

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    gap: spacingY._30,
    paddingHorizontal: spacingX._20,
  },
  form: {
    gap: spacingY._20,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
  footerText: {
    textAlign: "center",
    fontSize: verticalScale(15),
    color: colors.text,
  },
});
