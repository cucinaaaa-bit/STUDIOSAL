# 🔍 SIEM - Security Information and Event Management

> **Documento di studio per la preparazione al colloquio SOC Analyst**  
> Livello: Intermedio | Lingua: Italiano

---

## 🎯 Cos'è un SIEM e Perché è il Cuore del SOC

### Definizione

Un **SIEM (Security Information and Event Management)** è una piattaforma tecnologica che combina due funzionalità fondamentali:

- **SIM (Security Information Management):** Raccolta, archiviazione e analisi dei log a lungo termine
- **SEM (Security Event Management):** Monitoraggio in tempo reale, correlazione degli eventi e alerting

In pratica, il SIEM è il **sistema nervoso centrale** del SOC: raccoglie i log da tutte le fonti dell'infrastruttura IT, li normalizza, li correla e genera alert quando rileva attività sospette.

### Perché è Fondamentale per un SOC

Senza un SIEM, il SOC dovrebbe:
- Controllare manualmente i log di decine o centinaia di sistemi
- Correlare eventi a mano tra fonti diverse
- Perdere minacce che coinvolgono più sistemi contemporaneamente

Il SIEM risolve questi problemi fornendo:
- **Visibilità centralizzata** su tutta l'infrastruttura
- **Correlazione automatica** degli eventi tra fonti diverse
- **Alert in tempo reale** per attività sospette
- **Dashboard** per monitoraggio e reporting
- **Compliance** con normative che richiedono la raccolta e conservazione dei log

### Evoluzione del SIEM

| Generazione | Periodo | Caratteristiche |
|-------------|---------|----------------|
| **Log Management** | 2000-2005 | Semplice raccolta e archiviazione dei log |
| **SIEM 1.0** | 2005-2012 | Correlazione base, alerting, reporting per compliance |
| **SIEM 2.0** | 2012-2018 | Big data analytics, threat intelligence integrata, UEBA |
| **SIEM Moderno** | 2018-oggi | Cloud-native, ML/AI, SOAR integrato, XDR convergence |

### SIEM vs SOAR vs XDR

| Tecnologia | Funzione Principale | Focus |
|-----------|---------------------|-------|
| **SIEM** | Raccolta, correlazione e alerting dei log | Rilevamento e visibilità |
| **SOAR** (Security Orchestration, Automation and Response) | Automazione della risposta agli incidenti con playbook | Automazione e orchestrazione |
| **XDR** (Extended Detection and Response) | Detection e response integrata su endpoint, rete, cloud, email | Detection unificata multi-layer |

> 💡 **In pratica:** Il SIEM rileva la minaccia → il SOAR automatizza la risposta → l'XDR fornisce contesto esteso. Molti SIEM moderni (come Microsoft Sentinel) integrano funzionalità SOAR e XDR.

---

## ⚙️ Come Funziona un SIEM

Il SIEM processa i dati attraverso un **pipeline** in 5 fasi:

```
┌─────────────┐    ┌──────────────┐    ┌──────────────┐    ┌───────────┐    ┌────────────┐
│  RACCOLTA   │───→│   PARSING /  │───→│ CORRELAZIONE │───→│ ALERTING  │───→│ DASHBOARD  │
│    LOG      │    │NORMALIZZAZ.  │    │              │    │           │    │ & REPORT   │
└─────────────┘    └──────────────┘    └──────────────┘    └───────────┘    └────────────┘
  Firewall           Estrazione         Regole di           Notifiche        Visualizzazione
  IDS/IPS            campi              correlazione        Email/Ticket     KPI e metriche
  Endpoint           Formato comune     Use case            Severity         Compliance
  Server             Arricchimento      Pattern matching    Escalation       Trend
  Cloud              Timestamp norm.    Threat Intel                         Reporting
  Applicazioni
```

### 1. Raccolta dei Log (Collection)

La prima fase consiste nel **raccogliere i log** da tutte le fonti dell'infrastruttura.

**Fonti principali:**

| Categoria | Esempi | Tipo di Log |
|-----------|--------|------------|
| **Rete** | Firewall, IDS/IPS, Router, Switch, Proxy | Connessioni, regole bloccate, alert IDS |
| **Endpoint** | Workstation, Server, Laptop | Processi, login, modifiche file, registry |
| **Applicazioni** | Web server, Database, ERP, CRM | Accessi, query, errori, transazioni |
| **Identità** | Active Directory, Azure AD, LDAP | Login, modifiche utenti, gruppi, policy |
| **Cloud** | AWS CloudTrail, Azure Activity, GCP | API call, configurazioni, accessi |
| **Email** | Exchange, O365, Gateway email | Email ricevute/inviate, allegati, spam |
| **Sicurezza** | Antivirus, EDR, DLP, WAF | Malware rilevato, comportamenti sospetti |

**Metodi di raccolta:**

| Metodo | Descrizione | Esempio |
|--------|-------------|---------|
| **Agent-based** | Software installato sull'host che invia i log | Splunk Universal Forwarder, Elastic Agent |
| **Agentless** | Raccolta senza software sull'host (pull) | WMI per Windows, SSH per Linux |
| **Syslog** | Protocollo standard per l'invio di log (UDP/TCP 514) | Firewall, switch, router |
| **API** | Raccolta tramite API REST | Cloud services (AWS, Azure, O365) |
| **File-based** | Lettura di file di log | Log files locali, CSV export |

**Formati comuni:**

| Formato | Utilizzato da | Descrizione |
|---------|---------------|-------------|
| **CEF** (Common Event Format) | ArcSight, molti vendor | Formato strutturato con header e campi chiave-valore |
| **LEEF** (Log Event Extended Format) | IBM QRadar | Formato proprietario IBM |
| **JSON** | API moderne, Cloud | Formato flessibile e leggibile |
| **Syslog (RFC 5424)** | Dispositivi di rete | Formato standard con priority, timestamp, message |
| **Windows Event Log (EVTX)** | Windows | Formato nativo degli eventi Windows |

### 2. Parsing e Normalizzazione

**Parsing:** È il processo di **estrazione dei campi significativi** da un log grezzo. Il SIEM prende una riga di log non strutturata e ne estrae informazioni come IP sorgente, porta, utente, azione, ecc.

**Esempio di parsing:**

```
Log grezzo (syslog di un firewall):
<134>Jun 24 10:23:45 fw01 DENY src=192.168.1.50 dst=10.0.0.1 
proto=TCP sport=54321 dport=445 action=blocked

Dopo il parsing, i campi estratti sono:
┌─────────────────────────────────────────┐
│ timestamp:   2024-06-24T10:23:45        │
│ source:      fw01                       │
│ src_ip:      192.168.1.50               │
│ dst_ip:      10.0.0.1                   │
│ protocol:    TCP                        │
│ src_port:    54321                       │
│ dst_port:    445                         │
│ action:      blocked                    │
│ severity:    informational (facility 16)│
└─────────────────────────────────────────┘
```

**Normalizzazione:** Dopo il parsing, i campi vengono mappati in un **formato comune** (schema normalizzato). Questo è fondamentale perché fonti diverse usano nomi diversi per gli stessi concetti.

**Esempio di normalizzazione:**

| Campo Normalizzato | Windows Event Log | Linux syslog | Firewall Palo Alto |
|--------------------|--------------------|--------------|-------------------|
| `src_ip` | `IpAddress` | `SRC` | `src` |
| `username` | `TargetUserName` | `user` | `srcuser` |
| `action` | `Keywords` | `action` | `action` |
| `timestamp` | `TimeCreated` | `timestamp` | `receive_time` |
| `event_type` | `EventID` | `facility` | `type` |

> 💡 **Perché è importante:** Senza normalizzazione, non si possono correlare eventi di fonti diverse. Se il firewall chiama l'IP sorgente `src` e Windows lo chiama `IpAddress`, il SIEM deve mapparli entrambi a `src_ip` per poterli confrontare.

### 3. Correlazione

La **correlazione** è il cuore dell'intelligenza del SIEM. Consiste nel **collegare eventi provenienti da fonti diverse** per identificare pattern di attacco che non sarebbero visibili analizzando ogni fonte singolarmente.

**Come funzionano le regole di correlazione:**

Una regola di correlazione definisce:
- **Condizioni** — Quali eventi cercare
- **Soglie** — Quanti eventi in quale arco temporale
- **Aggregazione** — Come raggruppare gli eventi (per IP, utente, ecc.)
- **Azione** — Cosa fare quando la regola è soddisfatta (generare alert)

**Esempio: Rilevamento Brute Force**
```
REGOLA: Brute Force Login Detection
SE:
  - Evento = Login Fallito (Windows EventID 4625 O SSH auth failure)
  - Conteggio >= 10 eventi
  - Nello stesso arco temporale <= 5 minuti
  - Dallo stesso IP sorgente
  - Verso lo stesso account
ALLORA:
  - Genera alert con severity HIGH
  - Invia notifica al team SOC
  - Arricchisci con threat intelligence sull'IP sorgente
```

**Esempio: Compromissione in più fasi**
```
REGOLA: Possible Account Compromise
SE:
  Fase 1: Login falliti multipli (>5 in 10 min) verso un account
  SEGUITA DA:
  Fase 2: Login riuscito dallo stesso IP sorgente sullo stesso account
  SEGUITA DA:
  Fase 3: Creazione di un nuovo account admin entro 30 minuti
ALLORA:
  - Genera alert con severity CRITICAL
  - Attiva il playbook di incident response
```

### 4. Alerting

Quando una regola di correlazione viene soddisfatta, il SIEM **genera un alert** con diverse informazioni.

**Livelli di severità degli alert:**

| Severity | Descrizione | Esempio | Azione Richiesta |
|----------|-------------|---------|-----------------|
| **Informational** | Attività da registrare, non malevola | Login riuscito fuori orario | Log, nessuna azione immediata |
| **Low** | Attività potenzialmente sospetta | Scansione porte da IP interno | Monitorare, verificare |
| **Medium** | Attività sospetta che richiede analisi | Brute force con pochi tentativi | Analisi Tier 1, possibile escalation |
| **High** | Minaccia probabile, richiede risposta | Brute force riuscito + accesso admin | Escalation Tier 2, investigazione |
| **Critical** | Minaccia confermata, impatto elevato | Ransomware attivo, data exfiltration | Risposta immediata, IR team |

**Esempio di alert generato:**

```
╔══════════════════════════════════════════════════════════════╗
║ ALERT: Brute Force Login - Severity: HIGH                   ║
╠══════════════════════════════════════════════════════════════╣
║ Rule:        BF-001 Multiple Failed Login Attempts           ║
║ Timestamp:   2024-06-24 10:23:45 UTC                         ║
║ Source IP:   185.220.101.34                                   ║
║ Target:      admin@azienda.it                                ║
║ Event Count: 47 failed logins in 3 minutes                   ║
║ Source:      Azure AD SigninLogs                              ║
║ MITRE ATT&CK: T1110.001 (Brute Force: Password Guessing)    ║
║ Threat Intel: IP flagged as TOR exit node on AbuseIPDB       ║
║ Action:      Investigate, consider IP block                   ║
╚══════════════════════════════════════════════════════════════╝
```

### 5. Dashboard e Reporting

Le **dashboard** forniscono una visualizzazione grafica dello stato di sicurezza dell'organizzazione.

**Tipi di dashboard:**

| Tipo | Destinatari | Contenuto |
|------|-------------|-----------|
| **Operativo** | Analisti SOC (Tier 1/2) | Alert in tempo reale, code, trend orari, top eventi |
| **Tattico** | SOC Manager, Team Lead | KPI (MTTD, MTTR), trend settimanali, performance team |
| **Strategico** | CISO, Management | Postura di sicurezza, risk score, compliance, trend annuali |

**KPI tipicamente visualizzati:**
- Numero di alert per severità
- MTTD e MTTR
- Top 10 IP sorgente bloccati
- Trend degli incidenti nel tempo
- Distribuzione geografica delle minacce
- Tasso di falsi positivi
- SLA compliance

---

## 🛠️ SIEM Principali sul Mercato

### Splunk

**Vendor:** Splunk (Cisco)  
**Linguaggio Query:** SPL (Search Processing Language)

**Caratteristiche:**
- Piattaforma leader di mercato con enormi capacità di ricerca e analisi
- Architettura scalabile e flessibile
- App marketplace ricchissimo (Splunk Enterprise Security per SIEM)
- Eccellente per Big Data e log analytics
- Community molto attiva

**Punti di forza:** Potenza del linguaggio SPL, scalabilità, flessibilità, ecosistema di app  
**Punti deboli:** Costo elevato (licenza basata su volume dati ingestiti), curva di apprendimento ripida  
**Quando si usa:** Enterprise con budget significativo, ambienti complessi con grandi volumi di dati

### Microsoft Sentinel

**Vendor:** Microsoft  
**Linguaggio Query:** KQL (Kusto Query Language)

**Caratteristiche:**
- SIEM cloud-native basato su Azure
- Integrazione nativa con l'ecosistema Microsoft (M365, Azure AD, Defender)
- SOAR integrato (Logic Apps)
- Modello di pricing pay-as-you-go
- Connettori predefiniti per centinaia di fonti
- Machine Learning integrato per detection avanzata

**Punti di forza:** Integrazione Microsoft, costo scalabile, cloud-native, SOAR integrato  
**Punti deboli:** Dipendenza da Azure, meno flessibile per ambienti non-Microsoft  
**Quando si usa:** Aziende con infrastruttura Microsoft/Azure, chi vuole un SIEM cloud-native

### IBM QRadar

**Vendor:** IBM  
**Linguaggio Query:** AQL (Ariel Query Language)

**Caratteristiche:**
- SIEM enterprise con forte capacità di correlazione
- QRadar SOAR per automazione della risposta
- Network Insights per analisi del traffico di rete
- Vulnerability management integrato
- Buon supporto per ambienti on-premise

**Punti di forza:** Correlazione potente, network analysis, compliance reporting  
**Punti deboli:** Interfaccia datata, costi di licenza elevati, complessità di gestione  
**Quando si usa:** Enterprise con infrastruttura on-premise, settori regolamentati

### Elastic SIEM (ELK Stack)

**Vendor:** Elastic  
**Linguaggio Query:** EQL (Event Query Language) / Lucene / KQL Elastic

**Caratteristiche:**
- Basato su **ELK Stack**: **E**lasticsearch (storage/search) + **L**ogstash (ingestion) + **K**ibana (visualizzazione)
- Open source (licenza Elastic) con opzioni commerciali
- Elastic Security per funzionalità SIEM e Endpoint
- Scalabilità orizzontale eccellente
- Detection rules community-driven

**Punti di forza:** Open source, costo contenuto, scalabilità, flessibilità, community attiva  
**Punti deboli:** Richiede competenze per installazione e gestione, meno "chiavi in mano"  
**Quando si usa:** Organizzazioni con competenze tecniche, budget limitato, chi vuole personalizzazione totale

### ArcSight

**Vendor:** OpenText (ex Micro Focus / HP)  
**Linguaggio Query:** Proprietario

**Caratteristiche:**
- Uno dei SIEM storici del mercato
- Forte capacità di correlazione con motore CORR-Engine
- Formato CEF (Common Event Format) come standard
- Buon supporto per ambienti enterprise complessi
- Certificazioni di sicurezza governative

**Punti di forza:** Correlazione avanzata, compliance, legacy enterprise  
**Punti deboli:** Interfaccia datata, complessità, costo elevato

### LogRhythm

**Vendor:** LogRhythm  
**Linguaggio Query:** Proprietario

**Caratteristiche:**
- SIEM all-in-one con SOAR e UEBA integrati
- NextGen SIEM Platform
- Facile da implementare rispetto ai competitor
- Buon supporto per il mid-market
- SmartResponse per automazione

**Punti di forza:** Facilità d'uso, all-in-one, buon rapporto qualità/prezzo  
**Punti deboli:** Scalabilità limitata per ambienti molto grandi

### Tabella Comparativa SIEM

| SIEM | Vendor | Query Language | Deployment | Punti di Forza |
|------|--------|---------------|------------|----------------|
| **Splunk** | Cisco/Splunk | SPL | On-prem/Cloud | Potenza, scalabilità, ecosistema |
| **Sentinel** | Microsoft | KQL | Cloud (Azure) | Integrazione MS, SOAR, pay-as-you-go |
| **QRadar** | IBM | AQL | On-prem/Cloud | Correlazione, network analysis |
| **Elastic SIEM** | Elastic | EQL/Lucene | On-prem/Cloud | Open source, flessibilità, costo |
| **ArcSight** | OpenText | Proprietario | On-prem | Correlazione, compliance gov. |
| **LogRhythm** | LogRhythm | Proprietario | On-prem/Cloud | All-in-one, facilità d'uso |

---

## 📝 Concetti Chiave del SIEM

### Log Source

Una **log source** è qualsiasi sistema, dispositivo o applicazione che genera log e li invia al SIEM. Ogni log source deve essere configurata con il tipo di log, il metodo di raccolta e il parser appropriato.

**Esempi:** Firewall Palo Alto, Windows Domain Controller, Web Server Apache, AWS CloudTrail, CrowdStrike EDR.

### Parser

Un **parser** è il componente che analizza i log grezzi ed **estrae i campi strutturati**. Ogni tipo di log richiede un parser specifico che conosce il formato del log.

**Come funziona:**
```
Input (log grezzo):
Jun 24 10:23:45 webserver apache: 192.168.1.50 - admin [24/Jun/2024:10:23:45] "GET /admin HTTP/1.1" 403 287

Parser Apache estrae:
  src_ip = 192.168.1.50
  user = admin
  timestamp = 2024-06-24T10:23:45
  method = GET
  url = /admin
  status_code = 403
  bytes = 287
```

### Normalizzazione

La normalizzazione **mappa i campi estratti in uno schema comune**, così che eventi da fonti diverse siano comparabili. Senza normalizzazione, non si possono creare regole di correlazione che funzionano su più fonti.

### Regole di Correlazione

Le regole di correlazione definiscono la **logica di detection**. Hanno una struttura tipica:
- **Condizione:** Tipo di evento, valori dei campi
- **Aggregazione:** Raggruppamento per IP, utente, host
- **Soglia:** Numero minimo di eventi
- **Finestra temporale:** Arco di tempo considerato
- **Azione:** Generazione alert, notifica, risposta automatica

### Use Case

Nel contesto SIEM, un **use case** è uno scenario di sicurezza completo che include: la minaccia da rilevare, la logica di detection, le fonti di log necessarie, la regola di correlazione e il playbook di risposta.

**Esempio di use case:**
```
Use Case: Rilevamento Account Compromesso
- Minaccia: Brute force seguito da accesso non autorizzato
- Fonti: Active Directory, VPN, Web Application
- Regola: >10 login falliti + 1 login riuscito in 15 min
- Alert: Severity HIGH
- Playbook: Verificare IP, resettare password, verificare attività post-login
```

### Dashboard

Le dashboard SIEM visualizzano i dati in tempo reale e storico. Devono essere progettate per il pubblico di riferimento: un analista Tier 1 ha bisogno della coda degli alert, un manager ha bisogno dei trend e dei KPI.

---

## 💻 Esempi di Query - Splunk (SPL)

### Query 1: Top 10 IP bloccati dal firewall

```spl
index=firewall sourcetype=paloalto action=blocked
| stats count by src_ip
| sort -count
| head 10
```

**Spiegazione riga per riga:**
- `index=firewall` → Cerca nell'indice "firewall"
- `sourcetype=paloalto` → Filtra per log del firewall Palo Alto
- `action=blocked` → Solo connessioni bloccate
- `| stats count by src_ip` → Conta gli eventi raggruppati per IP sorgente
- `| sort -count` → Ordina per conteggio decrescente
- `| head 10` → Mostra solo i primi 10 risultati

---

### Query 2: Login falliti su Windows negli ultimi 60 minuti

```spl
index=windows sourcetype=WinEventLog:Security EventCode=4625
earliest=-60m latest=now
| stats count by Account_Name, src_ip, Workstation_Name
| where count > 5
| sort -count
```

**Spiegazione:**
- `EventCode=4625` → Evento Windows "An account failed to log on"
- `earliest=-60m latest=now` → Ultimi 60 minuti
- `| stats count by Account_Name, src_ip` → Raggruppa per account e IP
- `| where count > 5` → Solo chi ha più di 5 tentativi falliti
- `| sort -count` → Ordina per conteggio decrescente

---

### Query 3: Ricerca traffico verso un IP sospetto specifico

```spl
index=* (src_ip="185.220.101.34" OR dst_ip="185.220.101.34")
| table _time, src_ip, dst_ip, src_port, dst_port, action, app
| sort _time
```

**Spiegazione:**
- `index=*` → Cerca in tutti gli indici
- `src_ip="..." OR dst_ip="..."` → Traffico da o verso l'IP sospetto
- `| table` → Mostra i campi selezionati in formato tabella
- `| sort _time` → Ordina cronologicamente

---

### Query 4: Rilevamento possibile brute force SSH

```spl
index=linux sourcetype=syslog "Failed password" OR "authentication failure"
| rex "from (?<attacker_ip>\d+\.\d+\.\d+\.\d+)"
| stats count as attempts by attacker_ip
| where attempts > 20
| sort -attempts
```

**Spiegazione:**
- `"Failed password" OR "authentication failure"` → Cerca tentativi di login falliti
- `| rex "from (?<attacker_ip>...)"` → Estrae l'IP dell'attaccante con regex
- `| stats count as attempts by attacker_ip` → Conta i tentativi per IP
- `| where attempts > 20` → Solo IP con più di 20 tentativi

---

### Query 5: Traffico DNS verso domini sospetti (possibile tunneling)

```spl
index=dns sourcetype=dns
| eval query_length=len(query)
| where query_length > 50
| stats count, avg(query_length) as avg_len by src_ip, query
| where count > 100
| sort -count
```

**Spiegazione:**
- `| eval query_length=len(query)` → Calcola la lunghezza della query DNS
- `| where query_length > 50` → Filtra query insolitamente lunghe
- `| stats count, avg(query_length)` → Statistiche per IP e dominio
- `| where count > 100` → Solo pattern ripetitivi (possibile tunneling)

---

### Query 6: Connessioni in uscita su porte non standard

```spl
index=firewall action=allowed direction=outbound
NOT (dst_port=80 OR dst_port=443 OR dst_port=53 OR dst_port=25)
| stats count by src_ip, dst_ip, dst_port
| where count > 50
| sort -count
```

**Spiegazione:**
- `direction=outbound` → Solo traffico in uscita
- `NOT (dst_port=80 OR ...)` → Esclude le porte standard
- Traffico frequente su porte non standard potrebbe indicare C2 o exfiltration

---

## 💻 Esempi di Query - Microsoft Sentinel (KQL)

### Query 1: Login falliti in Azure AD

```kql
SigninLogs
| where ResultType != 0
| where TimeGenerated > ago(1h)
| summarize FailedAttempts = count() by UserPrincipalName, IPAddress, Location
| where FailedAttempts > 5
| sort by FailedAttempts desc
```

**Spiegazione:**
- `SigninLogs` → Tabella dei log di accesso Azure AD
- `ResultType != 0` → Login non riusciti (0 = successo)
- `ago(1h)` → Ultima ora
- `summarize ... count() by` → Raggruppa e conta
- `FailedAttempts > 5` → Solo chi ha più di 5 fallimenti

---

### Query 2: Rilevamento brute force con login riuscito

```kql
let failed = SigninLogs
| where ResultType != 0
| where TimeGenerated > ago(30m)
| summarize FailCount = count() by UserPrincipalName, IPAddress
| where FailCount > 10;
let succeeded = SigninLogs
| where ResultType == 0
| where TimeGenerated > ago(30m)
| project UserPrincipalName, IPAddress, TimeGenerated;
failed
| join kind=inner succeeded on UserPrincipalName, IPAddress
| project UserPrincipalName, IPAddress, FailCount, TimeGenerated
```

**Spiegazione:**
- Definisce due dataset: `failed` (login falliti > 10) e `succeeded` (login riusciti)
- `join kind=inner` → Trova gli utenti con ENTRAMBI fallimenti e successi
- Risultato: potenziale brute force riuscito → alta priorità!

---

### Query 3: Ricerca traffico verso IP nella threat intelligence

```kql
let MaliciousIPs = externaldata(ip:string)
[@"https://example.com/threat-feed.csv"] with (format="csv");
CommonSecurityLog
| where TimeGenerated > ago(24h)
| where DestinationIP in (MaliciousIPs)
| summarize ConnectionCount = count() by SourceIP, DestinationIP, DeviceAction
| sort by ConnectionCount desc
```

**Spiegazione:**
- `externaldata` → Carica una lista di IP malevoli da un feed esterno
- `CommonSecurityLog` → Log dei dispositivi di sicurezza
- `DestinationIP in (MaliciousIPs)` → Filtra il traffico verso IP malevoli
- Risultato: identifica host interni che comunicano con C2 noti

---

### Query 4: Attività anomala - Login da paesi diversi in breve tempo (Impossible Travel)

```kql
SigninLogs
| where ResultType == 0
| where TimeGenerated > ago(24h)
| summarize Locations = make_set(Location), 
            LoginCount = count(),
            FirstLogin = min(TimeGenerated), 
            LastLogin = max(TimeGenerated)
  by UserPrincipalName
| where array_length(Locations) > 1
| extend TimeDiff = datetime_diff('minute', LastLogin, FirstLogin)
| where TimeDiff < 120
| sort by TimeDiff asc
```

**Spiegazione:**
- `make_set(Location)` → Raccoglie tutte le località di login uniche
- `array_length(Locations) > 1` → Utenti con login da più di una località
- `TimeDiff < 120` → Login da paesi diversi entro 2 ore (impossible travel)

---

### Query 5: Creazione di account amministrativi

```kql
AuditLogs
| where TimeGenerated > ago(7d)
| where OperationName == "Add member to role"
| extend RoleName = tostring(TargetResources[0].modifiedProperties[1].newValue)
| where RoleName contains "Admin"
| project TimeGenerated, 
          InitiatedBy = tostring(InitiatedBy.user.userPrincipalName),
          TargetUser = tostring(TargetResources[0].userPrincipalName),
          RoleName
| sort by TimeGenerated desc
```

**Spiegazione:**
- `AuditLogs` → Log di audit di Azure AD
- Filtra per aggiunta a ruoli che contengono "Admin"
- Mostra chi ha assegnato il ruolo admin, a chi e quando
- Utile per rilevare privilege escalation

---

## 🎯 Use Case Tipici del SIEM

### 1. Brute Force Detection

**Scenario:** Un attaccante tenta di indovinare le credenziali di un account provando migliaia di combinazioni di password.

**Logica di detection:**
- Cercare N login falliti (soglia: 10+) nello stesso arco temporale (5 minuti)
- Dallo stesso IP sorgente
- Verso lo stesso account target

**Regola di correlazione:**
```
SE: EventType = LoginFailed
    E count(events) >= 10
    IN timeframe <= 5 minuti
    RAGGRUPPATO PER src_ip, target_account
ALLORA: Alert "Brute Force Detected" - Severity HIGH
```

**Esempio alert:** "L'IP 185.220.101.34 ha tentato 47 login falliti sull'account admin@azienda.it in 3 minuti. L'IP risulta essere un nodo TOR. Nessun login riuscito registrato."

---

### 2. Login Anomalo

**Scenario a - Geolocalizzazione insolita:** Un utente che lavora dall'Italia si collega improvvisamente dalla Cina.

**Scenario b - Impossible Travel:** Lo stesso utente si collega dall'Italia alle 10:00 e dalla Russia alle 10:30 (impossibile viaggiare così velocemente).

**Scenario c - Orario anomalo:** Un dipendente che lavora dal lunedì al venerdì si collega alle 3:00 di domenica.

**Logica di detection:**
- Confrontare la località/orario del login con il baseline dell'utente
- Rilevare login da paesi mai usati prima
- Calcolare se il tempo di viaggio tra due login è fisicamente possibile

**Regola di correlazione:**
```
SE: EventType = LoginSuccess
    E Location != baseline_locations(user)
    E TimeSinceLastLogin < tempo_di_viaggio_minimo(old_location, new_location)
ALLORA: Alert "Impossible Travel Detected" - Severity HIGH
```

---

### 3. Comunicazione con IP Malevolo

**Scenario:** Un host interno comunica con un IP o dominio noto per essere un server Command & Control (C2).

**Logica di detection:**
- Integrare feed di Threat Intelligence (IOC: IP, domini, hash malevoli)
- Confrontare il traffico di rete con gli IOC
- Rilevare connessioni verso IP/domini in blacklist

**Regola di correlazione:**
```
SE: (dst_ip IN threat_intel_blacklist 
     OPPURE dns_query IN threat_intel_domains)
    E direction = outbound
ALLORA: Alert "Communication with Malicious IP" - Severity CRITICAL
```

**Fonti di Threat Intelligence:** VirusTotal, AbuseIPDB, AlienVault OTX, MISP, STIX/TAXII feeds.

---

### 4. Data Exfiltration

**Scenario:** Un utente o un malware trasferisce grandi quantità di dati al di fuori dell'organizzazione.

**Logica di detection:**
- Monitorare volumi di traffico in uscita anomali
- Rilevare upload di grandi dimensioni verso servizi cloud non autorizzati
- Identificare DNS tunneling (query DNS insolitamente lunghe e frequenti)
- Monitorare l'uso di protocolli di trasferimento file (FTP, SCP) verso destinazioni esterne

**Regola di correlazione:**
```
SE: direction = outbound
    E bytes_out > 500MB in 1 ora
    E dst_ip NOT IN whitelist_aziendali
ALLORA: Alert "Possible Data Exfiltration" - Severity HIGH
```

**Indicatori:** Traffico elevato fuori orario lavorativo, connessioni a servizi di file sharing, uso anomalo di DNS, traffico crittografato su porte non standard.

---

### 5. Privilege Escalation

**Scenario:** Un utente ottiene privilegi amministrativi in modo anomalo o non autorizzato.

**Logica di detection:**
- Monitorare le modifiche ai gruppi privilegiati (Domain Admins, Enterprise Admins)
- Rilevare l'uso di tool di escalation (mimikatz, PsExec)
- Identificare la creazione di account admin non pianificata

**Regola di correlazione:**
```
SE: (EventType = UserAddedToGroup E GroupName = "Domain Admins")
    OPPURE (EventType = AccountCreated E AccountType = Administrator)
    E InitiatedBy NOT IN authorized_admins
ALLORA: Alert "Unauthorized Privilege Escalation" - Severity CRITICAL
```

---

## ⚠️ Falsi Positivi vs Falsi Negativi

### Definizioni

| Tipo | Definizione | Esempio |
|------|------------|---------|
| **Falso Positivo (FP)** | Il SIEM genera un alert per un'attività che è in realtà **legittima** | Lo scanner di vulnerabilità interno genera alert di "port scan" |
| **Vero Positivo (VP)** | Il SIEM genera un alert per un'attività **realmente malevola** | Alert per brute force da un IP TOR → confermato come attacco |
| **Falso Negativo (FN)** | Il SIEM **NON** genera un alert per un'attività che è **realmente malevola** | Un ransomware si diffonde senza che il SIEM lo rilevi |
| **Vero Negativo (VN)** | Il SIEM **NON** genera alert per attività **effettivamente legittime** | Normale navigazione web non genera alert |

### Impatto sulla Sicurezza

| | Falso Positivo | Falso Negativo |
|---|---|---|
| **Rischio** | Alert fatigue, spreco di risorse | Minaccia non rilevata |
| **Conseguenza** | Gli analisti ignorano alert veri mescolati ai falsi | L'attaccante agisce indisturbato |
| **Frequenza** | Molto comune (30-50% degli alert) | Meno frequente ma devastante |
| **Pericolosità** | ⚠️ Media | 🔴 Alta |
| **Visibilità** | Facile da identificare | Difficile da scoprire |

> ⚠️ **I falsi negativi sono più pericolosi**: un falso positivo spreca tempo, ma un falso negativo significa che un attacco reale passa inosservato. L'obiettivo è ridurre entrambi, bilanciando sensibilità e specificità.

### Come Ridurre i Falsi Positivi

1. **Tuning delle regole:** Regolare soglie e condizioni delle regole di correlazione
2. **Whitelisting:** Escludere attività legittime note (scanner interni, backup, manutenzione)
3. **Contesto:** Aggiungere contesto alle regole (orario lavorativo, baseline utente)
4. **Threat Intelligence:** Arricchire gli alert con IOC per filtrare il rumore
5. **Machine Learning:** Utilizzare UEBA per apprendere il comportamento normale
6. **Feedback loop:** Gli analisti comunicano i falsi positivi al team di engineering
7. **Revisione periodica:** Rivedere le regole ogni mese per ottimizzarle

### Come Ridurre i Falsi Negativi

1. **Copertura:** Aumentare le fonti di log e le regole di correlazione
2. **Threat Hunting:** Cercare proattivamente minacce non rilevate
3. **Aggiornamento regole:** Integrare nuovi IoC e TTP conosciuti
4. **Test regolari:** Red team e purple team per verificare la detection
5. **MITRE ATT&CK mapping:** Verificare la copertura delle tecniche

---

## 📦 Log Retention e Compliance

### Cos'è la Log Retention

La **log retention** è la politica che definisce per **quanto tempo** i log devono essere conservati. È fondamentale per:
- **Investigazioni forensi:** Poter ricostruire un incidente avvenuto settimane o mesi fa
- **Compliance normativa:** Molte normative richiedono la conservazione dei log per periodi specifici
- **Trend analysis:** Analizzare pattern nel tempo
- **Legal hold:** Conservare le evidenze per eventuali procedimenti legali

### Normative e Periodi di Retention

| Normativa | Ambito | Periodo Retention Minimo | Tipo di Log |
|-----------|--------|--------------------------|-------------|
| **GDPR** (EU) | Dati personali | Non specificato (principio di minimizzazione) | Accessi ai dati personali, consensi |
| **PCI-DSS** | Pagamenti con carta | **1 anno** (3 mesi online) | Accessi ai sistemi di pagamento, transazioni |
| **SOX** | Società quotate USA | **7 anni** | Log finanziari, accessi ai sistemi contabili |
| **HIPAA** | Sanità USA | **6 anni** | Accessi ai dati sanitari, audit trail |
| **ISO 27001** | Sicurezza info (generico) | Definito dall'organizzazione | Tutti i log di sicurezza |
| **NIS2** (EU) | Infrastrutture critiche | **Almeno 6 mesi** | Log di sicurezza degli operatori essenziali |

### Livelli di Storage

I log vengono archiviati in livelli diversi in base all'età e alla frequenza di accesso:

| Livello | Descrizione | Periodo | Accesso | Costo |
|---------|-------------|---------|---------|-------|
| **Hot** | Storage primario, ricerca in tempo reale | 0-30 giorni | Immediato (secondi) | 💰💰💰 Alto |
| **Warm** | Storage secondario, ricerca più lenta | 30-90 giorni | Veloce (minuti) | 💰💰 Medio |
| **Cold** | Archivio a lungo termine, compresso | 90+ giorni | Lento (ore) | 💰 Basso |
| **Frozen/Archive** | Archivio offline, compliance | 1+ anno | Molto lento (giorni) | 💰 Minimo |

### Best Practice per la Log Retention

1. **Definire una policy:** Documentare i periodi di retention per ogni tipo di log
2. **Classificare i log:** Non tutti i log hanno la stessa importanza
3. **Automatizzare:** Configurare la rotazione e l'archiviazione automatica
4. **Crittografare:** Proteggere i log archiviati con crittografia
5. **Integrità:** Garantire che i log non possano essere modificati (write-once, hashing)
6. **Test di restore:** Verificare periodicamente che i log archiviati siano recuperabili
7. **Compliance mapping:** Mappare ogni requisito normativo ai tipi di log necessari

---

## 🎯 Domande da Colloquio

### Domanda 1: Cos'è un SIEM e perché è importante per un SOC?

**Risposta:**
Un SIEM (Security Information and Event Management) è una piattaforma che raccoglie, normalizza, correla e analizza i log provenienti da tutte le fonti dell'infrastruttura IT (firewall, endpoint, server, applicazioni, cloud) per rilevare minacce di sicurezza in tempo reale. È il **cuore del SOC** perché fornisce: visibilità centralizzata su tutta l'infrastruttura, correlazione automatica tra eventi di fonti diverse (un singolo attacco può generare log su firewall, AD e endpoint), alerting in tempo reale quando vengono rilevati pattern sospetti, dashboard per il monitoraggio operativo e strategico, e supporto alla compliance attraverso la conservazione e il reporting dei log. Senza un SIEM, gli analisti dovrebbero controllare manualmente decine di sistemi diversi, rendendo impossibile rilevare attacchi complessi che coinvolgono più componenti.

---

### Domanda 2: Descrivi il flusso di un evento nel SIEM, dalla raccolta all'alert.

**Risposta:**
Il flusso è composto da 5 fasi: **1) Raccolta (Collection):** I log vengono raccolti dalle fonti (firewall, endpoint, server) tramite diversi metodi come agent, syslog (porta 514), API o lettura di file. **2) Parsing:** Il SIEM analizza il log grezzo ed estrae i campi significativi (IP sorgente, destinazione, porta, utente, azione). **3) Normalizzazione:** I campi estratti vengono mappati in uno schema comune — ad esempio, "IpAddress" di Windows e "src" del firewall diventano entrambi "src_ip". Questo è fondamentale per la correlazione cross-source. **4) Correlazione:** Il motore di correlazione applica le regole definite agli eventi normalizzati. Per esempio, cerca 10+ login falliti dallo stesso IP in 5 minuti. **5) Alerting:** Quando una regola è soddisfatta, viene generato un alert con severity (da Informational a Critical), dettagli dell'evento, e possibili azioni. L'alert appare nella dashboard del SOC Analyst per il triage.

---

### Domanda 3: Cos'è la correlazione degli eventi e perché è fondamentale?

**Risposta:**
La correlazione è il processo con cui il SIEM **collega eventi provenienti da fonti diverse** per identificare pattern di attacco che non sarebbero visibili analizzando ogni fonte singolarmente. È fondamentale perché gli attacchi moderni coinvolgono più sistemi: un attacco brute force genera log sull'Active Directory, una connessione C2 genera log sul firewall, e l'esecuzione del malware genera log sull'EDR. Solo collegando questi eventi si può ricostruire la catena d'attacco completa. Per esempio, una regola di correlazione per brute force riuscito cerca: Fase 1 — più di 10 login falliti dallo stesso IP in 5 minuti, Fase 2 — un login riuscito dallo stesso IP sullo stesso account. Senza correlazione, i singoli login falliti sembrerebbero eventi isolati e non verrebbero segnalati.

---

### Domanda 4: Scrivi una query SPL per trovare i tentativi di login falliti nelle ultime 24 ore.

**Risposta:**
```spl
index=windows sourcetype=WinEventLog:Security EventCode=4625
earliest=-24h latest=now
| stats count as FailedAttempts by Account_Name, src_ip, Workstation_Name
| where FailedAttempts > 5
| sort -FailedAttempts
| table Account_Name, src_ip, Workstation_Name, FailedAttempts
```
Questa query cerca nell'indice Windows i log di sicurezza con EventCode 4625, che corrisponde all'evento "An account failed to log on". Filtra per le ultime 24 ore, raggruppa per nome account, IP sorgente e workstation, conta i tentativi falliti, filtra solo quelli con più di 5 fallimenti (per ridurre il rumore), e ordina per numero decrescente di tentativi. Mostra i risultati in formato tabella per facilitare l'analisi. Questa query è utile per identificare tentativi di brute force o password spraying.

---

### Domanda 5: Qual è la differenza tra falso positivo e falso negativo?

**Risposta:**
Un **falso positivo** è un alert generato dal SIEM per un'attività che è in realtà legittima — ad esempio, lo scanner di vulnerabilità interno che genera alert di "port scan" o un backup schedulato che trigger un alert di data exfiltration. I falsi positivi causano **alert fatigue**: se gli analisti ricevono troppi falsi allarmi, possono iniziare a ignorarli e rischiare di perdere minacce reali. Un **falso negativo** è una minaccia reale che il SIEM **non rileva** — ad esempio, un attacco che usa tecniche non coperte dalle regole di correlazione. I falsi negativi sono **più pericolosi** perché l'attaccante opera indisturbato senza che il SOC ne sia consapevole. L'obiettivo è ridurre entrambi: i falsi positivi si riducono con il tuning delle regole, il whitelisting e l'aggiunta di contesto; i falsi negativi si riducono con threat hunting proattivo, maggiore copertura delle fonti di log e aggiornamento continuo delle regole basato su nuovi TTP.

---

### Domanda 6: Come gestisci un alto numero di falsi positivi nel SIEM?

**Risposta:**
Per gestire un alto numero di falsi positivi adotto un approccio sistematico: **1) Analisi:** Identifico le regole che generano più falsi positivi e analizzo il perché — spesso la soglia è troppo bassa o manca contesto. **2) Tuning delle regole:** Modifico le condizioni, ad esempio aggiungendo filtri per escludere attività note (scanner di vulnerabilità, sistemi di backup) o alzando le soglie. **3) Whitelisting:** Creo whitelist per gli IP, account e servizi che generano falsi positivi ricorrenti, documentando il motivo di ogni whitelist. **4) Arricchimento contesto:** Aggiungo condizioni basate su contesto, come l'orario lavorativo o la geolocalizzazione. **5) Automazione:** Uso il SOAR per chiudere automaticamente i falsi positivi con pattern prevedibili, liberando tempo per gli analisti. **6) Feedback loop:** Comunico i pattern al Tier 3 per migliorare le regole. **7) Metriche:** Monitoro il tasso di falsi positivi nel tempo per verificare l'efficacia del tuning. L'obiettivo è ridurre il FP rate sotto il 30% senza sacrificare la capacità di detection.

---

### Domanda 7: Cos'è un use case SIEM? Fai un esempio.

**Risposta:**
Un use case SIEM è uno **scenario di sicurezza completo** che definisce: la minaccia da rilevare, le fonti di log necessarie, la logica di detection (regola di correlazione) e il playbook di risposta. Esempio: **Rilevamento Brute Force su RDP**. La minaccia è un attaccante che tenta di indovinare le credenziali di accesso RDP. Le fonti sono i log di Windows Security (EventCode 4625 per login falliti, 4624 per login riusciti) e i log del firewall (connessioni sulla porta 3389). La regola: se ci sono più di 15 login falliti sulla porta 3389 dallo stesso IP sorgente in 10 minuti, genera un alert HIGH. Se segue un login riuscito dallo stesso IP, escala a CRITICAL. Il playbook: Tier 1 verifica l'IP su threat intel, controlla se è un IP autorizzato (VPN aziendale), se sospetto lo escala al Tier 2 che blocca l'IP sul firewall e verifica se l'account è stato compromesso.

---

### Domanda 8: Quali sono i principali SIEM sul mercato e come li confronteresti?

**Risposta:**
I principali SIEM sono: **Splunk** — leader di mercato con il potente linguaggio SPL, eccellente per big data analytics e ambienti complessi, ma con costi elevati basati sul volume di dati. **Microsoft Sentinel** — SIEM cloud-native con KQL, ideale per aziende con ecosistema Microsoft/Azure, modello pay-as-you-go, SOAR integrato con Logic Apps. **IBM QRadar** — forte nella correlazione e nell'analisi di rete, buono per ambienti on-premise e settori regolamentati. **Elastic SIEM (ELK)** — basato su Elasticsearch, open source, ottimo rapporto qualità/prezzo, ma richiede competenze tecniche per la gestione. **ArcSight** — SIEM storico con forte correlazione, usato in ambito governativo. **LogRhythm** — soluzione all-in-one con SOAR e UEBA integrati, buona per il mid-market. La scelta dipende da: budget (Elastic per costi contenuti, Splunk per investimenti enterprise), infrastruttura (Sentinel per Microsoft, QRadar per on-premise), competenze del team (LogRhythm per facilità d'uso) e volumi di dati da gestire.

---

### Domanda 9: Cosa sono i log source e perché la normalizzazione è importante?

**Risposta:**
Una **log source** è qualsiasi sistema, dispositivo o applicazione che genera log di sicurezza e li invia al SIEM: firewall, endpoint, server, applicazioni web, servizi cloud, sistemi di autenticazione, ecc. La **normalizzazione** è il processo fondamentale che mappa i campi dei log di fonti diverse in uno schema comune. È importante perché ogni vendor usa nomi diversi per gli stessi concetti: Windows chiama l'IP sorgente "IpAddress", il firewall Palo Alto lo chiama "src", Linux lo chiama "SRC". Senza normalizzazione, il SIEM non potrebbe correlare un evento di login fallito su Windows con una connessione bloccata sul firewall dallo stesso IP, perché userebbe nomi di campo diversi. La normalizzazione permette di scrivere regole di correlazione che funzionano su tutte le fonti simultaneamente, abilitando la detection di attacchi multi-stage che attraversano diversi sistemi dell'infrastruttura.

---

### Domanda 10: Cos'è la log retention e quali normative la regolano?

**Risposta:**
La **log retention** è la politica che definisce per quanto tempo i log devono essere conservati nell'organizzazione. È importante per tre motivi: **investigazioni forensi** (poter ricostruire un incidente avvenuto settimane o mesi fa), **compliance normativa** (le normative richiedono periodi minimi di conservazione) e **trend analysis** (analizzare pattern di attacco nel tempo). Le principali normative sono: **PCI-DSS** richiede 1 anno di retention per i log relativi ai sistemi di pagamento, con almeno 3 mesi immediatamente disponibili; **SOX** richiede 7 anni per i log dei sistemi finanziari; **HIPAA** richiede 6 anni per i log di accesso ai dati sanitari; **GDPR** non specifica un periodo fisso ma richiede il principio di minimizzazione. I log vengono archiviati in livelli: **hot** (0-30 giorni, accesso immediato), **warm** (30-90 giorni, accesso veloce), **cold** (90+ giorni, archiviazione compressa), bilanciando costi di storage e necessità di accesso.
