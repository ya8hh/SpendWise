import { db } from "@/config/firebase";
import { colors } from "@/constants/theme";
import { ResponseType, TransactionType, WalletType } from "@/types";
import { get7LastDays, getLast12Months, getYearsRange } from "@/utils/common";
import { scale } from "@/utils/styling";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { uploadFileToCloud } from "./imageServices";
import { createOrUpdateWallet } from "./walletService";

export const createOrUpdateTransaction = async (
  transactionData: Partial<TransactionType>
): Promise<ResponseType> => {
  try {
    const { id, type, walletId, amount, image } = transactionData;
    if (!amount || !type || amount <= 0 || !walletId || !type) {
      return { success: true, msg: "Invalid Transaction data" };
    }
    if (id) {
      //todo - cause comp
      const oldTransactionSnapshot = await getDoc(doc(db, "transactions", id));
      const oldTransaction = oldTransactionSnapshot.data() as TransactionType;
      const shouldRevertOrignal =
        oldTransaction.type !== type ||
        oldTransaction.amount !== amount ||
        oldTransaction.walletId !== walletId;
      if (shouldRevertOrignal) {
        let res = await revertAndUpdateWallets(
          oldTransaction,
          Number(amount),
          type,
          walletId
        );
        if (!res.success) return res;
      }
    } else {
      let res = await updateWalletForNewTransacttion(
        walletId!,
        Number(amount!),
        type
      );
      if (!res.success) return res;
      if (image) {
        const imageUploadRes = await uploadFileToCloud(image, "transactions");
        if (!imageUploadRes.success) {
          return {
            success: false,
            msg: imageUploadRes.msg || "Failed to upload Recipt",
          };
        }
        transactionData.image = imageUploadRes.data;
      }
    }
    const transactionRef = id
      ? doc(db, "transactions", id)
      : doc(collection(db, "transactions"));
    await setDoc(transactionRef, transactionData, { merge: true });
    return {
      success: true,
      data: { ...transactionData, id: transactionRef.id },
    };
  } catch (error: any) {
    console.log("error creating and updating the transccation", error);
    return { success: false, msg: error.message };
  }
};
const updateWalletForNewTransacttion = async (
  walletId: string,
  amount: number,
  type: string
) => {
  try {
    const walletRef = doc(db, "wallets", walletId);
    const walletSnapshot = await getDoc(walletRef);
    if (!walletSnapshot.exists()) {
      console.log("error");
      return { success: false, msg: "wallet not found" };
    }
    const walletData = walletSnapshot.data() as WalletType;
    if (type === "expense" && walletData.amount! - amount < 0) {
      return { success: false, msg: "not enough balance" };
    }

    const updateType = type === "income" ? "totalIncome" : "totalExpenses";
    const updateWaletAmount =
      type === "income"
        ? Number(walletData.amount) + amount
        : Number(walletData.amount) - amount;
    const updateTotals =
      type === "income"
        ? Number(walletData.totalIncome) + amount
        : Number(walletData.totalExpenses) + amount;
    await updateDoc(walletRef, {
      amount: updateWaletAmount,
      [updateType]: updateTotals,
    });

    return { success: true };
  } catch (error: any) {
    console.log("error  updating the transccation while walled exist", error);
    return { success: false, msg: error.message };
  }
};
// udate fun
const revertAndUpdateWallets = async (
  oldTransaction: TransactionType,
  newTransactionAmount: number,
  newTransactionType: string,
  newWalletId: string
) => {
  try {
    const orignalWalletSnapshot = await getDoc(
      doc(db, "wallets", oldTransaction.walletId)
    );
    const orignalWallet = orignalWalletSnapshot.data() as WalletType;
    let newWalletSnapshot = await getDoc(doc(db, "wallets", newWalletId));
    let newWallet = newWalletSnapshot.data() as WalletType;
    const revertType =
      oldTransaction.type === "income" ? "totalIncome" : "totalExpenses";
    const revertIncomeExpenses: number =
      oldTransaction.type === "income"
        ? -Number(oldTransaction.amount)
        : Number(oldTransaction.amount);
    const revertedWalletAmount =
      Number(orignalWallet.amount) + revertIncomeExpenses;
    const revertedIncomeExpenseAmount =
      Number(orignalWallet[revertType]) - Number(oldTransaction.amount);
    //validatiom
    if (newTransactionType === "expense") {
      if (
        oldTransaction.walletId === newWalletId &&
        revertedWalletAmount < newTransactionAmount
      ) {
        return {
          success: false,
          msg: "Selected Wallet dont have enough balance ",
        };
      }
      if (newWallet.amount! < newTransactionAmount) {
        return {
          success: false,
          msg: "Selected Wallet dont have enough balance ",
        };
      }
    }
    await createOrUpdateWallet({
      id: oldTransaction.walletId,
      amount: revertedWalletAmount,
      [revertType]: revertedIncomeExpenseAmount,
    });
    ///////////////
    //refetch the newwallet because we may have just updated the allet
    newWalletSnapshot = await getDoc(doc(db, "wallets", newWalletId));
    newWallet = newWalletSnapshot.data() as WalletType;
    const updateType =
      newTransactionType === "income" ? "totalIncome" : "totalExpenses";
    const updatedTransactionAmount: number =
      newTransactionType === "income"
        ? Number(newTransactionAmount)
        : -Number(newTransactionAmount);
    const newWalletAmount = Number(newWallet.amount) + updatedTransactionAmount;
    const newIncomeExpenseAmount = Number(
      newWallet[updateType]! + Number(newTransactionAmount)
    );
    await createOrUpdateWallet({
      id: newWalletId,
      amount: newWalletAmount,
      [updateType]: newIncomeExpenseAmount,
    });
    return { success: true };
  } catch (error: any) {
    console.log("error  updating the transccation while walled exist", error);
    return { success: false, msg: error.message };
  }
};
export const deletetTransaction = async (
  transactionId: string,
  walletId: string
) => {
  try {
    const transactionRef = doc(db, "transactions", transactionId);
    const transactionSnapshot = await getDoc(transactionRef);
    if (!transactionSnapshot.exists()) {
      return { success: false, msg: "transaction not found" };
    }
    const transactionData = transactionSnapshot.data() as TransactionType;
    const transactionType = transactionData?.type;
    const transactionAmount = transactionData?.amount;
    //fetch wallet to update total income or total expense
    const walletSnapshot = await getDoc(doc(db, "wallets", walletId));
    const walletData = walletSnapshot.data() as WalletType;
    //check the fielsd to be update on transction type
    const updateType =
      transactionType === "income" ? "totalIncome" : "totalExpenses";
    const newWalletAmount =
      walletData?.amount! -
      (transactionType === "income" ? transactionAmount : -transactionAmount);
    const newIncomeExpenseAmount = walletData[updateType]! - transactionAmount;
    if (transactionType === "expense" && newWalletAmount < 0) {
      return { success: false, msg: "you cant delete this transaction" };
    }
    await createOrUpdateWallet({
      id: walletId,
      amount: newWalletAmount,
      [updateType]: newIncomeExpenseAmount,
    });
    await deleteDoc(transactionRef);
    return { success: true };
  } catch (error: any) {
    console.log("error  updating the transccation while walled exist", error);
    return { success: false, msg: error.message };
  }
};
export const fetchWeeklyStats = async (uid: string): Promise<ResponseType> => {
  try {
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today?.getDate() - 7);
    const transactionQuery = query(
      collection(db, "transactions"),
      where("date", ">=", Timestamp.fromDate(sevenDaysAgo)),
      where("date", "<=", Timestamp.fromDate(today)),
      orderBy("date", "desc"),
      where("uid", "==", uid)
    );
    const querySnapshot = await getDocs(transactionQuery);
    const weeklyData = get7LastDays();
    const transactions: TransactionType[] = [];

    //maping
    querySnapshot.forEach((doc) => {
      const transaction = doc.data() as TransactionType;
      transaction.id = doc.id;
      transactions.push(transaction);
      const transactionDate = (transaction.date as Timestamp)
        .toDate()
        .toISOString()
        .split("T")[0];
      const dayData: any = weeklyData.find(
        (day) => dayData?.date === transactionDate
      );
      if (dayData) {
        if (transaction.type === "income") {
          dayData.income += transaction.amount;
        } else if (transaction.type === "expense") {
          dayData.expense += transaction.amount;
        }
      }
    });
    const stats = weeklyData.flatMap((day) => [
      {
        value: day.income,
        lable: day.day,
        spacing: scale(4),
        labelWidth: scale(30),
        frontColor: colors.primary,
      },
      {
        value: day.income,
        frontColor: colors.rose,
      },
    ]);

    return {
      success: true,
      data: {
        stats,
        transactions,
      },
    };
  } catch (error: any) {
    console.log("error  fetching weekly stats", error);
    return { success: false, msg: error.message };
  }
};
export const fetchMonthlyStats = async (uid: string): Promise<ResponseType> => {
  try {
    const today = new Date();
    const twelveMonthsAgo = new Date(today);
    twelveMonthsAgo.setDate(today.getMonth() - 12);
    const transactionQuery = query(
      collection(db, "transactions"),
      where("date", ">=", Timestamp.fromDate(twelveMonthsAgo)),
      where("date", "<=", Timestamp.fromDate(today)),
      orderBy("date", "desc"),
      where("uid", "==", uid)
    );
    const querySnapshot = await getDocs(transactionQuery);
    const monthlyData = getLast12Months();
    const transactions: TransactionType[] = [];

    //maping
    querySnapshot.forEach((doc) => {
      const transaction = doc.data() as TransactionType;
      transaction.id = doc.id;
      transactions.push(transaction);
      const transactionDate = (transaction.date as Timestamp).toDate();
      const monthName = transactionDate.toLocaleString("default", {
        month: "short",
      });
      const shortYear = transactionDate.getFullYear().toString().slice(-2);
      const monthData = monthlyData.find(
        (month) => month.month === `${monthName} ${shortYear}`
      );

      if (monthData) {
        if (transaction.type === "income") {
          monthData.income += transaction.amount;
        } else if (transaction.type === "expense") {
          monthData.expense += transaction.amount;
        }
      }
    });
    const stats = monthlyData.flatMap((month) => [
      {
        value: month.income,
        lable: month.month,
        spacing: scale(4),
        labelWidth: scale(46),
        frontColor: colors.primary,
      },
      {
        value: month.income,
        frontColor: colors.rose,
      },
    ]);

    return {
      success: true,
      data: {
        stats,
        transactions,
      },
    };
  } catch (error: any) {
    console.log("error  fetching weekly stats", error);
    return { success: false, msg: error.message };
  }
};
export const fetchYearlyStats = async (uid: string): Promise<ResponseType> => {
  try {
    const transactionQuery = query(
      collection(db, "transactions"),
      orderBy("date", "desc"),
      where("uid", "==", uid)
    );
    const querySnapshot = await getDocs(transactionQuery);
    const transactions: TransactionType[] = [];
    const firstTransaction = querySnapshot.docs.reduce((earliest, doc) => {
      const transactionDate = doc.data().date.toDate();
      return transactionDate < earliest ? transactionDate : earliest;
    }, new Date());
    const firstyear = firstTransaction.getFullYear();
    const currentYear = new Date().getFullYear();
    const yearlyData = getYearsRange(firstyear, currentYear);

    //maping
    querySnapshot.forEach((doc) => {
      const transaction = doc.data() as TransactionType;
      transaction.id = doc.id;
      transactions.push(transaction);
      const transactionYear = (transaction.date as Timestamp)
        .toDate()
        .getFullYear();

      const yearData = yearlyData.find(
        (item: any) => item.year === transactionYear.toString()
      );

      if (yearData) {
        if (transaction.type === "income") {
          yearData.income += transaction.amount;
        } else if (transaction.type === "expense") {
          yearData.expense += transaction.amount;
        }
      }
    });
    const stats = yearlyData.flatMap((year: any) => [
      {
        value: year.income,
        lable: year.year,
        spacing: scale(4),
        labelWidth: scale(35),
        frontColor: colors.primary,
      },
      {
        value: year.income,
        frontColor: colors.rose,
      },
    ]);

    return {
      success: true,
      data: {
        stats,
        transactions,
      },
    };
  } catch (error: any) {
    console.log("error  fetching yearly stats", error);
    return { success: false, msg: error.message };
  }
};
