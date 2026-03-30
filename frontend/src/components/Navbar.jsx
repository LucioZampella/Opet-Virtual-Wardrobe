// Barra superior reutilizable con el logo de Opet centrado


function Navbar() {
    return (
        // Barra fija arriba de todo, con sombra sutil hacia abajo
        // backdrop-blur → efecto de vidrio esmerilado si hay contenido debajo
        <div className="
            fixed top-0 left-0 right-0 z-50
            bg-[#221f1c] border-b border-[#3a3530]
            shadow-[0_4px_24px_rgba(0,0,0,0.4)]
            flex items-center justify-center
            h-14
        ">
            <img
                src="/opet_cream.png"
                className="h-20 object-contain opacity-90"
                alt="Opet"
            />
        </div>
    );
}

export default Navbar;