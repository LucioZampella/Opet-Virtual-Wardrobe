// App.jsx
// El que me da las rutas para saber a donde tengo que ir en cada paso
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import {useState} from "react";
import Login      from "./pages/userCRUD/Login.jsx";
import MyProfile  from "./pages/userCRUD/myProfile.jsx";
import UserList   from "./pages/userList.jsx";
import Navbar     from "./components/Navbar.jsx";
import SignUp     from "./pages/userCRUD/SignUp.jsx";

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
                    userId ? <Navigate to="/profile" /> : <Login onLoginSuccess={updateUserId} />
                } />

                <Route path="/profile" element={
                    userId ? <MyProfile /> : <Navigate to="/login" />
                } />

                <Route path="*" element={<Navigate to={userId ? "/profile" : "/login"} />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;