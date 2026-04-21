import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import { Toaster } from 'react-hot-toast';

import Login from "./pages/userCRUD/Login.jsx";
import MyProfile from "./pages/userCRUD/myProfile.jsx";
import SignUp from "./pages/userCRUD/SignUp.jsx";
import Feed from "./pages/Feed.jsx";
import Friends from "./pages/Friends.jsx";
import Wardrobe from "./pages/clothesCRUD/Wardrobe.jsx";
import Store from "./pages/storeCRUD/Store.jsx";
import OutfitBuilder from "./pages/outfitCRUD/OutfitBuilder.jsx";
import Search from "./components/Search.jsx";



const isTokenValid = (token) => {
    if (!token || token === "undefined" || token === "null") return false;
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.exp * 1000 > Date.now();
    } catch {
        return false;
    }
};

function App() {
    const [token, setToken] = useState(() => {
        const savedToken = localStorage.getItem("token");
        if (isTokenValid(savedToken)) return savedToken;
        // Si el token expiró, limpiamos el localStorage
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        return null;
    });

    const updateAuth = () => {
        setToken(localStorage.getItem("token"));
    };

    return (
        <BrowserRouter>
            {/* Importo  react toast */}

            <Toaster position="bottom-center" />
            <Routes>
                {/* Rutas Públicas */}
                <Route path="/login" element={
                    !token ? <Login onLoginSuccess={updateAuth} /> : <Navigate to="/feed" />
                } />
                <Route path="/profile" element={token ? <MyProfile onLogout={updateAuth} /> : <Navigate to="/login" />} />
                <Route path="/profile/:id" element={token ? <MyProfile onLogout={updateAuth} /> : <Navigate to="/login" />} />
                <Route path="/profile" element={token ? <MyProfile /> : <Navigate to="/login" />} />
                <Route path="/profile/:id" element={token ? <MyProfile /> : <Navigate to="/login" />} />
                <Route path="/signup" element={
                    !token ? <SignUp /> : <Navigate to="/feed" />
                } />

                {/* Rutas Privadas */}
                <Route path="/profile" element={token ? <MyProfile /> : <Navigate to="/login" />} />
                <Route path="/feed" element={token ? <Feed /> : <Navigate to="/login" />} />
                <Route path="/friends" element={token ? <Friends /> : <Navigate to="/login" />} />
                <Route path="/wardrobe" element={token ? <Wardrobe /> : <Navigate to="/login" />} />
                <Route path="/store" element={token ? <Store /> : <Navigate to="/login" />} />
                <Route path="/outfit-builder" element={token ? <OutfitBuilder /> : <Navigate to="/login" />} />
                <Route path="/search" element={token ? <Search /> : <Navigate to="/login" />} />

                <Route path="*" element={<Navigate to={token ? "/feed" : "/login"} />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;