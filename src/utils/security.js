import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'ecotrail_auth_token';

export async function saveSecureToken(token) {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
}

export async function getSecureToken() {
  return await SecureStore.getItemAsync(TOKEN_KEY);
}

export async function deleteSecureToken() {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
}
