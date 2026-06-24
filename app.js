// Courses Configuration
const courses = {
    'sal': {
        title: 'SOC Study Hub',
        icon: '🛡️',
        documents: [
            { id: '01', title: 'Cos\'è un SOC', file: 'docs/01-cos-e-un-soc.md' },
            { id: '02', title: 'Networking Fondamentali', file: 'docs/02-networking-fondamentali.md' },
            { id: '03', title: 'SIEM (Security Info & Event Mgmt)', file: 'docs/03-siem.md' },
            { id: '04', title: 'Log Analysis', file: 'docs/04-log-analysis.md' },
            { id: '05', title: 'Incident Response', file: 'docs/05-incident-response.md' },
            { id: '06', title: 'Threat Intelligence', file: 'docs/06-threat-intelligence.md' },
            { id: '07', title: 'Attacchi Comuni', file: 'docs/07-attacchi-comuni.md' },
            { id: '08', title: 'Strumenti di Difesa', file: 'docs/08-strumenti-difesa.md' },
            { id: '09', title: 'Sistemi Operativi per SOC', file: 'docs/09-sistemi-operativi.md' },
            { id: '10', title: 'Domande da Colloquio', file: 'docs/10-domande-colloquio.md' },
            { id: '11', title: 'Glossario', file: 'docs/glossario.md' }
        ]
    },
    'elisa': {
        title: 'Pediatria Hub',
        icon: '👶',
        documents: [
            { id: 'ped-01', title: 'Introduzione alla Pediatria', file: 'docs/elisa/01-introduzione-pediatria.md' },
            { id: 'ped-02', title: 'Sviluppo del Neonato', file: 'docs/elisa/02-sviluppo-neonato.md' },
            { id: 'ped-03', title: 'Vaccinazioni di Base', file: 'docs/elisa/03-vaccinazioni-base.md' }
        ]
    }
};

class SimpleSlugger {
    constructor() {
        this.seen = {};
    }
    slug(raw) {
        let slug = raw.toLowerCase().trim().replace(/<[^>]*>?/gm, '').replace(/[\s\W_]+/g, '-').replace(/^-|-$/g, '');
        if (slug === '') slug = 'section';
        if (this.seen[slug] !== undefined) {
            this.seen[slug]++;
            slug = slug + '-' + this.seen[slug];
        } else {
            this.seen[slug] = 0;
        }
        return slug;
    }
}

// State
let currentProfile = null;
let documents = [];
let readStatus = {};
let savedSummaries = [];
let currentCart = [];
let currentDocSections = {};
let currentDocId = null;
let isViewingSummary = false;

// DOM Elements
const dashboardEl = document.getElementById('dashboard');
const appContainerEl = document.getElementById('app-container');
const sidebarTitle = document.getElementById('sidebar-title');
const sidebarIcon = document.getElementById('sidebar-icon');

const docListEl = document.getElementById('doc-list');
const summaryListEl = document.getElementById('summary-list');
const searchInput = document.getElementById('search-input');
const contentArea = document.getElementById('content-area');
const currentDocTitle = document.getElementById('current-doc-title');
const markDoneBtn = document.getElementById('mark-done-btn');
const progressBar = document.getElementById('progress-bar');
const progressText = document.getElementById('progress-text');
const themeToggle = document.getElementById('theme-toggle');
const backToTopBtn = document.getElementById('back-to-top');
const sidebar = document.getElementById('sidebar');

// Modal DOM Elements
const cartBtn = document.getElementById('cart-btn');
const cartCount = document.getElementById('cart-count');
const summaryModal = document.getElementById('summary-modal');
const closeModalBtn = document.getElementById('close-modal-btn');
const cartItemsList = document.getElementById('cart-items');
const clearCartBtn = document.getElementById('clear-cart-btn');
const saveSummaryBtn = document.getElementById('save-summary-btn');
const summaryTitleInput = document.getElementById('summary-title');

// Initialize
function init() {
    initTheme();
    // Do not render anything yet, wait for profile selection
    setupEventListeners();
    
    // Check if a profile was previously selected in this session
    const savedProfile = sessionStorage.getItem('activeProfile');
    if (savedProfile && courses[savedProfile]) {
        selectProfile(savedProfile);
    }
}

// Profile Selection
window.selectProfile = function(profileId) {
    currentProfile = profileId;
    sessionStorage.setItem('activeProfile', profileId);
    
    const course = courses[profileId];
    documents = course.documents;
    
    sidebarTitle.textContent = course.title;
    sidebarIcon.textContent = course.icon;
    
    const readKey = profileId === 'sal' ? 'socStudyReadStatus' : profileId + 'ReadStatus';
    const sumKey = profileId === 'sal' ? 'socSavedSummaries' : profileId + 'SavedSummaries';
    
    readStatus = JSON.parse(localStorage.getItem(readKey)) || {};
    savedSummaries = JSON.parse(localStorage.getItem(sumKey)) || [];
    currentCart = [];
    currentDocSections = {};
    currentDocId = null;
    isViewingSummary = false;
    
    dashboardEl.classList.remove('active');
    appContainerEl.style.display = 'flex';
    
    // Configure Marked.js options
    const slugger = new SimpleSlugger();
    const renderer = new marked.Renderer();
    renderer.heading = function (textOrObj, level, raw) {
        let text = textOrObj;
        let depth = level;
        let rawText = raw;
        
        if (typeof textOrObj === 'object' && textOrObj !== null) {
            text = textOrObj.text;
            depth = textOrObj.depth;
            rawText = textOrObj.raw;
        }
        
        const id = slugger.slug(rawText || text);
        let addBtn = '';
        if ((depth === 2 || depth === 3) && !isViewingSummary) {
            addBtn = `<button class="add-summary-btn" id="add-btn-${id}" onclick="addToSummary('${id}', '${encodeURIComponent(text.replace(/<[^>]*>?/gm, ''))}')" title="Aggiungi al riassunto">➕</button>`;
        }
        return `<h${depth} id="${id}">${text} ${addBtn}</h${depth}>\n`;
    };

    marked.setOptions({
        gfm: true,
        breaks: true,
        renderer: renderer
    });

    renderSidebar(documents);
    renderSummariesSidebar();
    updateProgress();
    updateCartUI();
    
    contentArea.innerHTML = `
        <div class="welcome-screen">
            <span class="welcome-icon">${course.icon}</span>
            <h2>Benvenuto in ${course.title}</h2>
            <p>Seleziona un argomento per iniziare lo studio.</p>
        </div>
    `;
    currentDocTitle.textContent = "Seleziona un argomento";
    markDoneBtn.style.display = 'none';
    
    if (window.innerWidth <= 768) {
        switchMobileTab('topics');
    }
};

window.showDashboard = function() {
    sessionStorage.removeItem('activeProfile');
    currentProfile = null;
    appContainerEl.style.display = 'none';
    dashboardEl.classList.add('active');
};

// Mobile Navigation
window.switchMobileTab = function(tabId) {
    document.querySelectorAll('.bottom-nav-item').forEach(btn => btn.classList.remove('active'));
    
    if (tabId === 'topics') {
        document.getElementById('nav-topics').classList.add('active');
        appContainerEl.classList.add('mobile-view-list');
        appContainerEl.classList.remove('mobile-view-doc');
        
        docListEl.style.display = 'block';
        document.querySelector('.nav-title:nth-of-type(1)').style.display = 'block';
        
        summaryListEl.style.display = 'none';
        document.querySelector('.nav-title:nth-of-type(2)').style.display = 'none';
        
    } else if (tabId === 'summaries') {
        document.getElementById('nav-summaries').classList.add('active');
        appContainerEl.classList.add('mobile-view-list');
        appContainerEl.classList.remove('mobile-view-doc');
        
        docListEl.style.display = 'none';
        document.querySelector('.nav-title:nth-of-type(1)').style.display = 'none';
        
        summaryListEl.style.display = 'block';
        document.querySelector('.nav-title:nth-of-type(2)').style.display = 'block';
    }
};

window.goBackToList = function() {
    appContainerEl.classList.add('mobile-view-list');
    appContainerEl.classList.remove('mobile-view-doc');
};

// Theme handling
function initTheme() {
    const isDark = localStorage.getItem('socStudyTheme') === 'dark' || 
                  (!localStorage.getItem('socStudyTheme') && document.body.classList.contains('dark-theme'));
    
    if (isDark) {
        document.body.classList.add('dark-theme');
    } else {
        document.body.classList.remove('dark-theme');
    }
}

function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    const isDark = document.body.classList.contains('dark-theme');
    localStorage.setItem('socStudyTheme', isDark ? 'dark' : 'light');
}

// Sidebar rendering
function renderSidebar(docs) {
    docListEl.innerHTML = '';
    
    if (docs.length === 0) {
        docListEl.innerHTML = '<li style="padding: 10px; color: var(--text-muted); font-size: 0.85rem;">Nessun risultato</li>';
        return;
    }

    docs.forEach(doc => {
        const isRead = readStatus[doc.id];
        const isActive = currentDocId === doc.id;
        
        const li = document.createElement('li');
        li.innerHTML = `
            <a href="#" class="doc-link ${isRead ? 'read' : ''} ${isActive ? 'active' : ''}" data-id="${doc.id}">
                <span class="doc-title">${doc.title}</span>
                <span class="status-indicator"></span>
            </a>
        `;
        docListEl.appendChild(li);
    });

    // Add click listeners to new links
    document.querySelectorAll('.doc-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const id = e.currentTarget.getAttribute('data-id');
            loadDocument(id);
            
            // Close mobile menu if open
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('open');
            }
        });
    });
}

// Load Markdown Document
async function loadDocument(id) {
    const doc = documents.find(d => d.id === id);
    if (!doc) return;

    currentDocId = id;
    renderSidebar(documents); // Update active state
    
    contentArea.innerHTML = '<div style="text-align:center; padding: 40px; color: var(--text-muted);">Caricamento in corso...</div>';
    
    try {
        const response = await fetch(doc.file);
        if (!response.ok) throw new Error('File non trovato. Se stai eseguendo localmente (file://), potresti avere problemi di CORS. Usa un web server locale.');
        
        const text = await response.text();
        isViewingSummary = false;
        prepareSections(text);
        
        // Reset the marked slugger before parsing a new document so IDs align
        const htmlContent = marked.parse(text);
        
        contentArea.innerHTML = `<div class="markdown-body">${htmlContent}</div>`;
        contentArea.scrollTop = 0;
        
        currentDocTitle.textContent = doc.title;
        
        // Setup mark as done button
        markDoneBtn.style.display = 'flex';
        updateMarkDoneBtn();
        
        // Su mobile, quando apri un doc, nascondi la lista e mostra il doc
        if (window.innerWidth <= 768) {
            appContainerEl.classList.remove('mobile-view-list');
            appContainerEl.classList.add('mobile-view-doc');
        }
        
    } catch (error) {
        contentArea.innerHTML = `
            <div style="text-align:center; padding: 40px;">
                <h3 style="color: var(--danger-color); margin-bottom: 10px;">Errore di caricamento</h3>
                <p style="color: var(--text-secondary); text-align: left; background: #222; padding: 10px; border-radius: 5px;">${error.stack}</p>
                <div style="margin-top: 20px; text-align: left; background: var(--bg-main); padding: 15px; border-radius: 8px; font-size: 0.9rem;">
                    <strong>💡 Tip per l'uso locale:</strong> Se apri index.html direttamente dal file system (file:///...), alcuni browser bloccano le richieste fetch per sicurezza.<br>
                    <strong>Soluzione:</strong> Apri il terminale in questa cartella e avvia un server locale:<br>
                    <code style="background: var(--surface-color); padding: 2px 6px; border-radius: 4px; display: inline-block; margin-top: 5px;">npx serve .</code> oppure <code style="background: var(--surface-color); padding: 2px 6px; border-radius: 4px; display: inline-block; margin-top: 5px;">python -m http.server</code>
                </div>
            </div>`;
    }
}

// --- SUMMARY GENERATOR LOGIC ---
function prepareSections(text) {
    currentDocSections = {};
    const tokens = marked.lexer(text);
    const slugger = new SimpleSlugger();
    
    let currentId = null;
    let currentLevel = null;
    let currentMarkdown = [];
    
    for (const token of tokens) {
        if (token.type === 'heading' && (token.depth === 2 || token.depth === 3)) {
            if (currentId) currentDocSections[currentId] = currentMarkdown.join('');
            currentId = slugger.slug(token.text);
            currentLevel = token.depth;
            currentMarkdown = [token.raw];
        } else if (token.type === 'heading' && token.depth < currentLevel) {
            if (currentId) {
                currentDocSections[currentId] = currentMarkdown.join('');
                currentId = null;
            }
            if (token.depth === 2 || token.depth === 3) {
                currentId = slugger.slug(token.text);
                currentLevel = token.depth;
                currentMarkdown = [token.raw];
            } else {
                currentMarkdown.push(token.raw);
            }
        } else {
            if (currentId) currentMarkdown.push(token.raw);
        }
    }
    if (currentId) currentDocSections[currentId] = currentMarkdown.join('');
}

window.addToSummary = function(id, titleEncoded) {
    const title = decodeURIComponent(titleEncoded);
    if (!currentDocSections[id]) return;
    
    // Check if already in cart
    if (currentCart.some(item => item.id === id)) return;
    
    currentCart.push({
        id: id,
        title: title,
        markdown: currentDocSections[id]
    });
    
    updateCartUI();
    const btn = document.getElementById(`add-btn-${id}`);
    if (btn) btn.classList.add('added');
};

function updateCartUI() {
    cartCount.textContent = currentCart.length;
    if (currentCart.length > 0) {
        cartBtn.style.color = 'var(--accent-color)';
        cartBtn.style.borderColor = 'var(--accent-color)';
    } else {
        cartBtn.style.color = '';
        cartBtn.style.borderColor = '';
    }
    
    // Aggiorna anche il badge mobile se presente
    const cartCountMobile = document.getElementById('cart-count-mobile');
    if (cartCountMobile) {
        cartCountMobile.textContent = currentCart.length;
        cartCountMobile.style.display = currentCart.length > 0 ? 'inline-block' : 'none';
    }
}

function openSummaryModal() {
    cartItemsList.innerHTML = '';
    if (currentCart.length === 0) {
        cartItemsList.innerHTML = '<li style="padding: 15px; text-align: center; color: var(--text-muted);">Il carrello è vuoto. Clicca sui ➕ accanto ai titoli per aggiungere argomenti.</li>';
    } else {
        currentCart.forEach((item, index) => {
            const li = document.createElement('li');
            li.className = 'cart-item';
            li.innerHTML = `
                <span>${item.title}</span>
                <button class="remove-item-btn" onclick="removeFromSummary(${index})">🗑️</button>
            `;
            cartItemsList.appendChild(li);
        });
    }
    
    const now = new Date();
    summaryTitleInput.value = `Riassunto SOC - ${now.getDate()}/${now.getMonth()+1}`;
    summaryModal.classList.add('active');
}

window.removeFromSummary = function(index) {
    const item = currentCart[index];
    currentCart.splice(index, 1);
    const btn = document.getElementById(`add-btn-${item.id}`);
    if (btn) btn.classList.remove('added');
    
    updateCartUI();
    openSummaryModal(); // refresh list
};

function clearCart() {
    currentCart = [];
    document.querySelectorAll('.add-summary-btn.added').forEach(btn => btn.classList.remove('added'));
    updateCartUI();
    summaryModal.classList.remove('active');
}

function saveSummary() {
    if (currentCart.length === 0) {
        alert("Aggiungi prima degli argomenti al riassunto!");
        return;
    }
    
    const title = summaryTitleInput.value.trim() || "Nuovo Riassunto";
    const id = 'summary-' + Date.now();
    
    let combinedMd = `# ${title}\n\n*Riassunto generato automaticamente*\n\n---\n\n`;
    currentCart.forEach(item => {
        combinedMd += item.markdown + "\n\n";
    });
    
    savedSummaries.push({
        id: id,
        title: title,
        markdown: combinedMd
    });
    
    localStorage.setItem(currentProfile === 'sal' ? 'socSavedSummaries' : currentProfile + 'SavedSummaries', JSON.stringify(savedSummaries));
    clearCart();
    renderSummariesSidebar();
    loadSavedSummary(id);
}

function renderSummariesSidebar() {
    if (!summaryListEl) return;
    summaryListEl.innerHTML = '';
    
    if (savedSummaries.length === 0) {
        summaryListEl.innerHTML = '<li style="padding: 10px; color: var(--text-muted); font-size: 0.85rem;">Nessun riassunto</li>';
        return;
    }
    
    savedSummaries.forEach(sum => {
        const isActive = currentDocId === sum.id;
        const li = document.createElement('li');
        li.innerHTML = `
            <a href="#" class="doc-link summary-link ${isActive ? 'active' : ''}" data-id="${sum.id}">
                <span class="doc-title">📝 ${sum.title}</span>
            </a>
        `;
        summaryListEl.appendChild(li);
    });
    
    document.querySelectorAll('.summary-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const id = e.currentTarget.getAttribute('data-id');
            loadSavedSummary(id);
            if (window.innerWidth <= 768) {
                appContainerEl.classList.remove('mobile-view-list');
                appContainerEl.classList.add('mobile-view-doc');
            }
        });
    });
}

function loadSavedSummary(id) {
    const sum = savedSummaries.find(s => s.id === id);
    if (!sum) return;
    
    isViewingSummary = true;
    currentDocId = id;
    renderSidebar(documents);
    renderSummariesSidebar();
    
    const htmlContent = marked.parse(sum.markdown);
    
    contentArea.innerHTML = `
        <div class="download-btn-container">
            <button class="btn" onclick="downloadSummary('${id}')">📄 Scarica come .md</button>
            <button class="btn btn-outline" style="color: var(--danger-color); border-color: var(--danger-color); margin-left: 10px;" onclick="deleteSummary('${id}')">🗑️ Elimina</button>
        </div>
        <div class="markdown-body">${htmlContent}</div>
    `;
    contentArea.scrollTop = 0;
    currentDocTitle.textContent = sum.title;
    markDoneBtn.style.display = 'none';

    if (window.innerWidth <= 768) {
        appContainerEl.classList.remove('mobile-view-list');
        appContainerEl.classList.add('mobile-view-doc');
    }
}

window.downloadSummary = function(id) {
    const sum = savedSummaries.find(s => s.id === id);
    if (!sum) return;
    
    const blob = new Blob([sum.markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = sum.title.replace(/[^a-z0-9]/gi, '_').toLowerCase() + '.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};

window.deleteSummary = function(id) {
    if(confirm('Sei sicuro di voler eliminare questo riassunto?')) {
        savedSummaries = savedSummaries.filter(s => s.id !== id);
        localStorage.setItem(currentProfile === 'sal' ? 'socSavedSummaries' : currentProfile + 'SavedSummaries', JSON.stringify(savedSummaries));
        renderSummariesSidebar();
        if(currentDocId === id) {
            loadDocument(documents[0].id);
        }
    }
};
// --- END SUMMARY LOGIC ---

// Progress and Read Status
function toggleReadStatus() {
    if (!currentDocId) return;
    
    readStatus[currentDocId] = !readStatus[currentDocId];
    localStorage.setItem(currentProfile === 'sal' ? 'socStudyReadStatus' : currentProfile + 'ReadStatus', JSON.stringify(readStatus));
    
    updateMarkDoneBtn();
    renderSidebar(documents);
    updateProgress();
}

function updateMarkDoneBtn() {
    const isRead = readStatus[currentDocId];
    if (isRead) {
        markDoneBtn.classList.add('active');
        markDoneBtn.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> Letto';
    } else {
        markDoneBtn.classList.remove('active');
        markDoneBtn.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle></svg> Segna come letto';
    }
}

function updateProgress() {
    const readCount = Object.values(readStatus).filter(v => v).length;
    const total = documents.length;
    const percentage = Math.round((readCount / total) * 100);
    
    progressBar.style.width = `${percentage}%`;
    progressText.textContent = percentage;
}

// Search filtering
function handleSearch(e) {
    const query = e.target.value.toLowerCase();
    const filteredDocs = documents.filter(doc => 
        doc.title.toLowerCase().includes(query)
    );
    renderSidebar(filteredDocs);
}

// Event Listeners Setup
function setupEventListeners() {
    searchInput.addEventListener('input', handleSearch);
    themeToggle.addEventListener('click', toggleTheme);
    markDoneBtn.addEventListener('click', toggleReadStatus);
    
    // Back to top button
    contentArea.addEventListener('scroll', () => {
        if (contentArea.scrollTop > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });
    
    backToTopBtn.addEventListener('click', () => {
        contentArea.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    // Modal Event Listeners
    if (cartBtn) cartBtn.addEventListener('click', openSummaryModal);
    if (closeModalBtn) closeModalBtn.addEventListener('click', () => summaryModal.classList.remove('active'));
    if (clearCartBtn) clearCartBtn.addEventListener('click', clearCart);
    if (saveSummaryBtn) saveSummaryBtn.addEventListener('click', saveSummary);
    
    // Close modal if clicking outside
    summaryModal.addEventListener('click', (e) => {
        if (e.target === summaryModal) {
            summaryModal.classList.remove('active');
        }
    });
}

// Run init when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
