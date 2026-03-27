// aca un nuevo usuario podra logearse a su cuenta

import {useNavigate} from "react-router-dom"; // --> Herramienta que oculta/muestra clips al instante sin hacer todo de nuevo
import {useState} from "react"; // --> Recuerda lo que el usuario va tecleando

function Login({onLoginSuccess}) {

    const [email, setEmail] = useState(''); //--> Variable email y funcion setEmail para modificarla
    const [password, setPassword] = useState('');

    const navigate = useNavigate()

    const manageEntry = async (event) => {
        event.preventDefault(); //--> Esto para evitar que pegue pantallazo en blanco
        console.log("Email:", email);       // ← agregá esto
        console.log("Password:", password);

        try {
            const response = await fetch("http://localhost:8080/usuarios/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" }, //--> Le avisa a Java que se manda un JSON
                body: JSON.stringify({
                    email: email,
                    password: password,
                })
            });

            if (response.ok) {
                const userLogged = await response.json();
                localStorage.setItem("userId", userLogged.id);
                onLoginSuccess();
                navigate("/profile");
            } else {
                alert("Email o contraseña incorrectos.");
            }
        } catch (error) {
            console.error("Error al conectar con el servidor:", error);
            alert("Parece que el servidor de Java está apagado.");
        }
    };

    return (
        <form onSubmit={manageEntry}>
            <h2>Iniciar Sesión en Opet</h2>

            <div>
                <label>Email: </label>
                <input
                    type="email"
                    value={email} //--> El input muestra lo que hay en la memoria
                    onChange={(e) => setEmail(e.target.value)} //--> Cada vez que
                    // teclea, actualiza la memoria
                />
            </div>

            <div>
                <label>Contraseña: </label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            {/* --> agregue el boton para iniciar sesion y en el caso de no tener cuenta registrarte */}
            <button type="submit">Iniciar Sesión</button>
            <p>¿No tenés cuenta? <a href="/signup">Registrate</a></p>

        </form>
    );
}

export default Login;