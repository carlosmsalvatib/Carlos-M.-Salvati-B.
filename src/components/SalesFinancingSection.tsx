import React, { useState } from 'react';
import { CmsContent } from '../types';
import { Calculator, CheckCircle2, Clock, HelpCircle, ArrowRight, Sparkles, DollarSign, Tag } from 'lucide-react';

interface SalesFinancingSectionProps {
  content: CmsContent;
  onSimulatedQuote: (quoteData: {
    lotAreaM2: number;
    totalLotUsd: number;
    initial50Usd: number;
    monthlyInstallmentUsd: number;
    selectedHouseModel?: string;
    totalCombinedUsd: number;
  }) => void;
}

export const SalesFinancingSection: React.FC<SalesFinancingSectionProps> = ({ content, onSimulatedQuote }) => {
  const { salesFinancing } = content;
  if (!salesFinancing.active) return null;

  // Simulator State
  const [lotArea, setLotArea] = useState<number>(600);
  const [selectedModel, setSelectedModel] = useState<'ninguno' | 'modelo-a' | 'modelo-b'>('ninguno');
  const [selectedPlan, setSelectedPlan] = useState<string>('propio');

  const pricePerM2 = salesFinancing.pricePerM2Usd || 20;
  const lotTotalPrice = Math.round(lotArea * pricePerM2);

  const housePrice = selectedModel === 'modelo-a' ? 40500 : selectedModel === 'modelo-b' ? 56250 : 0;
  const totalInvestment = lotTotalPrice + housePrice;

  // 50% initial + 6 monthly installments
  const initial50 = Math.round(lotTotalPrice * 0.5);
  const reservation10 = Math.round(lotTotalPrice * 0.1);
  const monthlyInstallment = Math.round(initial50 / 6);

  const handleApplyQuote = () => {
    onSimulatedQuote({
      lotAreaM2: lotArea,
      totalLotUsd: lotTotalPrice,
      initial50Usd: initial50,
      monthlyInstallmentUsd: monthlyInstallment,
      selectedHouseModel: selectedModel !== 'ninguno' ? selectedModel : undefined,
      totalCombinedUsd: totalInvestment,
    });
  };

  return (
    <section id="financiamiento" className="py-20 bg-stone-100 text-stone-800 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-semibold mb-3">
            <DollarSign className="w-3.5 h-3.5" />
            <span>Condiciones Claras y Flexibles</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight mb-4" id="financing-title">
            {salesFinancing.title || 'Planes de Venta & Compromiso Sostenible – Valor por Metros Cuadrados USD 20,00'}
          </h2>
          <p className="text-stone-600 text-base sm:text-lg leading-relaxed">
            Sin intermediarios ni comisiones ocultas. Diseñado para que adquieras tu mini-granja con total tranquilidad jurídica y financiera.
          </p>
        </div>

        {/* 4 Modalities Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {salesFinancing.modalities.map((mod, idx) => (
            <div
              key={mod.id || idx}
              className={`bg-white rounded-2xl border-2 p-6 shadow-sm flex flex-col justify-between transition-all ${
                mod.title.includes('Propio')
                  ? 'border-amber-400 ring-2 ring-amber-400/20 shadow-md'
                  : 'border-stone-200/90 hover:border-stone-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-stone-100 text-stone-700">
                    Modalidad {idx + 1}
                  </span>
                  {mod.status === 'Disponible' ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3 h-3" /> Disponible
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                      <Clock className="w-3 h-3" /> En evaluación
                    </span>
                  )}
                </div>

                <h3 className="font-serif text-xl font-bold text-stone-900 mb-2">{mod.title}</h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mb-4">{mod.description}</p>
              </div>

              <div className="pt-4 border-t border-stone-100">
                <span className="block text-xs font-semibold text-amber-800 bg-amber-50 px-2.5 py-1.5 rounded-lg text-center">
                  {mod.badge}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Special Investor Promo Callout */}
        <div className="bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-amber-500/40 mb-16 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center flex-shrink-0">
              <Tag className="w-7 h-7 text-amber-400" />
            </div>
            <div>
              <span className="px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-amber-400 text-stone-950 inline-block mb-1">
                Oportunidad Exclusiva Inversionistas
              </span>
              <h4 className="font-serif text-xl sm:text-2xl font-bold text-white">
                {salesFinancing.specialPromo || 'Descuento especial por compras superiores a 3 lotes'}
              </h4>
              <p className="text-xs sm:text-sm text-stone-300">
                Maximiza tu rentabilidad en la primera etapa de preventa con condiciones comerciales preferenciales.
              </p>
            </div>
          </div>
          <a
            href="#contacto?asunto=promocion_inversionista_3_lotes"
            className="whitespace-nowrap px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm shadow-md transition-colors"
          >
            Consultar descuento
          </a>
        </div>

        {/* Interactive Live Financing Simulator */}
        <div className="bg-white rounded-3xl border border-stone-200 shadow-xl overflow-hidden" id="simulador-financiamiento">
          <div className="bg-stone-900 p-6 sm:p-8 text-white">
            <div className="flex items-center gap-3 mb-2">
              <Calculator className="w-6 h-6 text-amber-400" />
              <h3 className="font-serif text-2xl font-bold">Simulador Interactivo de Financiamiento</h3>
            </div>
            <p className="text-xs sm:text-sm text-stone-300">
              Calcula en tiempo real la cuota inicial y los pagos mensuales estimados para tu lote y modelo de vivienda.
            </p>
          </div>

          <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Simulator Controls */}
            <div className="lg:col-span-7 space-y-6">
              {/* Lot Area Range / Presets */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-bold text-stone-800">
                    Superficie deseada del lote:
                  </label>
                  <span className="font-bold text-lg text-emerald-700 font-serif">
                    {lotArea.toLocaleString('es-VE')} m²
                  </span>
                </div>

                <input
                  type="range"
                  min="600"
                  max="4500"
                  step="50"
                  value={lotArea}
                  onChange={(e) => setLotArea(Number(e.target.value))}
                  className="w-full accent-emerald-600 h-2 bg-stone-200 rounded-lg cursor-pointer"
                />

                <div className="flex flex-wrap gap-2 mt-3">
                  {[600, 750, 1000, 1500, 2200, 3500].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setLotArea(preset)}
                      className={`px-2.5 py-1 text-xs rounded-lg font-medium border transition-colors ${
                        lotArea === preset
                          ? 'bg-emerald-700 text-white border-emerald-700'
                          : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      {preset} m²
                    </button>
                  ))}
                </div>
              </div>

              {/* Add Housing Model Option */}
              <div>
                <label className="text-sm font-bold text-stone-800 block mb-2">
                  ¿Deseas incluir la construcción de la vivienda en Guadua?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedModel('ninguno')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      selectedModel === 'ninguno'
                        ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-500/20'
                        : 'border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    <span className="block font-bold text-xs text-stone-900">Solo Lote</span>
                    <span className="text-[11px] text-stone-500">Sin modelo de casa</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedModel('modelo-a')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      selectedModel === 'modelo-a'
                        ? 'border-amber-500 bg-amber-50/60 ring-2 ring-amber-500/20'
                        : 'border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    <span className="block font-bold text-xs text-stone-900">Modelo A (90 m²)</span>
                    <span className="text-[11px] text-amber-700 font-semibold">+ $40.500 USD</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedModel('modelo-b')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      selectedModel === 'modelo-b'
                        ? 'border-amber-500 bg-amber-50/60 ring-2 ring-amber-500/20'
                        : 'border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    <span className="block font-bold text-xs text-stone-900">Modelo B (125 m²)</span>
                    <span className="text-[11px] text-amber-700 font-semibold">+ $56.250 USD</span>
                  </button>
                </div>
              </div>

              {/* Payment Modality Choice */}
              <div>
                <label className="text-sm font-bold text-stone-800 block mb-2">Modalidad de pago:</label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedPlan('propio')}
                    className={`flex-1 p-3 rounded-xl border text-center transition-all ${
                      selectedPlan === 'propio'
                        ? 'border-amber-500 bg-amber-50 font-bold text-stone-900'
                        : 'border-stone-200 text-stone-600'
                    }`}
                  >
                    <span className="block text-xs sm:text-sm">Financiamiento Propio</span>
                    <span className="text-[11px] text-stone-500">50% Inicial + 6 Cuotas</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedPlan('contado')}
                    className={`flex-1 p-3 rounded-xl border text-center transition-all ${
                      selectedPlan === 'contado'
                        ? 'border-emerald-600 bg-emerald-50 font-bold text-stone-900'
                        : 'border-stone-200 text-stone-600'
                    }`}
                  >
                    <span className="block text-xs sm:text-sm">Pago de Contado</span>
                    <span className="text-[11px] text-stone-500">100% Sin recargos</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Simulated Summary Results Card */}
            <div className="lg:col-span-5 bg-stone-50 rounded-2xl p-6 border border-stone-200/80 flex flex-col justify-between">
              <div>
                <h4 className="font-serif font-bold text-lg text-stone-900 pb-3 border-b border-stone-200">
                  Resumen de la Simulación
                </h4>

                <div className="py-4 space-y-3 text-xs sm:text-sm">
                  <div className="flex justify-between">
                    <span className="text-stone-500">Valor del Terreno ({lotArea} m² × $20):</span>
                    <span className="font-bold text-stone-900">${lotTotalPrice.toLocaleString('es-VE')} USD</span>
                  </div>

                  {housePrice > 0 && (
                    <div className="flex justify-between text-amber-800">
                      <span>Construcción ({selectedModel === 'modelo-a' ? 'Modelo A 90 m²' : 'Modelo B 125 m²'}):</span>
                      <span className="font-bold">${housePrice.toLocaleString('es-VE')} USD</span>
                    </div>
                  )}

                  <div className="flex justify-between pt-2 border-t border-stone-200 font-bold text-stone-900">
                    <span>Inversión Total Estimada:</span>
                    <span className="text-base text-emerald-800 font-serif">
                      ${totalInvestment.toLocaleString('es-VE')} USD
                    </span>
                  </div>

                  {/* Financing breakdown */}
                  {selectedPlan === 'propio' ? (
                    <div className="mt-4 p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-2">
                      <div className="flex justify-between text-stone-700">
                        <span>Reserva inicial (10%):</span>
                        <span className="font-bold text-amber-700">${reservation10.toLocaleString('es-VE')} USD</span>
                      </div>
                      <div className="flex justify-between text-stone-700">
                        <span>Inicial a la firma (50%):</span>
                        <span className="font-bold text-stone-900">${initial50.toLocaleString('es-VE')} USD</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-amber-200/60 font-bold text-emerald-900">
                        <span>6 Cuotas Mensuales de:</span>
                        <span className="text-base font-serif">${monthlyInstallment.toLocaleString('es-VE')} USD / mes</span>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-4 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
                      <span className="block text-xs font-bold text-emerald-900">Pago único a la firma</span>
                      <span className="text-xl font-bold font-serif text-emerald-800">
                        ${totalInvestment.toLocaleString('es-VE')} USD
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* CTA */}
              <div className="pt-4 border-t border-stone-200">
                <button
                  onClick={handleApplyQuote}
                  className="w-full py-3.5 rounded-xl font-bold text-sm bg-emerald-700 hover:bg-emerald-600 text-white shadow-md transition-colors flex items-center justify-center gap-2"
                  id="btn-solicitar-cotizacion-simulada"
                >
                  <span>Solicitar esta simulación formal</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <p className="text-[11px] text-stone-400 text-center mt-2">
                  * Valores referenciales sujetos a verificación y disponibilidad en sitio.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
