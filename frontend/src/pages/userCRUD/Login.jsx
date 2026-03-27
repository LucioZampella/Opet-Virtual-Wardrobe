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
        // h-screen → ocupa toda la pantalla
        // lo mando todo al medio
        // bg - [color] no me acuerdco cuadl habiamos puesto pero no es el que esta
        <div className="h-screen flex items-center justify-center bg-[#f5f0e8]">

            {/* w-96 → ancho fijo, p-8 → padding interno, rounded-xl → bordes redondeados */}
            <div className="w-96 p-8 flex flex-col items-center gap-4">

                <div className="text-4xl font-bold text-[#c0392b] mb-4">
                    <img src="/opet_grey_and_cream.png" className="w-32 mb-4"/>
                    {/*NO PUEDO PONER EL LOGO NO SE QUE CHOTA HAGO MAL*/}
                </div>

                <form onSubmit={manageEntry} className="w-full flex flex-col gap-4">

                    {/* border rounded-lg → bordes redondeados  */}
                    <input
                        type="email"
                        placeholder="Ingresar email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg p-3 outline-none"
                    />

                    <input
                        type="password"
                        placeholder="Contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg p-3 outline-none"
                    />

                    {/* bg-[#e07070] → color rojo del botón, hover:bg-[#c0392b] → más oscuro al pasar el mouse */}
                    <button
                        type="submit"
                        className="w-full bg-[#e07070] hover:bg-[#c0392b] text-white font-semibold py-3 rounded-full transition"
                    >
                        Iniciar sesión
                    </button>

                    {/* Botón de registrarse */}
                    <button
                        type="button"
                        onClick={() => navigate("/signup")}
                        className="w-full bg-[#e07070] hover:bg-[#c0392b] text-white font-semibold py-3 rounded-full transition"
                    >
                        Registrarse
                    </button>

                </form>
            </div>
        </div>
    );
}

export default Login;