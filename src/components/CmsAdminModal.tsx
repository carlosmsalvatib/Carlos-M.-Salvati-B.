import React, { useState, useEffect } from 'react';
import { CmsContent, LotItem, LeadSubmission, LotStatus, AppUser, HousingModel, PropuestaVideo, MasterPlanBlueprint, UserLevel } from '../types';
import {
  updateContent,
  updateLot,
  getLeads,
  updateLeadStatus,
  saveBulkLots,
  createLot,
  deleteLot,
  saveAllCmsAndLots,
  fetchHousingModels,
  saveHousingModelsBulk,
} from '../lib/api';
import { UsersCmsTab } from './UsersCmsTab';
import {
  USER_LEVEL_DEFINITIONS,
  getUserLevelInfo,
  isFounderSuperUser,
  canAccessTab,
  CmsTabType,
} from '../lib/permissions';
import {
  X,
  Save,
  Settings,
  Layers,
  Users,
  Home,
  RefreshCw,
  MessageSquare,
  Check,
  ExternalLink,
  Trash2,
  Plus,
  Video,
  FileText,
  Image as ImageIcon,
  MapPin,
  DollarSign,
  TreePine,
  Shield,
  Download,
  AlertCircle,
  Lock,
  Crown,
  Eye,
  Sliders,
  ShieldAlert,
  Sparkles,
  FolderArchive,
  HardDrive,
  Globe,
  Edit3,
  Copy,
  ArrowUp,
  ArrowDown,
  CheckCircle2,
} from 'lucide-react';
import { MediaFieldWithSourceSelector } from './MediaFieldWithSourceSelector';
import { MediaSourceSelectorModal } from './MediaSourceSelectorModal';

interface CmsAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: CmsContent;
  lots: LotItem[];
  currentUser?: Partial<AppUser> | null;
  onContentUpdated: (newContent: CmsContent) => void;
  onLotsUpdated: (newLots: LotItem[]) => void;
}

export const CmsAdminModal: React.FC<CmsAdminModalProps> = ({
  isOpen,
  onClose,
  content,
  lots,
  currentUser,
  onContentUpdated,
  onLotsUpdated,
}) => {
  if (!isOpen) return null;

  type TabType = CmsTabType;

  // Role simulation state (allows Carlos Salvati & Audy Palacio to preview other roles)
  const [simulatedRole, setSimulatedRole] = useState<UserLevel | null>(null);
  const effectiveUser = simulatedRole
    ? {
        ...currentUser,
        level: simulatedRole,
        levelName: getUserLevelInfo(simulatedRole).name,
      }
    : currentUser;

  const userLevel = (effectiveUser?.level && effectiveUser.level >= 1 && effectiveUser.level <= 5
    ? effectiveUser.level
    : 5) as UserLevel;
  const levelInfo = getUserLevelInfo(userLevel);
  const isFounder = isFounderSuperUser(currentUser);
  const isRealSuperUser = currentUser?.level === 1;

  // Determine initial tab based on permissions
  const [activeTab, setActiveTab] = useState<TabType>(() => {
    if (canAccessTab(userLevel, 'general')) return 'general';
    return (levelInfo.allowedTabs[0] as TabType) || 'lotes';
  });

  // Switch tab if role simulation or level prevents access to current activeTab
  useEffect(() => {
    if (!canAccessTab(userLevel, activeTab)) {
      const allowed = levelInfo.allowedTabs;
      if (allowed && allowed.length > 0) {
        setActiveTab(allowed[0] as TabType);
      }
    }
  }, [userLevel]);

  const [formData, setFormData] = useState<CmsContent>(content);
  const [localLots, setLocalLots] = useState<LotItem[]>(lots);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [savingLots, setSavingLots] = useState(false);
  const [lotsSaveSuccess, setLotsSaveSuccess] = useState(false);
  const [leadsList, setLeadsList] = useState<LeadSubmission[]>([]);
  const [loadingLeads, setLoadingLeads] = useState(false);

  // Selected housing model for detailed image editing
  const [selectedModelId, setSelectedModelId] = useState<string>('modelo-a');
  const [newImageUrl, setNewImageUrl] = useState<string>('');
  const [editingModelImageIndex, setEditingModelImageIndex] = useState<number | null>(null);
  const [isAddingNewModel, setIsAddingNewModel] = useState<boolean>(false);
  const [modelsSaveSuccess, setModelsSaveSuccess] = useState<boolean>(false);
  const [savingModelsSection, setSavingModelsSection] = useState<boolean>(false);
  const [newBenefitText, setNewBenefitText] = useState<string>('');
  const [newModelForm, setNewModelForm] = useState<{
    name: string;
    tagline: string;
    areaM2: number;
    pricePerM2Usd: number;
    priceUsd: number;
    description: string;
    bedrooms: number;
    bathrooms: number;
    terraceM2: number;
    levels: number;
    foundation: string;
    structure: string;
    initialImage: string;
    brochurePdfUrl: string;
  }>({
    name: '',
    tagline: 'Vanguardia Bioclimática y Acabados de Campo',
    areaM2: 100,
    pricePerM2Usd: 450,
    priceUsd: 45000,
    description: 'Vivienda campestre ecológica construida con estructura integral de Bambú Guadua.',
    bedrooms: 2,
    bathrooms: 2,
    terraceM2: 15,
    levels: 1,
    foundation: 'Losa flotante armada a 40 cm',
    structure: 'Bambú Guadua angustifolia tratado e inmunizado',
    initialImage: '/api/images/model-a-render',
    brochurePdfUrl: '',
  });

  // Video editing & creation inside propuesta
  const [editingVideoId, setEditingVideoId] = useState<string | null>(null);
  const [newVideoTitle, setNewVideoTitle] = useState('');
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [newVideoDuration, setNewVideoDuration] = useState('02:00');
  const [newVideoDesc, setNewVideoDesc] = useState('');

  // Blueprint editing & creation inside planMaestro
  const [editingBlueprintId, setEditingBlueprintId] = useState<string | null>(null);
  const [newBlueprintTitle, setNewBlueprintTitle] = useState('');
  const [newBlueprintSector, setNewBlueprintSector] = useState('Sector General');
  const [newBlueprintUrl, setNewBlueprintUrl] = useState('');
  const [newBlueprintDesc, setNewBlueprintDesc] = useState('');

  // New lot form
  const [newLotCode, setNewLotCode] = useState('');
  const [newLotManzana, setNewLotManzana] = useState('A1');
  const [newLotArea, setNewLotArea] = useState<number>(600);
  const [newLotLocation, setNewLotLocation] = useState<'alta' | 'baja'>('baja');

  useEffect(() => {
    setFormData(content);
  }, [content]);

  useEffect(() => {
    setLocalLots(lots);
  }, [lots]);

  const refreshModelsFromDb = async () => {
    try {
      const res = await fetchHousingModels();
      if (res.models && Array.isArray(res.models) && res.models.length > 0) {
        setFormData((prev) => ({
          ...prev,
          housingModels: {
            ...(prev.housingModels || {}),
            ...(res.section || {}),
            models: res.models,
          },
        }));
      }
    } catch (e) {
      console.warn('Error refrescando modelos desde DB:', e);
    }
  };

  useEffect(() => {
    if (activeTab === 'leads') {
      fetchLeads();
    } else if (activeTab === 'modelos') {
      refreshModelsFromDb();
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

  const handleSaveAll = async (shouldClose = false) => {
    setSaving(true);
    setSavingLots(true);
    try {
      // 1. Explicitly persist models to dedicated models database
      const currentModels = formData.housingModels?.models || [];
      if (currentModels.length > 0) {
        try {
          await saveHousingModelsBulk(currentModels, formData.housingModels);
        } catch (e) {
          console.warn('Error en sincronización dedicada de modelos:', e);
        }
      }

      // 2. Persist all CMS and lots simultaneously
      const result = await saveAllCmsAndLots(
        formData,
        localLots,
        `Sincronización global CMS (${new Date().toLocaleTimeString('es-VE')})`
      );
      setFormData(result.content);
      onContentUpdated(result.content);
      onLotsUpdated(result.lots);
      setSaveSuccess(true);
      setLotsSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        setLotsSaveSuccess(false);
      }, 3500);

      if (shouldClose) {
        onClose();
      }
    } catch (err) {
      alert('Error guardando en la base de datos: ' + err);
    } finally {
      setSaving(false);
      setSavingLots(false);
    }
  };

  const handleSaveContent = async () => {
    // Guarda tanto contenido como lotes para asegurar consistencia total
    await handleSaveAll(false);
  };

  // Requirement 11: "El catalogo de Disponibilidad debe poder grabarse y actualizarse."
  const handleSaveAllLots = async () => {
    await handleSaveAll(false);
  };

  const handleCloseModal = () => {
    const hasContentChanges = JSON.stringify(formData) !== JSON.stringify(content);
    const hasLotChanges = JSON.stringify(localLots) !== JSON.stringify(lots);

    if (hasContentChanges || hasLotChanges) {
      // Auto-guarda y sincroniza al salir del CMS para que los cambios se reflejen de inmediato
      handleSaveAll(true);
    } else {
      onClose();
    }
  };

  const handleLocalLotStatusChange = (lotId: string, status: LotStatus) => {
    setLocalLots((prev) =>
      prev.map((l) => (l.id === lotId ? { ...l, status } : l))
    );
  };

  const handleLocalLotAreaChange = (lotId: string, areaM2: number) => {
    const pricePerM2 = formData.salesFinancing.pricePerM2Usd || 20;
    setLocalLots((prev) =>
      prev.map((l) =>
        l.id === lotId
          ? {
              ...l,
              areaM2,
              totalPriceUsd: Math.round(areaM2 * pricePerM2),
            }
          : l
      )
    );
  };

  const handleAddNewLot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLotCode.trim()) return;

    const pricePerM2 = formData.salesFinancing.pricePerM2Usd || 20;
    try {
      const created = await createLot({
        code: newLotCode.trim().toUpperCase(),
        manzana: newLotManzana.toUpperCase(),
        loteNum: newLotCode.replace(/\D/g, '') || '1',
        areaM2: Number(newLotArea),
        priceUsdPerM2: pricePerM2,
        pricePerM2Usd: pricePerM2,
        totalPriceUsd: Math.round(Number(newLotArea) * pricePerM2),
        status: 'disponible',
        location: newLotLocation,
        features: ['Agua de manantial', 'Vialidad compactada', 'Punto eléctrico'],
      });

      const updatedList = [...localLots, created];
      setLocalLots(updatedList);
      onLotsUpdated(updatedList);
      setNewLotCode('');
      alert(`Lote ${created.code} creado exitosamente.`);
    } catch (err) {
      alert('Error creando lote: ' + err);
    }
  };

  const handleDeleteLot = async (lotId: string, code: string) => {
    if (!confirm(`¿Eliminar el lote ${code}?`)) return;
    try {
      await deleteLot(lotId);
      const updatedList = localLots.filter((l) => l.id !== lotId);
      setLocalLots(updatedList);
      onLotsUpdated(updatedList);
    } catch (err) {
      alert('Error eliminando lote: ' + err);
    }
  };

  // VIDEO RENDERS MANAGEMENT IN PROPUESTA
  const handleAddVideo = () => {
    if (!newVideoTitle.trim() || !newVideoUrl.trim()) return;
    const newVideo: PropuestaVideo = {
      id: 'vid-' + Date.now(),
      title: newVideoTitle,
      description: newVideoDesc || 'Render arquitectónico del proyecto',
      videoUrl: newVideoUrl,
      url: newVideoUrl,
      duration: newVideoDuration || '02:00',
      videoType: 'render_3d',
    };
    const currentVideos = formData.valueProp.videos || [];
    setFormData({
      ...formData,
      valueProp: {
        ...formData.valueProp,
        videos: [...currentVideos, newVideo],
      },
    });
    setNewVideoTitle('');
    setNewVideoUrl('');
    setNewVideoDesc('');
  };

  const handleDeleteVideo = (videoId: string) => {
    const currentVideos = formData.valueProp.videos || [];
    setFormData({
      ...formData,
      valueProp: {
        ...formData.valueProp,
        videos: currentVideos.filter((v) => v.id !== videoId),
      },
    });
    if (editingVideoId === videoId) setEditingVideoId(null);
  };

  const handleUpdateVideo = (videoId: string, updates: Partial<PropuestaVideo>) => {
    const currentVideos = formData.valueProp.videos || [];
    setFormData({
      ...formData,
      valueProp: {
        ...formData.valueProp,
        videos: currentVideos.map((v) => {
          if (v.id === videoId) {
            const next = { ...v, ...updates };
            if (updates.videoUrl) next.url = updates.videoUrl;
            if (updates.posterUrl) next.thumbnailUrl = updates.posterUrl;
            return next;
          }
          return v;
        }),
      },
    });
  };

  // BLUEPRINTS MANAGEMENT IN PLAN MAESTRO
  const handleAddBlueprint = () => {
    if (!newBlueprintTitle.trim() || !newBlueprintUrl.trim()) return;
    const newBlueprint: MasterPlanBlueprint = {
      id: 'bp-' + Date.now(),
      title: newBlueprintTitle,
      subtitle: newBlueprintSector,
      sector: newBlueprintSector,
      imageUrl: newBlueprintUrl,
      description: newBlueprintDesc || 'Plano oficial del proyecto',
    };
    const currentBlueprints = formData.masterPlan.blueprints || [];
    setFormData({
      ...formData,
      masterPlan: {
        ...formData.masterPlan,
        blueprints: [...currentBlueprints, newBlueprint],
      },
    });
    setNewBlueprintTitle('');
    setNewBlueprintUrl('');
    setNewBlueprintDesc('');
  };

  const handleDeleteBlueprint = (bpId: string) => {
    const currentBlueprints = formData.masterPlan.blueprints || [];
    setFormData({
      ...formData,
      masterPlan: {
        ...formData.masterPlan,
        blueprints: currentBlueprints.filter((b) => b.id !== bpId),
      },
    });
    if (editingBlueprintId === bpId) setEditingBlueprintId(null);
  };

  const handleUpdateBlueprint = (bpId: string, updates: Partial<MasterPlanBlueprint>) => {
    const currentBlueprints = formData.masterPlan.blueprints || [];
    setFormData({
      ...formData,
      masterPlan: {
        ...formData.masterPlan,
        blueprints: currentBlueprints.map((b) =>
          b.id === bpId ? { ...b, ...updates } : b
        ),
      },
    });
  };

  // HOUSING MODEL IMAGES MANAGEMENT (Requirement 10) & COMPLETE CRUD
  const currentSelectedModel =
    formData.housingModels?.models?.find((m) => m.id === selectedModelId) ||
    formData.housingModels?.models?.[0];

  const handleSaveModelsSection = async () => {
    setSavingModelsSection(true);
    try {
      const currentModels = formData.housingModels?.models || [];
      // 1. Explicitly persist to dedicated models.json database
      if (currentModels.length > 0) {
        await saveHousingModelsBulk(currentModels, formData.housingModels);
      }

      // 2. Also persist to global CMS content and lots
      const result = await saveAllCmsAndLots(
        formData,
        localLots,
        `Actualización Modelos de Vivienda (${new Date().toLocaleTimeString('es-VE')})`
      );
      setFormData(result.content);
      onContentUpdated(result.content);
      onLotsUpdated(result.lots);
      setModelsSaveSuccess(true);
      setTimeout(() => setModelsSaveSuccess(false), 4000);
    } catch (e: any) {
      console.error('Error guardando modelos:', e);
      alert('Error al sincronizar modelos de vivienda con el servidor: ' + (e?.message || e));
    } finally {
      setSavingModelsSection(false);
    }
  };

  const handleCreateNewModel = () => {
    if (!newModelForm.name.trim()) {
      alert('Por favor ingrese el nombre del nuevo modelo.');
      return;
    }
    const cleanId = `modelo-${newModelForm.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now().toString().slice(-4)}`;
    const newModel: HousingModel = {
      id: cleanId,
      name: newModelForm.name.trim(),
      tagline: newModelForm.tagline.trim() || 'Diseño bioclimático en Bambú Guadua',
      areaM2: Number(newModelForm.areaM2) || 100,
      pricePerM2Usd: Number(newModelForm.pricePerM2Usd) || 450,
      priceUsd: Number(newModelForm.priceUsd) || ((Number(newModelForm.areaM2) || 100) * (Number(newModelForm.pricePerM2Usd) || 450)),
      description: newModelForm.description.trim() || 'Vivienda campestre ecológica construida con estructura integral de Bambú Guadua.',
      benefits: [
        'Terrazas mirador con vistas a la cordillera',
        'Ventilación bioclimática cruzada continua',
        'Estructura sismorresistente en Bambú Guadua seleccionada',
        'Losa flotante de concreto armada a 40 cm'
      ],
      specs: {
        levels: Number(newModelForm.levels) || 1,
        bedrooms: Number(newModelForm.bedrooms) || 2,
        bathrooms: Number(newModelForm.bathrooms) || 2,
        terraceM2: Number(newModelForm.terraceM2) || 15,
        foundation: newModelForm.foundation || 'Losa flotante armada a 40 cm',
        structure: newModelForm.structure || 'Bambú Guadua angustifolia tratado e inmunizado',
      },
      images: [newModelForm.initialImage || '/api/images/model-a-render'],
      brochurePdfUrl: newModelForm.brochurePdfUrl || '',
      showPrice: true,
      active: true,
    };

    const nextModels = [...(formData.housingModels?.models || []), newModel];
    setFormData({
      ...formData,
      housingModels: {
        ...formData.housingModels,
        models: nextModels,
      },
    });
    setSelectedModelId(newModel.id);
    setIsAddingNewModel(false);
    setNewModelForm({
      name: '',
      tagline: 'Vanguardia Bioclimática y Acabados de Campo',
      areaM2: 100,
      pricePerM2Usd: 450,
      priceUsd: 45000,
      description: 'Vivienda campestre ecológica construida con estructura integral de Bambú Guadua.',
      bedrooms: 2,
      bathrooms: 2,
      terraceM2: 15,
      levels: 1,
      foundation: 'Losa flotante armada a 40 cm',
      structure: 'Bambú Guadua angustifolia tratado e inmunizado',
      initialImage: '/api/images/model-a-render',
      brochurePdfUrl: '',
    });
  };

  const handleDeleteModel = (modelId: string) => {
    if ((formData.housingModels?.models || []).length <= 1) {
      alert('Debe existir al menos un modelo de vivienda en el catálogo.');
      return;
    }
    const target = formData.housingModels?.models?.find((m) => m.id === modelId);
    if (!confirm(`¿Está seguro de eliminar permanentemente el registro "${target?.name || modelId}"?`)) {
      return;
    }
    const updated = (formData.housingModels?.models || []).filter((m) => m.id !== modelId);
    setFormData({
      ...formData,
      housingModels: {
        ...formData.housingModels,
        models: updated,
      },
    });
    if (selectedModelId === modelId && updated.length > 0) {
      setSelectedModelId(updated[0].id);
    }
  };

  const handleDuplicateModel = (modelId: string) => {
    const target = formData.housingModels?.models?.find((m) => m.id === modelId);
    if (!target) return;
    const newId = `${target.id}-copia-${Date.now().toString().slice(-4)}`;
    const duplicated: HousingModel = {
      ...target,
      id: newId,
      name: `${target.name} (Copia)`,
      images: [...(target.images || [])],
      benefits: [...(target.benefits || [])],
      specs: { ...(target.specs || { levels: 1, bedrooms: 2, bathrooms: 2, terraceM2: 15, foundation: 'Losa armada', structure: 'Bambú Guadua' }) },
    };
    const updated = [...(formData.housingModels?.models || []), duplicated];
    setFormData({
      ...formData,
      housingModels: {
        ...formData.housingModels,
        models: updated,
      },
    });
    setSelectedModelId(newId);
  };

  const handleSetCoverImage = (modelId: string, imageIndex: number) => {
    if (imageIndex === 0) return;
    const updated = (formData.housingModels?.models || []).map((m) => {
      if (m.id === modelId) {
        const imgs = [...(m.images || [])];
        const [moved] = imgs.splice(imageIndex, 1);
        imgs.unshift(moved);
        return { ...m, images: imgs };
      }
      return m;
    });
    setFormData({
      ...formData,
      housingModels: { ...formData.housingModels, models: updated },
    });
  };

  const handleMoveModelImage = (modelId: string, fromIndex: number, toIndex: number) => {
    const updated = (formData.housingModels?.models || []).map((m) => {
      if (m.id === modelId) {
        const imgs = [...(m.images || [])];
        if (toIndex < 0 || toIndex >= imgs.length) return m;
        const [moved] = imgs.splice(fromIndex, 1);
        imgs.splice(toIndex, 0, moved);
        return { ...m, images: imgs };
      }
      return m;
    });
    setFormData({
      ...formData,
      housingModels: { ...formData.housingModels, models: updated },
    });
  };

  const handleAddBenefitToModel = (modelId: string, text: string) => {
    if (!text.trim()) return;
    const updated = (formData.housingModels?.models || []).map((m) => {
      if (m.id === modelId) {
        return { ...m, benefits: [...(m.benefits || []), text.trim()] };
      }
      return m;
    });
    setFormData({
      ...formData,
      housingModels: { ...formData.housingModels, models: updated },
    });
    setNewBenefitText('');
  };

  const handleUpdateBenefit = (modelId: string, benefitIndex: number, newText: string) => {
    const updated = (formData.housingModels?.models || []).map((m) => {
      if (m.id === modelId) {
        const b = [...(m.benefits || [])];
        b[benefitIndex] = newText;
        return { ...m, benefits: b };
      }
      return m;
    });
    setFormData({
      ...formData,
      housingModels: { ...formData.housingModels, models: updated },
    });
  };

  const handleDeleteBenefit = (modelId: string, benefitIndex: number) => {
    const updated = (formData.housingModels?.models || []).map((m) => {
      if (m.id === modelId) {
        const b = [...(m.benefits || [])];
        b.splice(benefitIndex, 1);
        return { ...m, benefits: b };
      }
      return m;
    });
    setFormData({
      ...formData,
      housingModels: { ...formData.housingModels, models: updated },
    });
  };

  const handleAddImageToModel = (modelId: string) => {
    if (!newImageUrl.trim()) return;
    const updatedModels = (formData.housingModels?.models || []).map((m) => {
      if (m.id === modelId) {
        return {
          ...m,
          images: [...(m.images || []), newImageUrl.trim()],
        };
      }
      return m;
    });
    setFormData({
      ...formData,
      housingModels: {
        ...formData.housingModels,
        models: updatedModels,
      },
    });
    setNewImageUrl('');
  };

  const handleUpdateModelImage = (modelId: string, imageIndex: number, newUrl: string) => {
    if (!newUrl.trim()) return;
    const updatedModels = (formData.housingModels?.models || []).map((m) => {
      if (m.id === modelId) {
        const nextImages = [...(m.images || [])];
        nextImages[imageIndex] = newUrl.trim();
        return {
          ...m,
          images: nextImages,
        };
      }
      return m;
    });
    setFormData({
      ...formData,
      housingModels: {
        ...formData.housingModels,
        models: updatedModels,
      },
    });
  };

  const handleDeleteImageFromModel = (modelId: string, imageIndex: number) => {
    const updatedModels = (formData.housingModels?.models || []).map((m) => {
      if (m.id === modelId) {
        const nextImages = [...(m.images || [])];
        nextImages.splice(imageIndex, 1);
        return {
          ...m,
          images: nextImages.length > 0 ? nextImages : ['/api/images/model-a-render'],
        };
      }
      return m;
    });
    setFormData({
      ...formData,
      housingModels: {
        ...formData.housingModels,
        models: updatedModels,
      },
    });
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
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-hidden">
      <div className="bg-stone-900 border border-stone-700 text-stone-100 rounded-2xl w-full max-w-6xl h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* MODAL HEADER */}
        <div className="p-4 sm:p-5 border-b border-stone-800 flex items-center justify-between bg-stone-950">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif font-bold text-lg text-white">Panel Administrativo CMS</h2>
                {currentUser && (
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border flex items-center gap-1 ${
                      userLevel === 1
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : userLevel === 2
                        ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                        : userLevel === 3
                        ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                        : userLevel === 4
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : 'bg-stone-800 text-stone-300 border-stone-700'
                    }`}
                  >
                    {isFounder && <Crown className="w-3 h-3 text-amber-400" />}
                    <span>{levelInfo.badge}</span>
                    {effectiveUser?.name && (
                      <span className="text-stone-400">· {effectiveUser.name}</span>
                    )}
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-400">
                Gestión en tiempo real de contenidos, catálogo de lotes y control de acceso jerárquico
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/70 border border-emerald-500/40 text-[11px] font-semibold text-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>DB Conectada en Tiempo Real</span>
            </span>

            {(saveSuccess || lotsSaveSuccess) && (
              <span className="inline-flex items-center gap-1 text-xs text-emerald-400 font-semibold px-2.5 py-1 bg-emerald-950/60 border border-emerald-500/40 rounded-lg animate-fadeIn">
                <Check className="w-3.5 h-3.5" /> ¡Cambios Guardados y Aplicados!
              </span>
            )}

            <button
              onClick={() => handleSaveAll(false)}
              disabled={saving || savingLots || levelInfo.isReadOnly || (userLevel === 4 && activeTab !== 'lotes')}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-xs shadow-md transition-all ${
                levelInfo.isReadOnly || (userLevel === 4 && activeTab !== 'lotes')
                  ? 'bg-stone-800 text-stone-500 cursor-not-allowed border border-stone-700'
                  : 'bg-amber-500 hover:bg-amber-400 text-stone-950'
              }`}
              id="btn-save-all-cms"
              title={
                levelInfo.isReadOnly
                  ? 'Modo sólo lectura habilitado para Invitados'
                  : userLevel === 4 && activeTab !== 'lotes'
                  ? 'El nivel Vendedor gestiona disponibilidades en la pestaña Lotes'
                  : 'Guardar todos los cambios en la Base de Datos y aplicar al sitio en vivo'
              }
            >
              <Save className="w-4 h-4" />
              <span>
                {saving || savingLots
                  ? 'Guardando en DB...'
                  : levelInfo.isReadOnly
                  ? 'Sólo Lectura'
                  : userLevel === 4 && activeTab !== 'lotes'
                  ? 'Ventas: Edita Lotes'
                  : 'Guardar Todo en DB'}
              </span>
            </button>

            <button
              onClick={handleCloseModal}
              className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors"
              id="btn-close-cms-modal"
              title="Guardar y Salir"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* SIMULATION BAR FOR SUPERUSERS */}
        {simulatedRole && (
          <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-stone-950 px-4 py-2 text-xs font-bold flex items-center justify-between shadow-md">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              <span>
                Simulador de Perspectiva Activo: Explorando el CMS con privilegios de{' '}
                <span className="underline">{getUserLevelInfo(simulatedRole).badge}</span>
              </span>
            </div>
            <button
              onClick={() => setSimulatedRole(null)}
              className="px-2.5 py-1 rounded-lg bg-stone-950 hover:bg-stone-900 text-amber-300 hover:text-white text-[11px] font-bold transition-colors"
            >
              Restablecer a Superusuario
            </button>
          </div>
        )}

        {/* GUEST MODE NOTICE */}
        {!simulatedRole && userLevel === 5 && (
          <div className="bg-stone-800 text-stone-300 px-4 py-1.5 text-xs flex items-center gap-2 border-b border-stone-700">
            <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>
              <strong>Modo Sólo Lectura (Invitado):</strong> Tienes acceso de consulta e inspección, pero las operaciones de edición y guardado están protegidas.
            </span>
          </div>
        )}

        {/* CMS SECTION TABS (Each section has its own CMS) */}
        <div className="flex overflow-x-auto bg-stone-950/80 border-b border-stone-800 px-4 py-2 gap-1.5 text-xs scrollbar-none">
          <button
            onClick={() => setActiveTab('general')}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === 'general'
                ? 'bg-amber-500 text-stone-950 font-bold shadow'
                : canAccessTab(userLevel, 'general')
                ? 'text-stone-300 hover:bg-stone-800'
                : 'text-stone-500 hover:bg-stone-900 opacity-60'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>General & WhatsApp</span>
            {!canAccessTab(userLevel, 'general') && <Lock className="w-3 h-3 text-stone-500 ml-0.5" />}
          </button>

          <button
            onClick={() => setActiveTab('hero')}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === 'hero'
                ? 'bg-amber-500 text-stone-950 font-bold shadow'
                : canAccessTab(userLevel, 'hero')
                ? 'text-stone-300 hover:bg-stone-800'
                : 'text-stone-500 hover:bg-stone-900 opacity-60'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>Hero / Inicio</span>
            {!canAccessTab(userLevel, 'hero') && <Lock className="w-3 h-3 text-stone-500 ml-0.5" />}
          </button>

          <button
            onClick={() => setActiveTab('propuesta')}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === 'propuesta'
                ? 'bg-amber-500 text-stone-950 font-bold shadow'
                : canAccessTab(userLevel, 'propuesta')
                ? 'text-stone-300 hover:bg-stone-800'
                : 'text-stone-500 hover:bg-stone-900 opacity-60'
            }`}
          >
            <Video className="w-3.5 h-3.5 text-amber-300" />
            <span>Propuesta (Videos Render)</span>
            {!canAccessTab(userLevel, 'propuesta') && <Lock className="w-3 h-3 text-stone-500 ml-0.5" />}
          </button>

          <button
            onClick={() => setActiveTab('planMaestro')}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === 'planMaestro'
                ? 'bg-amber-500 text-stone-950 font-bold shadow'
                : canAccessTab(userLevel, 'planMaestro')
                ? 'text-stone-300 hover:bg-stone-800'
                : 'text-stone-500 hover:bg-stone-900 opacity-60'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-blue-300" />
            <span>Plan Maestro (Planos)</span>
            {!canAccessTab(userLevel, 'planMaestro') && <Lock className="w-3 h-3 text-stone-500 ml-0.5" />}
          </button>

          <button
            onClick={() => setActiveTab('lotes')}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === 'lotes'
                ? 'bg-amber-500 text-stone-950 font-bold shadow'
                : canAccessTab(userLevel, 'lotes')
                ? 'text-stone-300 hover:bg-stone-800'
                : 'text-stone-500 hover:bg-stone-900 opacity-60'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-emerald-300" />
            <span>Lotes & Disponibilidad ({localLots.length})</span>
            {!canAccessTab(userLevel, 'lotes') && <Lock className="w-3 h-3 text-stone-500 ml-0.5" />}
          </button>

          <button
            onClick={() => setActiveTab('modelos')}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === 'modelos'
                ? 'bg-amber-500 text-stone-950 font-bold shadow'
                : canAccessTab(userLevel, 'modelos')
                ? 'text-stone-300 hover:bg-stone-800'
                : 'text-stone-500 hover:bg-stone-900 opacity-60'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5 text-amber-300" />
            <span>Modelos (Múltiples Imágenes)</span>
            {!canAccessTab(userLevel, 'modelos') && <Lock className="w-3 h-3 text-stone-500 ml-0.5" />}
          </button>

          <button
            onClick={() => setActiveTab('ubicacion')}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === 'ubicacion'
                ? 'bg-amber-500 text-stone-950 font-bold shadow'
                : canAccessTab(userLevel, 'ubicacion')
                ? 'text-stone-300 hover:bg-stone-800'
                : 'text-stone-500 hover:bg-stone-900 opacity-60'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Ubicación</span>
            {!canAccessTab(userLevel, 'ubicacion') && <Lock className="w-3 h-3 text-stone-500 ml-0.5" />}
          </button>

          <button
            onClick={() => setActiveTab('financiamiento')}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === 'financiamiento'
                ? 'bg-amber-500 text-stone-950 font-bold shadow'
                : canAccessTab(userLevel, 'financiamiento')
                ? 'text-stone-300 hover:bg-stone-800'
                : 'text-stone-500 hover:bg-stone-900 opacity-60'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>Financiamiento</span>
            {!canAccessTab(userLevel, 'financiamiento') && <Lock className="w-3 h-3 text-stone-500 ml-0.5" />}
          </button>

          <button
            onClick={() => setActiveTab('sostenibilidad')}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === 'sostenibilidad'
                ? 'bg-amber-500 text-stone-950 font-bold shadow'
                : canAccessTab(userLevel, 'sostenibilidad')
                ? 'text-stone-300 hover:bg-stone-800'
                : 'text-stone-500 hover:bg-stone-900 opacity-60'
            }`}
          >
            <TreePine className="w-3.5 h-3.5" />
            <span>Sostenibilidad</span>
            {!canAccessTab(userLevel, 'sostenibilidad') && <Lock className="w-3 h-3 text-stone-500 ml-0.5" />}
          </button>

          {/* REQUIREMENT: Editable users section with 5 levels */}
          <button
            onClick={() => setActiveTab('usuarios')}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === 'usuarios'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-bold shadow-md'
                : canAccessTab(userLevel, 'usuarios')
                ? 'text-amber-300 hover:bg-stone-800 border border-amber-500/30'
                : 'text-stone-500 hover:bg-stone-900 opacity-60'
            }`}
            id="tab-cms-usuarios"
          >
            <Shield className="w-3.5 h-3.5 text-amber-400" />
            <span>Usuarios (5 Niveles)</span>
            {!canAccessTab(userLevel, 'usuarios') && <Lock className="w-3 h-3 text-stone-500 ml-0.5" />}
          </button>

          <button
            onClick={() => setActiveTab('leads')}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === 'leads'
                ? 'bg-amber-500 text-stone-950 font-bold shadow'
                : canAccessTab(userLevel, 'leads')
                ? 'text-stone-300 hover:bg-stone-800'
                : 'text-stone-500 hover:bg-stone-900 opacity-60'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Prospectos ({leadsList.length})</span>
            {!canAccessTab(userLevel, 'leads') && <Lock className="w-3 h-3 text-stone-500 ml-0.5" />}
          </button>
        </div>

        {/* TAB CONTENT BODY */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* ACCESS DENIAL GATE IF TAB IS RESTRICTED FOR THIS USER LEVEL */}
          {!canAccessTab(userLevel, activeTab) ? (
            <div className="py-12 px-6 max-w-xl mx-auto text-center space-y-5 bg-stone-950/80 rounded-2xl border border-red-500/30 shadow-2xl animate-fadeIn my-6">
              <div className="w-16 h-16 rounded-2xl bg-red-950/70 border border-red-500/50 text-red-400 flex items-center justify-center mx-auto shadow-inner">
                <Lock className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold text-white">
                  Módulo Restringido para {levelInfo.badge}
                </h3>
                <p className="text-xs sm:text-sm text-stone-300 mt-2 leading-relaxed">
                  Tu rol asignado en el sistema (<strong>{levelInfo.name}</strong>) no cuenta con autorización para acceder a esta pestaña del CMS.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-stone-900 border border-stone-800 text-left text-xs space-y-2">
                <div className="font-semibold text-amber-400 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4" />
                  <span>Control Constitucional de Acceso</span>
                </div>
                <p className="text-stone-400 text-[11px] leading-relaxed">
                  Los Superusuarios fundadores <strong className="text-amber-300">Carlos Salvati</strong> y <strong className="text-amber-300">Audy Palacio</strong> poseen la custodia exclusiva para gestionar, elevar o autorizar los rangos de operación en el CMS.
                </p>
              </div>
              <div className="pt-2 flex flex-wrap justify-center gap-2">
                {levelInfo.allowedTabs.length > 0 && (
                  <button
                    onClick={() => setActiveTab(levelInfo.allowedTabs[0] as TabType)}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow transition-all"
                  >
                    Ir a mi módulo principal ({levelInfo.allowedTabs[0]})
                  </button>
                )}
                {isRealSuperUser && (
                  <button
                    onClick={() => setSimulatedRole(null)}
                    className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-300 font-bold text-xs transition-all"
                  >
                    Restablecer vista a Superusuario
                  </button>
                )}
              </div>
            </div>
          ) : (
            <>
          {/* TAB 1: GENERAL & WHATSAPP */}
          {activeTab === 'general' && (
            <div className="space-y-5 max-w-3xl">
              <h3 className="font-serif text-lg font-bold text-white border-b border-stone-800 pb-2">
                Configuración General y Canales de Comunicación
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-stone-300 mb-1 font-semibold">Nombre del Proyecto</label>
                  <input
                    type="text"
                    value={formData.site.projectName}
                    onChange={(e) =>
                      setFormData({ ...formData, site: { ...formData.site, projectName: e.target.value } })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-stone-800 border border-stone-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-stone-300 mb-1 font-semibold">Slogan Principal</label>
                  <input
                    type="text"
                    value={formData.site.tagline}
                    onChange={(e) =>
                      setFormData({ ...formData, site: { ...formData.site, tagline: e.target.value } })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-stone-800 border border-stone-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-stone-300 mb-1 font-semibold">Teléfono / WhatsApp Oficial *</label>
                  <input
                    type="text"
                    value={formData.site.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, site: { ...formData.site, phone: e.target.value } })
                    }
                    placeholder="+58 414-7187596"
                    className="w-full px-3 py-2 rounded-lg bg-stone-800 border border-stone-700 text-white"
                  />
                  <p className="text-[10px] text-stone-400 mt-1">
                    Número vinculado al botón interactivo de WhatsApp en todo el sitio.
                  </p>
                </div>
                <div>
                  <label className="block text-stone-300 mb-1 font-semibold">Correo Electrónico</label>
                  <input
                    type="email"
                    value={formData.site.email}
                    onChange={(e) =>
                      setFormData({ ...formData, site: { ...formData.site, email: e.target.value } })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-stone-800 border border-stone-700 text-white"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-stone-300 mb-1 font-semibold">Dirección Oficial del Terreno</label>
                  <input
                    type="text"
                    value={formData.site.address}
                    onChange={(e) =>
                      setFormData({ ...formData, site: { ...formData.site, address: e.target.value } })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-stone-800 border border-stone-700 text-white"
                  />
                </div>

                <div className="sm:col-span-2 pt-3 border-t border-stone-800 space-y-4">
                  <h4 className="font-serif font-bold text-white text-sm flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-amber-400" />
                    <span>Identidad Gráfica y Medios de Marca</span>
                  </h4>
                  <MediaFieldWithSourceSelector
                    id="site-logo-media-selector"
                    label="Logotipo Oficial del Complejo (Navbar y Pie de Página)"
                    value={formData.site.logoUrl || ''}
                    onChange={(newUrl) =>
                      setFormData({
                        ...formData,
                        site: { ...formData.site, logoUrl: newUrl },
                      })
                    }
                    mediaType="image"
                    placeholder="Suba su logo en PNG/SVG, elija de la biblioteca o pegue URL..."
                    helperText="Logotipo en formato SVG o PNG transparente visible en el encabezado principal y pie de página."
                  />
                  <MediaFieldWithSourceSelector
                    id="seo-ogimage-media-selector"
                    label="Imagen Social de Vista Previa (Compartir por WhatsApp y Redes)"
                    value={formData.seo?.ogImage || ''}
                    onChange={(newUrl) =>
                      setFormData({
                        ...formData,
                        seo: { ...formData.seo, ogImage: newUrl },
                      })
                    }
                    mediaType="image"
                    placeholder="Seleccione la imagen para previsualizar al compartir en WhatsApp..."
                    helperText="Esta imagen aparece automáticamente como miniatura en WhatsApp, Telegram o Facebook al enviar el enlace del proyecto."
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: HERO */}
          {activeTab === 'hero' && (
            <div className="space-y-4 max-w-3xl">
              <h3 className="font-serif text-lg font-bold text-white border-b border-stone-800 pb-2">
                Contenidos de la Portada / Sección Hero
              </h3>
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-stone-300 mb-1 font-semibold">Título Principal</label>
                  <input
                    type="text"
                    value={formData.hero.headline}
                    onChange={(e) =>
                      setFormData({ ...formData, hero: { ...formData.hero, headline: e.target.value } })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-stone-800 border border-stone-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-stone-300 mb-1 font-semibold">Subtítulo / Mensaje de Preventa</label>
                  <textarea
                    rows={3}
                    value={formData.hero.subheadline}
                    onChange={(e) =>
                      setFormData({ ...formData, hero: { ...formData.hero, subheadline: e.target.value } })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-stone-800 border border-stone-700 text-white"
                  />
                </div>
                <div className="pt-1">
                  <MediaFieldWithSourceSelector
                    id="hero-bg-media-selector"
                    label="Imagen de Fondo / Render de Portada Hero"
                    value={formData.hero.backgroundImage || (formData.hero as any).backgroundImageUrl || ''}
                    onChange={(newUrl) =>
                      setFormData({
                        ...formData,
                        hero: {
                          ...formData.hero,
                          backgroundImage: newUrl,
                          backgroundImageUrl: newUrl,
                        },
                      })
                    }
                    mediaType="image"
                    placeholder="Suba un archivo, seleccione de la biblioteca del ranch o pegue una URL..."
                    helperText="Render panorámico en alta definición o paisaje andino de Sabana Larga y Cordero."
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PROPUESTA DE VALOR & GESTOR DE VIDEOS RENDER */}
          {activeTab === 'propuesta' && (
            <div className="space-y-6 max-w-4xl">
              <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                <div>
                  <h3 className="font-serif text-lg font-bold text-white">
                    Propuesta de Valor & Renders de Video
                  </h3>
                  <p className="text-xs text-stone-400">
                    Carga y administra los videos de recorridos virtuales 3D y vuelos de dron que se mostrarán en la sección.
                  </p>
                </div>
              </div>

              {/* General Propuesta Text Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="sm:col-span-2">
                  <label className="block text-stone-300 mb-1 font-semibold">Título de la Sección</label>
                  <input
                    type="text"
                    value={formData.valueProp.title}
                    onChange={(e) =>
                      setFormData({ ...formData, valueProp: { ...formData.valueProp, title: e.target.value } })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-stone-800 border border-stone-700 text-white"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-stone-300 mb-1 font-semibold">Descripción</label>
                  <textarea
                    rows={2}
                    value={formData.valueProp.description}
                    onChange={(e) =>
                      setFormData({ ...formData, valueProp: { ...formData.valueProp, description: e.target.value } })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-stone-800 border border-stone-700 text-white"
                  />
                </div>
                <div className="sm:col-span-2 pt-1">
                  <MediaFieldWithSourceSelector
                    id="valueprop-terrain-media"
                    label="Fotografía / Render del Terreno Real (Sabana Larga)"
                    value={formData.valueProp.imageUrl || ''}
                    onChange={(newUrl) =>
                      setFormData({
                        ...formData,
                        valueProp: {
                          ...formData.valueProp,
                          imageUrl: newUrl,
                        },
                      })
                    }
                    mediaType="image"
                    placeholder="Seleccione origen: Subir archivo, Biblioteca del Ranch o Enlace Web..."
                    helperText="Imagen del terreno y paisaje montañoso mostrada en la vista previa del proyecto."
                  />
                </div>
              </div>

              {/* VIDEOS RENDER LIST */}
              <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-4">
                <h4 className="font-serif font-bold text-white text-sm flex items-center gap-2">
                  <Video className="w-4 h-4 text-amber-400" />
                  <span>Videos Render Cargados en la Sección ({formData.valueProp.videos?.length || 0})</span>
                </h4>

                <div className="space-y-3">
                  {(formData.valueProp.videos || []).map((vid, idx) => {
                    const isEditing = editingVideoId === vid.id;
                    return (
                      <div
                        key={vid.id || idx}
                        className={`p-3 rounded-xl bg-stone-900 border transition-all text-xs ${
                          isEditing ? 'border-amber-500/80 shadow-lg' : 'border-stone-800 hover:border-stone-700'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2.5 flex-1 min-w-0">
                            <div className="p-2 rounded-lg bg-stone-800 text-amber-400 flex-shrink-0">
                              <Video className="w-4 h-4" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-white truncate">{vid.title}</span>
                                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 text-[10px] font-mono flex-shrink-0">
                                  {vid.duration || '02:00'}
                                </span>
                              </div>
                              <p className="text-stone-400 text-[11px] truncate mt-0.5 font-mono">
                                {vid.url || vid.videoUrl}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            <button
                              type="button"
                              onClick={() => setEditingVideoId(isEditing ? null : vid.id)}
                              className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 text-xs font-semibold transition-colors ${
                                isEditing
                                  ? 'bg-amber-500 text-stone-950 font-bold'
                                  : 'bg-stone-800 hover:bg-stone-700 text-stone-300'
                              }`}
                              title={isEditing ? 'Cerrar edición' : 'Editar archivo de video y datos'}
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>{isEditing ? 'Listo' : 'Editar'}</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteVideo(vid.id)}
                              className="p-1.5 rounded-lg bg-stone-800 hover:bg-red-900/60 text-stone-400 hover:text-red-300 transition-colors"
                              title="Eliminar video render"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* EXPANDABLE INLINE VIDEO EDITOR */}
                        {isEditing && (
                          <div className="mt-3 pt-3 border-t border-stone-800/80 space-y-3 bg-stone-950/60 p-3 rounded-lg">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                              <div className="sm:col-span-2">
                                <label className="block text-stone-300 mb-1 font-semibold">Título del Render</label>
                                <input
                                  type="text"
                                  value={vid.title}
                                  onChange={(e) => handleUpdateVideo(vid.id, { title: e.target.value })}
                                  className="w-full px-3 py-1.5 rounded bg-stone-900 border border-stone-700 text-white"
                                />
                              </div>
                              <div>
                                <label className="block text-stone-300 mb-1 font-semibold">Duración (mm:ss)</label>
                                <input
                                  type="text"
                                  value={vid.duration || ''}
                                  onChange={(e) => handleUpdateVideo(vid.id, { duration: e.target.value })}
                                  className="w-full px-3 py-1.5 rounded bg-stone-900 border border-stone-700 text-white"
                                />
                              </div>
                              <div className="sm:col-span-3">
                                <label className="block text-stone-300 mb-1 font-semibold">Descripción del Video</label>
                                <textarea
                                  rows={2}
                                  value={vid.description || ''}
                                  onChange={(e) => handleUpdateVideo(vid.id, { description: e.target.value })}
                                  className="w-full px-3 py-1.5 rounded bg-stone-900 border border-stone-700 text-white"
                                />
                              </div>
                              <div className="sm:col-span-3">
                                <MediaFieldWithSourceSelector
                                  id={`edit-video-url-${vid.id}`}
                                  label="Archivo o Enlace de Video a Mostrar (Seleccione Origen)"
                                  value={vid.videoUrl || vid.url || ''}
                                  onChange={(newUrl) =>
                                    handleUpdateVideo(vid.id, {
                                      videoUrl: newUrl,
                                      url: newUrl,
                                    })
                                  }
                                  mediaType="video"
                                  placeholder="Suba video MP4 de su PC, elija de la biblioteca o pegue enlace..."
                                  helperText="Puede seleccionar un archivo MP4 desde su equipo, biblioteca del ranch o enlace de YouTube/Vimeo."
                                />
                              </div>
                              <div className="sm:col-span-3">
                                <MediaFieldWithSourceSelector
                                  id={`edit-video-poster-${vid.id}`}
                                  label="Miniatura / Portada del Video (Opcional)"
                                  value={vid.posterUrl || vid.thumbnailUrl || ''}
                                  onChange={(newUrl) =>
                                    handleUpdateVideo(vid.id, {
                                      posterUrl: newUrl,
                                      thumbnailUrl: newUrl,
                                    })
                                  }
                                  mediaType="image"
                                  placeholder="Seleccione origen para la portada del video..."
                                  helperText="Imagen mostrada en el reproductor antes de reproducir el video."
                                />
                              </div>
                            </div>
                            <div className="text-right pt-1">
                              <button
                                type="button"
                                onClick={() => setEditingVideoId(null)}
                                className="px-3 py-1.5 rounded bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs"
                              >
                                Listo / Guardar Video
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* ADD NEW VIDEO RENDER FORM */}
                <div className="p-3.5 rounded-lg bg-stone-900/90 border border-stone-700/80 space-y-3 pt-4">
                  <h5 className="font-semibold text-amber-400 text-xs flex items-center gap-1.5">
                    <Plus className="w-3.5 h-3.5" />
                    <span>Cargar Nuevo Render de Video</span>
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="sm:col-span-2">
                      <label className="block text-stone-400 mb-1">Título del Render</label>
                      <input
                        type="text"
                        value={newVideoTitle}
                        onChange={(e) => setNewVideoTitle(e.target.value)}
                        placeholder="ej. Recorrido 3D en Alta Definición"
                        className="w-full px-3 py-1.5 rounded bg-stone-950 border border-stone-700 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-400 mb-1">Duración (mm:ss)</label>
                      <input
                        type="text"
                        value={newVideoDuration}
                        onChange={(e) => setNewVideoDuration(e.target.value)}
                        placeholder="02:30"
                        className="w-full px-3 py-1.5 rounded bg-stone-950 border border-stone-700 text-white"
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <MediaFieldWithSourceSelector
                        id="new-video-render-source"
                        label="Archivo o Enlace del Render de Video"
                        value={newVideoUrl}
                        onChange={setNewVideoUrl}
                        onMetadataSelected={(meta) => {
                          if (meta.title && !newVideoTitle) {
                            setNewVideoTitle(meta.title);
                          }
                        }}
                        mediaType="video"
                        placeholder="Suba un archivo MP4, enlace de YouTube / Vimeo o seleccione de la biblioteca..."
                        helperText="Soporta videos MP4 locales de su equipo, enlaces de YouTube/Vimeo y renders 3D oficiales."
                      />
                    </div>
                  </div>
                  <div className="text-right">
                    <button
                      type="button"
                      disabled={!newVideoUrl.trim() || !newVideoTitle.trim()}
                      onClick={handleAddVideo}
                      className={`px-4 py-2 rounded-lg font-bold text-xs transition-all ${
                        newVideoUrl.trim() && newVideoTitle.trim()
                          ? 'bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-md'
                          : 'bg-stone-800 text-stone-500 cursor-not-allowed'
                      }`}
                    >
                      Agregar Video Render al CMS
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PLAN MAESTRO & PLANOS ARQUITECTÓNICOS */}
          {activeTab === 'planMaestro' && (
            <div className="space-y-6 max-w-4xl">
              <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                <div>
                  <h3 className="font-serif text-lg font-bold text-white">
                    Plan Maestro & Planos Arquitectónicos Oficiales
                  </h3>
                  <p className="text-xs text-stone-400">
                    Carga y administra los planos del proyecto (lotificación general, sectores, bulevar) seleccionando el origen de cada archivo.
                  </p>
                </div>
              </div>

              {/* PLANO GENERAL PRINCIPAL DEL MASTER PLAN */}
              <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-4">
                <h4 className="font-serif font-bold text-white text-sm flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-amber-400" />
                  <span>Plano General Principal del Complejo</span>
                </h4>
                <div className="space-y-3">
                  <MediaFieldWithSourceSelector
                    id="masterplan-main-blueprint-selector"
                    label="Archivo del Plano General Principal (Lotificación 57 Lotes)"
                    value={formData.masterPlan.planImageUrl || ''}
                    onChange={(newUrl) =>
                      setFormData({
                        ...formData,
                        masterPlan: {
                          ...formData.masterPlan,
                          planImageUrl: newUrl,
                        },
                      })
                    }
                    mediaType="image"
                    placeholder="Seleccione origen: Subir archivo, Biblioteca del Ranch o Enlace Web..."
                    helperText="Plano arquitectónico maestro general visible como referencia principal de toda la sección del Plan Maestro."
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                    <div>
                      <label className="block text-stone-300 mb-1 font-semibold">Enlace a PDF Oficial de Descarga</label>
                      <input
                        type="text"
                        value={formData.masterPlan.planPdfUrl || ''}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            masterPlan: { ...formData.masterPlan, planPdfUrl: e.target.value },
                          })
                        }
                        placeholder="#plan-descarga o https://..."
                        className="w-full px-3 py-2 rounded-lg bg-stone-900 border border-stone-700 text-white font-mono text-[11px]"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-300 mb-1 font-semibold">Total de Lotes del Complejo</label>
                      <input
                        type="number"
                        value={formData.masterPlan.totalLots || 57}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            masterPlan: { ...formData.masterPlan, totalLots: Number(e.target.value) },
                          })
                        }
                        className="w-full px-3 py-2 rounded-lg bg-stone-900 border border-stone-700 text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Blueprints List */}
              <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-4">
                <h4 className="font-serif font-bold text-white text-sm flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-400" />
                  <span>Planos Registrados en el Sistema ({formData.masterPlan.blueprints?.length || 0})</span>
                </h4>

                <div className="space-y-3">
                  {(formData.masterPlan.blueprints || []).map((bp, idx) => {
                    const isEditing = editingBlueprintId === bp.id;
                    return (
                      <div
                        key={bp.id || idx}
                        className={`p-3 rounded-xl bg-stone-900 border transition-all text-xs ${
                          isEditing ? 'border-blue-500/80 shadow-lg' : 'border-stone-800 hover:border-stone-700'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <img
                              src={bp.imageUrl}
                              alt={bp.title}
                              className="w-16 h-12 object-cover rounded-lg border border-stone-700 bg-stone-950 flex-shrink-0"
                              referrerPolicy="no-referrer"
                            />
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-white truncate">{bp.title}</span>
                                <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[10px] flex-shrink-0">
                                  {bp.sector}
                                </span>
                              </div>
                              <p className="text-stone-400 text-[11px] truncate mt-0.5">{bp.subtitle}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            <button
                              type="button"
                              onClick={() => setEditingBlueprintId(isEditing ? null : bp.id)}
                              className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 text-xs font-semibold transition-colors ${
                                isEditing
                                  ? 'bg-blue-500 text-stone-950 font-bold'
                                  : 'bg-stone-800 hover:bg-stone-700 text-stone-300'
                              }`}
                              title={isEditing ? 'Cerrar edición' : 'Editar plano y origen del archivo'}
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>{isEditing ? 'Listo' : 'Editar'}</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteBlueprint(bp.id)}
                              className="p-1.5 rounded-lg bg-stone-800 hover:bg-red-900/60 text-stone-400 hover:text-red-300 transition-colors"
                              title="Eliminar plano"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* EXPANDABLE INLINE BLUEPRINT EDITOR */}
                        {isEditing && (
                          <div className="mt-3 pt-3 border-t border-stone-800/80 space-y-3 bg-stone-950/60 p-3 rounded-lg">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                              <div>
                                <label className="block text-stone-300 mb-1 font-semibold">Título del Plano</label>
                                <input
                                  type="text"
                                  value={bp.title}
                                  onChange={(e) => handleUpdateBlueprint(bp.id, { title: e.target.value })}
                                  className="w-full px-3 py-1.5 rounded bg-stone-900 border border-stone-700 text-white"
                                />
                              </div>
                              <div>
                                <label className="block text-stone-300 mb-1 font-semibold">Sector / Área</label>
                                <input
                                  type="text"
                                  value={bp.sector}
                                  onChange={(e) => handleUpdateBlueprint(bp.id, { sector: e.target.value })}
                                  className="w-full px-3 py-1.5 rounded bg-stone-900 border border-stone-700 text-white"
                                />
                              </div>
                              <div className="sm:col-span-2">
                                <label className="block text-stone-300 mb-1 font-semibold">Subtítulo / Descripción Corta</label>
                                <input
                                  type="text"
                                  value={bp.subtitle || ''}
                                  onChange={(e) => handleUpdateBlueprint(bp.id, { subtitle: e.target.value })}
                                  className="w-full px-3 py-1.5 rounded bg-stone-900 border border-stone-700 text-white"
                                />
                              </div>
                              <div className="sm:col-span-2">
                                <label className="block text-stone-300 mb-1 font-semibold">Descripción Detallada</label>
                                <textarea
                                  rows={2}
                                  value={bp.description || ''}
                                  onChange={(e) => handleUpdateBlueprint(bp.id, { description: e.target.value })}
                                  className="w-full px-3 py-1.5 rounded bg-stone-900 border border-stone-700 text-white"
                                />
                              </div>
                              <div className="sm:col-span-2">
                                <MediaFieldWithSourceSelector
                                  id={`edit-blueprint-source-${bp.id}`}
                                  label="Archivo o Imagen del Plano (Seleccione Origen)"
                                  value={bp.imageUrl}
                                  onChange={(newUrl) => handleUpdateBlueprint(bp.id, { imageUrl: newUrl })}
                                  onMetadataSelected={(meta) => {
                                    if (meta.title && !bp.title) {
                                      handleUpdateBlueprint(bp.id, { title: meta.title });
                                    }
                                  }}
                                  mediaType="image"
                                  placeholder="Suba plano en PNG/JPG/SVG, elija del catálogo o pegue URL..."
                                  helperText="Cambie el plano seleccionando: archivo local de su PC, biblioteca oficial o enlace web."
                                />
                              </div>
                            </div>
                            <div className="text-right pt-1">
                              <button
                                type="button"
                                onClick={() => setEditingBlueprintId(null)}
                                className="px-3 py-1.5 rounded bg-blue-500 hover:bg-blue-400 text-stone-950 font-bold text-xs"
                              >
                                Listo / Guardar Plano
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* ADD NEW BLUEPRINT FORM */}
                <div className="p-3.5 rounded-lg bg-stone-900/90 border border-stone-700/80 space-y-3 pt-4">
                  <h5 className="font-semibold text-blue-400 text-xs flex items-center gap-1.5">
                    <Plus className="w-3.5 h-3.5" />
                    <span>Cargar Nuevo Plano al CMS</span>
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block text-stone-400 mb-1">Título del Plano</label>
                      <input
                        type="text"
                        value={newBlueprintTitle}
                        onChange={(e) => setNewBlueprintTitle(e.target.value)}
                        placeholder="ej. Plano de Red de Agua Potable"
                        className="w-full px-3 py-1.5 rounded bg-stone-950 border border-stone-700 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-400 mb-1">Sector / Área</label>
                      <input
                        type="text"
                        value={newBlueprintSector}
                        onChange={(e) => setNewBlueprintSector(e.target.value)}
                        placeholder="Sector 1, Sector 2, etc."
                        className="w-full px-3 py-1.5 rounded bg-stone-950 border border-stone-700 text-white"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <MediaFieldWithSourceSelector
                        id="new-blueprint-media-source"
                        label="Archivo o Imagen del Plano Arquitectónico"
                        value={newBlueprintUrl}
                        onChange={setNewBlueprintUrl}
                        onMetadataSelected={(meta) => {
                          if (meta.title && !newBlueprintTitle) {
                            setNewBlueprintTitle(meta.title);
                          }
                        }}
                        mediaType="image"
                        placeholder="Suba plano en PNG/JPG/SVG, seleccione del catálogo o pegue URL..."
                        helperText="Soporta planos arquitectónicos oficiales (Lotificación 57 lotes, sectores, redes) y archivos locales."
                      />
                    </div>
                  </div>
                  <div className="text-right">
                    <button
                      type="button"
                      disabled={!newBlueprintUrl.trim() || !newBlueprintTitle.trim()}
                      onClick={handleAddBlueprint}
                      className={`px-4 py-2 rounded-lg font-bold text-xs transition-all ${
                        newBlueprintUrl.trim() && newBlueprintTitle.trim()
                          ? 'bg-blue-500 hover:bg-blue-400 text-stone-950 shadow-md'
                          : 'bg-stone-800 text-stone-500 cursor-not-allowed'
                      }`}
                    >
                      Agregar Plano al CMS
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: LOTES & DISPONIBILIDAD (Requirement 11) */}
          {activeTab === 'lotes' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif text-lg font-bold text-white">
                      Catálogo y Disponibilidad de Lotes (57 Parcelas)
                    </h3>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                      Grabación en Base de Datos
                    </span>
                  </div>
                  <p className="text-xs text-stone-400">
                    Modifica estados, áreas y guarda las actualizaciones directamente en tiempo real.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {lotsSaveSuccess && (
                    <span className="inline-flex items-center gap-1 text-xs text-emerald-400 font-semibold px-2.5 py-1 bg-emerald-950/60 border border-emerald-500/40 rounded-lg">
                      <Check className="w-3.5 h-3.5" /> ¡Catálogo Actualizado!
                    </span>
                  )}
                  <button
                    onClick={handleSaveAllLots}
                    disabled={savingLots}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all"
                    id="btn-save-lots-catalog"
                  >
                    <Save className="w-4 h-4" />
                    <span>{savingLots ? 'Grabando Lotes...' : 'Grabar y Actualizar Disponibilidad'}</span>
                  </button>
                </div>
              </div>

              {/* Add New Lot Quick Form */}
              <form onSubmit={handleAddNewLot} className="p-4 rounded-xl bg-stone-950 border border-stone-800 space-y-3 text-xs">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <Plus className="w-4 h-4 text-emerald-400" />
                  <span>Agregar Nueva Parcela al Inventario</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  <div>
                    <label className="block text-stone-400 mb-1">Código de Lote *</label>
                    <input
                      type="text"
                      required
                      placeholder="ej. H-01"
                      value={newLotCode}
                      onChange={(e) => setNewLotCode(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded bg-stone-900 border border-stone-700 text-white uppercase font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-400 mb-1">Manzana</label>
                    <input
                      type="text"
                      placeholder="A1, B, C..."
                      value={newLotManzana}
                      onChange={(e) => setNewLotManzana(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded bg-stone-900 border border-stone-700 text-white uppercase"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-400 mb-1">Área (m²)</label>
                    <input
                      type="number"
                      value={newLotArea}
                      onChange={(e) => setNewLotArea(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 rounded bg-stone-900 border border-stone-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-400 mb-1">Sector</label>
                    <select
                      value={newLotLocation}
                      onChange={(e) => setNewLotLocation(e.target.value as any)}
                      className="w-full px-2.5 py-1.5 rounded bg-stone-900 border border-stone-700 text-white"
                    >
                      <option value="alta">Sector 1 (Parte Alta)</option>
                      <option value="baja">Sector 2 (Parte Baja)</option>
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button
                      type="submit"
                      className="w-full py-1.5 px-3 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                    >
                      + Crear Lote
                    </button>
                  </div>
                </div>
              </form>

              {/* Lots Table */}
              <div className="bg-stone-950 rounded-xl border border-stone-800 overflow-hidden">
                <div className="overflow-x-auto max-h-[460px]">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-stone-900 text-stone-400 uppercase font-bold sticky top-0 border-b border-stone-800">
                      <tr>
                        <th className="p-3">Código</th>
                        <th className="p-3">Manzana</th>
                        <th className="p-3">Sector</th>
                        <th className="p-3">Área (m²)</th>
                        <th className="p-3">Precio USD</th>
                        <th className="p-3">Estado de Disponibilidad</th>
                        <th className="p-3 text-right">Acción</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-800">
                      {localLots.map((lot) => (
                        <tr key={lot.id} className="hover:bg-stone-900/40">
                          <td className="p-3 font-mono font-bold text-white">{lot.code}</td>
                          <td className="p-3 text-stone-300">{lot.manzana}</td>
                          <td className="p-3 text-stone-400">
                            {lot.location === 'alta' ? 'Sector 1 (Alta)' : 'Sector 2 (Baja)'}
                          </td>
                          <td className="p-3">
                            <input
                              type="number"
                              value={lot.areaM2}
                              onChange={(e) => handleLocalLotAreaChange(lot.id, Number(e.target.value))}
                              className="w-20 px-2 py-1 rounded bg-stone-900 border border-stone-700 text-white text-xs"
                            />
                          </td>
                          <td className="p-3 font-mono text-emerald-400 font-bold">
                            ${lot.totalPriceUsd.toLocaleString('es-VE')}
                          </td>
                          <td className="p-3">
                            <select
                              value={lot.status}
                              onChange={(e) => handleLocalLotStatusChange(lot.id, e.target.value as LotStatus)}
                              className={`px-2.5 py-1 rounded font-bold text-xs border ${
                                lot.status === 'disponible'
                                  ? 'bg-emerald-950 text-emerald-400 border-emerald-700'
                                  : lot.status === 'reservado'
                                  ? 'bg-amber-950 text-amber-400 border-amber-700'
                                  : 'bg-rose-950 text-rose-400 border-rose-700'
                              }`}
                            >
                              <option value="disponible">Disponible</option>
                              <option value="reservado">Reservado</option>
                              <option value="vendido">Vendido</option>
                            </select>
                          </td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => handleDeleteLot(lot.id, lot.code)}
                              className="p-1 rounded bg-stone-800 hover:bg-red-900/60 text-stone-400 hover:text-red-300"
                              title="Eliminar lote"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: MODELOS DE VIVIENDA & GESTIÓN INTEGRAL DE REGISTROS */}
          {activeTab === 'modelos' && (
            <div className="space-y-6 max-w-4xl" id="cms-housing-models-manager">
              {/* Header & Quick Save Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-3">
                <div>
                  <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
                    <Home className="w-5 h-5 text-amber-400" />
                    <span>Catálogo de Modelos de Vivienda & Renders</span>
                  </h3>
                  <p className="text-xs text-stone-400">
                    Crea, edita, duplica o elimina registros de casas en Bambú Guadua. Cada cambio se graba de inmediato en la base de datos.
                  </p>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={refreshModelsFromDb}
                    title="Recargar modelos desde la base de datos"
                    className="px-3 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white border border-stone-700 text-xs font-semibold flex items-center gap-1.5 transition-all"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
                    <span>Recargar DB</span>
                  </button>
                  {modelsSaveSuccess && (
                    <span className="text-xs text-emerald-400 flex items-center gap-1 font-semibold animate-pulse">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>¡Guardado con éxito!</span>
                    </span>
                  )}
                  <button
                    id="btn-save-models-tab"
                    type="button"
                    disabled={savingModelsSection || levelInfo.isReadOnly}
                    onClick={handleSaveModelsSection}
                    className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg transition-all ${
                      levelInfo.isReadOnly
                        ? 'bg-stone-800 text-stone-500 cursor-not-allowed'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950/50 hover:scale-[1.02]'
                    }`}
                  >
                    {savingModelsSection ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Sincronizando...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-3.5 h-3.5" />
                        <span>Grabar Modelos en CMS</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* General Section Settings */}
              <div className="bg-stone-900/60 p-4 rounded-2xl border border-stone-800 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-200 text-xs flex items-center gap-1.5">
                    <Settings className="w-3.5 h-3.5 text-amber-400" />
                    <span>Textos Generales de la Sección en la Web</span>
                  </span>
                  <label className="flex items-center gap-2 cursor-pointer text-stone-300">
                    <input
                      type="checkbox"
                      checked={formData.housingModels?.active !== false}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          housingModels: { ...formData.housingModels, active: e.target.checked },
                        })
                      }
                      className="rounded bg-stone-950 border-stone-700 text-amber-500 focus:ring-0"
                    />
                    <span>Sección Visible en la Web</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-stone-400 mb-1 font-medium">Título de la Sección</label>
                    <input
                      type="text"
                      value={formData.housingModels?.title || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          housingModels: { ...formData.housingModels, title: e.target.value },
                        })
                      }
                      className="w-full px-3 py-1.5 rounded-lg bg-stone-950 border border-stone-700 text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-400 mb-1 font-medium">Subtítulo de la Sección</label>
                    <input
                      type="text"
                      value={formData.housingModels?.subtitle || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          housingModels: { ...formData.housingModels, subtitle: e.target.value },
                        })
                      }
                      className="w-full px-3 py-1.5 rounded-lg bg-stone-950 border border-stone-700 text-white text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-stone-400 mb-1 font-medium">Nota o Aviso de Costos de Construcción</label>
                  <input
                    type="text"
                    value={formData.housingModels?.priceNotice || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        housingModels: { ...formData.housingModels, priceNotice: e.target.value },
                      })
                    }
                    className="w-full px-3 py-1.5 rounded-lg bg-stone-950 border border-stone-700 text-stone-300 text-xs"
                  />
                </div>
              </div>

              {/* Models List / Selector Bar with Add Button */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-stone-300 uppercase tracking-wider">
                      Registros de Modelos ({(formData.housingModels?.models || []).length})
                    </span>
                  </div>

                  <button
                    id="btn-open-create-model"
                    type="button"
                    onClick={() => setIsAddingNewModel(!isAddingNewModel)}
                    className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{isAddingNewModel ? 'Cancelar Nuevo' : 'Nuevo Registro de Modelo'}</span>
                  </button>
                </div>

                {/* Pill selector for models */}
                <div className="flex flex-wrap items-center gap-2 border-b border-stone-800 pb-3">
                  {(formData.housingModels?.models || []).map((model) => {
                    const isSelected = (currentSelectedModel?.id || '') === model.id;
                    return (
                      <button
                        key={model.id}
                        type="button"
                        id={`btn-select-model-${model.id}`}
                        onClick={() => {
                          setSelectedModelId(model.id);
                          setIsAddingNewModel(false);
                        }}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                          isSelected
                            ? 'bg-amber-500 text-stone-950 shadow-md ring-2 ring-amber-400/40'
                            : 'bg-stone-900 border border-stone-800 text-stone-300 hover:bg-stone-800 hover:text-white'
                        }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${
                            model.active !== false ? 'bg-emerald-400' : 'bg-stone-500'
                          }`}
                        />
                        <span>{model.name}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded ${isSelected ? 'bg-amber-600/40 text-stone-950' : 'bg-stone-800 text-stone-400'}`}>
                          {model.areaM2} m²
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Inline Form to Create New Model */}
              {isAddingNewModel && (
                <div className="bg-amber-950/20 border-2 border-amber-500/60 rounded-2xl p-4 sm:p-5 space-y-4 text-xs">
                  <div className="flex items-center justify-between border-b border-amber-500/30 pb-2">
                    <h4 className="font-serif font-bold text-sm text-amber-300 flex items-center gap-2">
                      <Plus className="w-4 h-4" />
                      <span>Crear Nuevo Registro de Modelo de Vivienda</span>
                    </h4>
                    <button
                      type="button"
                      onClick={() => setIsAddingNewModel(false)}
                      className="text-stone-400 hover:text-white text-xs px-2 py-1 rounded bg-stone-900"
                    >
                      Cancelar
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-stone-300 mb-1 font-semibold">Nombre del Modelo *</label>
                      <input
                        type="text"
                        placeholder="Ej: Modelo C - Suite Mirador"
                        value={newModelForm.name}
                        onChange={(e) => setNewModelForm({ ...newModelForm, name: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-stone-900 border border-stone-700 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-300 mb-1 font-semibold">Subtítulo / Tagline</label>
                      <input
                        type="text"
                        placeholder="Ej: Bioclimático en 2 niveles"
                        value={newModelForm.tagline}
                        onChange={(e) => setNewModelForm({ ...newModelForm, tagline: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-stone-900 border border-stone-700 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-300 mb-1 font-semibold">Superficie (m²)</label>
                      <input
                        type="number"
                        value={newModelForm.areaM2}
                        onChange={(e) => {
                          const area = Number(e.target.value) || 0;
                          setNewModelForm({
                            ...newModelForm,
                            areaM2: area,
                            priceUsd: Math.round(area * newModelForm.pricePerM2Usd),
                          });
                        }}
                        className="w-full px-3 py-2 rounded-lg bg-stone-900 border border-stone-700 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-300 mb-1 font-semibold">Precio USD / m²</label>
                      <input
                        type="number"
                        value={newModelForm.pricePerM2Usd}
                        onChange={(e) => {
                          const pm2 = Number(e.target.value) || 0;
                          setNewModelForm({
                            ...newModelForm,
                            pricePerM2Usd: pm2,
                            priceUsd: Math.round(newModelForm.areaM2 * pm2),
                          });
                        }}
                        className="w-full px-3 py-2 rounded-lg bg-stone-900 border border-stone-700 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-300 mb-1 font-semibold">Precio Total USD</label>
                      <input
                        type="number"
                        value={newModelForm.priceUsd}
                        onChange={(e) => setNewModelForm({ ...newModelForm, priceUsd: Number(e.target.value) || 0 })}
                        className="w-full px-3 py-2 rounded-lg bg-stone-900 border border-stone-700 text-emerald-400 font-bold font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-300 mb-1 font-semibold">Habitaciones / Baños</label>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="number"
                          placeholder="Hab"
                          value={newModelForm.bedrooms}
                          onChange={(e) => setNewModelForm({ ...newModelForm, bedrooms: Number(e.target.value) || 1 })}
                          className="w-full px-2 py-2 rounded-lg bg-stone-900 border border-stone-700 text-white"
                        />
                        <input
                          type="number"
                          placeholder="Baños"
                          value={newModelForm.bathrooms}
                          onChange={(e) => setNewModelForm({ ...newModelForm, bathrooms: Number(e.target.value) || 1 })}
                          className="w-full px-2 py-2 rounded-lg bg-stone-900 border border-stone-700 text-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Initial Image with Source Selector */}
                  <MediaFieldWithSourceSelector
                    id="new-model-initial-image-selector"
                    label="Imagen Principal de Portada / Render 3D"
                    value={newModelForm.initialImage}
                    onChange={(val) => setNewModelForm({ ...newModelForm, initialImage: val })}
                    mediaType="image"
                    placeholder="Seleccione archivo local, imagen de biblioteca o URL..."
                    helperText="Puedes subir tu render desde el equipo o elegir uno preexistente."
                  />

                  <div className="flex justify-end gap-2 pt-2 border-t border-amber-500/20">
                    <button
                      type="button"
                      onClick={() => setIsAddingNewModel(false)}
                      className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold"
                    >
                      Cancelar
                    </button>
                    <button
                      id="btn-confirm-create-model"
                      type="button"
                      onClick={handleCreateNewModel}
                      className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-1.5 shadow-lg"
                    >
                      <Check className="w-4 h-4" />
                      <span>Crear e Incorporar Modelo</span>
                    </button>
                  </div>
                </div>
              )}

              {/* CURRENT SELECTED MODEL EDIT CARD */}
              {currentSelectedModel && (
                <div className="bg-stone-950 p-5 rounded-2xl border border-stone-800 space-y-6 text-xs" id={`editor-model-${currentSelectedModel.id}`}>
                  {/* Model Actions Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 bg-stone-900/80 p-3 rounded-xl border border-stone-800">
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={currentSelectedModel.active !== false}
                          onChange={(e) => {
                            const updated = (formData.housingModels?.models || []).map((m) =>
                              m.id === currentSelectedModel.id ? { ...m, active: e.target.checked } : m
                            );
                            setFormData({ ...formData, housingModels: { ...formData.housingModels, models: updated } });
                          }}
                          className="rounded bg-stone-950 border-stone-700 text-emerald-500 focus:ring-0"
                        />
                        <span className="font-semibold text-stone-200">
                          {currentSelectedModel.active !== false ? 'Activo en la Web' : 'Oculto en la Web'}
                        </span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={currentSelectedModel.showPrice !== false}
                          onChange={(e) => {
                            const updated = (formData.housingModels?.models || []).map((m) =>
                              m.id === currentSelectedModel.id ? { ...m, showPrice: e.target.checked } : m
                            );
                            setFormData({ ...formData, housingModels: { ...formData.housingModels, models: updated } });
                          }}
                          className="rounded bg-stone-950 border-stone-700 text-amber-500 focus:ring-0"
                        />
                        <span className="text-stone-300">Mostrar Precio USD</span>
                      </label>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleDuplicateModel(currentSelectedModel.id)}
                        className="px-2.5 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 flex items-center gap-1.5 transition-all text-xs"
                        title="Duplicar este modelo"
                      >
                        <Copy className="w-3.5 h-3.5 text-stone-400" />
                        <span>Duplicar</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteModel(currentSelectedModel.id)}
                        className="px-2.5 py-1.5 rounded-lg bg-red-950/60 hover:bg-red-900 border border-red-800/60 text-red-300 flex items-center gap-1.5 transition-all text-xs"
                        title="Eliminar este modelo permanentemente"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Eliminar</span>
                      </button>
                    </div>
                  </div>

                  {/* Main Attributes */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-stone-300 mb-1 font-semibold">Nombre del Modelo</label>
                      <input
                        type="text"
                        value={currentSelectedModel.name}
                        onChange={(e) => {
                          const updated = (formData.housingModels?.models || []).map((m) =>
                            m.id === currentSelectedModel.id ? { ...m, name: e.target.value } : m
                          );
                          setFormData({ ...formData, housingModels: { ...formData.housingModels, models: updated } });
                        }}
                        className="w-full px-3 py-2 rounded-lg bg-stone-900 border border-stone-700 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-300 mb-1 font-semibold">Subtítulo / Tagline</label>
                      <input
                        type="text"
                        value={currentSelectedModel.tagline || ''}
                        onChange={(e) => {
                          const updated = (formData.housingModels?.models || []).map((m) =>
                            m.id === currentSelectedModel.id ? { ...m, tagline: e.target.value } : m
                          );
                          setFormData({ ...formData, housingModels: { ...formData.housingModels, models: updated } });
                        }}
                        className="w-full px-3 py-2 rounded-lg bg-stone-900 border border-stone-700 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-300 mb-1 font-semibold">Superficie de Construcción (m²)</label>
                      <input
                        type="number"
                        value={currentSelectedModel.areaM2}
                        onChange={(e) => {
                          const area = Number(e.target.value) || 0;
                          const updated = (formData.housingModels?.models || []).map((m) =>
                            m.id === currentSelectedModel.id
                              ? { ...m, areaM2: area, priceUsd: Math.round(area * (m.pricePerM2Usd || 450)) }
                              : m
                          );
                          setFormData({ ...formData, housingModels: { ...formData.housingModels, models: updated } });
                        }}
                        className="w-full px-3 py-2 rounded-lg bg-stone-900 border border-stone-700 text-white font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-300 mb-1 font-semibold">Precio por m² (USD)</label>
                      <input
                        type="number"
                        value={currentSelectedModel.pricePerM2Usd || 450}
                        onChange={(e) => {
                          const pm2 = Number(e.target.value) || 0;
                          const updated = (formData.housingModels?.models || []).map((m) =>
                            m.id === currentSelectedModel.id
                              ? { ...m, pricePerM2Usd: pm2, priceUsd: Math.round(m.areaM2 * pm2) }
                              : m
                          );
                          setFormData({ ...formData, housingModels: { ...formData.housingModels, models: updated } });
                        }}
                        className="w-full px-3 py-2 rounded-lg bg-stone-900 border border-stone-700 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-300 mb-1 font-semibold">Precio Total de Construcción (USD)</label>
                      <input
                        type="number"
                        value={currentSelectedModel.priceUsd}
                        onChange={(e) => {
                          const updated = (formData.housingModels?.models || []).map((m) =>
                            m.id === currentSelectedModel.id ? { ...m, priceUsd: Number(e.target.value) || 0 } : m
                          );
                          setFormData({ ...formData, housingModels: { ...formData.housingModels, models: updated } });
                        }}
                        className="w-full px-3 py-2 rounded-lg bg-stone-900 border border-stone-700 text-emerald-400 font-bold font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-300 mb-1 font-semibold">Ficha Técnica / Folleto PDF</label>
                      <input
                        type="text"
                        value={currentSelectedModel.brochurePdfUrl || ''}
                        onChange={(e) => {
                          const updated = (formData.housingModels?.models || []).map((m) =>
                            m.id === currentSelectedModel.id ? { ...m, brochurePdfUrl: e.target.value } : m
                          );
                          setFormData({ ...formData, housingModels: { ...formData.housingModels, models: updated } });
                        }}
                        placeholder="#ficha-tecnica o https://..."
                        className="w-full px-3 py-2 rounded-lg bg-stone-900 border border-stone-700 text-white font-mono text-xs"
                      />
                    </div>
                  </div>

                  {/* Model Description */}
                  <div>
                    <label className="block text-stone-300 mb-1 font-semibold">Descripción Arquitectónica & Estilo Bioclimático</label>
                    <textarea
                      rows={3}
                      value={currentSelectedModel.description || ''}
                      onChange={(e) => {
                        const updated = (formData.housingModels?.models || []).map((m) =>
                          m.id === currentSelectedModel.id ? { ...m, description: e.target.value } : m
                        );
                        setFormData({ ...formData, housingModels: { ...formData.housingModels, models: updated } });
                      }}
                      className="w-full px-3 py-2 rounded-lg bg-stone-900 border border-stone-700 text-stone-200 text-xs"
                    />
                  </div>

                  {/* Technical Specifications Specs */}
                  <div className="p-4 rounded-xl bg-stone-900/70 border border-stone-800 space-y-3">
                    <h4 className="font-serif font-bold text-stone-200 text-xs flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-amber-400" />
                      <span>Especificaciones Técnicas del Modelo</span>
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-stone-400 mb-1">Niveles / Plantas</label>
                        <input
                          type="number"
                          value={currentSelectedModel.specs?.levels || 1}
                          onChange={(e) => {
                            const val = Number(e.target.value) || 1;
                            const updated = (formData.housingModels?.models || []).map((m) =>
                              m.id === currentSelectedModel.id
                                ? { ...m, specs: { ...(m.specs || { levels: 1, bedrooms: 2, bathrooms: 2, terraceM2: 15, foundation: '', structure: '' }), levels: val } }
                                : m
                            );
                            setFormData({ ...formData, housingModels: { ...formData.housingModels, models: updated } });
                          }}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-stone-950 border border-stone-700 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-stone-400 mb-1">Habitaciones</label>
                        <input
                          type="number"
                          value={currentSelectedModel.specs?.bedrooms || 2}
                          onChange={(e) => {
                            const val = Number(e.target.value) || 1;
                            const updated = (formData.housingModels?.models || []).map((m) =>
                              m.id === currentSelectedModel.id
                                ? { ...m, specs: { ...(m.specs || { levels: 1, bedrooms: 2, bathrooms: 2, terraceM2: 15, foundation: '', structure: '' }), bedrooms: val } }
                                : m
                            );
                            setFormData({ ...formData, housingModels: { ...formData.housingModels, models: updated } });
                          }}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-stone-950 border border-stone-700 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-stone-400 mb-1">Baños Completos</label>
                        <input
                          type="number"
                          value={currentSelectedModel.specs?.bathrooms || 2}
                          onChange={(e) => {
                            const val = Number(e.target.value) || 1;
                            const updated = (formData.housingModels?.models || []).map((m) =>
                              m.id === currentSelectedModel.id
                                ? { ...m, specs: { ...(m.specs || { levels: 1, bedrooms: 2, bathrooms: 2, terraceM2: 15, foundation: '', structure: '' }), bathrooms: val } }
                                : m
                            );
                            setFormData({ ...formData, housingModels: { ...formData.housingModels, models: updated } });
                          }}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-stone-950 border border-stone-700 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-stone-400 mb-1">Terraza Mirador (m²)</label>
                        <input
                          type="number"
                          value={currentSelectedModel.specs?.terraceM2 || 15}
                          onChange={(e) => {
                            const val = Number(e.target.value) || 0;
                            const updated = (formData.housingModels?.models || []).map((m) =>
                              m.id === currentSelectedModel.id
                                ? { ...m, specs: { ...(m.specs || { levels: 1, bedrooms: 2, bathrooms: 2, terraceM2: 15, foundation: '', structure: '' }), terraceM2: val } }
                                : m
                            );
                            setFormData({ ...formData, housingModels: { ...formData.housingModels, models: updated } });
                          }}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-stone-950 border border-stone-700 text-white"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-stone-400 mb-1">Cimentación</label>
                        <input
                          type="text"
                          value={currentSelectedModel.specs?.foundation || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            const updated = (formData.housingModels?.models || []).map((m) =>
                              m.id === currentSelectedModel.id
                                ? { ...m, specs: { ...(m.specs || { levels: 1, bedrooms: 2, bathrooms: 2, terraceM2: 15, foundation: '', structure: '' }), foundation: val } }
                                : m
                            );
                            setFormData({ ...formData, housingModels: { ...formData.housingModels, models: updated } });
                          }}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-stone-950 border border-stone-700 text-white"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-stone-400 mb-1">Estructura</label>
                        <input
                          type="text"
                          value={currentSelectedModel.specs?.structure || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            const updated = (formData.housingModels?.models || []).map((m) =>
                              m.id === currentSelectedModel.id
                                ? { ...m, specs: { ...(m.specs || { levels: 1, bedrooms: 2, bathrooms: 2, terraceM2: 15, foundation: '', structure: '' }), structure: val } }
                                : m
                            );
                            setFormData({ ...formData, housingModels: { ...formData.housingModels, models: updated } });
                          }}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-stone-950 border border-stone-700 text-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Benefits & Bullet Highlights */}
                  <div className="p-4 rounded-xl bg-stone-900/70 border border-stone-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-serif font-bold text-stone-200 text-xs flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        <span>Puntos Destacados & Beneficios del Modelo ({(currentSelectedModel.benefits || []).length})</span>
                      </h4>
                    </div>

                    <div className="space-y-2">
                      {(currentSelectedModel.benefits || []).map((b, bIdx) => (
                        <div key={bIdx} className="flex items-center gap-2">
                          <span className="text-amber-400 text-xs font-bold">•</span>
                          <input
                            type="text"
                            value={b}
                            onChange={(e) => handleUpdateBenefit(currentSelectedModel.id, bIdx, e.target.value)}
                            className="flex-1 px-2.5 py-1.5 rounded-lg bg-stone-950 border border-stone-700 text-white text-xs"
                          />
                          <button
                            type="button"
                            onClick={() => handleDeleteBenefit(currentSelectedModel.id, bIdx)}
                            className="p-1.5 rounded bg-stone-800 hover:bg-red-900/70 text-stone-400 hover:text-red-300"
                            title="Eliminar beneficio"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}

                      {/* Add Benefit Input */}
                      <div className="flex items-center gap-2 pt-2">
                        <input
                          type="text"
                          placeholder="Agregar nuevo punto destacado o beneficio..."
                          value={newBenefitText}
                          onChange={(e) => setNewBenefitText(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddBenefitToModel(currentSelectedModel.id, newBenefitText);
                            }
                          }}
                          className="flex-1 px-2.5 py-1.5 rounded-lg bg-stone-950 border border-dashed border-stone-700 text-white text-xs"
                        />
                        <button
                          type="button"
                          onClick={() => handleAddBenefitToModel(currentSelectedModel.id, newBenefitText)}
                          disabled={!newBenefitText.trim()}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                            newBenefitText.trim()
                              ? 'bg-amber-500 text-stone-950 hover:bg-amber-400'
                              : 'bg-stone-800 text-stone-500 cursor-not-allowed'
                          }`}
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Agregar</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* MULTI-IMAGE GALLERY MANAGER WITH ORIGIN SOURCE SELECTOR */}
                  <div className="pt-4 border-t border-stone-800 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <h4 className="font-serif font-bold text-white text-sm flex items-center gap-2">
                        <ImageIcon className="w-4 h-4 text-amber-400" />
                        <span>Galería de Imágenes & Renders ({currentSelectedModel.images?.length || 0} imágenes)</span>
                      </h4>
                      <span className="text-[11px] text-stone-400">
                        La primera imagen (#1) actúa como la portada del modelo en el catálogo
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {(currentSelectedModel.images || []).map((imgUrl, imgIdx) => {
                        const isEditingThisImage = editingModelImageIndex === imgIdx;
                        const isCover = imgIdx === 0;

                        return (
                          <div
                            key={imgIdx}
                            className={`p-2.5 rounded-xl border bg-stone-900 flex flex-col justify-between gap-2 transition-all ${
                              isEditingThisImage
                                ? 'border-amber-500 ring-2 ring-amber-500/40 bg-amber-950/10'
                                : 'border-stone-700/80 hover:border-stone-500'
                            }`}
                          >
                            <div className="relative rounded-lg overflow-hidden bg-black h-36">
                              <img
                                src={imgUrl}
                                alt={`Render ${imgIdx + 1}`}
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                              <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-black/80 text-[10px] font-mono text-stone-200">
                                #{imgIdx + 1} {isCover && '· Portada'}
                              </div>

                              <div className="absolute top-1 right-1 flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => setEditingModelImageIndex(isEditingThisImage ? null : imgIdx)}
                                  className={`p-1.5 rounded transition-all ${
                                    isEditingThisImage
                                      ? 'bg-amber-500 text-stone-950 font-bold'
                                      : 'bg-stone-900/90 hover:bg-stone-800 text-stone-200'
                                  }`}
                                  title="Editar archivo y cambiar origen de esta imagen"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (editingModelImageIndex === imgIdx) setEditingModelImageIndex(null);
                                    handleDeleteImageFromModel(currentSelectedModel.id, imgIdx);
                                  }}
                                  className="p-1.5 rounded bg-red-600/90 hover:bg-red-500 text-white"
                                  title="Eliminar imagen"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            {/* Position and Cover Actions */}
                            <div className="flex items-center justify-between gap-1 text-[11px] pt-1">
                              {!isCover ? (
                                <button
                                  type="button"
                                  onClick={() => handleSetCoverImage(currentSelectedModel.id, imgIdx)}
                                  className="px-2 py-1 rounded bg-stone-800 hover:bg-amber-500 hover:text-stone-950 text-stone-300 font-medium"
                                  title="Hacer portada principal"
                                >
                                  Hacer Portada
                                </button>
                              ) : (
                                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 font-bold text-[10px] border border-emerald-800/60">
                                  ✓ Portada Actual
                                </span>
                              )}

                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  disabled={imgIdx === 0}
                                  onClick={() => handleMoveModelImage(currentSelectedModel.id, imgIdx, imgIdx - 1)}
                                  className={`p-1 rounded ${
                                    imgIdx === 0
                                      ? 'text-stone-600 cursor-not-allowed'
                                      : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                                  }`}
                                  title="Mover hacia arriba / adelante"
                                >
                                  <ArrowUp className="w-3 h-3" />
                                </button>
                                <button
                                  type="button"
                                  disabled={imgIdx === (currentSelectedModel.images || []).length - 1}
                                  onClick={() => handleMoveModelImage(currentSelectedModel.id, imgIdx, imgIdx + 1)}
                                  className={`p-1 rounded ${
                                    imgIdx === (currentSelectedModel.images || []).length - 1
                                      ? 'text-stone-600 cursor-not-allowed'
                                      : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                                  }`}
                                  title="Mover hacia abajo / atrás"
                                >
                                  <ArrowDown className="w-3 h-3" />
                                </button>
                              </div>
                            </div>

                            {/* INLINE SOURCE SELECTOR FOR THIS SPECIFIC IMAGE */}
                            {isEditingThisImage && (
                              <div className="mt-2 p-3 rounded-xl bg-stone-950 border border-amber-500/70 space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="font-semibold text-amber-400 text-[11px] flex items-center gap-1">
                                    <Edit3 className="w-3 h-3" />
                                    <span>Cambiar Archivo #{imgIdx + 1}</span>
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => setEditingModelImageIndex(null)}
                                    className="px-2 py-0.5 rounded bg-stone-800 text-stone-300 text-[10px]"
                                  >
                                    Listo
                                  </button>
                                </div>
                                <MediaFieldWithSourceSelector
                                  id={`edit-model-image-${currentSelectedModel.id}-${imgIdx}`}
                                  label={`Sustituir archivo para la imagen #${imgIdx + 1}`}
                                  value={imgUrl}
                                  onChange={(newUrl) => {
                                    handleUpdateModelImage(currentSelectedModel.id, imgIdx, newUrl);
                                  }}
                                  mediaType="image"
                                  placeholder="Archivo de tu equipo, biblioteca o URL..."
                                  helperText="Actualiza el render inmediatamente."
                                />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* ADD NEW IMAGE TO MODEL WITH COMPLETE SOURCE SELECTOR */}
                    <div className="pt-3 space-y-3 bg-stone-900/60 p-4 rounded-xl border border-stone-800">
                      <MediaFieldWithSourceSelector
                        id="new-model-image-selector"
                        label={`Agregar Nuevo Render o Plano a la Galería de ${currentSelectedModel.name}`}
                        value={newImageUrl}
                        onChange={setNewImageUrl}
                        mediaType="image"
                        placeholder="Sube archivo desde tu computadora, elige de la biblioteca o pega URL..."
                        helperText="Soporta renders 3D, axonometrías, cortes de arquitectura y fotografías en alta definición."
                      />
                      <div className="text-right pt-1">
                        <button
                          id="btn-confirm-add-model-image"
                          type="button"
                          disabled={!newImageUrl.trim()}
                          onClick={() => handleAddImageToModel(currentSelectedModel.id)}
                          className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 ml-auto transition-all ${
                            newImageUrl.trim()
                              ? 'bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-md'
                              : 'bg-stone-800 text-stone-500 cursor-not-allowed'
                          }`}
                        >
                          <Plus className="w-4 h-4" />
                          <span>Agregar a la Galería de {currentSelectedModel.name}</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* BOTTOM SAVE ACTIONS FOR CURRENT MODEL */}
                  <div className="pt-4 border-t border-stone-800 flex items-center justify-between">
                    <div className="text-xs text-stone-400">
                      Editando modelo: <span className="text-amber-400 font-semibold">{currentSelectedModel.name}</span> ({currentSelectedModel.id})
                    </div>
                    <button
                      id="btn-save-models-tab-bottom"
                      type="button"
                      disabled={savingModelsSection || levelInfo.isReadOnly}
                      onClick={handleSaveModelsSection}
                      className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg transition-all ${
                        levelInfo.isReadOnly
                          ? 'bg-stone-800 text-stone-500 cursor-not-allowed'
                          : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950/50 hover:scale-[1.02]'
                      }`}
                    >
                      {savingModelsSection ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Grabando en Servidor...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          <span>Guardar y Grabar Modelos en el CMS</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 7: UBICACIÓN */}
          {activeTab === 'ubicacion' && (
            <div className="space-y-4 max-w-3xl text-xs">
              <h3 className="font-serif text-lg font-bold text-white border-b border-stone-800 pb-2">
                Ubicación Estratégica & Accesos Viales
              </h3>
              <div>
                <label className="block text-stone-300 mb-1 font-semibold">Título</label>
                <input
                  type="text"
                  value={formData.location.title}
                  onChange={(e) =>
                    setFormData({ ...formData, location: { ...formData.location, title: e.target.value } })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-stone-800 border border-stone-700 text-white"
                />
              </div>
              <div>
                <label className="block text-stone-300 mb-1 font-semibold">Descripción del Entorno</label>
                <textarea
                  rows={3}
                  value={formData.location.description}
                  onChange={(e) =>
                    setFormData({ ...formData, location: { ...formData.location, description: e.target.value } })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-stone-800 border border-stone-700 text-white"
                />
              </div>
            </div>
          )}

          {/* TAB 8: FINANCIAMIENTO */}
          {activeTab === 'financiamiento' && (
            <div className="space-y-4 max-w-3xl text-xs">
              <h3 className="font-serif text-lg font-bold text-white border-b border-stone-800 pb-2">
                Planes de Venta y Opciones de Financiamiento
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  <label className="block text-stone-300 mb-1 font-semibold">Porcentaje de Reserva (%)</label>
                  <input
                    type="number"
                    value={formData.salesFinancing.reservationPct}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        salesFinancing: {
                          ...formData.salesFinancing,
                          reservationPct: Number(e.target.value),
                        },
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-stone-800 border border-stone-700 text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 9: SOSTENIBILIDAD */}
          {activeTab === 'sostenibilidad' && (
            <div className="space-y-4 max-w-3xl text-xs">
              <h3 className="font-serif text-lg font-bold text-white border-b border-stone-800 pb-2">
                Sostenibilidad, Bulevar de la Guadua y Espacios Comunitarios
              </h3>
              <div>
                <label className="block text-stone-300 mb-1 font-semibold">Título de la Sección</label>
                <input
                  type="text"
                  value={formData.socialImpact.title}
                  onChange={(e) =>
                    setFormData({ ...formData, socialImpact: { ...formData.socialImpact, title: e.target.value } })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-stone-800 border border-stone-700 text-white"
                />
              </div>
              <div>
                <label className="block text-stone-300 mb-1 font-semibold">Descripción del Impacto Social</label>
                <textarea
                  rows={3}
                  value={formData.socialImpact.description}
                  onChange={(e) =>
                    setFormData({ ...formData, socialImpact: { ...formData.socialImpact, description: e.target.value } })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-stone-800 border border-stone-700 text-white"
                />
              </div>

              {/* Renders and images for Sostenibilidad and Bulevar */}
              <div className="pt-3 border-t border-stone-800 space-y-4">
                <h4 className="font-serif font-bold text-white text-sm flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-emerald-400" />
                  <span>Renders y Planos de Sostenibilidad y Áreas Comunitarias</span>
                </h4>
                <MediaFieldWithSourceSelector
                  id="social-impact-media-selector"
                  label="Render del Bulevar de la Guadua y Espacios Comunitarios (+14.600 m²)"
                  value={formData.socialImpact.imageUrl || ''}
                  onChange={(newUrl) =>
                    setFormData({
                      ...formData,
                      socialImpact: { ...formData.socialImpact, imageUrl: newUrl },
                    })
                  }
                  mediaType="image"
                  placeholder="Suba render del bulevar, elija de la biblioteca o pegue URL..."
                  helperText="Render ilustrativo de áreas públicas: canchas deportivas, plazas, parques y frente sobre la Trasandina."
                />
                <MediaFieldWithSourceSelector
                  id="technical-attributes-media-selector"
                  label="Render / Detalle Constructivo de Arquitectura en Bambú Guadua"
                  value={formData.technicalAttributes?.imageUrl || ''}
                  onChange={(newUrl) =>
                    setFormData({
                      ...formData,
                      technicalAttributes: {
                        ...formData.technicalAttributes,
                        imageUrl: newUrl,
                      },
                    })
                  }
                  mediaType="image"
                  placeholder="Suba esquema estructural de Guadua, elija de la biblioteca o pegue URL..."
                  helperText="Detalle técnico de columnas en Bambú Guadua angustifolia, losa flotante de concreto a 40 cm e ingeniería sismorresistente."
                />
              </div>
            </div>
          )}

          {/* TAB 10: GESTIÓN DE USUARIOS CON 5 NIVELES (Requirement) */}
          {activeTab === 'usuarios' && (
            <UsersCmsTab
              currentUser={effectiveUser}
              onSimulateRole={isRealSuperUser ? setSimulatedRole : undefined}
              simulatedRole={simulatedRole}
            />
          )}

          {/* TAB 11: LEADS / PROSPECTOS */}
          {activeTab === 'leads' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                <h3 className="font-serif text-lg font-bold text-white">
                  Prospectos y Solicitudes de Cotización ({leadsList.length})
                </h3>
                <button
                  onClick={fetchLeads}
                  disabled={loadingLeads}
                  className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300"
                  title="Refrescar lista"
                >
                  <RefreshCw className={`w-4 h-4 ${loadingLeads ? 'animate-spin' : ''}`} />
                </button>
              </div>

              <div className="bg-stone-950 rounded-xl border border-stone-800 overflow-hidden">
                <div className="overflow-x-auto max-h-[480px]">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-stone-900 text-stone-400 font-bold border-b border-stone-800 uppercase">
                      <tr>
                        <th className="p-3">Fecha</th>
                        <th className="p-3">Cliente</th>
                        <th className="p-3">Contacto</th>
                        <th className="p-3">Interés / Lote</th>
                        <th className="p-3">Estado</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-800">
                      {leadsList.map((lead) => (
                        <tr key={lead.id} className="hover:bg-stone-900/50">
                          <td className="p-3 font-mono text-stone-400">
                            {new Date(lead.createdAt).toLocaleDateString()}
                          </td>
                          <td className="p-3 font-bold text-white">{lead.name}</td>
                          <td className="p-3 text-stone-300">
                            <div>{lead.email}</div>
                            <div className="text-[11px] text-stone-500 font-mono">{lead.phone}</div>
                          </td>
                          <td className="p-3 text-stone-300">
                            {lead.lotCode ? (
                              <span className="font-mono font-bold text-emerald-400">Lote {lead.lotCode}</span>
                            ) : (
                              <span>General</span>
                            )}
                            {lead.housingModel && <div className="text-[10px] text-stone-400">{lead.housingModel}</div>}
                          </td>
                          <td className="p-3">
                            <select
                              value={lead.status}
                              disabled={levelInfo.isReadOnly}
                              onChange={(e) => handleUpdateLeadState(lead.id, e.target.value as any)}
                              className="px-2 py-1 rounded bg-stone-900 border border-stone-700 text-xs font-semibold text-white disabled:opacity-50"
                            >
                              <option value="nuevo">Nuevo</option>
                              <option value="contactado">Contactado</option>
                              <option value="cerrado">Cerrado</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
          </>
          )}
        </div>
      </div>
    </div>
  );
};
