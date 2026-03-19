import * as StoreReview from "expo-store-review";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Linking, Platform } from "react-native";

export const REVIEW_SHOWN_KEY = "APP_REVIEW_SHOWN";
export const REVIEW_DISMISSED_KEY = "APP_REVIEW_DISMISSED";
export const REVIEW_COMPLETED_KEY = "review_completed";

const APP_STORE_URL = "https://apps.apple.com/app/idYOUR_APP_ID";
const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=YOUR_PACKAGE_NAME";

export const requestAppReview = async () => {
  try {
    const dismissed = await AsyncStorage.getItem(REVIEW_DISMISSED_KEY);
    if (dismissed) return;

    const hasAction = await StoreReview.hasAction();

    if (hasAction) {
      await StoreReview.requestReview();
      await AsyncStorage.setItem(REVIEW_SHOWN_KEY, "true");
    } else {
      const url = Platform.OS === "ios" ? APP_STORE_URL : PLAY_STORE_URL;
      Linking.openURL(url);
    }
  } catch (error) {
    console.log("Review Error:", error);
  }
};

export const dismissAppReview = async () => {
  await AsyncStorage.setItem(REVIEW_DISMISSED_KEY, "true");
};
