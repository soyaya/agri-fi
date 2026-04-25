'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';

type MilestoneType = 'farm' | 'warehouse' | 'port' | 'importer';

interface Milestone {
  id: string;
  milestone: MilestoneType;
  recordedAt: string;
  latitude: number | null;
  longitude: number | null;
}

interface ShipmentMapProps {
  tradeDealId: string;
  className?: string;
}

export const ShipmentMap: React.FC<ShipmentMapProps> = ({
  tradeDealId,
  className = '',
}) => {
  const mapDivRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const layerRef = useRef<any>(null);

  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const points = useMemo(
    () =>
      milestones
        .filter((m) => typeof m.latitude === 'number' && typeof m.longitude === 'number')
        .map((m) => ({ ...m, lat: m.latitude as number, lng: m.longitude as number })),
    [milestones],
  );

  const fetchMilestones = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('auth_token');
      if (!token) throw new Error('Authentication required');

      const res = await fetch(`/api/shipments/${tradeDealId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Failed to fetch milestones');

      const raw = await res.json();
      const normalized: Milestone[] = (raw ?? []).map((m: any) => ({
        id: m.id,
        milestone: m.milestone,
        recordedAt: m.recordedAt ?? m.recorded_at,
        latitude:
          typeof m.latitude === 'number'
            ? m.latitude
            : m.latitude
              ? Number(m.latitude)
              : null,
        longitude:
          typeof m.longitude === 'number'
            ? m.longitude
            : m.longitude
              ? Number(m.longitude)
              : null,
      }));

      setMilestones(normalized);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load map');
    } finally {
      setLoading(false);
    }
  }, [tradeDealId]);

  useEffect(() => {
    fetchMilestones();
  }, [fetchMilestones]);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      if (!mapDivRef.current) return;

      const L = await import('leaflet');
      if (!isMounted) return;

      if (!mapRef.current) {
        mapRef.current = L.map(mapDivRef.current, {
          zoomControl: true,
          attributionControl: true,
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors',
        }).addTo(mapRef.current);
      }

      if (layerRef.current) {
        layerRef.current.remove();
      }

      layerRef.current = L.layerGroup().addTo(mapRef.current);

      if (points.length === 0) {
        mapRef.current.setView([0, 0], 2);
        return;
      }

      const latlngs = points.map((p) => [p.lat, p.lng] as [number, number]);
      const bounds = L.latLngBounds(latlngs);

      points.forEach((p) => {
        L.circleMarker([p.lat, p.lng], {
          radius: 7,
          color: '#16a34a',
          weight: 2,
          fillColor: '#22c55e',
          fillOpacity: 0.85,
        })
          .bindPopup(`${p.milestone.toUpperCase()}`)
          .addTo(layerRef.current);
      });

      if (latlngs.length >= 2) {
        L.polyline(latlngs, { color: '#2563eb', weight: 3, opacity: 0.85 }).addTo(
          layerRef.current,
        );
      }

      mapRef.current.fitBounds(bounds.pad(0.2));
    })();

    return () => {
      isMounted = false;
    };
  }, [points]);

  if (loading) {
    return (
      <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-6 ${className}`}>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Shipment Map</h3>
        <p className="text-sm text-gray-400 animate-pulse">Loading map…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}>
        <p className="text-red-800 text-sm">{error}</p>
        <button
          onClick={fetchMilestones}
          className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-6 ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold text-gray-900">Shipment Map</h3>
        <button
          onClick={fetchMilestones}
          className="text-xs text-gray-500 hover:text-gray-700 underline"
        >
          Refresh
        </button>
      </div>

      {points.length === 0 ? (
        <div className="text-sm text-gray-500">
          No milestone coordinates recorded yet.
        </div>
      ) : (
        <div ref={mapDivRef} className="h-72 w-full rounded-xl overflow-hidden" />
      )}
    </div>
  );
};

