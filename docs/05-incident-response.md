# 🚨 Incident Response per SOC Analyst

> **Modulo 05** — Guida completa all'Incident Response per la preparazione al colloquio SOC Analyst

---

## 📌 Cos'è l'Incident Response e Perché è Cruciale

L'**Incident Response (IR)** è il processo strutturato con cui un'organizzazione **rileva, gestisce, contiene e risolve** incidenti di sicurezza informatica. L'obiettivo è minimizzare i danni, ridurre i tempi di ripristino e prevenire che l'incidente si ripeta.

### Perché è cruciale

| Motivazione | Descrizione |
|---|---|
| **Riduzione dei danni** | Un IR efficace riduce drasticamente l'impatto economico e reputazionale |
| **Tempo di risposta** | Il MTTD (Mean Time To Detect) e MTTR (Mean Time To Respond) sono KPI critici |
| **Compliance** | GDPR richiede notifica entro 72 ore — senza IR strutturato, è impossibile rispettarlo |
| **Continuità operativa** | Un incidente non gestito può bloccare l'intera azienda |
| **Miglioramento continuo** | Ogni incidente è un'opportunità per rafforzare le difese |

> 💡 **Statistica**: Il costo medio di un data breach nel 2024 è di **4.88 milioni di dollari** (IBM Cost of a Data Breach Report). Le organizzazioni con un IR team e un piano testato risparmiano in media **2.66 milioni**.

---

## ⚡ Incidente vs Evento di Sicurezza

Questa distinzione è **fondamentale** e viene spesso chiesta ai colloqui:

| | Evento di Sicurezza (Security Event) | Incidente di Sicurezza (Security Incident) |
|---|---|---|
| **Definizione** | Qualsiasi osservazione identificabile in un sistema o rete | Un evento che viola le policy di sicurezza o rappresenta una minaccia concreta |
| **Frequenza** | Migliaia/milioni al giorno | Relativamente rari |
| **Azione richiesta** | Monitoraggio, possibile analisi | Risposta strutturata secondo il piano IR |
| **Esempi** | Login riuscito, scansione di porte bloccata dal firewall, alert antivirus risolto automaticamente | Ransomware attivo, data breach confermato, compromissione di un server, phishing con credenziali rubate |

### Il Flusso: Evento → Alert → Incidente

```
Evento di sicurezza
    ↓ (il SIEM correla e genera un alert)
Alert
    ↓ (l'analista SOC fa triage)
    ├─→ Falso positivo → Chiuso, tuning della regola
    ├─→ True positive → Evento di sicurezza confermato
    └─→ True positive + impatto → INCIDENTE → Attivazione IR
```

> 💡 La capacità di distinguere rapidamente tra falsi positivi, eventi legittimi e veri incidenti è la competenza **core** di un SOC Analyst.

---

## 📋 Framework NIST SP 800-61 — Incident Response Lifecycle

Il **NIST SP 800-61 Rev. 2** ("Computer Security Incident Handling Guide") è il framework più utilizzato e riconosciuto per l'Incident Response. Definisce **4 fasi principali** (che nell'uso operativo si espandono in 6 sotto-fasi):

```
┌────────────────────────────────────────────────────┐
│                                                    │
│   ┌──────────┐    ┌──────────┐    ┌──────────┐    │
│   │1.Prepara-│    │2.Rileva- │    │3.Conteni-│    │
│   │  zione   │───→│  mento & │───→│ mento,   │    │
│   │          │    │  Analisi │    │ Eradica- │    │
│   └──────────┘    └──────────┘    │ zione &  │    │
│        ↑                          │ Recovery │    │
│        │          ┌──────────┐    └────┬─────┘    │
│        │          │4.Post-   │         │          │
│        └──────────│ Incident │←────────┘          │
│                   │ Activity │                    │
│                   └──────────┘                    │
└────────────────────────────────────────────────────┘
```

### Fase 1: Preparazione

La preparazione è la fase **più importante** perché determina la qualità della risposta a un incidente.

**Attività chiave**:
- Creare e testare il **Piano di Incident Response** (IRP)
- Definire il **team IR**: ruoli, responsabilità, contatti (on-call)
- Implementare **strumenti di monitoring**: SIEM, EDR, IDS/IPS, firewall
- Creare **playbook** e **runbook** per scenari comuni (phishing, malware, ransomware)
- **Baseline del sistema**: sapere cosa è "normale" per riconoscere le anomalie
- **Formazione**: training regolare del team, esercitazioni tabletop
- Preparare **jump bag** (kit di risposta): live USB, tool forensi, documentazione offline
- Stabilire canali di comunicazione sicuri per il team IR

### Fase 2: Identificazione / Rilevamento e Analisi

**Obiettivo**: Determinare se un incidente è in corso e comprenderne la portata.

**Fonti di rilevamento**:
- Alert SIEM
- Segnalazioni utenti ("Ho cliccato su un link strano")
- Alert IDS/IPS o EDR
- Alert antivirus/antimalware
- Threat intelligence feed
- Anomalie nei log
- Segnalazioni esterne (CERT, forze dell'ordine, terze parti)

**Attività**:
1. **Triage iniziale**: valutare se l'alert è un vero incidente
2. **Raccolta evidenze iniziali**: log, artefatti, screenshot
3. **Analisi**: determinare tipo di incidente, vettore di attacco, sistemi coinvolti
4. **Scope assessment**: quanto è diffuso? Quali sistemi/dati sono compromessi?
5. **Classificazione**: assegnare severità e priorità
6. **Documentazione**: aprire un ticket con tutte le informazioni

### Fase 3: Contenimento

**Obiettivo**: Limitare la diffusione dell'incidente e impedire ulteriori danni.

Si divide in due sotto-fasi:

#### Contenimento a Breve Termine (Short-Term)
Azioni immediate per fermare l'emorragia:
- **Isolamento di rete**: disconnettere l'host compromesso dalla rete (ma NON spegnerlo — si perderebbero le evidenze in RAM)
- **Blocco IP/dominio malevolo**: nel firewall e nel proxy
- **Disabilitazione account compromesso**: in Active Directory
- **Blocco di email**: quarantena delle email di phishing non ancora aperte

#### Contenimento a Lungo Termine (Long-Term)
Azioni per stabilizzare l'ambiente:
- **Patching** della vulnerabilità sfruttata
- **Cambio password** degli account compromessi
- **Applicazione regole firewall** permanenti
- **Reimaging dei sistemi** compromessi (se necessario)
- **Segmentazione di rete** aggiuntiva

> ⚠️ **Regola critica**: Durante il contenimento, **preservare le evidenze** prima di qualsiasi azione distruttiva. Fare un forensic copy prima di reimagare un sistema.

### Fase 4: Eradicazione

**Obiettivo**: Rimuovere completamente la minaccia dall'ambiente.

**Attività**:
- Rimozione del malware da tutti i sistemi infetti
- Eliminazione di account backdoor creati dall'attaccante
- Rimozione di file e servizi malevoli (persistence mechanisms)
- Chiusura delle vulnerabilità sfruttate
- Scansione completa dell'ambiente per verificare l'assenza di compromissioni residue
- Verifica che tutti i punti di accesso dell'attaccante siano stati eliminati

### Fase 5: Recovery (Ripristino)

**Obiettivo**: Ripristinare i sistemi alla piena operatività in modo sicuro.

**Attività**:
- Ripristino dei sistemi da backup puliti (verificati pre-incidente)
- Rebuild dei sistemi compromessi
- Riconnessione graduale alla rete
- **Monitoraggio intensivo**: verificare che la minaccia non riappaia
- Validazione del funzionamento di tutti i servizi
- Comunicazione agli stakeholder sul ripristino

**Monitoraggio post-recovery**: è essenziale monitorare intensamente i sistemi ripristinati per **almeno 30-60 giorni** per assicurarsi che l'attaccante non ritorni.

### Fase 6: Lessons Learned / Post-Incident Review

**Obiettivo**: Imparare dall'incidente per migliorare le difese future.

**Attività**:
- **Post-Incident Review meeting**: entro 1-2 settimane dall'incidente
- Domande chiave:
  - Cosa è successo esattamente?
  - Quando è stato rilevato? Quanto tempo ci è voluto?
  - La risposta è stata efficace? Cosa ha funzionato? Cosa no?
  - Quali strumenti/processi mancavano?
  - Come possiamo prevenirlo in futuro?
- **Aggiornamento della documentazione**: playbook, runbook, IRP
- **Implementazione delle migliorie**: nuove regole SIEM, hardening, formazione
- **Report finale**: documento completo con timeline, impatto, azioni intraprese, raccomandazioni

---

## 🔄 SANS Incident Response Process

Il framework SANS definisce **6 fasi** (mnemonico: **P-I-C-E-R-L**):

| Fase | SANS | Corrispondenza NIST |
|---|---|---|
| 1 | **P**reparation | Preparazione |
| 2 | **I**dentification | Rilevamento e Analisi |
| 3 | **C**ontainment | Contenimento |
| 4 | **E**radication | Eradicazione |
| 5 | **R**ecovery | Recovery |
| 6 | **L**essons Learned | Post-Incident Activity |

### Confronto NIST vs SANS

| Aspetto | NIST SP 800-61 | SANS |
|---|---|---|
| **Struttura** | 4 fasi principali (raggruppate) | 6 fasi esplicite |
| **Contenimento/Eradicazione/Recovery** | Raggruppate in un'unica fase | Separate in 3 fasi distinte |
| **Iteratività** | Enfatizza il ciclo iterativo | Più lineare, ma comunque iterativo |
| **Focus** | Più orientato alla governance e policy | Più orientato alla pratica operativa |
| **Adozione** | Standard governativo/enterprise | Molto usato nella formazione (GCIH, GIAC) |

> 💡 Nella pratica, i due framework sono quasi equivalenti. La differenza principale è che NIST raggruppa Contenimento+Eradicazione+Recovery in un'unica macro-fase, mentre SANS le separa esplicitamente.

---

## ⚠️ Severity Levels — Classificazione degli Incidenti

### Tabella dei Livelli di Severità

| Livello | Nome | Descrizione | Esempi | Risposta |
|---|---|---|---|---|
| **P1** | **Critical** | Impatto grave e immediato su sistemi critici o dati sensibili | Ransomware attivo, data breach confermato, compromissione DC, attacco in corso con exfiltration | Risposta immediata 24/7, all-hands, escalation management, possibile coinvolgimento legale |
| **P2** | **High** | Impatto significativo ma contenibile | Malware su server di produzione, compromissione account privilegiato, phishing con credenziali rubate (senza exfiltration confermata) | Risposta entro 1-2 ore, team IR dedicato |
| **P3** | **Medium** | Impatto limitato, nessun sistema critico coinvolto | Malware su workstation isolata, tentativo di phishing con click ma senza immissione credenziali, scansione interna sospetta | Risposta entro 4-8 ore, analisi approfondita |
| **P4** | **Low** | Impatto minimo, evento sospetto ma non confermato | Policy violation minore, alert isolato non confermato, scansione esterna bloccata dal firewall | Risposta entro 24 ore, monitoraggio |

### Fattori per Determinare la Severità

- **Dati coinvolti**: dati personali, finanziari, proprietà intellettuale?
- **Sistemi coinvolti**: sistemi critici (DC, database) o workstation generica?
- **Diffusione**: quanti sistemi sono compromessi?
- **Tipo di minaccia**: APT, ransomware, insider threat?
- **Impatto operativo**: servizi business impattati?
- **Compliance**: coinvolge dati regolamentati (GDPR, PCI-DSS)?

---

## 📖 Playbook e Runbook

### Playbook

Un **playbook** è un documento strategico-operativo che descrive **come rispondere a un tipo specifico di incidente**. Include decision trees, criteri di classificazione, e azioni ad alto livello.

**Caratteristiche**:
- Orientato alla decisione ("Se X, allora fai Y")
- Include criteri di escalation
- Flessibile, richiede giudizio dell'analista
- Può coprire scenari complessi

### Runbook

Un **runbook** è una procedura operativa passo-passo, molto dettagliata e specifica. È più granulare del playbook e spesso include comandi esatti da eseguire.

**Caratteristiche**:
- Orientato all'esecuzione ("Esegui questo comando")
- Preciso e ripetibile
- Può essere automatizzato
- Ideale per task ripetitivi

### Differenze Chiave

| Aspetto | Playbook | Runbook |
|---|---|---|
| **Livello** | Strategico/operativo | Tattico/operativo |
| **Flessibilità** | Richiede giudizio | Passo-passo rigido |
| **Decisioni** | Include alberi decisionali | Comandi specifici |
| **Automazione** | Parzialmente automatizzabile | Facilmente automatizzabile |
| **Esempio** | "Playbook per incidente phishing" | "Come bloccare un dominio nel proxy" |

### Esempio di Playbook: Risposta a Phishing

```
╔══════════════════════════════════════════════════════════╗
║         PLAYBOOK: RISPOSTA A INCIDENTE PHISHING          ║
╠══════════════════════════════════════════════════════════╣
║                                                          ║
║  FASE 1: TRIAGE INIZIALE                                 ║
║  ┌─────────────────────────────────┐                     ║
║  │ Segnalazione ricevuta:          │                     ║
║  │ email sospetta da utente        │                     ║
║  └──────────┬──────────────────────┘                     ║
║             │                                            ║
║             ▼                                            ║
║  ┌─────────────────────────────────┐                     ║
║  │ Raccogliere informazioni:       │                     ║
║  │ - Header email completi         │                     ║
║  │ - Mittente (display + reale)    │                     ║
║  │ - URL/allegati presenti?        │                     ║
║  │ - L'utente ha cliccato?         │                     ║
║  │ - L'utente ha inserito dati?    │                     ║
║  └──────────┬──────────────────────┘                     ║
║             │                                            ║
║             ▼                                            ║
║  ┌─────────────────────────────────┐                     ║
║  │ L'utente ha cliccato sul link   │                     ║
║  │ o aperto l'allegato?            │                     ║
║  └──────┬────────────┬─────────────┘                     ║
║     NO  │            │  SÌ                               ║
║         ▼            ▼                                   ║
║                                                          ║
║  FASE 2A: NESSUN CLICK                                   ║
║  - Verificare URL/allegato su VirusTotal                 ║
║  - Bloccare mittente/dominio nel gateway email           ║
║  - Cercare la stessa email in altre caselle              ║
║  - Rimuovere/quarantenare copie non ancora lette         ║
║  - Chiudere il ticket → Severity Low                     ║
║                                                          ║
║  FASE 2B: CLICK AVVENUTO                                 ║
║  ┌─────────────────────────────────┐                     ║
║  │ L'utente ha inserito            │                     ║
║  │ credenziali o dati sensibili?   │                     ║
║  └──────┬────────────┬─────────────┘                     ║
║     NO  │            │  SÌ                               ║
║         ▼            ▼                                   ║
║                                                          ║
║  FASE 3A: CLICK SENZA INSERIMENTO DATI                   ║
║  - Isolare l'endpoint (se possibile)                     ║
║  - Scan EDR/antimalware completo                         ║
║  - Controllare processi sospetti e connessioni di rete   ║
║  - Verificare proxy log per connessioni post-click       ║
║  - Se clean → ripristinare e monitorare                  ║
║  - Se compromesso → escalare → Severity Medium/High      ║
║                                                          ║
║  FASE 3B: CREDENZIALI INSERITE → Severity High           ║
║  - Reset password IMMEDIATO dell'utente                  ║
║  - Revocare le sessioni attive (token, OAuth)            ║
║  - Abilitare/verificare MFA sull'account                 ║
║  - Controllare login recenti dell'account (SIEM)         ║
║  - Verificare se l'attaccante ha già usato l'account     ║
║  - Controllare regole email create (forwarding!)         ║
║  - Se accesso confermato dell'attaccante → escalare P1   ║
║                                                          ║
║  FASE 4: CONTAINMENT GENERALE                            ║
║  - Bloccare URL/dominio nel proxy                        ║
║  - Bloccare mittente/dominio nel gateway email           ║
║  - Aggiungere IoC al SIEM e alla blacklist               ║
║  - Cercare altri utenti che hanno ricevuto la stessa     ║
║    email e verificare chi ha cliccato (proxy log)        ║
║                                                          ║
║  FASE 5: LESSONS LEARNED                                 ║
║  - Aggiornare il training di awareness                   ║
║  - Ringraziare l'utente che ha segnalato                 ║
║  - Verificare se le regole email possono essere migliorate║
║  - Documentare tutto nel ticket                          ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝
```

---

## 🎫 Ticketing — Documentare un Incidente

### Campi Essenziali di un Ticket di Incidente

| Campo | Descrizione | Esempio |
|---|---|---|
| **Ticket ID** | Identificativo univoco | INC-2024-00142 |
| **Data/Ora apertura** | Quando è stato aperto il ticket | 2024-01-15 14:30 UTC |
| **Fonte del rilevamento** | Come è stato scoperto | Alert SIEM, segnalazione utente, threat intel |
| **Titolo** | Descrizione breve | "Malware ransomware su server FILE-SRV01" |
| **Descrizione** | Dettagli dell'incidente | Descrizione completa con contesto |
| **Severità** | Livello di criticità | P1 - Critical |
| **Categoria** | Tipo di incidente | Malware, Phishing, Data Breach, DoS |
| **Sistemi coinvolti** | Asset impattati | FILE-SRV01 (10.0.1.100), WKS-MR001 (10.0.1.50) |
| **Utenti coinvolti** | Account impattati | mario.rossi, admin_service |
| **IoC identificati** | Indicatori raccolti | Hash, IP, domini, URL |
| **Azioni intraprese** | Cosa è stato fatto | "Host isolato, password resetata, IP bloccato" |
| **Timeline** | Cronologia degli eventi | Sequenza dettagliata con timestamp |
| **Assegnato a** | Analista/team responsabile | Tier 2 - Team IR |
| **Status** | Stato del ticket | Open, In Progress, Waiting, Resolved, Closed |
| **Escalation** | Se/quando è stato escalato | "Escalato a Tier 3 alle 15:00 UTC" |
| **Evidenze** | Artefatti allegati | Screenshot, log esportati, PCAP, immagini forensi |
| **Raccomandazioni** | Suggerimenti per prevenzione | "Implementare MFA su tutti gli account" |
| **Data/Ora chiusura** | Quando è stato risolto | 2024-01-16 09:00 UTC |

### Best Practice nella Documentazione

- **Documenta tutto in tempo reale**: non affidarti alla memoria
- **Usa timestamp precisi**: sempre in UTC
- **Sii specifico**: "Ho bloccato l'IP 185.220.101.34 nel firewall perimetrale" non "Ho bloccato l'IP"
- **Registra le decisioni**: perché hai scelto di non spegnere il server? Documentalo
- **Allega le evidenze**: screenshot, log, hash, regole SIEM che hanno generato l'alert
- **Mantieni il ticket aggiornato**: ogni nuova scoperta o azione va registrata

---

## ⬆️ Escalation — Quando e Come Escalare

### Quando Escalare

| Situazione | Azione |
|---|---|
| L'analista Tier 1 non riesce a determinare se è un vero incidente | Escalare a **Tier 2** |
| L'incidente è confermato e richiede azioni di contenimento avanzate | Escalare a **Tier 2/3** |
| L'incidente coinvolge sistemi critici o dati sensibili | Escalare a **SOC Manager** e **IR Team** |
| Si sospetta un data breach con dati regolamentati (GDPR) | Escalare a **Management** e **Legale** |
| L'incidente richiede azioni che superano l'autorità dell'analista | Escalare secondo la **chain of command** |
| Ransomware attivo o attacco in corso con impatto diffuso | **Escalation immediata** a tutti i livelli |

### Chain of Command Tipica

```
Tier 1 SOC Analyst (L1)
    ↓ (se non riesce a risolvere o incidente confermato)
Tier 2 SOC Analyst (L2)
    ↓ (se richiede competenze avanzate o incidente critico)
Tier 3 / Incident Responder (L3)
    ↓ (se richiede decisioni manageriali)
SOC Manager
    ↓ (se richiede coinvolgimento executive)
CISO / Head of Security
    ↓ (se richiede decisioni aziendali)
C-Suite (CEO, CTO)
    ↓ (se necessario)
Autorità esterne (CERT, Garante Privacy, Forze dell'Ordine)
```

### Come Escalare Correttamente

1. **Documenta prima**: assicurati che il ticket sia aggiornato con tutte le informazioni raccolte
2. **Specifica cosa hai fatto**: l'analista di livello superiore deve sapere cosa è già stato verificato
3. **Indica perché escali**: "Escalo perché il malware ha meccanismi di persistence che non riesco a rimuovere"
4. **Fornisci una raccomandazione**: "Suggerisco l'isolamento immediato del server"
5. **Usa il canale corretto**: telefono per urgenze, ticket per situazioni gestibili

---

## 🔒 Chain of Custody e Preservazione delle Prove

### Cos'è la Chain of Custody

La **Chain of Custody (Catena di Custodia)** è la documentazione completa e cronologica di **chi ha avuto accesso alle evidenze** digitali, **quando** e **cosa ne ha fatto**. Garantisce che le prove siano **ammissibili in tribunale** e non siano state alterate.

### Principi Fondamentali

1. **Identificazione**: catalogare ogni evidenza con un ID univoco
2. **Raccolta**: acquisire le evidenze in modo forensicamente corretto
3. **Preservazione**: proteggere le evidenze da alterazione o distruzione
4. **Documentazione**: registrare ogni trasferimento e accesso

### Regole per la Preservazione delle Prove

| Regola | Dettaglio |
|---|---|
| **Non spegnere il computer** | La RAM contiene processi attivi, connessioni di rete, chiavi di cifratura — si perdono con lo spegnimento |
| **Ordine di volatilità** | Acquisire prima i dati più volatili: registri CPU → RAM → stato rete → file system → log → backup |
| **Forensic copy** | Creare una copia bit-for-bit del disco (non una semplice copia file) usando tool come `dd`, FTK Imager |
| **Hash di verifica** | Calcolare l'hash (MD5 + SHA-256) dell'evidenza originale e della copia per verificarne l'integrità |
| **Non lavorare sull'originale** | Tutte le analisi si fanno sulla copia, mai sull'originale |
| **Write blocker** | Usare un write blocker hardware/software quando si collega un disco sospetto |
| **Documentare tutto** | Chi ha raccolto l'evidenza, quando, come, dove è stata conservata |

### Esempio di Documentazione Chain of Custody

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EVIDENZA: Hard Disk Server FILE-SRV01
ID: EV-2024-00142-001
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Descrizione: Hard Disk WD 1TB, S/N: WD-WMAZA1234567
Hash MD5 originale: a1b2c3d4e5f6...
Hash SHA-256 originale: 7890abcdef...

REGISTRO TRASFERIMENTI:
─────────────────────────────────────────────
Data/Ora         | Da            | A              | Motivo
2024-01-15 15:00 | In-situ       | L.Rossi (IR)   | Acquisizione
2024-01-15 15:30 | L.Rossi (IR)  | Lab Forensic   | Analisi
2024-01-16 09:00 | Lab Forensic  | L.Rossi (IR)   | Restituzione
2024-01-16 09:30 | L.Rossi (IR)  | Cassaforte B2  | Conservazione

Note: Forensic copy creata alle 15:15. Hash verificato: ✓ match
```

---

## 📢 Comunicazione Durante un Incidente

### Principi di Comunicazione

| Principio | Dettaglio |
|---|---|
| **Need-to-know** | Condividere informazioni solo con chi deve saperle |
| **Canale sicuro** | Non usare email aziendale se potrebbe essere compromessa — usare canali alternativi (Signal, telefono) |
| **Tempestività** | Aggiornamenti regolari anche se non ci sono novità ("Still investigating, no new findings") |
| **Chiarezza** | Evitare gergo tecnico con il management — parlare di impatto business |
| **Documentazione** | Ogni comunicazione importante va registrata nel ticket |

### Chi Comunicare e Quando

| Destinatario | Quando | Cosa Comunicare |
|---|---|---|
| **Team SOC** | Subito | Dettagli tecnici, IoC, azioni richieste |
| **SOC Manager** | Entro 15-30 min per P1/P2 | Situazione, impatto, azioni in corso |
| **CISO** | Per P1, entro 1 ora | Impatto business, rischi, decisioni necessarie |
| **IT Operations** | Se servono azioni IT | Sistemi da isolare/ripristinare |
| **Management** | Per P1/P2 | Impatto business, timeline prevista |
| **Legale** | Se data breach con dati personali | Obblighi di notifica (GDPR: 72h) |
| **PR/Comunicazione** | Se può diventare pubblico | Preparare comunicato stampa |
| **Clienti/Utenti** | Se i loro dati sono coinvolti | Notifica trasparente e tempestiva |

### Template di Comunicazione — Aggiornamento Incidente

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
AGGIORNAMENTO INCIDENTE - INC-2024-00142
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Severità: P1 - Critical
Stato: In corso — Fase di Contenimento

SITUAZIONE ATTUALE:
Ransomware identificato su 3 server dell'ambiente di produzione.
I file sono stati cifrati. Nessuna evidenza di exfiltration al momento.

IMPATTO:
- Servizio X non disponibile per i clienti
- Tempo stimato di ripristino: 4-6 ore

AZIONI INTRAPRESE:
- Server isolati dalla rete alle 14:35 UTC
- Backup verificati — ultimo backup pulito: 14:00 UTC
- Forensic copy in corso

PROSSIMI PASSI:
- Completare l'analisi forense
- Avviare il ripristino da backup
- Identificare il vettore di ingresso

PROSSIMO AGGIORNAMENTO: 16:00 UTC
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 🎯 Domande da Colloquio

### D1: Descrivi le fasi dell'Incident Response secondo il framework NIST.

**Risposta**: Il NIST SP 800-61 definisce 4 fasi principali:
1. **Preparazione**: creare il piano IR, formare il team, implementare strumenti di detection, creare playbook e stabilire le procedure
2. **Rilevamento e Analisi**: identificare potenziali incidenti tramite alert SIEM, segnalazioni utenti o threat intelligence. Il triage determina se è un vero incidente e ne classifica la severità
3. **Contenimento, Eradicazione e Recovery**: contenere la minaccia (isolamento, blocco), rimuovere completamente l'attaccante (eradicazione), e ripristinare i sistemi alla normalità con monitoraggio intensivo
4. **Post-Incident Activity**: Lessons Learned — analizzare cosa è successo, cosa ha funzionato, cosa migliorare. Aggiornare documentazione e procedure

Il processo è **ciclico**: le lezioni apprese migliorano la preparazione per il prossimo incidente.

---

### D2: Qual è la differenza tra un evento di sicurezza e un incidente di sicurezza?

**Risposta**: Un **evento di sicurezza** è qualsiasi osservazione identificabile in un sistema — un login, un alert del firewall, un accesso a un file. Sono migliaia al giorno e la maggior parte sono benigni. Un **incidente di sicurezza** è un evento che viola le policy di sicurezza o rappresenta una minaccia concreta per la confidenzialità, integrità o disponibilità dei dati. Per esempio, un login fallito è un evento; 500 login falliti in 5 minuti sullo stesso account seguiti da un login riuscito è un incidente (brute force con successo). Il lavoro del SOC Analyst è fare il **triage** degli eventi per identificare quelli che costituiscono veri incidenti.

---

### D3: Come classifichi la severità di un incidente?

**Risposta**: Classifico la severità in base a diversi fattori:
- **Sistemi coinvolti**: un ransomware sul domain controller è P1, un adware su una workstation è P4
- **Dati coinvolti**: dati personali/finanziari → severità più alta
- **Diffusione**: un singolo host vs 50 host coinvolti
- **Tipo di minaccia**: APT > ransomware > malware generico
- **Impatto operativo**: servizi business-critical impattati?
- **Compliance**: dati regolamentati coinvolti (GDPR)?

Uso una scala P1-P4: **P1 (Critical)** richiede risposta immediata 24/7, **P2 (High)** risposta entro 1-2 ore, **P3 (Medium)** entro 4-8 ore, **P4 (Low)** entro 24 ore.

---

### D4: Descrivi cosa faresti come SOC Analyst se un utente segnala un'email di phishing.

**Risposta**: Seguirei il playbook di risposta al phishing:
1. **Raccolgo informazioni**: chiedo all'utente se ha cliccato su link o allegati, se ha inserito credenziali
2. **Analizzo l'email**: verifico header (mittente reale vs display), URL (su VirusTotal, URLScan.io), allegati (sandbox analysis)
3. **Se non ha cliccato**: blocco mittente/dominio nel gateway email, cerco se altri utenti hanno ricevuto la stessa email, rimuovo le copie non lette
4. **Se ha cliccato ma non ha inserito credenziali**: scansione EDR completa dell'endpoint, verifico proxy log per connessioni post-click, monitoro per IoC
5. **Se ha inserito credenziali**: reset password immediato, revoca sessioni attive, verifico MFA, controllo login recenti nel SIEM, verifico regole email (forwarding sospetto)
6. **Containment**: blocco URL/dominio nel proxy, aggiorno IoC nel SIEM
7. **Documento** tutto nel ticket con timestamp e ringrazio l'utente per la segnalazione

---

### D5: Qual è la differenza tra contenimento a breve termine e a lungo termine?

**Risposta**: Il **contenimento a breve termine** è l'azione immediata per fermare la diffusione della minaccia: isolamento di rete dell'host compromesso (senza spegnerlo!), blocco dell'IP malevolo nel firewall, disabilitazione dell'account compromesso. È una "benda" temporanea.

Il **contenimento a lungo termine** mira a stabilizzare l'ambiente in modo duraturo: patching della vulnerabilità sfruttata, cambio password di tutti gli account potenzialmente compromessi, implementazione di regole firewall permanenti, eventuale reimaging dei sistemi. È la "cura" definitiva.

La regola critica è **preservare le evidenze** prima di qualsiasi azione distruttiva — fare un forensic copy prima di reimagare un sistema.

---

### D6: Cos'è la Chain of Custody e perché è importante nell'IR?

**Risposta**: La **Chain of Custody** è la documentazione completa e cronologica di chi ha avuto accesso alle evidenze digitali, quando e cosa ne ha fatto. È importante perché:
- Garantisce che le prove siano **ammissibili in tribunale** se l'incidente porta a un'azione legale
- Dimostra che le evidenze **non sono state alterate** durante la raccolta e l'analisi
- Crea un record **verificabile** di ogni passaggio di mano

In pratica: calcolo l'hash (MD5 + SHA-256) dell'evidenza originale, creo una copia bit-for-bit (mai lavorare sull'originale), registro ogni trasferimento con data/ora/persona/motivo, e conservo tutto in modo sicuro. Uso write blocker quando collego dischi sospetti e rispetto l'ordine di volatilità nell'acquisizione (RAM prima, disco dopo).

---

### D7: Cosa sono playbook e runbook e qual è la differenza?

**Risposta**: Un **playbook** è un documento strategico-operativo che guida la risposta a un tipo specifico di incidente (es. "Playbook Phishing"). Include decision trees, criteri di classificazione, quando escalare. Richiede giudizio da parte dell'analista.

Un **runbook** è una procedura passo-passo molto dettagliata per un task specifico (es. "Come bloccare un dominio nel proxy Zscaler"). Include comandi esatti da eseguire ed è facilmente automatizzabile.

La differenza chiave: il playbook ti dice **cosa decidere**, il runbook ti dice **come eseguire**. In una risposta a phishing, il playbook mi guida nelle decisioni (l'utente ha cliccato? Ha inserito credenziali?), mentre il runbook mi dice esattamente come resettare la password in Active Directory o come bloccare un dominio nel proxy.

---

### D8: Cosa fai nella fase di Lessons Learned e perché è importante?

**Risposta**: La fase di Lessons Learned è il meeting post-incidente (idealmente entro 1-2 settimane) dove il team analizza:
- **Cosa è successo**: timeline completa, vettore di attacco, impatto
- **Come è stato rilevato**: era un alert automatico o una segnalazione? Il MTTD era accettabile?
- **Efficacia della risposta**: cosa ha funzionato bene? Dove abbiamo avuto difficoltà?
- **Gap identificati**: mancavano strumenti, procedure, formazione?
- **Azioni correttive**: nuove regole SIEM, hardening, formazione utenti, aggiornamento playbook

È la fase più sottovalutata ma è fondamentale perché trasforma ogni incidente in un'opportunità di miglioramento. Senza Lessons Learned, si rischia di commettere gli stessi errori. Il report finale diventa parte della knowledge base del team.

---

### D9: Come gestiresti la comunicazione durante un incidente ransomware P1?

**Risposta**: In un incidente P1 come un ransomware, la comunicazione è critica:
1. **Canale sicuro**: se sospetto compromissione email, uso canali alternativi (Signal, telefono)
2. **Notifica immediata al SOC Manager** con: cosa sappiamo, quanti sistemi sono coinvolti, impatto sui servizi
3. **Escalation al CISO** entro 1 ora con impatto business e decisioni richieste
4. **Aggiornamenti regolari**: ogni 30-60 minuti, anche se non ci sono novità, usando un template strutturato
5. **Coinvolgo IT Operations** per le azioni di isolamento e ripristino
6. **Coinvolgo il Legale** se ci sono dati personali coinvolti (GDPR: notifica entro 72h)
7. **Principio need-to-know**: non diffondo dettagli tecnici a chi non ne ha bisogno
8. **Documento** ogni comunicazione nel ticket con timestamp

La regola fondamentale: con il management parlo di **impatto business**, con il team tecnico parlo di **dettagli tecnici**.

---

### D10: Perché non si deve spegnere un computer durante un'indagine forense?

**Risposta**: Spegnere il computer significa perdere tutte le evidenze volatili contenute nella **RAM**:
- **Processi attivi**: il malware in esecuzione, le connessioni con il C2
- **Connessioni di rete**: IP e porte attive, sessioni stabilite
- **Chiavi di cifratura**: nel caso di ransomware, le chiavi potrebbero essere ancora in memoria
- **Credenziali**: password e token in cache
- **Clipboard**: dati copiati dall'utente
- **Comandi recenti**: command history in memoria

L'approccio corretto è: acquisire prima un **dump della RAM** (con tool come FTK Imager, WinPmem, o Volatility), poi procedere con l'acquisizione del disco. Si segue l'**ordine di volatilità**: prima i dati più volatili (registri CPU, RAM), poi quelli meno volatili (file system, log).

Eccezione: se il malware sta attivamente cifrando file (ransomware), **scollegare il cavo di rete** (non spegnere!) per fermarne la diffusione, e poi procedere con l'acquisizione.
