import {useNavigate} from "react-router-dom";
import {useState} from "react";

function SignUp() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [last_name, setLastName] = useState('');

    const navigate = useNavigate();

    const manageEntry = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch("http://localhost:8080/usuarios/signup", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    username: username,
                    email: email,
                    password: password,
                    name: name,
                    lastName: last_name,

                })
            });

            if (response.ok) {
                alert("La cuenta fue creada exitosamente");
                navigate("/login");
            } else if (response.status === 409) {
                const errorMessage = await response.text();
                alert(errorMessage)
            }else if (response.status === 400) {
                const errorMessage = await response.text();
                alert(errorMessage);}
            else {
                alert("Sucedio un error inesperado");
            }
        } catch (error) {
            console.error("Error al conectar con el servidor:", error);
            alert("Parece que el servidor de Java está apagado.");
        }
    };

    return (
        <form onSubmit={manageEntry}>
            <h2>Registrarse en Opet</h2>

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
                    type = "lastName"
                    value = {last_name}
                    onChange = {(e) => setLastName(e.target.value)}
                />
            </div>

            <button type="submit">Entrar</button>
        </form>
    );
}

export default SignUp;
