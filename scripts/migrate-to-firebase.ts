import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, writeBatch } from 'firebase/firestore';
import fs from 'fs';
import path from 'path';

// Read config
const configPath = path.join(process.cwd(), 'firebase-applet-config.json');
const firebaseConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || '(default)');

async function migrate() {
  console.log('--- Iniciando migración a Firebase Firestore ---');
  console.log(`Proyecto: ${firebaseConfig.projectId}`);
  console.log(`Base de datos: ${firebaseConfig.firestoreDatabaseId}`);

  const dataDir = path.join(process.cwd(), 'data');

  // 1. Migrar cms_content
  const contentFile = path.join(dataDir, 'cms_content.json');
  if (fs.existsSync(contentFile)) {
    const content = JSON.parse(fs.readFileSync(contentFile, 'utf-8'));
    console.log('Migrando cms_content/global_content...');
    await setDoc(doc(db, 'cms_content', 'global_content'), {
      ...content,
      _migratedAt: new Date().toISOString(),
    });
    console.log('✓ cms_content migrado.');
  }

  // 2. Migrar models
  const modelsFile = path.join(dataDir, 'models.json');
  if (fs.existsSync(modelsFile)) {
    const models = JSON.parse(fs.readFileSync(modelsFile, 'utf-8'));
    console.log(`Migrando ${models.length} modelos de vivienda...`);
    // Guardar catálogo global
    await setDoc(doc(db, 'housing_models', 'catalog'), {
      models,
      updatedAt: new Date().toISOString(),
    });
    // Guardar documentos individuales
    for (const m of models) {
      if (m.id) {
        await setDoc(doc(db, 'housing_models', m.id), m);
      }
    }
    console.log('✓ Modelos de vivienda migrados.');
  }

  // 3. Migrar lots
  const lotsFile = path.join(dataDir, 'lots.json');
  if (fs.existsSync(lotsFile)) {
    const lots = JSON.parse(fs.readFileSync(lotsFile, 'utf-8'));
    console.log(`Migrando ${lots.length} lotes...`);
    // Guardar catálogo en lotes
    await setDoc(doc(db, 'lots_metadata', 'catalog'), {
      lots,
      updatedAt: new Date().toISOString(),
    });
    // Guardar cada lote por lote en batches de hasta 100
    const batch = writeBatch(db);
    for (const lot of lots.slice(0, 100)) {
      if (lot.id) {
        batch.set(doc(db, 'lots', lot.id), lot);
      }
    }
    await batch.commit();
    console.log('✓ Lotes migrados a Firestore.');
  }

  // 4. Migrar leads
  const leadsFile = path.join(dataDir, 'leads.json');
  if (fs.existsSync(leadsFile)) {
    const leads = JSON.parse(fs.readFileSync(leadsFile, 'utf-8'));
    console.log(`Migrando ${leads.length} prospectos...`);
    for (const lead of leads) {
      if (lead.id) {
        await setDoc(doc(db, 'leads', lead.id), lead);
      }
    }
    console.log('✓ Prospectos migrados.');
  }

  // 5. Migrar users
  const usersFile = path.join(dataDir, 'users.json');
  if (fs.existsSync(usersFile)) {
    const users = JSON.parse(fs.readFileSync(usersFile, 'utf-8'));
    console.log(`Migrando ${users.length} usuarios del CMS...`);
    for (const u of users) {
      if (u.id) {
        await setDoc(doc(db, 'users', u.id), u);
      }
    }
    console.log('✓ Usuarios migrados.');
  }

  console.log('🎉 Migración completada exitosamente a Firebase Firestore.');
  process.exit(0);
}

migrate().catch((err) => {
  console.error('Error durante la migración:', err);
  process.exit(1);
});
