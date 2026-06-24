// Document list
const documents = [
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
];

// State
let readStatus = JSON.parse(localStorage.getItem('socStudyReadStatus')) || {};
let currentDocId = null;

// DOM Elements
const docListEl = document.getElementById('doc-list');
const searchInput = document.getElementById('search-input');
const contentArea = document.getElementById('content-area');
const currentDocTitle = document.getElementById('current-doc-title');
const markDoneBtn = document.getElementById('mark-done-btn');
const progressBar = document.getElementById('progress-bar');
const progressText = document.getElementById('progress-text');
const themeToggle = document.getElementById('theme-toggle');
const backToTopBtn = document.getElementById('back-to-top');
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const sidebar = document.getElementById('sidebar');

// Initialize
function init() {
    initTheme();
    renderSidebar(documents);
    updateProgress();
    setupEventListeners();
    
    // Configure Marked.js options
    marked.setOptions({
        gfm: true,
        breaks: true,
        headerIds: true
    });
}

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
        const htmlContent = marked.parse(text);
        
        contentArea.innerHTML = `<div class="markdown-body">${htmlContent}</div>`;
        contentArea.scrollTop = 0;
        
        currentDocTitle.textContent = doc.title;
        
        // Setup mark as done button
        markDoneBtn.style.display = 'flex';
        updateMarkDoneBtn();
        
    } catch (error) {
        contentArea.innerHTML = `
            <div style="text-align:center; padding: 40px;">
                <h3 style="color: var(--danger-color); margin-bottom: 10px;">Errore di caricamento</h3>
                <p style="color: var(--text-secondary);">${error.message}</p>
                <div style="margin-top: 20px; text-align: left; background: var(--bg-main); padding: 15px; border-radius: 8px; font-size: 0.9rem;">
                    <strong>💡 Tip per l'uso locale:</strong> Se apri index.html direttamente dal file system (file:///...), alcuni browser bloccano le richieste fetch per sicurezza.<br>
                    <strong>Soluzione:</strong> Apri il terminale in questa cartella e avvia un server locale:<br>
                    <code style="background: var(--surface-color); padding: 2px 6px; border-radius: 4px; display: inline-block; margin-top: 5px;">npx serve .</code> oppure <code style="background: var(--surface-color); padding: 2px 6px; border-radius: 4px; display: inline-block; margin-top: 5px;">python -m http.server</code>
                </div>
            </div>`;
    }
}

// Progress and Read Status
function toggleReadStatus() {
    if (!currentDocId) return;
    
    readStatus[currentDocId] = !readStatus[currentDocId];
    localStorage.setItem('socStudyReadStatus', JSON.stringify(readStatus));
    
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
    
    // Mobile menu toggle
    mobileMenuBtn.addEventListener('click', () => {
        sidebar.classList.toggle('open');
    });
    
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
}

// Run init when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
