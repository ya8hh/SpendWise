import BackButton from "@/components/BackButton";
import Header from "@/components/Header";
import Input from "@/components/Input";
import ModalWrapper from "@/components/ModalWapper";
import TransactionList from "@/components/TransactionList";
import { colors, spacingY } from "@/constants/theme";
import { useAuth } from "@/context/authContext";
import useFetchData from "@/hooks/useFetchData";
import { TransactionType } from "@/types";
import { orderBy, where } from "firebase/firestore";
import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

const SearchModal = () => {
  const { user, updateUserData } = useAuth();

  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const constraints = [where("uid", "==", user?.uid), orderBy("date", "desc")];
  const {
    data: allTransactions,
    error,
    loading: transactionsLoading,
  } = useFetchData<TransactionType>("transactions", constraints);
  const FilteredTransactions = allTransactions.filter((item) => {
    if (search.length > 1) {
      if (
        item.category?.toLocaleLowerCase()?.includes(search?.toLowerCase()) ||
        item.type?.toLowerCase()?.includes(search?.toLowerCase()) ||
        item.description?.toLowerCase()?.includes(search?.toLowerCase())
      ) {
        return true;
      }
      return false;
    }
    return true;
  });

  return (
    <ModalWrapper style={{ backgroundColor: colors.neutral900 }}>
      <View style={styles.container}>
        <Header
          title={"Search"}
          leftIcon={<BackButton />}
          style={{ marginBottom: spacingY._10 }}
        />
        {/* form -scrol view */}
        <ScrollView contentContainerStyle={styles.form}>
          <View style={styles.inputContainer}>
            <Input
              placeholder="Shoes..."
              placeholderTextColor={colors.neutral400}
              containerStyle={{ backgroundColor: colors.neutral800 }}
              value={search}
              onChangeText={(value) => setSearch(value)}
            />
          </View>
          <View>
            <TransactionList
              loading={transactionsLoading}
              data={FilteredTransactions}
              emptyListMessage="No Transaction Match Your Search KeyWords!"
            />
          </View>
        </ScrollView>
      </View>
    </ModalWrapper>
  );
};

export default SearchModal;

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

  inputContainer: {
    gap: spacingY._10,
  },
});
