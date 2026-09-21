import React, { useState, useMemo } from 'react';
import { LotItem, LotStatus, LotLocation } from '../types';
import {
  Search,
  Filter,
  X,
  RotateCcw,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Clock,
  XCircle,
  ArrowUpDown,
  Sparkles,
  Maximize2,
  DollarSign,
  Layers,
  MapPin,
  Check,
} from 'lucide-react';

export interface LotFilterState {
  searchTerm: string;
  status: 'todos' | LotStatus;
  location: 'todos' | LotLocation;
  areaMin: number | '';
  areaMax: number | '';
  priceMin: number | '';
  priceMax: number | '';
  sortBy: 'code' | 'price_asc' | 'price_desc' | 'area_asc' | 'area_desc';
}

export const initialFilterState: LotFilterState = {
  searchTerm: '',
  status: 'todos',
  location: 'todos',
  areaMin: '',
  areaMax: '',
  priceMin: '',
  priceMax: '',
  sortBy: 'code',
};

export interface MasterPlanAdvancedSearchProps {
  lots: LotItem[];
  filterState: LotFilterState;
  onFilterChange: (newState: LotFilterState) => void;
  filteredCount: number;
  totalCount: number;
}

export const MasterPlanAdvancedSearch: React.FC<MasterPlanAdvancedSearchProps> = ({
  lots,
  filterState,
  onFilterChange,
  filteredCount,
  totalCount,
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Status counts from current lot dataset
  const statusCounts = useMemo(() => {
    return {
      disponible: lots.filter((l) => l.status === 'disponible').length,
      reservado: lots.filter((l) => l.status === 'reservado').length,
      vendido: lots.filter((l) => l.status === 'vendido').length,
    };
  }, [lots]);

  // Check how many filters are active (excluding search term and default sort)
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filterState.status !== 'todos') count++;
    if (filterState.location !== 'todos') count++;
    if (filterState.areaMin !== '' || filterState.areaMax !== '') count++;
    if (filterState.priceMin !== '' || filterState.priceMax !== '') count++;
    if (filterState.sortBy !== 'code') count++;
    if (filterState.searchTerm.trim() !== '') count++;
    return count;
  }, [filterState]);

  // Reset all filters
  const handleReset = () => {
    onFilterChange(initialFilterState);
  };

  // Helper updates
  const updateFilter = <K extends keyof LotFilterState>(key: K, value: LotFilterState[K]) => {
    onFilterChange({
      ...filterState,
      [key]: value,
    });
  };

  // Area Presets
  const areaPresets: { label: string; min: number | ''; max: number | '' }[] = [
    { label: 'Todos', min: '', max: '' },
    { label: '< 800 m²', min: '', max: 800 },
    { label: '800 - 1.500 m²', min: 800, max: 1500 },
    { label: '1.500 - 2.500 m²', min: 1500, max: 2500 },
    { label: '> 2.500 m²', min: 2500, max: '' },
  ];

  const isAreaPresetActive = (min: number | '', max: number | '') => {
    return filterState.areaMin === min && filterState.areaMax === max;
  };

  // Price Presets
  const pricePresets: { label: string; min: number | ''; max: number | '' }[] = [
    { label: 'Todos', min: '', max: '' },
    { label: '< $15.000', min: '', max: 15000 },
    { label: '$15k - $25k', min: 15000, max: 25000 },
    { label: '$25k - $40k', min: 25000, max: 40000 },
    { label: '> $40.000', min: 40000, max: '' },
  ];

  const isPricePresetActive = (min: number | '', max: number | '') => {
    return filterState.priceMin === min && filterState.priceMax === max;
  };

  return (
    <div id="masterplan-advanced-search-container" className="space-y-3.5 my-6">
      {/* 1. MAIN SEARCH BAR + ACTION BUTTONS */}
      <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center">
        {/* Search input with icons */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            id="search-lots-input"
            type="text"
            value={filterState.searchTerm}
            onChange={(e) => updateFilter('searchTerm', e.target.value)}
            placeholder="Buscar por código de lote (ej. A1-01, B2), manzana, m² o precio..."
            className="w-full pl-10 pr-10 py-2.5 text-sm bg-stone-50 hover:bg-white border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-colors"
          />
          {filterState.searchTerm && (
            <button
              type="button"
              onClick={() => updateFilter('searchTerm', '')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-1"
              title="Borrar búsqueda"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Action button: FILTROS AVANZADOS */}
        <div className="flex items-center gap-2">
          <button
            id="btn-toggle-advanced-filters"
            type="button"
            onClick={() => setIsDrawerOpen(!isDrawerOpen)}
            className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all border shadow-sm ${
              isDrawerOpen || activeFiltersCount > 0
                ? 'bg-emerald-700 text-white border-emerald-800 shadow-emerald-700/20'
                : 'bg-white hover:bg-stone-50 text-stone-800 border-stone-300'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filtros Avanzados</span>
            {activeFiltersCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-amber-400 text-stone-950 font-extrabold text-xs flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
            {isDrawerOpen ? (
              <ChevronUp className="w-4 h-4 ml-0.5" />
            ) : (
              <ChevronDown className="w-4 h-4 ml-0.5" />
            )}
          </button>

          {/* Reset button when active */}
          {activeFiltersCount > 0 && (
            <button
              id="btn-reset-filters"
              type="button"
              onClick={handleReset}
              className="p-2.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-100 text-stone-600 hover:text-red-600 transition-colors"
              title="Restablecer todos los filtros"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* 2. HORIZONTAL QUICK-FILTER CHIPS (IDEAL FOR MOBILE TOUCH & FAST TAP) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-none text-xs">
        {/* Quick status: Solo disponibles */}
        <button
          type="button"
          onClick={() =>
            updateFilter(
              'status',
              filterState.status === 'disponible' ? 'todos' : 'disponible'
            )
          }
          className={`px-3 py-1.5 rounded-full font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 border ${
            filterState.status === 'disponible'
              ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm'
              : 'bg-white text-stone-700 border-stone-200 hover:border-emerald-400'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
          <span>Solo Disponibles ({statusCounts.disponible})</span>
        </button>

        {/* Quick area: < 1.000 m² */}
        <button
          type="button"
          onClick={() => {
            if (filterState.areaMax === 1000 && filterState.areaMin === '') {
              updateFilter('areaMax', '');
            } else {
              onFilterChange({
                ...filterState,
                areaMin: '',
                areaMax: 1000,
              });
            }
          }}
          className={`px-3 py-1.5 rounded-full font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 border ${
            filterState.areaMax === 1000 && filterState.areaMin === ''
              ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm'
              : 'bg-white text-stone-700 border-stone-200 hover:border-emerald-400'
          }`}
        >
          <Maximize2 className="w-3 h-3 text-stone-500" />
          <span>Lotes &lt; 1.000 m²</span>
        </button>

        {/* Quick price: < $25.000 */}
        <button
          type="button"
          onClick={() => {
            if (filterState.priceMax === 25000 && filterState.priceMin === '') {
              updateFilter('priceMax', '');
            } else {
              onFilterChange({
                ...filterState,
                priceMin: '',
                priceMax: 25000,
              });
            }
          }}
          className={`px-3 py-1.5 rounded-full font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 border ${
            filterState.priceMax === 25000 && filterState.priceMin === ''
              ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm'
              : 'bg-white text-stone-700 border-stone-200 hover:border-emerald-400'
          }`}
        >
          <DollarSign className="w-3.5 h-3.5 text-amber-500" />
          <span>Precio &lt; $25.000 USD</span>
        </button>

        {/* Quick location: Parte Alta (Colinas) */}
        <button
          type="button"
          onClick={() =>
            updateFilter(
              'location',
              filterState.location === 'alta' ? 'todos' : 'alta'
            )
          }
          className={`px-3 py-1.5 rounded-full font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 border ${
            filterState.location === 'alta'
              ? 'bg-blue-600 text-white border-blue-700 shadow-sm'
              : 'bg-white text-stone-700 border-stone-200 hover:border-blue-400'
          }`}
        >
          <MapPin className="w-3 h-3 text-blue-500" />
          <span>Sector 1 · Colinas</span>
        </button>

        {/* Quick location: Parte Baja (Ranch) */}
        <button
          type="button"
          onClick={() =>
            updateFilter(
              'location',
              filterState.location === 'baja' ? 'todos' : 'baja'
            )
          }
          className={`px-3 py-1.5 rounded-full font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 border ${
            filterState.location === 'baja'
              ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm'
              : 'bg-white text-stone-700 border-stone-200 hover:border-emerald-400'
          }`}
        >
          <MapPin className="w-3 h-3 text-emerald-500" />
          <span>Sector 2 · Ranch</span>
        </button>
      </div>

      {/* 3. EXPANDABLE ADVANCED FILTER PANEL (RESPONSIVE FOR MOBILE & DESKTOP) */}
      {isDrawerOpen && (
        <div
          id="advanced-filters-panel"
          className="bg-white border border-stone-200 rounded-2xl p-4 sm:p-6 shadow-md animate-in fade-in slide-in-from-top-2 duration-200 space-y-5"
        >
          {/* Header of Drawer / Panel */}
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800">
                <Filter className="w-4 h-4" />
              </span>
              <h4 className="font-bold text-stone-900 text-sm sm:text-base">
                Filtros Detallados de Disponibilidad, Área y Precio
              </h4>
            </div>
            <button
              type="button"
              onClick={handleReset}
              className="text-xs text-stone-500 hover:text-red-600 flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Restablecer todo</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 text-xs">
            {/* COLUMN 1: DISPONIBILIDAD (STATUS) */}
            <div className="space-y-2">
              <label className="block font-bold text-stone-800 uppercase tracking-wider text-[11px]">
                1. Estado de Disponibilidad
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-1 gap-1.5">
                {[
                  { id: 'todos', label: 'Todos los Estados', count: totalCount },
                  {
                    id: 'disponible',
                    label: 'Disponibles',
                    count: statusCounts.disponible,
                    color: 'text-emerald-700',
                  },
                  {
                    id: 'reservado',
                    label: 'Reservados',
                    count: statusCounts.reservado,
                    color: 'text-amber-700',
                  },
                  {
                    id: 'vendido',
                    label: 'Vendidos',
                    count: statusCounts.vendido,
                    color: 'text-rose-700',
                  },
                ].map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => updateFilter('status', st.id as any)}
                    className={`w-full px-3 py-2 rounded-xl text-left font-medium transition-all flex items-center justify-between border ${
                      filterState.status === st.id
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold ring-1 ring-emerald-500'
                        : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    <span>{st.label}</span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-white border border-stone-200 ${
                        st.color || 'text-stone-600'
                      }`}
                    >
                      {st.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* COLUMN 2: ÁREA (M²) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block font-bold text-stone-800 uppercase tracking-wider text-[11px]">
                  2. Superficie (Área m²)
                </label>
                {(filterState.areaMin !== '' || filterState.areaMax !== '') && (
                  <button
                    type="button"
                    onClick={() => {
                      onFilterChange({
                        ...filterState,
                        areaMin: '',
                        areaMax: '',
                      });
                    }}
                    className="text-[10px] text-stone-400 hover:text-stone-700"
                  >
                    Limpiar área
                  </button>
                )}
              </div>

              {/* Area Presets */}
              <div className="flex flex-wrap gap-1.5">
                {areaPresets.map((p) => {
                  const active = isAreaPresetActive(p.min, p.max);
                  return (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() =>
                        onFilterChange({
                          ...filterState,
                          areaMin: p.min,
                          areaMax: p.max,
                        })
                      }
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors border ${
                        active
                          ? 'bg-emerald-600 text-white border-emerald-700 font-bold'
                          : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                      }`}
                    >
                      {p.label}
                    </button>
                  );
                })}
              </div>

              {/* Custom Min / Max inputs */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div>
                  <span className="text-[10px] text-stone-500 block mb-1">Mínimo (m²)</span>
                  <input
                    type="number"
                    min="0"
                    placeholder="ej. 600"
                    value={filterState.areaMin}
                    onChange={(e) =>
                      updateFilter('areaMin', e.target.value === '' ? '' : Number(e.target.value))
                    }
                    className="w-full px-2.5 py-1.5 rounded-lg bg-stone-50 border border-stone-300 text-stone-900 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-stone-500 block mb-1">Máximo (m²)</span>
                  <input
                    type="number"
                    min="0"
                    placeholder="ej. 2500"
                    value={filterState.areaMax}
                    onChange={(e) =>
                      updateFilter('areaMax', e.target.value === '' ? '' : Number(e.target.value))
                    }
                    className="w-full px-2.5 py-1.5 rounded-lg bg-stone-50 border border-stone-300 text-stone-900 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* COLUMN 3: PRECIO (USD) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block font-bold text-stone-800 uppercase tracking-wider text-[11px]">
                  3. Rango de Precio ($ USD)
                </label>
                {(filterState.priceMin !== '' || filterState.priceMax !== '') && (
                  <button
                    type="button"
                    onClick={() => {
                      onFilterChange({
                        ...filterState,
                        priceMin: '',
                        priceMax: '',
                      });
                    }}
                    className="text-[10px] text-stone-400 hover:text-stone-700"
                  >
                    Limpiar precio
                  </button>
                )}
              </div>

              {/* Price Presets */}
              <div className="flex flex-wrap gap-1.5">
                {pricePresets.map((p) => {
                  const active = isPricePresetActive(p.min, p.max);
                  return (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() =>
                        onFilterChange({
                          ...filterState,
                          priceMin: p.min,
                          priceMax: p.max,
                        })
                      }
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors border ${
                        active
                          ? 'bg-amber-500 text-stone-950 border-amber-600 font-bold'
                          : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                      }`}
                    >
                      {p.label}
                    </button>
                  );
                })}
              </div>

              {/* Custom Min / Max inputs */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div>
                  <span className="text-[10px] text-stone-500 block mb-1">Precio Mín ($)</span>
                  <input
                    type="number"
                    min="0"
                    placeholder="ej. 12000"
                    value={filterState.priceMin}
                    onChange={(e) =>
                      updateFilter('priceMin', e.target.value === '' ? '' : Number(e.target.value))
                    }
                    className="w-full px-2.5 py-1.5 rounded-lg bg-stone-50 border border-stone-300 text-stone-900 text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-stone-500 block mb-1">Precio Máx ($)</span>
                  <input
                    type="number"
                    min="0"
                    placeholder="ej. 35000"
                    value={filterState.priceMax}
                    onChange={(e) =>
                      updateFilter('priceMax', e.target.value === '' ? '' : Number(e.target.value))
                    }
                    className="w-full px-2.5 py-1.5 rounded-lg bg-stone-50 border border-stone-300 text-stone-900 text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* COLUMN 4: SECTOR & ORDENAMIENTO */}
            <div className="space-y-4">
              {/* Sector selector */}
              <div className="space-y-1.5">
                <label className="block font-bold text-stone-800 uppercase tracking-wider text-[11px]">
                  4. Sector / Ubicación
                </label>
                <select
                  value={filterState.location}
                  onChange={(e) => updateFilter('location', e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-300 text-stone-800 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  <option value="todos">Todos los Sectores</option>
                  <option value="alta">Sector 1 · Colinas (Parte Alta)</option>
                  <option value="baja">Sector 2 · Ranch (Parte Baja)</option>
                </select>
              </div>

              {/* Sorting selector */}
              <div className="space-y-1.5">
                <label className="block font-bold text-stone-800 uppercase tracking-wider text-[11px]">
                  5. Ordenar Resultados Por
                </label>
                <div className="relative">
                  <ArrowUpDown className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <select
                    value={filterState.sortBy}
                    onChange={(e) => updateFilter('sortBy', e.target.value as any)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-stone-50 border border-stone-300 text-stone-800 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="code">Código de Lote (A1-01 ...)</option>
                    <option value="price_asc">Precio: Menor a Mayor ($)</option>
                    <option value="price_desc">Precio: Mayor a Menor ($)</option>
                    <option value="area_asc">Superficie: Menor a Mayor (m²)</option>
                    <option value="area_desc">Superficie: Mayor a Menor (m²)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Sticky/Footer summary in drawer on mobile */}
          <div className="pt-3 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-2.5">
            <div className="text-xs text-stone-600">
              Criterio de cálculo de precio de lista:{' '}
              <strong className="text-stone-900 font-mono">20 USD/m²</strong> de terreno rural urbanizado.
            </div>
            <button
              type="button"
              onClick={() => setIsDrawerOpen(false)}
              className="w-full sm:w-auto px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Ver {filteredCount} Lotes Encontrados</span>
            </button>
          </div>
        </div>
      )}

      {/* 4. ACTIVE FILTER BADGES ROW (ONE-TAP REMOVAL) */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-stone-500 text-[11px] font-medium mr-1">
            Mostrando <strong className="text-stone-900">{filteredCount}</strong> de{' '}
            <strong className="text-stone-900">{totalCount}</strong> lotes:
          </span>

          {filterState.searchTerm && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-stone-100 text-stone-800 border border-stone-300 text-[11px]">
              <span>Texto: &quot;{filterState.searchTerm}&quot;</span>
              <button
                type="button"
                onClick={() => updateFilter('searchTerm', '')}
                className="hover:text-red-600"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filterState.status !== 'todos' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 text-[11px]">
              <span className="capitalize">{filterState.status}</span>
              <button
                type="button"
                onClick={() => updateFilter('status', 'todos')}
                className="hover:text-red-600"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {(filterState.areaMin !== '' || filterState.areaMax !== '') && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-300 text-[11px]">
              <span>
                Área:{' '}
                {filterState.areaMin !== '' ? `${filterState.areaMin} m²` : '0 m²'} -{' '}
                {filterState.areaMax !== '' ? `${filterState.areaMax} m²` : 'Máx'}
              </span>
              <button
                type="button"
                onClick={() =>
                  onFilterChange({
                    ...filterState,
                    areaMin: '',
                    areaMax: '',
                  })
                }
                className="hover:text-red-600"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {(filterState.priceMin !== '' || filterState.priceMax !== '') && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-300 text-[11px]">
              <span>
                Precio:{' '}
                {filterState.priceMin !== '' ? `$${filterState.priceMin}` : '$0'} -{' '}
                {filterState.priceMax !== '' ? `$${filterState.priceMax}` : 'Máx'}
              </span>
              <button
                type="button"
                onClick={() =>
                  onFilterChange({
                    ...filterState,
                    priceMin: '',
                    priceMax: '',
                  })
                }
                className="hover:text-red-600"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filterState.location !== 'todos' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-50 text-purple-800 border border-purple-300 text-[11px]">
              <span>
                Sector: {filterState.location === 'alta' ? 'Colinas (Parte Alta)' : 'Ranch (Parte Baja)'}
              </span>
              <button
                type="button"
                onClick={() => updateFilter('location', 'todos')}
                className="hover:text-red-600"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filterState.sortBy !== 'code' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-stone-100 text-stone-700 border border-stone-300 text-[11px]">
              <span>
                Orden:{' '}
                {filterState.sortBy === 'price_asc'
                  ? 'Precio ↑'
                  : filterState.sortBy === 'price_desc'
                  ? 'Precio ↓'
                  : filterState.sortBy === 'area_asc'
                  ? 'Área ↑'
                  : 'Área ↓'}
              </span>
              <button
                type="button"
                onClick={() => updateFilter('sortBy', 'code')}
                className="hover:text-red-600"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>

        {activeFiltersCount > 0 && (
          <button
            type="button"
            onClick={handleReset}
            className="text-xs text-red-600 hover:text-red-800 font-semibold underline ml-auto"
          >
            Limpiar filtros
          </button>
        )}
      </div>
    </div>
  );
};
