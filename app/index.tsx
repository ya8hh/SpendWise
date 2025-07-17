import { colors } from "@/constants/theme";
import { Image, StyleSheet, View } from "react-native";
const logo = require("../assets/images/splashImage.png");

export default function Index() {
  // useEffect(()=>{
  //   setTimeout(()=>{
  //     router.replace('/welcome')
  //   },2000)
  // },[])
  return (
    <View style={styles.container}>
      <Image style={styles.logo} source={logo} />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.neutral900,
  },
  logo: {
    height: "20%",
    aspectRatio: 1,
  },
});
