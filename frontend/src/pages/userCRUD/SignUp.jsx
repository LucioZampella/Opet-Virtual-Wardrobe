import {useNavigate} from "react-router-dom";
import {useState} from "react";
import LocationPicker from "../../components/LocationPicker.jsx";

function SignUp() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [last_name, setLastName] = useState('');
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);

    const navigate = useNavigate();

    const manageEntry = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch("http://localhost:8080/usuarios/signup", {
                method: "POST",
                headers: {"Content-Type": "application/json"}, //--> Le avisa a Java que se manda un JSON
                body: JSON.stringify({
                    username,
                    email,
                    password,
                    name,
                    lastName: last_name,
                    latitude,
                    longitude
                })
            });

            if (response.ok) {
                alert("La cuenta fue creada exitosamente");
                navigate("/login"); //--> Si se registro bien, lo manda al login
            } else if (response.status === 409 || response.status === 400) {
                const errorMessage = await response.text();
                alert(errorMessage); //--> Muestra el error que tiro Java (email duplicado, etc)
            } else {
                alert("Sucedió un error inesperado");
            }
        } catch (error) {
            console.error("Error al conectar con el servidor:", error);
            alert("Parece que el servidor de Java está apagado.");
        }
    };

    const detectUbi = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((pos) => {
                setLatitude(pos.coords.latitude);
                setLongitude(pos.coords.longitude); //--> Si es posible geolocalizar al usuario,
                // obtengo su ubicacion actual y asigno las coords a la db
            });
        } else {
            alert("Tu navegador no soporta geolocalización");
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
        <div className="min-h-screen flex bg-[#2a2622]">

            {/* Panel izquierdo */}
            <div className="hidden lg:flex lg:w-5/12 flex-col justify-between p-12 bg-[#221f1c] border-r border-[#3a3530]">
                <div>
                    <img src="/opet_cream.png" />
                </div>

                <div>
                    <p className="text-[#4a4540] text-xs tracking-[0.3em] uppercase mb-6">Opet Virtual Wardrobe</p>
                    <h1 className="text-[#e8d5b0] text-4xl font-light tracking-wider leading-tight mb-4">
                        Tu armario,<br/>
                        <span className="text-[#c49a6c]">pero virtual.</span>
                    </h1>
                    <p className="text-[#6b6258] text-sm leading-relaxed tracking-wide max-w-xs">
                        ¡Organizá tu ropa, probate ropa nueva y compartí con tus amigos tus mejores outfits!.
                    </p>
                </div>

                <div className="flex gap-2">
                    <div className="w-8 h-px bg-[#c49a6c]"></div>
                    <div className="w-2 h-px bg-[#4a4540]"></div>
                    <div className="w-2 h-px bg-[#4a4540]"></div>
                </div>
            </div>

            {/* formulario */}
            <div className="flex-1 flex items-center justify-center p-8 lg:p-16">
                <div className="w-full max-w-2xl">

                    {/* Header mobile */}
                    <div className="lg:hidden mb-10 flex items-center gap-4">
                        <img src="/opet_cream_and_grey.png" className="w-10 object-contain"/>
                        <span className="text-[#e8d5b0] text-sm tracking-[0.2em] uppercase font-light">Opet</span>
                    </div>

                    <p className="text-[#6b6258] text-[10px] tracking-[0.3em] uppercase mb-2">Paso 1 de 1</p>
                    <h2 className="text-[#e8d5b0] text-2xl font-light tracking-widest mb-1">Crear cuenta</h2>
                    <div className="w-8 h-px bg-[#c49a6c] mb-10"></div>

                    <form onSubmit={manageEntry}>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-8">

                            {/* Columna izquierda */}
                            <div className="flex flex-col gap-8">

                                <div>
                                    <label className={labelClass}>Usuario</label>
                                    <input
                                        type="text"
                                        placeholder="ej: juan_perez"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className={inputClass}
                                    />
                                </div>

                                <div>
                                    <label className={labelClass}>Email</label>
                                    <input
                                        type="email"
                                        placeholder="correo@ejemplo.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className={inputClass}
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

                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className={labelClass}>Nombre</label>
                                        <input
                                            type="text"
                                            placeholder="Juan"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className={inputClass}
                                        />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Apellido</label>
                                        <input
                                            type="text"
                                            placeholder="Pérez"
                                            value={last_name}
                                            onChange={(e) => setLastName(e.target.value)}
                                            className={inputClass}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* mapa */}
                            <div className="flex flex-col gap-4">
                                <div>
                                    <label className={labelClass}>Ubicación</label>
                                    <button
                                        type="button"
                                        onClick={detectUbi}
                                        className="
                                            flex items-center gap-3 text-[#c49a6c]
                                            text-xs tracking-[0.15em] uppercase
                                            hover:text-[#e8d5b0] transition-colors duration-300
                                            py-2 mb-4
                                        "
                                    >
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#c49a6c] flex-shrink-0"></span>
                                        Usar mi ubicación actual
                                    </button>
                                    <p className="text-[#4a4540] text-[10px] tracking-wide mb-3">
                                        O hacé clic en el mapa para elegir
                                    </p>
                                </div>

                                <div className="border border-[#3a3530] rounded-sm overflow-hidden flex-1 min-h-[200px] opacity-90">
                                    <LocationPicker
                                        latitude={latitude}
                                        longitude={longitude}
                                        setLatitude={setLatitude}
                                        setLongitude={setLongitude}
                                    />
                                </div>

                                {latitude && longitude && (
                                    <p className="text-[#c49a6c] text-[10px] tracking-[0.15em]">
                                        ✓ Ubicación seleccionada
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Botón */}
                        <div className="mt-12 flex flex-col items-start gap-6">
                            <button
                                type="submit"
                                className="
                                    group relative px-12 py-4
                                    bg-[#c49a6c] hover:bg-[#d4aa7c]
                                    text-[#221f1c] text-xs font-semibold
                                    tracking-[0.25em] uppercase
                                    transition-all duration-300
                                    overflow-hidden
                                "
                            >
                                <span className="relative z-10">Crear cuenta</span>
                                <div className="
                                    absolute inset-0 bg-[#e8d5b0]
                                    translate-x-[-100%] group-hover:translate-x-0
                                    transition-transform duration-300
                                "></div>
                            </button>

                            <p className="text-[#4a4540] text-xs tracking-wide">
                                ¿Ya tenés cuenta?{" "}
                                <a
                                    href="/login"
                                    className="text-[#c49a6c] hover:text-[#e8d5b0] transition-colors duration-300 tracking-widest uppercase text-[10px]"
                                >
                                    Iniciá sesión
                                </a>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default SignUp;