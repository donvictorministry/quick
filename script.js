/**
 * QUICK-SNIPPETS - CLIENT ENGINE
 * Pure Vanilla JavaScript • Zero Dependencies
 * Data Contract: 'snippets' (array of strings) and 'theme' ('light' | 'dark')
 */

// 1. Service Worker Registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js').catch(() => {});
  });
}

// 2. State & Storage Management
let snippets = [];
let editingIndex = null;

function loadStoredData() {
  try {
    const raw = localStorage.getItem('snippets');
    snippets = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(snippets)) snippets = [];
  } catch (_) {
    snippets = [];
  }
}

function persistSnippets() {
  try {
    localStorage.setItem('snippets', JSON.stringify(snippets));
  } catch (e) {
    showToast('Storage quota exceeded! Export data.', 'danger');
  }
}

// 3. Non-Blocking Async Toast Engine (Zero alert())
const toastContainer = document.getElementById('toastContainer');

function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span>${message}</span>
    <button style="border:none;background:transparent;color:inherit;font-weight:bold;cursor:pointer;font-size:var(--font-size);">✕</button>
  `;

  toast.querySelector('button').addEventListener('click', () => toast.remove());
  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.25s ease';
    setTimeout(() => toast.remove(), 250);
  }, 3500);
}

// 4. Drawers & Overlay Management
const leftMenuBtn = document.getElementById('leftMenuBtn');
const rightMenuBtn = document.getElementById('rightMenuBtn');
const leftSidebar = document.getElementById('leftSidebar');
const rightSidebar = document.getElementById('rightSidebar');
const drawerOverlay = document.getElementById('drawerOverlay');

function closeDrawers() {
  leftSidebar.classList.remove('open');
  rightSidebar.classList.remove('open');
  drawerOverlay.classList.remove('active');
}

leftMenuBtn.addEventListener('click', () => {
  leftSidebar.classList.add('open');
  drawerOverlay.classList.add('active');
});

rightMenuBtn.addEventListener('click', () => {
  rightSidebar.classList.add('open');
  drawerOverlay.classList.add('active');
});

drawerOverlay.addEventListener('click', closeDrawers);
document.querySelectorAll('[data-close]').forEach(btn => btn.addEventListener('click', closeDrawers));

// 5. Fullscreen Modals (7 Informational Modals)
document.querySelectorAll('.nav-link-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    closeDrawers();
    const modal = document.getElementById(btn.getAttribute('data-modal'));
    if (modal) modal.classList.add('active');
  });
});

document.querySelectorAll('.close-modal-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.fullscreen-modal').forEach(m => m.classList.remove('active'));
  });
});

// Developer Bio 6-Line Clamp
const toggleBioBtn = document.getElementById('toggleBioBtn');
const devBioText = document.getElementById('devBioText');
toggleBioBtn.addEventListener('click', () => {
  const expanded = devBioText.classList.toggle('expanded');
  toggleBioBtn.textContent = expanded ? 'Show Less' : 'Show More';
});

// Partner Form
document.getElementById('partnerForm').addEventListener('submit', (e) => {
  e.preventDefault();
  showToast('Partnership proposal submitted successfully.', 'success');
  e.target.reset();
  document.getElementById('modalPartner').classList.remove('active');
});

// 6. Theme & Font Scaling Engine (19px to 23px)
const darkModeCheckbox = document.getElementById('darkModeCheckbox');
const fontSlider = document.getElementById('fontSlider');
const fontSizeIndicator = document.getElementById('fontSizeIndicator');

function applyTheme(theme) {
  document.body.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  darkModeCheckbox.checked = (theme === 'dark');
}

darkModeCheckbox.addEventListener('change', (e) => {
  const target = e.target.checked ? 'dark' : 'light';
  applyTheme(target);
  showToast(`Switched to ${target} mode`, 'info');
});

fontSlider.addEventListener('input', (e) => {
  const size = e.target.value;
  fontSizeIndicator.textContent = `${size}px`;
  document.documentElement.style.setProperty('--font-size', `${size}px`);
  localStorage.setItem('qs_fontsize', size);
});

// Load Font Scale & Theme
const savedFontSize = localStorage.getItem('qs_fontsize') || '19';
fontSlider.value = savedFontSize;
fontSizeIndicator.textContent = `${savedFontSize}px`;
document.documentElement.style.setProperty('--font-size', `${savedFontSize}px`);

const savedTheme = localStorage.getItem('theme') || 'light';
applyTheme(savedTheme);

// 7. Snippets CRUD & Live Search
const snippetsList = document.getElementById('snippetsList');
const snippetsCountLabel = document.getElementById('snippetsCountLabel');
const searchInput = document.getElementById('searchInput');
const clearSearchBtn = document.getElementById('clearSearchBtn');

function renderSnippets(query = '') {
  snippetsList.innerHTML = '';
  const filtered = snippets
    .map((text, originalIndex) => ({ text, originalIndex }))
    .filter(item => item.text.toLowerCase().includes(query.toLowerCase()));

  snippetsCountLabel.textContent = `${filtered.length} of ${snippets.length} Snippet${snippets.length === 1 ? '' : 's'}`;

  if (filtered.length === 0) {
    snippetsList.innerHTML = `
      <div class="empty-state">
        <p>${snippets.length === 0 ? 'No snippets saved yet. Capture your first one above!' : 'No matching snippets found.'}</p>
      </div>
    `;
    return;
  }

  filtered.forEach(({ text, originalIndex }) => {
    const card = document.createElement('article');
    card.className = 'snippet-card';

    const contentDiv = document.createElement('div');
    contentDiv.className = 'snippet-content';
    contentDiv.textContent = text;

    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'snippet-actions';

    // Copy Button
    const copyBtn = document.createElement('button');
    copyBtn.className = 'action-btn copy';
    copyBtn.innerHTML = `
      <svg class="ui-icon" viewBox="0 0 24 24"><path fill="currentColor" d="M19 21H8V7h11m0-2H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2m-3-4H4a2 2 0 0 0-2 2v14h2V3h12V1Z"/></svg>
      <span>Copy</span>
    `;
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(text).then(() => {
        showToast('Copied to clipboard!', 'success');
      }).catch(() => {
        showToast('Clipboard access denied', 'danger');
      });
    });

    // Edit Button
    const editBtn = document.createElement('button');
    editBtn.className = 'action-btn';
    editBtn.innerHTML = `
      <svg class="ui-icon" viewBox="0 0 24 24"><path fill="currentColor" d="M20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.37-.39-1.02-.39-1.41 0l-1.84 1.83 3.75 3.75M3 17.25V21h3.75L17.81 9.93l-3.75-3.75L3 17.25Z"/></svg>
      <span>Edit</span>
    `;
    editBtn.addEventListener('click', () => openEditModal(originalIndex));

    // Delete Button
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'action-btn delete';
    deleteBtn.innerHTML = `
      <svg class="ui-icon" viewBox="0 0 24 24"><path fill="currentColor" d="M19 4h-3.5l-1-1h-5l-1 1H5v2h14M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6v12Z"/></svg>
      <span>Delete</span>
    `;
    deleteBtn.addEventListener('click', () => deleteSnippet(originalIndex));

    actionsDiv.appendChild(copyBtn);
    actionsDiv.appendChild(editBtn);
    actionsDiv.appendChild(deleteBtn);

    card.appendChild(contentDiv);
    card.appendChild(actionsDiv);
    snippetsList.appendChild(card);
  });
}

// Live Search Listener
searchInput.addEventListener('input', (e) => {
  const q = e.target.value;
  clearSearchBtn.classList.toggle('visible', q.length > 0);
  renderSnippets(q);
});

clearSearchBtn.addEventListener('click', () => {
  searchInput.value = '';
  clearSearchBtn.classList.remove('visible');
  renderSnippets();
  searchInput.focus();
});

// Create Snippet
const newSnippetInput = document.getElementById('newSnippetInput');
const saveSnippetBtn = document.getElementById('saveSnippetBtn');

saveSnippetBtn.addEventListener('click', () => {
  const text = newSnippetInput.value.trim();
  if (!text) {
    showToast('Snippet cannot be empty', 'danger');
    return;
  }
  snippets.unshift(text);
  persistSnippets();
  newSnippetInput.value = '';
  renderSnippets(searchInput.value);
  showToast('Snippet saved successfully!', 'success');
});

// Edit Snippet Logic
const editModal = document.getElementById('editModal');
const editSnippetInput = document.getElementById('editSnippetInput');
const updateSnippetBtn = document.getElementById('updateSnippetBtn');
const closeEditModalBtn = document.getElementById('closeEditModalBtn');

function openEditModal(index) {
  editingIndex = index;
  editSnippetInput.value = snippets[index];
  editModal.classList.add('active');
  setTimeout(() => editSnippetInput.focus(), 150);
}

function closeEditModal() {
  editingIndex = null;
  editModal.classList.remove('active');
}

updateSnippetBtn.addEventListener('click', () => {
  if (editingIndex === null) return;
  const text = editSnippetInput.value.trim();
  if (!text) {
    showToast('Snippet cannot be empty', 'danger');
    return;
  }
  snippets[editingIndex] = text;
  persistSnippets();
  closeEditModal();
  renderSnippets(searchInput.value);
  showToast('Snippet updated.', 'success');
});

closeEditModalBtn.addEventListener('click', closeEditModal);

function deleteSnippet(index) {
  snippets.splice(index, 1);
  persistSnippets();
  renderSnippets(searchInput.value);
  showToast('Snippet deleted.', 'info');
}

// 8. Backup, JSON Export & Import (Right Drawer)
const exportJsonBtn = document.getElementById('exportJsonBtn');
const importFileInput = document.getElementById('importFileInput');
const syncPasteInput = document.getElementById('syncPasteInput');
const mergeSyncBtn = document.getElementById('mergeSyncBtn');

exportJsonBtn.addEventListener('click', () => {
  if (snippets.length === 0) {
    showToast('No snippets to export.', 'info');
    return;
  }
  const blob = new Blob([JSON.stringify(snippets, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `quick-snippets-backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('Backup JSON downloaded.', 'success');
});

importFileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const parsed = JSON.parse(event.target.result);
      if (!Array.isArray(parsed)) throw new Error();
      
      const beforeCount = snippets.length;
      const combined = [...snippets, ...parsed.filter(item => typeof item === 'string' && item.trim().length > 0)];
      snippets = Array.from(new Set(combined));
      
      const added = snippets.length - beforeCount;
      persistSnippets();
      renderSnippets();
      closeDrawers();
      showToast(`Imported! ${added} new snippet(s) merged.`, 'success');
    } catch (_) {
      showToast('Invalid JSON file format.', 'danger');
    }
  };
  reader.readAsText(file);
  e.target.value = '';
});

mergeSyncBtn.addEventListener('click', () => {
  const raw = syncPasteInput.value.trim();
  if (!raw) {
    showToast('Paste a JSON array of strings to merge.', 'danger');
    return;
  }
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) throw new Error();
    
    const beforeCount = snippets.length;
    const combined = [...snippets, ...parsed.filter(item => typeof item === 'string' && item.trim().length > 0)];
    snippets = Array.from(new Set(combined));
    
    const added = snippets.length - beforeCount;
    persistSnippets();
    renderSnippets();
    syncPasteInput.value = '';
    closeDrawers();
    showToast(`Merged! ${added} new snippet(s) added.`, 'success');
  } catch (_) {
    showToast('Invalid JSON. Must be ["Snippet 1", "Snippet 2"]', 'danger');
  }
});

// 9. Android Install, Share & Bluetooth
let deferredPrompt = null;
const installAppBtn = document.getElementById('installAppBtn');
const shareAppBtn = document.getElementById('shareAppBtn');
const bluetoothShareBtn = document.getElementById('bluetoothShareBtn');

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  installAppBtn.style.display = 'flex';
});

installAppBtn.addEventListener('click', async () => {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      deferredPrompt = null;
      showToast('Quick-Snippets Installed to Home Screen', 'success');
    }
  } else {
    showToast('App is ready offline or already installed.', 'info');
  }
});

shareAppBtn.addEventListener('click', async () => {
  if (navigator.share) {
    try {
      await navigator.share({
        title: 'Quick-Snippets',
        text: 'Private, offline-first mobile clipboard and knowledge snippet manager.',
        url: window.location.href,
      });
      showToast('Shared successfully.', 'success');
    } catch (_) {}
  } else {
    navigator.clipboard.writeText(window.location.href);
    showToast('Direct URL copied to clipboard!', 'success');
  }
});

bluetoothShareBtn.addEventListener('click', async () => {
  if (navigator.bluetooth) {
    try {
      showToast('Scanning nearby Bluetooth devices...', 'info');
      await navigator.bluetooth.requestDevice({ acceptAllDevices: true });
      showToast('Bluetooth pairing handshake ready.', 'success');
    } catch (_) {
      showToast('Bluetooth pairing dismissed.', 'danger');
    }
  } else {
    showToast('Web Bluetooth available on Chrome Android.', 'danger');
  }
});

// Initial Load
loadStoredData();
renderSnippets();