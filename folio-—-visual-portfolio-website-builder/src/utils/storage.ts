import { Portfolio } from '../types/portfolio';
import { validatePortfolio } from './portfolioLogic';

const STORAGE_KEY_PORTFOLIOS = 'folio_portfolios_v1';
const STORAGE_KEY_ACTIVE_ID = 'folio_active_portfolio_id_v1';
const STORAGE_KEY_AUTH_MODE = 'folio_auth_mode_v1';
const STORAGE_KEY_TOUR_DONE = 'folio_editor_tour_done_v1';

export interface StorageUsageInfo {
  usedBytes: number;
  usedKB: number;
  maxKB: number;
  percent: number;
  isNearLimit: boolean;
}

export interface StorageAdapter {
  loadPortfolios(): Portfolio[];
  savePortfolios(portfolios: Portfolio[]): boolean;
  getActivePortfolioId(): string | null;
  setActivePortfolioId(id: string | null): void;
  getStorageUsage(): StorageUsageInfo;
}

export class LocalStorageAdapter implements StorageAdapter {
  loadPortfolios(): Portfolio[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_PORTFOLIOS);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed.filter((item) => validatePortfolio(item).valid);
    } catch {
      return [];
    }
  }

  savePortfolios(portfolios: Portfolio[]): boolean {
    try {
      localStorage.setItem(STORAGE_KEY_PORTFOLIOS, JSON.stringify(portfolios));
      return true;
    } catch {
      return false;
    }
  }

  getActivePortfolioId(): string | null {
    try {
      return localStorage.getItem(STORAGE_KEY_ACTIVE_ID);
    } catch {
      return null;
    }
  }

  setActivePortfolioId(id: string | null): void {
    try {
      if (id) {
        localStorage.setItem(STORAGE_KEY_ACTIVE_ID, id);
      } else {
        localStorage.removeItem(STORAGE_KEY_ACTIVE_ID);
      }
    } catch {
      // ignore storage error
    }
  }

  getStorageUsage(): StorageUsageInfo {
    try {
      let totalChars = 0;
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k) {
          const val = localStorage.getItem(k) || '';
          totalChars += k.length + val.length;
        }
      }
      const usedBytes = totalChars * 2; // UTF-16 approximation
      const usedKB = Math.round((usedBytes / 1024) * 10) / 10;
      const maxKB = 5120; // ~5MB standard localStorage quota
      const percent = Math.min(100, Math.round((usedKB / maxKB) * 100));
      return {
        usedBytes,
        usedKB,
        maxKB,
        percent,
        isNearLimit: percent >= 80,
      };
    } catch {
      return { usedBytes: 0, usedKB: 0, maxKB: 5120, percent: 0, isNearLimit: false };
    }
  }
}

export const storageAdapter: StorageAdapter = new LocalStorageAdapter();

export function getGuestModeStatus(): { mode: 'guest' | 'firebase'; email?: string } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_AUTH_MODE);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return { mode: 'guest' };
}

export function isEditorTourCompleted(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY_TOUR_DONE) === 'true';
  } catch {
    return false;
  }
}

export function markEditorTourCompleted(): void {
  try {
    localStorage.setItem(STORAGE_KEY_TOUR_DONE, 'true');
  } catch {
    // ignore
  }
}

/**
 * Compresses and resizes an uploaded image File into a lightweight base64 data URI
 * so localStorage remains fast and under quota.
 */
export function compressImageFile(
  file: File,
  maxWidth = 900,
  maxHeight = 900,
  quality = 0.8
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not initialize image compression canvas.'));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      };
      img.onerror = () => reject(new Error('Failed to decode uploaded image.'));
      img.src = String(event.target?.result || '');
    };
    reader.onerror = () => reject(new Error('Failed to read image file.'));
    reader.readAsDataURL(file);
  });
}
