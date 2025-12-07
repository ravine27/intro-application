import { FontAwesome } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");
const CARD_HORIZONTAL_PADDING = 16;
const CARD_WIDTH = width - CARD_HORIZONTAL_PADDING * 2;
const CONTENT_IMAGE_HEIGHT = 200;

// use the uploaded file as avatar (tooling will convert the local path to a URL)
const UPLOADED_AVATAR = "/mnt/data/803e6de6-6c3f-4aac-9353-e76eb0650c13.png";

const posts = [
  {
    id: "1",
    author: "Radha Agarwal",
    avatar: UPLOADED_AVATAR,
    title: "Welcome to our new product feed",
    summary:
      "Simple, minimal and focused — learn how to make the most of your profile and posts. This short summary helps users decide what to read.",
    image: "https://picsum.photos/id/1015/900/600",
    time: "2h",
    likes: 24,
    comments: 5,
    shares: 2,
  },
  {
    id: "2",
    author: "Product Team",
    avatar: UPLOADED_AVATAR,
    title: "Performance update released",
    summary:
      "We improved scrolling performance and reduced initial load time. Expect smoother transitions on low-end devices.",
    image: "https://picsum.photos/id/1011/900/600",
    time: "4h",
    likes: 48,
    comments: 12,
    shares: 6,
  },
  {
    id: "3",
    author: "Design Insights",
    avatar: UPLOADED_AVATAR,
    title: "Design patterns for feed screens",
    summary:
      "Minimal visual noise and consistent card sizing make it easier for users to scan content quickly — here's a short guide.",
    image: "https://picsum.photos/id/1025/900/600",
    time: "1d",
    likes: 120,
    comments: 34,
    shares: 18,
  },
  {
    id: "4",
    author: "Newsroom",
    avatar: UPLOADED_AVATAR,
    title: "Scheduled maintenance notice",
    summary:
      "Maintenance will be performed this Sunday between 2:00–3:00 AM. Services may be intermittently unavailable.",
    image: "https://picsum.photos/id/103/900/600",
    time: "3d",
    likes: 8,
    comments: 2,
    shares: 1,
  },
  {
    id: "5",
    author: "Team Updates",
    avatar: UPLOADED_AVATAR,
    title: "How to customize your profile",
    summary:
      "Add a photo, social links, and a short bio to stand out. We provide templates to make setup fast and easy.",
    image: "https://picsum.photos/id/1043/900/600",
    time: "1w",
    likes: 67,
    comments: 9,
    shares: 5,
  },
];

export default function FeedScreen() {
  const [data] = useState(posts);

  const renderPost = ({ item }: { item: typeof posts[0] }) => {
    return (
      <View style={styles.card}>
        {/* header */}
        <View style={styles.headerRow}>
          <Image source={{ uri: item.avatar }} style={styles.avatar} />
          <View style={styles.headerText}>
            <Text style={styles.author}>{item.author}</Text>
            <Text style={styles.time}>{item.time}</Text>
          </View>
        </View>

        {/* content image */}
        <Image source={{ uri: item.image }} style={styles.contentImage} />

        {/* title & summary */}
        <View style={styles.contentBlock}>
          <Text style={styles.title} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.summary} numberOfLines={3}>
            {item.summary}
          </Text>
        </View>

        {/* divider */}
        <View style={styles.divider} />

        {/* actions row */}
        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.actionBtn}>
            <FontAwesome name="heart-o" size={18} color="#ff6b35" />
            <Text style={styles.actionText}> {item.likes}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtn}>
            <FontAwesome name="comment-o" size={18} color="#6b7280" />
            <Text style={styles.actionText}> {item.comments}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtn}>
            <FontAwesome name="share" size={18} color="#6b7280" />
            <Text style={styles.actionText}> {item.shares}</Text>
          </TouchableOpacity>

          {/* optional timestamp shown at far right */}
          <View style={{ flex: 1 }} />
          <Text style={styles.smallTime}>{item.time}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.screen}>
      <FlatList
        data={data}
        keyExtractor={(i) => i.id}
        renderItem={renderPost}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        // simple pull-to-refresh setup (optional)
        refreshing={false}
        onRefresh={() => {
          /* connect to refresh logic */
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#f3f4f6" },
  listContent: { padding: CARD_HORIZONTAL_PADDING, paddingBottom: 30 },

  // CARD
  card: {
    width: CARD_WIDTH,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
    // subtle shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
  },

  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 10,
    backgroundColor: "#e5e7eb",
  },

  headerText: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flex: 1,
  },

  author: {
    fontWeight: "700",
    color: "#0b1226",
    fontSize: 15,
  },

  time: {
    color: "#6b7280",
    fontSize: 12,
    marginLeft: 8,
  },

  contentImage: {
    width: "100%",
    height: CONTENT_IMAGE_HEIGHT,
    backgroundColor: "#e6edf3",
  },

  contentBlock: {
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 10,
  },

  title: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0b1226",
    marginBottom: 6,
  },

  summary: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 20,
  },

  divider: {
    height: 1,
    backgroundColor: "#eef2f7",
    marginHorizontal: 12,
  },

  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    paddingHorizontal: 12,
  },

  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 18,
  },

  actionText: {
    color: "#374151",
    marginLeft: 6,
    fontWeight: "600",
  },

  smallTime: {
    color: "#9ca3af",
    fontSize: 12,
  },
});
