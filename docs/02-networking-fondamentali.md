# 🌐 Networking Fondamentali per SOC Analyst

> **Documento di studio per la preparazione al colloquio SOC Analyst**  
> Livello: Intermedio | Lingua: Italiano

---

## 📚 Modello OSI (Open Systems Interconnection)

Il modello OSI è un **framework concettuale** a 7 livelli che descrive come i dati viaggiano attraverso una rete. Ogni livello ha funzioni specifiche e comunica con il livello adiacente. Per un SOC Analyst, conoscere l'OSI è fondamentale per capire **dove agiscono le minacce** e **dove operano gli strumenti di sicurezza**.

### Livello 7 - Applicazione (Application Layer)

**Descrizione:** È il livello più vicino all'utente. Fornisce l'interfaccia tra le applicazioni dell'utente e la rete. Non è l'applicazione in sé, ma i **servizi di rete** che le applicazioni utilizzano.

**Protocolli principali:**
- **HTTP/HTTPS** (porta 80/443) — Navigazione web
- **FTP** (porta 20/21) — Trasferimento file
- **SMTP** (porta 25) — Invio email
- **DNS** (porta 53) — Risoluzione nomi di dominio
- **SNMP** (porta 161/162) — Monitoraggio di rete
- **SSH** (porta 22) — Accesso remoto sicuro
- **POP3/IMAP** (porta 110/143) — Ricezione email

**Strumenti di sicurezza a questo livello:**
- **WAF** (Web Application Firewall) — Protegge le applicazioni web
- **IDS/IPS applicativi** — Rileva attacchi a livello applicazione
- **Proxy server** — Filtra e controlla il traffico web
- **Anti-malware gateway** — Scansiona contenuti

**Esempio pratico per SOC Analyst:**
```
Un analista rileva nel SIEM un alert: richiesta HTTP GET sospetta
GET /admin/../../../../etc/passwd HTTP/1.1

Questo è un tentativo di Path Traversal (attacco a livello applicazione)
→ Il WAF dovrebbe bloccare questa richiesta
→ L'analista verifica se l'attacco è riuscito controllando il response code
```

---

### Livello 6 - Presentazione (Presentation Layer)

**Descrizione:** Si occupa della **traduzione, crittografia e compressione** dei dati. Garantisce che i dati inviati da un sistema siano leggibili da un altro sistema.

**Funzioni principali:**
- **Crittografia/Decrittografia** — SSL/TLS operano qui
- **Compressione** dei dati
- **Encoding/Decoding** — Conversione tra formati (ASCII, UTF-8, EBCDIC)
- **Serializzazione** dei dati

**Protocolli e standard:**
- **SSL/TLS** — Crittografia delle comunicazioni
- **JPEG, GIF, PNG** — Formati immagine
- **MPEG, AVI** — Formati video
- **ASCII, Unicode** — Codifica caratteri

**Esempio pratico per SOC Analyst:**
```
Un attaccante codifica un payload malevolo in Base64 per eludere i controlli:
GET /search?q=PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==

Decodificato: <script>alert(1)</script>  → attacco XSS
L'analista deve saper riconoscere encoding sospetti nei log
```

---

### Livello 5 - Sessione (Session Layer)

**Descrizione:** Gestisce le **sessioni di comunicazione** tra due dispositivi. Si occupa di aprire, mantenere e chiudere le connessioni.

**Funzioni principali:**
- Creazione, gestione e terminazione delle sessioni
- Sincronizzazione della comunicazione
- Gestione del dialogo (half-duplex, full-duplex)
- Checkpointing e ripristino

**Protocolli:**
- **NetBIOS** — Comunicazione in rete locale Windows
- **RPC** (Remote Procedure Call) — Chiamate di procedura remota
- **PPTP** — Tunneling VPN
- **SMB** (in parte) — Condivisione file Windows

**Esempio pratico per SOC Analyst:**
```
Un alert segnala connessioni SMB anomale tra workstation:
→ Possibile movimento laterale (Lateral Movement - MITRE ATT&CK T1021.002)
→ Verificare se le sessioni SMB sono legittime o indicano pass-the-hash
```

---

### Livello 4 - Trasporto (Transport Layer)

**Descrizione:** Garantisce il trasferimento affidabile (o non affidabile) dei dati end-to-end. Gestisce la **segmentazione, il controllo di flusso e il controllo degli errori**.

**Protocolli principali:**
- **TCP** (Transmission Control Protocol) — Affidabile, orientato alla connessione
- **UDP** (User Datagram Protocol) — Non affidabile, veloce

**Concetti chiave:**
- **Porte** — Identificano i servizi (0-65535)
- **Segmentazione** — Divisione dei dati in segmenti
- **Three-way handshake** (TCP) — SYN, SYN-ACK, ACK
- **Controllo di flusso** — Regola la velocità di trasmissione

**Strumenti di sicurezza:**
- **Firewall stateful** — Tiene traccia dello stato delle connessioni TCP
- **IDS/IPS** di rete — Analizza il traffico a livello trasporto

**Esempio pratico per SOC Analyst:**
```
Il SIEM segnala: SYN flood verso il server web
→ Migliaia di pacchetti SYN senza ACK di risposta
→ Attacco DoS a livello trasporto
→ Il firewall stateful dovrebbe rilevare e bloccare
```

---

### Livello 3 - Rete (Network Layer)

**Descrizione:** Gestisce l'**indirizzamento logico (IP)** e il **routing** dei pacchetti tra reti diverse. Determina il percorso migliore per i dati.

**Protocolli principali:**
- **IP** (Internet Protocol) — Indirizzamento e routing
- **ICMP** (Internet Control Message Protocol) — Diagnostica (ping, traceroute)
- **ARP** (in realtà opera tra L2 e L3) — Risoluzione IP → MAC
- **OSPF, BGP, RIP** — Protocolli di routing

**Concetti chiave:**
- **Indirizzo IP** (IPv4 e IPv6)
- **Subnet mask** e subnetting
- **Routing** — Come i pacchetti trovano la strada
- **TTL** (Time to Live) — Evita loop infiniti

**Strumenti di sicurezza:**
- **Router con ACL** — Access Control List basate su IP
- **Firewall L3** — Filtraggio basato su IP sorgente/destinazione
- **IDS/IPS** di rete

**Esempio pratico per SOC Analyst:**
```
Comandi utili per l'analisi:
$ ping 192.168.1.1           → Verifica raggiungibilità
$ tracert 8.8.8.8            → Traccia il percorso dei pacchetti (Windows)
$ traceroute 8.8.8.8         → Traccia il percorso dei pacchetti (Linux)
```

---

### Livello 2 - Data Link (Collegamento Dati)

**Descrizione:** Si occupa del trasferimento affidabile dei frame tra due nodi **direttamente connessi**. Gestisce gli indirizzi fisici (MAC) e il controllo di accesso al mezzo.

**Concetti chiave:**
- **MAC Address** — Indirizzo fisico a 48 bit (es. AA:BB:CC:DD:EE:FF)
- **Frame** — Unità dati a questo livello
- **Switch** — Dispositivo che opera a livello 2
- **ARP** — Risolve IP in MAC address
- **VLAN** — Segmentazione logica della rete

**Protocolli e standard:**
- **Ethernet (802.3)** — Standard LAN più comune
- **Wi-Fi (802.11)** — Wireless LAN
- **802.1Q** — VLAN tagging
- **802.1X** — Autenticazione di rete (NAC)
- **STP** (Spanning Tree Protocol) — Prevenzione loop

**Strumenti di sicurezza:**
- **802.1X / NAC** — Controllo accesso alla rete basato su identità
- **Port security** — Limita i MAC address per porta dello switch
- **VLAN segmentation** — Isola segmenti di rete
- **DHCP snooping** — Previene DHCP spoofing

**Esempio pratico per SOC Analyst:**
```
$ arp -a                     → Mostra la tabella ARP locale
Interfaccia: 192.168.1.10
  192.168.1.1    →  AA-BB-CC-DD-EE-FF   (Gateway)
  192.168.1.50   →  11-22-33-44-55-66   (Server)

Se due IP diversi hanno lo stesso MAC → possibile ARP spoofing!
```

---

### Livello 1 - Fisico (Physical Layer)

**Descrizione:** Gestisce la trasmissione di **bit grezzi** attraverso il mezzo fisico. Si occupa degli aspetti elettrici, meccanici e funzionali della connessione.

**Componenti:**
- **Cavi** — Ethernet (UTP/STP Cat5e/6/6a), fibra ottica, coassiale
- **Hub** — Dispositivo che ripete i segnali (obsoleto)
- **Repeater** — Amplifica il segnale
- **Connettori** — RJ45, LC, SC
- **Segnali** — Elettrici, ottici, radio

**Rilevanza per la sicurezza:**
- Accesso fisico non autorizzato ai dispositivi di rete
- Wiretapping (intercettazione del cavo)
- Jamming delle frequenze wireless

---

### Tabella Riassuntiva Modello OSI

| Livello | Nome | PDU | Protocolli Principali | Strumenti Sicurezza | Dispositivi |
|---------|------|-----|----------------------|--------------------|----|
| **7** | Applicazione | Dati | HTTP, HTTPS, FTP, SMTP, DNS, SSH | WAF, Proxy, Anti-malware | Gateway applicativi |
| **6** | Presentazione | Dati | SSL/TLS, JPEG, ASCII, Base64 | Crittografia, DLP | — |
| **5** | Sessione | Dati | NetBIOS, RPC, SMB, PPTP | Session management | — |
| **4** | Trasporto | Segmento/Datagramma | TCP, UDP | Firewall stateful, IDS/IPS | — |
| **3** | Rete | Pacchetto | IP, ICMP, ARP, OSPF | Router ACL, Firewall L3 | Router |
| **2** | Data Link | Frame | Ethernet, Wi-Fi, 802.1Q, STP | 802.1X, NAC, Port Security | Switch |
| **1** | Fisico | Bit | — | Sicurezza fisica | Hub, Repeater, Cavi |

---

## 🔄 Modello TCP/IP

Il modello **TCP/IP** (detto anche modello Internet) è il modello pratico utilizzato nelle reti reali. Ha **4 livelli** rispetto ai 7 dell'OSI.

| Livello TCP/IP | Livelli OSI Corrispondenti | Protocolli |
|---------------|---------------------------|------------|
| **4 - Applicazione** | 7 + 6 + 5 (Applicazione + Presentazione + Sessione) | HTTP, FTP, SMTP, DNS, SSH, TLS |
| **3 - Trasporto** | 4 (Trasporto) | TCP, UDP |
| **2 - Internet** | 3 (Rete) | IP, ICMP, ARP |
| **1 - Accesso alla Rete** | 2 + 1 (Data Link + Fisico) | Ethernet, Wi-Fi, PPP |

### Confronto OSI vs TCP/IP

| Caratteristica | Modello OSI | Modello TCP/IP |
|---------------|-------------|---------------|
| **Livelli** | 7 | 4 |
| **Tipo** | Teorico/Concettuale | Pratico/Implementato |
| **Sviluppato da** | ISO | DoD (Dipartimento della Difesa USA) |
| **Utilizzo** | Riferimento per l'insegnamento | Standard di fatto per Internet |
| **Approccio** | Top-down rigido | Flessibile, protocol-oriented |
| **Sessione e Presentazione** | Livelli separati | Inglobati nell'Applicazione |

**Perché TCP/IP è più usato nella pratica:**
Il modello TCP/IP è stato sviluppato insieme ai protocolli reali di Internet (TCP, IP, HTTP, ecc.), quindi riflette fedelmente come funzionano le reti nel mondo reale. L'OSI è più utile come **strumento didattico** e per **analizzare problemi** a un livello specifico.

---

## ⚡ TCP vs UDP

### TCP (Transmission Control Protocol)

TCP è un protocollo **orientato alla connessione** che garantisce la consegna affidabile e ordinata dei dati.

**Caratteristiche:**
- **Connection-oriented** — Stabilisce una connessione prima di trasmettere
- **Affidabile** — Garantisce che tutti i dati arrivino integri e in ordine
- **Controllo di flusso** — Regola la velocità di invio
- **Controllo di congestione** — Evita di sovraccaricare la rete
- **Ordinamento** — I segmenti arrivano in ordine
- **Overhead maggiore** — Header più grande (20 bytes minimo)

### Three-Way Handshake (Stretta di Mano a 3 Vie)

Prima di iniziare la comunicazione, TCP stabilisce la connessione con il **three-way handshake**:

```
    Client                          Server
      |                                |
      |------- SYN (seq=100) --------->|   1. Client invia SYN
      |                                |      "Voglio connettermi"
      |                                |
      |<-- SYN-ACK (seq=300,ack=101) --|   2. Server risponde SYN-ACK
      |                                |      "Ok, accetto la connessione"
      |                                |
      |------- ACK (ack=301) --------->|   3. Client conferma con ACK
      |                                |      "Perfetto, iniziamo!"
      |                                |
      |===== CONNESSIONE STABILITA ====|
      |                                |
      |-------- DATI / DATA ---------> |   4. Scambio dati bidirezionale
      |<------- DATI / DATA --------- |
      |                                |
```

**Chiusura della connessione (Four-Way Teardown):**
```
    Client                          Server
      |                                |
      |------- FIN ------------------>|   1. "Ho finito di inviare"
      |<------ ACK -------------------|   2. "Ok, ricevuto"
      |<------ FIN -------------------|   3. "Anch'io ho finito"
      |------- ACK ------------------>|   4. "Ok, connessione chiusa"
      |                                |
```

**Casi d'uso TCP:** HTTP/HTTPS, FTP, SSH, SMTP, POP3, IMAP — tutti i protocolli che richiedono affidabilità.

### UDP (User Datagram Protocol)

UDP è un protocollo **senza connessione** che privilegia la velocità rispetto all'affidabilità.

**Caratteristiche:**
- **Connectionless** — Nessuna connessione preliminare
- **Non affidabile** — Non garantisce la consegna né l'ordine
- **Veloce** — Overhead minimo (header di 8 bytes)
- **Nessun controllo di flusso** — Invia alla massima velocità possibile
- **Best effort** — Fa il possibile ma non garantisce nulla

**Casi d'uso UDP:** DNS (porta 53), streaming video/audio, VoIP, gaming online, DHCP, SNMP, TFTP.

### Tabella Comparativa TCP vs UDP

| Caratteristica | TCP | UDP |
|---------------|-----|-----|
| **Tipo di connessione** | Connection-oriented | Connectionless |
| **Affidabilità** | Affidabile (ACK, retransmission) | Non affidabile (best effort) |
| **Ordine** | Garantito | Non garantito |
| **Velocità** | Più lento | Più veloce |
| **Header** | 20-60 bytes | 8 bytes |
| **Controllo flusso** | Sì | No |
| **Handshake** | Three-way handshake | Nessuno |
| **Uso tipico** | Web, email, file transfer | DNS, streaming, VoIP, gaming |
| **Protocolli** | HTTP, FTP, SSH, SMTP | DNS, DHCP, SNMP, TFTP |

> 💡 **Per il SOC Analyst:** Un traffico UDP anomalo su porte insolite potrebbe indicare **DNS tunneling** o **data exfiltration**. TCP SYN senza completamento dell'handshake potrebbe indicare un **port scan** o un **SYN flood attack**.

---

## 🚪 Porte Comuni

Le porte identificano i servizi in esecuzione su un host. Vanno da 0 a 65535 e sono divise in:
- **Well-known ports (0-1023)** — Servizi standard
- **Registered ports (1024-49151)** — Servizi registrati
- **Dynamic/Private ports (49152-65535)** — Porte effimere

### Tabella Porte Essenziali

| Porta | Protocollo | Servizio | Descrizione | Rilevanza Sicurezza |
|-------|-----------|----------|-------------|-------------------|
| **20/21** | TCP | FTP | File Transfer Protocol (20=dati, 21=controllo) | ⚠️ Credenziali in chiaro, preferire SFTP |
| **22** | TCP | SSH | Secure Shell — accesso remoto crittografato | ✅ Sicuro, ma target di brute force |
| **23** | TCP | Telnet | Accesso remoto non crittografato | 🔴 Tutto in chiaro, MAI usare in produzione |
| **25** | TCP | SMTP | Invio email | ⚠️ Usato per spam/phishing, open relay |
| **53** | TCP/UDP | DNS | Risoluzione nomi di dominio | ⚠️ DNS tunneling, spoofing, exfiltration |
| **67/68** | UDP | DHCP | Assegnazione automatica IP | ⚠️ DHCP spoofing, rogue DHCP |
| **80** | TCP | HTTP | Web non crittografato | ⚠️ Traffico in chiaro, XSS, SQLi |
| **110** | TCP | POP3 | Ricezione email (non crittografato) | ⚠️ Credenziali in chiaro |
| **143** | TCP | IMAP | Ricezione email (non crittografato) | ⚠️ Credenziali in chiaro |
| **443** | TCP | HTTPS | Web crittografato (TLS) | ✅ Crittografato, ma può nascondere traffico malevolo |
| **445** | TCP | SMB | Condivisione file Windows | 🔴 WannaCry, EternalBlue, movimento laterale |
| **993** | TCP | IMAPS | IMAP su TLS | ✅ Versione sicura di IMAP |
| **995** | TCP | POP3S | POP3 su TLS | ✅ Versione sicura di POP3 |
| **3306** | TCP | MySQL | Database MySQL | ⚠️ Mai esporre su Internet |
| **3389** | TCP/UDP | RDP | Remote Desktop Protocol | 🔴 Target primario per attacchi brute force e ransomware |
| **5060** | TCP/UDP | SIP | Session Initiation Protocol (VoIP) | ⚠️ VoIP fraud, eavesdropping |
| **8080** | TCP | HTTP Proxy | Proxy HTTP / Web alternativo | ⚠️ Spesso servizi di sviluppo esposti |
| **8443** | TCP | HTTPS Alt | HTTPS alternativo | ⚠️ Servizi web alternativi |

> 💡 **Comando utile per verificare porte aperte:**
> ```
> netstat -an                → Mostra tutte le connessioni attive (Windows/Linux)
> netstat -ano              → Con PID del processo (Windows)
> ss -tuln                  → Socket aperti (Linux moderno)
> nmap -sV 192.168.1.0/24   → Scansione porte e servizi (da usare solo con autorizzazione!)
> ```

---

## 🌍 DNS (Domain Name System)

### Come Funziona la Risoluzione DNS

Il DNS è il **"rubrica telefonica" di Internet**: traduce i nomi di dominio leggibili dall'uomo (es. `www.google.com`) in indirizzi IP numerici (es. `142.250.180.78`).

**Processo step-by-step della risoluzione DNS:**

```
L'utente digita www.esempio.com nel browser

1. Browser controlla la cache locale
   └─ Trovato? → Usa l'IP dalla cache
   └─ Non trovato? → Continua ↓

2. Sistema operativo controlla il file hosts e la cache DNS locale
   └─ Trovato? → Usa l'IP
   └─ Non trovato? → Continua ↓

3. Query al DNS Resolver (ISP o DNS configurato, es. 8.8.8.8)
   └─ Trovato nella cache del resolver? → Risponde
   └─ Non trovato? → Continua ↓

4. Resolver interroga il Root DNS Server (.)
   └─ Root risponde: "Per .com vai al TLD server X"

5. Resolver interroga il TLD Server (.com)
   └─ TLD risponde: "Per esempio.com vai al server autoritativo Y"

6. Resolver interroga il Server Autoritativo (esempio.com)
   └─ Autoritativo risponde: "www.esempio.com = 93.184.216.34"

7. Resolver memorizza nella cache e restituisce l'IP al client

8. Browser si connette all'IP 93.184.216.34
```

### Tipi di Record DNS

| Tipo | Descrizione | Esempio |
|------|-------------|---------|
| **A** | Mappa un dominio a un indirizzo IPv4 | `esempio.com → 93.184.216.34` |
| **AAAA** | Mappa un dominio a un indirizzo IPv6 | `esempio.com → 2606:2800:220:1:248:...` |
| **CNAME** | Alias: punta un dominio a un altro dominio | `www.esempio.com → esempio.com` |
| **MX** | Mail Exchange: server di posta per il dominio | `esempio.com → mail.esempio.com (priority 10)` |
| **TXT** | Testo libero (SPF, DKIM, DMARC, verifiche) | `esempio.com → "v=spf1 include:..."` |
| **PTR** | Reverse DNS: mappa un IP a un dominio | `34.216.184.93 → esempio.com` |
| **NS** | Name Server: server DNS autoritativi | `esempio.com → ns1.esempio.com` |
| **SOA** | Start of Authority: informazioni sulla zona | Contiene: serial, refresh, retry, expire |
| **SRV** | Service: indica servizio, porta e host | `_sip._tcp.esempio.com → sipserver:5060` |

**Comandi utili per query DNS:**

```bash
# Windows
nslookup www.google.com           → Risoluzione base
nslookup -type=MX gmail.com       → Record MX
nslookup -type=TXT esempio.com    → Record TXT (SPF, DKIM)

# Linux
dig www.google.com                → Risoluzione completa
dig MX gmail.com                  → Record MX
dig TXT esempio.com               → Record TXT
dig +trace www.esempio.com        → Traccia l'intera risoluzione
host www.google.com               → Risoluzione rapida
```

### Attacchi DNS

#### DNS Poisoning / Spoofing

**Cos'è:** L'attaccante inietta **record DNS falsificati** nella cache di un DNS resolver, facendo sì che gli utenti vengano reindirizzati verso siti malevoli.

**Come funziona:**
1. L'attaccante invia risposte DNS contraffatte al resolver
2. Il resolver memorizza l'IP falso nella cache
3. Tutti gli utenti che richiedono quel dominio vengono reindirizzati al sito dell'attaccante

**Come difendersi:** DNSSEC, DNS over HTTPS (DoH), DNS over TLS (DoT), validazione delle risposte.

#### DNS Tunneling

**Cos'è:** Tecnica che utilizza il protocollo DNS per **trasmettere dati** (spesso per eludere firewall e proxy) codificandoli nelle query DNS.

**Come funziona:**
1. I dati vengono codificati nel sottodominio della query DNS
2. Es: `dati-codificati-in-base64.evil.com`
3. Il server DNS malevolo decodifica e risponde con dati nel record

**Come rilevarlo (indicatori):**
- Query DNS insolitamente lunghe (sottodomini > 50 caratteri)
- Volume elevato di query verso un singolo dominio
- Record TXT di grandi dimensioni
- Query DNS verso domini sospetti o appena registrati

**Query SIEM per rilevamento:**
```spl
index=dns | where len(query) > 50
| stats count by query, src_ip
| sort -count
```

#### DNS Exfiltration

**Cos'è:** Utilizzare il DNS per **esfiltrare dati sensibili** dall'organizzazione, sfruttando il fatto che il traffico DNS (porta 53) è spesso consentito dai firewall.

**Come funziona:**
1. I dati rubati vengono suddivisi in piccoli blocchi
2. Ogni blocco viene codificato e inviato come subdomain di una query DNS
3. Es: `cGFzc3dvcmQ=.data.attacker.com`
4. Il server DNS dell'attaccante raccoglie e riassembla i dati

**Indicatori:**
- Query DNS con alto volume di dati nei sottodomini
- Pattern regolari di query verso domini sconosciuti
- Incremento anomalo del traffico DNS

---

## 🌐 HTTP/HTTPS

### Metodi HTTP

| Metodo | Descrizione | Quando si Usa | Idempotente |
|--------|-------------|--------------|-------------|
| **GET** | Richiede una risorsa | Caricare una pagina, scaricare un file | ✅ Sì |
| **POST** | Invia dati al server | Invio form, login, upload file | ❌ No |
| **PUT** | Sostituisce una risorsa | Aggiornare un intero record | ✅ Sì |
| **DELETE** | Elimina una risorsa | Cancellare un record | ✅ Sì |
| **PATCH** | Modifica parziale di una risorsa | Aggiornare un campo specifico | ❌ No |
| **HEAD** | Come GET ma restituisce solo gli header | Verificare se una risorsa esiste | ✅ Sì |
| **OPTIONS** | Descrive le opzioni di comunicazione | CORS preflight, verifica metodi supportati | ✅ Sì |

> 💡 **Per il SOC Analyst:** Metodi insoliti come PUT o DELETE verso server web possono indicare tentativi di **web shell upload** o **defacement**.

### Status Code HTTP

| Codice | Significato | Rilevanza SOC |
|--------|-------------|---------------|
| **200** | OK — Richiesta riuscita | Normale |
| **201** | Created — Risorsa creata | Upload riuscito, potenziale web shell |
| **301** | Moved Permanently — Redirect permanente | Legittimo o redirect malevolo |
| **302** | Found — Redirect temporaneo | Spesso usato in phishing |
| **400** | Bad Request — Richiesta malformata | Possibile tentativo di injection |
| **401** | Unauthorized — Autenticazione richiesta | Login fallito, brute force |
| **403** | Forbidden — Accesso negato | Tentativo di accesso non autorizzato |
| **404** | Not Found — Risorsa non trovata | Scansione directory, enumeration |
| **405** | Method Not Allowed — Metodo non permesso | Tentativo di metodo non autorizzato |
| **500** | Internal Server Error — Errore del server | Possibile injection riuscita |
| **502** | Bad Gateway — Gateway non valido | Problema infrastrutturale |
| **503** | Service Unavailable — Servizio non disponibile | Possibile DDoS |

> 💡 **Pattern sospetti da monitorare:**
> - Molti **401** dallo stesso IP → brute force
> - Molti **404** in sequenza → directory enumeration (Gobuster, DirBuster)
> - **500** dopo input specifici → SQL injection o command injection
> - **302** verso domini sconosciuti → redirect malevolo

### Headers di Sicurezza

| Header | Descrizione | Esempio |
|--------|-------------|---------|
| **Content-Security-Policy (CSP)** | Controlla le risorse che il browser può caricare | `Content-Security-Policy: default-src 'self'` |
| **X-Frame-Options** | Previene il clickjacking impedendo l'inclusione in iframe | `X-Frame-Options: DENY` |
| **Strict-Transport-Security (HSTS)** | Forza l'uso di HTTPS | `Strict-Transport-Security: max-age=31536000` |
| **X-Content-Type-Options** | Previene il MIME sniffing | `X-Content-Type-Options: nosniff` |
| **X-XSS-Protection** | Attiva il filtro XSS del browser (deprecato) | `X-XSS-Protection: 1; mode=block` |
| **Referrer-Policy** | Controlla le informazioni inviate nel header Referer | `Referrer-Policy: strict-origin` |

### HTTP vs HTTPS e TLS/SSL

| Caratteristica | HTTP | HTTPS |
|---------------|------|-------|
| **Porta** | 80 | 443 |
| **Crittografia** | ❌ Nessuna | ✅ TLS/SSL |
| **Integrità** | ❌ Dati modificabili | ✅ Dati protetti |
| **Autenticazione** | ❌ Server non verificato | ✅ Certificato digitale |
| **Prestazioni** | Leggermente più veloce | Overhead TLS minimo |
| **Visibilità traffico** | Tutto leggibile | Contenuto crittografato |

**Come funziona il TLS Handshake (semplificato):**

```
Client                              Server
  |                                     |
  |--- ClientHello (versioni TLS, ----->|  1. Client propone parametri
  |    cipher suites supportate)        |
  |                                     |
  |<-- ServerHello (versione TLS, -----|  2. Server sceglie parametri
  |    cipher suite, certificato)       |     e invia certificato
  |                                     |
  |    Client verifica il certificato   |  3. Verifica validità
  |    (CA, scadenza, dominio)          |     del certificato
  |                                     |
  |--- Key Exchange ------------------>|  4. Scambio chiavi
  |<-- Key Exchange -------------------|     (Diffie-Hellman / RSA)
  |                                     |
  |=== Comunicazione Crittografata ====|  5. Dati crittografati
  |                                     |     con chiave simmetrica
```

> ⚠️ **Per il SOC Analyst:** HTTPS cripta il contenuto ma **non nasconde** l'IP di destinazione e il nome del dominio (visibile nel SNI durante il TLS handshake). Questo è importante per il monitoraggio di rete.

---

## 🧮 Subnetting e CIDR

### Cos'è una Subnet

Una **subnet (sottorete)** è una suddivisione logica di una rete IP più grande. Il subnetting permette di:
- Organizzare la rete in segmenti più piccoli
- Migliorare le prestazioni riducendo il dominio di broadcast
- Aumentare la sicurezza isolando i segmenti
- Ottimizzare l'uso degli indirizzi IP

### Notazione CIDR

Il **CIDR (Classless Inter-Domain Routing)** utilizza la notazione **IP/prefisso** dove il prefisso indica il numero di bit della parte di rete.

**Esempio:** `192.168.1.0/24`
- `/24` significa che i primi 24 bit sono la parte di rete
- Gli ultimi 8 bit sono per gli host
- Subnet mask: `255.255.255.0`
- Host disponibili: 2⁸ - 2 = **254** (si escludono network e broadcast)

### Subnet Mask Comuni

| CIDR | Subnet Mask | Host Disponibili | Utilizzo Tipico |
|------|-------------|-------------------|-----------------|
| /8 | 255.0.0.0 | 16.777.214 | Reti molto grandi (classe A) |
| /16 | 255.255.0.0 | 65.534 | Reti grandi (classe B) |
| /24 | 255.255.255.0 | 254 | LAN standard (classe C) |
| /25 | 255.255.255.128 | 126 | Metà di una /24 |
| /26 | 255.255.255.192 | 62 | Segmento medio |
| /27 | 255.255.255.224 | 30 | Segmento piccolo |
| /28 | 255.255.255.240 | 14 | Piccolo segmento DMZ |
| /29 | 255.255.255.248 | 6 | Collegamento point-to-point |
| /30 | 255.255.255.252 | 2 | Link tra router |
| /32 | 255.255.255.255 | 1 | Singolo host |

### Indirizzi IP Privati (RFC 1918)

| Range | CIDR | Classe | Host Disponibili |
|-------|------|--------|-----------------|
| 10.0.0.0 – 10.255.255.255 | 10.0.0.0/8 | A | ~16 milioni |
| 172.16.0.0 – 172.31.255.255 | 172.16.0.0/12 | B | ~1 milione |
| 192.168.0.0 – 192.168.255.255 | 192.168.0.0/16 | C | ~65.000 |

> 💡 **Esempio di calcolo base:**
> Rete: `192.168.10.0/26`
> - Subnet mask: `255.255.255.192`
> - Host disponibili: 2⁶ - 2 = **62**
> - Range: `192.168.10.1` – `192.168.10.62`
> - Network address: `192.168.10.0`
> - Broadcast address: `192.168.10.63`

---

## 🔀 NAT e PAT

### NAT (Network Address Translation)

Il **NAT** traduce gli indirizzi IP privati in indirizzi IP pubblici e viceversa, permettendo a dispositivi con IP privati di comunicare su Internet.

#### Tipi di NAT

| Tipo | Descrizione | Esempio |
|------|-------------|---------|
| **Static NAT** | Mappatura 1:1 tra IP privato e pubblico | `192.168.1.10 ↔ 203.0.113.10` (sempre lo stesso) |
| **Dynamic NAT** | Pool di IP pubblici assegnati dinamicamente | `192.168.1.x → uno dei 203.0.113.10-20` |
| **PAT (Port Address Translation)** | Molti IP privati condividono UN solo IP pubblico, distinti dalla porta | `192.168.1.10:5000 → 203.0.113.1:40001`, `192.168.1.11:5000 → 203.0.113.1:40002` |

Il **PAT** (anche chiamato NAT Overload) è il tipo più comune: è quello usato dal router di casa per permettere a tutti i dispositivi di navigare con un singolo IP pubblico.

**Esempio pratico PAT:**
```
Rete Interna                     Router (PAT)              Internet
192.168.1.10:5000  ──┐
192.168.1.11:5001  ──┤──→  203.0.113.1:40001   ──→   Server Web
192.168.1.12:5002  ──┘     203.0.113.1:40002          8.8.8.8
                           203.0.113.1:40003
```

**Importanza per la sicurezza:**
- Il NAT **nasconde** la struttura interna della rete
- Nei log dei firewall e del server web, il SOC Analyst vede l'IP **pubblico** (NATtato), non l'IP privato dell'host interno
- Per correlare un'attività con un host specifico, servono i **log NAT del firewall/router**

---

## 📡 ARP e ARP Spoofing

### Cos'è ARP (Address Resolution Protocol)

ARP è il protocollo che **traduce gli indirizzi IP in indirizzi MAC** all'interno di una rete locale. Quando un dispositivo vuole comunicare con un altro sulla stessa rete, deve conoscere il suo MAC address.

**Come funziona:**

```
1. PC-A (192.168.1.10) vuole comunicare con PC-B (192.168.1.20)
   ma non conosce il suo MAC address

2. PC-A invia un ARP Request in broadcast:
   "Chi ha l'IP 192.168.1.20? Comunicatemi il vostro MAC!"
   (Destinazione: FF:FF:FF:FF:FF:FF → tutti i dispositivi)

3. PC-B riceve la richiesta e risponde con un ARP Reply:
   "Sono io 192.168.1.20, il mio MAC è AA:BB:CC:DD:EE:FF"

4. PC-A salva l'associazione nella tabella ARP locale (cache)

5. PC-A può ora inviare frame direttamente a PC-B usando il MAC
```

### ARP Spoofing / Poisoning

**Cos'è:** L'attaccante invia **risposte ARP falsificate** alla rete, associando il proprio MAC address all'IP di un altro dispositivo (tipicamente il gateway). Questo gli permette di intercettare tutto il traffico (Man-in-the-Middle).

**Come funziona l'attacco:**

```
Situazione Normale:
PC-A  ←─────────────── Gateway (192.168.1.1, MAC: GW:GW:GW)
       traffico diretto

Attacco ARP Spoofing:
Attaccante invia ARP Reply falso a PC-A:
"192.168.1.1 ha MAC ATK:ATK:ATK" (il MAC dell'attaccante)

Risultato:
PC-A → Attaccante → Gateway → Internet
       (intercetta tutto il traffico!)
```

**Conseguenze:**
- **Man-in-the-Middle (MitM)** — L'attaccante vede tutto il traffico
- **Session hijacking** — Può rubare sessioni attive
- **Credential theft** — Intercetta credenziali non crittografate
- **Denial of Service** — Può interrompere la comunicazione

**Come rilevare ARP Spoofing:**
- **Strumenti di monitoraggio ARP**: arpwatch, XArp
- **Analisi della tabella ARP**: cercare MAC duplicati per IP diversi
- **IDS/IPS**: regole per rilevare ARP reply non sollecitati
- **SIEM**: correlare alert di ARP anomali

**Comandi utili:**
```bash
# Windows
arp -a                    → Mostra la tabella ARP
arp -d                    → Cancella la cache ARP

# Linux
arp -n                    → Mostra la tabella ARP
ip neigh show             → Mostra vicini (Linux moderno)

# Controllare duplicati (segnale di ARP spoofing):
# Se due IP diversi hanno lo stesso MAC address → ALERT!
```

**Contromisure:**
- **Dynamic ARP Inspection (DAI)** sugli switch
- **Static ARP entries** per i server critici e il gateway
- **802.1X** per autenticazione a livello di porta
- **Segmentazione VLAN** per limitare il dominio di broadcast
- **VPN / Crittografia** per proteggere i dati in transito

---

## 🎯 Domande da Colloquio

### Domanda 1: Descrivi il modello OSI e i suoi 7 livelli.

**Risposta:**
Il modello OSI (Open Systems Interconnection) è un framework concettuale a 7 livelli che standardizza le funzioni di comunicazione in una rete. Dal basso verso l'alto: **Livello 1 (Fisico)** gestisce la trasmissione dei bit sul mezzo fisico; **Livello 2 (Data Link)** gestisce i frame e gli indirizzi MAC con gli switch; **Livello 3 (Rete)** si occupa dell'indirizzamento IP e del routing con i router; **Livello 4 (Trasporto)** gestisce la comunicazione end-to-end con TCP (affidabile) e UDP (veloce); **Livello 5 (Sessione)** gestisce le sessioni di comunicazione; **Livello 6 (Presentazione)** si occupa di crittografia, encoding e compressione; **Livello 7 (Applicazione)** fornisce i servizi di rete alle applicazioni (HTTP, DNS, FTP). Come SOC Analyst, è fondamentale conoscere il modello OSI perché gli attacchi operano a livelli diversi: un ARP spoofing è a livello 2, un port scan a livello 4, un SQL injection a livello 7.

---

### Domanda 2: Qual è la differenza tra TCP e UDP?

**Risposta:**
**TCP** è un protocollo orientato alla connessione che garantisce la consegna affidabile e ordinata dei dati. Prima di trasmettere, stabilisce una connessione tramite il three-way handshake (SYN → SYN-ACK → ACK), utilizza acknowledgement e retransmission per garantire la consegna, e ha meccanismi di controllo di flusso e congestione. Viene usato per HTTP, FTP, SSH, email. **UDP** è connectionless: invia i dati senza stabilire una connessione, non garantisce la consegna né l'ordine, ma è molto più veloce per il suo overhead minimo (header di 8 bytes vs 20+ di TCP). Viene usato per DNS, streaming, VoIP e gaming dove la velocità è più importante dell'affidabilità. Per un SOC Analyst, conoscere questa differenza è cruciale: un SYN flood sfrutta il three-way handshake di TCP, mentre un DNS tunneling sfrutta il traffico UDP sulla porta 53.

---

### Domanda 3: Spiega il three-way handshake di TCP.

**Risposta:**
Il three-way handshake è il processo con cui TCP stabilisce una connessione affidabile in tre passaggi: **1) SYN**: il client invia un pacchetto con il flag SYN attivo e un numero di sequenza iniziale al server, dicendo "voglio connettermi". **2) SYN-ACK**: il server risponde con un pacchetto con i flag SYN e ACK attivi, confermando la ricezione e proponendo il proprio numero di sequenza, dicendo "accetto, connettiamoci". **3) ACK**: il client invia un pacchetto con il flag ACK per confermare la ricezione del SYN-ACK del server, dicendo "confermo, iniziamo". A questo punto la connessione è stabilita e i dati possono fluire in entrambe le direzioni. Da un punto di vista di sicurezza, il **SYN flood** è un attacco DoS che invia migliaia di SYN senza completare l'handshake, esaurendo le risorse del server. I **port scan SYN** (half-open scan) inviano SYN e analizzano la risposta senza completare la connessione, per enumerare le porte aperte.

---

### Domanda 4: Come funziona la risoluzione DNS?

**Risposta:**
Quando un utente digita un URL nel browser, la risoluzione DNS avviene in più passaggi: prima il browser e il sistema operativo controllano le **cache locali** e il file hosts. Se non trovano una corrispondenza, la query viene inviata al **DNS Resolver** configurato (tipicamente del provider o un DNS pubblico come 8.8.8.8). Il resolver, se non ha la risposta in cache, interroga i **Root DNS Server** che rispondono indicando il TLD server appropriato (es. per .com). Il resolver poi contatta il **TLD Server** che indica il server autoritativo del dominio. Infine, il **server autoritativo** risponde con l'IP effettivo associato al dominio. Il resolver memorizza il risultato nella cache (con un TTL) e lo restituisce al client. Questo processo è fondamentale per la sicurezza: un attacco di **DNS poisoning** può iniettare risposte false nella cache del resolver, un **DNS tunneling** può usare le query DNS per esfiltrare dati, e il monitoraggio del traffico DNS è essenziale per rilevare comunicazioni C2.

---

### Domanda 5: Cosa sono i record MX e TXT nel DNS?

**Risposta:**
Il **record MX** (Mail Exchange) specifica i server di posta elettronica responsabili per la ricezione delle email di un dominio. Ogni record MX ha una priorità (il numero più basso ha la priorità più alta), e quando si invia un'email a `utente@esempio.com`, il server di posta del mittente consulta i record MX di `esempio.com` per sapere a quale server consegnare l'email. Il **record TXT** è un campo generico che può contenere testo arbitrario e viene usato per diverse funzioni di sicurezza: **SPF** (Sender Policy Framework) indica quali server sono autorizzati a inviare email per il dominio; **DKIM** (DomainKeys Identified Mail) contiene la chiave pubblica per verificare la firma digitale delle email; **DMARC** (Domain-based Message Authentication) definisce la policy di autenticazione email. Per un SOC Analyst, verificare i record TXT è importante nell'analisi di campagne di phishing per controllare se il dominio mittente ha SPF/DKIM/DMARC configurati correttamente.

---

### Domanda 6: Qual è la differenza tra HTTP e HTTPS?

**Risposta:**
La differenza fondamentale è la **crittografia**: HTTP (porta 80) trasmette i dati in chiaro, quindi chiunque intercetti il traffico può leggerne il contenuto (credenziali, dati personali, cookie). HTTPS (porta 443) utilizza il protocollo **TLS** (Transport Layer Security, successore di SSL) per crittografare la comunicazione, garantendo tre proprietà: **confidenzialità** (i dati sono illeggibili per chi intercetta), **integrità** (i dati non possono essere modificati in transito) e **autenticazione** (il server è verificato tramite certificato digitale). Il TLS handshake stabilisce una sessione crittografata scambiando chiavi in modo sicuro. Per un SOC Analyst, è importante sapere che HTTPS protegge il contenuto ma non nasconde completamente le comunicazioni: l'IP di destinazione e il nome del dominio (visibile nel SNI) rimangono in chiaro. Inoltre, il traffico HTTPS malevolo (C2, data exfiltration) è più difficile da ispezionare senza strumenti di TLS inspection.

---

### Domanda 7: Cos'è il subnetting e a cosa serve?

**Risposta:**
Il subnetting è la suddivisione di una rete IP in sottoreti più piccole. Serve per **organizzare** la rete in segmenti logici, **migliorare le prestazioni** riducendo il traffico broadcast, **aumentare la sicurezza** isolando i segmenti (ad esempio separare la rete degli uffici dalla DMZ e dai server) e **ottimizzare** l'uso degli indirizzi IP. La notazione CIDR `/24` indica quanti bit sono dedicati alla parte di rete: una rete `/24` con subnet mask `255.255.255.0` ha 254 host utilizzabili, una `/25` ne ha 126, e così via. Gli indirizzi privati definiti da RFC 1918 (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16) sono usati nelle reti interne. Per un SOC Analyst, il subnetting è importante per capire la topologia della rete, identificare da quale segmento proviene un alert e valutare l'impatto di una compromissione.

---

### Domanda 8: Cosa sono NAT e PAT?

**Risposta:**
**NAT** (Network Address Translation) è una tecnica che traduce gli indirizzi IP privati in indirizzi IP pubblici, permettendo ai dispositivi interni di comunicare su Internet. Esistono tre tipi: **Static NAT** (mappatura 1:1 fissa), **Dynamic NAT** (pool di IP pubblici assegnati dinamicamente) e **PAT** (Port Address Translation, anche chiamato NAT Overload), dove molti dispositivi condividono un singolo IP pubblico, distinti tramite porte diverse. PAT è il tipo più comune, usato da tutti i router domestici e aziendali. Per un SOC Analyst, il NAT ha implicazioni importanti: nei log esterni vediamo l'IP pubblico (NATtato), quindi per risalire al dispositivo interno specifico servono i **log NAT del firewall** che mostrano la corrispondenza tra IP privato e porta sorgente.

---

### Domanda 9: Cos'è l'ARP spoofing e come si rileva?

**Risposta:**
L'**ARP spoofing** (o ARP poisoning) è un attacco in cui l'attaccante invia risposte ARP falsificate all'interno della rete locale, associando il proprio MAC address all'IP di un dispositivo legittimo (tipicamente il gateway). Questo permette all'attaccante di intercettare tutto il traffico (Man-in-the-Middle), rubare credenziali, modificare dati in transito o causare Denial of Service. Per **rilevarlo**: si monitora la tabella ARP cercando duplicazioni (due IP diversi con lo stesso MAC o un IP con un MAC cambiato improvvisamente); si utilizzano strumenti come **arpwatch** che tracciano le associazioni IP-MAC e alertano sui cambiamenti; si configurano regole nell'IDS/IPS per rilevare ARP reply non sollecitati. Le **contromisure** includono: Dynamic ARP Inspection (DAI) sugli switch managed, entry ARP statiche per i server critici, segmentazione VLAN per limitare il dominio di broadcast e 802.1X per l'autenticazione a livello di porta.

---

### Domanda 10: Quali porte sono critiche dal punto di vista della sicurezza e perché?

**Risposta:**
Le porte più critiche per la sicurezza includono: **445 (SMB)** — bersaglio di exploit devastanti come EternalBlue (WannaCry) e usata per il movimento laterale; **3389 (RDP)** — target primario per brute force e ransomware, spesso esposta su Internet per errore; **22 (SSH)** — target di brute force, ma almeno è crittografato; **23 (Telnet)** — trasmette tutto in chiaro, incluse le credenziali, non dovrebbe mai essere usato; **53 (DNS)** — può essere sfruttato per DNS tunneling ed exfiltration; **25 (SMTP)** — usato per spam e phishing se configurato come open relay; **80/443 (HTTP/HTTPS)** — superficie d'attacco per vulnerabilità web (SQLi, XSS, RCE). Un SOC Analyst deve monitorare attentamente il traffico su queste porte: servizi come Telnet (23), FTP (21) e SMB (445) non dovrebbero mai essere esposti su Internet, e traffico anomalo su porte come DNS (53) può indicare data exfiltration. I port scan che rilevano porte aperte inattese sono spesso il primo segnale di una compromissione.
