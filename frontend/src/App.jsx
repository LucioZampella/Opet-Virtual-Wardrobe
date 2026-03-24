// App.jsx
// El que me da las rutas para saber a donde tengo que ir en cada paso
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login      from "./pages/Login.jsx";
import MyProfile  from "./pages/myProfile.jsx";
import UserList   from "./pages/userList.jsx";
import Navbar     from "./components/Navbar.jsx";

function App() {
    const userId = localStorage.getItem("userId");

    return (
        <BrowserRouter>
            {userId && <Navbar />}
            <Routes>
                <Route path="/login"   element={<Login />} />
                <Route path="/profile" element={userId ? <MyProfile />  : <Navigate to="/login" />} />
                <Route path="/usuarios"   element={userId ? <UserList />   : <Navigate to="/login" />} />
                <Route path="*"        element={<Navigate to={userId ? "/profile" : "/login"} />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;