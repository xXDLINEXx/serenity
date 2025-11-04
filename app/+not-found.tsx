import { Link, Stack } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Page introuvable" }} />
      <View style={styles.container}>
        <Text style={styles.title}>Cette page n&apos;existe pas</Text>

        <Link href="/" style={styles.link}>
          <Text style={styles.linkText}>Retourner à l&apos;accueil</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#0F172A",
  },
  title: {
    fontSize: 20,
    fontWeight: "600" as const,
    color: "#FFFFFF",
    marginBottom: 16,
  },
  link: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: "#8B5CF6",
    borderRadius: 12,
  },
  linkText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600" as const,
  },
});
