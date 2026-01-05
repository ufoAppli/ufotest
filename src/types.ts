
// src/types.ts
export type Store = { id: string; name: string; createdAt: string };
export type Entry = {
  id: string; storeId: string;
  machine: string; prize: string; size: string; setup: string;
  count: number; photoIds: string[];
  createdAt: string; updatedAt: string;
};
export type Photo = { id: string; storeId: string; entryId?: string; fileName: string; blob: Blob; createdAt: string };
export type Masters = {
  machines: string[]; prizes: string[]; sizes: string[]; setups: string[];
  updatedAt: string;
};
export type Session = {
  storeId?: string;
  storeName?: string;
  machine?: string;
  prize?: string;
  size?: string;
  setup?: string;
  // 画面3/8で撮った一時写真
  tempPhotos: { fileName: string; blob: Blob }[];
};
