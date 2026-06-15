import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useCallback, useRef, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

const SUGGESTIONS = [
  "Roma sikkelerinde hangi imparatorlar en nadirdir?",
  "Sikkemin derecesini nasıl yükseltebilirim?",
  "Antik sikke bakımı nasıl yapılır?",
  "Müzayedede sikke alırken nelere dikkat etmeliyim?",
  "Bizans altınları neden bu kadar değerlidir?",
  "Sikke temizliği yapmalı mıyım?",
];

export default function ChatScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const listRef = useRef<FlatList>(null);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = insets.bottom;

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || loading) return;

      const userMsg: Message = {
        role: "user",
        content: trimmed,
        id: `u${Date.now()}`,
      };
      const next = [...messages, userMsg];
      setMessages(next);
      setInput("");
      setLoading(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      // Simulate AI response
      await new Promise((r) => setTimeout(r, 2000));
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Bu harika bir soru! Numisma AI danışmanı olarak sizi yönlendireyim. Bu konuda detaylı bilgi vermek için API bağlantısı gerekiyor.",
          id: `a${Date.now()}`,
        },
      ]);
      setLoading(false);
    },
    [messages, loading]
  );

  const isEmpty = messages.length === 0;

  return (
    <View style={[styles.root, { backgroundColor: "#0D0B07" }]}>
      <View style={[styles.header, { paddingTop: topPad + 12 }]}>
        <Text style={[styles.title, { color: "#D4AF37" }]}>
          NUMISMA DANIŞMANI
        </Text>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={bottomPad + 64}
      >
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[
            styles.list,
            { paddingBottom: bottomPad + 16 },
          ]}
          renderItem={({ item }) => (
            <View
              style={[
                styles.bubble,
                item.role === "user"
                  ? {
                      alignSelf: "flex-end",
                      backgroundColor: "#D4AF37",
                    }
                  : {
                      alignSelf: "flex-start",
                      backgroundColor: "#161412",
                      borderColor: "#2A241E",
                    },
              ]}
            >
              <Text
                style={[
                  styles.bubbleText,
                  {
                    color:
                      item.role === "user" ? "#0D0B07" : "#E8DCC8",
                  },
                ]}
              >
                {item.content}
              </Text>
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <View style={styles.iconRing}>
                <Feather name="message-circle" size={28} color="#D4AF37" />
              </View>
              <Text style={styles.emptyTitle}>Numisma Danışmanı</Text>
              <Text style={styles.emptySub}>
                Antik sikkeler, değerleme, müzayede ve koleksiyonculuk hakkında
                her soruyu yanıtlarım.
              </Text>
              <View style={styles.suggestions}>
                <Text style={styles.suggestionsLabel}>ÖRNEK SORULAR</Text>
                {SUGGESTIONS.map((s) => (
                  <Pressable
                    key={s}
                    onPress={() => send(s)}
                    style={styles.suggestionChip}
                  >
                    <Text style={styles.suggestionText}>{s}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          }
          onContentSizeChange={() =>
            listRef.current?.scrollToEnd({ animated: true })
          }
          showsVerticalScrollIndicator={false}
        />

        {/* Input */}
        <View style={styles.inputBar}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Soru sorun..."
            placeholderTextColor="#8B7A6A"
            multiline
            maxLength={500}
            onSubmitEditing={() => send(input)}
          />
          <Pressable
            onPress={() => send(input)}
            disabled={!input.trim() || loading}
            style={[
              styles.sendBtn,
              {
                backgroundColor:
                  input.trim() && !loading ? "#D4AF37" : "#2A241E",
              },
            ]}
          >
            <Feather
              name="send"
              size={18}
              color={input.trim() && !loading ? "#0D0B07" : "#8B7A6A"}
            />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#2A241E",
  },
  title: {
    fontFamily: "Cinzel_700Bold",
    fontSize: 16,
    letterSpacing: 4,
  },
  list: { paddingHorizontal: 16, paddingTop: 16 },
  bubble: {
    maxWidth: "80%",
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
  },
  bubbleText: {
    fontFamily: "CormorantGaramond_400Regular",
    fontSize: 15,
    lineHeight: 22,
  },
  emptyState: {
    alignItems: "center",
    paddingTop: 40,
    gap: 12,
  },
  iconRing: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: "#D4AF37",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  emptyTitle: {
    fontFamily: "Cinzel_600SemiBold",
    fontSize: 16,
    color: "#E8DCC8",
    letterSpacing: 2,
  },
  emptySub: {
    fontFamily: "CormorantGaramond_400Regular",
    fontSize: 14,
    color: "#8B7A6A",
    textAlign: "center",
    paddingHorizontal: 20,
  },
  suggestions: {
    width: "100%",
    paddingHorizontal: 16,
    marginTop: 8,
    gap: 8,
  },
  suggestionsLabel: {
    fontFamily: "JetBrainsMono_400Regular",
    fontSize: 9,
    color: "#8B7A6A",
    letterSpacing: 2,
    textAlign: "center",
    marginBottom: 8,
  },
  suggestionChip: {
    backgroundColor: "#161412",
    borderWidth: 1,
    borderColor: "#2A241E",
    borderRadius: 10,
    padding: 12,
  },
  suggestionText: {
    fontFamily: "CormorantGaramond_400Regular",
    fontSize: 14,
    color: "#E8DCC8",
  },
  inputBar: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#2A241E",
    backgroundColor: "#0D0B07",
  },
  input: {
    flex: 1,
    backgroundColor: "#161412",
    borderWidth: 1,
    borderColor: "#2A241E",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: "#E8DCC8",
    fontFamily: "CormorantGaramond_400Regular",
    fontSize: 15,
    maxHeight: 100,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
});
