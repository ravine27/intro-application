import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type ImageInfo = {
  download_url: string;
  author: string;
  id: string;
};

export default function ExploreScreen() {
  const [img, setImg] = useState<ImageInfo | null>(null);
  const [loading, setLoading] = useState(true);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  const fadeIn = () => {
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  };

  const fetchImage = async () => {
    try {
      setLoading(true);

      const randomId = Math.floor(Math.random() * 1000);

      const response = await fetch(
        `https://picsum.photos/id/${randomId}/info`
      );
      const data = await response.json();

      setImg({
        id: data.id,
        download_url: data.download_url,
        author: data.author,
      });

      fadeIn();
    } catch (err) {
      console.log("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImage();
  }, []);

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : (
        img && (
          <Animated.View style={{ opacity: fadeAnim }}>
            <View style={styles.card}>
              <Image
                source={{ uri: img.download_url }}
                style={styles.image}
                resizeMode="cover"
              />

              <Text style={styles.author}>📷 {img.author}</Text>

              {/* ------- API Description Text Added Here ------- */}
              <Text style={styles.apiInfo}>
                This photo is loaded from the{" "}
                <Text style={{ fontWeight: "700" }}>Picsum Photos API</Text>.
                It provides random high-quality images from different
                photographers. Tap &quot;Load New Image&quot; to fetch a new random
                picture every time.
              </Text>
              {/* ------------------------------------------------ */}

              <TouchableOpacity onPress={fetchImage} style={styles.refreshBtn}>
                <Text style={styles.refreshText}>Load New Image</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        )
      )}
    </View>
  );
}

// ---------- Styles ----------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7fb",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  card: {
    backgroundColor: "#fff",
    width: 350,
    borderRadius: 16,
    padding: 16,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: 280,
    borderRadius: 12,
  },
  author: {
    fontSize: 18,
    marginTop: 12,
    fontWeight: "600",
  },

  apiInfo: {
    marginTop: 12,
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 6,
  },

  refreshBtn: {
    marginTop: 14,
    backgroundColor: "#007AFF",
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 10,
  },
  refreshText: {
    color: "#fff",
    fontWeight: "700",
  },
});
