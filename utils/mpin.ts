import * as SecureStore from "expo-secure-store";

const MPIN_KEY = "user_mpin";

export const saveMPIN = async (mpin: string) => {
  await SecureStore.setItemAsync(MPIN_KEY, mpin);
};

export const getMPIN = async () => {
  return await SecureStore.getItemAsync(MPIN_KEY);
};

export const deleteMPIN = async () => {
  await SecureStore.deleteItemAsync(MPIN_KEY);
};