// aca un nuevo usuario podra crearse un perfil

import {useNavigate} from "react-router-dom"; // --> Herramienta que oculta/muestra clips al instante sin hacer todo de nuevo
import {useState} from "react"; // --> Recuerda lo que el usuario va tecleando

function Login() {

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState(''); //--> Variable email y funcion setEmail para modificarla
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');

    const navigate = useNavigate()

    const manageEntry = async (event) => {
        event.preventDefault(); //--> Esto para evitar que pegue pantallazo en blanco

        try {
            const response = await fetch("http://localhost:8080/usuarios/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" }, //--> Le avisa a Java que se manda un JSON
                body: JSON.stringify({
                    username: username,
                    email: email,
                    password: password,
                    name: name,
                    surname: surname,
                })
            });

            if (response.ok) {
                const userLogged = await response.json();
                console.log("Login Exitoso", userLogged);

                localStorage.setItem("userId", userLogged.id); //--> Guarda el id en el navegador

                navigate('/perfil');
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
                <label>Username: </label>
                <input
                    type = "username"
                    value = {username}
                    onChange = {(e) => setUsername(e.target.value)}
                    />
            </div>

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

            <div>
                <label>Name: </label>
                <input
                    type = "name"
                    value = {name}
                    onChange = {(e) => setName(e.target.value)}
                />
            </div>

            <div>
                <label>Surname: </label>
                <input
                    type = "surname"
                    value = {surname}
                    onChange = {(e) => setSurname(e.target.value)}
                />
            </div>

            <button type="submit">Entrar</button>
        </form>
    );
}

export default Login;