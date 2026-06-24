# 🏢 Cos'è un SOC (Security Operations Center)

> **Documento di studio per la preparazione al colloquio SOC Analyst**  
> Livello: Intermedio | Lingua: Italiano

---

## 🎯 Definizione e Missione del SOC

### Cos'è un SOC?

Il **SOC (Security Operations Center)** è il centro operativo dedicato alla sicurezza informatica di un'organizzazione. Si tratta di una struttura — fisica o virtuale — composta da **persone, processi e tecnologie** che lavorano insieme per:

- **Monitorare** continuamente l'infrastruttura IT (24/7/365)
- **Rilevare** minacce e attività sospette in tempo reale
- **Analizzare** gli eventi di sicurezza per distinguere le minacce reali dai falsi positivi
- **Rispondere** agli incidenti di sicurezza in modo rapido e coordinato
- **Prevenire** futuri attacchi attraverso l'apprendimento continuo

### Missione Principale

La missione del SOC si riassume in quattro pilastri:

| Pilastro | Descrizione |
|----------|-------------|
| **Protezione** | Difendere gli asset digitali dell'organizzazione (dati, sistemi, reti) |
| **Rilevamento** | Identificare tempestivamente le minacce attraverso il monitoraggio continuo |
| **Risposta** | Contenere e mitigare gli incidenti di sicurezza minimizzando l'impatto |
| **Compliance** | Garantire la conformità a normative e standard (GDPR, ISO 27001, PCI-DSS) |

### Perché un SOC è Fondamentale?

In un contesto dove gli attacchi informatici sono in costante crescita, un SOC rappresenta il **centro nevralgico** della difesa aziendale. Senza un SOC:

- Gli attacchi possono passare **inosservati per settimane o mesi** (il tempo medio di rilevamento senza SOC è di circa 200+ giorni)
- Non c'è un **processo strutturato** per la gestione degli incidenti
- La conformità normativa è **difficile da dimostrare**
- I danni economici e reputazionali possono essere **devastanti**

> 💡 **Esempio pratico:** Un ransomware colpisce un server alle 3:00 di notte. Senza un SOC attivo 24/7, nessuno lo rileva fino alla mattina successiva, quando ormai i dati sono criptati. Con un SOC, l'analista di turno rileva l'attività anomala in pochi minuti e avvia la procedural di contenimento.

---

## 🏗️ Tipologie di SOC

### SOC Interno (In-house)

Il SOC è **costruito e gestito direttamente** dall'organizzazione, con personale proprio e infrastrutture dedicate.

**Vantaggi:**
- Controllo totale su processi, dati e tecnologie
- Conoscenza approfondita del contesto aziendale
- Personalizzazione completa delle regole e dei processi
- Comunicazione diretta con gli altri team IT

**Svantaggi:**
- Costi elevati (personale H24, tecnologie, formazione continua)
- Difficoltà nel reclutare e trattenere personale qualificato
- Tempi lunghi di avviamento (6-12 mesi)
- Rischio di "tunnel vision" (mancanza di visibilità su minacce esterne)

**Quando conviene:** Grandi aziende con budget significativo, settori regolamentati (banche, sanità), organizzazioni con dati altamente sensibili.

### SOC Esterno (MSSP - Managed Security Service Provider)

La sicurezza è **delegata a un fornitore esterno** specializzato che gestisce il monitoraggio e la risposta agli incidenti.

**Vantaggi:**
- Costi inferiori e prevedibili (modello a servizio/abbonamento)
- Accesso immediato a personale esperto e tecnologie avanzate
- Operatività 24/7 garantita dal provider
- Scalabilità rapida

**Svantaggi:**
- Minore controllo e visibilità sulle operazioni
- Conoscenza limitata del contesto aziendale specifico
- Dipendenza dal fornitore (vendor lock-in)
- Possibili problemi di latenza nella comunicazione e risposta
- Preoccupazioni sulla condivisione di dati sensibili

**Quando conviene:** PMI con budget limitato, aziende che non riescono a trovare personale qualificato, organizzazioni che necessitano di una soluzione rapida.

### SOC Ibrido

Combina elementi del SOC interno ed esterno. Tipicamente, l'organizzazione mantiene un **team interno ridotto** per le attività strategiche e delega il **monitoraggio H24** e le attività operative al MSSP.

**Come funziona:**
- Il MSSP gestisce il monitoraggio continuo e il Tier 1 (triage)
- Il team interno gestisce Tier 2/3, incident response e threat hunting
- Le decisioni strategiche rimangono all'interno dell'organizzazione
- Il MSSP scala gli alert rilevanti al team interno

**Vantaggi:**
- Equilibrio tra costi e controllo
- Flessibilità operativa
- Copertura H24 senza dover gestire turni completi internamente
- Il team interno mantiene la conoscenza del contesto aziendale

### Tabella Comparativa

| Caratteristica | SOC Interno | SOC Esterno (MSSP) | SOC Ibrido |
|---------------|-------------|---------------------|------------|
| **Costo** | Alto | Medio-Basso | Medio |
| **Controllo** | Totale | Limitato | Buono |
| **Tempo di setup** | 6-12 mesi | 1-3 mesi | 3-6 mesi |
| **Copertura H24** | Richiede molte risorse | Inclusa | Inclusa (MSSP) |
| **Conoscenza aziendale** | Alta | Bassa | Media-Alta |
| **Scalabilità** | Difficile | Facile | Buona |
| **Personalizzazione** | Massima | Limitata | Buona |
| **Ideale per** | Enterprise | PMI | Medie aziende |

---

## 👥 Struttura Organizzativa del SOC

Il SOC è organizzato in **livelli (Tier)**, ciascuno con responsabilità crescenti e competenze più avanzate.

### Tier 1 - Triage Analyst (Analista di Primo Livello)

Il Tier 1 è la **prima linea di difesa** del SOC. Questi analisti sono gli occhi del SOC e si occupano del monitoraggio continuo.

**Compiti principali:**
- Monitoraggio costante degli alert generati dal SIEM
- **Triage iniziale**: classificare gli alert per priorità e severità
- Analisi preliminare per determinare se un alert è un **vero positivo** o un **falso positivo**
- Documentazione degli eventi nel sistema di ticketing
- **Escalation** al Tier 2 degli alert che richiedono analisi approfondita
- Aggiornamento delle procedure operative standard (SOP)

**Competenze richieste:**
- Conoscenza base di networking (TCP/IP, porte, protocolli)
- Familiarità con SIEM (Splunk, QRadar, Sentinel)
- Comprensione dei log di sistema (Windows Event Log, syslog)
- Conoscenza base delle minacce comuni (phishing, malware, brute force)
- Capacità di seguire playbook e procedure

**Strumenti principali:**
- SIEM (Splunk, QRadar, Sentinel)
- Sistema di ticketing (ServiceNow, Jira, TheHive)
- Console EDR (CrowdStrike, SentinelOne, Defender for Endpoint)
- Threat intelligence feeds (VirusTotal, AbuseIPDB, OTX)

**Esempio pratico:**
```
⏰ 14:35 - Il SIEM genera un alert: "Multiple Failed Login Attempts"
📋 Dettagli: 15 tentativi di login falliti in 2 minuti sull'account "admin@azienda.it"
   IP sorgente: 185.220.101.34

Azioni dell'analista Tier 1:
1. Verifico l'IP su VirusTotal → risulta in blacklist (nodo TOR)
2. Controllo se l'account è stato compromesso → nessun login riuscito
3. Classifico come: Brute Force Attack - Severity: Medium
4. Apro un ticket e documento le evidenze
5. Escalo al Tier 2 per ulteriori indagini e blocco dell'IP
```

### Tier 2 - Incident Responder (Analista di Secondo Livello)

Il Tier 2 riceve le escalation dal Tier 1 e conduce **analisi approfondite** degli incidenti di sicurezza.

**Compiti principali:**
- Analisi approfondita degli alert escalati dal Tier 1
- **Investigazione** completa degli incidenti (timeline, scope, impatto)
- **Contenimento** delle minacce (isolamento host, blocco IP, disabilitazione account)
- Analisi forense preliminare (memory dump, disk image, log analysis)
- Raccolta e preservazione delle evidenze digitali
- Coordinamento con altri team (IT, Legal, Management)
- Creazione di report dettagliati sugli incidenti

**Competenze richieste:**
- Competenze avanzate di networking e protocolli
- Esperienza con strumenti di incident response e forensics
- Conoscenza approfondita di malware analysis (statica e dinamica)
- Capacità di analisi dei pacchetti di rete (Wireshark, tcpdump)
- Scripting (Python, PowerShell, Bash)
- Conoscenza dei framework MITRE ATT&CK e Cyber Kill Chain

**Strumenti principali:**
- EDR avanzato (CrowdStrike Falcon, Carbon Black)
- Wireshark, tcpdump (analisi pacchetti)
- Volatility (memory forensics)
- YARA rules, sandbox (malware analysis)
- MITRE ATT&CK Navigator

**Esempio pratico:**
```
📩 Ricevo escalation dal Tier 1: possibile brute force da IP TOR

Investigazione Tier 2:
1. Correlo l'IP sorgente con altri eventi → lo stesso IP ha scansionato
   porte SMB (445) e RDP (3389) su altri 12 server
2. Analizzo i log del firewall → traffico anomalo in uscita dal server HR-SRV01
3. Verifico sull'EDR → nessun malware rilevato, ma processo sospetto
   "powershell.exe" con parametro encoded (-enc)
4. Contenimento: isolo HR-SRV01 dalla rete tramite EDR
5. Acquisisco memory dump e log per analisi forense
6. Documento tutto nel ticket e informo il SOC Manager
7. Se necessario, escalo al Tier 3 per threat hunting
```

### Tier 3 - Threat Hunter / Senior Analyst

Il Tier 3 è composto da analisti senior che lavorano in modo **proattivo** per identificare minacce avanzate che sfuggono ai sistemi automatici.

**Compiti principali:**
- **Threat Hunting proattivo**: ricerca attiva di minacce nascoste nell'infrastruttura
- Analisi di threat intelligence e correlazione con il contesto aziendale
- Sviluppo e tuning delle regole di correlazione del SIEM
- Reverse engineering di malware avanzato
- Sviluppo di nuovi use case di detection
- Mentoring e formazione dei Tier 1 e Tier 2
- Ricerca su nuove vulnerabilità e TTP (Tattiche, Tecniche e Procedure)

**Competenze richieste:**
- Esperienza pluriennale in cybersecurity
- Conoscenza approfondita di MITRE ATT&CK
- Competenze avanzate di reverse engineering e malware analysis
- Scripting avanzato (Python, PowerShell, Bash)
- Conoscenza approfondita dei sistemi operativi (Windows internals, Linux)
- Pensiero laterale e capacità investigativa

**Esempio di attività di Threat Hunting:**
```
Ipotesi: "Un attaccante potrebbe usare PowerShell per eseguire
comandi codificati in Base64 per eludere i controlli"

Query di hunting su Splunk:
index=windows sourcetype=WinEventLog:Security EventCode=4688
| search CommandLine="*powershell*-enc*" OR CommandLine="*powershell*-encoded*"
| stats count by Computer, User, CommandLine
| where count > 1

Risultato: Trovati 3 host con esecuzioni PowerShell encoded sospette
Azione: Investigazione approfondita → scoperto backdoor APT
```

### SOC Manager

Il SOC Manager è il **responsabile dell'intero SOC** e si occupa della gestione strategica e operativa.

**Responsabilità:**
- Gestione del team SOC (hiring, formazione, turni, performance review)
- Definizione e monitoraggio dei **KPI** del SOC
- Reporting alla direzione aziendale e al CISO
- Definizione della strategia di sicurezza operativa
- Gestione del budget del SOC
- Coordinamento con fornitori e partner (MSSP, vendor)
- Gestione delle escalation critiche
- Miglioramento continuo dei processi

**Competenze richieste:**
- Leadership e gestione del personale
- Esperienza in tutte le aree della cybersecurity
- Capacità di comunicazione con il management non tecnico
- Conoscenza di framework (NIST, ISO 27001, ITIL)
- Gestione di progetti e budget

### Tabella Riassuntiva

| Tier | Ruolo | Focus | Competenze Chiave | Strumenti Principali |
|------|-------|-------|-------------------|---------------------|
| **Tier 1** | Triage Analyst | Monitoraggio e triage | Networking base, SIEM, log analysis | SIEM, Ticketing, VirusTotal |
| **Tier 2** | Incident Responder | Investigazione e risposta | Forensics, malware analysis, scripting | EDR, Wireshark, Volatility |
| **Tier 3** | Threat Hunter | Hunting proattivo | Reverse eng., MITRE ATT&CK, threat intel | YARA, sandbox, threat intel platform |
| **Manager** | SOC Manager | Strategia e gestione | Leadership, KPI, compliance | Dashboard, reporting tools |

---

## 📅 Giornata Tipo di un Analista Tier 1

Gli analisti Tier 1 lavorano tipicamente su **turni di 8 ore** per garantire la copertura 24/7. Ecco un esempio di turno mattutino (06:00-14:00):

| Orario | Attività | Dettaglio |
|--------|----------|-----------|
| **06:00-06:30** | 🔄 Handoff | Ricevo il passaggio di consegne dal turno notturno: alert aperti, incidenti in corso, note importanti |
| **06:30-08:00** | 📊 Revisione Alert | Controllo la coda degli alert SIEM accumulati. Prioritizzo per severità (Critical > High > Medium > Low) |
| **08:00-08:30** | ☕ Standup Meeting | Breve riunione con il team: aggiornamenti sugli incidenti in corso, nuove minacce, indicazioni dal manager |
| **08:30-10:00** | 🔍 Triage Alert | Analizzo gli alert uno per uno: verifico IOC, correlo con threat intel, classifico come vero/falso positivo |
| **10:00-10:15** | ☕ Pausa | — |
| **10:15-12:00** | 🔍 Triage + Escalation | Continuo il triage. Escalo al Tier 2 gli alert che richiedono indagine approfondita |
| **12:00-12:30** | 🍽️ Pausa pranzo | — |
| **12:30-13:30** | 📝 Documentazione | Aggiorno i ticket, documento le analisi effettuate, chiudo i falsi positivi con note dettagliate |
| **13:30-13:45** | 📚 Formazione | Studio su nuove minacce, TTP, aggiornamento playbook |
| **13:45-14:00** | 🔄 Handoff | Preparo il passaggio di consegne per il turno pomeridiano: alert aperti, azioni in sospeso, priorità |

### Processo di Handoff (Passaggio di Consegne)

L'handoff è un momento **critico** per garantire la continuità operativa:

1. **Review degli alert aperti**: quali sono ancora in lavorazione?
2. **Incidenti in corso**: a che punto è l'investigazione?
3. **Azioni pendenti**: cosa deve essere fatto dal prossimo turno?
4. **Comunicazioni importanti**: email dal management, nuove minacce, cambi di policy
5. **Documentazione**: tutto deve essere scritto nel log del turno

---

## 📊 KPI del SOC

I **KPI (Key Performance Indicators)** misurano l'efficacia e l'efficienza del SOC. Ecco i principali:

### MTTD - Mean Time to Detect (Tempo Medio di Rilevamento)

- **Definizione:** Tempo medio che intercorre tra l'inizio di un incidente di sicurezza e il momento in cui il SOC lo rileva
- **Formula:** `MTTD = Σ(Tempo di rilevamento - Tempo di inizio incidente) / N° incidenti`
- **Obiettivo:** Il più basso possibile (ideale: < 1 ora)
- **Esempio:** Un malware viene installato alle 10:00 e il SOC rileva l'attività sospetta alle 10:23 → MTTD = 23 minuti

### MTTR - Mean Time to Respond (Tempo Medio di Risposta)

- **Definizione:** Tempo medio che intercorre tra il rilevamento di un incidente e il completamento della risposta (contenimento/mitigazione)
- **Formula:** `MTTR = Σ(Tempo di risposta completata - Tempo di rilevamento) / N° incidenti`
- **Obiettivo:** Il più basso possibile (ideale: < 4 ore per incidenti critici)
- **Esempio:** Alert rilevato alle 10:23, malware contenuto e rimosso alle 11:45 → MTTR = 1h 22min

### Tasso di Falsi Positivi

- **Definizione:** Percentuale di alert che risultano essere non malevoli dopo l'analisi
- **Formula:** `FP Rate = (N° falsi positivi / N° totale alert) × 100`
- **Obiettivo:** < 30% (un SOC maturo punta al 10-15%)
- **Esempio:** Su 100 alert ricevuti, 40 sono falsi positivi → FP Rate = 40% (troppo alto, servono tuning)

### Copertura degli Alert

- **Definizione:** Percentuale delle tecniche di attacco coperte dalle regole di detection del SIEM
- **Riferimento:** Mappatura su MITRE ATT&CK
- **Obiettivo:** Coprire almeno le tecniche più comuni (80%+ delle Top 20)
- **Esempio:** Il SOC ha regole per 150 delle 200 tecniche MITRE ATT&CK → copertura 75%

### Tasso di Escalation

- **Definizione:** Percentuale di alert che vengono escalati dal Tier 1 al Tier 2
- **Formula:** `Escalation Rate = (N° alert escalati / N° totale alert) × 100`
- **Obiettivo:** 10-20% (troppo alto = Tier 1 non filtra abbastanza; troppo basso = possibili minacce perse)

### Volume di Incidenti

- **Definizione:** Numero totale di incidenti gestiti in un periodo
- **Monitoraggio:** Trend mensile/trimestrale
- **Utilità:** Valutare il carico di lavoro e il dimensionamento del team

### SLA Compliance

- **Definizione:** Percentuale di incidenti gestiti entro i tempi stabiliti dagli SLA (Service Level Agreement)
- **Formula:** `SLA Compliance = (N° incidenti gestiti in tempo / N° totale incidenti) × 100`
- **Obiettivo:** > 95%

### Tabella Riassuntiva KPI

| KPI | Cosa Misura | Formula | Obiettivo | Frequenza |
|-----|-------------|---------|-----------|-----------|
| **MTTD** | Velocità di rilevamento | Tempo detect - Tempo inizio | < 1 ora | Mensile |
| **MTTR** | Velocità di risposta | Tempo risposta - Tempo detect | < 4 ore (critici) | Mensile |
| **FP Rate** | Qualità detection | FP / Totale alert × 100 | < 30% | Settimanale |
| **Copertura** | Ampiezza detection | Tecniche coperte / Totale | > 80% MITRE | Trimestrale |
| **Escalation Rate** | Efficacia Tier 1 | Escalati / Totale × 100 | 10-20% | Mensile |
| **Volume Incidenti** | Carico di lavoro | Conteggio | Trend stabile | Mensile |
| **SLA Compliance** | Rispetto degli SLA | In tempo / Totale × 100 | > 95% | Mensile |

---

## 📈 Modelli di Maturità del SOC

I modelli di maturità permettono di valutare quanto un SOC sia evoluto e di pianificare il percorso di miglioramento. Il modello più comune si articola in **5 livelli**:

### Livello 1 - Iniziale / Reattivo

- **Caratteristiche:** Il SOC esiste in forma embrionale. La risposta è puramente reattiva, senza processi strutturati
- **Personale:** Pochi analisti, spesso con altri compiti IT
- **Tecnologie:** Strumenti di base, logging minimo, nessun SIEM o SIEM sottoutilizzato
- **Processi:** Nessun playbook, nessuna procedura documentata
- **Detection:** Solo alert dei prodotti di sicurezza (antivirus, firewall)

### Livello 2 - Gestito (Managed)

- **Caratteristiche:** Il SOC ha processi definiti e un SIEM operativo con regole base
- **Personale:** Team dedicato con ruoli definiti (Tier 1/2)
- **Tecnologie:** SIEM configurato, EDR base, ticketing system
- **Processi:** Playbook per gli scenari più comuni, processo di escalation definito
- **Detection:** Regole di correlazione per le minacce più comuni

### Livello 3 - Definito (Defined)

- **Caratteristiche:** Processi ben documentati e ripetibili. Threat intelligence integrata
- **Personale:** Team completo (Tier 1/2/3), training regolare
- **Tecnologie:** SIEM avanzato, SOAR per automazione, threat intel platform
- **Processi:** Playbook completi, metriche di performance, incident response plan
- **Detection:** Buona copertura MITRE ATT&CK, regole personalizzate

### Livello 4 - Misurato (Measured)

- **Caratteristiche:** KPI misurati e utilizzati per il miglioramento continuo
- **Personale:** Team maturo con specializzazioni (malware analyst, threat hunter)
- **Tecnologie:** SIEM + SOAR + XDR integrati, automazione avanzata
- **Processi:** Continuous improvement basato su metriche, tabletop exercise regolari
- **Detection:** Threat hunting proattivo, detection basata su comportamento (UEBA)

### Livello 5 - Ottimizzato (Optimized)

- **Caratteristiche:** SOC all'avanguardia con automazione massima e intelligence-driven operations
- **Personale:** Team di eccellenza, red team/blue team integrati
- **Tecnologie:** AI/ML per detection avanzata, full automation, deception technologies
- **Processi:** Miglioramento continuo automatizzato, zero-day detection, collaborazione con comunità
- **Detection:** Copertura quasi completa, detection predittiva, purple teaming

### Tabella Maturità

| Livello | Nome | SIEM | Automazione | Threat Hunting | KPI |
|---------|------|------|-------------|----------------|-----|
| 1 | Iniziale | Assente/Base | Nessuna | No | No |
| 2 | Gestito | Operativo | Minima | No | Base |
| 3 | Definito | Avanzato | SOAR base | Occasionale | Sì |
| 4 | Misurato | Integrato | SOAR avanzato | Regolare | Avanzati |
| 5 | Ottimizzato | AI/ML | Massima | Continuo | Predittivi |

---

## 🎯 Domande da Colloquio

### Domanda 1: Cos'è un SOC e qual è la sua missione principale?

**Risposta:**
Un SOC (Security Operations Center) è il centro operativo di sicurezza di un'organizzazione, composto da persone, processi e tecnologie che lavorano insieme per proteggere l'infrastruttura IT. La missione principale è il monitoraggio continuo 24/7 dell'ambiente IT per rilevare, analizzare e rispondere alle minacce di sicurezza informatica in tempo reale. Il SOC ha quattro pilastri fondamentali: protezione degli asset digitali, rilevamento tempestivo delle minacce, risposta rapida agli incidenti e garanzia della compliance normativa. In pratica, il SOC è gli "occhi e le orecchie" della sicurezza aziendale.

---

### Domanda 2: Quali sono le differenze tra SOC interno, esterno (MSSP) e ibrido?

**Risposta:**
Il **SOC interno** è costruito e gestito dall'organizzazione stessa: offre controllo totale e conoscenza approfondita del contesto aziendale, ma ha costi elevati e richiede molte risorse per la copertura H24. Il **SOC esterno (MSSP)** è gestito da un fornitore specializzato: ha costi inferiori e operatività immediata, ma offre meno controllo e conoscenza limitata del contesto aziendale. Il **SOC ibrido** è la combinazione dei due: tipicamente il MSSP gestisce il monitoraggio continuo e il Tier 1, mentre il team interno si occupa delle investigazioni avanzate e delle decisioni strategiche. La scelta dipende da budget, dimensioni dell'organizzazione, requisiti normativi e disponibilità di personale qualificato. Le grandi enterprise tendono al SOC interno, le PMI al MSSP, e le medie aziende spesso adottano il modello ibrido.

---

### Domanda 3: Descrivi i compiti di un analista Tier 1 nel SOC.

**Risposta:**
L'analista Tier 1 è la prima linea di difesa del SOC. I suoi compiti principali sono: monitorare continuamente la dashboard SIEM per individuare nuovi alert; eseguire il **triage iniziale** classificando gli alert per severità (Critical, High, Medium, Low); analizzare gli alert per determinare se si tratta di veri positivi o falsi positivi, utilizzando strumenti come VirusTotal, AbuseIPDB e la console EDR; **documentare** ogni analisi nel sistema di ticketing con evidenze e note; **escalare** al Tier 2 gli alert che richiedono indagini approfondite. Deve inoltre seguire i playbook stabiliti, aggiornare le procedure quando necessario e partecipare agli handoff tra turni per garantire la continuità operativa. Le competenze chiave includono conoscenza base di networking, familiarità con il SIEM, comprensione dei log di sistema e conoscenza delle minacce comuni.

---

### Domanda 4: Come gestisci un alert di sicurezza che ricevi durante il tuo turno?

**Risposta:**
Seguo un processo strutturato: **1) Acquisizione**: leggo l'alert dal SIEM, identificando tipo di evento, sorgente, destinazione, timestamp e severità. **2) Contestualizzazione**: verifico se l'IP/dominio coinvolto è noto come malevolo (VirusTotal, AbuseIPDB), controllo se l'utente coinvolto ha comportamenti precedenti simili, e verifico se ci sono alert correlati. **3) Classificazione**: determino se è un vero positivo, falso positivo o se necessita di ulteriori indagini. **4) Azione**: se è un falso positivo, lo chiudo con una nota dettagliata; se è un vero positivo a bassa severità, applico il playbook corrispondente; se è critico o complesso, lo escalo al Tier 2 con tutte le evidenze raccolte. **5) Documentazione**: aggiorno il ticket con timestamp, azioni intraprese, evidenze e conclusioni. Questo processo garantisce che ogni alert sia gestito in modo consistente e tracciabile.

---

### Domanda 5: Cos'è il MTTD e perché è importante per un SOC?

**Risposta:**
Il MTTD (Mean Time to Detect) è il **tempo medio di rilevamento**, ovvero il tempo che intercorre tra l'inizio effettivo di un incidente di sicurezza e il momento in cui il SOC lo identifica. È uno dei KPI più critici perché un tempo di rilevamento lungo significa che l'attaccante ha più tempo per muoversi lateralmente, esfiltrare dati o causare danni. Secondo studi di settore, il MTTD medio senza un SOC efficace può superare i 200 giorni. Un SOC maturo punta a un MTTD inferiore a 1 ora per le minacce critiche. Per ridurre il MTTD si possono migliorare le regole di correlazione del SIEM, integrare threat intelligence, implementare UEBA (User and Entity Behavior Analytics) e automatizzare i processi con un SOAR.

---

### Domanda 6: Descrivi la tua giornata tipo come analista SOC Tier 1.

**Risposta:**
La mia giornata inizia con l'**handoff** dal turno precedente: ricevo informazioni sugli alert aperti, incidenti in corso e azioni pendenti. Successivamente passo alla **revisione della coda degli alert** sul SIEM, prioritizzando quelli a severità più alta. Partecipo allo **standup meeting** con il team per allinearci sulle priorità del giorno. La parte centrale del turno è dedicata al **triage degli alert**: analizzo ogni alert, verifico gli IOC con strumenti di threat intelligence, correlo gli eventi e determino se sono veri o falsi positivi. Gli alert complessi vengono **escalati** al Tier 2 con documentazione dettagliata. Dedico tempo alla **documentazione** accurata di ogni analisi nel sistema di ticketing. Alla fine del turno, preparo l'**handoff** per il turno successivo, assicurandomi che nessuna informazione critica vada persa. Se il tempo lo permette, dedico 15-20 minuti allo studio di nuove minacce e TTP.

---

### Domanda 7: Come gestisci un alto numero di falsi positivi nel SOC?

**Risposta:**
I falsi positivi sono una delle sfide principali di un SOC perché causano **alert fatigue** e possono far perdere minacce reali. Per gestirli, adotto un approccio sistematico: **1) Identificazione dei pattern**: analizzo quali regole SIEM generano più falsi positivi e perché. **2) Tuning delle regole**: modifico le regole di correlazione per renderle più precise, ad esempio aggiungendo condizioni aggiuntive o alzando le soglie. **3) Whitelisting**: creo whitelist per attività legittime note (scanner di vulnerabilità interni, backup schedulati, attività di manutenzione). **4) Feedback loop**: comunico i pattern di falsi positivi al Tier 3 per il miglioramento delle regole. **5) Documentazione**: mantengo un registro dei falsi positivi più comuni per velocizzare il triage futuro. **6) Automazione**: uso il SOAR per chiudere automaticamente i falsi positivi ricorrenti che hanno pattern prevedibili. L'obiettivo è ridurre progressivamente il tasso di falsi positivi senza sacrificare la capacità di detection.

---

### Domanda 8: Cosa faresti se ricevessi un alert critico di possibile ransomware alle 3 di notte?

**Risposta:**
Procederei immediatamente seguendo il playbook per ransomware: **1) Verifica immediata**: confermo la validità dell'alert controllando i log EDR per processi sospetti (cifratura massiva di file, cancellazione shadow copy, processi come vssadmin, bcdedit). **2) Contenimento rapido**: se confermato, isolo immediatamente l'host dalla rete tramite la console EDR per prevenire il movimento laterale e la propagazione. **3) Comunicazione**: notifico il SOC Manager e il Tier 2 on-call attraverso i canali di emergenza definiti. **4) Scope assessment**: verifico se altri host mostrano segni simili controllando alert correlati e log di rete. **5) Preservazione evidenze**: avvio la raccolta di log, memory dump e eventuali sample del malware. **6) Documentazione continua**: documento ogni azione con timestamp precisi nel ticket. **7) Escalation**: se la situazione è estesa, attivo il piano di incident response completo coinvolgendo il management. Non agisco mai autonomamente su decisioni che impattano il business (come spegnere server di produzione) senza approvazione, ma il contenimento dell'host infetto è un'azione che posso e devo eseguire immediatamente.

---

### Domanda 9: Cos'è il framework MITRE ATT&CK e come lo usi nel SOC?

**Risposta:**
MITRE ATT&CK (Adversarial Tactics, Techniques, and Common Knowledge) è un **framework basato su conoscenza reale** che cataloga le tattiche, tecniche e procedure (TTP) utilizzate dagli attaccanti nel mondo reale. È organizzato in una matrice dove le colonne rappresentano le **tattiche** (gli obiettivi dell'attaccante, come Initial Access, Execution, Persistence, Lateral Movement, Exfiltration) e le righe le **tecniche** specifiche per raggiungere quegli obiettivi. Nel SOC lo utilizzo in diversi modi: per **mappare le regole di detection** del SIEM sulle tecniche ATT&CK e identificare le lacune di copertura; per **classificare gli incidenti** usando un linguaggio comune; per **prioritizzare lo sviluppo** di nuovi use case di detection; e per **comunicare** con altri team di sicurezza usando una tassonomia condivisa. È uno strumento fondamentale per valutare la maturità del SOC e pianificare il miglioramento continuo.

---

### Domanda 10: Qual è la differenza tra un incidente e un evento di sicurezza?

**Risposta:**
Un **evento di sicurezza** è qualsiasi attività osservabile in un sistema o rete che ha rilevanza per la sicurezza. Ad esempio, un login riuscito, un tentativo di accesso a un file, o una connessione di rete. Vengono generati migliaia di eventi al giorno e la maggior parte sono legittimi. Un **incidente di sicurezza** è un evento o una serie di eventi che **violano effettivamente** le policy di sicurezza dell'organizzazione o rappresentano una **minaccia concreta** per la confidenzialità, integrità o disponibilità dei dati. Ad esempio, un attacco brute force riuscito seguito da accesso non autorizzato è un incidente. In pratica, il lavoro del SOC Analyst è proprio quello di analizzare gli eventi (sotto forma di alert) per determinare quali costituiscono incidenti reali che richiedono una risposta. Ogni incidente è un evento, ma non ogni evento è un incidente.
