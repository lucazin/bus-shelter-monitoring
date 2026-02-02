import { useEffect, useState } from 'react';
import type { MutableRefObject } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { BusShelterData } from '@/data/mockData';
import { useTheme } from '@/context/ThemeContext';

interface BusMapProps {
  shelters: BusShelterData[];
  onMarkerClick: (shelter: BusShelterData) => void;
  mapRef?: MutableRefObject<L.Map | null>;
}

// Fix for default marker icon
const getMarkerIcon = (status: 'good' | 'warning' | 'critical') => {
  const colors = {
    good: '#22c55e',
    warning: '#eab308',
    critical: '#ef4444',
  };

  const svgIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="36" height="36">
      <defs>
        <filter id="shadow-${status}" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" flood-opacity="0.3"/>
        </filter>
      </defs>
      <path fill="${colors[status]}" filter="url(#shadow-${status})" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
      <circle cx="12" cy="9" r="3.5" fill="white"/>
      <circle cx="12" cy="9" r="2" fill="${colors[status]}"/>
    </svg>
  `;

  return L.divIcon({
    html: svgIcon,
    className: 'custom-marker-icon',
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
  });
};

function MapUpdater({ shelters }: { shelters: BusShelterData[] }) {
  const map = useMap();

  useEffect(() => {
    // Force map to recalculate size after render
    setTimeout(() => {
      map.invalidateSize();
    }, 100);

    if (shelters.length > 0) {
      const bounds = L.latLngBounds(
        shelters.map(s => [s.location.lat, s.location.lng])
      );
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [shelters, map]);

  return null;
}

// Component to expose map reference
function MapRefSetter({ mapRef }: { mapRef?: MutableRefObject<L.Map | null> }) {
  const map = useMap();
  
  useEffect(() => {
    if (mapRef) {
      mapRef.current = map;
    }
    return () => {
      if (mapRef) {
        mapRef.current = null;
      }
    };
  }, [map, mapRef]);

  return null;
}

export function BusMap({ shelters, onMarkerClick, mapRef }: BusMapProps) {
  const { theme } = useTheme();
  const [mapKey, setMapKey] = useState(0);

  // Force map re-render when theme changes
  useEffect(() => {
    setMapKey(prev => prev + 1);
  }, [theme]);

  const center: [number, number] = [33.0198, -96.6989];

  const tileUrl = theme === 'dark' 
    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";

  const bgColor = theme === 'dark' ? '#1e293b' : '#f1f5f9';

  return (
    <div className="absolute inset-0">
      <MapContainer
        key={mapKey}
        center={center}
        zoom={14}
        style={{ background: bgColor, width: '100%', height: '100%', borderRadius: '0.75rem' }}
      >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url={tileUrl}
      />
      <MapUpdater shelters={shelters} />
      <MapRefSetter mapRef={mapRef} />
      {shelters.map((shelter) => (
        <Marker
          key={shelter.id}
          position={[shelter.location.lat, shelter.location.lng]}
          icon={getMarkerIcon(shelter.status)}
          eventHandlers={{
            click: () => onMarkerClick(shelter),
          }}
        >
          <Popup>
            <div className="text-sm">
              <strong>{shelter.location.stopName}</strong>
              <br />
              <span className="text-xs">{shelter.location.address}</span>
              <br />
              <span className="text-xs">Click for details</span>
            </div>
          </Popup>
        </Marker>
      ))}
      </MapContainer>
    </div>
  );
}
