// JRAR Bookmark Sync - Popup Script

document.addEventListener("DOMContentLoaded", async () => {
  const apiBaseInput = document.getElementById("apiBase");
  const apiKeyInput = document.getElementById("apiKey");
  const saveSettingsBtn = document.getElementById("saveSettings");
  const testConnectionBtn = document.getElementById("testConnection");
  const syncAllBtn = document.getElementById("syncAll");
  const statusDiv = document.getElementById("status");

  // Load saved settings
  const { apiKey, apiBase } = await chrome.storage.sync.get([
    "apiKey",
    "apiBase",
  ]);
  if (apiKey) {
    apiKeyInput.value = apiKey;
  }
  if (apiBase) {
    apiBaseInput.value = apiBase;
  } else {
    apiBaseInput.value = "https://jrar.dev/api/bookmarks";
  }

  function showStatus(message, isError = false) {
    statusDiv.textContent = message;
    statusDiv.classList.add("visible");
    statusDiv.classList.toggle("error", isError);
    statusDiv.classList.toggle("success", !isError);
  }

  function hideStatus() {
    statusDiv.classList.remove("visible");
  }

  function setButtonsDisabled(disabled) {
    saveSettingsBtn.disabled = disabled;
    testConnectionBtn.disabled = disabled;
    syncAllBtn.disabled = disabled;
  }

  // Save settings
  saveSettingsBtn.addEventListener("click", async () => {
    const key = apiKeyInput.value.trim();
    const base = apiBaseInput.value.trim() || "https://jrar.dev/api/bookmarks";

    if (!key) {
      showStatus("API key required", true);
      return;
    }

    await chrome.storage.sync.set({ apiKey: key, apiBase: base });
    showStatus("Settings saved");
  });

  // Test connection
  testConnectionBtn.addEventListener("click", async () => {
    hideStatus();
    setButtonsDisabled(true);
    testConnectionBtn.textContent = "Testing...";

    try {
      const response = await chrome.runtime.sendMessage({
        action: "testConnection",
      });

      if (response.success) {
        showStatus("Connection successful");
      } else {
        showStatus(response.error || "Connection failed", true);
      }
    } catch (error) {
      showStatus(error.message, true);
    } finally {
      setButtonsDisabled(false);
      testConnectionBtn.textContent = "Test Connection";
    }
  });

  // Sync all bookmarks
  syncAllBtn.addEventListener("click", async () => {
    hideStatus();
    setButtonsDisabled(true);
    syncAllBtn.textContent = "Syncing...";

    try {
      const response = await chrome.runtime.sendMessage({ action: "syncAll" });

      if (response.success) {
        showStatus(
          `Synced ${response.folders} folders, ${response.bookmarks} bookmarks`
        );
      } else {
        showStatus(response.error || "Sync failed", true);
      }
    } catch (error) {
      showStatus(error.message, true);
    } finally {
      setButtonsDisabled(false);
      syncAllBtn.textContent = "Sync All Bookmarks";
    }
  });
});
