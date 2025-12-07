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

// Color Theme
const COLORS = {
  lightCream: '#EBE8DB',
  pink: '#D76C82',
  darkPink: '#B03052',
  darkRed: '#3D0301',
  darkText: '#2D2D2D',
  grayText: '#666666',
  lightGray: '#E0E0E0',
  white: '#FFFFFF',
  black: '#000000',
};

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
  const [data, setData] = useState(posts);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());

  const toggleLike = (postId: string) => {
    const newLikedPosts = new Set(likedPosts);
    if (newLikedPosts.has(postId)) {
      newLikedPosts.delete(postId);
    } else {
      newLikedPosts.add(postId);
    }
    setLikedPosts(newLikedPosts);
  };

  const renderPost = ({ item }: { item: typeof posts[0] }) => {
    const isLiked = likedPosts.has(item.id);
    // Convert likes to number for calculations
    const likesCount = parseInt(item.likes as any);
    const displayLikes = isLiked ? likesCount + 1 : likesCount;
    
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
          <TouchableOpacity 
            style={styles.actionBtn}
            onPress={() => toggleLike(item.id)}
          >
            <FontAwesome 
              name={isLiked ? "heart" : "heart-o"} 
              size={18} 
              color={isLiked ? COLORS.darkPink : COLORS.pink} 
            />
            <Text style={[styles.actionText, isLiked && styles.likedText]}>
              {displayLikes}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtn}>
            <FontAwesome name="comment-o" size={18} color={COLORS.grayText} />
            <Text style={styles.actionText}> {item.comments}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtn}>
            <FontAwesome name="share" size={18} color={COLORS.grayText} />
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
        refreshing={false}
        onRefresh={() => {
          // Simulate refresh
          setTimeout(() => {
            setData([...posts]);
            setLikedPosts(new Set());
          }, 1000);
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { 
    flex: 1, 
    backgroundColor: COLORS.lightCream 
  },
  listContent: { 
    padding: CARD_HORIZONTAL_PADDING, 
    paddingBottom: 30 
  },

  // CARD
  card: {
    width: CARD_WIDTH,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    marginBottom: 20,
    overflow: "hidden",
    // subtle shadow
    shadowColor: COLORS.darkRed,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
    borderWidth: 1,
    borderColor: `${COLORS.pink}15`,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: `${COLORS.pink}05`,
  },

  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
    backgroundColor: `${COLORS.pink}20`,
    borderWidth: 2,
    borderColor: COLORS.pink,
  },

  headerText: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flex: 1,
  },

  author: {
    fontWeight: "700",
    color: COLORS.darkRed,
    fontSize: 15,
  },

  time: {
    color: COLORS.darkPink,
    fontSize: 12,
    marginLeft: 8,
    fontWeight: '600',
  },

  contentImage: {
    width: "100%",
    height: CONTENT_IMAGE_HEIGHT,
    backgroundColor: `${COLORS.pink}10`,
  },

  contentBlock: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 14,
    backgroundColor: COLORS.white,
  },

  title: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.darkRed,
    marginBottom: 8,
    lineHeight: 24,
  },

  summary: {
    fontSize: 15,
    color: COLORS.darkText,
    lineHeight: 22,
    opacity: 0.9,
  },

  divider: {
    height: 1,
    backgroundColor: `${COLORS.pink}20`,
    marginHorizontal: 16,
  },

  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    paddingHorizontal: 16,
    backgroundColor: `${COLORS.lightCream}80`,
  },

  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: 'transparent',
  },

  actionText: {
    color: COLORS.darkText,
    marginLeft: 6,
    fontWeight: "600",
    fontSize: 14,
  },

  likedText: {
    color: COLORS.darkPink,
    fontWeight: '700',
  },

  smallTime: {
    color: COLORS.darkPink,
    fontSize: 12,
    fontWeight: '600',
    opacity: 0.8,
  },
});