import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import React from "react";
import { StyleSheet } from "react-native";

const Home = () => {
  // const handlesignout = async () => {
  //   await signOut(auth);
  // };
  return (
    <ScreenWrapper>
      <Typo>Home</Typo>
      {/* <Button onPress={handlesignout}>
        <Typo color={colors.black}>Logout</Typo>
      </Button> */}
    </ScreenWrapper>
  );
};

export default Home;

const styles = StyleSheet.create({});
