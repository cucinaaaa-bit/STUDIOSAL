# 🏰 Strumenti di Difesa e Sicurezza

> Guida completa agli strumenti e alle tecnologie utilizzate per proteggere infrastrutture,
> reti, endpoint e dati. Ogni sezione include spiegazioni pratiche, esempi reali e comandi
> utilizzabili in ambienti di laboratorio e produzione.

---

## 🏰 Defense in Depth (Difesa in Profondità)

### Concetto e Filosofia

La **Defense in Depth** è una strategia di sicurezza che prevede l'implementazione di **molteplici livelli di protezione** sovrapposti. L'idea è semplice: se un attaccante riesce a superare un livello, ne troverà un altro ad attenderlo.

Questa filosofia deriva dal mondo militare: un castello non ha solo le mura esterne, ma anche fossati, torri di guardia, porte rinforzate e guardie armate all'interno.

### Diagramma Testuale dei Livelli

```
┌─────────────────────────────────────────────────────────┐
│                   🌐 PERIMETRO                          │
│  Firewall, DMZ, WAF, IPS perimetrale                   │
│  ┌─────────────────────────────────────────────────┐    │
│  │              🔀 RETE                            │    │
│  │  Segmentazione, VLAN, IDS/IPS, NAC             │    │
│  │  ┌─────────────────────────────────────────┐    │    │
│  │  │           💻 HOST                       │    │    │
│  │  │  EDR, Antivirus, Hardening OS, Patch    │    │    │
│  │  │  ┌─────────────────────────────────┐    │    │    │
│  │  │  │      📱 APPLICAZIONE            │    │    │    │
│  │  │  │  WAF, Input Validation, AuthN   │    │    │    │
│  │  │  │  ┌─────────────────────────┐    │    │    │    │
│  │  │  │  │      📦 DATI            │    │    │    │    │
│  │  │  │  │  Encryption, DLP, ACL   │    │    │    │    │
│  │  │  │  │  Backup, Classificazione│    │    │    │    │
│  │  │  │  └─────────────────────────┘    │    │    │    │
│  │  │  └─────────────────────────────────┘    │    │    │
│  │  └─────────────────────────────────────────┘    │    │
│  └─────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
```

### Perché un Singolo Strumento Non Basta

| Scenario | Problema con un solo livello |
|----------|------------------------------|
| Solo firewall | Un malware via email bypassa il firewall (traffico HTTPS consentito) |
| Solo antivirus | Un attacco 0-day non viene rilevato dalla signature |
| Solo IDS | Rileva l'attacco ma non lo blocca |
| Solo VPN | Protegge il transito ma non l'endpoint compromesso |
| Solo encryption | I dati sono cifrati ma l'attaccante ha rubato le credenziali |

**Principio chiave**: nessun singolo strumento è infallibile. La combinazione di più livelli riduce drasticamente la probabilità che un attacco abbia successo end-to-end.

---

## 🔥 Firewall

### Cos'è un Firewall e Dove si Posiziona

Un **firewall** è un dispositivo (hardware o software) che **filtra il traffico di rete** in base a regole predefinite. Si posiziona tipicamente:

- **Tra la rete interna e Internet** (perimetro)
- **Tra segmenti di rete** (segmentazione interna)
- **Sulla DMZ** per proteggere i server esposti

```
Internet ──── [Firewall Perimetrale] ──── LAN Interna
                      │
                      ├── DMZ (Web Server, Mail Server)
                      │
                      └── [Firewall Interno] ── Rete Sensibile
```

### Stateless Firewall

Un firewall **stateless** esamina ogni pacchetto in modo **indipendente**, senza tenere traccia delle connessioni attive.

**Come funziona:**
- Analizza solo gli header del pacchetto: IP sorgente, IP destinazione, porta, protocollo
- Ogni pacchetto viene valutato contro le regole ACL (Access Control List)
- Non sa se un pacchetto fa parte di una connessione già stabilita

**Limiti:**
- Non distingue tra traffico legittimo di risposta e traffico malevolo
- Richiede regole esplicite sia per il traffico in uscita che in entrata
- Vulnerabile a spoofing e attacchi basati su stato della connessione

**Esempio di ACL stateless (stile Cisco):**
```
access-list 100 permit tcp any host 192.168.1.10 eq 80
access-list 100 permit tcp any host 192.168.1.10 eq 443
access-list 100 deny ip any any
```

### Stateful Firewall

Un firewall **stateful** tiene traccia dello **stato delle connessioni** in una tabella delle connessioni (state table).

**Come funziona:**
- Quando una connessione viene iniziata dall'interno, il firewall la registra
- I pacchetti di risposta vengono automaticamente consentiti
- Se arriva un pacchetto che non corrisponde a una connessione esistente, viene bloccato

**Vantaggi rispetto allo stateless:**
- Più sicuro: riconosce il traffico di ritorno legittimo
- Meno regole da gestire: non servono regole per il traffico di ritorno
- Rileva pacchetti anomali (es. SYN-ACK senza SYN precedente)

**Esempio concettuale di state table:**

| Source IP | Source Port | Dest IP | Dest Port | Stato | Timeout |
|-----------|-------------|---------|-----------|-------|---------|
| 10.0.1.5 | 49321 | 8.8.8.8 | 443 | ESTABLISHED | 3600s |
| 10.0.1.12 | 50112 | 93.184.216.34 | 80 | SYN_SENT | 30s |
| 10.0.1.8 | 51200 | 172.217.14.99 | 443 | ESTABLISHED | 3600s |

### Next-Generation Firewall (NGFW)

Un **NGFW** aggiunge funzionalità avanzate rispetto a un firewall stateful tradizionale:

| Funzionalità | Descrizione |
|--------------|-------------|
| **DPI** (Deep Packet Inspection) | Analizza il contenuto del pacchetto, non solo gli header |
| **Application Awareness** | Identifica le applicazioni (es. distingue YouTube da Netflix sulla porta 443) |
| **IPS Integrato** | Sistema di prevenzione intrusioni incorporato |
| **SSL/TLS Inspection** | Decifra il traffico HTTPS per ispezionarlo |
| **URL Filtering** | Blocca categorie di siti web |
| **Threat Intelligence** | Feed in tempo reale su IP/domini malevoli |
| **User Identity Awareness** | Regole basate su utente/gruppo, non solo IP |
| **Sandboxing** | Analisi file sospetti in ambiente isolato |

### Come Leggere le Regole Firewall

Una regola firewall tipica ha questo formato:

```
[Numero/Nome]  [Action]  [Protocol]  [Source]  [Source Port]  [Destination]  [Dest Port]  [Extra]
```

**Campi principali:**

| Campo | Descrizione | Esempio |
|-------|-------------|---------|
| **Action** | Cosa fare col pacchetto | ALLOW, DENY, DROP, REJECT |
| **Protocol** | Protocollo di rete | TCP, UDP, ICMP, ANY |
| **Source** | IP/rete sorgente | 10.0.1.0/24, any |
| **Source Port** | Porta sorgente | any, 1024-65535 |
| **Destination** | IP/rete destinazione | 192.168.1.10, any |
| **Dest Port** | Porta destinazione | 80, 443, 22 |
| **Direction** | Direzione del traffico | inbound, outbound |

### Vendor Principali

#### 🟦 Palo Alto Networks
- **Sistema operativo**: PAN-OS
- **Punto di forza**: **App-ID** – identifica le applicazioni indipendentemente da porta o protocollo
- **Caratteristiche**: Zero Trust, WildFire (sandboxing cloud), Panorama (gestione centralizzata)
- **Uso tipico**: Enterprise di grandi dimensioni, ambienti cloud ibridi

#### 🟩 Fortinet FortiGate
- **Sistema operativo**: FortiOS
- **Punto di forza**: **UTM** (Unified Threat Management) – tutto in uno
- **Caratteristiche**: ASIC custom per alte prestazioni, Security Fabric, FortiGuard Labs
- **Uso tipico**: PMI e enterprise, ottimo rapporto prezzo/prestazioni

#### 🟥 Cisco ASA / Firepower
- **ASA**: Firewall stateful tradizionale, molto diffuso
- **Firepower**: NGFW con Snort IPS integrato e Talos threat intelligence
- **Uso tipico**: Grandi enterprise con ecosistema Cisco esistente

#### 🟧 pfSense (Open Source)
- **Basato su**: FreeBSD
- **Punto di forza**: Gratuito, altamente configurabile, community attiva
- **Caratteristiche**: VPN, traffic shaping, proxy, IDS/IPS (con Snort/Suricata)
- **Uso tipico**: Lab, piccole aziende, homelab, ambienti di formazione

### Esempio di Regola Firewall in Formato Tabellare

| # | Azione | Protocollo | Sorgente | Porta Sorg. | Destinazione | Porta Dest. | Descrizione |
|---|--------|------------|----------|-------------|--------------|-------------|-------------|
| 1 | ALLOW | TCP | 10.0.1.0/24 | any | 192.168.10.5 | 443 | Accesso HTTPS al web server |
| 2 | ALLOW | TCP | 10.0.2.0/24 | any | 192.168.10.10 | 3389 | RDP per IT admin |
| 3 | ALLOW | UDP | any | any | 8.8.8.8 | 53 | Query DNS verso Google |
| 4 | DENY | TCP | any | any | 192.168.10.0/24 | 22 | Blocco SSH dall'esterno |
| 5 | DENY | ANY | any | any | any | any | **Regola implicita: nega tutto** |

> ⚠️ **Nota**: Le regole vengono valutate **dall'alto verso il basso** (top-down). La prima regola che corrisponde viene applicata. L'ultima regola è sempre un **deny all** implicito.

---

## 🔍 IDS vs IPS

### IDS – Intrusion Detection System

Un **IDS** è un sistema che **monitora** il traffico di rete o l'attività su un host alla ricerca di comportamenti sospetti o malevoli. Quando rileva qualcosa, **genera un allarme** ma **non blocca** il traffico.

- **Modalità**: passiva, out-of-band
- **Azione**: alerta il SOC/SIEM
- **Rischio**: l'attacco potrebbe avere successo prima che qualcuno reagisca

### IPS – Intrusion Prevention System

Un **IPS** fa tutto ciò che fa un IDS, ma è posizionato **inline** nel flusso di traffico, quindi può **bloccare attivamente** i pacchetti malevoli.

- **Modalità**: attiva, inline
- **Azione**: blocca/droppa il traffico sospetto in tempo reale
- **Rischio**: falsi positivi possono bloccare traffico legittimo

### Posizionamento nella Rete

```
                    IDS (Out-of-Band / Mirroring)
                          │
                          │ copia del traffico
                          │ (SPAN/TAP)
Internet ── [Firewall] ──┼──── Switch ──── LAN
                          │
                     IPS (Inline)
                     blocca in tempo reale
```

| Caratteristica | IDS | IPS |
|---------------|-----|-----|
| Posizione | Out-of-band (SPAN port) | Inline (nel flusso del traffico) |
| Azione | Solo alert | Alert + blocco |
| Impatto su rete | Nessuno (passivo) | Può causare latenza |
| Rischio falsi positivi | Genera alert inutili | Blocca traffico legittimo |
| Tempo di risposta | Manuale (operatore) | Automatico (millisecondi) |

### Metodi di Rilevamento

#### 🔎 Signature-Based Detection
- **Come funziona**: confronta il traffico con un database di **firme note** (pattern di attacchi conosciuti)
- **Pro**: basso tasso di falsi positivi, veloce, preciso per minacce note
- **Contro**: non rileva attacchi **0-day** o varianti sconosciute
- **Esempio**: una regola che cerca la stringa `/etc/passwd` in una richiesta HTTP

#### 🔎 Anomaly-Based Detection
- **Come funziona**: stabilisce una **baseline** del comportamento normale e segnala le deviazioni
- **Pro**: può rilevare attacchi **0-day** e comportamenti nuovi
- **Contro**: alto tasso di **falsi positivi**, richiede tuning e training
- **Esempio**: un utente che normalmente genera 10MB/giorno improvvisamente genera 10GB

#### 🔎 Hybrid Detection
- Combina entrambi i metodi per massimizzare la copertura
- Usa le signature per le minacce note e l'anomaly detection per quelle sconosciute

### Strumenti Principali

#### 🐷 Snort

**Snort** è un IDS/IPS open source creato da Martin Roesch (ora parte di Cisco/Talos). È lo standard de facto per il rilevamento di intrusioni basato su signature.

**Modalità di funzionamento:**

| Modalità | Descrizione | Comando |
|----------|-------------|---------|
| **Sniffer** | Mostra i pacchetti a schermo | `snort -v` |
| **Packet Logger** | Salva i pacchetti su disco | `snort -dev -l /var/log/snort` |
| **NIDS** | Network IDS con regole | `snort -c /etc/snort/snort.conf -A alert_fast` |

**Esempio completo di regola Snort con spiegazione:**

```
alert tcp $EXTERNAL_NET any -> $HOME_NET 80 (msg:"WEB-ATTACKS /etc/passwd access"; 
flow:to_server,established; content:"/etc/passwd"; nocase; 
classtype:web-application-attack; sid:1122334; rev:1;)
```

| Campo | Valore | Spiegazione |
|-------|--------|-------------|
| `alert` | Azione | Genera un allarme (altre opzioni: log, pass, drop, reject) |
| `tcp` | Protocollo | Si applica al traffico TCP |
| `$EXTERNAL_NET` | IP sorgente | Variabile: qualsiasi IP esterno alla rete |
| `any` | Porta sorgente | Qualsiasi porta sorgente |
| `->` | Direzione | Traffico unidirezionale (da sorgente a destinazione) |
| `$HOME_NET` | IP destinazione | Variabile: la nostra rete interna |
| `80` | Porta destinazione | Porta HTTP |
| `msg:` | Messaggio | Descrizione dell'allarme nei log |
| `flow:to_server,established` | Stato connessione | Solo connessioni TCP stabilite, direzione server |
| `content:"/etc/passwd"` | Pattern | Cerca questa stringa nel payload del pacchetto |
| `nocase` | Modificatore | Ricerca case-insensitive |
| `classtype:` | Classificazione | Categoria dell'attacco |
| `sid:` | Signature ID | Identificatore univoco della regola |
| `rev:` | Revisione | Versione della regola |

#### 🦈 Suricata

**Suricata** è un IDS/IPS/NSM open source sviluppato dalla Open Information Security Foundation (OISF).

**Confronto Snort vs Suricata:**

| Caratteristica | Snort | Suricata |
|---------------|-------|----------|
| **Threading** | Single-threaded | **Multi-threaded** |
| **Performance** | Buone su singolo core | Eccellenti su multi-core |
| **Output** | Unified2, alert_fast | **EVE JSON** (strutturato) |
| **Compatibilità regole** | Regole Snort | Compatibile con regole Snort + estensioni |
| **File extraction** | Limitata | Nativa |
| **Protocolli** | Buon supporto | Supporto esteso (HTTP, TLS, DNS, SMB, etc.) |
| **Licenza** | GPL v2 | GPL v2 |

**Esempio di output EVE JSON di Suricata:**
```json
{
  "timestamp": "2024-01-15T14:32:11.123456+0100",
  "flow_id": 1234567890,
  "event_type": "alert",
  "src_ip": "203.0.113.50",
  "src_port": 49321,
  "dest_ip": "192.168.1.10",
  "dest_port": 80,
  "proto": "TCP",
  "alert": {
    "action": "allowed",
    "gid": 1,
    "signature_id": 2024897,
    "rev": 3,
    "signature": "ET WEB_SERVER Possible SQL Injection Attempt",
    "category": "Web Application Attack",
    "severity": 1
  }
}
```

**Comando di avvio Suricata:**
```bash
# Avvio in modalità IDS su interfaccia eth0
suricata -c /etc/suricata/suricata.yaml -i eth0

# Avvio in modalità IPS con NFQueue
suricata -c /etc/suricata/suricata.yaml -q 0
```

#### 🔬 Zeek (ex Bro)

**Zeek** non è un IDS tradizionale basato su signature, ma un **network security monitor** che genera **log strutturati** dettagliati del traffico di rete. È potentissimo per l'analisi forense e il threat hunting.

**Log principali generati da Zeek:**

| File di Log | Contenuto |
|-------------|-----------|
| `conn.log` | Tutte le connessioni TCP/UDP/ICMP (5-tuple, durata, byte) |
| `dns.log` | Query e risposte DNS |
| `http.log` | Richieste HTTP (method, URI, user-agent, status code) |
| `files.log` | File trasferiti sulla rete (hash, tipo MIME, sorgente) |
| `ssl.log` | Handshake TLS/SSL (versione, cipher, certificato) |
| `notice.log` | Alert e notifiche generate da script Zeek |
| `weird.log` | Anomalie di protocollo |

**Esempio di `conn.log`:**
```
#fields	ts	uid	id.orig_h	id.orig_p	id.resp_h	id.resp_p	proto	service	duration	orig_bytes	resp_bytes
1705312800.123	CYfx7a3	10.0.1.5	49321	93.184.216.34	80	tcp	http	1.23	350	12540
1705312801.456	Dh3Rk21	10.0.1.12	50112	8.8.8.8	53	udp	dns	0.05	42	128
```

**Esempio di `dns.log`:**
```
#fields	ts	uid	id.orig_h	query	qtype_name	rcode_name	answers
1705312800.100	CYfx7a3	10.0.1.5	evil-domain.com	A	NOERROR	203.0.113.66
1705312800.200	Bk9La32	10.0.1.8	google.com	A	NOERROR	142.250.184.46
```

**Avvio di Zeek:**
```bash
# Analisi in tempo reale su interfaccia
zeek -i eth0

# Analisi di un file PCAP
zeek -r capture.pcap

# Analisi con script personalizzati
zeek -i eth0 local custom-script.zeek
```

---

## 🛡️ EDR (Endpoint Detection and Response)

### Cos'è l'EDR

Un **EDR** è una soluzione di sicurezza che monitora continuamente gli **endpoint** (laptop, desktop, server) raccogliendo telemetria dettagliata su processi, connessioni di rete, modifiche ai file e al registro di sistema.

### Tabella Comparativa: Antivirus Tradizionale vs EDR

| Caratteristica | Antivirus Tradizionale | EDR |
|---------------|----------------------|-----|
| **Approccio** | Basato su firme/signature | Comportamentale + firma + ML |
| **Rilevamento** | Minacce note | Minacce note E sconosciute |
| **Visibilità** | Scansione periodica | Telemetria continua 24/7 |
| **Risposta** | Quarantena file | Isolamento host, kill process, remediation |
| **Forensics** | Limitata | Timeline completa degli eventi |
| **Threat Hunting** | Non supportato | Query avanzate sulla telemetria |
| **Gestione** | Locale o console base | Console cloud centralizzata |
| **Costo** | Basso | Medio-alto |
| **Complessità** | Bassa (install & forget) | Media (richiede analisti SOC) |

### Funzionalità Chiave dell'EDR

#### 📡 Telemetria Continua
L'agent EDR installato sull'endpoint raccoglie **continuamente** dati su:
- Processi avviati e loro relazioni padre-figlio (process tree)
- Connessioni di rete in entrata e uscita
- Modifiche ai file e al registro di sistema
- Caricamento di DLL e driver
- Comandi eseguiti (PowerShell, CMD, bash)
- Login e attività utente

#### 🧠 Rilevamento Comportamentale
Invece di cercare solo firme note, l'EDR analizza i **comportamenti** sospetti:

```
Esempio di catena sospetta rilevata dall'EDR:

1. outlook.exe scarica attachment.docx
2. WINWORD.EXE apre attachment.docx
3. WINWORD.EXE lancia cmd.exe (SOSPETTO: Word non dovrebbe lanciare cmd)
4. cmd.exe esegue: powershell -enc [base64 encoded command]  (SOSPETTO: PowerShell encoded)
5. powershell.exe si connette a 203.0.113.50:4444  (SOSPETTO: reverse shell)
6. powershell.exe scarica ed esegue mimikatz.exe  (CRITICO: credential dumping)

→ EDR genera alert: "Possibile attacco via macro con lateral movement"
→ EDR azione automatica: isola l'endpoint dalla rete
```

#### 🔒 Isolamento Endpoint da Remoto
L'analista SOC può **isolare** un endpoint compromesso dalla rete con un click, mantenendo solo la comunicazione con la console EDR per continuare l'analisi.

#### 🔍 Threat Hunting
Capacità di eseguire **query proattive** sulla telemetria raccolta per cercare minacce non ancora rilevate.

#### 🕵️ Forensics: Timeline degli Eventi
L'EDR mantiene una **timeline cronologica** di tutti gli eventi sull'endpoint, permettendo di ricostruire esattamente cosa è successo, quando e come.

### Vendor Principali

#### 🟥 CrowdStrike Falcon
- **Architettura**: Agent leggero + cloud backend
- **Punto di forza**: Threat intelligence eccellente (team OverWatch), velocità di deployment
- **Threat Hunting**: Managed threat hunting incluso nei piani premium
- **Linguaggio query**: **Falcon Query Language (FQL)**

#### 🟦 Microsoft Defender for Endpoint
- **Architettura**: Integrato in Windows, console cloud (Microsoft 365 Defender)
- **Punto di forza**: Integrazione nativa con l'ecosistema Microsoft (Azure AD, Intune, Sentinel)
- **Linguaggio query**: **KQL (Kusto Query Language)**
- **Vantaggio**: Già incluso in licenze Microsoft 365 E5

#### 🟪 SentinelOne
- **Architettura**: Agent autonomo con AI locale
- **Punto di forza**: **Autonomous response** – può rimediare automaticamente senza intervento umano
- **Caratteristica unica**: Storyline™ – ricostruisce automaticamente la catena di attacco
- **Rollback**: Può ripristinare lo stato dell'endpoint pre-attacco

#### ⬛ VMware Carbon Black
- **Architettura**: Cloud o on-premise
- **Punto di forza**: Forte nelle funzionalità di audit e compliance
- **Caratteristica**: Registrazione continua di tutti gli eventi (recording)
- **Uso tipico**: Ambienti enterprise con requisiti di compliance stringenti

### Esempio di Query di Threat Hunting

**Scenario**: cercare processi PowerShell sospetti che si connettono a IP esterni.

**KQL (Microsoft Defender for Endpoint):**
```kql
DeviceProcessEvents
| where Timestamp > ago(7d)
| where FileName == "powershell.exe"
| where ProcessCommandLine has_any ("-enc", "-encoded", "downloadstring", 
         "invoke-webrequest", "Net.WebClient", "bypass")
| join kind=inner (
    DeviceNetworkEvents
    | where RemoteIPType == "Public"
    | where ActionType == "ConnectionSuccess"
) on DeviceId, InitiatingProcessId
| project Timestamp, DeviceName, ProcessCommandLine, RemoteIP, RemotePort
| sort by Timestamp desc
```

**Spiegazione**: questa query cerca negli ultimi 7 giorni tutti i processi `powershell.exe` che hanno usato comandi sospetti (encoding, download) e che si sono anche connessi a IP pubblici.

---

## 🌐 XDR (Extended Detection and Response)

### Evoluzione dell'EDR

L'**XDR** estende il concetto dell'EDR oltre l'endpoint, **correlando dati** provenienti da molteplici fonti:

```
         ┌──────────────┐
         │     XDR      │
         │  (Correla    │
         │   tutto)     │
         └──────┬───────┘
                │
    ┌───────────┼───────────┐───────────┐───────────┐
    │           │           │           │           │
 Endpoint    Network      Email       Cloud      Identity
 (EDR)      (NTA/IDS)   (Gateway)   (CASB)     (IAM/AD)
```

### Differenze tra EDR e XDR

| Caratteristica | EDR | XDR |
|---------------|-----|-----|
| **Scope** | Solo endpoint | Endpoint + rete + email + cloud + identity |
| **Correlazione** | Eventi su singolo endpoint | Correlazione cross-domain |
| **Visibilità** | Processi, file, registro | Vista unificata su tutta l'infrastruttura |
| **Alert** | Per singolo evento endpoint | Alert correlati e contestualizzati |
| **Esempio** | "PowerShell sospetto su PC-01" | "Email phishing → download malware → lateral movement → esfiltrazione dati" |
| **Complessità** | Media | Alta (più integrazioni) |
| **Vendor** | Molti specializzati | Spesso vendor unico (piattaforma) |

### Vantaggi dell'XDR

- **Visibilità unificata**: un unico pannello per vedere tutto
- **Meno alert fatigue**: correla gli eventi e riduce i falsi positivi raggruppando alert correlati in **incidenti**
- **Risposta più rapida**: quando rileva un attacco multi-fase, può rispondere su tutti i vettori contemporaneamente
- **Esempio pratico**: un attacco di phishing viene tracciato dall'email iniziale, attraverso il download del malware sull'endpoint, fino al tentativo di lateral movement sulla rete, tutto in un'unica timeline

---

## 🤖 SOAR (Security Orchestration, Automation and Response)

### Cos'è il SOAR

Il **SOAR** è una piattaforma che combina tre pilastri per automatizzare e velocizzare le operazioni del SOC:

| Pilastro | Descrizione | Esempio |
|----------|-------------|---------|
| **Orchestration** | Integra e coordina molteplici strumenti di sicurezza | Connette SIEM, firewall, EDR, threat intel |
| **Automation** | Esegue task ripetitivi senza intervento umano | Arricchimento IOC automatico, blocco IP |
| **Response** | Esegue azioni di risposta agli incidenti | Isola host, disabilita utente, contiene minaccia |

### Come Automatizza il Lavoro del SOC

Senza SOAR:
```
1. Analista riceve alert dal SIEM
2. Copia l'IP sospetto
3. Lo cerca manualmente su VirusTotal
4. Lo cerca su AbuseIPDB
5. Controlla se è già in blacklist del firewall
6. Se malevolo, accede al firewall e crea regola di blocco
7. Aggiorna il ticket
8. Notifica il team
→ Tempo medio: 15-30 minuti per alert
```

Con SOAR:
```
1. Alert arriva dal SIEM
2. Playbook SOAR si attiva automaticamente
3. Arricchimento IOC: VirusTotal + AbuseIPDB + AlienVault OTX (2 secondi)
4. Se malevolo: blocco automatico su firewall (1 secondo)
5. Creazione ticket con tutti i dettagli (1 secondo)
6. Notifica automatica su Slack/Teams (1 secondo)
→ Tempo medio: 5-10 secondi per alert
```

### Esempi Concreti di Automazione

#### 1️⃣ Blocco Automatico IP su Firewall dopo Alert SIEM
```
Trigger:    Alert SIEM con severity >= HIGH e tipo "Inbound C2 Communication"
Condizione: IP sorgente non è nella whitelist interna
Azione:     
  - Crea regola di blocco su Palo Alto (API)
  - Aggiunge IP alla blacklist centralizzata
  - Crea ticket su ServiceNow
```

#### 2️⃣ Isolamento Host dopo Rilevamento Malware
```
Trigger:    EDR rileva malware con confidence >= 90%
Azione:     
  - Isola l'endpoint tramite API EDR
  - Disabilita l'account utente in Active Directory
  - Raccoglie artefatti forensi (memory dump, running processes)
  - Assegna il caso a un analista L2
```

#### 3️⃣ Arricchimento Automatico IOC
```
Trigger:    Nuovo IOC (IP, hash, dominio) inserito nel SIEM
Azione:     
  - Query VirusTotal per reputation score
  - Query AbuseIPDB per report di abuso
  - Query MITRE ATT&CK per mappatura TTP
  - Aggrega i risultati e aggiorna il ticket
```

#### 4️⃣ Invio Notifiche Automatiche al Team
```
Trigger:    Incidente con severity CRITICAL
Azione:     
  - Invia alert su Slack #incident-response
  - Invia SMS al responsabile SOC di turno
  - Aggiorna la dashboard del SOC
  - Avvia bridge call automatico
```

### Vendor Principali

| Vendor | Prodotto | Caratteristiche |
|--------|----------|-----------------|
| **Splunk** | Splunk SOAR (ex Phantom) | Forte integrazione con Splunk SIEM, 300+ integrazioni |
| **Palo Alto** | XSOAR (ex Demisto) | War room collaborativo, marketplace playbook |
| **IBM** | Resilient | Focus su incident response e compliance |
| **Swimlane** | Swimlane | Low-code automation, scalabilità |
| **Tines** | Tines | No-code, cloud-native, molto flessibile |

### Esempio di Workflow SOAR in Pseudocodice

```python
# Playbook: Risposta Automatica a Phishing Email
# Trigger: Utente segnala email sospetta via pulsante "Report Phishing"

def phishing_response_playbook(email_reported):
    
    # STEP 1: Estrai indicatori dall'email
    indicators = extract_iocs(email_reported)
    # indicators = {urls: [...], attachments: [...], sender_ip: "...", sender_domain: "..."}
    
    # STEP 2: Arricchisci ogni indicatore
    for url in indicators.urls:
        vt_result = virustotal.scan_url(url)
        urlhaus_result = urlhaus.check(url)
        if vt_result.malicious_score > 5 or urlhaus_result.is_malicious:
            url.verdict = "MALEVOLO"
    
    for attachment in indicators.attachments:
        hash_md5 = compute_hash(attachment)
        sandbox_result = sandbox.detonate(attachment)  # ANY.RUN o Joe Sandbox
        if sandbox_result.verdict == "malicious":
            attachment.verdict = "MALEVOLO"
    
    # STEP 3: Determina verdetto complessivo
    if any_indicator_malicious(indicators):
        
        # STEP 4: Contenimento
        email_gateway.delete_email_from_all_mailboxes(email_reported.message_id)
        firewall.block_urls(indicators.malicious_urls)
        firewall.block_ips(indicators.malicious_ips)
        
        # STEP 5: Identifica altri utenti che hanno ricevuto la stessa email
        affected_users = email_gateway.search_by_message_id(email_reported.message_id)
        
        # STEP 6: Controlla se qualcuno ha cliccato
        for user in affected_users:
            proxy_logs = proxy.search_user_activity(user, indicators.urls)
            if proxy_logs.found_clicks:
                edr.isolate_endpoint(user.device)
                ad.disable_account(user)
                ad.reset_password(user)
        
        # STEP 7: Documenta e notifica
        ticket = ticketing.create_incident(
            title="Phishing Campaign Detected",
            severity="HIGH",
            details=compile_report(indicators, affected_users)
        )
        slack.send_message("#soc-alerts", f"🚨 Phishing campagna rilevata. Ticket: {ticket.id}")
    
    else:
        # Email legittima
        ticketing.close_as_false_positive(email_reported)
        email.notify_user(email_reported.reporter, "L'email segnalata è stata verificata come legittima.")
```

---

## 🌐 WAF (Web Application Firewall)

### Cos'è un WAF

Un **WAF** (Web Application Firewall) è un firewall specializzato che opera a **livello 7 (applicazione)** del modello OSI, progettato specificamente per proteggere le **applicazioni web**.

### Differenza con il Firewall Tradizionale

| Caratteristica | Firewall Tradizionale | WAF |
|---------------|----------------------|-----|
| **Livello OSI** | Livello 3-4 (rete/trasporto) | Livello 7 (applicazione) |
| **Cosa ispeziona** | IP, porte, protocolli | Contenuto HTTP/HTTPS (header, body, parametri) |
| **Cosa protegge** | La rete | Le applicazioni web |
| **Minacce bloccate** | Scansioni porte, DDoS L3/L4 | SQLi, XSS, CSRF, LFI, RFI |
| **Posizione** | Perimetro di rete | Davanti al web server |

### Cosa Protegge: OWASP Top 10

Il WAF è progettato per mitigare le vulnerabilità della [OWASP Top 10](https://owasp.org/www-project-top-ten/):

| # | Vulnerabilità | Come il WAF la mitiga |
|---|--------------|----------------------|
| A01 | Broken Access Control | Rileva tentativi di path traversal, forced browsing |
| A02 | Cryptographic Failures | Blocca downgrade attacks su protocolli |
| A03 | Injection (SQLi, XSS) | Filtra payload malevoli nelle richieste |
| A04 | Insecure Design | Limita rate e pattern anomali |
| A05 | Security Misconfiguration | Nasconde header server, error pages |
| A06 | Vulnerable Components | Virtual patching per CVE note |
| A07 | Auth Failures | Rileva brute force, credential stuffing |
| A08 | Software & Data Integrity | Verifica integrità delle richieste |
| A09 | Logging Failures | Genera log dettagliati delle richieste |
| A10 | SSRF | Blocca richieste a risorse interne |

### Vendor Principali

| Vendor | Tipo | Caratteristiche |
|--------|------|-----------------|
| **ModSecurity** | Open Source | Engine WAF, regole OWASP CRS, on-premise |
| **AWS WAF** | Cloud | Integrato con CloudFront/ALB, regole managed |
| **Cloudflare** | Cloud/CDN | WAF + DDoS protection + CDN, facile setup |
| **Akamai** | Cloud/CDN | Enterprise, Kona Site Defender, performance |
| **F5 BIG-IP ASM** | Hardware/Virtual | Enterprise, molto configurabile |
| **Imperva** | Cloud/On-Prem | Forte su compliance (PCI-DSS) |

**Esempio di regola ModSecurity (OWASP CRS):**
```apache
# Blocca tentativi di SQL Injection
SecRule ARGS "@detectSQLi" \
    "id:942100,\
    phase:2,\
    block,\
    msg:'SQL Injection Attack Detected',\
    logdata:'Matched Data: %{MATCHED_VAR} found within %{MATCHED_VAR_NAME}',\
    tag:'OWASP_CRS',\
    tag:'attack-sqli',\
    severity:'CRITICAL'"
```

---

## 🔀 Proxy

### Forward Proxy vs Reverse Proxy

| Caratteristica | Forward Proxy | Reverse Proxy |
|---------------|---------------|---------------|
| **Chi protegge** | I **client** interni | I **server** backend |
| **Direzione** | Client → Proxy → Internet | Internet → Proxy → Server |
| **Scopo** | Filtraggio web, caching, anonimato | Load balancing, SSL termination, caching |
| **Visibilità** | Il server vede l'IP del proxy | Il client vede l'IP del proxy |
| **Esempio** | Proxy aziendale per navigazione | CDN davanti a un web server |

```
Forward Proxy:
Client ──→ [Forward Proxy] ──→ Internet
           (filtra, logga, cache)

Reverse Proxy:
Internet ──→ [Reverse Proxy] ──→ Server Backend
              (bilancia, cache, SSL termination)
```

### Strumenti Principali

#### 🦑 Squid
- **Tipo**: Forward proxy
- **Uso**: Proxy HTTP/HTTPS aziendale, caching, filtraggio URL
- **Caratteristiche**: ACL avanzate, caching aggressivo, autenticazione LDAP

```bash
# Configurazione base Squid (/etc/squid/squid.conf)
acl localnet src 10.0.0.0/8
acl blocked_sites dstdomain .facebook.com .tiktok.com .instagram.com
http_access deny blocked_sites
http_access allow localnet
http_access deny all
http_port 3128
```

#### ⚡ Nginx
- **Tipo**: Reverse proxy + web server
- **Uso**: Load balancing, SSL termination, caching, serving static content
- **Caratteristiche**: Alte prestazioni, configurazione modulare

```nginx
# Esempio Nginx come reverse proxy con load balancing
upstream backend_servers {
    server 10.0.1.10:8080 weight=3;
    server 10.0.1.11:8080 weight=2;
    server 10.0.1.12:8080 weight=1;
}

server {
    listen 443 ssl;
    server_name app.example.com;
    
    ssl_certificate /etc/ssl/certs/app.crt;
    ssl_certificate_key /etc/ssl/private/app.key;
    
    location / {
        proxy_pass http://backend_servers;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

#### ⚖️ HAProxy
- **Tipo**: Reverse proxy + load balancer
- **Uso**: Load balancing TCP/HTTP ad alte prestazioni
- **Caratteristiche**: Health check, session persistence, statistiche avanzate

```haproxy
# Esempio HAProxy
frontend http_front
    bind *:80
    default_backend web_servers

backend web_servers
    balance roundrobin
    option httpchk GET /health
    server web1 10.0.1.10:8080 check
    server web2 10.0.1.11:8080 check
    server web3 10.0.1.12:8080 check backup
```

---

## 🔐 VPN (Virtual Private Network)

### Tipi di VPN

#### Site-to-Site VPN
Collega **due reti** attraverso Internet creando un tunnel cifrato permanente.

```
Sede A (10.0.1.0/24)            Sede B (10.0.2.0/24)
       │                              │
  [Router/FW] ═══ Tunnel VPN ═══ [Router/FW]
       │          (Internet)           │
   LAN Sede A                     LAN Sede B
```

- **Uso**: connettere filiali, data center, cloud
- **Sempre attivo**: il tunnel è permanente
- **Trasparente**: gli utenti non devono fare nulla

#### Client-to-Site (Remote Access VPN)
Un singolo **utente** si connette alla rete aziendale da remoto.

```
Laptop remoto ── [Client VPN] ═══ Tunnel VPN ═══ [VPN Gateway] ── LAN Aziendale
                                  (Internet)
```

- **Uso**: smart working, accesso remoto
- **On-demand**: l'utente avvia la connessione
- **Autenticazione**: username/password + MFA

### Protocolli VPN

| Protocollo | Tipo | Sicurezza | Velocità | Note |
|-----------|------|-----------|----------|------|
| **IPSec** | Site-to-Site + Client | Alta (AES-256, SHA-256) | Media | Standard enterprise, complesso da configurare |
| **SSL/TLS** | Principalmente Client | Alta | Buona | Funziona su porta 443 (bypassa molti firewall) |
| **WireGuard** | Entrambi | Alta (ChaCha20) | **Molto alta** | Moderno, leggero, ~4000 righe di codice |
| **OpenVPN** | Entrambi | Alta (OpenSSL) | Buona | Open source, molto flessibile, ampiamente supportato |
| **L2TP/IPSec** | Client | Media-Alta | Media | Spesso usato con IPSec per la cifratura |
| **IKEv2** | Client | Alta | Alta | Ottimo per mobile (reconnessione rapida) |

### Split Tunneling

Lo **split tunneling** permette di instradare solo **parte del traffico** attraverso la VPN:

```
Con Split Tunneling:
  Traffico aziendale (10.0.0.0/8) → VPN → Rete aziendale ✅
  Traffico Internet (YouTube, etc.) → Connessione diretta → Internet ⚡

Senza Split Tunneling (Full Tunnel):
  TUTTO il traffico → VPN → Rete aziendale → Internet (più lento) 🐌
```

**Rischi del Split Tunneling:**

| Rischio | Descrizione |
|---------|-------------|
| **Attacco bridge** | Il PC connesso sia alla rete aziendale che a Internet può fare da ponte per un attaccante |
| **Mancanza di ispezione** | Il traffico Internet diretto non passa dai controlli aziendali (proxy, DLP, IDS) |
| **Data exfiltration** | Un malware potrebbe esfiltrare dati tramite la connessione Internet diretta |
| **DNS leak** | Le query DNS potrebbero bypassare il tunnel VPN |

---

## 🍯 Honeypot e Honeynet

### Cos'è un Honeypot

Un **honeypot** è un sistema o servizio **deliberatamente vulnerabile** posizionato nella rete per **attirare gli attaccanti** e:
- Studiare le loro tecniche e strumenti
- Rallentarli e distoglierli dai sistemi reali
- Generare alert precoci (qualsiasi interazione è sospetta per definizione)
- Raccogliere IOC (IP, malware, comandi usati)

### Tipi di Honeypot

| Tipo | Interazione | Descrizione | Rischio | Esempio |
|------|-------------|-------------|---------|---------|
| **Low-Interaction** | Emula solo i servizi (es. banner SSH) | Facile da deployare, poco rischio | Basso | Cowrie (SSH), Dionaea |
| **High-Interaction** | Sistema reale completo | Raccoglie più dati, più realistico | Alto (può essere compromesso) | T-Pot, sistemi OS reali |

### Honeynet

Una **honeynet** è una rete intera di honeypot che simula un'infrastruttura reale completa (server, client, servizi), offrendo un ambiente molto realistico per studiare gli attaccanti.

### Strumenti Principali

#### 🐝 Cowrie
- **Tipo**: Medium-interaction SSH/Telnet honeypot
- **Cosa fa**: Simula un server SSH, registra tutti i comandi eseguiti dagli attaccanti
- **Output**: Log JSON, sessioni registrate, file scaricati dagli attaccanti
- **Installazione**:
```bash
# Installazione Cowrie
git clone https://github.com/cowrie/cowrie.git
cd cowrie
pip install -r requirements.txt
cp etc/cowrie.cfg.dist etc/cowrie.cfg
# Configurare la porta SSH (es. 2222)
bin/cowrie start
```

#### 🐝 T-Pot
- **Tipo**: Piattaforma multi-honeypot all-in-one
- **Cosa include**: 20+ honeypot diversi (Cowrie, Dionaea, Honeytrap, Conpot, etc.)
- **Dashboard**: Kibana per visualizzazione dati
- **Deployment**: Docker-based, facile da installare

#### 🐝 HoneyD
- **Tipo**: Low-interaction, network-level honeypot
- **Cosa fa**: Simula **interi host** con stack TCP/IP personalizzati
- **Caratteristica**: Può simulare migliaia di IP con servizi diversi

---

## 📊 DLP (Data Loss Prevention)

### Cos'è il DLP

Il **DLP** è un insieme di strumenti e policy che prevengono la **perdita, fuga o esfiltrazione** di dati sensibili dall'organizzazione.

### Tipi di DLP

| Tipo | Dove Opera | Cosa Monitora | Esempio |
|------|-----------|---------------|---------|
| **Network DLP** | Sul traffico di rete | Email, web upload, FTP, SMB | Monitora un file .xlsx con PII inviato via email |
| **Endpoint DLP** | Sui dispositivi | USB, stampa, clipboard, screenshot | Blocca la copia su chiavetta USB di documenti riservati |
| **Cloud DLP** | Nei servizi cloud | SaaS (OneDrive, Dropbox, Slack, etc.) | Impedisce la condivisione di file confidenziali su Teams pubblico |

### Casi d'Uso

| Caso d'Uso | Descrizione | Azione DLP |
|-----------|-------------|------------|
| **PII Protection** | Numeri di carte di credito in email | Blocca invio + notifica |
| **IP Protection** | Codice sorgente caricato su GitHub pubblico | Blocca upload + alert |
| **Compliance** | Dati sanitari (GDPR, HIPAA) condivisi impropriamente | Blocca + log per audit |
| **Insider Threat** | Dipendente che copia database clienti su USB | Blocca copia + alert al manager |
| **Accidental Leak** | Email con allegato confidenziale inviata al destinatario sbagliato | Richiede conferma o blocca |

**Vendor principali**: Symantec (Broadcom) DLP, Microsoft Purview, Forcepoint DLP, Digital Guardian, Zscaler.

---

## 🧪 Sandbox

### Cos'è una Sandbox

Una **sandbox** è un ambiente **isolato** e controllato dove è possibile **eseguire file sospetti** (malware, allegati, URL) senza rischio per i sistemi di produzione. La sandbox monitora il comportamento del file e produce un report dettagliato.

### Come Funziona

```
1. File sospetto ricevuto (email, download, upload)
         │
         ▼
2. [SANDBOX] esegue il file in VM isolata
   - Monitora: processi creati, file modificati, connessioni di rete,
     chiavi di registro, API chiamate
         │
         ▼
3. Genera report con verdetto:
   - ✅ Benigno: il file è sicuro
   - ⚠️ Sospetto: comportamento anomalo ma non definitivo
   - 🔴 Malevolo: comportamento confermato come malevolo
         │
         ▼
4. IOC estratti (hash, C2 IP, domini, mutex) inviati al SIEM/EDR
```

### Strumenti Principali

| Strumento | Tipo | Caratteristiche |
|-----------|------|-----------------|
| **ANY.RUN** | Cloud (interattivo) | Sandbox interattiva, puoi interagire in tempo reale con il malware |
| **Joe Sandbox** | Cloud + On-Prem | Analisi profonda, supporto multi-OS, report dettagliati |
| **Cuckoo Sandbox** | Open Source (On-Prem) | Molto personalizzabile, community attiva, richiede setup |
| **VirusTotal** | Cloud | Non è una vera sandbox, ma multi-engine scanning + sandbox di base |
| **Hybrid Analysis** | Cloud (CrowdStrike) | Powered by Falcon Sandbox, report pubblici |
| **Triage** | Cloud (Hatching) | Veloce, supporta malware configurazione extraction |

### Limiti: Tecniche di Evasione

I malware moderni utilizzano diverse tecniche per **evadere le sandbox**:

| Tecnica di Evasione | Come Funziona | Contromisura |
|---------------------|---------------|--------------|
| **VM Detection** | Controlla se gira in VMware/VirtualBox (registry, MAC address, processi) | Sandbox bare-metal, anti-evasion |
| **Time-based** | Si attiva solo dopo un tempo (es. aspetta 10 minuti) | Accelerazione del tempo nella sandbox |
| **User Interaction** | Richiede click dell'utente o movimento mouse | Simulazione interazione utente |
| **Environment Check** | Controlla nome utente, nome PC, programmi installati | Ambienti realistici |
| **Anti-analysis** | Rileva debugger, hook, monitoring tools | Hooking stealth, hardware breakpoints |
| **Geofencing** | Si attiva solo in certi paesi (IP geolocation) | Proxy con IP del paese target |

---

## 📋 Tabella Comparativa degli Strumenti

| Strumento | Categoria | Cosa Fa | Dove si Posiziona | Vendor/Tool Principale |
|-----------|-----------|---------|-------------------|----------------------|
| **Firewall (NGFW)** | Difesa perimetrale | Filtra traffico per IP, porta, applicazione, contenuto | Perimetro di rete, segmenti interni | Palo Alto, FortiGate, Cisco Firepower |
| **IDS** | Rilevamento intrusioni | Monitora traffico e genera alert | Out-of-band (SPAN port) | Snort, Suricata, Zeek |
| **IPS** | Prevenzione intrusioni | Monitora e blocca traffico malevolo | Inline nel flusso di rete | Snort, Suricata |
| **EDR** | Protezione endpoint | Telemetria, rilevamento comportamentale, risposta | Agent su ogni endpoint | CrowdStrike, Defender, SentinelOne |
| **XDR** | Rilevamento esteso | Correla dati da endpoint, rete, email, cloud | Piattaforma centralizzata | Palo Alto Cortex XDR, Microsoft 365 Defender |
| **SIEM** | Log management & analisi | Raccoglie, correla, analizza log da tutte le fonti | Console centralizzata | Splunk, QRadar, Sentinel, Elastic |
| **SOAR** | Automazione risposta | Automatizza playbook di incident response | Integrato con SIEM/SOC | Splunk SOAR, XSOAR, Swimlane |
| **WAF** | Protezione web app | Filtra traffico HTTP/HTTPS malevolo | Davanti al web server | ModSecurity, Cloudflare, AWS WAF |
| **Forward Proxy** | Controllo navigazione | Filtra e logga traffico web degli utenti | Tra client e Internet | Squid, Zscaler |
| **Reverse Proxy** | Protezione server | Load balancing, SSL termination, caching | Davanti ai server backend | Nginx, HAProxy, F5 |
| **VPN** | Accesso remoto sicuro | Cifratura del traffico tra due punti | Gateway di rete | OpenVPN, WireGuard, Cisco AnyConnect |
| **Honeypot** | Deception | Attira attaccanti per studio e early warning | Rete interna (segmento isolato) | Cowrie, T-Pot, HoneyD |
| **DLP** | Prevenzione perdita dati | Monitora e blocca esfiltrazione dati sensibili | Rete, endpoint, cloud | Symantec DLP, Microsoft Purview |
| **Sandbox** | Analisi malware | Esegue file sospetti in ambiente isolato | Cloud o on-premise isolato | ANY.RUN, Joe Sandbox, Cuckoo |
| **NAC** | Controllo accesso rete | Verifica compliance dispositivi prima dell'accesso | Switch/router di rete | Cisco ISE, Forescout, Aruba ClearPass |

---

## 🎯 Domande da Colloquio

### 1. Qual è la differenza tra un IDS e un IPS? Quando useresti l'uno piuttosto che l'altro?

**Risposta modello:**

L'**IDS** (Intrusion Detection System) opera in modalità **passiva**, monitorando una copia del traffico di rete (tramite SPAN port o TAP) e generando alert quando rileva attività sospetta, ma **non blocca** il traffico. L'**IPS** (Intrusion Prevention System) opera **inline**, cioè tutto il traffico passa fisicamente attraverso di esso, permettendogli di **bloccare attivamente** i pacchetti malevoli in tempo reale.

Userei un **IDS** quando voglio monitorare il traffico senza rischiare di bloccare traffico legittimo (es. in fase iniziale di deployment o su reti critiche dove la disponibilità è prioritaria). Userei un **IPS** quando la prevenzione è più importante della disponibilità e dopo aver affinato le regole per minimizzare i falsi positivi.

---

### 2. Spiega la differenza tra un firewall stateless e uno stateful. Perché lo stateful è preferibile?

**Risposta modello:**

Un firewall **stateless** esamina ogni pacchetto in modo indipendente, basandosi solo sugli header (IP sorgente/destinazione, porta, protocollo). Non tiene traccia delle connessioni attive, quindi richiede regole esplicite sia per il traffico in uscita che per quello di ritorno.

Un firewall **stateful** mantiene una **tabella delle connessioni attive** (state table). Quando un host interno avvia una connessione, il firewall la registra e consente automaticamente i pacchetti di risposta corrispondenti. Questo lo rende più sicuro (può rilevare pacchetti fuori contesto come un SYN-ACK senza un SYN precedente) e più facile da gestire (meno regole necessarie).

Lo stateful è preferibile perché offre una sicurezza migliore con una gestione più semplice, ed è ormai lo standard minimo per qualsiasi firewall moderno.

---

### 3. Cos'è un EDR e come si differenzia da un antivirus tradizionale?

**Risposta modello:**

Un **EDR** (Endpoint Detection and Response) è una soluzione avanzata di protezione endpoint che va ben oltre l'antivirus tradizionale. Mentre l'antivirus si basa principalmente su **firme** (signature) per rilevare malware noto e opera con scansioni periodiche, l'EDR raccoglie **telemetria continua** (processi, connessioni, modifiche file/registro) e utilizza **analisi comportamentale** e machine learning per rilevare anche minacce sconosciute.

Le differenze chiave sono:
- **Visibilità**: l'EDR ha una visibilità molto più profonda sull'endpoint
- **Rilevamento**: l'EDR rileva attacchi basati su comportamento, non solo su firme
- **Risposta**: l'EDR permette azioni come l'isolamento remoto dell'endpoint, kill di processi, raccolta di artefatti forensi
- **Threat Hunting**: l'EDR consente query proattive sulla telemetria per cercare minacce nascoste

---

### 4. Cosa sono le signature-based e anomaly-based detection? Quali sono i pro e contro di ciascuna?

**Risposta modello:**

La **signature-based detection** confronta il traffico o i file con un database di **pattern noti** di attacchi. Pro: basso tasso di falsi positivi, veloce, precisa per minacce conosciute. Contro: non rileva attacchi **zero-day** o varianti nuove.

La **anomaly-based detection** stabilisce una **baseline** del comportamento normale e segnala le deviazioni. Pro: può rilevare minacce **sconosciute** e zero-day. Contro: alto tasso di **falsi positivi**, richiede un periodo di training e tuning continuo.

In pratica, la maggior parte dei sistemi moderni usa un approccio **ibrido**, combinando entrambi i metodi per massimizzare la copertura.

---

### 5. Cos'è il concetto di Defense in Depth e perché è importante?

**Risposta modello:**

**Defense in Depth** è una strategia di sicurezza che prevede molteplici livelli di protezione sovrapposti: perimetro (firewall, WAF), rete (segmentazione, IDS/IPS), host (EDR, hardening), applicazione (input validation, WAF) e dati (encryption, DLP, backup).

È importante perché **nessun singolo controllo di sicurezza è infallibile**. Un firewall non ferma un malware inviato via email crittografata. Un antivirus non ferma un attacco zero-day. Ma combinando più livelli, la probabilità che un attaccante riesca a superarli tutti diminuisce drasticamente. Ogni livello aggiunge un ulteriore ostacolo, aumentando il costo e il tempo necessario per un attacco riuscito.

---

### 6. Qual è la differenza tra un WAF e un firewall tradizionale? Quando serve un WAF?

**Risposta modello:**

Un **firewall tradizionale** opera a livello 3-4 (rete/trasporto), filtrando il traffico per IP, porta e protocollo. Un **WAF** opera a livello 7 (applicazione), ispezionando il **contenuto** delle richieste HTTP/HTTPS (header, body, parametri, cookie).

Un WAF serve quando si hanno **applicazioni web esposte a Internet** e si vuole proteggerle da attacchi come SQL Injection, Cross-Site Scripting (XSS), CSRF e altre vulnerabilità della OWASP Top 10. Il firewall tradizionale non può vedere questi attacchi perché viaggiano su traffico HTTP/HTTPS legittimo (porta 80/443).

---

### 7. Spiega la differenza tra EDR e XDR. Quali vantaggi offre l'XDR?

**Risposta modello:**

L'**EDR** si concentra esclusivamente sulla protezione degli **endpoint**, raccogliendo telemetria da laptop, desktop e server. L'**XDR** (Extended Detection and Response) estende questo concetto correlando dati da **molteplici fonti**: endpoint, rete, email, cloud e identity.

Il vantaggio principale dell'XDR è la **correlazione cross-domain**: può collegare un'email di phishing all'esecuzione di un malware sull'endpoint, al tentativo di lateral movement sulla rete, fino all'esfiltrazione di dati nel cloud. Questo fornisce una **visione completa** dell'attacco end-to-end, riduce l'**alert fatigue** raggruppando alert correlati in incidenti unici, e accelera la risposta perché l'analista ha immediatamente il contesto completo.

---

### 8. Cos'è il SOAR e come migliora le operazioni del SOC?

**Risposta modello:**

Il **SOAR** (Security Orchestration, Automation and Response) è una piattaforma che integra strumenti di sicurezza (orchestration), automatizza task ripetitivi (automation) e esegue azioni di risposta (response) tramite **playbook automatizzati**.

Migliora le operazioni del SOC in diversi modi:
- **Riduce i tempi di risposta**: da minuti/ore a secondi (es. blocco automatico IP malevolo)
- **Elimina task ripetitivi**: arricchimento IOC, creazione ticket, notifiche
- **Standardizza le risposte**: ogni incidente viene gestito seguendo il playbook
- **Scala meglio**: può gestire migliaia di alert senza richiedere più analisti
- **Riduce l'errore umano**: azioni automatiche e consistenti

Un esempio concreto: quando il SIEM genera un alert per comunicazione C2, il SOAR può automaticamente arricchire l'IP su VirusTotal, bloccarlo sul firewall, isolare l'endpoint tramite EDR e creare un ticket, il tutto in pochi secondi.

---

### 9. Cos'è lo split tunneling in una VPN e quali sono i rischi?

**Risposta modello:**

Lo **split tunneling** è una configurazione VPN che permette di instradare solo **parte del traffico** attraverso il tunnel VPN (tipicamente il traffico diretto alla rete aziendale), mentre il resto del traffico (es. navigazione Internet) viene inviato **direttamente** tramite la connessione locale dell'utente.

I **rischi** sono:
1. **Bridge attack**: il dispositivo è connesso simultaneamente alla rete aziendale e a Internet, potendo fare da ponte per un attaccante
2. **Bypass dei controlli**: il traffico Internet diretto non passa attraverso i controlli aziendali (proxy, IDS, DLP)
3. **Data exfiltration**: un malware potrebbe esfiltrare dati aziendali tramite la connessione Internet diretta
4. **DNS leak**: le query DNS potrebbero rivelare informazioni sulla rete aziendale

Nonostante i rischi, lo split tunneling è spesso necessario per non sovraccaricare la VPN aziendale e mantenere buone prestazioni per l'utente.

---

### 10. Come funziona una sandbox per l'analisi malware e quali sono i suoi limiti?

**Risposta modello:**

Una **sandbox** è un ambiente **isolato** (tipicamente una virtual machine) dove i file sospetti vengono eseguiti in modo controllato. La sandbox monitora tutte le azioni del file: processi creati, file modificati, connessioni di rete, chiavi di registro accedute e API chiamate. Al termine dell'analisi, produce un report con il verdetto (benigno/sospetto/malevolo) e gli IOC estratti (hash, IP C2, domini).

I **limiti** principali sono le tecniche di **evasione** dei malware moderni:
- **VM detection**: il malware rileva di essere in una VM e non si attiva
- **Time-based**: il malware attende minuti/ore prima di attivarsi
- **User interaction**: richiede interazione umana (click, movimento mouse)
- **Environment check**: verifica nome utente, programmi installati, dimensioni disco
- **Geofencing**: si attiva solo in certi paesi

Per contrastare queste evasioni, le sandbox moderne usano ambienti realistici, simulazione di interazione utente, accelerazione temporale e, in alcuni casi, esecuzione su hardware fisico (bare-metal).

---

### 11. Cos'è un honeypot e come può aiutare nella difesa?

**Risposta modello:**

Un **honeypot** è un sistema deliberatamente vulnerabile posizionato nella rete per attirare gli attaccanti. Poiché non ha nessuna funzione di produzione, **qualsiasi interazione con esso è per definizione sospetta**, il che lo rende un eccellente strumento di early warning.

Un honeypot aiuta nella difesa perché:
- **Early detection**: rileva attaccanti che hanno già superato il perimetro
- **Threat intelligence**: raccoglie IOC, strumenti e TTP degli attaccanti
- **Deception**: rallenta gli attaccanti e li distoglie dai sistemi reali
- **Zero falsi positivi**: qualsiasi accesso è sospetto

Esistono honeypot a **bassa interazione** (emulano solo i servizi, meno rischio) e ad **alta interazione** (sistemi reali, più dati ma più rischio di compromissione). Tool come **Cowrie** (SSH), **T-Pot** (piattaforma multi-honeypot) e **HoneyD** (emulazione di rete) sono tra i più utilizzati.

---

### 12. Qual è la differenza tra Forward Proxy e Reverse Proxy?

**Risposta modello:**

Un **Forward Proxy** si posiziona **davanti ai client** e gestisce le richieste in uscita verso Internet. Protegge i client, fornisce filtraggio web, caching e anonimato. Il server di destinazione vede l'IP del proxy, non del client reale. Esempio: Squid come proxy aziendale per la navigazione.

Un **Reverse Proxy** si posiziona **davanti ai server backend** e gestisce le richieste in entrata da Internet. Protegge i server, fornisce load balancing, SSL termination e caching. Il client vede l'IP del reverse proxy, non dei server backend. Esempio: Nginx davanti a un cluster di application server, oppure Cloudflare come CDN.

In sintesi: il forward proxy protegge i **client**, il reverse proxy protegge i **server**.

---

> 📚 **Risorse consigliate per approfondire:**
> - NIST Cybersecurity Framework (CSF)
> - MITRE ATT&CK Framework
> - OWASP Top 10
> - SANS Reading Room
> - Documentazione ufficiale di Snort, Suricata, Zeek
