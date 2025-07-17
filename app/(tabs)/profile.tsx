import Header from "@/components/Header";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { auth } from "@/config/firebase";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { useAuth } from "@/context/authContext";
import { getProfileImage } from "@/services/imageServices";
import { accountOptionType } from "@/types";
import { verticalScale } from "@/utils/styling";
import { Image } from "expo-image";
import { router } from "expo-router";
import { signOut } from "firebase/auth";
import * as Icons from "phosphor-react-native";
import React from "react";
import { Alert, StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

const Profile = () => {
  const { user } = useAuth();
  const handleLogout = async () => {
    await signOut(auth);
  };
  const showLogoutAlert = () => {
    Alert.alert("Confirm", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        onPress: () => console.log("User Logout"),
        style: "cancel",
      },
      {
        text: "Logout",
        onPress: () => handleLogout(),
        style: "destructive",
      },
    ]);
  };
  const handlePress = (item: accountOptionType) => {
    if (item.title === "Logout") {
      showLogoutAlert();
    }
    if (item.routeName) {
      router.push(item.routeName);
    }
  };
  const accoutOptions: accountOptionType[] = [
    {
      title: "Edit Profile",
      icon: <Icons.UserIcon size={26} color={colors.white} weight="fill" />,
      routeName: "/(modals)/profileModal",
      bgColor: "#6366f1",
    },
    {
      title: "Settings",
      icon: <Icons.GearSixIcon size={26} color={colors.white} weight="fill" />,
      // routeName:'/(modals)/profileModal',
      bgColor: "#059669",
    },
    {
      title: "Privacy Policy",
      icon: <Icons.LockIcon size={26} color={colors.white} weight="fill" />,
      // routeName:'/(modals)/profileModal',
      bgColor: colors.neutral600,
    },
    {
      title: "Logout",
      icon: <Icons.PowerIcon size={26} color={colors.white} weight="fill" />,
      //routeName: "/(modals)/profileModal",
      bgColor: "#e11d48",
    },
  ];
  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Header title="Profile" style={{ marginVertical: spacingY._10 }} />
        {/* user info  */}
        <View style={styles.userInfo}>
          {/* user phtot */}
          <View>
            <Image
              source={getProfileImage(user?.image)}
              style={styles.avatar}
              contentFit="cover"
              transition={100}
            />
          </View>
          {/* user name and iinfo balah blah */}
          <View style={styles.nameContainer}>
            <Typo size={24} color={colors.neutral100} fontWeight={"600"}>
              {" "}
              {user?.name}
            </Typo>
            <Typo size={15} color={colors.neutral400}>
              {" "}
              {user?.email}
            </Typo>
          </View>
        </View>
        {/* account ke optins  */}
        <View style={styles.accountOptions}>
          {accoutOptions.map((item, index) => {
            return (
              <Animated.View
                entering={FadeInDown.delay(index * 50)
                  .springify()
                  .damping(14)}
                key={index.toString()}
                style={styles.listItem}
              >
                <TouchableOpacity
                  style={styles.flexRow}
                  onPress={() => handlePress(item)}
                >
                  {/* icons corresponding to account options */}
                  <View
                    style={[
                      styles.listIcon,
                      { backgroundColor: item?.bgColor },
                    ]}
                  >
                    {item.icon && item.icon}
                  </View>
                  <Typo fontWeight={"500"} size={16} style={{ flex: 1 }}>
                    {" "}
                    {item.title}
                  </Typo>
                  <Icons.CaretRightIcon
                    size={verticalScale(20)}
                    weight="bold"
                    color={colors.white}
                  />
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacingX._20,
  },
  userInfo: {
    marginTop: verticalScale(30),
    gap: spacingY._15,
    alignItems: "center",
  },
  nameContainer: {
    gap: verticalScale(4),
    alignItems: "center",
  },
  avatar: {
    alignSelf: "center",
    height: verticalScale(135),
    width: verticalScale(135),
    borderRadius: 200,
    backgroundColor: colors.neutral300,
  },
  accountOptions: {
    marginTop: spacingY._35,
  },
  listItem: {
    marginBottom: spacingY._35,
  },
  flexRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._10,
  },
  listIcon: {
    height: verticalScale(44),
    width: verticalScale(44),
    backgroundColor: colors.neutral500,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius._15,
    borderCurve: "continuous",
  },
});
