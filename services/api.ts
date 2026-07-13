import { User } from 'firebase/auth';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

async function getAuthHeader(user: User): Promise<Record<string, string>> {
  const token = await user.getIdToken();
  return { Authorization: `Bearer ${token}` };
}

export async function registerUser(user: User, displayName: string): Promise<{ id: string }> {
  const response = await fetch(`${API_URL}/users/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      firebase_uid: user.uid,
      display_name: displayName,
    }),
  });

  if (!response.ok) {
    throw new Error('Registration failed');
  }

  return response.json();
}

export async function checkHealth(user: User): Promise<{ status: string }> {
  const authHeader = await getAuthHeader(user);
  const response = await fetch(`${API_URL}/health`, {
    headers: authHeader,
  });
  return response.json();
}