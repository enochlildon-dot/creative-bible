// ===== DEBUG HELPERS =====
function debugLog(msg, data) {
  console.log(`[CREATIVE BIBLE] ${msg}`, data || '');
}

function sanitizePayload(obj) {
  debugLog('Raw payload:', obj);
  const json = JSON.stringify(obj);
  debugLog('Stringified JSON:', json);
  return json;
}

const defaultPhases = [
  { title: 'Research & Planning', desc: 'Conduct primary and secondary research to analyze market structure, competitive landscape, and define business objectives.', sections: [
    { title: 'Primary Research', body: 'Conduct primary research through surveys and focus groups. Gather qualitative and quantitative insights to inform strategy and planning.' },
    { title: 'Market Analysis', body: 'Analyze market structure, levels, and competitive landscape. Identify opportunities and threats. Define business and marketing objectives clearly.' },
    { title: 'Marketing Plan', body: 'Develop a formal marketing plan with clear objectives, strategies, timelines, and success metrics aligned with business goals.' }
  ]},
  { title: 'Customer Strategy', desc: 'Divide consumers into clusters based on shared traits and develop detailed customer personas.', sections: [
    { title: 'Market Segmentation', body: 'Divide consumers into clusters based on demographics, psychographics, and behavioral patterns.' },
    { title: 'Customer Personas', body: 'Create detailed customer profiles or personas to humanize segments.' },
    { title: 'Needs & Motivations', body: 'Map the target audience\'s psychological needs, motivations, and pain points.' }
  ]},
  { title: 'Brand Identity Development', desc: 'Define brand essence, personality, and values that differentiate from competitors.', sections: [
    { title: 'Brand Essence & Values', body: 'Define the brand essence, core values, and personality traits.' },
    { title: 'Brand Management', body: 'Control and manage brand identity through consistent visual and verbal communication.' },
    { title: 'Brand Positioning', body: 'Establish clear brand positioning in the market using positioning maps.' }
  ]},
  { title: 'Product & Marketing Mix', desc: 'Develop the marketing mix strategy ensuring brand identity is reflected.', sections: [
    { title: 'Brand Identity', body: 'Define the brand essence, personality traits, and values that differentiate from competitors.' },
    { title: 'Product Development', body: 'Design and develop products that align with brand identity and market position.' },
    { title: '4Ps Implementation', body: 'Develop the marketing mix (Product, Price, Place, Promotion).' }
  ]},
  { title: 'Promotional Execution', desc: 'Execute launch campaigns with awareness strategies across channels.', sections: [
    { title: 'Channel Selection', body: 'Select appropriate promotional channels such as social media, digital campaigns, PR, and events.' },
    { title: 'Campaign Execution', body: 'Execute launch campaigns designed to increase awareness.' },
    { title: 'Performance Optimization', body: 'Measure campaign effectiveness and optimize conversion mechanics.' }
  ]},
  { title: 'Sales & Customer Experience', desc: 'Define the sales funnel, map customer journey, and optimize retention.', sections: [
    { title: 'Sales Funnel & Metrics', body: 'Define the sales funnel and operational architecture for customer conversion.' },
    { title: 'Customer Journey', body: 'Map the customer journey from awareness through loyalty.' },
    { title: 'Retention Strategy', body: 'Implement retention strategies based on performance data.' }
  ]}
];

const imgs = [
  'https://images.pexels.com/photos/1181311/pexels-photo-1181311.jpeg?auto=compress&cs=tinysrgb&w=1280',
  'https://images.pexels.com/photos/7598022/pexels-photo-7598022.jpeg?auto=compress&cs=tinysrgb&w=1280',
  'https://images.pexels.com/photos/7661410/pexels-photo-7661410.jpeg?auto=compress&cs=tinysrgb&w=1280',
  'https://images.pexels.com/photos/5864762/pexels-photo-5864762.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/15595294/pexels-photo-15595294.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/97080/pexels-photo-97080.jpeg?auto=compress&cs=tinysrgb&w=1280'
];

let phases = JSON.parse(JSON.stringify(defaultPhases));
let currentPhase = 0;
let isAdminMode = false;
let menuOpen = false;
const ADMIN_PASSWORD = 'jamesbond';
let pendingChanges = {};
let allRecords = [];
const API_BASE_URL = window.API_BASE_URL || '';

function apiFetch(route, options) {
  const url = API_BASE_URL ? `${API_BASE_URL}${route}` : route;
  return fetch(url, options);
}

const dataHandler = {
  onDataChanged(data) {
    allRecords = Array.isArray(data) ? data : [];
    applyEditsFromData();
    renderSidebarPhases();
    renderPhase();
  }
};

function escHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function escAttr(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;');
}

function applyEditsFromData() {
  phases = JSON.parse(JSON.stringify(defaultPhases));
  allRecords
    .filter((r) => r.type === 'phase_edit')
    .forEach((r) => {
      if (phases[r.phase_index]) {
        if (r.title) phases[r.phase_index].title = r.title;
        if (r.body) phases[r.phase_index].desc = r.body;
      }
    });
  allRecords
    .filter((r) => r.type === 'section_edit')
    .forEach((r) => {
      if (phases[r.phase_index] && phases[r.phase_index].sections[r.section_index]) {
        if (r.title) phases[r.phase_index].sections[r.section_index].title = r.title;
        if (r.body) phases[r.phase_index].sections[r.section_index].body = r.body;
      }
    });
}

function getLink(phaseIdx, secIdx) {
  const rec = allRecords.find(
    (r) => r.type === 'link' && r.phase_index === phaseIdx && r.section_index === secIdx
  );
  return rec ? rec.link_url : '';
}

function getNote(phaseIdx) {
  const rec = allRecords.find((r) => r.type === 'note' && r.phase_index === phaseIdx);
  return rec ? rec.notes : '';
}

function initApp() {
  return window.dataSdk.init(dataHandler);
}

function enterApp() {
  const introScreen = document.getElementById('intro-screen');
  introScreen.style.opacity = '0';
  introScreen.style.transition = 'opacity 0.4s ease';
  setTimeout(() => {
    introScreen.style.display = 'none';
    document.getElementById('main-content').classList.remove('hidden');
    renderSidebarPhases();
    renderPhase();
    document.getElementById('menu-btn').style.opacity = '1';
    document.getElementById('admin-btn').style.opacity = '1';
    document.getElementById('sticky-bubble').style.opacity = '1';
  }, 400);
}

function toggleMenu() {
  menuOpen = !menuOpen;
  document.getElementById('menu-panel').classList.toggle('open', menuOpen);
  document.getElementById('menu-overlay').classList.toggle('open', menuOpen);
  if (menuOpen) document.getElementById('menu-btn').classList.add('hidden-on-menu');
  else document.getElementById('menu-btn').classList.remove('hidden-on-menu');
}

function renderSidebarPhases() {
  const nav = document.getElementById('phase-nav');
  nav.innerHTML = phases
    .map(
      (p, idx) => `
        <div class="${idx === currentPhase ? 'bg-slate-700/20' : ''}">
          <div class="flex items-center gap-2 px-4 py-3 hover:bg-slate-700/20 transition-colors cursor-pointer" onclick="showPhase(${idx})">
            <span class="w-6 h-6 rounded-full bg-amber-600/20 text-amber-500 flex items-center justify-center text-xs font-bold flex-shrink-0">${idx + 1}</span>
            <span class="text-sm font-medium text-slate-200 truncate">${escHtml(p.title)}</span>
          </div>
          <div class="edit-controls hidden items-center gap-1 px-3 py-1.5 bg-slate-700/30 border-t border-slate-600/10 text-xs">
            <button onclick="editPhaseNav(${idx})" class="p-1 rounded hover:bg-slate-600" title="Edit"><i data-lucide="pencil" class="w-3 h-3 text-amber-400"></i></button>
            <button onclick="movePhaseUp(${idx})" class="p-1 rounded hover:bg-slate-600" title="Move Up"><i data-lucide="arrow-up" class="w-3 h-3 text-amber-400"></i></button>
            <button onclick="movePhaseDown(${idx})" class="p-1 rounded hover:bg-slate-600" title="Move Down"><i data-lucide="arrow-down" class="w-3 h-3 text-amber-400"></i></button>
            <button onclick="deletePhase(${idx})" class="p-1 rounded hover:bg-red-600/20" title="Delete"><i data-lucide="trash-2" class="w-3 h-3 text-red-400"></i></button>
          </div>
        </div>`
    )
    .join('');
  lucide.createIcons();
}

function editPhaseNav(idx) {
  const p = phases[idx];
  const panel = document.createElement('div');
  panel.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-[100]';
  panel.id = 'edit-phase-modal';
  panel.innerHTML = `
    <div class="bg-white rounded-lg shadow-lg p-6 w-96">
      <h3 class="text-lg font-semibold text-slate-900 mb-4">Edit Phase</h3>
      <label class="block text-xs font-medium text-slate-600 mb-1">Title</label>
      <input type="text" value="${escAttr(p.title)}" class="w-full border border-slate-300 rounded px-3 py-2 text-sm mb-4" id="ep-title">
      <label class="block text-xs font-medium text-slate-600 mb-1">Description</label>
      <textarea rows="3" class="w-full border border-slate-300 rounded px-3 py-2 text-sm mb-4" id="ep-desc">${escHtml(p.desc)}</textarea>
      <div class="flex gap-2">
        <button onclick="savePhaseNavEdit(${idx})" class="flex-1 px-3 py-2 bg-amber-600 text-white text-sm rounded hover:bg-amber-700">Save</button>
        <button onclick="document.getElementById('edit-phase-modal').remove()" class="flex-1 px-3 py-2 bg-slate-200 text-slate-700 text-sm rounded">Cancel</button>
      </div>
    </div>`;
  document.body.appendChild(panel);
}

function savePhaseNavEdit(idx) {
  const t = document.getElementById('ep-title').value.trim();
  const d = document.getElementById('ep-desc').value.trim();
  document.getElementById('edit-phase-modal').remove();
  if (!t && !d) return;

  phases[idx].title = t;
  phases[idx].desc = d;

  // Auto-save to backend
  const payload = {
    type: 'phase_edit',
    phase_index: idx,
    section_index: -1,
    title: t,
    body: d,
    link_url: '',
    notes: ''
  };

  debugLog('savePhaseNavEdit - Payload to save:', payload);

  window.dataSdk.bulkCreate([payload])
    .then(result => {
      if (result.isOk) {
        debugLog('savePhaseNavEdit - Save succeeded');
        showSaveToast('Phase saved');
        initApp();
      } else {
        debugLog('savePhaseNavEdit - Save failed', result);
        showSaveToast('Failed to save phase', true);
      }
    })
    .catch(err => {
      debugLog('savePhaseNavEdit - Catch error:', err);
      showSaveToast('Error saving phase', true);
    });

  renderSidebarPhases();
  renderPhase();
}

function movePhaseUp(idx) {
  if (idx === 0) return;
  [phases[idx], phases[idx - 1]] = [phases[idx - 1], phases[idx]];
  if (currentPhase === idx) currentPhase--;
  else if (currentPhase === idx - 1) currentPhase++;
  renderSidebarPhases();
  renderPhase();
}

function movePhaseDown(idx) {
  if (idx === phases.length - 1) return;
  [phases[idx], phases[idx + 1]] = [phases[idx + 1], phases[idx]];
  if (currentPhase === idx) currentPhase++;
  else if (currentPhase === idx + 1) currentPhase--;
  renderSidebarPhases();
  renderPhase();
}

function deletePhase(idx) {
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-[100]';
  modal.id = 'delete-phase-modal';
  modal.innerHTML = `
    <div class="bg-white rounded-lg shadow-lg p-6 w-80">
      <h3 class="text-lg font-semibold text-slate-900 mb-2">Delete Phase?</h3>
      <p class="text-sm text-slate-600 mb-4">Are you sure you want to delete "${escHtml(phases[idx].title)}"? This cannot be undone.</p>
      <div class="flex gap-2">
        <button onclick="confirmDeletePhase(${idx})" class="flex-1 px-3 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700">Delete</button>
        <button onclick="document.getElementById('delete-phase-modal').remove()" class="flex-1 px-3 py-2 bg-slate-200 text-slate-700 text-sm rounded">Cancel</button>
      </div>
    </div>`;
  document.body.appendChild(modal);
}

function confirmDeletePhase(idx) {
  document.getElementById('delete-phase-modal').remove();
  phases.splice(idx, 1);
  if (currentPhase >= phases.length) currentPhase = Math.max(0, phases.length - 1);
  allRecords = allRecords.filter((r) => r.phase_index !== idx);
  allRecords = allRecords.map((r) =>
    r.phase_index > idx ? { ...r, phase_index: r.phase_index - 1 } : r
  );
  renderSidebarPhases();
  renderPhase();
}

function showPhase(index) {
  currentPhase = index;
  renderSidebarPhases();
  renderPhase();
  if (menuOpen) toggleMenu();
}

function renderPhase() {
  const p = phases[currentPhase];
  const container = document.getElementById('phases-container');
  const sectionsHtml = p.sections
    .map((s, i) => {
      const link = getLink(currentPhase, i);
      const hasLink = link && link.trim();
      const titleClick = isAdminMode
        ? `onclick="editSectionLink(${i});event.stopPropagation();"`
        : hasLink
        ? `onclick="window.open('${escAttr(link)}','_blank');event.stopPropagation();"`
        : '';
      const linkIcon = hasLink ? '<i data-lucide="external-link" class="w-3 h-3 inline ml-1 text-blue-500"></i>' : '';
      const adminLinkHint = isAdminMode
        ? `<span class="text-xs ml-2 ${hasLink ? 'text-blue-500' : 'text-slate-400'}">${hasLink ? '🔗 linked' : '+ add link'}</span>`
        : '';

      return `
        <div class="border border-slate-200 rounded-lg" data-idx="${i}">
          <div class="edit-controls hidden items-center gap-1 p-3 bg-slate-50 rounded-t-lg border-b border-slate-200/50">
            <button onclick="toggleEditSection(${i})" class="p-1 rounded hover:bg-slate-200 ml-1" title="Edit"><i data-lucide="pencil" class="w-4 h-4 text-amber-600"></i></button>
            <button onclick="moveSectionUp(${i})" class="p-1 rounded hover:bg-slate-200" title="Move Up"><i data-lucide="arrow-up" class="w-4 h-4 text-amber-600"></i></button>
            <button onclick="moveSectionDown(${i})" class="p-1 rounded hover:bg-slate-200" title="Move Down"><i data-lucide="arrow-down" class="w-4 h-4 text-amber-600"></i></button>
            <button onclick="addSubPhase()" class="p-1 rounded hover:bg-slate-200" title="Add Sub-Phase"><i data-lucide="plus" class="w-4 h-4 text-amber-600"></i></button>
            <button onclick="deleteSection(${i})" class="p-1 rounded hover:bg-red-100" title="Delete"><i data-lucide="trash-2" class="w-4 h-4 text-red-600"></i></button>
          </div>
          <button onclick="toggleAcc(this)" class="w-full flex justify-between items-center p-4 text-left">
            <span class="font-medium text-slate-900 section-title-link cursor-pointer" ${titleClick}>${escHtml(s.title)}${linkIcon}${adminLinkHint}</span>
            <i data-lucide="chevron-down" class="w-4 h-4 transition-transform"></i>
          </button>
          <div class="acc-body px-4 pb-4"><p class="text-sm text-slate-600">${escHtml(s.body)}</p></div>
          <div class="edit-panel hidden px-4 pb-4 space-y-3">
            <label class="block text-xs font-medium text-slate-500">Title</label>
            <input type="text" value="${escAttr(s.title)}" class="w-full border border-slate-300 rounded px-3 py-2 text-sm" data-field="title">
            <label class="block text-xs font-medium text-slate-500">Write-up</label>
            <textarea rows="4" class="w-full border border-slate-300 rounded px-3 py-2 text-sm" data-field="body">${escHtml(s.body)}</textarea>
            <div class="flex gap-2"><button onclick="saveEditSection(${i})" class="px-3 py-1.5 bg-amber-600 text-white text-sm rounded hover:bg-amber-700">Save</button><button onclick="toggleEditSection(${i})" class="px-3 py-1.5 bg-slate-200 text-slate-700 text-sm rounded">Cancel</button></div>
          </div>
        </div>`;
    })
    .join('');

  container.innerHTML = `
    <div class="mb-6"><h2 class="heading-font text-2xl font-bold text-slate-900 mb-2">${escHtml(p.title)}</h2><p class="text-slate-600 opacity-70">${escHtml(p.desc)}</p></div>
    <img src="${imgs[currentPhase % imgs.length]}" class="w-full h-56 object-cover rounded-lg mb-8" loading="lazy" alt="Phase illustration">
    <div class="space-y-3" id="sections-list">${sectionsHtml}</div>
  `;

  lucide.createIcons();
}

function toggleAcc(btn) {
  const body = btn.nextElementSibling;
  body.classList.toggle('open');
  const icon = btn.querySelector('[data-lucide]');
  if (icon) icon.style.transform = body.classList.contains('open') ? 'rotate(180deg)' : '';
}

function toggleEditSection(idx) {
  const target = document.querySelectorAll('#sections-list > div')[idx];
  if (!target) return;
  target.querySelector('.edit-panel').classList.toggle('hidden');
}

function saveEditSection(idx) {
  const item = document.querySelectorAll('#sections-list > div')[idx];
  if (!item) return;
  const t = item.querySelector('[data-field="title"]').value.trim();
  const b = item.querySelector('[data-field="body"]').value.trim();
  if (!t && !b) return;

  phases[currentPhase].sections[idx].title = t;
  phases[currentPhase].sections[idx].body = b;

  // Auto-save to backend
  const payload = {
    type: 'section_edit',
    phase_index: currentPhase,
    section_index: idx,
    title: t,
    body: b,
    link_url: '',
    notes: ''
  };

  debugLog('saveEditSection - Payload to save:', payload);

  window.dataSdk.bulkCreate([payload])
    .then(result => {
      if (result.isOk) {
        debugLog('saveEditSection - Save succeeded');
        showSaveToast('Section saved');
        initApp();
      } else {
        debugLog('saveEditSection - Save failed', result);
        showSaveToast('Failed to save section', true);
      }
    })
    .catch(err => {
      debugLog('saveEditSection - Catch error:', err);
      showSaveToast('Error saving section', true);
    });

  renderPhase();
}

function moveSectionUp(idx) {
  if (idx === 0) return;
  const p = phases[currentPhase];
  [p.sections[idx], p.sections[idx - 1]] = [p.sections[idx - 1], p.sections[idx]];
  renderPhase();
}

function moveSectionDown(idx) {
  const p = phases[currentPhase];
  if (idx === p.sections.length - 1) return;
  [p.sections[idx], p.sections[idx + 1]] = [p.sections[idx + 1], p.sections[idx]];
  renderPhase();
}

function deleteSection(idx) {
  const p = phases[currentPhase];
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-[100]';
  modal.id = 'delete-section-modal';
  modal.innerHTML = `
    <div class="bg-white rounded-lg shadow-lg p-6 w-80">
      <h3 class="text-lg font-semibold text-slate-900 mb-2">Delete Sub-Phase?</h3>
      <p class="text-sm text-slate-600 mb-4">Are you sure you want to delete "${escHtml(p.sections[idx].title)}"? This cannot be undone.</p>
      <div class="flex gap-2">
        <button onclick="confirmDeleteSection(${idx})" class="flex-1 px-3 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700">Delete</button>
        <button onclick="document.getElementById('delete-section-modal').remove()" class="flex-1 px-3 py-2 bg-slate-200 text-slate-700 text-sm rounded">Cancel</button>
      </div>
    </div>`;
  document.body.appendChild(modal);
}

function confirmDeleteSection(idx) {
  document.getElementById('delete-section-modal').remove();
  const p = phases[currentPhase];
  p.sections.splice(idx, 1);
  allRecords = allRecords.filter(
    (r) => !(r.phase_index === currentPhase && r.section_index === idx)
  );
  allRecords = allRecords.map((r) =>
    r.phase_index === currentPhase && r.section_index > idx
      ? { ...r, section_index: r.section_index - 1 }
      : r
  );
  renderPhase();
}

function editSectionLink(secIdx) {
  const currentLink = getLink(currentPhase, secIdx);
  const panel = document.createElement('div');
  panel.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-[100]';
  panel.id = 'link-edit-modal';
  panel.innerHTML = `
    <div class="bg-white rounded-lg shadow-lg p-6 w-96">
      <h3 class="text-lg font-semibold text-slate-900 mb-2">External Link</h3>
      <p class="text-sm text-slate-500 mb-4">Set the URL this sub-phase links to when clicked.</p>
      <input type="url" id="link-url-input" value="${escAttr(currentLink)}" placeholder="https://example.com" class="w-full border border-slate-300 rounded px-3 py-2 text-sm mb-4 focus:ring-2 focus:ring-amber-400">
      <div class="flex gap-2">
        <button onclick="saveSectionLink(${secIdx})" class="flex-1 px-3 py-2 bg-amber-600 text-white text-sm rounded hover:bg-amber-700">Save</button>
        <button onclick="document.getElementById('link-edit-modal').remove()" class="flex-1 px-3 py-2 bg-slate-200 text-slate-700 text-sm rounded">Cancel</button>
        ${currentLink ? `<button onclick="removeSectionLink(${secIdx})" class="px-3 py-2 bg-red-100 text-red-600 text-sm rounded hover:bg-red-200">Remove</button>` : ''}
      </div>
    </div>`;
  document.body.appendChild(panel);
}

function saveSectionLink(secIdx) {
  const url = document.getElementById('link-url-input').value.trim();
  document.getElementById('link-edit-modal').remove();
  if (!url) return;

  // Auto-save to backend
  const payload = {
    type: 'link',
    phase_index: currentPhase,
    section_index: secIdx,
    title: '',
    body: '',
    link_url: url,
    notes: ''
  };

  debugLog('saveSectionLink - Payload to save:', payload);

  window.dataSdk.bulkCreate([payload])
    .then(result => {
      if (result.isOk) {
        debugLog('saveSectionLink - Save succeeded');
        showSaveToast('Link saved');
        initApp();
      } else {
        debugLog('saveSectionLink - Save failed', result);
        showSaveToast('Failed to save link', true);
      }
    })
    .catch(err => {
      debugLog('saveSectionLink - Catch error:', err);
      showSaveToast('Error saving link', true);
    });

  renderPhase();
}

function removeSectionLink(secIdx) {
  document.getElementById('link-edit-modal').remove();
  const existing = allRecords.find(
    (r) => r.type === 'link' && r.phase_index === currentPhase && r.section_index === secIdx
  );
  if (existing) {
    debugLog('removeSectionLink - Deleting record:', existing);
    window.dataSdk.delete(existing)
      .then(res => {
        if (res && res.isOk) debugLog('removeSectionLink - delete succeeded', res);
        else debugLog('removeSectionLink - delete failed', res);
        initApp();
      })
      .catch(err => debugLog('removeSectionLink - delete error:', err));
  } else {
    debugLog('removeSectionLink - no existing link found for', { phase: currentPhase, section: secIdx });
  }
}

function showLimitWarning() {
  const d = document.createElement('div');
  d.className = 'fixed top-4 left-1/2 -translate-x-1/2 bg-red-600 text-white px-4 py-2 rounded shadow-lg z-[200] text-sm';
  d.textContent = 'Storage limit reached (999 items). Please delete some items.';
  document.body.appendChild(d);
  setTimeout(() => d.remove(), 4000);
}

function toggleStickyNote() {
  const container = document.getElementById('sticky-note-container');
  if (container.querySelector('.sticky-note')) {
    closeStickyNote();
    return;
  }
  const noteText = getNote(currentPhase);
  const note = document.createElement('div');
  note.className = 'sticky-note';
  note.innerHTML = `
    <div class="sticky-note-header">
      <span class="font-semibold text-amber-900 text-sm">Quick Note</span>
      <button class="sticky-note-close" onclick="closeStickyNote()"><i data-lucide="x" class="w-5 h-5"></i></button>
    </div>
    <textarea id="sticky-textarea" class="w-full flex-1 border-0 bg-transparent text-amber-900 text-sm resize-none focus:outline-none" placeholder="Write here...">${escHtml(noteText)}</textarea>
    <button onclick="saveStickyNote()" class="mt-3 px-3 py-1.5 bg-amber-700 text-white text-xs rounded font-medium hover:bg-amber-800 w-full">Save</button>`;
  container.appendChild(note);
  lucide.createIcons();
}

function saveStickyNote() {
  const t = document.getElementById('sticky-textarea');
  if (!t) return;

  // Auto-save to backend
  const payload = {
    type: 'note',
    phase_index: currentPhase,
    section_index: -1,
    title: '',
    body: '',
    link_url: '',
    notes: t.value
  };

  debugLog('saveStickyNote - Payload to save:', payload);

  window.dataSdk.bulkCreate([payload])
    .then(result => {
      if (result.isOk) {
        debugLog('saveStickyNote - Save succeeded');
        showSaveToast('Note saved');
        initApp();
      } else {
        debugLog('saveStickyNote - Save failed', result);
        showSaveToast('Failed to save note', true);
      }
    })
    .catch(err => {
      debugLog('saveStickyNote - Catch error:', err);
      showSaveToast('Error saving note', true);
    });

  closeStickyNote();
}

function closeStickyNote() {
  const note = document.querySelector('.sticky-note');
  if (note) {
    note.style.animation = 'slideOut 0.3s ease forwards';
    setTimeout(() => note.remove(), 300);
  }
}

function showPendingIndicator() {
  // No-op: auto-save has replaced manual save
}

async function saveAllChanges() {
  const btn = document.getElementById('save-all-btn');
  if (!btn) return;
  debugLog('saveAllChanges - pendingChanges count:', Object.keys(pendingChanges).length);
  if (Object.keys(pendingChanges).length === 0) {
    debugLog('saveAllChanges - no pending changes, aborting');
    showSaveToast('No pending changes to save.', true);
    return;
  }

  btn.disabled = true;
  btn.innerHTML = '<i data-lucide="loader" class="w-4 h-4 animate-spin"></i> Saving...';

  try {
    const changesToSave = Object.values(pendingChanges);
    debugLog('saveAllChanges - changesToSave:', changesToSave);
    const result = await window.dataSdk.bulkCreate(changesToSave);
    debugLog('saveAllChanges - bulkCreate result:', result);
    if (!result.isOk) throw new Error('Save failed');

    pendingChanges = {};
    btn.innerHTML = '<i data-lucide="check" class="w-4 h-4"></i> Saved!';
    btn.style.background = '#10b981';
    setTimeout(() => {
      btn.disabled = false;
      btn.innerHTML = '<i data-lucide="save" class="w-4 h-4"></i> Save All Changes';
      btn.style.background = '';
    }, 2000);

    showSaveToast('All changes saved successfully.');
    initApp();
  } catch (err) {
    debugLog('saveAllChanges - Caught error:', err);
    btn.disabled = false;
    btn.innerHTML = '<i data-lucide="alert-circle" class="w-4 h-4"></i> Save Failed';
    btn.style.background = '#ef4444';
    setTimeout(() => {
      btn.innerHTML = '<i data-lucide="save" class="w-4 h-4"></i> Save All Changes';
      btn.style.background = '';
    }, 3000);
    showSaveToast('Error saving changes. Please try again.', true);
  }
}

function showSaveToast(msg, isError) {
  const d = document.createElement('div');
  d.className = 'save-toast';
  d.textContent = msg;
  d.style.background = isError ? '#ef4444' : '#10b981';
  d.style.fontSize = '0.875rem';
  document.body.appendChild(d);
  setTimeout(() => d.remove(), 2000);
}

function handleAdminBtn() {
  if (isAdminMode) exitAdminMode();
  else openAdminModal();
}

function openAdminModal() {
  document.getElementById('admin-modal').classList.remove('hidden');
  document.getElementById('admin-password').focus();
}

function closeAdminModal() {
  document.getElementById('admin-modal').classList.add('hidden');
  document.getElementById('admin-password').value = '';
}

function checkAdminPassword() {
  if (document.getElementById('admin-password').value === ADMIN_PASSWORD) {
    isAdminMode = true;
    document.body.classList.add('admin-mode');
    closeAdminModal();
    const btn = document.getElementById('admin-btn');
    btn.classList.add('bg-amber-600', 'text-white');
    btn.classList.remove('bg-slate-700', 'text-slate-300');
    btn.title = 'Exit Admin';
    btn.innerHTML = '<i data-lucide="log-out" class="w-5 h-5"></i>';
    lucide.createIcons();
    renderSidebarPhases();
    renderPhase();
    showPendingIndicator();
  } else {
    const input = document.getElementById('admin-password');
    input.classList.add('border-red-500');
    setTimeout(() => input.classList.remove('border-red-500'), 1500);
  }
}

function exitAdminMode() {
  isAdminMode = false;
  finalizeExit();
}

function finalizeExit() {
  document.body.classList.remove('admin-mode');
  const btn = document.getElementById('admin-btn');
  btn.classList.remove('bg-amber-600', 'text-white');
  btn.classList.add('bg-slate-700', 'text-slate-300');
  btn.title = 'Admin';
  btn.innerHTML = '<i data-lucide="settings" class="w-5 h-5"></i>';
  lucide.createIcons();
  renderSidebarPhases();
  renderPhase();
}

function addPhase() {
  phases.push({ title: 'New Phase', desc: 'Phase description', sections: [{ title: 'New Section', body: 'Add your content here...' }] });
  currentPhase = phases.length - 1;
  renderSidebarPhases();
  renderPhase();
}

function addSubPhase() {
  phases[currentPhase].sections.push({ title: 'New Sub-Phase', body: 'Add your content here...' });
  renderPhase();
}

window.dataSdk = {
  async init(handler) {
    try {
      const response = await apiFetch('/api/records');
      if (!response.ok) throw new Error('Fetch failed');
      const data = await response.json();
      handler.onDataChanged(data);
      return { isOk: true };
    } catch (error) {
      console.error(error);
      handler.onDataChanged([]);
      return { isOk: false };
    }
  },
  async create(payload) {
    try {
      debugLog('create - Payload:', payload);
      const response = await apiFetch('/api/records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      debugLog('create - Response status:', response.status);
      const data = await response.json();
      debugLog('create - Response data:', data);
      return { isOk: response.ok, data };
    } catch (error) {
        debugLog('create - ERROR:', error);
        return { isOk: false, error };
    }
  },
  async update(payload) {
    debugLog('update - Payload:', payload);
    return this.create(payload);
  },
  async bulkCreate(payload) {
    try {
      debugLog('BULK CREATE - Raw payload:', payload);
      
      // Ensure payload is array
      const payloadArray = Array.isArray(payload) ? payload : [payload];
      debugLog('BULK CREATE - Ensured as array:', payloadArray);
      
      // Stringify and parse to remove any circular refs
      const jsonString = JSON.stringify(payloadArray);
      debugLog('BULK CREATE - JSON string:', jsonString);
      
      const response = await apiFetch('/api/records/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: jsonString
      });
      
      debugLog('BULK CREATE - Response status:', response.status);
      const data = await response.json();
      debugLog('BULK CREATE - Response data:', data);
      return { isOk: response.ok, data };
    } catch (error) {
      debugLog('BULK CREATE - ERROR:', error);
      return { isOk: false, error };
    }
  },
  async delete(payload) {
    try {
      debugLog('delete - Payload:', payload);
      const response = await apiFetch('/api/records', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      debugLog('delete - Response status:', response.status);
      const data = await response.json();
      debugLog('delete - Response data:', data);
      return { isOk: response.ok, data };
    } catch (error) {
      debugLog('delete - ERROR:', error);
      return { isOk: false, error };
    }
  }
};

window.addEventListener('load', () => {
  initApp();
  setTimeout(() => {
    if (document.getElementById('intro-screen').style.display !== 'none') enterApp();
  }, 4000);
});

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('admin-modal').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') checkAdminPassword();
  });
});
