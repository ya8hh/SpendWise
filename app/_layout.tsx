import { AuthProvider } from "@/context/authContext";
import { Stack } from "expo-router";

function StackLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="(modals)/profileModal"
        options={{
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="(modals)/WalletModal"
        options={{
          presentation: "modal",
        }}
      />
    </Stack>
  );
}
export default function RootLayout() {
  return (
    <AuthProvider>
      <StackLayout />
    </AuthProvider>
  );
}
