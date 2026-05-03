"use client";
import { ReactNode } from "react";
import KambazNavigation from "./Navigation";
import "./styles.css";
import store from "./store";
import { PersistGate } from 'redux-persist/integration/react';
import { persistor } from './store';
import { Provider } from "react-redux";
export default function KambazLayout({ children }: Readonly<{ children: ReactNode }>) {
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                {children}
            </PersistGate>
            
        </Provider>
    );
}

