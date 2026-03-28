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
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    username: username,
                    email: email,
                    password: password,
                    name: name,
                    lastName: last_name,
                    latitude: latitude,
                    longitude: longitude
                })
            });

            if (response.ok) {
                alert("La cuenta fue creada exitosamente");
                navigate("/login");
            } else if (response.status === 409) {
                const errorMessage = await response.text();
                alert(errorMessage)
            } else if (response.status === 400) {
                const errorMessage = await response.text();
                alert(errorMessage);
            } else {
                alert("Sucedio un error inesperado");
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

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f5f0e8] p-8">
            <div className="bg-white rounded-[20px] p-10 w-full max-w-3xl"> {/*recuadro para poner los datos}

                {/* Header con logo */}
                <div className="flex items-center gap-4 mb-8 pb-6 border-b border-[#f0ebe0]">
                    <img src="/opet_grey_and_cream.png" className="w-12 h-12 rounded-xl object-contain"/>
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 m-0">Crear cuenta en Opet</h2>
                        <p className="text-sm text-gray-400 m-0">Completá tus datos para registrarte</p>
                    </div>
                </div>

                <form onSubmit={manageEntry}>
                    <div className="grid grid-cols-2 gap-8">

                        {/* Columna izquierda — campos */}
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-1">
                                <label
                                    className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Usuario</label>
                                <input type="text" placeholder="ej: juan_perez" value={username}
                                       onChange={(e) => setUsername(e.target.value)}
                                       className="w-full border-[1.5px] border-[#e8e2d9] rounded-xl px-4 py-3 text-sm bg-[#fdfaf6] outline-none focus:border-[#e07070]"/>
                            </div>

                            <div className="flex flex-col gap-1">
                                <label
                                    className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Email</label>
                                <input type="email" placeholder="correo@ejemplo.com" value={email}
                                       onChange={(e) => setEmail(e.target.value)}
                                       className="w-full border-[1.5px] border-[#e8e2d9] rounded-xl px-4 py-3 text-sm bg-[#fdfaf6] outline-none focus:border-[#e07070]"/>
                            </div>

                            <div className="flex flex-col gap-1">
                                <label
                                    className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Contraseña</label>
                                <input type="password" placeholder="••••••••" value={password}
                                       onChange={(e) => setPassword(e.target.value)}
                                       className="w-full border-[1.5px] border-[#e8e2d9] rounded-xl px-4 py-3 text-sm bg-[#fdfaf6] outline-none focus:border-[#e07070]"/>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="flex flex-col gap-1">
                                    <label
                                        className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Nombre</label>
                                    <input type="text" placeholder="Juan" value={name}
                                           onChange={(e) => setName(e.target.value)}
                                           className="w-full border-[1.5px] border-[#e8e2d9] rounded-xl px-4 py-3 text-sm bg-[#fdfaf6] outline-none focus:border-[#e07070]"/>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label
                                        className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Apellido</label>
                                    <input type="text" placeholder="Pérez" value={last_name}
                                           onChange={(e) => setLastName(e.target.value)}
                                           className="w-full border-[1.5px] border-[#e8e2d9] rounded-xl px-4 py-3 text-sm bg-[#fdfaf6] outline-none focus:border-[#e07070]"/>
                                </div>
                            </div>
                        </div>

                        {/* Columna derecha — mapa */}
                        <div className="flex flex-col gap-2">
                            <label
                                className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Ubicación</label>
                            <button type="button" onClick={detectUbi}
                                    className="flex items-center gap-2 px-4 py-2 border-[1.5px] border-[#e8e2d9] rounded-xl text-sm font-semibold text-gray-500 bg-[#fdfaf6] hover:border-[#e07070] hover:text-[#e07070] transition w-fit">
                                <span className="w-2 h-2 rounded-full bg-[#e07070] inline-block"></span>
                                Usar mi ubicación actual
                            </button>
                            <p className="text-xs text-gray-300 mt-0 mb-1">O hacé clic en el mapa para elegir</p>

                            {/* Mapa contenido en recuadro */}
                            <div
                                className="border-[1.5px] border-[#e8e2d9] rounded-[14px] overflow-hidden flex-1 min-h-[220px]">
                                <LocationPicker
                                    latitude={latitude}
                                    longitude={longitude}
                                    setLatitude={setLatitude}
                                    setLongitude={setLongitude}
                                />
                            </div>
                        </div>
                    </div>

                    <button type="submit"
                            className="w-full mt-6 py-3 bg-[#e07070] hover:bg-[#c0392b] text-white font-bold rounded-xl transition text-base">
                        Registrarse
                    </button>

                    <p className="text-center text-xs text-gray-400 mt-3">
                        ¿Ya tenés cuenta? <a href="/login" className="text-[#e07070] font-semibold">Iniciá sesión</a>
                    </p>
                </form>
            </div>
        </div>
    );

}
export default SignUp;
