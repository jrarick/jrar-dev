// JRAR Bookmark Sync - Background Service Worker

// API configuration
const getApiBase = async () => {
  const { apiBase } = await chrome.storage.sync.get(["apiBase"]);
  return apiBase || "https://jrar.dev/api/bookmarks";
};

// Get API key from storage
const getApiKey = async () => {
  const { apiKey } = await chrome.storage.sync.get(["apiKey"]);
  return apiKey;
};

// Build folder path from parent chain
const buildFolderPath = async (folderId) => {
  const path = [];
  let currentId = folderId;

  while (currentId) {
    try {
      const [node] = await chrome.bookmarks.get(currentId);
      if (!node || !node.title) break;
      path.unshift(node.title);
      currentId = node.parentId;
    } catch {
      break;
    }
  }

  return "/" + path.join("/");
};

// Convert Chrome bookmark to API format
const toApiFormat = async (bookmark) => {
  const path = await buildFolderPath(bookmark.parentId);
  return {
    chrome_id: bookmark.id,
    parent_id: bookmark.parentId,
    title: bookmark.title,
    url: bookmark.url || null,
    path: path,
    date_added: bookmark.dateAdded || Date.now(),
    date_modified: bookmark.dateGroupModified || null,
    position: bookmark.index || 0,
    is_folder: !bookmark.url,
  };
};

// Send sync request to API
const syncToApi = async (action, bookmark) => {
  const apiKey = await getApiKey();
  if (!apiKey) {
    console.error("[JRAR Sync] No API key configured");
    return { success: false, error: "No API key configured" };
  }

  const apiBase = await getApiBase();
  const bookmarkData = await toApiFormat(bookmark);

  try {
    const response = await fetch(`${apiBase}/sync`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        action,
        bookmark: bookmarkData,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[JRAR Sync] Sync failed:", errorText);
      return { success: false, error: errorText };
    }

    const result = await response.json();
    console.log("[JRAR Sync] Sync success:", action, result);
    return { success: true, ...result };
  } catch (error) {
    console.error("[JRAR Sync] Sync error:", error);
    return { success: false, error: error.message };
  }
};

// Bookmark event listeners
chrome.bookmarks.onCreated.addListener(async (id, bookmark) => {
  console.log("[JRAR Sync] Bookmark created:", bookmark.title);
  await syncToApi("create", bookmark);
});

chrome.bookmarks.onRemoved.addListener(async (id, removeInfo) => {
  console.log("[JRAR Sync] Bookmark removed:", id);
  await syncToApi("remove", { id, chrome_id: id, ...removeInfo });
});

chrome.bookmarks.onChanged.addListener(async (id, changeInfo) => {
  console.log("[JRAR Sync] Bookmark changed:", id);
  const [bookmark] = await chrome.bookmarks.get(id);
  await syncToApi("change", { ...bookmark, ...changeInfo });
});

chrome.bookmarks.onMoved.addListener(async (id, moveInfo) => {
  console.log("[JRAR Sync] Bookmark moved:", id);
  const [bookmark] = await chrome.bookmarks.get(id);
  await syncToApi("move", { ...bookmark, ...moveInfo });
});

// Full sync function - exports all bookmarks
const syncAllBookmarks = async () => {
  const apiKey = await getApiKey();
  if (!apiKey) {
    throw new Error("No API key configured");
  }

  const apiBase = await getApiBase();
  // Only sync "Bookmarks Bar" (ID 1) to prevent syncing private bookmarks
  // from "Other Bookmarks" or "Mobile Bookmarks"
  const tree = await chrome.bookmarks.getSubTree("1");
  const folders = [];
  const bookmarks = [];

  // Recursive function to flatten tree
  const processNode = async (node, parentPath = "") => {
    const currentPath = parentPath
      ? `${parentPath}/${node.title}`
      : node.title;

    if (node.children) {
      // It's a folder
      if (node.id !== "0") {
        // Skip root
        folders.push({
          chrome_id: node.id,
          parent_id: node.parentId,
          title: node.title || "",
          path: "/" + currentPath,
          date_added: node.dateAdded || Date.now(),
          date_modified: node.dateGroupModified || null,
          position: node.index || 0,
        });
      }

      for (const child of node.children) {
        await processNode(child, node.id === "0" ? "" : currentPath);
      }
    } else if (node.url) {
      // It's a bookmark
      bookmarks.push({
        chrome_id: node.id,
        parent_id: node.parentId,
        title: node.title,
        url: node.url,
        path: "/" + parentPath,
        date_added: node.dateAdded || Date.now(),
        position: node.index || 0,
        is_folder: false,
      });
    }
  };

  await processNode(tree[0]);

  console.log(
    "[JRAR Sync] Full sync:",
    folders.length,
    "folders,",
    bookmarks.length,
    "bookmarks"
  );

  const response = await fetch(`${apiBase}/sync`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      action: "sync_all",
      folders,
      bookmarks,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText);
  }

  return { folders: folders.length, bookmarks: bookmarks.length };
};

// Listen for messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "syncAll") {
    syncAllBookmarks()
      .then((result) => sendResponse({ success: true, ...result }))
      .catch((error) => sendResponse({ success: false, error: error.message }));
    return true; // Keep channel open for async response
  }

  if (message.action === "testConnection") {
    getApiKey().then((apiKey) => {
      if (!apiKey) {
        sendResponse({ success: false, error: "No API key configured" });
        return;
      }
      getApiBase().then((apiBase) => {
        fetch(`${apiBase}/sync`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({ action: "ping" }),
        })
          .then(async (res) => {
            if (res.ok) {
              sendResponse({ success: true });
            } else {
              const data = await res.json().catch(() => ({}));
              sendResponse({
                success: false,
                error: data.message || `Connection failed (${res.status})`,
              });
            }
          })
          .catch((err) => sendResponse({ success: false, error: err.message }));
      });
    });
    return true;
  }
});
