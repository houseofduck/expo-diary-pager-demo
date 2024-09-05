import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <TouchableOpacity onPress={() => router.push("/diary/2021-01-05")}>
        <Text>Go to diary</Text>
      </TouchableOpacity>
    </View>
  );
}
