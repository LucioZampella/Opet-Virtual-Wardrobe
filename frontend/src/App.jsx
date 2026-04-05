import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import Login from "./pages/userCRUD/Login.jsx";
import MyProfile from "./pages/userCRUD/myProfile.jsx";
import SignUp from "./pages/userCRUD/SignUp.jsx";
import Feed from "./pages/Feed.jsx";
import Friends from "./pages/Friends.jsx";
import Wardrobe from "./pages/Wardrobe.jsx";
import Store from "./pages/Store.jsx";
import OutfitBuilder from "./pages/OutfitBuilder.jsx";
import Search from "./pages/Search.jsx";

function App() {
    const [userId, setUserId] = useState(localStorage.getItem("userId"));

    const updateUserId = () => {
        setUserId(localStorage.getItem("userId"));
    };

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/signup" element={<SignUp />} />

                <Route path="/login" element={
                    userId ? <Navigate to="/feed" /> : <Login onLoginSuccess={updateUserId} />
                } />

                <Route path="/profile" element={
                    userId ? <MyProfile /> : <Navigate to="/login" />
                } />

                <Route path="/feed" element={userId ? <Feed /> : <Navigate to="/login" />} />
                <Route path="/friends" element={userId ? <Friends /> : <Navigate to="/login" />} />
                <Route path="/wardrobe" element={userId ? <Wardrobe /> : <Navigate to="/login" />} />
                <Route path="/store" element={userId ? <Store /> : <Navigate to="/login" />} />
                <Route path="/outfit-builder" element={userId ? <OutfitBuilder /> : <Navigate to="/login" />} />
                <Route path="/search" element={userId ? <Search /> : <Navigate to="/login" />} />

                <Route path="*" element={<Navigate to={userId ? "/feed" : "/login"} />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;