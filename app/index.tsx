import { router } from "expo-router";
import { Text, TouchableOpacity, View, StyleSheet } from "react-native";

export default function Index() {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={() => router.push("/diary/2021-01-05")}>
        <Text style={styles.buttonText}>Go to diary</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  button: {
    marginVertical: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 16,
    color: "#000000",
  },
});
