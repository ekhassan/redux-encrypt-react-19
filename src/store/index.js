import { combineReducers, configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { encryptTransform } from "redux-persist-transform-encrypt";
import { persistReducer, persistStore } from "redux-persist";


import countReducer from "./counter/counterSlice"


const STORE_ENCRYPT_KEY = "my-super-secret-key"

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


const persistedCountReducer = persistReducer(countPersistConfig, countReducer)

const rootReducers = combineReducers({
    count: persistedCountReducer, 
})

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