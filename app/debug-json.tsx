import { useSoundsConfig } from "@/hooks/useSoundsConfig";
import { Text, ScrollView, View, StyleSheet } from "react-native";
import { Stack } from "expo-router";

export default function DebugJson() {
  const { data, isLoading, error } = useSoundsConfig();

  return (
    <>
      <Stack.Screen options={{ title: "Debug JSON Config", headerShown: true }} />
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          {isLoading && <Text style={styles.status}>⏳ Chargement…</Text>}
          
          {error && (
            <View style={styles.errorBox}>
              <Text style={styles.errorTitle}>❌ Erreur</Text>
              <Text style={styles.errorText}>{String(error)}</Text>
            </View>
          )}
          
          {data && (
            <>
              <Text style={styles.successTitle}>✅ Chargé avec succès : {data.length} éléments</Text>
              {data.map((item, index) => (
                <View key={index} style={styles.itemBox}>
                  <Text style={styles.itemTitle}>✅ {item.title}</Text>
                  <Text style={styles.itemDetail}>Type: {item.type}</Text>
                  {item.audio && <Text style={styles.itemDetail}>🎵 Audio: oui</Text>}
                  {item.video && <Text style={styles.itemDetail}>🎬 Video: oui</Text>}
                  {item.frequency && <Text style={styles.itemDetail}>📡 Frequency: oui</Text>}
                  {item.description && <Text style={styles.itemDescription}>{item.description}</Text>}
                  {item.benefits && <Text style={styles.itemBenefits}>{item.benefits}</Text>}
                </View>
              ))}
            </>
          )}
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0F',
  },
  content: {
    padding: 20,
  },
  status: {
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
    marginVertical: 20,
  },
  errorBox: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EF4444',
    marginVertical: 10,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#EF4444',
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    color: '#FCA5A5',
    lineHeight: 20,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: '#10B981',
    marginBottom: 20,
  },
  itemBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  itemDetail: {
    fontSize: 14,
    color: '#94A3B8',
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 13,
    color: '#9CA3AF',
    marginTop: 8,
    fontStyle: 'italic' as const,
  },
  itemBenefits: {
    fontSize: 12,
    color: '#6EE7B7',
    marginTop: 4,
    fontStyle: 'italic' as const,
  },
});
