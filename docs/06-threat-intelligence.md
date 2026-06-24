# 🕵️ Threat Intelligence per SOC Analyst

> **Modulo 06** — Guida completa alla Threat Intelligence per la preparazione al colloquio SOC Analyst

---

## 📌 Cos'è la Threat Intelligence

La **Threat Intelligence (TI)** è l'insieme di informazioni raccolte, analizzate e contestualizzate sulle **minacce informatiche** attuali e potenziali. Non è una semplice lista di IP malevoli: è intelligenza **actionable** (utilizzabile) che aiuta a prendere decisioni di sicurezza informate.

> 💡 **Definizione Gartner**: "La Threat Intelligence è conoscenza basata su evidenze, inclusi contesto, meccanismi, indicatori, implicazioni e consigli actionable, riguardante una minaccia esistente o emergente per gli asset."

### Perché è Importante per un SOC Analyst

| Beneficio | Descrizione |
|---|---|
| **Proattività** | Permette di anticipare le minacce anziché solo reagire |
| **Contestualizzazione** | Trasforma un alert generico in un'indagine mirata |
| **Prioritizzazione** | Aiuta a decidere quali alert investigare per primi |
| **Detection migliorata** | Alimenta il SIEM con IoC per creare nuove regole |
| **Comprensione dell'avversario** | Conoscere le TTP dell'attaccante permette di difendersi meglio |

---

## 📊 I 4 Livelli della Threat Intelligence

| Livello | Destinatari | Contenuto | Esempio |
|---|---|---|---|
| **Strategica** | C-Suite, Board, CISO | Trend a lungo termine, motivazioni degli attaccanti, rischi geopolitici. Non tecnica. | "Il settore finanziario europeo è target primario di APT sponsorizzati dalla Russia nel 2024" |
| **Tattica** | SOC Manager, Security Architects | TTP degli attaccanti — come operano. Usata per migliorare le difese. | "Il gruppo APT28 usa spear-phishing con allegati .docm che sfruttano macro VBA per il delivery" |
| **Operativa** | SOC Analysts, IR Team | Informazioni su campagne specifiche in corso: chi, cosa, quando. | "Campagna attiva di phishing che impersona Microsoft 365 con domain login-microsoft365[.]xyz" |
| **Tecnica** | SOC Analysts, SIEM Engineers | IoC specifici: hash, IP, domini, URL, pattern. Altamente automatizzabile. | "Hash SHA-256: a1b2c3... — IP C2: 185.220.101.34 — Dominio: evil-domain[.]xyz" |

### Piramide del Dolore (Pyramid of Pain)

La **Pyramid of Pain** di David Bianco classifica gli indicatori per quanto è "doloroso" per l'attaccante cambiarli:

```
              ╱╲
             ╱  ╲
            ╱ TTP ╲           ← Molto difficile da cambiare
           ╱──────╲              L'attaccante deve cambiare
          ╱ Strumenti╲           il suo intero approccio
         ╱────────────╲
        ╱  Artefatti   ╲      ← Moderatamente difficile
       ╱  di Rete       ╲
      ╱──────────────────╲
     ╱ Artefatti Host     ╲   ← Cambiabili con sforzo
    ╱──────────────────────╲
   ╱   Nomi di Dominio     ╲  ← Relativamente facile
  ╱──────────────────────────╲
 ╱     Indirizzi IP          ╲ ← Facile da cambiare
╱──────────────────────────────╲
╲        Hash Values           ╱ ← Triviale (1 bit = hash diverso)
 ╲────────────────────────────╱
```

> 💡 **Lezione chiave**: concentrarsi sulle **TTP** (livello più alto della piramide) è più efficace che bloccare singoli hash o IP, perché forzare l'attaccante a cambiare le sue tattiche è molto più costoso per lui.

---

## 🗺️ MITRE ATT&CK Framework

### Cos'è MITRE ATT&CK

**MITRE ATT&CK** (Adversarial Tactics, Techniques, and Common Knowledge) è una **knowledge base** globale e pubblica che cataloga le **tattiche e tecniche** utilizzate dagli attaccanti reali nel mondo cyber. È basata su osservazioni del mondo reale.

Non è uno strumento, è un **linguaggio comune** per descrivere il comportamento degli attaccanti.

### Come è Strutturato

| Concetto | Descrizione | Esempio |
|---|---|---|
| **Tattica** | Il **perché** — l'obiettivo dell'attaccante in quella fase | Initial Access (ottenere l'accesso iniziale) |
| **Tecnica** | Il **come** — il metodo usato per raggiungere l'obiettivo | Phishing (T1566) |
| **Sub-Tecnica** | Variante specifica della tecnica | Spearphishing Attachment (T1566.001) |
| **Procedura** | L'**implementazione specifica** da parte di un attore | APT28 usa email con allegati .docm con macro VBA |

### Le 14 Tattiche di MITRE ATT&CK (Enterprise)

| # | Tattica | ID | Descrizione | Tecniche Comuni |
|---|---|---|---|---|
| 1 | **Reconnaissance** | TA0043 | Raccolta informazioni sulla vittima prima dell'attacco | Scanning attivo (T1595), ricerca informazioni su target (T1589), raccolta da fonti aperte OSINT (T1593) |
| 2 | **Resource Development** | TA0042 | Preparazione dell'infrastruttura di attacco | Acquisto domini (T1583), creazione account (T1585), sviluppo malware (T1587) |
| 3 | **Initial Access** | TA0001 | Ottenere l'accesso iniziale alla rete della vittima | Phishing (T1566), exploit di servizi esposti (T1190), drive-by compromise (T1189), supply chain compromise (T1195) |
| 4 | **Execution** | TA0002 | Eseguire codice malevolo sul sistema target | PowerShell (T1059.001), Windows Command Shell (T1059.003), scheduled task (T1053), user execution — doppio click su file (T1204) |
| 5 | **Persistence** | TA0003 | Mantenere l'accesso al sistema anche dopo riavvii | Registry run keys (T1547.001), scheduled task (T1053), account creation (T1136), servizi (T1543) |
| 6 | **Privilege Escalation** | TA0004 | Ottenere privilegi più elevati | Exploit di vulnerabilità locali (T1068), bypass UAC (T1548.002), token manipulation (T1134) |
| 7 | **Defense Evasion** | TA0005 | Evitare il rilevamento da parte dei sistemi di sicurezza | Disabilitare AV/EDR (T1562), obfuscation (T1027), process injection (T1055), log deletion (T1070) |
| 8 | **Credential Access** | TA0006 | Rubare credenziali | Dumping LSASS (T1003), keylogging (T1056), brute force (T1110), Kerberoasting (T1558.003) |
| 9 | **Discovery** | TA0007 | Esplorare l'ambiente per capire cosa c'è | Network discovery (T1046), system info discovery (T1082), account discovery (T1087), file/directory discovery (T1083) |
| 10 | **Lateral Movement** | TA0008 | Muoversi all'interno della rete verso altri sistemi | RDP (T1021.001), SMB/Windows Admin Shares (T1021.002), PsExec (T1570), pass-the-hash (T1550.002) |
| 11 | **Collection** | TA0009 | Raccogliere i dati di interesse | Screen capture (T1113), data from local system (T1005), email collection (T1114), clipboard data (T1115) |
| 12 | **Command and Control (C2)** | TA0011 | Comunicare con i sistemi compromessi | HTTPS (T1071.001), DNS tunneling (T1071.004), proxy (T1090), encrypted channel (T1573) |
| 13 | **Exfiltration** | TA0010 | Estrarre dati dalla rete della vittima | Exfiltration over C2 channel (T1041), over web service — cloud storage (T1567), over alternative protocol (T1048) |
| 14 | **Impact** | TA0040 | Causare danni o interruzioni | Data encryption — ransomware (T1486), data destruction (T1485), defacement (T1491), DoS (T1498) |

### Come Usare ATT&CK Navigator

**ATT&CK Navigator** è un tool web che permette di visualizzare e annotare la matrice ATT&CK in modo interattivo.

**Uso pratico per un SOC Analyst**:

1. **Mappare la copertura di detection**: colorare le tecniche per cui il SOC ha regole di detection → identificare i gap
2. **Mappare un incidente**: durante l'IR, evidenziare le tecniche usate dall'attaccante sulla matrice
3. **Confrontare threat actor**: sovrapporre le TTP di diversi gruppi per capire chi potrebbe essere l'attaccante
4. **Pianificare le difese**: identificare le tecniche non coperte e creare nuove regole SIEM

**Come accedere**: https://mitre-attack.github.io/attack-navigator/

```
Esempio pratico:
1. Apri ATT&CK Navigator
2. Crea un nuovo layer
3. Cerca la tecnica "Phishing" (T1566)
4. Assegna un colore rosso (tecnica usata dall'attaccante)
5. Ripeti per tutte le tecniche identificate durante l'incidente
6. Esporta il layer come immagine per il report
```

### Come un SOC Analyst Usa MITRE ATT&CK nel Lavoro Quotidiano

| Attività | Come Usa ATT&CK |
|---|---|
| **Triage di alert** | L'alert corrisponde a quale tecnica ATT&CK? Questo mi aiuta a capire cosa l'attaccante sta cercando di fare |
| **Investigation** | Se ho identificato T1059.001 (PowerShell), cerco altre tecniche tipicamente associate (T1003 credential dumping, T1055 injection) |
| **Threat Hunting** | Cerco proattivamente le tecniche nella matrice che non generano alert ma potrebbero essere in uso |
| **Report** | Uso il linguaggio ATT&CK per descrivere l'incidente: "L'attaccante ha usato T1566.001 per Initial Access, T1059.001 per Execution, T1003 per Credential Access" |
| **Gap Analysis** | Quale percentuale delle tecniche ATT&CK copriamo con le nostre regole SIEM? Dove sono i buchi? |
| **Tuning SIEM** | Creo regole di detection mappate sulle tecniche ATT&CK per avere una copertura sistematica |

---

## ⛓️ Cyber Kill Chain di Lockheed Martin

### Le 7 Fasi

La **Cyber Kill Chain** è un modello creato da Lockheed Martin che descrive le fasi sequenziali di un attacco informatico. L'idea è che interrompendo la catena in qualsiasi punto si ferma l'attacco.

### Fase 1: Reconnaissance (Ricognizione)

**Cosa fa l'attaccante**: Raccoglie informazioni sulla vittima prima di lanciare l'attacco.

**Attività tipiche**:
- Scansione di porte e servizi (Nmap)
- Ricerca su LinkedIn di dipendenti target
- Raccolta indirizzi email aziendali
- Ricerca di sottodomini e tecnologie usate (Shodan, Censys)
- Google dorking per file esposti

**Come difendersi**:
- Minimizzare le informazioni pubbliche
- Monitorare chi cerca informazioni sull'organizzazione
- Limitare le informazioni sui social media aziendali
- Usare servizi di brand monitoring e attack surface management

### Fase 2: Weaponization (Armamento)

**Cosa fa l'attaccante**: Crea il payload malevolo accoppiando una vulnerabilità con un vettore di consegna.

**Attività tipiche**:
- Creazione di un documento Office con macro malevola
- Preparazione di un exploit kit
- Sviluppo di malware personalizzato
- Creazione di siti web di phishing

**Come difendersi**:
- Questa fase avviene lato attaccante, difficile da rilevare direttamente
- Threat intelligence per conoscere le armi usate dai gruppi noti
- Analisi di malware di campagne precedenti

### Fase 3: Delivery (Consegna)

**Cosa fa l'attaccante**: Invia il payload alla vittima.

**Vettori comuni**:
- Email di phishing con allegato
- Link a sito web malevolo
- USB drive infetto
- Watering hole attack (compromissione di siti visitati dalla vittima)
- Supply chain compromise

**Come difendersi**:
- Email gateway con filtri anti-phishing
- Sandboxing degli allegati
- Web proxy con URL filtering
- Formazione utenti (security awareness)
- Disabilitare autorun USB

### Fase 4: Exploitation (Sfruttamento)

**Cosa fa l'attaccante**: Sfrutta una vulnerabilità per eseguire codice sul sistema della vittima.

**Metodi comuni**:
- Esecuzione di macro in documenti Office
- Exploit di vulnerabilità browser
- Exploit di vulnerabilità software non patchato
- Social engineering (l'utente esegue il malware)

**Come difendersi**:
- Patch management regolare
- Disabilitare le macro di Office per default
- Application whitelisting
- DEP, ASLR (protezioni OS)
- EDR per rilevamento comportamentale

### Fase 5: Installation (Installazione)

**Cosa fa l'attaccante**: Installa un meccanismo di persistenza sul sistema compromesso.

**Metodi comuni**:
- Installazione di un RAT (Remote Access Trojan)
- Aggiunta di chiavi nel registro (Run keys)
- Creazione di scheduled task
- Installazione di un servizio Windows
- Web shell su server web

**Come difendersi**:
- EDR con monitoraggio della persistenza
- Monitoraggio Event ID 7045 (servizi installati)
- Monitoraggio modifiche a chiavi di registro di avvio
- Application whitelisting
- File Integrity Monitoring (FIM)

### Fase 6: Command and Control (C2)

**Cosa fa l'attaccante**: Stabilisce un canale di comunicazione con il sistema compromesso per controllarlo da remoto.

**Metodi comuni**:
- Comunicazione HTTPS (si nasconde nel traffico legittimo)
- DNS tunneling
- Comunicazione via social media o servizi cloud legittimi
- Beaconing periodico (connessioni a intervalli regolari)

**Come difendersi**:
- Monitoraggio connessioni outbound anomale
- DNS monitoring e logging
- SSL/TLS inspection nel proxy
- Rilevamento di beaconing (connessioni periodiche allo stesso IP/dominio)
- Threat intelligence feed per bloccare domini/IP C2 noti

### Fase 7: Actions on Objectives (Azioni sugli Obiettivi)

**Cosa fa l'attaccante**: Raggiunge il suo obiettivo finale.

**Obiettivi comuni**:
- Esfiltrazione di dati (data breach)
- Cifratura dei file (ransomware)
- Distruzione di dati
- Spionaggio a lungo termine
- Uso dell'infrastruttura per attaccare altri target

**Come difendersi**:
- DLP (Data Loss Prevention)
- Monitoraggio trasferimenti dati anomali
- Segmentazione di rete
- Backup regolari e testati
- Encryption dei dati sensibili a riposo

### Tabella Riassuntiva: Kill Chain con Difese

| Fase | Attaccante | Difensore | Strumenti |
|---|---|---|---|
| Reconnaissance | Raccoglie info | Minimizzare esposizione | Attack surface management, OSINT monitoring |
| Weaponization | Crea il payload | Threat intelligence | Feed TI, analisi malware |
| Delivery | Consegna il payload | Bloccare la consegna | Email gateway, proxy, awareness |
| Exploitation | Sfrutta vulnerabilità | Hardening e patching | Patch management, EDR |
| Installation | Crea persistenza | Monitorare la persistenza | EDR, FIM, SIEM (Event 7045) |
| C2 | Comunica con il malware | Rilevare la comunicazione | Proxy, DNS monitoring, NTA |
| Actions on Objectives | Raggiunge l'obiettivo | Proteggere i dati | DLP, backup, segmentazione |

---

## 🔍 IoC — Indicators of Compromise

### Cosa Sono

Gli **IoC (Indicators of Compromise)** sono artefatti forensi osservabili che indicano che un sistema è stato **già compromesso**. Sono evidenze "post-intrusione".

### Tipi di IoC

| Tipo | Descrizione | Esempio |
|---|---|---|
| **Hash** (MD5, SHA-1, SHA-256) | Impronta digitale univoca di un file malevolo | `a1b2c3d4e5f6789...` |
| **Indirizzo IP** | IP di server C2, sorgenti di attacco | `185.220.101.34` |
| **Nome di Dominio** | Domini malevoli usati per phishing o C2 | `login-microsoft365[.]xyz` |
| **URL** | URL completi che puntano a payload o pagine di phishing | `https://evil[.]com/payload.exe` |
| **Indirizzo Email** | Mittenti di campagne di phishing | `support@microsoft-verify[.]com` |
| **Chiavi di registro** | Chiavi create per la persistenza | `HKLM\...\Run\malware_svc` |
| **Mutex** | Nomi di mutex creati dal malware | `Global\SecurityUpdate_2024` |
| **User-Agent** | Stringhe User-Agent anomale usate dal malware | `Mozilla/5.0 (compatible; EvilBot/1.0)` |
| **Pattern di rete** | Pattern di traffico anomali (beaconing, DNS queries) | Connessioni ogni 60 secondi esatti verso un IP |

### Dove Trovare gli IoC

| Piattaforma | Tipo | URL |
|---|---|---|
| **VirusTotal** | Analisi file, URL, IP, domini | virustotal.com |
| **AlienVault OTX** | Feed IoC della community | otx.alienvault.com |
| **AbuseIPDB** | Database IP malevoli | abuseipdb.com |
| **URLScan.io** | Analisi URL e screenshot | urlscan.io |
| **Shodan** | Motore di ricerca per dispositivi connessi | shodan.io |
| **MISP** | Piattaforma open-source di sharing TI | misp-project.org |
| **ThreatFox** | IoC database di abuse.ch | threatfox.abuse.ch |
| **MalwareBazaar** | Repository campioni malware | bazaar.abuse.ch |
| **CERT nazionali** | Alert e IoC specifici per il paese | es. CSIRT Italia |

---

## 🎯 IoA — Indicators of Attack

### Cosa Sono

Gli **IoA (Indicators of Attack)** sono pattern di comportamento che indicano che un attacco è **in corso**. A differenza degli IoC, non sono artefatti statici ma **comportamenti** osservabili in tempo reale.

### Differenza tra IoC e IoA

| Aspetto | IoC (Indicators of Compromise) | IoA (Indicators of Attack) |
|---|---|---|
| **Quando** | Post-compromissione | Durante l'attacco |
| **Cosa** | Artefatti statici (hash, IP, domini) | Comportamenti e pattern |
| **Natura** | Reattivi — il danno è già fatto | Proattivi — possono prevenire il danno |
| **Durata di validità** | Limitata — l'attaccante cambia facilmente | Più duratura — le TTP cambiano lentamente |
| **Esempio** | Hash del malware, IP del C2 | PowerShell che scarica ed esegue da Internet, processo figlio anomalo di Word.exe |

### Esempi di IoA

| IoA | Possibile Attacco |
|---|---|
| `WINWORD.EXE` → spawna `cmd.exe` → spawna `powershell.exe` | Macro malevola in documento Office |
| Connessioni DNS verso domini con alta entropia | DNS tunneling / DGA (Domain Generation Algorithm) |
| 500 login falliti in 5 minuti sullo stesso account | Brute force |
| Un utente accede a 50 server in 10 minuti | Lateral movement automatizzato |
| Processo `svchost.exe` lanciato da una directory diversa da `C:\Windows\System32` | Malware che impersona un processo di sistema |
| Copia massiva di file verso una condivisione di rete | Possibile staging pre-exfiltration |

> 💡 **Best practice**: un SOC maturo monitora sia IoC (reattivi) sia IoA (proattivi). Gli IoA sono più efficaci perché rilevano anche minacce sconosciute (zero-day).

---

## 💎 Diamond Model of Intrusion Analysis

### Cos'è

Il **Diamond Model** è un framework analitico che descrive ogni intrusione come un insieme di 4 elementi fondamentali collegati tra loro. È stato sviluppato per aiutare gli analisti a strutturare e correlare le informazioni sugli attacchi.

### I 4 Vertici del Diamante

```
                  Adversary
                     ╱╲
                    ╱  ╲
                   ╱    ╲
                  ╱      ╲
     Capability──╱        ╲──Infrastructure
                 ╲        ╱
                  ╲      ╱
                   ╲    ╱
                    ╲  ╱
                     ╲╱
                   Victim
```

| Vertice | Descrizione | Esempio |
|---|---|---|
| **Adversary** | Chi sta attaccando — l'attore della minaccia | APT28 (Fancy Bear), gruppo ransomware LockBit |
| **Capability** | Cosa usa per attaccare — strumenti e tecniche | Malware personalizzato, exploit CVE-2024-XXXX, Cobalt Strike |
| **Infrastructure** | Attraverso cosa attacca — infrastruttura usata | Server C2 (IP: 185.x.x.x), dominio di phishing, VPN bulletproof |
| **Victim** | Chi viene attaccato — il target | Azienda X, settore finanziario, utente specifico |

### Assi del Diamante

- **Asse Adversary-Victim** (socio-politico): la relazione tra attaccante e vittima (motivazione)
- **Asse Capability-Infrastructure** (tecnico): la relazione tra gli strumenti e l'infrastruttura usata

### Meta-Features

Oltre ai 4 vertici, il Diamond Model include meta-features:
- **Timestamp**: quando è avvenuto l'evento
- **Phase**: in quale fase della kill chain si trova
- **Result**: successo o fallimento dell'azione
- **Direction**: vittima→attaccante o attaccante→vittima
- **Methodology**: tipo di attacco (phishing, exploitation, etc.)
- **Resources**: risorse utilizzate (software, hardware, fondi)

### Uso Pratico

Il Diamond Model aiuta a:
1. **Correlare eventi**: collegare diversi attacchi allo stesso attore basandosi su capability o infrastructure comune
2. **Pivotare**: partendo da un vertice noto (es. IP C2), scoprire gli altri (chi usa quell'IP? Che malware? Chi è il target?)
3. **Analisi di gruppo**: raggruppare intrusioni con elementi comuni per attribuirle a un threat actor

---

## 🛡️ TTP — Tactics, Techniques, and Procedures

### Definizione Dettagliata

| Componente | Livello | Descrizione | Esempio |
|---|---|---|---|
| **Tactics** | Strategico | Il **perché** — l'obiettivo dell'attaccante | Ottenere accesso iniziale, mantenere la persistenza |
| **Techniques** | Operativo | Il **come** — il metodo generale usato | Phishing, dumping di credenziali |
| **Procedures** | Tattico | L'**implementazione specifica** — il dettaglio operativo | APT28 invia email con allegati .docm che contengono macro VBA che scaricano Zebrocy |

### Perché le TTP Sono Importanti

Le TTP sono al **vertice della Pyramid of Pain** — sono la cosa più difficile da cambiare per un attaccante. Un attaccante può:
- Cambiare un hash in pochi secondi (ricompilazione)
- Cambiare un IP in pochi minuti (nuovo server)
- Cambiare un dominio in poche ore (nuovo acquisto)
- Ma cambiare le sue **TTP** richiede ripensare l'intera operazione

Quindi, creare detection basate sulle TTP (comportamentali) è molto più efficace che basarsi su IoC statici.

### Esempio Concreto di TTP

```
THREAT ACTOR: APT29 (Cozy Bear)

TACTIC: Initial Access (TA0001)
  TECHNIQUE: Phishing: Spearphishing Link (T1566.002)
    PROCEDURE: APT29 invia email ai dipendenti target con link 
    a pagine di login OAuth2 false per Microsoft 365

TACTIC: Execution (TA0002)
  TECHNIQUE: Command and Scripting Interpreter: PowerShell (T1059.001)
    PROCEDURE: Dopo aver ottenuto le credenziali, usa PowerShell per 
    scaricare ed eseguire EnvyScout dropper

TACTIC: Credential Access (TA0006)
  TECHNIQUE: OS Credential Dumping: LSASS Memory (T1003.001)
    PROCEDURE: Usa Mimikatz tramite PowerShell per estrarre 
    credenziali dal processo LSASS

TACTIC: Lateral Movement (TA0008)
  TECHNIQUE: Remote Services: SMB/Windows Admin Shares (T1021.002)
    PROCEDURE: Usa le credenziali ottenute per accedere a share 
    amministrativi (C$, ADMIN$) su altri server del dominio
```

---

## 🔧 Piattaforme e Fonti di Threat Intelligence

### VirusTotal

**Cosa fa**: Analizza file, URL, IP e domini contro 70+ motori antivirus e servizi di threat intelligence.

**Uso per un SOC Analyst**:
- Verificare un hash sospetto → quanti AV lo rilevano? Che malware è?
- Analizzare un URL/dominio da un'email di phishing → è malevolo?
- Controllare un IP sospetto nei log → è un C2 noto?
- Verificare le relazioni → un IP è associato a quali domini? Quali file ha servito?

```
Esempio: Alert SIEM per connessione verso IP 185.220.101.34
→ Cerco su VirusTotal → 15/90 vendor lo segnalano come malevolo
→ Associato a Cobalt Strike C2
→ Confermo: è un IoC valido, escalo l'incidente
```

### MISP (Malware Information Sharing Platform)

**Cosa fa**: Piattaforma open-source per la raccolta, condivisione e correlazione di IoC e threat intelligence tra organizzazioni.

**Funzionalità principali**:
- Database centralizzato di IoC
- Correlazione automatica tra eventi
- Sharing tra organizzazioni tramite MISP Sync
- Integrazione con SIEM, IDS, firewall
- Tassonomie e Galaxy per classificare le minacce

### OTX AlienVault (Open Threat Exchange)

**Cosa fa**: Community-driven threat intelligence platform. Chiunque può contribuire con "pulse" (raccolte di IoC relativi a una minaccia).

**Uso pratico**: sottoscrivi pulse relativi al tuo settore, integra i feed nel SIEM per alerting automatico.

### Shodan

**Cosa fa**: Motore di ricerca per dispositivi connessi a Internet. Indicizza banner di servizi, porte aperte, certificati SSL, versioni software.

**Uso per un SOC Analyst**:
- Verificare cosa espone la propria organizzazione su Internet
- Controllare se un IP sospetto è un server legittimo o sospetto
- Identificare dispositivi vulnerabili esposti

```
Esempio: Cerco l'IP di un server aziendale su Shodan
→ Scopro che espone una porta 9200 (Elasticsearch) senza autenticazione
→ Segnalo immediatamente per la remediation
```

### AbuseIPDB

**Cosa fa**: Database collaborativo di IP segnalati come malevoli (spam, hacking, scanning, etc.).

**Uso pratico**: 
- Verificare rapidamente se un IP nei log è stato segnalato da altri
- Controllare il "confidence score" — quanto è affidabile la segnalazione
- Contribuire segnalando IP malevoli che attaccano la nostra infrastruttura

### Tabella Riassuntiva Piattaforme TI

| Piattaforma | Tipo | Free? | Uso Principale |
|---|---|---|---|
| **VirusTotal** | Analisi file/URL/IP | Sì (limitato) | Verificare IoC, analisi malware |
| **MISP** | Sharing platform | Sì (self-hosted) | Condividere e correlare IoC |
| **OTX AlienVault** | Community TI | Sì | Feed IoC, pulse tematici |
| **Shodan** | Search engine | Sì (limitato) | Attack surface, recon |
| **AbuseIPDB** | IP reputation | Sì | Verificare IP malevoli |
| **URLScan.io** | URL analysis | Sì | Analizzare URL sospetti |
| **MalwareBazaar** | Malware samples | Sì | Download campioni per analisi |
| **ThreatFox** | IoC database | Sì | Feed IoC (botnet, malware C2) |
| **Censys** | Search engine | Sì (limitato) | Come Shodan, focus certificati |
| **GreyNoise** | Internet noise | Sì (limitato) | Distinguere scan di massa da attacchi mirati |

---

## 🎯 Domande da Colloquio

### D1: Cos'è la Threat Intelligence e quali sono i suoi livelli?

**Risposta**: La Threat Intelligence è l'insieme di informazioni raccolte, analizzate e contestualizzate sulle minacce informatiche che aiuta a prendere decisioni di sicurezza informate. Si divide in 4 livelli:
- **Strategica**: per il management — trend a lungo termine, rischi geopolitici (es. "il settore healthcare è target crescente di ransomware")
- **Tattica**: per security architects — TTP degli attaccanti, come operano e come difendersi
- **Operativa**: per il team SOC — informazioni su campagne specifiche in corso
- **Tecnica**: per analisti e SIEM — IoC specifici (hash, IP, domini) direttamente utilizzabili nelle regole di detection

Come SOC Analyst lavoro principalmente con TI operativa e tecnica, ma devo comprendere anche il livello tattico per migliorare le mie analisi.

---

### D2: Cos'è il MITRE ATT&CK e come lo usi nel tuo lavoro quotidiano?

**Risposta**: MITRE ATT&CK è una knowledge base pubblica che cataloga le tattiche e tecniche usate dagli attaccanti reali, organizzate in una matrice con 14 tattiche (dal Reconnaissance all'Impact).

Lo uso quotidianamente in diversi modi:
- **Triage degli alert**: quando analizzo un alert, lo mappo su ATT&CK per capire in quale fase dell'attacco siamo (es. un PowerShell sospetto = T1059.001, Execution)
- **Investigation**: se identifico una tecnica, cerco le tecniche tipicamente associate per capire cosa l'attaccante potrebbe fare dopo
- **Report**: uso il linguaggio ATT&CK per comunicare gli incidenti in modo standardizzato
- **Gap analysis**: confronto la nostra copertura di detection con la matrice per identificare dove siamo ciechi
- **ATT&CK Navigator**: lo uso per visualizzare la copertura e mappare gli incidenti

---

### D3: Spiega la Cyber Kill Chain e perché è utile per un difensore.

**Risposta**: La Cyber Kill Chain di Lockheed Martin descrive le 7 fasi sequenziali di un attacco:
1. **Reconnaissance**: raccolta informazioni sulla vittima
2. **Weaponization**: creazione del payload
3. **Delivery**: invio del payload (email, web, USB)
4. **Exploitation**: sfruttamento della vulnerabilità
5. **Installation**: creazione di persistenza
6. **C2**: stabilire comunicazione con il malware
7. **Actions on Objectives**: raggiungere l'obiettivo (exfiltration, ransomware)

È utile per un difensore perché: se interrompiamo la catena in **qualsiasi punto**, fermiamo l'attacco. Ci aiuta a pensare alle difese in modo strutturato: per ogni fase, quali controlli abbiamo? Dove siamo deboli? Per esempio, se blocchiamo bene la Delivery (email gateway, proxy), molti attacchi non arrivano nemmeno all'Exploitation.

---

### D4: Qual è la differenza tra IoC e IoA?

**Risposta**: Gli **IoC** (Indicators of Compromise) sono artefatti statici che indicano che un sistema è **già stato compromesso**: hash di malware, IP di C2, domini malevoli, chiavi di registro sospette. Sono reattivi — quando li trovi, il danno potrebbe già essere fatto.

Gli **IoA** (Indicators of Attack) sono pattern comportamentali che indicano che un attacco è **in corso**: Word.exe che spawna PowerShell, 500 login falliti in 5 minuti, connessioni DNS con alta entropia. Sono proattivi — possono rilevare l'attacco prima che si completi.

La differenza chiave è che gli IoC sono specifici e facilmente cambiabili dall'attaccante (un hash cambia con 1 bit), mentre gli IoA rilevano comportamenti che sono molto più difficili da modificare. Un SOC maturo usa entrambi: IoC per il rilevamento rapido di minacce note, IoA per il rilevamento comportamentale di minacce sconosciute.

---

### D5: Come verificheresti un IP sospetto trovato nei log?

**Risposta**: Seguirei un processo strutturato:
1. **VirusTotal**: cerco l'IP → quanti vendor lo segnalano? A quali campagne è associato? Che malware ha servito?
2. **AbuseIPDB**: verifico se è stato segnalato da altri → quante segnalazioni? Che tipo di abuso?
3. **Shodan/Censys**: verifico cosa espone quell'IP → è un server legittimo? Che servizi ha? Certificati SSL sospetti?
4. **OTX AlienVault**: cerco se appare in pulse di threat intelligence
5. **WHOIS**: chi è il proprietario? Quando è stato registrato? Hosting provider bulletproof?
6. **Geolocalizzazione**: il paese di origine è coerente con il contesto?
7. **Log interni**: cerco nel SIEM tutte le connessioni verso quell'IP → quali host interni ci hanno comunicato?
8. **Correlazione**: incrocio tutte le informazioni per determinare se è un vero indicatore o un falso positivo

---

### D6: Cos'è il Diamond Model e come si usa?

**Risposta**: Il Diamond Model è un framework analitico che descrive ogni intrusione attraverso 4 elementi fondamentali:
- **Adversary**: chi attacca (es. APT28)
- **Capability**: con cosa attacca (es. Cobalt Strike, exploit CVE-2024-XXXX)
- **Infrastructure**: attraverso cosa attacca (es. server C2, dominio di phishing)
- **Victim**: chi viene attaccato

Questi 4 vertici formano un diamante, e ogni intrusione è un'istanza di questo diamante.

Lo uso per **correlare** diversi incidenti: se due attacchi usano la stessa Infrastructure (stesso IP C2), probabilmente sono dello stesso Adversary. Oppure, se conosco l'Adversary e le sue Capability tipiche, posso cercare proattivamente la sua Infrastructure nei miei log. È utile anche per il **pivoting** durante un'investigazione: partendo da un vertice noto, scopro gli altri.

---

### D7: Cos'è la Pyramid of Pain e perché è importante?

**Risposta**: La Pyramid of Pain di David Bianco classifica gli indicatori di minaccia per quanto è "doloroso" per l'attaccante cambiarli:
- **Base (facile)**: Hash → cambia con 1 bit di modifica al file
- **IP Addresses** → cambia in minuti (nuovo server)
- **Domain Names** → cambia in ore (nuovo dominio)
- **Network/Host Artifacts** → richiede più sforzo
- **Tools** → deve cambiare strumenti
- **Vertice (molto doloroso)**: **TTP** → deve cambiare l'intero approccio operativo

È importante perché ci insegna che concentrare le difese sulle **TTP** (detection comportamentale) è molto più efficace che bloccare singoli hash o IP. Un attaccante può generare migliaia di hash diversi dello stesso malware, ma le sue TTP rimangono costanti. Per esempio, una regola che rileva "Word.exe → spawna → PowerShell.exe → scarica da Internet" è molto più duratura di una regola che blocca uno specifico hash di malware.

---

### D8: Descrivi 3 scenari in cui useresti VirusTotal nel tuo lavoro.

**Risposta**:

**Scenario 1 — Alert SIEM per hash sospetto**: l'EDR segnala un file con hash sconosciuto su una workstation. Cerco l'hash su VirusTotal: 45/70 vendor lo rilevano come "Trojan.GenericKD". Leggo il report: è un RAT noto. Confermo l'alert come true positive e avvio l'IR.

**Scenario 2 — Email di phishing con URL sospetto**: un utente segnala un'email con un link strano. Sottometto l'URL su VirusTotal: 8/90 vendor lo segnalano come phishing. Verifico la tab "Relations" → il dominio è stato registrato ieri. Verifico "Community" → altri analisti confermano la campagna. Blocco il dominio nel proxy e cerco chi altro ha cliccato.

**Scenario 3 — IP sospetto nei log del firewall**: noto connessioni outbound ripetitive verso un IP esterno. Lo cerco su VirusTotal: associato a Cobalt Strike C2 in 3 report di TI. Tab "Relations" mostra 5 domini associati. Blocco l'IP e tutti i domini, e investigo l'host che ci ha comunicato per verificare la compromissione.

---

### D9: Come confronteresti MITRE ATT&CK e la Cyber Kill Chain?

**Risposta**: I due framework sono complementari:

La **Cyber Kill Chain** è un modello **lineare sequenziale** con 7 fasi che descrive il flusso di un attacco dall'inizio alla fine. È utile per pensare alle difese "a strati" e per interrompere la catena il prima possibile. Limitazione: è troppo lineare e non copre bene le fasi post-compromissione.

**MITRE ATT&CK** è una **matrice granulare e non lineare** con 14 tattiche e centinaia di tecniche. Fornisce un livello di dettaglio molto maggiore, è basata su osservazioni reali, e riconosce che un attaccante può muoversi tra le tattiche in modo non sequenziale.

In pratica: uso la Kill Chain per spiegare il flusso generale di un attacco (utile per comunicare con il management), e ATT&CK per l'analisi tecnica dettagliata (mappare le tecniche specifiche, creare detection, analizzare gap). Molte organizzazioni mappano le fasi della Kill Chain sulle tattiche ATT&CK per avere il meglio di entrambi.

---

### D10: Come useresti la threat intelligence per fare threat hunting proattivo?

**Risposta**: Il threat hunting proattivo guidato dalla TI segue questo approccio:

1. **Consumo TI**: leggo report su campagne attive che potrebbero colpire il mio settore (es. report su nuovo ransomware che colpisce il settore finanziario)
2. **Estrazione TTP e IoC**: dal report estraggo le tecniche ATT&CK usate e gli IoC tecnici
3. **Formulazione ipotesi**: "Se questo attore ci ha preso di mira, dovremmo vedere [tecnica X] nei nostri log"
4. **Ricerca nel SIEM**: cerco proattivamente le TTP nei nostri log. Es. se il report dice che usano PowerShell con encoding Base64, cerco `powershell.exe -enc` nei log degli endpoint
5. **Ricerca IoC**: cerco gli IoC specifici (hash, IP, domini) in tutti i log storici
6. **Analisi risultati**: se trovo match, investigo immediatamente. Se non trovo nulla, documento la ricerca e creo regole di detection per il futuro
7. **Feedback loop**: le scoperte del threat hunting migliorano le regole SIEM e alimentano il ciclo di intelligence
