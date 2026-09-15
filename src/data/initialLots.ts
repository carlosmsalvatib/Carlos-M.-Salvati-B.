import { LotItem } from '../types';

// 57 Lotes:
// Lote 1: Colinas de Mis Delirios (Parte Alta) -> Manzana A1 (14 lotes) = 29.518,97 m² (Total área alta 37.252,62 m²)
// Lote 2: Mis Delirios Ranch (Parte Baja) -> Manzanas A2 (8 lotes), B (5 lotes), C (2 lotes), D (7 lotes), E (5 lotes), F (10 lotes), G (6 lotes) = 43 lotes = 90.721,22 m²

export const initialLots: LotItem[] = [
  // PARTE ALTA - COLINAS DE MIS DELIRIOS (14 Lotes)
  { id: 'A1-01', code: 'A1-01', manzana: 'A1', loteNum: '01', areaM2: 1431.80, type: 'mini-granja', status: 'disponible', priceUsdPerM2: 20, totalPriceUsd: 28636, location: 'alta' },
  { id: 'A1-02', code: 'A1-02', manzana: 'A1', loteNum: '02', areaM2: 1200.00, type: 'mini-granja', status: 'reservado', priceUsdPerM2: 20, totalPriceUsd: 24000, location: 'alta' },
  { id: 'A1-03', code: 'A1-03', manzana: 'A1', loteNum: '03', areaM2: 1155.92, type: 'mini-granja', status: 'disponible', priceUsdPerM2: 20, totalPriceUsd: 23118, location: 'alta' },
  { id: 'A1-04', code: 'A1-04', manzana: 'A1', loteNum: '04', areaM2: 1200.00, type: 'mini-granja', status: 'disponible', priceUsdPerM2: 20, totalPriceUsd: 24000, location: 'alta' },
  { id: 'A1-05', code: 'A1-05', manzana: 'A1', loteNum: '05', areaM2: 1200.00, type: 'mini-granja', status: 'vendido', priceUsdPerM2: 20, totalPriceUsd: 24000, location: 'alta' },
  { id: 'A1-06', code: 'A1-06', manzana: 'A1', loteNum: '06', areaM2: 1200.00, type: 'mini-granja', status: 'disponible', priceUsdPerM2: 20, totalPriceUsd: 24000, location: 'alta' },
  { id: 'A1-07', code: 'A1-07', manzana: 'A1', loteNum: '07', areaM2: 1505.97, type: 'mini-granja', status: 'disponible', priceUsdPerM2: 20, totalPriceUsd: 30119, location: 'alta' },
  { id: 'A1-08', code: 'A1-08', manzana: 'A1', loteNum: '08', areaM2: 4456.20, type: 'mini-granja', status: 'reservado', priceUsdPerM2: 20, totalPriceUsd: 89124, location: 'alta' },
  { id: 'A1-09', code: 'A1-09', manzana: 'A1', loteNum: '09', areaM2: 2612.40, type: 'mini-granja', status: 'disponible', priceUsdPerM2: 20, totalPriceUsd: 52248, location: 'alta' },
  { id: 'A1-10', code: 'A1-10', manzana: 'A1', loteNum: '10', areaM2: 2466.57, type: 'mini-granja', status: 'disponible', priceUsdPerM2: 20, totalPriceUsd: 49331, location: 'alta' },
  { id: 'A1-11', code: 'A1-11', manzana: 'A1', loteNum: '11', areaM2: 2321.75, type: 'mini-granja', status: 'vendido', priceUsdPerM2: 20, totalPriceUsd: 46435, location: 'alta' },
  { id: 'A1-12', code: 'A1-12', manzana: 'A1', loteNum: '12', areaM2: 2176.41, type: 'mini-granja', status: 'disponible', priceUsdPerM2: 20, totalPriceUsd: 43528, location: 'alta' },
  { id: 'A1-13', code: 'A1-13', manzana: 'A1', loteNum: '13', areaM2: 2216.37, type: 'mini-granja', status: 'disponible', priceUsdPerM2: 20, totalPriceUsd: 44327, location: 'alta' },
  { id: 'A1-14', code: 'A1-14', manzana: 'A1', loteNum: '14', areaM2: 4375.58, type: 'mini-granja', status: 'disponible', priceUsdPerM2: 20, totalPriceUsd: 87512, location: 'alta' },

  // PARTE BAJA - MIS DELIRIOS RANCH (43 Lotes)
  // Manzana A2 (8 lotes)
  { id: 'A2-01', code: 'A2-01', manzana: 'A2', loteNum: '01', areaM2: 2210.00, type: 'residencial', status: 'disponible', priceUsdPerM2: 20, totalPriceUsd: 44200, location: 'baja' },
  { id: 'A2-02', code: 'A2-02', manzana: 'A2', loteNum: '02', areaM2: 1040.76, type: 'residencial', status: 'disponible', priceUsdPerM2: 20, totalPriceUsd: 20815, location: 'baja' },
  { id: 'A2-03', code: 'A2-03', manzana: 'A2', loteNum: '03', areaM2: 1492.95, type: 'residencial', status: 'reservado', priceUsdPerM2: 20, totalPriceUsd: 29859, location: 'baja' },
  { id: 'A2-04', code: 'A2-04', manzana: 'A2', loteNum: '04', areaM2: 1136.29, type: 'residencial', status: 'disponible', priceUsdPerM2: 20, totalPriceUsd: 22726, location: 'baja' },
  { id: 'A2-05', code: 'A2-05', manzana: 'A2', loteNum: '05', areaM2: 1231.19, type: 'residencial', status: 'disponible', priceUsdPerM2: 20, totalPriceUsd: 24624, location: 'baja' },
  { id: 'A2-06', code: 'A2-06', manzana: 'A2', loteNum: '06', areaM2: 717.64, type: 'residencial', status: 'vendido', priceUsdPerM2: 20, totalPriceUsd: 14353, location: 'baja' },
  { id: 'A2-07', code: 'A2-07', manzana: 'A2', loteNum: '07', areaM2: 600.00, type: 'mini-granja', status: 'disponible', priceUsdPerM2: 20, totalPriceUsd: 12000, location: 'baja' },
  { id: 'A2-08', code: 'A2-08', manzana: 'A2', loteNum: '08', areaM2: 856.15, type: 'residencial', status: 'disponible', priceUsdPerM2: 20, totalPriceUsd: 17123, location: 'baja' },

  // Manzana B (5 lotes)
  { id: 'B2-09', code: 'B2-09', manzana: 'B', loteNum: '09', areaM2: 745.25, type: 'mini-granja', status: 'disponible', priceUsdPerM2: 20, totalPriceUsd: 14905, location: 'baja' },
  { id: 'B2-10', code: 'B2-10', manzana: 'B', loteNum: '10', areaM2: 600.00, type: 'mini-granja', status: 'disponible', priceUsdPerM2: 20, totalPriceUsd: 12000, location: 'baja' },
  { id: 'B2-11', code: 'B2-11', manzana: 'B', loteNum: '11', areaM2: 750.00, type: 'mini-granja', status: 'reservado', priceUsdPerM2: 20, totalPriceUsd: 15000, location: 'baja' },
  { id: 'B2-12', code: 'B2-12', manzana: 'B', loteNum: '12', areaM2: 998.58, type: 'mini-granja', status: 'disponible', priceUsdPerM2: 20, totalPriceUsd: 19972, location: 'baja' },
  { id: 'B2-13', code: 'B2-13', manzana: 'B', loteNum: '13', areaM2: 600.35, type: 'mini-granja', status: 'disponible', priceUsdPerM2: 20, totalPriceUsd: 12007, location: 'baja' },

  // Manzana C (2 lotes)
  { id: 'C2-14', code: 'C2-14', manzana: 'C', loteNum: '14', areaM2: 671.73, type: 'mini-granja', status: 'disponible', priceUsdPerM2: 20, totalPriceUsd: 13435, location: 'baja' },
  { id: 'C2-15', code: 'C2-15', manzana: 'C', loteNum: '15', areaM2: 828.75, type: 'mini-granja', status: 'disponible', priceUsdPerM2: 20, totalPriceUsd: 16575, location: 'baja' },

  // Manzana D (7 lotes)
  { id: 'D2-16', code: 'D2-16', manzana: 'D', loteNum: '16', areaM2: 654.48, type: 'mini-granja', status: 'disponible', priceUsdPerM2: 20, totalPriceUsd: 13090, location: 'baja' },
  { id: 'D2-17', code: 'D2-17', manzana: 'D', loteNum: '17', areaM2: 879.26, type: 'mini-granja', status: 'disponible', priceUsdPerM2: 20, totalPriceUsd: 17585, location: 'baja' },
  { id: 'D2-18', code: 'D2-18', manzana: 'D', loteNum: '18', areaM2: 1539.93, type: 'mini-granja', status: 'reservado', priceUsdPerM2: 20, totalPriceUsd: 30799, location: 'baja' },
  { id: 'D2-19', code: 'D2-19', manzana: 'D', loteNum: '19', areaM2: 1043.78, type: 'mini-granja', status: 'disponible', priceUsdPerM2: 20, totalPriceUsd: 20876, location: 'baja' },
  { id: 'D2-20', code: 'D2-20', manzana: 'D', loteNum: '20', areaM2: 1234.31, type: 'mini-granja', status: 'disponible', priceUsdPerM2: 20, totalPriceUsd: 24686, location: 'baja' },
  { id: 'D2-21', code: 'D2-21', manzana: 'D', loteNum: '21', areaM2: 1760.28, type: 'mini-granja', status: 'vendido', priceUsdPerM2: 20, totalPriceUsd: 35206, location: 'baja' },
  { id: 'D2-22', code: 'D2-22', manzana: 'D', loteNum: '22', areaM2: 1519.95, type: 'mini-granja', status: 'disponible', priceUsdPerM2: 20, totalPriceUsd: 30399, location: 'baja' },

  // Manzana E (5 lotes)
  { id: 'E2-23', code: 'E2-23', manzana: 'E', loteNum: '23', areaM2: 1639.67, type: 'mini-granja', status: 'disponible', priceUsdPerM2: 20, totalPriceUsd: 32793, location: 'baja' },
  { id: 'E2-24', code: 'E2-24', manzana: 'E', loteNum: '24', areaM2: 1340.50, type: 'mini-granja', status: 'disponible', priceUsdPerM2: 20, totalPriceUsd: 26810, location: 'baja' },
  { id: 'E2-25', code: 'E2-25', manzana: 'E', loteNum: '25', areaM2: 1363.25, type: 'mini-granja', status: 'disponible', priceUsdPerM2: 20, totalPriceUsd: 27265, location: 'baja' },
  { id: 'E2-26', code: 'E2-26', manzana: 'E', loteNum: '26', areaM2: 1394.43, type: 'mini-granja', status: 'reservado', priceUsdPerM2: 20, totalPriceUsd: 27889, location: 'baja' },
  { id: 'E2-27', code: 'E2-27', manzana: 'E', loteNum: '27', areaM2: 2154.53, type: 'mini-granja', status: 'disponible', priceUsdPerM2: 20, totalPriceUsd: 43091, location: 'baja' },

  // Manzana F (10 lotes)
  { id: 'F2-28', code: 'F2-28', manzana: 'F', loteNum: '28', areaM2: 699.08, type: 'mini-granja', status: 'disponible', priceUsdPerM2: 20, totalPriceUsd: 13982, location: 'baja' },
  { id: 'F2-29', code: 'F2-29', manzana: 'F', loteNum: '29', areaM2: 600.00, type: 'mini-granja', status: 'disponible', priceUsdPerM2: 20, totalPriceUsd: 12000, location: 'baja' },
  { id: 'F2-30', code: 'F2-30', manzana: 'F', loteNum: '30', areaM2: 600.00, type: 'mini-granja', status: 'disponible', priceUsdPerM2: 20, totalPriceUsd: 12000, location: 'baja' },
  { id: 'F2-31', code: 'F2-31', manzana: 'F', loteNum: '31', areaM2: 750.00, type: 'mini-granja', status: 'disponible', priceUsdPerM2: 20, totalPriceUsd: 15000, location: 'baja' },
  { id: 'F2-32', code: 'F2-32', manzana: 'F', loteNum: '32', areaM2: 600.00, type: 'mini-granja', status: 'disponible', priceUsdPerM2: 20, totalPriceUsd: 12000, location: 'baja' },
  { id: 'F2-33', code: 'F2-33', manzana: 'F', loteNum: '33', areaM2: 745.25, type: 'mini-granja', status: 'disponible', priceUsdPerM2: 20, totalPriceUsd: 14905, location: 'baja' },
  { id: 'F2-34', code: 'F2-34', manzana: 'F', loteNum: '34', areaM2: 600.00, type: 'mini-granja', status: 'disponible', priceUsdPerM2: 20, totalPriceUsd: 12000, location: 'baja' },
  { id: 'F2-35', code: 'F2-35', manzana: 'F', loteNum: '35', areaM2: 600.00, type: 'mini-granja', status: 'vendido', priceUsdPerM2: 20, totalPriceUsd: 12000, location: 'baja' },
  { id: 'F2-36', code: 'F2-36', manzana: 'F', loteNum: '36', areaM2: 600.00, type: 'mini-granja', status: 'disponible', priceUsdPerM2: 20, totalPriceUsd: 12000, location: 'baja' },
  { id: 'F2-37', code: 'F2-37', manzana: 'F', loteNum: '37', areaM2: 628.12, type: 'mini-granja', status: 'disponible', priceUsdPerM2: 20, totalPriceUsd: 12562, location: 'baja' },

  // Manzana G (6 lotes)
  { id: 'G2-38', code: 'G2-38', manzana: 'G', loteNum: '38', areaM2: 951.32, type: 'mini-granja', status: 'disponible', priceUsdPerM2: 20, totalPriceUsd: 19026, location: 'baja' },
  { id: 'G2-39', code: 'G2-39', manzana: 'G', loteNum: '39', areaM2: 633.53, type: 'mini-granja', status: 'disponible', priceUsdPerM2: 20, totalPriceUsd: 12671, location: 'baja' },
  { id: 'G2-40', code: 'G2-40', manzana: 'G', loteNum: '40', areaM2: 691.05, type: 'mini-granja', status: 'disponible', priceUsdPerM2: 20, totalPriceUsd: 13821, location: 'baja' },
  { id: 'G2-41', code: 'G2-41', manzana: 'G', loteNum: '41', areaM2: 845.49, type: 'mini-granja', status: 'reservado', priceUsdPerM2: 20, totalPriceUsd: 16910, location: 'baja' },
  { id: 'G2-42', code: 'G2-42', manzana: 'G', loteNum: '42', areaM2: 717.64, type: 'mini-granja', status: 'disponible', priceUsdPerM2: 20, totalPriceUsd: 14353, location: 'baja' },
  { id: 'G2-43', code: 'G2-43', manzana: 'G', loteNum: '43', areaM2: 858.52, type: 'mini-granja', status: 'disponible', priceUsdPerM2: 20, totalPriceUsd: 17170, location: 'baja' },
];
