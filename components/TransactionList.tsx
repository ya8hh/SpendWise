import { expenseCategories, incomeCategory } from "@/constants/data";
import { colors, radius, spacingY } from "@/constants/theme";
import {
  TransactionItemProps,
  TransactionListType,
  TransactionType,
} from "@/types";
import { verticalScale } from "@/utils/styling";
import { FlashList } from "@shopify/flash-list";
import { router } from "expo-router";
import { Timestamp } from "firebase/firestore";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import Loading from "./Loading";
import Typo from "./Typo";
const TransactionList = ({
  data,
  title,
  loading,
  emptyListMessage,
}: TransactionListType) => {
  const handleClick = (item: TransactionType) => {
    router.push({
      pathname: "/(modals)/transactionModal",
      params: {
        id: item?.id,
        type: item?.type,
        amount: item?.amount?.toString(),
        category: item?.category,
        date: (item.date as Timestamp)?.toDate()?.toISOString(),
        description: item?.description,
        image: item?.image,
        uid: item?.uid,
        walletId: item?.walletId,
      },
    });
  };
  return (
    <View style={styles.container}>
      {title && (
        <Typo size={20} fontWeight={"500"}>
          {title}
        </Typo>
      )}
      <View style={styles.list}>
        <FlashList
          data={data}
          renderItem={({ item, index }) => (
            <TransactionItem
              item={item}
              index={index}
              handleClick={handleClick}
            />
          )}
          estimatedItemSize={60}
        />
      </View>
      {!loading && data.length === 0 && (
        <Typo
          size={15}
          color={colors.neutral400}
          style={{ textAlign: "center", marginTop: spacingY._15 }}
        >
          {emptyListMessage}
        </Typo>
      )}
      {loading && (
        <View style={{ top: verticalScale(100) }}>
          <Loading />
        </View>
      )}
    </View>
  );
};
const TransactionItem = ({
  item,
  index,
  handleClick,
}: TransactionItemProps) => {
  let category =
    item?.type === "income"
      ? incomeCategory
      : expenseCategories[item?.category!];
  const IconComponent = category.icon;
  const date = (item?.date as Timestamp)
    ?.toDate()
    ?.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
    });
  return (
    <Animated.View
      entering={FadeInDown.delay(index * 70)
        .springify()
        .damping(14)}
    >
      <TouchableOpacity style={styles.row} onPress={() => handleClick(item)}>
        <View style={[styles.icon, { backgroundColor: category.bgColor }]}>
          {IconComponent && (
            <IconComponent
              size={verticalScale(25)}
              weight="fill"
              color={colors.white}
            />
          )}
        </View>
        <View style={styles.categoryDes}>
          <Typo size={17}>{category?.label}</Typo>
          <Typo
            size={12}
            color={colors.neutral400}
            textProps={{ numberOfLines: 1 }}
          >
            {item?.description}
          </Typo>
        </View>
        <View style={styles.amountDate}>
          <Typo
            color={item?.type === "income" ? colors.primary : colors.rose}
            fontWeight={"500"}
          >
            {item?.type === "income" ? "+ $" : "- $"} {item?.amount}
          </Typo>
          <Typo size={13} color={colors.neutral400}>
            {date}
          </Typo>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};
export default TransactionList;

const styles = StyleSheet.create({
  amountDate: {
    alignItems: "center",
    gap: 3,
  },
  categoryDes: {
    flex: 1,
    gap: 2.5,
  },
  icon: {
    height: verticalScale(44),
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: radius._12,
    borderCurve: "continuous",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: spacingY._12,
    marginBottom: spacingY._12,
    backgroundColor: colors.neutral800,
    padding: spacingY._10,
    paddingHorizontal: spacingY._10,
    borderRadius: radius._17,
  },
  list: {
    minHeight: 3,
  },
  container: {
    gap: spacingY._17,
  },
});
