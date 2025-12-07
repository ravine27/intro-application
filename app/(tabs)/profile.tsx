import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const DEFAULT_AVATAR = "/mnt/data/803e6de6-6c3f-4aac-9353-e76eb0650c13.png";

// Color Theme - Light Theme Colors Only
const COLORS = {
  primaryRed: '#D84040',
  darkRed: '#A31D1D',
  lightBeige: '#ECDCBF',
  cream: '#F8F2DE',
  darkText: '#2D2D2D',
  grayText: '#666666',
  lightGray: '#E0E0E0',
  white: '#FFFFFF',
  black: '#000000',
};

export default function ProfileScreen({ navigation }: any) {
  // Profile states
  const [name, setName] = useState("");
  const [reg, setReg] = useState("");
  const [age, setAge] = useState("");
  const [address, setAddress] = useState("");
  const [instagram, setInstagram] = useState("");
  const [github, setGithub] = useState("");
  const [savedName, setSavedName] = useState("");
  const [savedReg, setSavedReg] = useState("");
  const [savedAge, setSavedAge] = useState("");
  const [savedAddress, setSavedAddress] = useState("");
  const [savedInsta, setSavedInsta] = useState("");
  const [savedGit, setSavedGit] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(true);
  const [gender, setGender] = useState<"Male" | "Female" | "Other" | "">("");
  const [savedGender, setSavedGender] = useState("");
  const [birthday, setBirthday] = useState<Date | null>(null);
  const [savedBirthday, setSavedBirthday] = useState<string>("");
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    (async () => {
      await requestPermissions();
      await loadData();
    })();
  }, []);

  async function requestPermissions() {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        console.log("Media permissions denied");
      }
    } catch (err) {
      console.warn("Permission error", err);
    }
  }

  async function loadData() {
    try {
      const [
        n,
        r,
        img,
        a,
        add,
        insta,
        git,
        gen,
        bday,
      ] = await Promise.all([
        AsyncStorage.getItem("userName"),
        AsyncStorage.getItem("userReg"),
        AsyncStorage.getItem("userImage"),
        AsyncStorage.getItem("userAge"),
        AsyncStorage.getItem("userAddress"),
        AsyncStorage.getItem("userInsta"),
        AsyncStorage.getItem("userGit"),
        AsyncStorage.getItem("userGender"),
        AsyncStorage.getItem("userBirthday"),
      ]);

      if (n) {
        setSavedName(n);
        setIsEditing(false);
      }
      if (r) setSavedReg(r);
      if (img) setImage(img);
      if (a) setSavedAge(a);
      if (add) setSavedAddress(add);
      if (insta) setSavedInsta(insta);
      if (git) setSavedGit(git);
      if (gen) setSavedGender(gen);
      if (bday) {
        setSavedBirthday(bday);
        const parsed = new Date(bday);
        if (!isNaN(parsed.getTime())) setBirthday(parsed);
      }
    } catch (err) {
      console.warn("Load error", err);
    }
  }

  async function saveData() {
    if (!name.trim()) {
      Alert.alert("Hold on!", "Please enter your name to continue");
      return;
    }

    try {
      await AsyncStorage.setItem("userName", name);
      await AsyncStorage.setItem("userReg", reg);
      await AsyncStorage.setItem("userAge", age);
      await AsyncStorage.setItem("userAddress", address);
      await AsyncStorage.setItem("userInsta", instagram);
      await AsyncStorage.setItem("userGit", github);
      await AsyncStorage.setItem("userGender", gender || "");
      await AsyncStorage.setItem("userBirthday", birthday ? birthday.toISOString() : "");

      setSavedName(name);
      setSavedReg(reg);
      setSavedAge(age);
      setSavedAddress(address);
      setSavedInsta(instagram);
      setSavedGit(github);
      setSavedGender(gender);
      setSavedBirthday(birthday ? birthday.toISOString() : "");

      // Clear inputs
      setName("");
      setReg("");
      setAge("");
      setAddress("");
      setInstagram("");
      setGithub("");
      setGender("");

      setIsEditing(false);
      Alert.alert("Profile Saved", "Your information has been updated! ✨");
    } catch (err) {
      console.warn("Save error", err);
      Alert.alert("Oops!", "Something went wrong while saving");
    }
  }

  async function pickImage() {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        const uri = result.assets[0].uri;
        setImage(uri);
        await AsyncStorage.setItem("userImage", uri);
        Alert.alert("Nice!", "Profile photo updated successfully! 📸");
      }
    } catch (err) {
      console.warn("Image pick error", err);
    }
  }

  function logout() {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out? Your profile data will be cleared.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes, Sign Out",
          style: "destructive",
          onPress: async () => {
            try {
              await AsyncStorage.multiRemove([
                "userName",
                "userReg",
                "userAge",
                "userAddress",
                "userImage",
                "userInsta",
                "userGit",
                "userGender",
                "userBirthday",
              ]);
              
              setIsEditing(true);
              setImage(null);
              setSavedName("");
              setSavedReg("");
              setSavedAge("");
              setSavedAddress("");
              setSavedInsta("");
              setSavedGit("");
              setSavedGender("");
              setSavedBirthday("");
              setBirthday(null);
              
              Alert.alert("Signed Out", "Come back anytime! 👋");
            } catch (err) {
              console.warn("Logout error", err);
            }
          },
        },
      ]
    );
  }

  function onChangeDate(event: any, selectedDate?: Date) {
    setShowDatePicker(Platform.OS === "ios");
    if (selectedDate) {
      setBirthday(selectedDate);
    }
  }

  const openSocial = (value: string | null, provider: "instagram" | "github") => {
    if (!value) {
      Alert.alert("No Profile", `You haven't added your ${provider} yet`);
      return;
    }
    const isFull = value.startsWith("http://") || value.startsWith("https://");
    let url = value;
    if (!isFull) {
      if (provider === "instagram") url = `https://instagram.com/${value.replace(/^@/, "")}`;
      if (provider === "github") url = `https://github.com/${value}`;
    }
    Linking.openURL(url).catch(() => Alert.alert("Link Error", "Couldn't open the link"));
  };

  return (
    <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}>
      {/* Red gradient header */}
      <LinearGradient
        colors={[COLORS.darkRed, COLORS.primaryRed]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>My Profile</Text>
          <Text style={styles.headerSubtitle}>Your personal space</Text>
        </View>
      </LinearGradient>

      {/* Profile Picture Section */}
      <View style={styles.avatarSection}>
        <TouchableOpacity onPress={pickImage} activeOpacity={0.7}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: image || DEFAULT_AVATAR }}
              style={styles.avatar}
            />
            <View style={styles.editAvatarOverlay}>
              <FontAwesome name="camera" size={16} color={COLORS.white} />
            </View>
          </View>
        </TouchableOpacity>
        
        <View style={styles.avatarInfo}>
          <Text style={styles.userName}>{savedName || "Hello there!"}</Text>
          <Text style={styles.userStatus}>
            {savedReg ? `Student ID: ${savedReg}` : "Tap Edit to get started"}
          </Text>
        </View>
      </View>

      {/* Main Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <FontAwesome name="user-circle" size={20} color={COLORS.primaryRed} />
          <Text style={styles.cardTitle}>Personal Information</Text>
        </View>

        {/* Info Rows */}
        <InfoRow icon="user" label="Name" value={savedName || "Not set yet"} />
        <InfoRow icon="id-card" label="Student ID" value={savedReg || "—"} />
        <InfoRow icon="birthday-cake" label="Age" value={savedAge || "—"} />
        <InfoRow icon="home" label="Location" value={savedAddress || "—"} />
        <InfoRow icon="venus-mars" label="Gender" value={savedGender || "—"} />
        <InfoRow 
          icon="calendar" 
          label="Birthday" 
          value={savedBirthday ? new Date(savedBirthday).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
          }) : "—"} 
        />

        {/* Edit/Save Section */}
        {!isEditing ? (
          <TouchableOpacity 
            onPress={() => setIsEditing(true)} 
            style={styles.editButton}
            activeOpacity={0.8}
          >
            <FontAwesome name="pencil" size={16} color={COLORS.white} />
            <Text style={styles.editButtonText}> Edit Profile</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.editForm}>
            <Text style={styles.sectionLabel}>Update Your Details</Text>
            
            <TextInput
              placeholder="What's your name?"
              placeholderTextColor={COLORS.grayText}
              value={name}
              onChangeText={setName}
              style={styles.input}
            />
            
            <TextInput
              placeholder="Student/Registration number"
              placeholderTextColor={COLORS.grayText}
              value={reg}
              onChangeText={setReg}
              style={styles.input}
            />
            
            <TextInput
              placeholder="Age"
              placeholderTextColor={COLORS.grayText}
              value={age}
              onChangeText={setAge}
              keyboardType="numeric"
              style={styles.input}
            />

            {/* Gender Selection */}
            <Text style={styles.inputLabel}>Gender</Text>
            <View style={styles.genderContainer}>
              {(["Male", "Female", "Other"] as const).map((g) => (
                <TouchableOpacity
                  key={g}
                  onPress={() => setGender(g)}
                  style={[
                    styles.genderOption,
                    gender === g && styles.genderOptionSelected,
                  ]}
                  activeOpacity={0.7}
                >
                  <Text style={[
                    styles.genderText,
                    gender === g && styles.genderTextSelected
                  ]}>{g}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Birthday Picker */}
            <Text style={styles.inputLabel}>Birthday</Text>
            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              style={styles.dateButton}
              activeOpacity={0.7}
            >
              <FontAwesome name="calendar" size={16} color={COLORS.primaryRed} />
              <Text style={styles.dateButtonText}>
                {birthday ? birthday.toLocaleDateString() : "Pick your birthday"}
              </Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={birthday || new Date(2000, 0, 1)}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={onChangeDate}
                maximumDate={new Date()}
              />
            )}

            <TextInput
              placeholder="Where do you live?"
              placeholderTextColor={COLORS.grayText}
              value={address}
              onChangeText={setAddress}
              style={[styles.input, styles.textArea]}
              multiline
              numberOfLines={3}
            />

            <Text style={styles.sectionLabel}>Social Links</Text>
            <TextInput
              placeholder="@username or instagram.com/..."
              placeholderTextColor={COLORS.grayText}
              value={instagram}
              onChangeText={setInstagram}
              style={styles.input}
            />
            <TextInput
              placeholder="github.com/username"
              placeholderTextColor={COLORS.grayText}
              value={github}
              onChangeText={setGithub}
              style={styles.input}
            />

            <View style={styles.buttonRow}>
              <TouchableOpacity 
                onPress={() => setIsEditing(false)} 
                style={[styles.actionButton, styles.cancelButton]}
                activeOpacity={0.8}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                onPress={saveData} 
                style={[styles.actionButton, styles.saveButton]}
                activeOpacity={0.8}
              >
                <FontAwesome name="check" size={16} color={COLORS.white} />
                <Text style={styles.saveButtonText}> Save Changes</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      {/* Social Links Section */}
      {(savedInsta || savedGit) && (
        <View style={styles.socialSection}>
          <Text style={styles.socialTitle}>Connect with me</Text>
          <View style={styles.socialButtons}>
            {savedInsta && (
              <TouchableOpacity
                style={[styles.socialButton, styles.instaButton]}
                onPress={() => openSocial(savedInsta, "instagram")}
                activeOpacity={0.8}
              >
                <FontAwesome name="instagram" size={20} color={COLORS.white} />
                <Text style={styles.socialButtonText}>Instagram</Text>
              </TouchableOpacity>
            )}
            {savedGit && (
              <TouchableOpacity
                style={[styles.socialButton, styles.githubButton]}
                onPress={() => openSocial(savedGit, "github")}
                activeOpacity={0.8}
              >
                <FontAwesome name="github" size={20} color={COLORS.white} />
                <Text style={styles.socialButtonText}>GitHub</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}

      {/* Logout Button */}
      <TouchableOpacity 
        onPress={logout} 
        style={styles.logoutButton}
        activeOpacity={0.7}
      >
        <FontAwesome name="sign-out" size={18} color={COLORS.white} />
        <Text style={styles.logoutText}> Sign Out</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Your information is stored locally on your device
        </Text>
      </View>
    </ScrollView>
  );
}

// Reusable Info Row Component
function InfoRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <View style={infoRowStyles.row}>
      <View style={infoRowStyles.iconContainer}>
        <FontAwesome name={icon as any} size={16} color={COLORS.primaryRed} />
      </View>
      <View style={infoRowStyles.content}>
        <Text style={infoRowStyles.label}>
          {label}
        </Text>
        <Text style={infoRowStyles.value}>
          {value}
        </Text>
      </View>
    </View>
  );
}

// Info Row Styles
const infoRowStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightBeige,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: `${COLORS.primaryRed}15`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 2,
    color: COLORS.grayText,
    opacity: 0.8,
  },
  value: {
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.darkText,
  },
});

// Light Theme Only
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.cream,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 30,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTitle: {
    color: COLORS.white,
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    marginTop: 4,
    fontWeight: '500',
  },
  avatarSection: {
    alignItems: 'center',
    marginTop: -40,
    marginBottom: 20,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: COLORS.white,
    backgroundColor: COLORS.lightBeige,
  },
  editAvatarOverlay: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primaryRed,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  avatarInfo: {
    alignItems: 'center',
    marginTop: 12,
  },
  userName: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.darkText,
    marginBottom: 4,
  },
  userStatus: {
    fontSize: 14,
    color: COLORS.grayText,
    opacity: 0.9,
  },
  card: {
    backgroundColor: COLORS.white,
    marginHorizontal: 16,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: COLORS.darkRed,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 1,
    borderColor: COLORS.lightBeige,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightBeige,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.darkText,
    marginLeft: 10,
  },
  editButton: {
    backgroundColor: COLORS.primaryRed,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: 10,
    shadowColor: COLORS.darkRed,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  editButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 6,
  },
  editForm: {
    marginTop: 10,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.darkText,
    marginBottom: 12,
    marginTop: 8,
  },
  input: {
    backgroundColor: COLORS.cream,
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: COLORS.darkText,
    borderWidth: 1,
    borderColor: COLORS.lightBeige,
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.grayText,
    marginBottom: 8,
    marginTop: 4,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  genderContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  genderOption: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.lightBeige,
    backgroundColor: COLORS.cream,
    marginRight: 10,
    alignItems: 'center',
  },
  genderOptionSelected: {
    backgroundColor: `${COLORS.primaryRed}15`,
    borderColor: COLORS.primaryRed,
  },
  genderText: {
    color: COLORS.grayText,
    fontWeight: '600',
  },
  genderTextSelected: {
    color: COLORS.darkRed,
    fontWeight: '700',
  },
  dateButton: {
    backgroundColor: COLORS.cream,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.lightBeige,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  dateButtonText: {
    color: COLORS.grayText,
    marginLeft: 10,
    fontSize: 15,
    fontWeight: '500',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  cancelButton: {
    backgroundColor: COLORS.lightBeige,
    borderWidth: 1,
    borderColor: COLORS.lightBeige,
  },
  cancelButtonText: {
    color: COLORS.grayText,
    fontWeight: '700',
    fontSize: 15,
  },
  saveButton: {
    backgroundColor: COLORS.primaryRed,
    shadowColor: COLORS.darkRed,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  saveButtonText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: 15,
    marginLeft: 6,
  },
  socialSection: {
    backgroundColor: COLORS.white,
    marginHorizontal: 16,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: COLORS.darkRed,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: COLORS.lightBeige,
  },
  socialTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.darkText,
    marginBottom: 16,
  },
  socialButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  socialButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  instaButton: {
    backgroundColor: '#E4405F',
  },
  githubButton: {
    backgroundColor: '#333333',
  },
  socialButtonText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: 14,
  },
  logoutButton: {
    backgroundColor: COLORS.darkRed,
    marginHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginBottom: 30,
    shadowColor: COLORS.darkRed,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  logoutText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: 16,
    marginLeft: 8,
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 30,
  },
  footerText: {
    color: COLORS.grayText,
    fontSize: 12,
    textAlign: 'center',
    marginHorizontal: 40,
    opacity: 0.7,
  },
});