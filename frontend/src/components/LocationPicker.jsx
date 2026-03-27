import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({ // --> Iconos de leaflet para el mapa
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function ClickHandler({setLatitude, setLongitude }) {
    useMapEvents({
        click(e) {
                setLatitude(e.latlng.lat);  // --> Asigno a los atributos de user su correspondiente
                setLongitude(e.latlng.lng);
        },
    });
    return null;
}

export default function LocationPicker({ latitude, longitude, setLatitude, setLongitude}) {
    // --> Componente para profile
    const initialPos = [-34.45, -58.91];
    return (
        <div style={{ height: '300px', width: '100%', marginTop: '10px' }}>
            <MapContainer
                center={[latitude || initialPos[0], longitude || initialPos[1]]}
                zoom={13}
                style={{ height: '100%', width: '100%', borderRadius: '8px' }}
            >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <ClickHandler setLatitude={setLatitude} setLongitude={setLongitude}/>
                {latitude && longitude && (
                    <Marker position={[latitude, longitude]} />
                )}
            </MapContainer>
        </div>
    );
}