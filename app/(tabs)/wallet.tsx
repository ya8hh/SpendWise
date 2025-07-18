import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";
import { router } from "expo-router";
import * as Icons from "phosphor-react-native";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

const Wallet = () => {
  const getTotalBalance = () => {
    return 1599;
  };
  return (
    <ScreenWrapper style={{ backgroundColor: colors.black }}>
      <View style={styles.container}>
        {/* toatal balancxe */}
        <View style={styles.balanceView}>
          <View style={{ alignItems: "center" }}>
            <Typo size={45} fontWeight={"500"}>
              ${getTotalBalance()?.toFixed(2)}
            </Typo>
            <Typo size={16} color={colors.neutral300}>
              Total Balance
            </Typo>
          </View>
        </View>
        {/* wallets bole tho footer scection */}
        <View style={styles.Wallets}>
          {/* header for adding wallets */}
          <View style={styles.flexRow}>
            <Typo size={20} fontWeight={"500"}>
              My Wallets
            </Typo>
            <TouchableOpacity
              onPress={() => router.push("/(modals)/WalletModal")}
            >
              <Icons.PlusCircleIcon
                weight="fill"
                color={colors.primary}
                size={verticalScale(33)}
              />
            </TouchableOpacity>
          </View>
          {/* wallet list */}
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default Wallet;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  balanceView: {
    height: verticalScale(160),
    backgroundColor: colors.black,
    justifyContent: "center",
    alignItems: "center",
  },
  flexRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacingY._10,
  },
  Wallets: {
    flex: 1,
    backgroundColor: colors.neutral900,
    borderTopRightRadius: radius._30,
    borderTopLeftRadius: radius._30,
    padding: spacingX._20,
    paddingTop: spacingX._25,
  },
  lifeStyle: {
    paddingVertical: spacingY._25,
    paddingTop: spacingY._15,
  },
});
