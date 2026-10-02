import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  query,
  orderBy,
  limit,
} from 'firebase/firestore';
import { db } from '../firebase';
import { DiaryEntry } from '../types';

const COLLECTION_NAME = 'diaries';
const LOCAL_STORAGE_KEY = 'warm_daily_diaries';

// Helper to get local backup
function getLocalDiaries(): DiaryEntry[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Failed to read localStorage:', e);
    return [];
  }
}

// Helper to save local backup
function saveLocalDiaries(diaries: DiaryEntry[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(diaries));
  } catch (e) {
    console.error('Failed to write localStorage:', e);
  }
}

export async function saveDiaryEntry(entry: Omit<DiaryEntry, 'id'>): Promise<DiaryEntry> {
  const newEntryId = 'diary_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
  const fullEntry: DiaryEntry = {
    ...entry,
    id: newEntryId,
    syncedToFirebase: false,
  };

  // Always update local storage first so user never loses data
  const localList = getLocalDiaries();
  const updatedLocal = [fullEntry, ...localList];
  saveLocalDiaries(updatedLocal);

  // Attempt to save to Firebase Firestore
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      date: entry.date,
      emotion: entry.emotion,
      content: entry.content,
      aiResponse: entry.aiResponse || null,
      actionCompleted: entry.actionCompleted || false,
      createdAt: entry.createdAt,
    });

    fullEntry.id = docRef.id;
    fullEntry.syncedToFirebase = true;

    // Update the ID in local storage to match firestore doc ID
    const syncedList = updatedLocal.map((item) =>
      item.createdAt === entry.createdAt ? { ...item, id: docRef.id, syncedToFirebase: true } : item
    );
    saveLocalDiaries(syncedList);
  } catch (firestoreErr) {
    console.warn(
      'Firestore save fallback to local storage (Firebase rules or network):',
      firestoreErr
    );
  }

  return fullEntry;
}

export async function fetchDiaryEntries(): Promise<DiaryEntry[]> {
  const localList = getLocalDiaries();

  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      orderBy('createdAt', 'desc'),
      limit(100)
    );
    const snapshot = await getDocs(q);
    const firestoreEntries: DiaryEntry[] = snapshot.docs.map((docSnap) => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        date: data.date || '',
        emotion: data.emotion || '기쁨',
        content: data.content || '',
        aiResponse: data.aiResponse || undefined,
        actionCompleted: Boolean(data.actionCompleted),
        createdAt: data.createdAt || Date.now(),
        syncedToFirebase: true,
      };
    });

    if (firestoreEntries.length > 0) {
      // Merge with any unsynced local entries
      const mergedMap = new Map<string, DiaryEntry>();
      firestoreEntries.forEach((e) => mergedMap.set(e.id, e));
      localList.forEach((e) => {
        if (!mergedMap.has(e.id)) {
          mergedMap.set(e.id, e);
        }
      });
      const merged = Array.from(mergedMap.values()).sort(
        (a, b) => b.createdAt - a.createdAt
      );
      saveLocalDiaries(merged);
      return merged;
    }
  } catch (error) {
    console.warn('Firestore fetch failed, serving from local cache:', error);
  }

  return localList.sort((a, b) => b.createdAt - a.createdAt);
}

export async function deleteDiaryEntry(id: string): Promise<void> {
  // Delete from local
  const current = getLocalDiaries().filter((item) => item.id !== id);
  saveLocalDiaries(current);

  // Attempt to delete from Firestore
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
  } catch (error) {
    console.warn('Could not delete from Firestore:', error);
  }
}

export async function toggleActionCompleted(id: string, completed: boolean): Promise<void> {
  // Update local
  const current = getLocalDiaries().map((item) =>
    item.id === id ? { ...item, actionCompleted: completed } : item
  );
  saveLocalDiaries(current);

  // Update in Firestore
  try {
    await updateDoc(doc(db, COLLECTION_NAME, id), {
      actionCompleted: completed,
    });
  } catch (error) {
    console.warn('Could not update action status in Firestore:', error);
  }
}
