import BackButton from "@/components/BackButton";
import Button from "@/components/Button";
import Header from "@/components/Header";
import ImageUpload from "@/components/ImageUpload";
import Input from "@/components/Input";
import ModalWrapper from "@/components/ModalWapper";
import Typo from "@/components/Typo";
import { expenseCategories, transactionTypes } from "@/constants/data";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { useAuth } from "@/context/authContext";
import useFetchData from "@/hooks/useFetchData";
import {
  createOrUpdateTransaction,
  deletetTransaction,
} from "@/services/transactionService";
import { TransactionType, WalletType } from "@/types";
import { scale, verticalScale } from "@/utils/styling";
import DateTimePicker from "@react-native-community/datetimepicker";
import { router, useLocalSearchParams } from "expo-router";
import { orderBy, where } from "firebase/firestore";
import * as Icons from "phosphor-react-native";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";

const TransactionModal = () => {
  const showDeleteAlert = () => {
    Alert.alert(
      "Confirm",
      "Are you sure you want to delete this transaction?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel delete"),
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => onDelete,
          style: "destructive",
        },
      ]
    );
  };
  const onDelete = async () => {
    if (!oldTransaction?.id) return;
    setLoading(true);
    const res = await deletetTransaction(
      oldTransaction?.id,
      oldTransaction?.walletId
    );
    setLoading(false);
    if (res.success) {
      router.back();
    } else {
      Alert.alert(" Transaction", res.msg);
    }
  };
  const onChangeDate = (event: any, selectedDate: any) => {
    const currentDate = selectedDate || transaction.date;
    setTransaction({ ...transaction, date: currentDate });
    setDatePicker(Platform.OS === "ios" ? true : false);
  };
  const { user } = useAuth();
  const [transaction, setTransaction] = useState<TransactionType>({
    type: "expense",
    amount: 0,
    description: "",
    category: "",
    date: new Date(),
    walletId: "",
    image: null,
  });

  const {
    data: wallets,
    error: walletError,
    loading: walletLoading,
  } = useFetchData<WalletType>("wallets", [
    where("uid", "==", user?.uid),
    orderBy("created", "desc"),
  ]);
  const [loading, setLoading] = useState(false);
  const [datePicker, setDatePicker] = useState(false);
  type ParamsType = {
    id: string;
    type: string;
    amount: string;
    category?: string;
    date: string;
    description?: string;
    image?: any;
    uid?: string;
    walletId: string;
  };
  const oldTransaction: ParamsType = useLocalSearchParams();
  useEffect(() => {
    if (oldTransaction?.id) {
      setTransaction({
        type: oldTransaction.type,
        amount: Number(oldTransaction.amount),
        description: oldTransaction.description || "",
        category: oldTransaction.category || "",
        date: new Date(oldTransaction.date),
        walletId: oldTransaction.walletId,
        image: oldTransaction?.image,
      });
    }
  }, []);
  const onSubmit = async () => {
    const { type, amount, description, category, date, walletId, image } =
      transaction;
    if (!walletId || !date || !amount || (type === "expense" && !category)) {
      Alert.alert("Transaction", "Please Fill all the fields");
      return;
    }
    console.log("good to go");
    let transactionData: TransactionType = {
      type,
      amount,
      description,
      category,
      date,
      walletId,
      image,
      uid: user?.uid,
    };
    // add id while updating
    if (oldTransaction?.id) transactionData.id = oldTransaction.id;
    setLoading(true);
    const res = await createOrUpdateTransaction(transactionData);
    setLoading(false);
    if (res.success) {
      router.back();
    } else {
      Alert.alert("Transaction", res.msg);
    }
  };
  return (
    <ModalWrapper>
      <View style={styles.container}>
        <Header
          title={
            oldTransaction?.id ? "Update Transaction" : "Add New Transaction"
          }
          leftIcon={<BackButton />}
          style={{ marginBottom: spacingY._10 }}
        />
        {/* form -scrol view */}
        <ScrollView
          contentContainerStyle={styles.form}
          showsVerticalScrollIndicator={false}
        >
          {/* transaction */}
          <View style={styles.inputContainer}>
            <Typo size={16}> Transaction Type</Typo>
            {/* dropdown */}
            <Dropdown
              style={styles.dropDownContainer}
              placeholderStyle={styles.dropDownPlaceholder}
              selectedTextStyle={styles.dropDownSelectedText}
              iconStyle={styles.dropDownIcon}
              itemTextStyle={styles.dropDownItemText}
              itemContainerStyle={styles.dropDownItemContainer}
              containerStyle={styles.dropDownListContainer}
              activeColor={colors.neutral700}
              data={transactionTypes}
              maxHeight={300}
              labelField="label"
              valueField="value"
              value={transaction.type}
              onChange={(item) => {
                setTransaction({ ...transaction, type: item.value || "" });
              }}
            />
            {/* dropdown ends here */}
          </View>
          {/* wallet */}
          <View style={styles.inputContainer}>
            <Typo size={16}> Wallet</Typo>
            {/* dropdown  fpr wallet*/}
            <Dropdown
              style={styles.dropDownContainer}
              placeholderStyle={styles.dropDownPlaceholder}
              selectedTextStyle={styles.dropDownSelectedText}
              iconStyle={styles.dropDownIcon}
              itemTextStyle={styles.dropDownItemText}
              itemContainerStyle={styles.dropDownItemContainer}
              containerStyle={styles.dropDownListContainer}
              activeColor={colors.neutral700}
              data={wallets.map((wallet) => ({
                label: `${wallet?.name}($ ${wallet.amount})`,
                value: wallet?.id,
              }))}
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder={"Select Wallet"}
              value={transaction.walletId}
              onChange={(item) => {
                setTransaction({ ...transaction, walletId: item.value });
              }}
            />
            {/* dropdown ends here */}
          </View>
          {/* expense */}
          {transaction.type === "expense" && (
            <View style={styles.inputContainer}>
              <Typo size={16}> Expense Category</Typo>
              {/* dropdown  fpr expenae*/}
              <Dropdown
                style={styles.dropDownContainer}
                placeholderStyle={styles.dropDownPlaceholder}
                selectedTextStyle={styles.dropDownSelectedText}
                iconStyle={styles.dropDownIcon}
                itemTextStyle={styles.dropDownItemText}
                itemContainerStyle={styles.dropDownItemContainer}
                containerStyle={styles.dropDownListContainer}
                activeColor={colors.neutral700}
                data={Object.values(expenseCategories)}
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder={"Select Category"}
                value={transaction.category}
                onChange={(item) => {
                  setTransaction({
                    ...transaction,
                    category: item.value || "",
                  });
                }}
              />
              {/* dropdown ends here */}
            </View>
          )}
          {/* date picker */}
          <View style={styles.inputContainer}>
            <Typo size={16}> Date</Typo>
            {!datePicker && (
              <Pressable
                style={styles.dateInput}
                onPress={() => setDatePicker(true)}
              >
                <Typo size={14}>
                  {(transaction.date as Date).toLocaleDateString()}
                </Typo>
              </Pressable>
            )}
            {datePicker && (
              <View style={Platform.OS === "ios" && styles.iosDatepicker}>
                <DateTimePicker
                  themeVariant="dark"
                  value={transaction.date as Date}
                  textColor={colors.white}
                  mode="date"
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  onChange={onChangeDate}
                />
                {Platform.OS === "ios" && (
                  <TouchableOpacity
                    style={styles.iosDatepicker}
                    onPress={() => setDatePicker(false)}
                  >
                    <Typo size={15} fontWeight={"500"}>
                      Ok
                    </Typo>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>

          {/* date picker ends */}
          {/* amount */}
          <View style={styles.inputContainer}>
            <Typo size={16}> Amount</Typo>
            <Input
              // placeholder=" Salary"
              keyboardType="numeric"
              value={transaction.amount?.toString()}
              onChangeText={(value) =>
                setTransaction({
                  ...transaction,
                  amount: Number(value.replace(/[^0-9]/g, "")),
                })
              }
            />
          </View>
          <View style={styles.inputContainer}>
            <View style={styles.flexRow}>
              <Typo size={16} color={colors.neutral200}>
                Description
              </Typo>
              <Typo size={14} color={colors.neutral500}>
                (Optional)
              </Typo>
            </View>

            <Input
              // placeholder=" Salary"

              value={transaction.description}
              multiline
              containerStyle={{
                flexDirection: "row",
                height: verticalScale(100),
                alignItems: "flex-start",
                paddingVertical: 15,
              }}
              onChangeText={(value) =>
                setTransaction({
                  ...transaction,
                  description: value,
                })
              }
            />
          </View>
          <View style={styles.inputContainer}>
            <View style={styles.flexRow}>
              <Typo size={16} color={colors.neutral200}>
                Receipt
              </Typo>
              <Typo size={14} color={colors.neutral500}>
                (Optional)
              </Typo>
            </View>
            {/* image input */}
            <ImageUpload
              onClear={() => setTransaction({ ...transaction, image: null })}
              file={transaction.image}
              onSelect={(file) =>
                setTransaction({ ...transaction, image: file })
              }
            />
          </View>
        </ScrollView>
      </View>
      <View style={styles.footer}>
        {oldTransaction?.id && !loading && (
          <Button
            onPress={showDeleteAlert}
            style={{
              backgroundColor: colors.rose,
              paddingHorizontal: spacingX._15,
            }}
          >
            <Icons.TrashIcon
              weight="bold"
              size={verticalScale(24)}
              color={colors.white}
            />
          </Button>
        )}
        <Button loading={loading} onPress={onSubmit} style={{ flex: 1 }}>
          <Typo color={colors.black} size={18} fontWeight={"700"}>
            {oldTransaction?.id ? "Update Transaction" : "Submit"}
          </Typo>
        </Button>
      </View>
    </ModalWrapper>
  );
};

export default TransactionModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacingY._20,
  },
  form: {
    gap: spacingY._20,
    paddingVertical: spacingY._15,
    paddingBottom: spacingY._40,
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
    gap: scale(12),

    paddingTop: spacingY._15,
    borderTopColor: colors.neutral700,
    marginBottom: spacingY._5,
    borderTopWidth: 1,
  },
  dropDownContainer: {
    height: verticalScale(54),
    borderWidth: 1,
    borderColor: colors.neutral300,
    paddingHorizontal: spacingX._15,
    borderRadius: radius._15,
    borderCurve: "continuous",
  },
  dropDownItemText: { color: colors.white },
  dropDownSelectedText: { color: colors.white, fontSize: verticalScale(14) },
  dropDownListContainer: {
    backgroundColor: colors.neutral900,
    borderRadius: radius._15,
    borderCurve: "continuous",
    paddingVertical: spacingY._7,
    top: 5,
    borderColor: colors.neutral500,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 15,
    elevation: 5,
  },
  dropDownPlaceholder: {
    color: colors.white,
  },
  dropDownItemContainer: {
    borderRadius: radius._15,
    marginHorizontal: spacingX._7,
  },
  dropDownIcon: {
    height: verticalScale(30),
    tintColor: colors.neutral300,
  },
  dateInput: {
    height: verticalScale(54),
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.neutral300,
    borderRadius: radius._17,
    borderCurve: "continuous",
    paddingHorizontal: spacingX._15,
    justifyContent: "center",
    fontSize: verticalScale(12),
    fontWeight: "bold",
    flexDirection: "row",
  },
  flexRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._5,
  },
  iosDatepicker: {},
});
