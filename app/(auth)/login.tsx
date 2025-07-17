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
const Login = () => {
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const [isLoading, setIsLoading] = useState(false);
  const { login: loginUser } = useAuth();
  const handleSubmit = async () => {
    if (!emailRef.current || !passwordRef.current) {
      Alert.alert("Login", "Please Enter Credentials");
      return;
    }
    setIsLoading(true);
    const res = await loginUser(emailRef.current, passwordRef.current);
    setIsLoading(false);
    if (!res.success) {
      Alert.alert("Login", res.msg);
    }
  };
  return (
    <ScreenWrapper>
      <View style={styles.Container}>
        <BackButton iconSize={28} />
        <View style={{ marginTop: spacingY._20, gap: 5 }}>
          <Typo size={30} fontWeight={"800"}>
            Hey,
          </Typo>
          <Typo size={30} fontWeight={"800"}>
            Welcome Back
          </Typo>
        </View>
        {/* form for login */}
        <View style={styles.form}>
          <Typo size={16} color={colors.textLight}>
            Login to track every penny
          </Typo>
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
          <Typo
            size={verticalScale(14)}
            color={colors.text}
            style={{ alignSelf: "flex-end" }}
          >
            Forgot Password?{" "}
          </Typo>
          <Button loading={isLoading} onPress={handleSubmit}>
            <Typo size={21} fontWeight="700" color={colors.black}>
              Login
            </Typo>
          </Button>
        </View>
        {/* footer */}
        <View style={[styles.footer]}>
          <Typo size={15}>Dont have an account?</Typo>
          <Pressable onPress={() => router.navigate("/(auth)/register")}>
            <Typo fontWeight={"700"} color={colors.primary} size={15}>
              Sign Up{" "}
            </Typo>
          </Pressable>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default Login;

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
