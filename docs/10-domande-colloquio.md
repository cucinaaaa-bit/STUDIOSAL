# 🎯 Domande da Colloquio SOC Analyst — Guida Completa

> **Obiettivo**: Preparazione completa a un colloquio per il ruolo di SOC Analyst (Tier 1/Tier 2).
> Ogni domanda è accompagnata da una risposta dettagliata con esempi pratici e, dove utile, tabelle riassuntive.

---

## 🧠 Domande Generali sul SOC

### 1. Cos'è un SOC e qual è il suo ruolo principale?

Un **Security Operations Center (SOC)** è un centro operativo dedicato al monitoraggio, alla rilevazione, all'analisi e alla risposta agli incidenti di sicurezza informatica di un'organizzazione. Funziona 24/7 e rappresenta la prima linea di difesa contro le minacce cyber.

Il SOC raccoglie dati da firewall, endpoint, SIEM, IDS/IPS, server e altre fonti, correlandoli per identificare attività sospette. L'obiettivo finale è **ridurre il tempo di rilevazione (MTTD)** e il **tempo di risposta (MTTR)** agli incidenti.

**Esempio pratico**: Un SOC riceve migliaia di alert giornalieri dal SIEM. Un analista nota un pattern di login falliti seguiti da un login riuscito da un IP sospetto → avvia un'indagine per possibile compromissione account.

---

### 2. Qual è la differenza tra i Tier del SOC?

| Tier | Ruolo | Responsabilità principali |
|------|-------|--------------------------|
| **Tier 1 — Triage Analyst** | Prima linea | Monitoraggio alert 24/7, triage iniziale, classificazione come vero/falso positivo, escalation |
| **Tier 2 — Incident Responder** | Analisi approfondita | Investigazione dettagliata degli incidenti escalati, analisi log avanzata, correlazione eventi, contenimento |
| **Tier 3 — Threat Hunter** | Proattivo | Threat hunting, analisi malware avanzata, sviluppo regole di detection, reverse engineering |
| **SOC Manager** | Leadership | Gestione team, definizione processi, reportistica al management, miglioramento continuo |

**Esempio pratico**: Il Tier 1 vede un alert per traffico anomalo verso un IP esterno → lo classifica come sospetto e lo escala al Tier 2 → il Tier 2 analizza i log del proxy, l'EDR e il SIEM, confermando comunicazione con un server C2 → il Tier 3 analizza il malware per capire il vettore d'ingresso e creare nuove firme di detection.

---

### 3. Cosa faresti come prima cosa iniziando un turno?

Una risposta strutturata dimostra professionalità:

1. **Handover / Passaggio di consegne**: Leggere le note del turno precedente, verificare incidenti aperti, escalation in corso e ticket pendenti
2. **Controllare la dashboard SIEM**: Verificare lo stato degli alert, eventuali picchi anomali, alert ad alta severità non ancora gestiti
3. **Controllare i canali di comunicazione**: Email del team, chat interne, bollettini di threat intelligence recenti
4. **Verificare lo stato dell'infrastruttura**: Controllare che tutti i sensori, gli agenti EDR e le fonti di log stiano inviando dati correttamente
5. **Prioritizzare**: Organizzare la coda di lavoro in base alla severità degli alert aperti

**Tip**: Menzionare il concetto di **"situational awareness"** — capire cosa sta succedendo prima di agire.

---

### 4. Come gestisci lo stress dei turni notturni e del lavoro su turni?

Questa è una domanda comportamentale. L'intervistatore vuole capire se sei consapevole delle sfide e hai strategie concrete:

- **Routine di sonno disciplinata**: Mantenere orari regolari anche nei giorni liberi, utilizzare blackout curtains
- **Preparazione mentale**: Avere una checklist di inizio turno per entrare subito nel flusso di lavoro
- **Gestione dell'energia**: Alimentazione bilanciata, evitare caffè nelle ultime ore del turno, brevi pause attive
- **Supporto del team**: Comunicazione aperta con i colleghi, rotazione equa dei turni più impegnativi
- **Focus sulla missione**: Sapere che il turno notturno è spesso quello in cui gli attaccanti sono più attivi (soprattutto da fusi orari diversi) dà motivazione extra

---

### 5. Qual è la differenza tra un evento, un alert e un incidente?

| Concetto | Definizione | Esempio |
|----------|------------|---------|
| **Evento (Event)** | Qualsiasi attività registrata nei log di un sistema | Un utente effettua il login con successo |
| **Alert** | Un evento che corrisponde a una regola di detection e richiede attenzione | 10 login falliti in 2 minuti generano un alert per possibile brute force |
| **Incidente (Incident)** | Un evento di sicurezza confermato che richiede una risposta formale | L'analisi dell'alert conferma che un account è stato compromesso e l'attaccante ha avuto accesso |

**Flusso**: Milioni di **eventi** → Il SIEM filtra e genera **alert** → L'analista investiga e conferma/smentisce → Se confermato, diventa un **incidente**.

---

### 6. Come prioritizzi gli alert quando ne hai molti contemporaneamente?

La prioritizzazione è una competenza chiave per evitare l'**alert fatigue**:

1. **Severità dell'alert**: Partire sempre dagli alert Critical/High prima dei Medium/Low
2. **Asset coinvolto**: Un alert su un Domain Controller o un server di produzione ha priorità più alta rispetto a una workstation utente
3. **Contesto di threat intelligence**: Se l'IoC associato è legato a una campagna attiva nota, sale la priorità
4. **Automazione**: Utilizzare playbook SOAR per chiudere automaticamente i falsi positivi noti
5. **Correlazione**: Se più alert sono correlati (stesso IP sorgente, stessa tecnica), potrebbero indicare un attacco in corso → priorità massima

| Priorità | Criterio | Esempio |
|----------|---------|---------|
| 🔴 Critica | Asset critico + IoC noto | Comunicazione C2 dal Domain Controller |
| 🟠 Alta | Alert ad alta severità | Brute force riuscito su account admin |
| 🟡 Media | Alert ripetuto non correlato | Scansione porte da IP esterno |
| 🟢 Bassa | Alert informativo | Policy violation per software non autorizzato |

---

### 7. Cos'è la CIA Triad e perché è fondamentale?

La **CIA Triad** è il modello base della sicurezza informatica:

- **Confidentiality (Riservatezza)**: Solo chi è autorizzato può accedere ai dati. Esempio: crittografia dei dati, controllo degli accessi (RBAC).
- **Integrity (Integrità)**: I dati non possono essere modificati senza autorizzazione. Esempio: hash dei file, firma digitale, controlli di versione.
- **Availability (Disponibilità)**: I sistemi e i dati devono essere accessibili quando necessario. Esempio: ridondanza, backup, protezione DDoS.

**Nel SOC**: Ogni incidente può essere classificato in base a quale pilastro della CIA viene violato. Un ransomware viola la **disponibilità**, un data breach viola la **riservatezza**, un defacement viola l'**integrità**.

---

### 8. Cos'è il MITRE ATT&CK Framework e come viene usato in un SOC?

**MITRE ATT&CK** è una knowledge base pubblica di tattiche, tecniche e procedure (TTP) utilizzate dagli attaccanti, basata su osservazioni reali.

**Struttura**:
- **Tattiche**: L'obiettivo dell'attaccante (es. Initial Access, Persistence, Lateral Movement)
- **Tecniche**: Come raggiunge l'obiettivo (es. Phishing, PowerShell Execution)
- **Sotto-tecniche**: Varianti specifiche (es. Spearphishing Attachment)

**Uso nel SOC**:
1. **Mappare gli alert**: Ogni regola di detection del SIEM viene mappata a una tecnica ATT&CK
2. **Gap analysis**: Identificare quali tecniche non abbiamo capacità di rilevare
3. **Threat intelligence**: Capire le TTP dei gruppi APT che potrebbero prendere di mira la nostra organizzazione
4. **Reporting**: Comunicare gli incidenti in un linguaggio standardizzato

**Esempio pratico**: Un alert rileva l'esecuzione di `certutil.exe` per scaricare un file → la mappiamo a **T1105 (Ingress Tool Transfer)** sotto la tattica **Command and Control**.

---

### 9. Cosa sono i falsi positivi e i falsi negativi? Quale è più pericoloso?

| Tipo | Definizione | Impatto |
|------|------------|---------|
| **Falso Positivo (FP)** | Un alert che segnala un'attività malevola che in realtà è legittima | Spreco di tempo per l'analista, alert fatigue |
| **Falso Negativo (FN)** | Un'attività malevola che NON viene rilevata | L'attaccante opera indisturbato, potenzialmente catastrofico |

**Il falso negativo è molto più pericoloso** perché rappresenta una minaccia attiva non rilevata. Tuttavia, troppi falsi positivi portano all'**alert fatigue**, che a sua volta può causare falsi negativi perché l'analista smette di prestare attenzione.

**Come ridurli**:
- **FP**: Tuning delle regole SIEM, whitelisting, arricchimento con contesto
- **FN**: Threat hunting proattivo, red teaming, aggiornamento continuo delle regole

---

### 10. Quali certificazioni sono rilevanti per un SOC Analyst?

| Certificazione | Ente | Livello | Focus |
|---------------|------|---------|-------|
| **CompTIA Security+** | CompTIA | Entry | Fondamenti di sicurezza, concetti chiave |
| **CompTIA CySA+** | CompTIA | Intermedio | Analisi delle minacce, monitoring, incident response |
| **BTL1 (Blue Team Level 1)** | Security Blue Team | Intermedio | SOC operations, SIEM, log analysis pratica |
| **SC-200** | Microsoft | Intermedio | Microsoft Sentinel, Defender, KQL |
| **CEH** | EC-Council | Intermedio | Ethical hacking, comprendere l'attaccante |
| **GCIH** | SANS/GIAC | Avanzato | Incident handling |
| **OSCP** | OffSec | Avanzato | Penetration testing pratico |

---

## 🌐 Domande di Networking

### 11. Spiega il three-way handshake TCP

Il **three-way handshake** è il processo con cui si stabilisce una connessione TCP affidabile tra client e server:

```
Client                    Server
  |                          |
  |--- SYN (seq=100) ------>|   1. "Voglio connettermi"
  |                          |
  |<-- SYN-ACK (seq=300,    |   2. "Ok, connessione accettata"
  |    ack=101) ------------|
  |                          |
  |--- ACK (seq=101,        |   3. "Confermo, iniziamo"
  |    ack=301) ----------->|
  |                          |
  |===== CONNESSIONE ======>|
```

1. **SYN**: Il client invia un pacchetto con flag SYN attivo e un sequence number iniziale
2. **SYN-ACK**: Il server risponde con SYN+ACK, confermando la ricezione e inviando il suo sequence number
3. **ACK**: Il client conferma e la connessione è stabilita

**Rilevanza SOC**: Un SYN scan (Nmap `-sS`) invia solo il primo SYN e non completa l'handshake — è una tecnica di ricognizione. Vedere migliaia di SYN senza ACK è un indicatore di scansione delle porte.

---

### 12. Qual è la differenza tra TCP e UDP?

| Caratteristica | TCP | UDP |
|---------------|-----|-----|
| **Connessione** | Connection-oriented (handshake) | Connectionless |
| **Affidabilità** | Garantisce consegna e ordine | Nessuna garanzia |
| **Velocità** | Più lento (overhead) | Più veloce |
| **Uso tipico** | HTTP/S, SSH, FTP, SMTP | DNS, VoIP, streaming, gaming |
| **Esempio porta** | 80 (HTTP), 443 (HTTPS), 22 (SSH) | 53 (DNS), 123 (NTP), 161 (SNMP) |

**Rilevanza SOC**:
- **TCP**: Il traffico può essere ricostruito (stream reassembly) per analisi forense
- **UDP**: Spesso usato per attacchi DDoS di amplificazione (DNS, NTP, memcached) e per tunneling DNS nascosto

---

### 13. Cos'è il DNS e come funziona?

Il **Domain Name System** è il "rubrica telefonica" di Internet: traduce nomi di dominio leggibili (es. `google.com`) in indirizzi IP (es. `142.250.180.46`).

**Processo di risoluzione DNS**:
1. L'utente digita `www.esempio.com` nel browser
2. Il browser controlla la **cache locale**
3. Se non trova nulla, chiede al **DNS Resolver** dell'ISP
4. Il resolver interroga i **Root Server** → **.com TLD Server** → **Authoritative DNS** di `esempio.com`
5. L'IP viene restituito e la pagina viene caricata

**Tipi di record DNS importanti per il SOC**:

| Record | Funzione | Uso SOC |
|--------|----------|---------|
| **A** | Dominio → IPv4 | Risoluzione base |
| **AAAA** | Dominio → IPv6 | Risoluzione IPv6 |
| **MX** | Mail server del dominio | Analisi email |
| **TXT** | Testo arbitrario (SPF, DKIM, DMARC) | Verifica autenticità email |
| **CNAME** | Alias di un dominio | Tracciamento infrastruttura |
| **NS** | Name server autoritativo | Investigazione domini malevoli |

**Rilevanza SOC**: Il DNS è uno dei vettori più abusati. Tecniche come il **DNS tunneling** nascondono dati nelle query DNS per esfiltrare informazioni o comunicare con server C2, bypassando firewall e proxy.

---

### 14. Quali porte dovresti monitorare e perché?

| Porta | Protocollo | Servizio | Perché monitorarla |
|-------|-----------|----------|-------------------|
| 21 | TCP | FTP | Trasferimento file non cifrato, spesso target di brute force |
| 22 | TCP | SSH | Accesso remoto, target di brute force, usato per tunneling |
| 23 | TCP | Telnet | Non cifrato, non dovrebbe essere in uso — se attivo, è un red flag |
| 25 | TCP | SMTP | Invio email, usato per spam e phishing |
| 53 | TCP/UDP | DNS | DNS tunneling, comunicazione C2 |
| 80 | TCP | HTTP | Traffico web non cifrato, web shells |
| 443 | TCP | HTTPS | Traffico cifrato — il volume anomalo può indicare exfiltration |
| 445 | TCP | SMB | Lateral movement (EternalBlue, PsExec) |
| 1433 | TCP | MSSQL | Accesso database, SQL injection |
| 3389 | TCP | RDP | Desktop remoto, brute force, molto abusato dagli attaccanti |
| 4444 | TCP | Metasploit default | Reverse shell — se vedi traffico qui, è un allarme |
| 5985/5986 | TCP | WinRM | Remote management PowerShell |
| 8080/8443 | TCP | HTTP alt / Proxy | Web app alternative, proxy, C2 |

**Tip da colloquio**: Non limitarti a elencare le porte. Spiega **perché** sono importanti e in che contesto le monitoreresti.

---

### 15. Cos'è il modello OSI e perché è importante per un SOC Analyst?

Il modello **OSI (Open Systems Interconnection)** suddivide la comunicazione di rete in 7 livelli:

| Layer | Nome | Protocolli/Esempi | Cosa monitora il SOC |
|-------|------|------------------|---------------------|
| 7 | Application | HTTP, DNS, SMTP, FTP | Web attacks, phishing, malware download |
| 6 | Presentation | SSL/TLS, JPEG, ASCII | Certificati scaduti, cifratura debole |
| 5 | Session | NetBIOS, RPC | Session hijacking |
| 4 | Transport | TCP, UDP | Port scanning, SYN flood |
| 3 | Network | IP, ICMP, ARP | IP spoofing, ICMP tunneling |
| 2 | Data Link | Ethernet, MAC | ARP spoofing, MAC flooding |
| 1 | Physical | Cavi, Wi-Fi | Accesso fisico non autorizzato |

**Rilevanza SOC**: Capire a quale livello opera un attacco aiuta a scegliere lo strumento giusto per la detection. Un WAF opera al livello 7, un firewall tradizionale al livello 3-4, un IDS/IPS può operare su più livelli.

---

### 16. Cos'è una VLAN e come contribuisce alla sicurezza?

Una **VLAN (Virtual Local Area Network)** è una segmentazione logica della rete che isola il traffico tra gruppi di dispositivi, anche se fisicamente connessi allo stesso switch.

**Benefici per la sicurezza**:
- **Segmentazione**: I server critici sono isolati dalle workstation utente
- **Contenimento laterale**: Se un attaccante compromette un segmento, non può spostarsi facilmente negli altri
- **Controllo del traffico**: Il traffico tra VLAN passa attraverso un firewall o un router, dove può essere ispezionato

**Esempio SOC**: Se un endpoint infetto è nella VLAN 10 (utenti) e il database è nella VLAN 50 (server), l'attaccante non può raggiungere il database direttamente. Questo rallenta il **lateral movement** e dà tempo al SOC di rilevare l'attività.

---

### 17. Cosa sono NAT e PAT?

- **NAT (Network Address Translation)**: Traduce indirizzi IP privati in indirizzi IP pubblici per permettere la comunicazione su Internet. Un router NAT sostituisce l'IP sorgente privato (es. 192.168.1.10) con l'IP pubblico.
- **PAT (Port Address Translation)**: Una variante del NAT che usa anche i numeri di porta per mappare più dispositivi interni sullo stesso IP pubblico.

**Rilevanza SOC**: Il NAT complica l'analisi forense perché più dispositivi interni appaiono con lo stesso IP pubblico nei log esterni. È fondamentale correlare i log del firewall NAT con i log interni per identificare il dispositivo specifico.

---

## 🔍 Domande su SIEM e Log Analysis

### 18. Cos'è un SIEM e quali hai usato/studiato?

Un **SIEM (Security Information and Event Management)** è una piattaforma che raccoglie, normalizza, correla e analizza i log provenienti da diverse fonti (firewall, endpoint, server, applicazioni) per rilevare minacce di sicurezza.

**Funzionalità principali**:
- **Raccolta log centralizzata**: Da centinaia di fonti diverse
- **Normalizzazione**: Converte log in formati diversi in uno schema comune
- **Correlazione**: Collega eventi da fonti diverse per identificare pattern di attacco
- **Alerting**: Genera alert basati su regole, soglie o anomalie
- **Retention**: Conserva i log per compliance e indagini forensi
- **Dashboard e reporting**: Visibilità in tempo reale sullo stato di sicurezza

**SIEM principali**:

| SIEM | Vendor | Linguaggio Query | Note |
|------|--------|-----------------|------|
| **Microsoft Sentinel** | Microsoft | KQL (Kusto Query Language) | Cloud-native, integrato con Azure/M365 |
| **Splunk** | Splunk/Cisco | SPL (Search Processing Language) | Leader di mercato, molto flessibile |
| **QRadar** | IBM | AQL | Forte in correlazione, usato in grandi enterprise |
| **Elastic SIEM** | Elastic | Lucene / EQL | Open source, basato su Elasticsearch |
| **Google Chronicle** | Google | YARA-L | Scalabilità cloud, threat intelligence integrata |
| **Wazuh** | Open Source | Nessuno specifico | Open source, buon punto di partenza per lab |

---

### 19. Come identifichi un attacco brute force nei log?

**Indicatori da cercare**:
1. **Molti tentativi di login falliti** (Event ID 4625 su Windows) dallo stesso IP sorgente o verso lo stesso account
2. **Login riuscito dopo molti fallimenti** (4625 → 4624) — il brute force ha avuto successo
3. **Pattern temporale**: Tentativi a intervalli regolari (automatizzati) vs. irregolari (manuali)
4. **Account multipli dallo stesso IP**: Possibile **password spraying**
5. **Orario anomalo**: Tentativi nelle ore notturne o nei weekend

**Esempio query KQL (Microsoft Sentinel)**:
```kql
SecurityEvent
| where EventID == 4625
| summarize FailedAttempts = count() by TargetAccount, IpAddress, bin(TimeGenerated, 5m)
| where FailedAttempts > 10
| order by FailedAttempts desc
```

**Esempio query SPL (Splunk)**:
```spl
index=windows EventCode=4625
| stats count by Account_Name, Source_Network_Address
| where count > 10
| sort -count
```

**Differenza tra brute force e password spraying**:

| Tipo | Approccio | Detection |
|------|-----------|-----------|
| **Brute Force** | Molte password → un account | Molti 4625 sullo stesso account |
| **Password Spraying** | Una password → molti account | Un 4625 per account, ma stesso IP sorgente per tutti |
| **Credential Stuffing** | Credenziali rubate da breach | Pattern vario, IP multipli, credenziali diverse |

---

### 20. Quali Event ID di Windows sono i più importanti per un SOC Analyst?

| Event ID | Descrizione | Rilevanza |
|----------|------------|-----------|
| **4624** | Login riuscito | Tracciamento accessi, correlazione con attività sospette |
| **4625** | Login fallito | Brute force, password spraying |
| **4648** | Login con credenziali esplicite | Possibile pass-the-hash o uso di credenziali rubate |
| **4672** | Privilegi speciali assegnati | Uso di account admin, privilege escalation |
| **4688** | Nuovo processo creato | Esecuzione di strumenti malevoli (con command line logging abilitato) |
| **4697** | Servizio installato | Persistence, installazione di strumenti attaccante |
| **4698** | Scheduled task creato | Persistence via task pianificati |
| **4720** | Account utente creato | Creazione account sospetta |
| **4732** | Membro aggiunto a gruppo locale | Aggiunta a gruppo Administrators |
| **7045** | Servizio installato (System log) | Installazione servizi malevoli |
| **1102** | Audit log cancellato | L'attaccante sta coprendo le tracce |
| **4104** | PowerShell Script Block Logging | Esecuzione di script PowerShell (ottimo per detection) |

**Tip**: Gli Event ID 4688 e 4104 sono **fondamentali** per la detection di LOLBins e attacchi fileless.

---

### 21. Come correli eventi da fonti diverse?

La correlazione è il cuore del lavoro di un SOC Analyst:

**Metodologia**:
1. **Identificare un pivot point**: Un elemento comune tra le fonti (IP, username, hostname, hash di file)
2. **Timeline analysis**: Ricostruire la sequenza temporale degli eventi su tutte le fonti
3. **Arricchimento**: Aggiungere contesto con threat intelligence (VirusTotal, AbuseIPDB, MISP)
4. **Mappatura ATT&CK**: Associare ogni evento a una tecnica per ricostruire la kill chain

**Esempio pratico di correlazione**:
```
1. SIEM: Alert per login sospetto (4624) dall'IP 10.0.1.50 alle 02:30
2. EDR: Lo stesso host 10.0.1.50 esegue PowerShell con parametri encoded alle 02:32
3. Firewall: Traffico in uscita da 10.0.1.50 verso IP 185.x.x.x (noto C2) alle 02:35
4. Proxy: Download di un file .exe dallo stesso IP 185.x.x.x alle 02:33
5. DNS: Query verso un dominio DGA-like dallo stesso host alle 02:36
```

Correlando queste 5 fonti, ricostruiamo: **compromissione account → esecuzione codice → download payload → comunicazione C2**.

---

### 22. Cos'è una regola di correlazione nel SIEM?

Una **regola di correlazione** è una logica che combina più eventi da una o più fonti per generare un alert quando viene identificato un pattern specifico.

**Esempio**: Regola "Possibile Brute Force Riuscito"
```
SE:
  - 5+ login falliti (Event ID 4625) dallo stesso IP verso lo stesso account
  - SEGUITI da 1 login riuscito (Event ID 4624) dallo stesso IP
  - ENTRO una finestra temporale di 10 minuti
ALLORA:
  - Genera alert con severità HIGH
  - Arricchisci con geolocalizzazione dell'IP
  - Notifica il team SOC
```

**Buone pratiche**:
- Testare le regole in ambiente di staging prima della produzione
- Documentare ogni regola con una description, la tecnica ATT&CK associata e i passaggi di investigazione
- Effettuare tuning regolare per ridurre i falsi positivi

---

### 23. Cos'è il log parsing e la normalizzazione?

- **Parsing**: Processo di estrazione di campi strutturati da log grezzi (non strutturati). Esempio: da una riga di log del firewall si estraggono source IP, destination IP, porta, azione.
- **Normalizzazione**: Processo di mappatura dei campi estratti su uno schema comune, in modo che log di fonti diverse siano comparabili.

**Esempio di parsing**:
```
Log grezzo (firewall):  
Jun 24 10:30:15 fw01 DENY src=192.168.1.10 dst=10.0.0.5 proto=TCP dpt=445

Dopo il parsing:
- timestamp: 2024-06-24T10:30:15
- source: fw01
- action: DENY
- src_ip: 192.168.1.10
- dst_ip: 10.0.0.5
- protocol: TCP
- dst_port: 445
```

Senza normalizzazione, non potremmo correlare un log del firewall con un log di Windows che usa nomi di campo diversi per lo stesso concetto.

---

### 24. Cosa sono le dashboard e perché sono importanti?

Le **dashboard** sono visualizzazioni in tempo reale delle metriche di sicurezza più importanti. Permettono al SOC di avere una visione d'insieme immediata.

**Dashboard essenziali in un SOC**:
- **Alert Overview**: Numero di alert per severità, trend nel tempo, top fonti
- **Authentication Monitoring**: Login falliti/riusciti, login da IP anomali, account lockout
- **Network Traffic**: Traffico per protocollo, porte, destinazioni anomale, geolocalizzazione
- **Threat Intelligence**: IoC attivi, match con il traffico interno
- **Incident Metrics**: MTTD, MTTR, incidenti aperti/chiusi per settimana

---

## 🚨 Domande su Incident Response

### 25. Descrivi il processo di Incident Response secondo il NIST

Il **NIST SP 800-61** definisce 4 fasi del processo di Incident Response:

```
┌──────────────┐    ┌──────────────────────┐    ┌──────────────────────┐    ┌─────────────────────┐
│ Preparation  │ →  │ Detection & Analysis │ →  │ Containment, Erad.   │ →  │ Post-Incident       │
│              │    │                      │    │ & Recovery           │    │ Activity            │
└──────────────┘    └──────────────────────┘    └──────────────────────┘    └─────────────────────┘
```

| Fase | Attività principali |
|------|-------------------|
| **1. Preparation** | Definire playbook, formare il team, preparare strumenti, stabilire canali di comunicazione |
| **2. Detection & Analysis** | Monitorare alert, analizzare log, validare incidenti, classificare severità, documentare |
| **3. Containment, Eradication & Recovery** | Isolare sistemi compromessi, rimuovere la minaccia, ripristinare i servizi, verificare la pulizia |
| **4. Post-Incident Activity** | Lessons learned, aggiornare playbook, migliorare detection, report finale |

**Variante SANS** (6 fasi): Preparation → Identification → Containment → Eradication → Recovery → Lessons Learned

---

### 26. Un utente segnala un'email sospetta: cosa fai step by step?

**Processo di analisi email sospetta**:

1. **NON cliccare su link o aprire allegati** nell'email originale
2. **Raccogliere informazioni dall'header**:
   - Mittente reale (campo `From` vs `Return-Path`)
   - Server di invio (`Received` headers)
   - Risultati SPF, DKIM, DMARC
3. **Analizzare il corpo dell'email**:
   - Errori grammaticali, urgenza artificiale, richieste insolite
   - Link: hover per vedere l'URL reale, confrontare con il testo del link
   - Logo e branding: confrontare con comunicazioni legittime
4. **Analizzare link e allegati in ambiente sicuro**:
   - URL: controllare su **VirusTotal**, **URLScan.io**, **Any.Run**
   - Allegati: sottomettere a **sandbox** (Any.Run, Hybrid Analysis, Joe Sandbox)
   - Hash dell'allegato: cercare su VirusTotal
5. **Verificare l'impatto**:
   - Qualcun altro ha ricevuto la stessa email? (cercare nel gateway email)
   - Qualcuno ha cliccato sul link? (log del proxy)
   - Qualcuno ha aperto l'allegato? (log EDR)
6. **Azioni di risposta**:
   - Bloccare il mittente e l'URL nel gateway email
   - Rimuovere l'email da tutte le caselle (purge)
   - Se qualcuno ha interagito: avviare incident response completo
7. **Documentare** tutto nel sistema di ticketing

---

### 27. Come gestisci un'infezione da ransomware?

**Risposta immediata (primi 30 minuti)**:

1. **Contenimento URGENTE**:
   - Isolare immediatamente il/i sistema/i infetto/i dalla rete (non spegnerli se possibile — preservare la RAM per forensics)
   - Disabilitare le condivisioni di rete
   - Bloccare le comunicazioni verso il C2 identificato
2. **Valutazione dell'impatto**:
   - Quanti sistemi sono coinvolti?
   - Quali dati sono stati cifrati?
   - I backup sono integri e accessibili? (verificare che il ransomware non li abbia raggiunti)
3. **Escalation**:
   - Notificare il SOC Manager, il CISO, il team legale
   - Attivare il piano di incident response
   - Considerare il coinvolgimento di un team DFIR esterno
4. **Identificazione**:
   - Quale variante di ransomware? (controllare la nota di riscatto, le estensioni dei file cifrati su **ID Ransomware**)
   - Qual è stato il vettore d'ingresso? (email, RDP esposto, vulnerability exploit)
5. **Eradicazione e Recovery**:
   - Rimuovere il malware da tutti i sistemi
   - Ripristinare da backup puliti
   - Cambiare tutte le credenziali
   - Patchare la vulnerabilità sfruttata
6. **Post-incidente**:
   - Lessons learned
   - Migliorare la detection
   - Valutare se ci sono obblighi di notifica (GDPR, NIS2)

**⚠️ NON pagare il riscatto** senza consultare il team legale e le forze dell'ordine.

---

### 28. Quando escali un incidente?

L'escalation è necessaria quando:

| Condizione | Esempio | Escala a |
|-----------|---------|---------|
| Supera le tue competenze tecniche | Malware sconosciuto, attacco zero-day | Tier 2/Tier 3 |
| Coinvolge asset critici | Domain Controller, database clienti | SOC Manager + CISO |
| Richiede azioni fuori dalla tua autorità | Isolare un server di produzione | SOC Manager |
| Ha impatto sul business | Servizio down per i clienti | Management + Comunicazione |
| Implicazioni legali/compliance | Data breach con dati personali | Team legale, DPO |
| Non riesci a contenerlo | L'attacco si sta espandendo | Incident Response Team |
| Richiede coordinamento esterno | Coinvolgimento forze dell'ordine | CISO + Legale |

**Regola d'oro**: **Meglio escalare troppo presto che troppo tardi**. Non sei giudicato per aver escalato un falso positivo, ma sarai giudicato per non aver escalato un incidente reale.

---

### 29. Cos'è un playbook e come lo usi?

Un **playbook** (o **runbook**) è una procedura documentata step-by-step che guida l'analista nella risposta a un tipo specifico di incidente.

**Struttura tipica di un playbook**:
1. **Trigger**: Cosa attiva il playbook (es. "Alert per brute force con login riuscito")
2. **Classificazione**: Come determinare se è un vero positivo
3. **Investigazione**: Quali log controllare, quali query eseguire
4. **Azioni di risposta**: Cosa fare se confermato (contenimento, eradicazione)
5. **Escalation criteria**: Quando e a chi escalare
6. **Documentazione**: Cosa documentare nel ticket
7. **Chiusura**: Come chiudere il ticket

**Playbook comuni in un SOC**:
- Phishing email investigation
- Brute force / password spraying
- Malware detection
- Suspicious PowerShell execution
- Data exfiltration alert
- Unauthorized access attempt
- C2 communication detected

---

### 30. Cos'è la chain of custody nella digital forensics?

La **chain of custody** è la documentazione cronologica di chi ha avuto accesso, gestito o analizzato un reperto digitale, dalla raccolta alla presentazione in tribunale.

**Elementi chiave**:
- **Chi** ha raccolto l'evidenza
- **Quando** è stata raccolta
- **Come** è stata preservata (hash MD5/SHA256 per verificare l'integrità)
- **Dove** è stata conservata
- **Chi** vi ha avuto accesso successivamente

**Rilevanza SOC**: Anche se non fai forensics avanzata, devi sapere che le evidenze raccolte durante un incidente potrebbero essere usate in un procedimento legale. Quindi:
- Non modificare i file originali
- Fai copie forensi (bit-a-bit)
- Documenta ogni azione
- Calcola e registra gli hash

---

## ⚔️ Domande sugli Attacchi

### 31. Come riconosci un attacco di phishing?

**Indicatori di phishing**:

| Indicatore | Esempio |
|-----------|---------|
| **Mittente sospetto** | `support@micr0soft-secure.com` invece di `@microsoft.com` |
| **Urgenza artificiale** | "Il tuo account sarà bloccato entro 24 ore!" |
| **Link mascherato** | Testo dice `microsoft.com` ma l'URL reale è `evil-site.com/microsoft` |
| **Allegato inatteso** | File .doc con macro, .exe rinominato .pdf, .zip protetto da password |
| **Errori grammaticali** | Errori evidenti in email "ufficiali" |
| **Richiesta di credenziali** | "Conferma la tua password cliccando qui" |
| **Spoofing del brand** | Logo e template simili ma con differenze sottili |
| **Header anomali** | SPF fail, DKIM fail, mismatch tra `From` e `Reply-To` |

**Tipi di phishing**:

| Tipo | Target | Descrizione |
|------|--------|-------------|
| **Phishing** | Massa | Email generica inviata a migliaia di utenti |
| **Spear Phishing** | Individuo specifico | Email personalizzata basata su OSINT del target |
| **Whaling** | C-Level (CEO, CFO) | Spear phishing mirato ai dirigenti |
| **Vishing** | Telefono | Phishing via chiamata vocale |
| **Smishing** | SMS | Phishing via messaggio di testo |
| **BEC** | Business | Compromissione email aziendale per frode finanziaria |

---

### 32. Cos'è un attacco DDoS e come lo mitighi?

Un **DDoS (Distributed Denial of Service)** è un attacco che mira a rendere un servizio non disponibile sovraccaricandolo di traffico proveniente da molte fonti (tipicamente una botnet).

**Tipi di DDoS**:

| Tipo | Layer OSI | Esempio | Mitigazione |
|------|-----------|---------|-------------|
| **Volumetrico** | 3-4 | UDP flood, DNS amplification, NTP amplification | CDN, scrubbing center, rate limiting |
| **Protocollo** | 3-4 | SYN flood, Ping of Death, Smurf | SYN cookies, firewall tuning |
| **Applicativo** | 7 | HTTP flood, Slowloris | WAF, rate limiting per URL, CAPTCHA |

**Mitigazione**:
1. **Prevention**: CDN (Cloudflare, Akamai), rate limiting, geo-blocking
2. **Detection**: Monitorare picchi di traffico anomali, alert su bandwidth
3. **Response**: Attivare la mitigazione DDoS del provider, null routing degli IP attaccanti
4. **Recovery**: Ripristinare i servizi, analizzare i log, aggiornare le regole

---

### 33. Spiega la SQL injection

La **SQL Injection (SQLi)** è una vulnerabilità che permette a un attaccante di iniettare codice SQL malevolo nei campi di input di un'applicazione web, manipolando le query al database.

**Esempio classico**:
```
Campo login: admin' OR '1'='1' --
Query risultante: SELECT * FROM users WHERE username='admin' OR '1'='1' --' AND password='xxx'
```
Il `'1'='1'` è sempre vero, quindi l'attaccante bypassa l'autenticazione.

**Tipi di SQL Injection**:

| Tipo | Descrizione | Detection |
|------|------------|-----------|
| **In-band (Classic)** | Il risultato è visibile nella risposta | Caratteri speciali nei log del web server |
| **Blind (Boolean)** | L'attaccante inferisce dati dalle risposte true/false | Molte richieste simili con variazioni minime |
| **Time-based Blind** | Usa SLEEP() per inferire dati | Richieste con tempi di risposta anomali |
| **Out-of-band** | I dati vengono inviati a un server esterno | Connessioni DNS/HTTP anomale dal DB server |

**Rilevanza SOC**: Monitorare i log del WAF e del web server per pattern come `' OR`, `UNION SELECT`, `; DROP TABLE`, `SLEEP(`, `--` nei parametri delle richieste.

---

### 34. Cosa sono i LOLBins?

**LOLBins (Living Off the Land Binaries)** sono programmi legittimi già presenti nel sistema operativo che gli attaccanti utilizzano per eseguire attività malevole, evitando la detection basata su firma.

**Perché sono pericolosi**: Sono binari firmati Microsoft, quindi non vengono bloccati dall'antivirus.

**LOLBins Windows più comuni**:

| LOLBin | Uso legittimo | Uso malevolo |
|--------|--------------|-------------|
| `powershell.exe` | Scripting e automazione | Download ed esecuzione di payload, encoding |
| `certutil.exe` | Gestione certificati | Download file (`certutil -urlcache -f`), decode base64 |
| `mshta.exe` | Esecuzione file HTA | Esecuzione di codice remoto via URL |
| `regsvr32.exe` | Registrazione DLL | Esecuzione di scriptlet da URL (Squiblydoo) |
| `rundll32.exe` | Esecuzione funzioni DLL | Esecuzione di payload malevoli |
| `bitsadmin.exe` | Download in background | Download di malware silenzioso |
| `wmic.exe` | Gestione sistema | Ricognizione, esecuzione remota |
| `msiexec.exe` | Installazione MSI | Installazione di malware da URL |

**Detection nel SOC**: Monitorare l'Event ID 4688 (con command line logging) e l'Event ID 4104 (PowerShell Script Block Logging) per esecuzioni anomale di questi binari.

---

### 35. Cos'è il lateral movement e come lo rilevi?

Il **lateral movement** è la tecnica con cui un attaccante si muove da un sistema compromesso ad altri sistemi nella rete, espandendo il suo accesso.

**Tecniche comuni**:

| Tecnica | Strumento/Metodo | Indicatori di Detection |
|---------|-----------------|----------------------|
| **Pass-the-Hash** | Mimikatz, credenziali NTLM | Event ID 4624 con Logon Type 3 da host inatteso |
| **PsExec** | Sysinternals PsExec | Event ID 7045 (servizio PSEXESVC installato) |
| **RDP** | Desktop remoto | Event ID 4624 Logon Type 10 in orari anomali |
| **WMI** | wmic.exe | Event ID 4688 con wmic process call create |
| **PowerShell Remoting** | Enter-PSSession, Invoke-Command | Event ID 4688 con wsmprovhost.exe, porte 5985/5986 |
| **SMB** | Condivisioni di rete | Accesso a share amministrativi (C$, ADMIN$) |

**Detection nel SOC**:
- Monitorare login di tipo 3 (network) e tipo 10 (RDP) tra workstation (non è normale)
- Alert per accesso a share amministrativi
- Correlazione tra login e esecuzione di comandi remoti
- Analisi dei flussi di rete per connessioni est-ovest anomale

---

### 36. Cos'è un attacco man-in-the-middle (MitM)?

Un attacco **Man-in-the-Middle** avviene quando un attaccante si interpone nella comunicazione tra due parti, intercettando e potenzialmente modificando il traffico.

**Tecniche MitM**:
- **ARP Spoofing**: L'attaccante associa il suo MAC address all'IP del gateway, ricevendo tutto il traffico della rete locale
- **DNS Spoofing**: L'attaccante risponde alle query DNS con IP malevoli
- **SSL Stripping**: Downgrade da HTTPS a HTTP per intercettare il traffico in chiaro
- **Rogue Wi-Fi**: Access point malevolo che imita una rete legittima

**Detection**:
- Certificati SSL anomali o scaduti
- Cambi frequenti nelle tabelle ARP
- Traffico HTTP dove ci si aspetta HTTPS
- Alert HSTS (HTTP Strict Transport Security) violati

---

### 37. Cos'è un attacco di privilege escalation?

La **privilege escalation** è il processo con cui un attaccante eleva i propri privilegi da utente normale ad amministratore o SYSTEM.

| Tipo | Descrizione | Esempio |
|------|------------|---------|
| **Verticale** | Da utente a admin/root | Exploit di una vulnerabilità del kernel |
| **Orizzontale** | Da utente A a utente B (stesso livello) | Accesso alle risorse di un altro utente |

**Tecniche comuni su Windows**:
- **Unquoted service paths**: Servizi con percorsi senza virgolette che possono essere hijackati
- **DLL Hijacking**: Inserire una DLL malevola in un percorso di ricerca del sistema
- **Token Impersonation**: Impersonare il token di un utente privilegiato
- **Exploiting misconfigured services**: Servizi che girano come SYSTEM con permessi di modifica deboli
- **AlwaysInstallElevated**: Policy che permette installazione MSI con privilegi elevati

---

## 🛡️ Domande sugli Strumenti

### 38. Qual è la differenza tra IDS e IPS?

| Caratteristica | IDS (Intrusion Detection System) | IPS (Intrusion Prevention System) |
|---------------|--------------------------------|----------------------------------|
| **Funzione** | Rileva e segnala le intrusioni | Rileva e BLOCCA le intrusioni |
| **Posizione** | Inline o in mirror (span port) | Sempre inline |
| **Azione** | Genera alert | Genera alert + blocca il traffico |
| **Rischio** | Nessun impatto sul traffico | Può bloccare traffico legittimo (FP) |
| **Analogia** | Telecamera di sicurezza | Guardia di sicurezza |

**Tipi**:
- **NIDS/NIPS**: Network-based, analizza il traffico di rete
- **HIDS/HIPS**: Host-based, analizza l'attività sul singolo host

**Strumenti comuni**: Snort, Suricata (open source), Palo Alto, Cisco Firepower

**Rilevanza SOC**: L'IDS genera molti alert che il SOC deve investigare. L'IPS riduce il carico ma deve essere tuned accuratamente per evitare di bloccare traffico legittimo.

---

### 39. Cos'è un EDR e come si differenzia dall'antivirus tradizionale?

| Caratteristica | Antivirus Tradizionale | EDR (Endpoint Detection & Response) |
|---------------|----------------------|-------------------------------------|
| **Metodo di detection** | Firme (signature-based) | Comportamentale, ML, IoC, telemetria |
| **Visibilità** | Solo file scansionati | Processi, connessioni, registry, file, comandi |
| **Risposta** | Quarantena/eliminazione file | Isolamento host, kill process, raccolta forensic |
| **Storico** | Limitato | Timeline completa delle attività dell'endpoint |
| **Threat Hunting** | Non supportato | Query sulla telemetria storica |
| **Attacchi fileless** | Scarsa detection | Buona detection (monitoraggio comportamentale) |

**EDR principali**:
- **Microsoft Defender for Endpoint (MDE)**: Integrato con Sentinel
- **CrowdStrike Falcon**: Leader di mercato, cloud-native
- **SentinelOne**: AI-driven, risposta autonoma
- **Carbon Black (VMware)**: Forte in threat hunting
- **Cortex XDR (Palo Alto)**: Integrato con firewall Palo Alto

---

### 40. Cos'è un SOAR?

**SOAR (Security Orchestration, Automation and Response)** è una piattaforma che automatizza i processi di risposta agli incidenti nel SOC.

**Tre componenti**:
- **Orchestration**: Connette e coordina diversi strumenti di sicurezza (SIEM, EDR, firewall, threat intelligence)
- **Automation**: Esegue azioni automatiche basate su playbook (es. bloccare un IP, isolare un endpoint)
- **Response**: Gestisce il workflow di incident response con ticket, assegnazione, escalation

**Esempio di automazione SOAR**:
```
Alert SIEM: "Brute force detected" →
  1. SOAR raccoglie le informazioni dell'alert
  2. Arricchisce l'IP sorgente su VirusTotal e AbuseIPDB
  3. Se l'IP è malevolo:
     a. Blocca l'IP sul firewall
     b. Disabilita l'account target su Active Directory
     c. Isola l'endpoint sull'EDR
     d. Crea un ticket con tutte le informazioni
     e. Notifica l'analista via Slack/Teams
  4. Se l'IP è legittimo:
     a. Chiude l'alert come falso positivo
     b. Aggiorna la whitelist
```

**SOAR comuni**: Microsoft Sentinel (Logic Apps), Splunk SOAR (Phantom), Palo Alto XSOAR, IBM Resilient

---

### 41. Cos'è un WAF (Web Application Firewall)?

Un **WAF** è un firewall applicativo che protegge le applicazioni web filtrando e monitorando il traffico HTTP/HTTPS tra Internet e l'applicazione.

**Cosa protegge**:
- SQL Injection
- Cross-Site Scripting (XSS)
- Cross-Site Request Forgery (CSRF)
- Directory traversal
- File inclusion

**Differenza con firewall tradizionale**:

| Caratteristica | Firewall Tradizionale | WAF |
|---------------|----------------------|-----|
| **Layer OSI** | 3-4 (Network/Transport) | 7 (Application) |
| **Cosa ispeziona** | IP, porte, protocolli | Contenuto HTTP, header, cookie, parametri |
| **Protezione** | Scansioni di rete, DDoS L3-4 | Attacchi web (SQLi, XSS) |

**WAF comuni**: Cloudflare WAF, AWS WAF, ModSecurity (open source), F5 ASM

---

### 42. Cos'è un XDR?

**XDR (Extended Detection and Response)** è l'evoluzione dell'EDR che estende la visibilità e la correlazione oltre l'endpoint, includendo rete, email, cloud, identità e applicazioni.

**Differenze**:

| | EDR | XDR |
|---|-----|-----|
| **Scope** | Solo endpoint | Endpoint + rete + email + cloud + identità |
| **Correlazione** | Alert isolati per endpoint | Correlazione cross-domain |
| **Visibilità** | Singolo dispositivo | Intera catena di attacco |

**Esempio pratico XDR**: Un utente riceve un'email di phishing (detection email) → clicca un link (detection proxy/rete) → scarica un malware (detection endpoint) → il malware contatta un C2 (detection rete) → tenta lateral movement (detection identità). L'XDR correla tutti questi eventi in un unico incidente.

---

### 43. Come usi VirusTotal nel lavoro quotidiano?

**VirusTotal** è un servizio che analizza file, URL, IP e domini tramite 70+ motori antivirus e strumenti di analisi.

**Casi d'uso nel SOC**:
- **Analisi hash**: Cercare l'hash (MD5/SHA256) di un file sospetto per vedere se è noto come malevolo
- **Analisi URL**: Verificare se un URL presente in un'email di phishing è malevolo
- **Analisi IP**: Verificare la reputazione di un IP che comunica con i nostri sistemi
- **Analisi dominio**: Controllare WHOIS, DNS passivo, sotto-domini di un dominio sospetto
- **Relazioni**: Esplorare i file scaricati da un URL, gli IP contattati da un malware, ecc.

**⚠️ Attenzione**: Non caricare su VirusTotal file interni o sensibili dell'organizzazione! Usa solo gli hash. I file caricati su VT diventano accessibili a tutti.

---

## 💡 Domande Scenario-Based

### 44. Vedi 500 tentativi di login falliti dallo stesso IP in 5 minuti. Cosa fai?

**Step di investigazione**:

1. **Verifica l'IP sorgente**:
   - È un IP interno o esterno?
   - Interno: potrebbe essere un servizio mal configurato, un service account con password scaduta
   - Esterno: probabile brute force
2. **Controlla la reputazione dell'IP**: VirusTotal, AbuseIPDB, threat intelligence feeds
3. **Analizza il target**:
   - È un singolo account o più account? (Brute force vs. password spraying)
   - L'account target è privilegiato? (admin, service account)
4. **Verifica se c'è stato un login riuscito** (Event ID 4624 dopo i 4625)
5. **Azioni immediate**:
   - Se esterno: bloccare l'IP sul firewall
   - Se login riuscito: disabilitare l'account, verificare attività post-login
   - Se interno: contattare l'utente/team proprietario del servizio
6. **Documentare** tutto nel ticket con timeline, IoC e azioni intraprese

---

### 45. Un endpoint sta comunicando con un IP noto come C2. Cosa fai?

**Scenario critico — Azione rapida richiesta**:

1. **Confermare l'alert**: Verificare l'IP su fonti di threat intelligence multiple (non solo una)
2. **Isolare l'endpoint**: Via EDR, isolare l'host dalla rete mantenendo la connessione all'EDR per l'analisi remota
3. **Analizzare il traffico**:
   - Quanto traffico è stato scambiato? (volume = possibile exfiltration)
   - Da quanto tempo comunica? (dwell time)
   - Quale processo sta generando il traffico? (EDR telemetry)
4. **Identificare il vettore**:
   - Come è arrivato il malware? Email, download, USB?
   - Che processo è responsabile? Controllare la process tree sull'EDR
5. **Verificare la propagazione**:
   - Altri endpoint comunicano con lo stesso IP?
   - Ci sono segni di lateral movement?
6. **Contenere**: Bloccare l'IP su firewall/proxy per tutta l'organizzazione
7. **Eradicare**: Rimuovere il malware, ripristinare l'endpoint se necessario
8. **Escalare**: Notificare Tier 2/3 e SOC Manager

---

### 46. Noti che un utente admin ha creato un nuovo account alle 3 di notte. Cosa fai?

**Attività sospetta — possibile insider threat o account compromesso**:

1. **Verificare se è un'attività pianificata**: C'è un change request o una manutenzione programmata?
2. **Analizzare l'account creatore**:
   - L'admin è un dipendente reale? Contattarlo per confermare
   - Da dove si è connesso? (IP, geolocalizzazione, VPN?)
   - Ci sono altri comportamenti anomali? (login da IP inusuali, esecuzione di comandi sospetti)
3. **Analizzare l'account creato**:
   - Che nome ha? (nomi generici come "test", "admin2" sono sospetti)
   - A quali gruppi è stato aggiunto? (Domain Admins è un red flag enorme)
   - È stato usato per accedere a risorse?
4. **Azioni**:
   - Disabilitare il nuovo account creato
   - Se l'admin non conferma l'attività: disabilitare anche il suo account, forzare il cambio password
   - Escalare come possibile compromissione di account privilegiato
5. **Cercare indicatori correlati**: Controllare se ci sono stati altri Event ID sospetti (4672, 4732, 4688) nella stessa finestra temporale

---

### 47. Un alert segnala traffico DNS anomalo. Come investighi?

**DNS anomalo può indicare DNS tunneling, DGA, o comunicazione C2**:

1. **Analizzare le query DNS**:
   - Lunghezza anomala dei sottodomini? (DNS tunneling codifica dati nei nomi: `aGVsbG8gd29ybGQ.evil.com`)
   - Alta frequenza di query verso lo stesso dominio?
   - Domini che sembrano generati automaticamente (DGA)? (es. `xk7j2m9p.com`)
2. **Controllare i domini**:
   - Sono registrati di recente? (dominio giovane = sospetto)
   - Reputazione su VirusTotal, URLScan.io
   - Il TLD è sospetto? (.tk, .ml, .ga sono spesso abusati)
3. **Analizzare il volume**:
   - Quanti byte vengono trasferiti nelle risposte DNS? (DNS tunneling genera risposte TXT grandi)
   - Rapporto query/risposta anomalo?
4. **Identificare l'endpoint sorgente**:
   - Quale processo sta generando le query? (controllare sull'EDR)
   - L'utente sta navigando attivamente o è un processo in background?
5. **Azioni**:
   - Bloccare i domini sospetti sul DNS resolver/firewall
   - Investigare l'endpoint per possibile compromissione
   - Aggiungere i domini alla watchlist

---

### 48. Ricevi un alert per data exfiltration. Quali sono i tuoi passi?

1. **Validare l'alert**:
   - Che tipo di dati sono stati trasferiti? (tipo file, dimensione)
   - Verso dove? (IP esterno, servizio cloud, USB)
   - Chi è l'utente? (ha motivi legittimi per trasferire quei dati?)
2. **Analizzare il contesto**:
   - È una destinazione nota/approvata? (OneDrive aziendale vs. mega.nz personale)
   - Il volume è anomalo rispetto al comportamento storico dell'utente?
   - L'orario è sospetto?
3. **Verificare il contenuto**:
   - I dati sono sensibili? (PII, dati finanziari, proprietà intellettuale)
   - Il DLP ha classificato il contenuto?
4. **Azioni**:
   - Se sospetto: bloccare il trasferimento, contattare l'utente e il suo manager
   - Se confermato: isolare l'endpoint, preservare le evidenze
   - Escalare al SOC Manager e, se coinvolge dati personali, al DPO
5. **Documentare**: Timeline completa, quantità di dati, tipo di dati, destinazione

---

### 49. Un utente VIP segnala che il suo PC è lento e si comporta in modo strano. Come procedi?

1. **Non sottovalutare**: Gli utenti VIP (dirigenti) sono spesso target di spear phishing e whaling
2. **Raccogliere informazioni**:
   - Da quando? Cosa è cambiato? Ha aperto allegati o cliccato su link di recente?
   - Ha notato popup, programmi sconosciuti, reindirizzamenti del browser?
3. **Analisi remota (senza recarsi di persona subito)**:
   - Controllare l'EDR: processi anomali, connessioni di rete sospette, esecuzioni recenti
   - Controllare i log SIEM: alert correlati a quell'host
   - Controllare il proxy: traffico verso domini sospetti
4. **Se confermato sospetto**:
   - Isolare il dispositivo e fornire un dispositivo sostitutivo
   - Avviare l'incident response completo
   - Gestire la comunicazione con sensibilità (utente VIP = visibilità alta)
5. **Se è un falso allarme**: Documentare comunque e usare l'occasione per sensibilizzare l'utente sulla security awareness

---

### 50. Trovi un web shell su un server web esposto a Internet. Cosa fai?

1. **NON rimuoverla immediatamente** — prima raccogli le evidenze
2. **Identificare**:
   - Dove si trova? (path completo)
   - Da quanto tempo è presente? (timestamp di creazione/modifica)
   - Qual è il suo hash? (cercare su VirusTotal)
3. **Analizzare l'accesso**:
   - Log del web server: chi vi ha accesso? Da quali IP? Con che frequenza?
   - Che comandi sono stati eseguiti? (se la web shell logga i comandi)
4. **Identificare il vettore**:
   - Come è stata caricata? (file upload vulnerability, RCE, credenziali compromesse)
   - Ci sono altre web shell? (scansione completa del server)
5. **Contenere**:
   - Bloccare gli IP attaccanti sul WAF/firewall
   - Revocare le credenziali di accesso al server
6. **Eradicare**:
   - Rimuovere la web shell e qualsiasi backdoor
   - Patchare la vulnerabilità che ha permesso l'upload
7. **Verificare**: L'attaccante ha pivotato verso altri sistemi?

---

## 🤝 Domande Comportamentali / Soft Skill

### 51. Come gestisci un falso positivo che ti ha fatto perdere tempo?

**Risposta strutturata**:

> "Non lo considero tempo perso. Ogni investigazione, anche se si conclude con un falso positivo, è un'opportunità per migliorare. Dopo aver chiuso l'alert, mi chiedo: **perché è stato generato?** Posso tuning la regola SIEM per evitare che si ripeta? Posso aggiungere l'eccezione al playbook? Documento le mie findings nel ticket in modo che il prossimo analista che incontra lo stesso alert possa chiuderlo più velocemente. Inoltre, condivido l'informazione con il team durante il daily briefing."

---

### 52. Come comunichi un incidente al management non tecnico?

**Principi chiave**:
- **Evitare gergo tecnico**: Non dire "abbiamo rilevato un beacon C2 via HTTPS verso un IP GeoIP russo". Dire "un computer aziendale sta comunicando con un server malevolo all'estero"
- **Focus sull'impatto business**: "Quali dati sono a rischio?", "I servizi sono impattati?", "Ci sono obblighi di notifica?"
- **Struttura**: Cosa è successo → Qual è l'impatto → Cosa stiamo facendo → Cosa serve da loro

**Template di comunicazione**:
```
COSA: Un account aziendale è stato compromesso tramite un'email fraudolenta.
IMPATTO: L'attaccante ha avuto accesso alle email dell'utente per circa 2 ore.
         Stiamo verificando se dati sensibili sono stati consultati.
AZIONI: L'account è stato bloccato, la password cambiata, e stiamo analizzando
        le attività dell'attaccante.
RICHIESTA: Approvazione per notificare gli utenti i cui dati potrebbero
           essere stati esposti.
```

---

### 53. Come ti tieni aggiornato sulle nuove minacce?

**Fonti consigliate** (menzionale specificamente):

| Tipo | Risorsa | Frequenza |
|------|---------|-----------|
| **News** | The Hacker News, BleepingComputer, Dark Reading | Quotidiana |
| **Threat Intel** | CISA Alerts, CERT nazionali, MITRE | Settimanale |
| **Community** | Reddit r/netsec, Twitter/X InfoSec, Discord security | Continua |
| **Blog tecnici** | Mandiant, CrowdStrike, Microsoft Security Blog | Settimanale |
| **Podcast** | Darknet Diaries, SANS Internet Storm Center | Settimanale |
| **Pratica** | TryHackMe, HackTheBox, LetsDefend, CyberDefenders | Regolare |
| **Certificazioni** | Studio continuo verso la prossima certificazione | Continua |
| **CVE** | NVD (National Vulnerability Database), CVE.org | Alert attivi |

---

### 54. Raccontami di una volta che hai lavorato sotto pressione

**Framework STAR per la risposta**:

- **Situation**: Descrivi il contesto (es. "Durante un esercizio su LetsDefend / un progetto di studio...")
- **Task**: Qual era il tuo compito
- **Action**: Cosa hai fatto specificamente
- **Result**: Qual è stato il risultato

**Esempio**:
> "Durante un challenge su CyberDefenders, mi sono trovato ad analizzare un incidente complesso con un tempo limite. C'erano log da multiple fonti — SIEM, firewall, EDR — e dovevo ricostruire l'intera catena di attacco. Ho iniziato creando una timeline degli eventi, poi ho correlato le fonti usando gli IP e i timestamp come pivot. Nonostante la pressione del tempo, ho seguito una metodologia strutturata e sono riuscito a completare l'analisi identificando il vettore d'ingresso, i movimenti laterali e i dati esfiltrati."

---

### 55. Come gestisci il disaccordo con un collega sulla classificazione di un alert?

> "Apprezzo prospettive diverse perché la cybersecurity non è sempre bianco o nero. Presenterei le mie evidenze in modo chiaro, spiegando il ragionamento e le fonti che mi portano alla mia conclusione. Ascolterei attivamente le argomentazioni del collega. Se non raggiungessimo un accordo, proporrei di escalare a un analista senior o al team lead per un terzo parere. L'importante è che la decisione finale sia basata sui dati e non sull'ego, e che l'incidente venga gestito correttamente."

---

### 56. Perché vuoi lavorare in un SOC?

**Punti da toccare** (personalizzali):
- Passione genuina per la sicurezza informatica
- Interesse per l'analisi e l'investigazione — come risolvere un puzzle
- Desiderio di proteggere le organizzazioni e le persone dalle minacce cyber
- L'ambiente dinamico e in continua evoluzione ti stimola
- Menzionare la formazione fatta (certificazioni, lab, piattaforme pratiche)
- Obiettivo di crescita a lungo termine nel campo della cybersecurity

---

## 💼 Tips per il Colloquio

### 🎒 Come Prepararsi

1. **Studia i fondamenti**: Networking (TCP/IP, DNS, OSI), sistemi operativi (Windows event logs, Linux basics), concetti di sicurezza (CIA, MITRE ATT&CK)
2. **Pratica hands-on**: Completa almeno qualche challenge su TryHackMe, LetsDefend, CyberDefenders, Blue Team Labs Online
3. **Conosci gli strumenti**: Anche solo a livello base — Wireshark, Splunk (versione free), Microsoft Sentinel (lab gratuito Azure)
4. **Prepara le risposte scenario-based**: Esercitati a ragionare ad alta voce
5. **Studia l'azienda**: Qual è il loro settore? Che SIEM/EDR usano? Hanno un blog di sicurezza?
6. **Prepara domande per loro**: Dimostra interesse e proattività

### 📋 Cosa Portare / Mostrare

- **Portfolio/Lab personale**: Screenshot di lab completati, dashboard create, report di analisi
- **Certificazioni**: Badge digitali di Security+, BTL1, SC-200, ecc.
- **GitHub**: Script di automazione, regole SIEM custom, write-up di CTF
- **Blog/Write-up**: Articoli tecnici su challenge risolte, malware analizzati
- **Profilo TryHackMe/HTB**: Mostra il tuo progresso e i room completati

### ❌ Errori Comuni da Evitare

| Errore | Perché è un problema | Cosa fare invece |
|--------|---------------------|-----------------|
| Dire "non lo so" e basta | Mostra scarsa curiosità | "Non ho esperienza diretta, ma lo approccerei così..." |
| Memorizzare risposte senza capirle | Si vede subito | Capire i concetti, poi formulare le risposte con parole tue |
| Non fare domande alla fine | Sembra disinteresse | Preparare 3-5 domande intelligenti sull'azienda e il ruolo |
| Esagerare le competenze | Sarà verificato | Essere onesti e mostrare la voglia di imparare |
| Non menzionare la pratica hands-on | Il SOC è pratico | Parlare sempre di lab, esercizi e simulazioni fatte |
| Essere troppo generici | Non ti distingue | Dare risposte specifiche con esempi concreti |
| Non conoscere l'azienda | Scarsa preparazione | Ricercare l'azienda, i loro prodotti, le loro sfide |

### 📚 Risorse per Continuare a Studiare

| Categoria | Risorsa | Tipo |
|-----------|---------|------|
| **Piattaforme pratiche** | [TryHackMe](https://tryhackme.com) | Lab interattivi (SOC Level 1 path) |
| | [LetsDefend](https://letsdefend.io) | Simulazione SOC realistico |
| | [CyberDefenders](https://cyberdefenders.org) | Blue Team challenges |
| | [Blue Team Labs Online](https://blueteamlabs.online) | Investigazioni pratiche |
| **Certificazioni** | CompTIA Security+ / CySA+ | Fondamenti / SOC operations |
| | BTL1 (Security Blue Team) | SOC pratico |
| | SC-200 (Microsoft) | Sentinel, Defender, KQL |
| **Libri** | "Blue Team Handbook" — Don Murdoch | Incident response pratico |
| | "The Practice of Network Security Monitoring" — Richard Bejtlich | NSM fundamentals |
| **Community** | r/cybersecurity, r/netsec (Reddit) | Discussioni, risorse |
| | InfoSec Twitter/X | News in tempo reale |
| **Tool practice** | Splunk Free, Wazuh, Elastic SIEM | SIEM hands-on |
| | Wireshark | Analisi pacchetti |
| | Volatility | Analisi memoria RAM |

---

> 💡 **Ricorda**: Il colloquio non è solo rispondere alle domande. È dimostrare il tuo **modo di ragionare**, la tua **curiosità** e la tua **voglia di crescere**. Un candidato che ammette di non sapere qualcosa ma spiega come lo affronterebbe è molto più apprezzato di uno che inventa risposte.
