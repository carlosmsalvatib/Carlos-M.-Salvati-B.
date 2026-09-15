import React, { useState, useEffect } from 'react';
import { CmsContent, LotItem, LeadSubmission, LotStatus } from '../types';
import { updateContent, updateLot, getLeads, updateLeadStatus } from '../lib/api';
import { X, Save, Settings, Layers, Users, Home, RefreshCw, MessageSquare, Check, ExternalLink, Trash2 } from 'lucide-react';

interface CmsAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: CmsContent;
  lots: LotItem[];
  onContentUpdated: (newContent: CmsContent) => void;
  onLotsUpdated: (newLots: LotItem[]) => void;
}

export const CmsAdminModal: React.FC<CmsAdminModalProps> = ({
  isOpen,
  onClose,
  content,
  lots,
  onContentUpdated,
  onLotsUpdated,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'general' | 'hero' | 'lotes' | 'modelos' | 'leads'>('general');
  const [formData, setFormData] = useState<CmsContent>(content);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [leadsList, setLeadsList] = useState<LeadSubmission[]>([]);
  const [loadingLeads, setLoadingLeads] = useState(false);

  useEffect(() => {
    setFormData(content);
  }, [content]);

  useEffect(() => {
    if (activeTab === 'leads') {
      fetchLeads();
    }
  }, [activeTab]);

  const fetchLeads = async () => {
    setLoadingLeads(true);
    try {
      const data = await getLeads();
      setLeadsList(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingLeads(false);
    }
  };

  const handleSaveContent = async () => {
    setSaving(true);
    try {
      const updated = await updateContent(formData);
      onContentUpdated(updated);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      alert('Error guardando contenido: ' + err);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateLotStatus = async (lotId: string, status: LotStatus) => {
    try {
      const updated = await updateLot(lotId, { status });
      const newLots = lots.map((l) => (l.id === lotId ? updated : l));
      onLotsUpdated(newLots);
    } catch (err) {
      alert('Error actualizando lote: ' + err);
    }
  };

  const handleUpdateLeadState = async (leadId: string, status: 'nuevo' | 'contactado' | 'cerrado') => {
    try {
      const updated = await updateLeadStatus(leadId, status);
      setLeadsList((prev) => prev.map((l) => (l.id === leadId ? updated : l)));
    } catch (err) {
      alert('Error actualizando prospecto: ' + err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-hidden">
      <div className="bg-stone-900 border border-stone-700 text-stone-100 rounded-2xl w-full max-w-5xl h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-stone-800 flex items-center justify-between bg-stone-950">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-lg text-white">Panel Administrativo CMS</h2>
              <p className="text-xs text-stone-400">Gestión de contenidos, lotes y prospectos en tiempo real</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {saveSuccess && (
              <span className="inline-flex items-center gap-1 text-xs text-emerald-400 font-semibold px-2.5 py-1 bg-emerald-950/60 border border-emerald-500/40 rounded-lg">
                <Check className="w-3.5 h-3.5" /> ¡Guardado!
              </span>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex overflow-x-auto bg-stone-850 border-b border-stone-800 px-4 py-2 gap-2 text-xs">
          <button
            onClick={() => setActiveTab('general')}
            className={`px-3.5 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
              activeTab === 'general' ? 'bg-amber-500 text-stone-950 font-bold' : 'text-stone-300 hover:bg-stone-800'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>General & Contacto</span>
          </button>
          <button
            onClick={() => setActiveTab('hero')}
            className={`px-3.5 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
              activeTab === 'hero' ? 'bg-amber-500 text-stone-950 font-bold' : 'text-stone-300 hover:bg-stone-800'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>Sección Hero</span>
          </button>
          <button
            onClick={() => setActiveTab('lotes')}
            className={`px-3.5 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
              activeTab === 'lotes' ? 'bg-amber-500 text-stone-950 font-bold' : 'text-stone-300 hover:bg-stone-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Lotes & Disponibilidad ({lots.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('modelos')}
            className={`px-3.5 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
              activeTab === 'modelos' ? 'bg-amber-500 text-stone-950 font-bold' : 'text-stone-300 hover:bg-stone-800'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>Modelos de Vivienda</span>
          </button>
          <button
            onClick={() => setActiveTab('leads')}
            className={`px-3.5 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
              activeTab === 'leads' ? 'bg-amber-500 text-stone-950 font-bold' : 'text-stone-300 hover:bg-stone-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Prospectos / Leads</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* TAB 1: General */}
          {activeTab === 'general' && (
            <div className="space-y-4 max-w-2xl">
              <h3 className="font-serif text-lg font-bold text-white border-b border-stone-800 pb-2">
                Datos de Contacto y Empresa
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-stone-300 mb-1 font-semibold">Nombre del Proyecto</label>
                  <input
                    type="text"
                    value={formData.site.projectName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        site: { ...formData.site, projectName: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-stone-800 border border-stone-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-stone-300 mb-1 font-semibold">Precio Base USD/m²</label>
                  <input
                    type="number"
                    value={formData.salesFinancing.pricePerM2Usd}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        salesFinancing: {
                          ...formData.salesFinancing,
                          pricePerM2Usd: Number(e.target.value),
                        },
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-stone-800 border border-stone-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-stone-300 mb-1 font-semibold">Teléfono / WhatsApp</label>
                  <input
                    type="text"
                    value={formData.site.contactWhatsapp}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        site: { ...formData.site, contactWhatsapp: e.target.value, contactPhone: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-stone-800 border border-stone-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-stone-300 mb-1 font-semibold">Correo de Ventas</label>
                  <input
                    type="email"
                    value={formData.site.contactEmail}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        site: { ...formData.site, contactEmail: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-stone-800 border border-stone-700 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-300 mb-1 font-semibold text-xs">Dirección de Ventas</label>
                <input
                  type="text"
                  value={formData.site.salesOfficeAddress}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      site: { ...formData.site, salesOfficeAddress: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-stone-800 border border-stone-700 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-stone-300 mb-1 font-semibold text-xs">Mensaje predeterminado WhatsApp</label>
                <textarea
                  rows={2}
                  value={formData.contactForm.whatsappMessageTemplate}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      contactForm: { ...formData.contactForm, whatsappMessageTemplate: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-stone-800 border border-stone-700 text-white text-xs"
                />
              </div>
            </div>
          )}

          {/* TAB 2: Hero Section */}
          {activeTab === 'hero' && (
            <div className="space-y-4 max-w-2xl">
              <h3 className="font-serif text-lg font-bold text-white border-b border-stone-800 pb-2">
                Configuración del Hero Principal
              </h3>
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-stone-300 mb-1 font-semibold">Título Principal</label>
                  <input
                    type="text"
                    value={formData.hero.title}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        hero: { ...formData.hero, title: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-stone-800 border border-stone-700 text-white"
                  />
                </div>

                <div>
                  <label className="block text-stone-300 mb-1 font-semibold">Subtítulo</label>
                  <textarea
                    rows={2}
                    value={formData.hero.subtitle}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        hero: { ...formData.hero, subtitle: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-stone-800 border border-stone-700 text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-stone-300 mb-1 font-semibold">Texto Sello Preventa</label>
                    <input
                      type="text"
                      value={formData.hero.badgeText}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          hero: { ...formData.hero, badgeText: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-stone-800 border border-stone-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-300 mb-1 font-semibold">Insignia de Precio</label>
                    <input
                      type="text"
                      value={formData.hero.priceBadge}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          hero: { ...formData.hero, priceBadge: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-stone-800 border border-stone-700 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-stone-300 mb-1 font-semibold">Botón Primario (CTA)</label>
                    <input
                      type="text"
                      value={formData.hero.primaryCtaText}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          hero: { ...formData.hero, primaryCtaText: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-stone-800 border border-stone-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-300 mb-1 font-semibold">Botón Secundario</label>
                    <input
                      type="text"
                      value={formData.hero.secondaryCtaText}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          hero: { ...formData.hero, secondaryCtaText: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-stone-800 border border-stone-700 text-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Lots Management */}
          {activeTab === 'lotes' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                <div>
                  <h3 className="font-serif text-lg font-bold text-white">Inventario y Estado de Lotes</h3>
                  <p className="text-xs text-stone-400">
                    Cambia el estado de cualquier lote (Disponible, Reservado, Vendido) con un solo clic.
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto max-h-[50vh] rounded-xl border border-stone-800">
                <table className="w-full text-left text-xs text-stone-300">
                  <thead className="bg-stone-950 text-white font-semibold sticky top-0 border-b border-stone-800">
                    <tr>
                      <th className="py-2.5 px-3">Lote</th>
                      <th className="py-2.5 px-3">Sector</th>
                      <th className="py-2.5 px-3">Área (m²)</th>
                      <th className="py-2.5 px-3">Precio Total</th>
                      <th className="py-2.5 px-3">Estado Actual</th>
                      <th className="py-2.5 px-3 text-right">Cambiar Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-800">
                    {lots.map((lot) => (
                      <tr key={lot.id} className="hover:bg-stone-800/40">
                        <td className="py-2 px-3 font-bold text-white">{lot.code}</td>
                        <td className="py-2 px-3 text-stone-400">
                          {lot.location === 'alta' ? 'Colinas (Alta)' : 'Ranch (Baja)'}
                        </td>
                        <td className="py-2 px-3">{lot.areaM2.toLocaleString('es-VE')} m²</td>
                        <td className="py-2 px-3 font-semibold text-emerald-400">
                          ${lot.totalPriceUsd.toLocaleString('es-VE')} USD
                        </td>
                        <td className="py-2 px-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                              lot.status === 'disponible'
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                                : lot.status === 'reservado'
                                ? 'bg-amber-950 text-amber-300 border border-amber-700'
                                : 'bg-rose-950 text-rose-300 border border-rose-700'
                            }`}
                          >
                            {lot.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-right">
                          <div className="inline-flex gap-1">
                            <button
                              onClick={() => handleUpdateLotStatus(lot.id, 'disponible')}
                              className="px-2 py-1 rounded bg-stone-800 hover:bg-emerald-900 text-stone-300 hover:text-emerald-200 text-[10px]"
                            >
                              Disponible
                            </button>
                            <button
                              onClick={() => handleUpdateLotStatus(lot.id, 'reservado')}
                              className="px-2 py-1 rounded bg-stone-800 hover:bg-amber-900 text-stone-300 hover:text-amber-200 text-[10px]"
                            >
                              Reservar
                            </button>
                            <button
                              onClick={() => handleUpdateLotStatus(lot.id, 'vendido')}
                              className="px-2 py-1 rounded bg-stone-800 hover:bg-rose-900 text-stone-300 hover:text-rose-200 text-[10px]"
                            >
                              Vendido
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: Housing Models */}
          {activeTab === 'modelos' && (
            <div className="space-y-6 max-w-2xl">
              <h3 className="font-serif text-lg font-bold text-white border-b border-stone-800 pb-2">
                Configuración de Modelos de Vivienda
              </h3>

              {formData.housingModels.models.map((model, idx) => (
                <div key={model.id} className="p-4 bg-stone-850 rounded-xl border border-stone-800 space-y-3 text-xs">
                  <h4 className="font-bold text-amber-400 text-sm">{model.name}</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-stone-400 mb-1">Precio Total (USD)</label>
                      <input
                        type="number"
                        value={model.priceUsd}
                        onChange={(e) => {
                          const updatedModels = [...formData.housingModels.models];
                          updatedModels[idx].priceUsd = Number(e.target.value);
                          setFormData({
                            ...formData,
                            housingModels: { ...formData.housingModels, models: updatedModels },
                          });
                        }}
                        className="w-full px-3 py-1.5 rounded bg-stone-800 border border-stone-700 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-400 mb-1">Superficie Construida (m²)</label>
                      <input
                        type="number"
                        value={model.areaM2}
                        onChange={(e) => {
                          const updatedModels = [...formData.housingModels.models];
                          updatedModels[idx].areaM2 = Number(e.target.value);
                          setFormData({
                            ...formData,
                            housingModels: { ...formData.housingModels, models: updatedModels },
                          });
                        }}
                        className="w-full px-3 py-1.5 rounded bg-stone-800 border border-stone-700 text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-stone-400 mb-1">Descripción</label>
                    <textarea
                      rows={2}
                      value={model.description}
                      onChange={(e) => {
                        const updatedModels = [...formData.housingModels.models];
                        updatedModels[idx].description = e.target.value;
                        setFormData({
                          ...formData,
                          housingModels: { ...formData.housingModels, models: updatedModels },
                        });
                      }}
                      className="w-full px-3 py-1.5 rounded bg-stone-800 border border-stone-700 text-white"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 5: Leads */}
          {activeTab === 'leads' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                <div>
                  <h3 className="font-serif text-lg font-bold text-white">Prospectos Recibidos</h3>
                  <p className="text-xs text-stone-400">
                    Lista de personas que han completado el formulario de conversión o simulador.
                  </p>
                </div>
                <button
                  onClick={fetchLeads}
                  className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-xs text-stone-200 flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Actualizar</span>
                </button>
              </div>

              {loadingLeads ? (
                <p className="text-stone-400 text-xs py-4 text-center">Cargando prospectos...</p>
              ) : leadsList.length === 0 ? (
                <div className="p-8 text-center text-stone-400 text-xs bg-stone-850 rounded-xl border border-stone-800">
                  No hay solicitudes registradas todavía. Los nuevos envíos del formulario aparecerán aquí.
                </div>
              ) : (
                <div className="space-y-3">
                  {leadsList.map((lead) => {
                    const cleanPhone = lead.phone.replace(/\D/g, '');
                    const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                      `Hola ${lead.fullName}, te contactamos desde Mis Delirios Ranch respecto a tu solicitud de información.`
                    )}`;

                    return (
                      <div
                        key={lead.id}
                        className="p-4 bg-stone-850 rounded-xl border border-stone-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white text-sm">{lead.fullName}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-stone-800 text-stone-400 uppercase">
                              {lead.profileInterest}
                            </span>
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                                lead.status === 'nuevo'
                                  ? 'bg-amber-950 text-amber-300'
                                  : lead.status === 'contactado'
                                  ? 'bg-blue-950 text-blue-300'
                                  : 'bg-emerald-950 text-emerald-300'
                              }`}
                            >
                              {lead.status.toUpperCase()}
                            </span>
                          </div>

                          <div className="flex flex-wrap gap-3 text-stone-400">
                            <span>Tel: <strong className="text-stone-200">{lead.phone}</strong></span>
                            {lead.email && <span>Email: <strong className="text-stone-200">{lead.email}</strong></span>}
                            {lead.lotPreference && <span>Lote: <strong className="text-amber-400">{lead.lotPreference}</strong></span>}
                          </div>

                          {lead.message && (
                            <p className="text-stone-300 bg-stone-900/60 p-2 rounded border border-stone-800/80 text-[11px] mt-1">
                              "{lead.message}"
                            </p>
                          )}
                          <span className="text-[10px] text-stone-500 block">
                            Recibido: {new Date(lead.timestamp || (lead as any).createdAt || Date.now()).toLocaleString('es-VE')}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          {/* WhatsApp Direct Action */}
                          <a
                            href={waUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>WhatsApp</span>
                          </a>

                          {/* Status buttons */}
                          <select
                            value={lead.status}
                            onChange={(e) => handleUpdateLeadState(lead.id, e.target.value as any)}
                            className="px-2 py-1.5 rounded bg-stone-800 border border-stone-700 text-stone-300 text-xs"
                          >
                            <option value="nuevo">Nuevo</option>
                            <option value="contactado">Contactado</option>
                            <option value="cerrado">Cerrado</option>
                          </select>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer / Save Bar */}
        <div className="p-4 border-t border-stone-800 bg-stone-950 flex items-center justify-between">
          <span className="text-xs text-stone-500">
            Los cambios se guardan permanentemente en el servidor.
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-300 hover:text-white bg-stone-800 hover:bg-stone-700 transition-colors"
            >
              Cerrar
            </button>
            <button
              onClick={handleSaveContent}
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold text-stone-950 bg-amber-500 hover:bg-amber-400 transition-all shadow-md disabled:opacity-60"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Guardando...' : 'Guardar Cambios CMS'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
