// Style/Homestyle.js
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  // ========== General Styles ==========
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#f0f4ff",
    paddingTop: 80,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 30,
    fontFamily: "Righteous",
    fontWeight: "bold",
    color: "#4F74B8",
    marginBottom: 40,
  },
  subtitle: {
    fontSize: 20,
    fontFamily: "Righteous",
    color: "#333333",
    marginTop: 5,
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    width: "100%",
    height: 50,
    padding: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    backgroundColor: "#fff",
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#4F74B8",
    padding: 15,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    marginVertical: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  linkText: {
    color: "#4F74B8",
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginBottom: 10,
  },
  successText: {
    color: "green",
    fontSize: 14,
    marginBottom: 10,
  },

  // ========== Logo, Splash, Logout Styles ==========
  logo: { width: 500, height: 500 },
  welcomeLogo: {
    width: 412,
    height: 371,
    marginBottom: -80,
    marginTop: -30,
  },
  splashContainer: {
    flex: 1,
    backgroundColor: "#BED5EA",
    justifyContent: "center",
    alignItems: "center",
  },
  logoutButton: {
    backgroundColor: "#ff7675",
    padding: 15,
    borderRadius: 10,
    width: 200,
    alignItems: "center",
    marginVertical: 10,
  },

  // ========== Styles for StudentHomeScreen ==========
  backgroundImage: { flex: 1, width: "100%", height: "100%" },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(240, 244, 255, 0.85)",
  },
  studentScreenContainer: {
    flex: 1,
    backgroundColor: "transparent", // Match app background
  },
  studentScrollContainer: {
    // This style is not directly used in StudentHomeScreen as it uses FlatList for quests
    // It might be intended for a ScrollView wrapping the entire content, which is not the case here.
    // Ensure the main content (header, profile, quests) is laid out without absolute positioning
    // so it pushes the score container up when the content grows.
    // For now, removing `paddingBottom: 100` if it conflicts with scoreContainer.
    paddingHorizontal: 15,
    paddingTop: 50,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    marginBottom: 10,
    // Add paddingTop to account for status bar, using insets in the component
    paddingTop: 10, // Adjust in component with insets.top
  },
  appTitle: {
    fontSize: 24,
    fontFamily: "Righteous",
    color: "#4F74B8",
  },
  notificationIcon: { width: 30, height: 30 },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 15,
    marginHorizontal: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileImage: { width: 60, height: 60, borderRadius: 30 },
  profileInfo: { flex: 1, marginLeft: 15 },
  rank: { fontSize: 16, fontWeight: "bold", color: "#4F74B8" },
  rankNote: { fontSize: 12, color: "gray", fontStyle: "italic" },
  username: { fontSize: 18, fontWeight: "600", color: "#333" },
  menuIcon: { width: 24, height: 24 },
  progressWrapper: {
    height: 8,
    backgroundColor: "#e0e7ff",
    borderRadius: 4,
    marginTop: 15,
    overflow: "hidden",
    marginHorizontal: 15, // Apply horizontal margin consistently
    marginBottom: 20, // Add some space below the progress bar
  },
  progressTrack: {
    height: 10,
    backgroundColor: "#e0e0e0",
    borderRadius: 5,
  },
  progressFill: {
    height: "100%",
    width: "0%",
    backgroundColor: "#4F74B8",
    borderRadius: 4,
  },
  questCard: {
    backgroundColor: "rgba(255, 255, 255, 0.7)", // <-- 90% opaque white
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
  },
  questCategory: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4F74B8",
    marginTop: 10,
    marginBottom: 5,
  },
  section: {
    marginHorizontal: 15,
    // marginBottom: 20, // This might push the score container down if content is short
    flex: 1, // Allow this section to take available space
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
    marginTop: 20,
  },
  sectionCard: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 15,
    marginHorizontal: 15, // Keep consistent with profileCard
    marginTop: 10, // Add some space above it if needed
    marginBottom: 20, // Add space below if there's other content after it
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  questItem: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  questName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  questDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  questPoints: {
    fontSize: 14,
    color: "#4F74B8",
    fontWeight: "bold",
  },
  questType: {
    fontSize: 12,
    color: "#666",
    backgroundColor: "#e0e0e0",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  placeholder: {
    height: 30,
    backgroundColor: "#f0f4ff",
    borderRadius: 8,
    marginVertical: 5,
  },
  scoreContainer: {
    position: "absolute",
    left: 15,
    right: 15,
    zIndex: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    // The `bottom` value will be set dynamically in StudentHomeScreen.js
  },
  scoreText: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#333",
  },
  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    // paddingBottom will be adjusted by SafeAreaInsets in the component
  },
  navIconContainer: {
    padding: 10,
  },
  navIcon: {
    width: 30,
    height: 30,
  },
  menuOverlay: {
    ...StyleSheet.absoluteFillObject, // This makes it cover the entire screen
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end", // Push the menu container to the bottom
    zIndex: 999, // Ensure it's on top of everything else
  },
  menuContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: "70%",
    // Add paddingBottom based on insets dynamically in the component
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  menuItemIcon: {
    fontSize: 20,
    marginRight: 15,
  },
  menuItemText: {
    fontSize: 16,
    color: "#333",
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  noQuestText: {
    textAlign: 'center',
    color: '#888',
    fontStyle: 'italic',
    padding: 20,
  },

  // ========== Styles for Admin Screens ==========
  adminScrollContainer: {
    paddingHorizontal: 15,
    paddingBottom: 30,
  },
  adminScreenContainer: {
    flex: 1,
    backgroundColor: "#f0f4ff",
  },
  adminContainer: {
    flex: 1,
    backgroundColor: "#f0f4ff",
    padding: 20,
  },
  adminHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 10,
  },
  adminAppTitle: {
    fontSize: 24,
    fontFamily: "Righteous",
    color: "#4F74B8",
  },
  adminNotificationIcon: {
    width: 30,
    height: 30,
  },
  adminProfileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 15,
    marginHorizontal: 15,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  adminProfileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "#f0f4ff",
  },
  adminProfileInfo: {
    flex: 1,
    marginLeft: 15,
  },
  adminRank: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#4F74B8",
  },
  adminUsername: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  adminTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#4F74B8",
  },
  adminSubtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
  },
  adminStatsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  adminStatCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    flex: 1,
    marginHorizontal: 5,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  adminStatNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4F74B8",
  },
  adminStatLabel: {
    fontSize: 14,
    color: "#666",
  },
  adminSection: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  adminSectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  adminClassCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  adminClassInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  adminClassName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  adminClassCode: {
    fontSize: 14,
    color: "#666",
  },
  adminClassActions: {
    flexDirection: "row",
    marginTop: 10,
  },
  adminClassActionButton: {
    backgroundColor: "#4F74B8",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginRight: 10,
  },
  adminClassActionButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  adminClassDeleteButton: {
    backgroundColor: "#ff4757",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  adminClassDeleteButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  adminInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  adminButton: {
    backgroundColor: "#4F74B8",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  adminButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  adminCancelButton: {
    backgroundColor: "#ccc",
  },
  adminCancelButtonText: {
    color: "#333",
  },
  adminEmptyText: {
    textAlign: "center",
    color: "#888",
    fontStyle: "italic",
    padding: 20,
  },
  adminMenuButton: {
    padding: 10,
  },
  adminMenuIcon: {
    width: 24,
    height: 24,
  },
  adminWelcomeText: {
    fontSize: 16,
    color: "#333",
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  adminContentContainer: {
    paddingHorizontal: 15,
  },
  adminSearchRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  adminSearchWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 45,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  adminSearchIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
    tintColor: "#888",
  },
  adminSearchInput: {
    flex: 1,
    fontSize: 16,
    color: "#000",
  },
  adminActionIconBtn: {
    marginLeft: 10,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
    height: 45,
    width: 45,
  },
  adminActionIcon: {
    width: 24,
    height: 24,
    tintColor: "#fff",
  },
  adminTabContainer: {
    flexDirection: "row",
    marginBottom: 15,
  },
  adminTab: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginRight: 10,
    backgroundColor: "#e9eef7",
  },
  adminTabActive: {
    backgroundColor: "#4F74B8",
  },
  adminTabIcon: {
    width: 16,
    height: 16,
    marginRight: 8,
    tintColor: "#fff",
  },
  adminTabText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  adminCard: {
    backgroundColor: "#ffffff",
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
  },
  adminCardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  adminQuestBarContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-end",
    height: 100,
  },
  adminQuestBarWrapper: {
    flex: 1,
    marginHorizontal: 5,
    height: "100%",
    backgroundColor: "#f0f4ff",
    borderRadius: 8,
    justifyContent: "flex-end",
  },
  adminQuestBar: {
    width: "100%",
    borderRadius: 8,
  },
  adminClassCirclesRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  adminCircleContainer: {
    alignItems: "center",
  },
  adminCircleLabel: {
    marginTop: 8,
    fontSize: 12,
    color: "#333333",
  },
  adminMenuOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    zIndex: 1000,
  },
  adminMenuContainer: {
    position: "absolute",
    top: 100,
    right: 20,
    backgroundColor: "white",
    borderRadius: 8,
    width: 260,
    padding: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  adminMenuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 15,
  },
  adminMenuItemIcon: {
    fontSize: 18,
    marginRight: 15,
  },
  adminMenuItemText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  adminMenuSeparator: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginVertical: 4,
  },
  adminClassListContainer: {
    paddingHorizontal: 15,
  },
  adminClassListItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  adminClassAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  adminClassUserInfo: {
    flex: 1,
  },
  adminClassUsername: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  adminClassLrn: {
    fontSize: 14,
    color: "#666",
  },
  adminClassActionButtons: {
    flexDirection: "row",
  },
  adminClassAcceptButton: {
    backgroundColor: "#27ae60",
    padding: 8,
    borderRadius: 5,
    marginRight: 5,
  },
  adminClassDeclineButton: {
    backgroundColor: "#e74c3c",
    padding: 8,
    borderRadius: 5,
  },
  adminClassButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
  },
  adminClassEmptyText: {
    textAlign: "center",
    color: "#888",
    fontStyle: "italic",
    padding: 20,
  },
  adminClassCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  adminClassCardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  adminClassCardSubtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
  },
  adminClassCardContent: {
    marginBottom: 15,
  },
  adminClassCardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  adminClassCardButton: {
    backgroundColor: "#4F74B8",
    padding: 10,
    borderRadius: 5,
  },
  adminClassCardButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },

  // ========== Styles for CreateTaskScreen ==========
  createTaskContainer: {
    flex: 1,
    backgroundColor: "#f0f4ff",
    padding: 20,
  },
  createTaskTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#4F74B8",
    marginBottom: 20,
  },
  createTaskSubtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
  },
  createTaskInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  createTaskButton: {
    backgroundColor: "#4F74B8",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  createTaskButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  createTaskCancelButton: {
    backgroundColor: "#ccc",
  },
  createTaskCancelButtonText: {
    color: "#333",
  },
  createTaskEmptyText: {
    textAlign: "center",
    color: "#888",
    fontStyle: "italic",
    padding: 20,
  },

  // ========== Styles for MyClassScreen ==========
  myClassContainer: {
    flex: 1,
    backgroundColor: "#f0f4ff",
    padding: 20,
  },
  myClassTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#4F74B8",
    marginBottom: 20,
  },
  myClassCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  myClassSectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  myClassInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  myClassButton: {
    backgroundColor: "#4F74B8",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  myClassButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "#ccc",
  },
  cancelButtonText: {
    color: "#333",
  },
  myClassEmptyText: {
    textAlign: "center",
    color: "#888",
    fontStyle: "italic",
    padding: 20,
  },
  myClassListItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  myClassAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  myClassUserInfo: {
    flex: 1,
  },
  myClassUsername: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  myClassLrn: {
    fontSize: 14,
    color: "#666",
  },
  myClassActionButtons: {
    flexDirection: "row",
  },
  myClassAcceptButton: {
    backgroundColor: "#27ae60",
    padding: 8,
    borderRadius: 5,
    marginRight: 5,
  },
  myClassDeclineButton: {
    backgroundColor: "#e74c3c",
    padding: 8,
    borderRadius: 5,
  },
  myClassButtonTextSmall: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
  },

  // ========== Styles for ProfileEditScreen ==========
  ProfileEditScreencontainer: {
    flex: 1,
    backgroundColor: "#f0f4ff",
    padding: 20,
  },
  ProfileEditScreenImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: "center",
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "#4F74B8",
  },
  changeText: {
    color: "#4F74B8",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    textDecorationLine: "underline",
  },
  ProfileEditScreeninput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  ProfileEditScreenbutton: {
    backgroundColor: "#4F74B8",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  ProfileEditScreenbuttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  ProfileEditScreenbuttonSecondary: {
    backgroundColor: "#ccc",
  },
  ProfileEditScreenbuttonTextSecondary: {
    color: "#333",
  },
  ProfileEditScreenEmptyText: {
    textAlign: "center",
    color: "#888",
    fontStyle: "italic",
    padding: 20,
  },

  // ========== Styles for LoginScreen ==========
  loginContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f4ff",
    padding: 20,
  },
  loginTitle: {
    fontSize: 30,
    fontFamily: "Righteous",
    fontWeight: "bold",
    color: "#4F74B8",
    marginBottom: 40,
  },
  loginInput: {
    width: "100%",
    height: 50,
    padding: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    backgroundColor: "#fff",
    fontSize: 16,
    marginBottom: 20,
  },
  loginButton: {
    backgroundColor: "#4F74B8",
    padding: 15,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    marginVertical: 10,
  },
  loginButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  loginLinkText: {
    color: "#4F74B8",
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
  loginErrorText: {
    color: "red",
    fontSize: 14,
    marginBottom: 10,
  },
  loginSuccessText: {
    color: "green",
    fontSize: 14,
    marginBottom: 10,
  },
  inputField: {
    flex: 1,
    fontSize: 16,
    height: "100%",
  },
  icon: {
    marginLeft: 10,
  },
  button: {
    backgroundColor: "#a6c8ff",
    padding: 15,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    marginVertical: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  linkText: {
    color: "#4F74B8",
    fontWeight: "bold",
  },

  // ========== Styles for SignupScreen ==========
  signupContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f4ff",
    padding: 20,
  },
  signupTitle: {
    fontSize: 30,
    fontFamily: "Righteous",
    fontWeight: "bold",
    color: "#4F74B8",
    marginBottom: 40,
  },
  signupInput: {
    width: "100%",
    height: 50,
    padding: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    backgroundColor: "#fff",
    fontSize: 16,
    marginBottom: 20,
  },
  signupButton: {
    backgroundColor: "#4F74B8",
    padding: 15,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    marginVertical: 10,
  },
  signupButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  signupLinkText: {
    color: "#4F74B8",
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
  signupErrorText: {
    color: "red",
    fontSize: 14,
    marginBottom: 10,
  },
  signupSuccessText: {
    color: "green",
    fontSize: 14,
    marginBottom: 10,
  },

  // ========== Styles for ForgotPasswordScreen ==========
  forgotPasswordContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f4ff",
    padding: 20,
  },
  forgotPasswordTitle: {
    fontSize: 30,
    fontFamily: "Righteous",
    fontWeight: "bold",
    color: "#4F74B8",
    marginBottom: 40,
  },
  forgotPasswordInput: {
    width: "100%",
    height: 50,
    padding: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    backgroundColor: "#fff",
    fontSize: 16,
    marginBottom: 20,
  },
  forgotPasswordButton: {
    backgroundColor: "#4F74B8",
    padding: 15,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    marginVertical: 10,
  },
  forgotPasswordButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  forgotPasswordLinkText: {
    color: "#4F74B8",
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
  forgotPasswordErrorText: {
    color: "red",
    fontSize: 14,
    marginBottom: 10,
  },
  forgotPasswordSuccessText: {
    color: "green",
    fontSize: 14,
    marginBottom: 10,
  },

  // ========== Styles for WelcomeScreen ==========
  welcomeContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f4ff",
    padding: 20,
  },
  welcomeTitle: {
    fontSize: 30,
    fontFamily: "Righteous",
    fontWeight: "bold",
    color: "#4F74B8",
    marginBottom: 40,
  },
  welcomeButton: {
    backgroundColor: "#4F74B8",
    padding: 15,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    marginVertical: 10,
  },
  welcomeButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  welcomeLinkText: {
    color: "#4F74B8",
    fontWeight: "bold",
    textDecorationLine: "underline",
  },

  // ========== Styles for ChatMessageScreen ==========
  chatMessageContainer: {
    flex: 1,
    backgroundColor: "#f0f4ff",
  },
  messagesContainer: {
    flex: 1,
    padding: 10,
  },
  messagesScrollView: {
    padding: 10,
  },
  messageContainer: {
    marginBottom: 10,
    flexDirection: "column",
  },
  ownMessageContainer: {
    alignItems: "flex-end",
  },
  otherMessageContainer: {
    alignItems: "flex-start",
  },
  senderName: {
    fontSize: 12,
    color: "#666",
    marginBottom: 2,
    marginLeft: 10,
  },
  messageBubble: {
    maxWidth: "80%",
    padding: 10,
    borderRadius: 15,
  },
  ownBubble: {
    backgroundColor: "#dcf8c6", // Light green for own messages
    borderBottomRightRadius: 0,
  },
  otherBubble: {
    backgroundColor: "#ffffff", // White for other messages
    borderBottomLeftRadius: 0,
  },
  messageText: {
    fontSize: 16,
  },
  messageTime: {
    fontSize: 10,
    color: "#999",
    textAlign: "right",
    marginTop: 5,
  },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: "rgba(255, 255, 255, 0.8)", // Semi-transparent background
    alignItems: "center",
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    maxHeight: 100, // Limit height for multiline input
  },
  sendButton: {
    backgroundColor: "#007AFF", // Blue color, adjust as needed
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginLeft: 10,
  },
  sendButtonText: {
    color: "white",
    fontWeight: "bold",
  },

  // ========== Styles for LeaderboardsScreen ==========
  leaderboardContainer: {
    flex: 1,
    backgroundColor: "#f0f4ff",
    padding: 20,
  },
  leaderboardTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#4F74B8",
    marginBottom: 20,
  },
  leaderboardTabRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  leaderboardTab: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#e0e0e0",
    borderRadius: 20,
    marginHorizontal: 5,
  },
  leaderboardTabActive: {
    backgroundColor: "#4F74B8",
  },
  leaderboardTabText: {
    color: "#333",
    fontWeight: "bold",
  },
  leaderboardTabTextActive: {
    color: "#fff",
  },
  podiumContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-end",
    marginBottom: 30,
  },
  podiumItem: {
    alignItems: "center",
    marginHorizontal: 10,
  },
  podiumItem1: {
    height: 120,
    backgroundColor: "#FFD700",
    padding: 10,
    borderRadius: 10,
  },
  podiumAvatar1: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 5,
  },
  podiumAvatar2: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 5,
  },
  podiumAvatar3: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginBottom: 5,
  },
  podiumName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 2,
  },
  podiumScore: {
    fontSize: 12,
    color: "#666",
  },
  crownIcon: {
    width: 24,
    height: 24,
    position: "absolute",
    top: -15,
    zIndex: 1,
  },
  timeTabRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  timeTab: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: "#e0e0e0",
    borderRadius: 15,
    marginHorizontal: 5,
  },
  timeTabActive: {
    backgroundColor: "#4F74B8",
  },
  timeTabText: {
    color: "#333",
    fontWeight: "bold",
  },
  timeTabTextActive: {
    color: "#fff",
  },
  rankListContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  rankListHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  rankListHeaderText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  rankItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  rankPosition: {
    width: 30,
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  rankStudentInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginLeft: 10,
  },
  rankAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  rankName: {
    fontSize: 16,
    color: "#333",
  },
  rankScoreContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  rankScoreText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#4F74B8",
  },
  scrollChevron: {
    width: 20,
    height: 20,
    alignSelf: "center",
    marginVertical: 10,
  },

  // ========== Styles for CreateClassScreen ==========
  createClassContainer: {
    flex: 1,
    backgroundColor: "#f0f4ff",
    padding: 20,
  },
  createClassTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#4F74B8",
    marginBottom: 20,
  },
  createClassInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  createClassButton: {
    backgroundColor: "#4F74B8",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  createClassButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  createClassCancelButton: {
    backgroundColor: "#ccc",
  },
  createClassCancelButtonText: {
    color: "#333",
  },
  createClassEmptyText: {
    textAlign: "center",
    color: "#888",
    fontStyle: "italic",
    padding: 20,
  },

  // ========== Styles for JoinClassScreen ==========
  joinClassContainer: {
    flex: 1,
    backgroundColor: "#f0f4ff",
    padding: 20,
  },
  joinClassTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#4F74B8",
    marginBottom: 20,
  },
  joinClassInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  joinClassButton: {
    backgroundColor: "#4F74B8",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  joinClassButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  joinClassCancelButton: {
    backgroundColor: "#ccc",
  },
  joinClassCancelButtonText: {
    color: "#333",
  },
  joinClassEmptyText: {
    textAlign: "center",
    color: "#888",
    fontStyle: "italic",
    padding: 20,
  },

  // ========== Styles for StudentTasksScreen ==========
  studentTasksContainer: {
    flex: 1,
    backgroundColor: "#f0f4ff",
    padding: 20,
  },
  studentTasksTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#4F74B8",
    marginBottom: 20,
  },
  studentTasksCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  studentTasksSectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  studentTasksEmptyText: {
    textAlign: "center",
    color: "#888",
    fontStyle: "italic",
    padding: 20,
  },

  // ========== Styles for StudentProgressScreen ==========
  studentProgressContainer: {
    flex: 1,
    backgroundColor: "#f0f4ff",
    padding: 20,
  },
  studentProgressTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#4F74B8",
    marginBottom: 20,
  },
  studentProgressCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  studentProgressSectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  studentProgressEmptyText: {
    textAlign: "center",
    color: "#888",
    fontStyle: "italic",
    padding: 20,
  },

  // ========== Styles for SettingsScreen ==========
  settingsContainer: {
    flex: 1,
    backgroundColor: "#f0f4ff",
    padding: 20,
  },
  settingsTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#4F74B8",
    marginBottom: 20,
  },
  settingsCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  settingsSectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  settingsEmptyText: {
    textAlign: "center",
    color: "#888",
    fontStyle: "italic",
    padding: 20,
  },

  // ========== Styles for QuestsHistoryScreen ==========
  questsHistoryContainer: {
    flex: 1,
    backgroundColor: "#f0f4ff",
    padding: 20,
  },
  questsHistoryTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#4F74B8",
    marginBottom: 20,
  },
  questsHistoryCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  questsHistorySectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  questsHistoryEmptyText: {
    textAlign: "center",
    color: "#888",
    fontStyle: "italic",
    padding: 20,
  },

  // ========== Styles for MilestonesScreen ==========
  milestonesContainer: {
    flex: 1,
    backgroundColor: "#f0f4ff", // Standard background color
  },
  milestonesGrid: {
    padding: 10,
  },
  milestoneCard: {
    flex: 1,
    margin: 10,
    backgroundColor: "#fff",
    borderRadius: 20,
    aspectRatio: 1, // This makes the card a perfect square
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    padding: 10,
  },
  milestoneIcon: {
    width: "70%",
    height: "70%",
    resizeMode: "contain",
    marginBottom: 5,
  },
  milestoneName: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  lockedMilestoneQuestionMark: {
    fontSize: 60,
    color: "#4F74B8",
    fontWeight: "bold",
  },
});

export default styles;