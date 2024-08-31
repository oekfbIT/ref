import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./app/store";
import { AuthProvider } from "./network/authContext";
import { ThemeProvider } from "@contexts/themeContext";
import { ShopProvider } from "@contexts/shopContext";
import Login from "@pages/Login";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <Provider store={store}>
        <BrowserRouter>
            <ThemeProvider>
                <ShopProvider>
                    <AuthProvider>
                        <Routes>
                            <Route path="/login" element={<Login />} />
                            <Route path="/*" element={<App />} />
                        </Routes>
                    </AuthProvider>
                </ShopProvider>
            </ThemeProvider>
        </BrowserRouter>
    </Provider>
);
