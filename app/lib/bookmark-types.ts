/**
 * Database model for folders
 */
export interface Folder {
  id: string;
  chrome_id: string;
  parent_id: string | null;
  title: string;
  path: string;
  date_added: number;
  date_modified: number | null;
  position: number;
  created_at: number;
  updated_at: number;
}

/**
 * Database model for bookmarks
 */
export interface Bookmark {
  id: string;
  chrome_id: string;
  folder_id: string | null;
  title: string;
  url: string;
  favicon_url: string | null;
  path: string;
  date_added: number;
  date_modified: number | null;
  position: number;
  created_at: number;
  updated_at: number;
}

/**
 * Database model for API keys
 */
export interface ApiKey {
  id: string;
  key_hash: string;
  name: string;
  created_at: number;
  last_used_at: number | null;
}

/**
 * Tree node for frontend display
 */
export interface TreeNode {
  id: string;
  title: string;
  type: "folder" | "bookmark";
  url?: string;
  favicon_url?: string;
  date_added: number;
  children: TreeNode[];
}

/**
 * Sync payload from Chrome extension
 */
export type SyncAction = "create" | "remove" | "change" | "move" | "sync_all";

export interface BookmarkSyncData {
  chrome_id: string;
  parent_id: string | null;
  title: string;
  url: string | null;
  path: string;
  date_added: number;
  date_modified?: number | null;
  position: number;
  is_folder: boolean;
}

export interface FolderSyncData {
  chrome_id: string;
  parent_id: string | null;
  title: string;
  path: string;
  date_added: number;
  date_modified?: number | null;
  position: number;
}

export interface SyncPayload {
  action: SyncAction;
  bookmark?: BookmarkSyncData;
  bookmarks?: BookmarkSyncData[];
  folders?: FolderSyncData[];
}

/**
 * API response types
 */
export interface BookmarksResponse {
  folders: Folder[];
  bookmarks: Bookmark[];
}

export interface BookmarksBarResponse {
  categories: Folder[];
  bookmarks: Bookmark[];
}

export interface SyncResponse {
  success: boolean;
  message: string;
  stats?: {
    folders: number;
    bookmarks: number;
  };
}
