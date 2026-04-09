import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./pages/userCRUD/Login.jsx";
import MyProfile from "./pages/userCRUD/myProfile.jsx";
import SignUp from "./pages/userCRUD/SignUp.jsx";
import Feed from "./pages/Feed.jsx";
import Friends from "./pages/Friends.jsx";
import Wardrobe from "./pages/clothesCRUD/Wardrobe.jsx";
import Store from "./pages/storeCRUD/Store.jsx";
import OutfitBuilder from "./pages/OutfitBuilder.jsx";
import Search from "./pages/Search.jsx";

function App() {
    const [token, setToken] = useState(localStorage.getItem("token"));

    const updateAuth = () => {
        setToken(localStorage.getItem("token"));
    };

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/signup" element={<SignUp />} />

                <Route path="/login" element={
                    token ? <Navigate to="/feed" /> : <Login onLoginSuccess={updateAuth} />
                } />

                <Route path="/profile" element={
                    token ? <MyProfile /> : <Navigate to="/login" />
                } />

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