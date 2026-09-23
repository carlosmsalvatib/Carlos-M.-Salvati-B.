import React, { useState, useEffect } from 'react';
import { CmsContent, LeadSubmission } from '../types';
import { submitLead } from '../lib/api';
import { Phone, Mail, MapPin, MessageCircle, Send, CheckCircle2, AlertCircle, ShieldCheck, Instagram, Facebook, Youtube, Clock } from 'lucide-react';

interface ContactConversionSectionProps {
  content: CmsContent;
  prefilledLot?: string;
  prefilledModel?: string;
  prefilledProfile?: string;
}

export const ContactConversionSection: React.FC<ContactConversionSectionProps> = ({
  content,
  prefilledLot,
  prefilledModel,
  prefilledProfile,
}) => {
  const { contactForm, site } = content;

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [profileInterest, setProfileInterest] = useState<'ecologico' | 'hogar' | 'inversionista' | 'general'>('general');
  const [message, setMessage] = useState('');
  const [lotPref, setLotPref] = useState(prefilledLot || '');
  const [modelPref, setModelPref] = useState(prefilledModel || '');
  const [agreePrivacy, setAgreePrivacy] = useState(true);
  const [honeypot, setHoneypot] = useState(''); // Anti-spam trap

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (prefilledLot) setLotPref(prefilledLot);
  }, [prefilledLot]);

  useEffect(() => {
    if (prefilledModel) setModelPref(prefilledModel);
  }, [prefilledModel]);

  useEffect(() => {
    if (prefilledProfile) {
      if (prefilledProfile === 'ecologico') setProfileInterest('ecologico');
      else if (prefilledProfile === 'hogar') setProfileInterest('hogar');
      else if (prefilledProfile === 'inversionista') setProfileInterest('inversionista');
    }
  }, [prefilledProfile]);

  if (!contactForm.active) return null;

  const handleSubmit = async (e: React.FormEvent, isCallRequest = false) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    // Spam trap
    if (honeypot) return;

    if (!fullName.trim() || !phone.trim()) {
      setErrorMessage('Por favor ingresa tu nombre completo y número de teléfono.');
      return;
    }

    if (!agreePrivacy) {
      setErrorMessage('Debes aceptar la política de privacidad para enviar tu solicitud.');
      return;
    }

    setLoading(true);
    try {
      const fullMsg = isCallRequest
        ? `[SOLICITUD DE LLAMADA INMEDIATA] ${message}`
        : message;

      await submitLead({
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        profileInterest,
        message: fullMsg,
        lotPreference: lotPref,
        modelPreference: modelPref,
        source: isCallRequest ? 'simulador' : 'formulario',
      });

      setSuccessMessage(contactForm.successMessage || '¡Solicitud enviada con éxito!');
      setFullName('');
      setEmail('');
      setPhone('');
      setMessage('');
    } catch (err: any) {
      setErrorMessage(err.message || 'Error al conectar con el servidor. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const whatsappNum = contactForm.directWhatsapp || site.contactWhatsapp || (site as any).phone || '+58-414-7114245';
  const phoneNum = contactForm.directPhone || site.contactPhone || (site as any).phone || '+58-414-7114245';
  const emailVal = contactForm.directEmail || site.contactEmail || (site as any).email || 'ventas@misdeliriosranch.com';
  const addressVal = contactForm.directAddress || site.salesOfficeAddress || (site as any).address || 'Aldea Sabana Larga - Sector Salomón, Cordero, Municipio Andrés Bello, estado Táchira, Venezuela';

  // Defensive sanitization: replace any stale legacy numbers containing 7187596
  const safeWhatsapp = whatsappNum.includes('7187596') ? '+58-414-7114245' : whatsappNum;
  const safePhone = phoneNum.includes('7187596') ? '+58-414-7114245' : phoneNum;

  const cleanWaNumber = safeWhatsapp.replace(/\D/g, '') || '584147114245';
  const whatsappLink = `https://wa.me/${cleanWaNumber}?text=${encodeURIComponent(
    contactForm.whatsappMessageTemplate || 'Hola, deseo recibir información sobre Mis Delirios Ranch.'
  )}`;

  return (
    <section id="contacto" className="py-20 bg-stone-50 text-stone-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold mb-3">
            <MessageCircle className="w-3.5 h-3.5" />
            <span>{contactForm.badgeText || 'Atención Personalizada en Menos de 24 Horas'}</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight mb-4" id="contact-title">
            {contactForm.title || 'Haz Realidad tu Casa de Campo'}
          </h2>
          <p className="text-stone-600 text-base sm:text-lg leading-relaxed" id="contact-subtitle">
            {contactForm.subtitle || 'Completa tus datos para recibir asesoría sobre lotes disponibles y opciones de financiamiento.'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Contact Direct Cards & Sales Office Info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-stone-200 shadow-sm space-y-5">
              <h3 className="font-serif text-xl font-bold text-stone-900">
                {contactForm.directChannelsTitle || 'Canales de Atención Directa'}
              </h3>

              {/* WhatsApp Direct */}
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 rounded-xl bg-emerald-50 border border-emerald-200 hover:bg-emerald-100/70 transition-all group"
                id="contact-whatsapp-direct-link"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <div>
                  <span className="block text-xs font-bold uppercase tracking-wider text-emerald-800">
                    Atención Inmediata por WhatsApp
                  </span>
                  <span className="text-stone-900 font-bold text-base">{safeWhatsapp}</span>
                  <p className="text-xs text-stone-500">{contactForm.whatsappSubtitle || 'Chatea ahora con un asesor de ventas'}</p>
                </div>
              </a>

              {/* Phone */}
              <a
                href={`tel:${safePhone.replace(/[\s-]+/g, '')}`}
                className="flex items-center gap-4 p-4 rounded-xl bg-stone-50 border border-stone-200 hover:bg-stone-100 transition-all group"
                id="contact-phone-direct-link"
              >
                <div className="w-12 h-12 rounded-xl bg-stone-800 text-white flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                  <Phone className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <span className="block text-xs font-bold uppercase tracking-wider text-stone-500">
                    Línea Telefónica Directa
                  </span>
                  <span className="text-stone-900 font-bold text-base">{safePhone}</span>
                  <p className="text-xs text-stone-500">{contactForm.scheduleText || 'Lunes a Sábado de 8:00 AM a 6:00 PM'}</p>
                </div>
              </a>

              {/* Email */}
              <a
                href={`mailto:${emailVal}`}
                className="flex items-center gap-4 p-4 rounded-xl bg-stone-50 border border-stone-200 hover:bg-stone-100 transition-all group"
                id="contact-email-direct-link"
              >
                <div className="w-12 h-12 rounded-xl bg-stone-800 text-white flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                  <Mail className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <span className="block text-xs font-bold uppercase tracking-wider text-stone-500">
                    Correo Electrónico Oficial
                  </span>
                  <span className="text-stone-900 font-bold text-sm sm:text-base break-all">{emailVal}</span>
                  <p className="text-xs text-stone-500">{contactForm.emailSubtitle || 'Para propuestas y acuerdos institucionales'}</p>
                </div>
              </a>

              {/* Sales Office Address */}
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-stone-800 text-white flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <span className="block text-xs font-bold uppercase tracking-wider text-stone-500">
                    Oficina de Ventas & Terreno
                  </span>
                  <p className="text-stone-900 font-semibold text-xs sm:text-sm mt-0.5">
                    {addressVal}
                  </p>
                </div>
              </div>

              {/* Social Media Links */}
              <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                <span className="text-xs font-semibold text-stone-600">Síguenos en redes:</span>
                <div className="flex items-center gap-2">
                  <a
                    href={site.socialMedia.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-lg bg-stone-100 hover:bg-emerald-100 text-stone-700 hover:text-emerald-800 flex items-center justify-center transition-colors"
                    title="Instagram"
                  >
                    <Instagram className="w-4 h-4" />
                  </a>
                  <a
                    href={site.socialMedia.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-lg bg-stone-100 hover:bg-emerald-100 text-stone-700 hover:text-emerald-800 flex items-center justify-center transition-colors"
                    title="Facebook"
                  >
                    <Facebook className="w-4 h-4" />
                  </a>
                  <a
                    href={site.socialMedia.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-lg bg-stone-100 hover:bg-emerald-100 text-stone-700 hover:text-emerald-800 flex items-center justify-center transition-colors"
                    title="YouTube"
                  >
                    <Youtube className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Conversion Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-xl">
              <h3 className="font-serif text-2xl font-bold text-stone-900 mb-2">
                {contactForm.formTitle || 'Solicita Información y Reserva'}
              </h3>
              <p className="text-xs sm:text-sm text-stone-500 mb-6">
                {contactForm.formSubtitle || 'Completa este formulario para recibir el catálogo de lotes, planos de viviendas y ficha técnica oficial.'}
              </p>

              {successMessage && (
                <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-bold text-sm">¡Solicitud recibida con éxito!</strong>
                    <p className="text-xs sm:text-sm mt-0.5">{successMessage}</p>
                  </div>
                </div>
              )}

              {errorMessage && (
                <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-300 text-rose-900 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs sm:text-sm">{errorMessage}</p>
                </div>
              )}

              <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-4" id="lead-conversion-form">
                {/* Anti-spam honeypot (hidden) */}
                <input
                  type="text"
                  name="website_url"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  style={{ display: 'none' }}
                  tabIndex={-1}
                  autoComplete="off"
                />

                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5" htmlFor="field-name">
                    Nombre completo *
                  </label>
                  <input
                    id="field-name"
                    type="text"
                    required
                    placeholder="Ej. Juan Pérez"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-stone-300 bg-stone-50 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                  />
                </div>

                {/* Email & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5" htmlFor="field-email">
                      Correo electrónico *
                    </label>
                    <input
                      id="field-email"
                      type="email"
                      required
                      placeholder="tucorreo@ejemplo.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-stone-300 bg-stone-50 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5" htmlFor="field-phone">
                      Teléfono / WhatsApp *
                    </label>
                    <input
                      id="field-phone"
                      type="tel"
                      required
                      placeholder="+58 414 1234567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-stone-300 bg-stone-50 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                {/* Profile Interest Selection */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Perfil de interés:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setProfileInterest('ecologico')}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                        profileInterest === 'ecologico'
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                          : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      Ecológico
                    </button>
                    <button
                      type="button"
                      onClick={() => setProfileInterest('hogar')}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                        profileInterest === 'hogar'
                          ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                          : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      Hogar y Familia
                    </button>
                    <button
                      type="button"
                      onClick={() => setProfileInterest('inversionista')}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                        profileInterest === 'inversionista'
                          ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                          : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      Inversionista
                    </button>
                  </div>
                </div>

                {/* Optional Selected Lot / Model Indicator */}
                {(lotPref || modelPref) && (
                  <div className="p-3 bg-stone-100 rounded-xl flex items-center justify-between text-xs text-stone-700 border border-stone-200">
                    <div>
                      {lotPref && <span className="font-semibold block">Lote de Interés: {lotPref}</span>}
                      {modelPref && <span className="text-stone-500">Modelo: {modelPref}</span>}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setLotPref('');
                        setModelPref('');
                      }}
                      className="text-stone-400 hover:text-stone-600 text-[11px] underline"
                    >
                      Quitar
                    </button>
                  </div>
                )}

                {/* Message */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5" htmlFor="field-message">
                    Mensaje o consulta (opcional)
                  </label>
                  <textarea
                    id="field-message"
                    rows={3}
                    placeholder="Escribe aquí cualquier pregunta específica, preferencia de manzana o fecha para agendar visita..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-stone-300 bg-stone-50 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                  />
                </div>

                {/* Privacy Policy Checkbox */}
                <div className="flex items-start gap-2.5 pt-1">
                  <input
                    id="field-privacy"
                    type="checkbox"
                    checked={agreePrivacy}
                    onChange={(e) => setAgreePrivacy(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded text-emerald-600 accent-emerald-600 border-stone-300 focus:ring-emerald-500 cursor-pointer"
                  />
                  <label htmlFor="field-privacy" className="text-xs text-stone-600 cursor-pointer select-none">
                    {contactForm.privacyPolicyText}
                  </label>
                </div>

                {/* Dual Action Buttons */}
                <div className="pt-3 flex flex-col sm:flex-row gap-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 shadow-lg shadow-amber-950/20 hover:shadow-amber-500/20 transition-all disabled:opacity-60"
                    id="btn-submit-form"
                  >
                    {loading ? (
                      <span>Enviando solicitud...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>{contactForm.submitButtonText || 'Enviar solicitud'}</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    disabled={loading}
                    onClick={(e) => handleSubmit(e, true)}
                    className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-semibold text-sm border border-stone-300 bg-white hover:bg-stone-50 text-stone-800 transition-colors shadow-sm disabled:opacity-60"
                    id="btn-solicitar-llamada"
                  >
                    <Phone className="w-4 h-4 text-emerald-700" />
                    <span>{contactForm.callButtonText || 'Solicitar llamada'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
