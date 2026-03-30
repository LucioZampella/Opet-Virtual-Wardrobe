// aca un nuevo usuario podra logearse a su cuenta

import {useNavigate} from "react-router-dom"; // --> Herramienta que oculta/muestra clips al instante sin hacer todo de nuevo
import {useState} from "react"; // --> Recuerda lo que el usuario va tecleando

function Login({onLoginSuccess}) {

    const [email, setEmail] = useState('');       //--> Variable email y funcion setEmail para modificarla
    const [password, setPassword] = useState(''); //--> Variable password y funcion setPassword para modificarla

    const navigate = useNavigate();

    const manageEntry = async (event) => {
        event.preventDefault(); //--> Esto para evitar que pegue pantallazo en blanco

        try {
            const response = await fetch("http://localhost:8080/usuarios/login", {
                method: "POST",
                headers: {"Content-Type": "application/json"}, //--> Le avisa a Java que se manda un JSON
                body: JSON.stringify({ email, password })
            });

            if (response.ok) {
                const userLogged = await response.json();
                localStorage.setItem("userId", userLogged.id); //--> Guarda el id del usuario en el navegador
                onLoginSuccess();
                navigate("/profile"); //--> Redirige al perfil si el login fue exitoso
            } else {
                alert("Email o contraseña incorrectos.");
            }
        } catch (error) {
            console.error("Error al conectar con el servidor:", error);
            alert("Parece que el servidor de Java está apagado.");
        }
    };

    const inputClass = `
        w-full bg-transparent border-b border-[#4a4540]
        text-[#e8d5b0] placeholder-[#6b6258]
        py-3 px-0 text-sm tracking-wide
        outline-none focus:border-[#c49a6c]
        transition-colors duration-300
    `;

    const labelClass = "text-[10px] font-semibold tracking-[0.2em] uppercase text-[#8a7d6e] mb-2 block";

    return (
        // min-h-screen → ocupa toda la pantalla | flex items-center justify-center → centra todo
        // bg-[#2a2622] → gris carbon oscuro del logo
        <div className="min-h-screen flex items-center justify-center bg-[#2a2622]">

            <div className="w-full max-w-sm px-8 flex flex-col items-center">

                {/* Logo centrado arriba */}
                <img src = "/opet_cream.png" />

                {/* Titulo y linea decorativa dorada */}
                <div className="w-full mb-10 text-center">
                    <p className="text-[#6b6258] text-[10px] tracking-[0.3em] uppercase mb-2">Virtual Wardrobe</p>
                    <h2 className="text-[#e8d5b0] text-2xl font-light tracking-widest mb-3">Bienvenido</h2>
                    <div className="w-8 h-px bg-[#c49a6c] mx-auto"></div> {/* linea dorada decorativa */}
                </div>

                <form onSubmit={manageEntry} className="w-full flex flex-col gap-8">

                    <div>
                        <label className={labelClass}>Email</label>
                        <input
                            type="email"
                            placeholder="correo@ejemplo.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={inputClass} // --> solo linea inferior, sin caja, mas elegante
                        />
                    </div>

                    <div>
                        <label className={labelClass}>Contraseña</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={inputClass}
                        />
                    </div>

                    {/* Botonoides */}
                    <div className="flex flex-col items-center gap-4 mt-2">

                        {/* Boton principal - fondo dorado solido */}
                        <button
                            type="submit"
                            className="
                                w-full py-4
                                bg-[#c49a6c] hover:bg-[#e8d5b0]
                                text-[#221f1c] text-xs font-semibold
                                tracking-[0.25em] uppercase
                                transition-all duration-300
                            "
                        >
                            Iniciar sesión
                        </button>

                        {/* Divisor */}
                        <div className="flex items-center gap-3 w-full">
                            <div className="flex-1 h-px bg-[#3a3530]"></div>
                            <span className="text-[#4a4540] text-[10px] tracking-widest uppercase">o</span>
                            <div className="flex-1 h-px bg-[#3a3530]"></div>
                        </div>

                        {/* Boton que lleva al signup */}
                        <button
                            type="button"
                            onClick={() => navigate("/signup")}
                            className="
                                w-full py-4
                                bg-transparent border border-[#4a4540]
                                hover:border-[#c49a6c] hover:text-[#c49a6c]
                                text-[#6b6258] text-xs font-semibold
                                tracking-[0.25em] uppercase
                                transition-all duration-300
                            "
                        >
                            Crear cuenta
                        </button>
                    </div>
                </form>

                {/* Footer minimalista marca registrada rey */}
                <p className="text-[#3a3530] text-[10px] tracking-widest uppercase mt-12">
                    Opet © 2026
                </p>
            </div>
        </div>
    );
}

export default Login;