
export interface Environment {
  apiBaseUrl: string;
  firebase: {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
  };
  googleSignIn: {
    webClientId: string;
  };
  features: {
    analytics: boolean;
    notifications: boolean;
    offlineMode: boolean;
  };
}

export const development: Environment = {
  apiBaseUrl: 'http://localhost:3000/api',
  firebase: {
    apiKey: "AIzaSyDgMJ57NuloSZup7myB6QnSa7QhRC2G7m0",
    authDomain: "chrono-d649f.firebaseapp.com",
    projectId: "chrono-d649f",
    storageBucket: "chrono-d649f.firebasestorage.app",
    messagingSenderId: "941489768691",
    appId: "1:941489768691:android:74502fc4e7b3dc5c760f86",
  },
  googleSignIn: {
    webClientId: '941489768691-la2n0nd4d4g676i7sdrjdnucn0bao9t8.apps.googleusercontent.com',
  },
  features: {
    analytics: true,
    notifications: true,
    offlineMode: true,
  },
};

export const production: Environment = {
  apiBaseUrl: 'https://your-api-domain.com/api',
  firebase: {
    apiKey: "AIzaSyDgMJ57NuloSZup7myB6QnSa7QhRC2G7m0",
    authDomain: "chrono-d649f.firebaseapp.com",
    projectId: "chrono-d649f",
    storageBucket: "chrono-d649f.firebasestorage.app",
    messagingSenderId: "941489768691",
    appId: "1:941489768691:android:74502fc4e7b3dc5c760f86",
  },
  googleSignIn: {
    webClientId: '941489768691-la2n0nd4d4g676i7sdrjdnucn0bao9t8.apps.googleusercontent.com',
  },
  features: {
    analytics: true,
    notifications: true,
    offlineMode: false,
  },
};


const getEnvironment = (): Environment => {
  const env = process.env.NODE_ENV || 'development';
  return env === 'production' ? production : development;
};

export const environment = getEnvironment();
