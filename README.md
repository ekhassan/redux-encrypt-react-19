# Redux Encrypt - Secure State Persistence

A React application demonstrating encrypted state persistence using Redux Toolkit, Redux Persist, and Redux Persist Transform Encrypt. This project shows how to securely store sensitive application state in the browser's local storage with encryption.

## 🔐 Features

- **Encrypted State Persistence**: Application state is encrypted before being stored in localStorage
- **Redux Toolkit Integration**: Modern Redux setup with Redux Toolkit Query
- **Automatic Rehydration**: State is automatically restored and decrypted on app reload
- **Error Handling**: Built-in error handling for encryption/decryption failures
- **Development Tools**: Redux DevTools integration for debugging

## 🛠️ Tech Stack

- **React 19.1.1** - Modern React with latest features
- **Redux Toolkit 2.9.0** - Official Redux toolset
- **Redux Persist 6.0.0** - State persistence library
- **Redux Persist Transform Encrypt 5.1.1** - Encryption transform for Redux Persist
- **Vite** - Fast build tool and development server
- **ESLint** - Code linting and formatting

## 📦 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd redux-encrypt
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## 🏗️ Project Structure

```
src/
├── store/
│   ├── index.js              # Store configuration with encryption
│   └── counter/
│       └── counterSlice.js   # Counter slice with actions and reducers
├── App.jsx                   # Main application component
├── main.jsx                  # Application entry point with persistence
├── App.css                   # Application styles
└── index.css                 # Global styles
```

## 🔧 Core Implementation

### Store Configuration (`src/store/index.js`)

The heart of the encryption implementation:

```javascript path=src/store/index.js start=1
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { encryptTransform } from "redux-persist-transform-encrypt";
import { persistReducer, persistStore } from "redux-persist";

import countReducer from "./counter/counterSlice"

const STORE_ENCRYPT_KEY = "my-super-secret-key"

// Configure encryption for the counter state
const countPersistConfig = {
    key: "count",
    storage,
    transforms: [
        encryptTransform({
            secretKey: STORE_ENCRYPT_KEY,
            onError: (error) => {
                console.log(error);
            }
        })
    ]
}

// Apply encryption to the reducer
const persistedCountReducer = persistReducer(countPersistConfig, countReducer)

// Combine all reducers
const rootReducers = combineReducers({
    count: persistedCountReducer,
})

// Configure the store
const store = configureStore({
    devTools: true,
    reducer: rootReducers,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
            },
        }),
})

export const persistor = persistStore(store)
export default store;
```

### Counter Slice (`src/store/counter/counterSlice.js`)

A simple counter implementation to demonstrate encrypted persistence:

```javascript path=src/store/counter/counterSlice.js start=1
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    counter: 0,
    lastCount: 0,
};

export const counterSlice = createSlice({
    name: "counter", 
    initialState,
    reducers: {
        setCount: (state, action) => {
            state.counter = action.payload;
        },
        increment: (state) => {
            state.lastCount = state.counter;
            state.counter += 1;
        },
        decrement: (state) => {
            state.lastCount = state.counter;
            state.counter -= 1;
        }
    }
});

export const { setCount, increment, decrement } = counterSlice.actions;
export default counterSlice.reducer;
```

### App Entry Point (`src/main.jsx`)

Setup with PersistGate for state rehydration:

```javascript path=src/main.jsx start=1
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import store, { persistor } from './store/index.js'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PersistGate loading={null} persistor={persistor}>
      <Provider store={store}>
        <App />
      </Provider>
    </PersistGate>
  </StrictMode>
)
```

## 🔐 How Encryption Works

1. **State Changes**: When Redux state changes, the middleware intercepts the action
2. **Encryption**: Before persisting to localStorage, the state is encrypted using AES encryption
3. **Storage**: Encrypted data is stored in browser's localStorage
4. **Rehydration**: On app reload, encrypted data is retrieved from localStorage
5. **Decryption**: Data is decrypted using the secret key and merged back into the store

## 🔒 Security Considerations

### ⚠️ Important Security Notes:

- **Secret Key Management**: The encryption key is currently hardcoded. In production, use environment variables or secure key management
- **Key Rotation**: Consider implementing key rotation for enhanced security
- **Client-Side Limitation**: This encryption protects against casual browsing of localStorage but not against sophisticated attacks with access to the client-side code
- **HTTPS Only**: Always use HTTPS in production to protect data in transit

### Production Recommendations:

```javascript path=null start=null
// Use environment variables for the secret key
const STORE_ENCRYPT_KEY = process.env.REACT_APP_ENCRYPTION_KEY || "fallback-key"

// Add additional security transforms
const securityConfig = {
    key: "secureData",
    storage,
    transforms: [
        encryptTransform({
            secretKey: STORE_ENCRYPT_KEY,
            onError: (error) => {
                // Log to your error tracking service
                console.error('Encryption error:', error);
                // Optionally clear corrupted data
                storage.removeItem('persist:secureData');
            }
        })
    ],
    // Only persist specific fields
    whitelist: ['sensitiveField1', 'sensitiveField2']
}
```

## 🧪 Testing the Encryption

1. **Start the application** and increment the counter
2. **Open browser DevTools** → Application tab → Local Storage
3. **Find the encrypted data** under key `persist:count`
4. **Observe encrypted content** (should look like random characters)
5. **Refresh the page** and verify the counter value persists

## 💡 Use Cases

- **E-commerce Applications**: Secure shopping cart and user preferences
- **Financial Apps**: Encrypt sensitive financial data in browser storage  
- **Healthcare Systems**: HIPAA-compliant client-side data storage
- **SaaS Dashboards**: Protect user settings and application state
- **Banking Applications**: Secure transaction history and account data
- **Educational Platforms**: Encrypt student progress and assessment data
- **CRM Systems**: Protect customer information in offline mode
- **IoT Dashboards**: Secure device configurations and sensor data

## 🚀 Integration Guide

### Adding to Existing Project

1. **Install dependencies**:
```bash
npm install redux-persist redux-persist-transform-encrypt
```

2. **Configure encryption transform**:
```javascript path=null start=null
import { encryptTransform } from "redux-persist-transform-encrypt";

const encryptConfig = {
    key: 'your-slice-name',
    storage,
    transforms: [
        encryptTransform({
            secretKey: process.env.REACT_APP_ENCRYPTION_KEY,
            onError: console.error
        })
    ]
}
```

3. **Apply to your reducers**:
```javascript path=null start=null
const persistedReducer = persistReducer(encryptConfig, yourReducer)
```

4. **Setup PersistGate**:
```javascript path=null start=null
import { PersistGate } from 'redux-persist/integration/react'

<PersistGate loading={<div>Loading...</div>} persistor={persistor}>
    <YourApp />
</PersistGate>
```

### Selective Encryption

Encrypt only sensitive parts of your state:

```javascript path=null start=null
const sensitiveDataConfig = {
    key: 'sensitive',
    storage,
    whitelist: ['userCredentials', 'privateSettings'], // Only encrypt these
    transforms: [encryptTransform({ secretKey: SECRET_KEY })]
}

const publicDataConfig = {
    key: 'public',
    storage,
    // No encryption for public data
}
```

## 📋 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🔗 Related Resources

- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [Redux Persist Documentation](https://github.com/rt2zz/redux-persist)
- [Redux Persist Transform Encrypt](https://github.com/maxdeviant/redux-persist-transform-encrypt)
- [Vite Documentation](https://vitejs.dev/)

## 🔍 Keywords

React, ReactJS, Redux, Redux Toolkit, State Management, Encryption, AES, LocalStorage, Persistence, Security, Frontend, JavaScript, Vite, SPA, Redux Middleware, Data Protection, Secure Storage, State Rehydration, Client-Side Encryption, Browser Storage, Redux Persist, Encrypted State Management, React Security, Secure React Apps, Redux Security, Browser Security, Offline Data Protection

---

**Note**: This is a demonstration project. For production use, implement proper security practices including secure key management, error handling, and testing.
