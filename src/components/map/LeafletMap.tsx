import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Endereco } from '../../types';

interface LeafletMapProps {
  enderecos: Endereco[];
  center?: [number, number];
  zoom?: number;
  onMapClick?: (lat: number, lng: number) => void;
  onSelectEndereco?: (endereco: Endereco) => void;
  onRegistrarVisita?: (endereco: Endereco) => void;
  interactive?: boolean;
  height?: string;
}

export const LeafletMap: React.FC<LeafletMapProps> = ({
  enderecos,
  center,
  zoom = 15,
  onMapClick,
  onSelectEndereco,
  onRegistrarVisita,
  interactive = true,
  height = '420px',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const defaultCenter: [number, number] = center ||
      (enderecos.length > 0
        ? [enderecos[0].latitude, enderecos[0].longitude]
        : [-23.5505, -46.6333]);

    const map = L.map(mapContainerRef.current, {
      center: defaultCenter,
      zoom: zoom,
      zoomControl: true,
      attributionControl: false,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors',
    }).addTo(map);

    const markersLayer = L.layerGroup().addTo(map);
    markersLayerRef.current = markersLayer;
    mapInstanceRef.current = map;

    if (onMapClick) {
      map.on('click', (e: L.LeafletMouseEvent) => {
        onMapClick(e.latlng.lat, e.latlng.lng);
      });
    }

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update center if changed
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    if (center) {
      mapInstanceRef.current.setView(center, zoom);
    } else if (enderecos.length > 0) {
      const bounds = L.latLngBounds(
        enderecos.map((e) => [e.latitude, e.longitude])
      );
      if (bounds.isValid()) {
        mapInstanceRef.current.fitBounds(bounds, { padding: [35, 35], maxZoom: 16 });
      }
    }
  }, [center, zoom, enderecos.length]);

  // Update Markers
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();

    enderecos.forEach((end) => {
      // Determine color based on confirmation & visit outcome
      let bgClass = 'bg-amber-500 text-white';
      let borderClass = 'border-amber-600';
      let iconSymbol = '●';

      if (end.status === 'visitado') {
        if (end.ultimo_resultado === 'estudo_biblico') {
          bgClass = 'bg-purple-600 text-white';
          borderClass = 'border-purple-700';
          iconSymbol = '📖';
        } else if (end.ultimo_resultado === 'revisita') {
          bgClass = 'bg-indigo-600 text-white';
          borderClass = 'border-indigo-700';
          iconSymbol = '↻';
        } else if (end.ultimo_resultado === 'morador_ausente') {
          bgClass = 'bg-slate-500 text-white';
          borderClass = 'border-slate-600';
          iconSymbol = '✕';
        } else if (end.ultimo_resultado === 'mudou_se') {
          bgClass = 'bg-rose-600 text-white';
          borderClass = 'border-rose-700';
          iconSymbol = '↗';
        } else {
          bgClass = 'bg-emerald-600 text-white';
          borderClass = 'border-emerald-700';
          iconSymbol = '✓';
        }
      } else if (end.endereco_confirmado) {
        bgClass = 'bg-emerald-500 text-white';
        borderClass = 'border-emerald-600';
        iconSymbol = '★';
      }

      const customIcon = L.divIcon({
        className: 'custom-leaflet-marker',
        html: `
          <div class="relative flex items-center justify-center">
            <div class="w-8 h-8 rounded-full shadow-lg flex items-center justify-center font-bold text-xs border-2 ${bgClass} ${borderClass} transform -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-110">
              ${iconSymbol}
            </div>
          </div>
        `,
        iconSize: [0, 0],
        iconAnchor: [0, 0],
      });

      const marker = L.marker([end.latitude, end.longitude], { icon: customIcon });

      const mapsNavUrl = `https://www.google.com/maps/dir/?api=1&destination=${end.latitude},${end.longitude}`;

      const popupContent = document.createElement('div');
      popupContent.className = 'p-1 text-slate-800 text-xs min-w-[210px]';
      popupContent.innerHTML = `
        <div class="font-bold text-sm text-slate-900 mb-0.5">${end.rua}, ${end.numero}</div>
        ${end.complemento ? `<div class="text-slate-500 text-xs mb-1">${end.complemento}</div>` : ''}
        <div class="text-slate-600 text-xs">${end.bairro} · ${end.territorio_nome || 'Território'}</div>
        
        <div class="mt-2 flex items-center gap-1.5">
          <span class="px-1.5 py-0.5 rounded text-[11px] font-semibold ${
            end.status === 'visitado'
              ? 'bg-blue-100 text-blue-800'
              : 'bg-amber-100 text-amber-800'
          }">
            ${end.status === 'visitado' ? 'Visitado' : 'Pendente'}
          </span>
          <span class="px-1.5 py-0.5 rounded text-[11px] font-medium ${
            end.endereco_confirmado
              ? 'bg-emerald-100 text-emerald-800'
              : 'bg-slate-100 text-slate-700'
          }">
            ${end.endereco_confirmado ? 'Confirmado' : 'Não confirmado'}
          </span>
        </div>

        ${
          end.observacoes
            ? `<div class="mt-2 text-[11px] text-slate-600 bg-slate-50 p-1.5 rounded border border-slate-200">
                ${end.observacoes}
              </div>`
            : ''
        }

        <div class="mt-3 pt-2 border-t border-slate-200 flex items-center gap-2">
          <a href="${mapsNavUrl}" target="_blank" rel="noopener noreferrer" 
             class="flex-1 text-center py-1 px-2 rounded bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-medium text-xs">
            Navegar ↗
          </a>
          <button id="btn-popup-visita-${end.id}" 
                  class="flex-1 text-center py-1 px-2 rounded bg-indigo-600 text-white hover:bg-indigo-700 font-medium text-xs">
            Visitar
          </button>
        </div>
      `;

      marker.bindPopup(popupContent);

      marker.on('popupopen', () => {
        const btnVisita = document.getElementById(`btn-popup-visita-${end.id}`);
        if (btnVisita && onRegistrarVisita) {
          btnVisita.onclick = () => {
            onRegistrarVisita(end);
            marker.closePopup();
          };
        }
      });

      marker.on('click', () => {
        if (onSelectEndereco) {
          onSelectEndereco(end);
        }
      });

      markersLayerRef.current?.addLayer(marker);
    });
  }, [enderecos, onRegistrarVisita, onSelectEndereco]);

  return (
    <div className="relative w-full rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-slate-100">
      <div ref={mapContainerRef} style={{ height }} className="w-full z-0" />
      {interactive && onMapClick && (
        <div className="absolute bottom-2 left-2 z-10 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-md text-[11px] font-medium text-slate-600 shadow-xs border border-slate-200 pointer-events-none">
          Dica: clique no mapa para adicionar um endereço
        </div>
      )}
    </div>
  );
};
