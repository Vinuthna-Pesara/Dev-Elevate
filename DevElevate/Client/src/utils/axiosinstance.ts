import axios from 'axios';

// Define the structure of the data we expect to find in localStorage
interface AuthStateInStorage {
  sessionToken: string | null;
  // Other properties like user, etc. are not needed for the interceptor
}
const instance = axios.create({
  baseURL: `http://localhost:4000`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

instance.interceptors.request.use((config) => {
  const authStateString = localStorage.getItem("devElevateAuth");
  console.log('localStorage value:', authStateString); // Check the raw string
  let token = null;
  if (authStateString) {
    const authState = JSON.parse(authStateString);
    token = authState.sessionToken;
    console.log('Parsed token:', token); // Confirm you have a token string
  }
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log("✅ Token attached:", config.headers.Authorization);
  } else {
    console.warn("⚠️ No token found.");
  }
  return config;
});

instance.interceptors.response.use(
  response => response,
  error => {
    console.error("Axios error config:", error.config);
    console.error("Axios error response:", error.response?.data || error.message);

    if (error.response?.status === 401) {
      console.warn('Unauthorized. Please login again.');
    } else if (error.response?.status === 403) {
      console.warn('Forbidden. You do not have the necessary permissions for this action.');
    }
    return Promise.reject(error);
  }
);

export default instance;
