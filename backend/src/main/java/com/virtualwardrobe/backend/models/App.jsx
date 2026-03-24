// App.jsx
// El que me da las rutas para saber a donde tengo que ir en cada paso
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login      from "../../../../../../../../frontend/src/pages/Login";
import MyProfile  from "../../../../../../../../frontend/src/pages/myProfile";
import UserList   from "../../../../../../../../frontend/src/pages/userList";
import Navbar     from "./components/Navbar";

function App() {
    const userId = localStorage.getItem("userId");

    return (
        <BrowserRouter>
            {userId && <Navbar />}
            <Routes>
                <Route path="/login"   element={<Login />} />
                <Route path="/profile" element={userId ? <MyProfile />  : <Navigate to="/login" />} />
                <Route path="/users"   element={userId ? <UserList />   : <Navigate to="/login" />} />
                <Route path="*"        element={<Navigate to={userId ? "/profile" : "/login"} />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;