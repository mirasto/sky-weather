import { useEffect, useRef, useState, memo } from 'react';
import { motion } from 'framer-motion';
import { Map } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useAppSelector } from '@/store/hooks';
import { selectCoordinates } from '@/store/slices/locationSlice';
import { Card, CardHeader } from '@/components/ui';
import { getWeatherMapTileUrl } from '@/services/api/weatherApi';
import { API_CONFIG } from '@/utils/constants';

export const PrecipitationMap = memo(function PrecipitationMap() {
    const { t } = useTranslation();
    const coordinates = useAppSelector(selectCoordinates);
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);
    const markerRef = useRef<L.Marker | null>(null);
    const [mapId] = useState(() => `map-${Math.random().toString(36).slice(2)}`);

    useEffect(() => {
        if (!mapContainerRef.current) return;

        if (mapInstanceRef.current) {
            mapInstanceRef.current.setView([coordinates.lat, coordinates.lng], 6);
            if (markerRef.current) {
                markerRef.current.setLatLng([coordinates.lat, coordinates.lng]);
            }
            return;
        }

        const initTimer = setTimeout(() => {
            if (!mapContainerRef.current || mapInstanceRef.current) return;

            try {

                const map = L.map(mapContainerRef.current, {
                    center: [coordinates.lat, coordinates.lng],
                    zoom: 6,
                    zoomControl: true,
                    scrollWheelZoom: true,
                    doubleClickZoom: true,
                    touchZoom: true,
                    boxZoom: true,
                    keyboard: true,
                    dragging: true
                });

                map.zoomControl.setPosition('topright');

                L.tileLayer(API_CONFIG.STADIA_TILES_URL, {
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                }).addTo(map);

                L.tileLayer(getWeatherMapTileUrl('precipitation'), {
                    opacity: 0.6,
                    attribution: ''
                }).addTo(map);

                const marker = L.marker([coordinates.lat, coordinates.lng], {
                    icon: L.divIcon({
                        className: 'custom-marker',
                        html: '<div style="width:20px;height:20px;background:#6366f1;border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.4);"></div>',
                        iconSize: [20, 20],
                        iconAnchor: [10, 10]
                    })
                }).addTo(map);

                mapInstanceRef.current = map;
                markerRef.current = marker;
            } catch (error) {
                console.warn('Map initialization error:', error);
            }
        }, 100);

        return () => {
            clearTimeout(initTimer);
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
                markerRef.current = null;
            }
        };
    }, []);

    useEffect(() => {
        if (mapInstanceRef.current) {
            mapInstanceRef.current.setView([coordinates.lat, coordinates.lng], 6, {
                animate: true,
                duration: 0.5
            });
            if (markerRef.current) {
                markerRef.current.setLatLng([coordinates.lat, coordinates.lng]);
            }
        }
    }, [coordinates.lat, coordinates.lng]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
        >
            <Card className="overflow-hidden" padding="none">
                <div className="p-4 pb-2">
                    <CardHeader
                        title={t('map.precipitation')}
                        icon={<Map className="w-4 h-4" />}
                    />
                </div>

                <div
                    id={mapId}
                    ref={mapContainerRef}
                    className="w-full h-80 sm:h-96 md:h-[28rem] rounded-b-2xl overflow-hidden dark:hue-rotate-180 dark:invert"
                    role="application"
                    aria-label="Interactive weather map"
                />
            </Card>
        </motion.div>
    );
});

export default PrecipitationMap;
