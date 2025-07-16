import Button from "@/components/Button";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";

const Welcome = () => {
  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <View>
          <TouchableOpacity style={styles.btn}>
            <Typo fontWeight="500">Sign In</Typo>
          </TouchableOpacity>
          <Animated.Image
            entering={FadeIn.duration(2000)}
            resizeMode="contain"
            style={styles.welcomeImage}
            source={require("../../assets/images/welcome.png")}
          />
        </View>
        {/* footer */}
        <View style={styles.footer}>
          <Animated.View
            entering={FadeInDown.duration(500).springify().damping(12)}
            style={{ alignItems: "center" }}
          >
            <Typo size={30} fontWeight="800">
              Always Stay Ahead
            </Typo>
            <Typo size={30} fontWeight="800">
              of your finances
            </Typo>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.duration(1500)
              .delay(100)
              .springify()
              .damping(12)}
            style={{ alignItems: "center", gap: 2 }}
          >
            <Typo size={17} color={colors.textLight}>
              Control Every Penny
            </Typo>
            <Typo size={17} color={colors.textLight}>
              With Ease!
            </Typo>
          </Animated.View>
          <View style={styles.buttonContainer}>
            <Button>
              <Typo size={22} color={colors.neutral900} fontWeight={"600"}>
                Get Started!
              </Typo>
            </Button>
          </View>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default Welcome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingTop: spacingY._7,
  },
  btn: {
    alignSelf: "flex-end",
    marginRight: spacingX._20,
  },
  welcomeImage: {
    marginTop: verticalScale(100),
    alignSelf: "center",
    width: "100%",
    height: verticalScale(300),
  },
  footer: {
    backgroundColor: colors.neutral900,
    alignItems: "center",
    paddingTop: verticalScale(30),
    paddingBottom: verticalScale(45),
    gap: spacingY._20,
    shadowColor: "white",
    shadowOffset: { width: 0, height: -10 },
    elevation: 10,
    shadowRadius: 25,
    shadowOpacity: 0.15,
  },
  buttonContainer: {
    width: "100%",
    paddingHorizontal: spacingX._25,
  },
});
