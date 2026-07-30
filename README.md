<div align="center">

# 🔌 Smart Plug — Prise Connectée Intelligente

### *Mesure de consommation électrique et commande à distance via IoT*

[![ESP32](https://img.shields.io/badge/ESP32--C3-Super%20Mini-E7352C.svg?logo=espressif&logoColor=white)](https://www.espressif.com/)
[![Arduino](https://img.shields.io/badge/Arduino-IDE-00979D.svg?logo=arduino&logoColor=white)](https://www.arduino.cc/)
[![MQTT](https://img.shields.io/badge/MQTT-HiveMQ-660066.svg?logo=eclipsemosquitto&logoColor=white)](https://www.hivemq.com/)
[![Node-RED](https://img.shields.io/badge/Node--RED-Dashboard-8F0000.svg?logo=nodered&logoColor=white)](https://nodered.org/)
[![Proteus](https://img.shields.io/badge/Proteus-8.16-0078D4.svg)](https://www.labcenter.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**Projet IoT — Conception, simulation et réalisation d'une prise intelligente**

</div>

---

## 📑 Table des matières

- [Présentation](#-présentation)
- [Problématique](#-problématique)
- [Objectifs](#-objectifs)
- [Architecture du système](#️-architecture-du-système)
- [Liste des composants](#-liste-des-composants)
- [Choix techniques justifiés](#-choix-techniques-justifiés)
- [Conception et simulation Proteus](#-conception-et-simulation-proteus)
- [Réalisation matérielle](#-réalisation-matérielle)
- [Programmation ESP32](#-programmation-esp32)
- [Communication MQTT](#-communication-mqtt)
- [Interface Node-RED](#-interface-node-red)
- [Installation et démarrage](#-installation-et-démarrage)
- [Sécurité](#️-sécurité)
- [Perspectives](#-perspectives)

---

## 🎯 Présentation

Ce projet consiste à concevoir, simuler et réaliser une **prise électrique connectée** (*Smart Plug*) capable de :

| Fonctionnalité | Description |
|:---|:---|
| ⚡ **Mesurer la consommation** | Courant, tension, puissance, énergie et coût en temps réel |
| 📱 **Commander à distance** | Allumer / éteindre l'appareil branché depuis une interface web |
| 🌐 **Communiquer en IoT** | Transmission des données via le protocole MQTT sécurisé |
| 🛡️ **Protéger l'installation** | Coupure automatique en cas de dépassement de seuils |

Le cœur du système repose sur un microcontrôleur **ESP32-C3 Super Mini**, qui communique avec un broker **HiveMQ** et alimente un tableau de bord **Node-RED**.

---

## ❗ Problématique

Dans le contexte actuel de **transition énergétique** et de développement des **maisons intelligentes**, la gestion efficace de la consommation électrique est devenue une nécessité.

Les prises classiques présentent deux limites majeures :

- ❌ **Aucun contrôle à distance** des appareils branchés
- ❌ **Aucune visibilité** sur la consommation réelle

Ces limites entraînent un **gaspillage d'énergie** et un manque d'information pour l'utilisateur. L'émergence de l'**Internet des Objets (IoT)** offre aujourd'hui des solutions concrètes pour rendre les équipements électriques plus intelligents et connectés.

> 💡 **Problématique retenue :** *Comment concevoir une prise intelligente, économique et sécurisée, capable de mesurer la consommation électrique et d'être pilotée à distance via une interface simple et conviviale ?*

---

## 🎯 Objectifs

L'objectif est de **concevoir, simuler, réaliser et tester** une prise connectée intelligente basée sur ESP32. Elle doit permettre à l'utilisateur de :

- ✅ **Activer ou désactiver** un appareil électrique branché, à distance
- ✅ **Mesurer en temps réel** la puissance et la consommation électrique
- ✅ **Transmettre les données** via le protocole IoT MQTT vers le broker HiveMQ
- ✅ **Visualiser et commander** la prise depuis une interface Node-RED

En atteignant ces objectifs, le projet contribue à l'amélioration du confort de l'utilisateur, à la réduction de la consommation énergétique et à la promotion de solutions domotiques accessibles.

---

## 🏗️ Architecture du système

```
        220 V AC (Secteur)
              │
    ┌─────────┴──────────┐
    │                    │
    ▼                    ▼
┌─────────┐      ┌────────────────┐
│ AC-DC   │      │  RELAIS 12V    │──────► ⚡ CHARGE
│ HLK-2M05│      │  Songle SRD    │        (Appareil)
│ 5V/3.3V │      └────────────────┘           │
└────┬────┘              ▲                    │
     │                   │              ┌─────┴──────┐
     │            ┌──────┴──────┐       │   SHUNT    │
     │            │             │       │  0.024 Ω   │
     ▼            │             │       └─────┬──────┘
┌─────────────────┴──┐          │             │
│                    │          │       ┌─────▼──────┐
│   ESP32-C3         │◄─────────┼───────│  AOP       │
│   Super Mini       │  courant │       │  MCP6004   │
│                    │          │       └────────────┘
│  • ADC             │◄─────────┼───────┌────────────┐
│  • Wi-Fi           │  tension │       │  DIVISEUR  │
│  • Traitement      │          │       │  2MΩ/10kΩ  │
└────────┬───────────┘          │       └────────────┘
         │                      │
         │ MQTT / TLS           │
         ▼                      │
   ┌──────────┐                 │
   │  HiveMQ  │                 │
   │  Broker  │                 │
   └────┬─────┘                 │
        │                       │
        ▼                       │
  ┌───────────┐   commandes     │
  │ Node-RED  │─────────────────┘
  │ Dashboard │
  └───────────┘
```

### Séparation des circuits

Le montage distingue clairement deux domaines pour garantir la sécurité :

| Circuit | Tension | Composants |
|:---|:---:|:---|
| 🔴 **Haute puissance** | 220 V AC | Relais, shunt résistif, charge connectée |
| 🟢 **Basse puissance** | 3.3 / 5 V DC | ESP32-C3, AC-DC, amplificateur opérationnel |

L'isolation entre les deux est assurée par le **relais électromécanique** et le **convertisseur AC-DC**.

---

## 🧩 Liste des composants

| # | Composant | Référence | Rôle |
|:---:|:---|:---|:---|
| 1 | Microcontrôleur | **ESP32-C3 Super Mini** | Cœur du système : mesures, pilotage, communication |
| 2 | Relais | **Songle SRD-12V** | Commutation de la charge (250 V / 10 A) |
| 3 | Convertisseur AC-DC | **Hi-Link HLK-2M05** | 220 V AC → 5 V DC (2 W) |
| 4 | Capteur de tension | **Diviseur résistif** (2 MΩ / 10 kΩ) | Abaissement de la tension secteur |
| 5 | Capteur de courant | **Shunt résistif** (9 × 0.220 Ω ∥) | Mesure du courant par chute de tension |
| 6 | Amplificateur | **MCP6004** | Amplification différentielle du signal shunt |

### Détail des composants clés

#### 🔷 ESP32-C3 Super Mini

Microcontrôleur compact et économique intégrant le **Wi-Fi** et le **Bluetooth Low Energy (BLE)**. Dans ce projet il assure :

- L'acquisition des signaux analogiques (tension, courant)
- Le traitement et le calcul des grandeurs électriques
- Le pilotage du relais
- La communication MQTT sécurisée avec HiveMQ

Sa petite taille et sa faible consommation en font une solution idéale pour la domotique.

#### 🔷 Relais Songle SRD-12V

Relais électromécanique alimenté par une bobine 12 V, capable de commuter jusqu'à **250 V – 10 A**. Il assure une **isolation galvanique** entre la partie commande (ESP32, 3.3 V) et la partie puissance (220 V), garantissant la sécurité du système.

#### 🔷 Convertisseur Hi-Link HLK-2M05

Module d'alimentation transformant le **220 V AC** en **5 V DC** (2 W). Il alimente l'ensemble du circuit basse puissance tout en assurant l'isolation électrique.

---

## 🔍 Choix techniques justifiés

Deux décisions de conception méritent d'être détaillées, car elles s'écartent des solutions « standard » couramment utilisées.

### Mesure de tension : diviseur résistif *plutôt que* ZMPT10B

| Critère | Diviseur résistif ✅ | ZMPT10B ❌ |
|:---|:---|:---|
| **Coût** | Très faible (2 résistances) | Module dédié plus cher |
| **Étalonnage** | Aucun réglage nécessaire | Étalonnage précis requis |
| **Stabilité** | Sortie stable et prévisible | Valeurs parfois aléatoires |
| **Sensibilité au bruit** | Faible | Élevée (amplificateur interne) |
| **Complexité** | Simple à mettre en œuvre | Nécessite un potentiomètre |

**Configuration retenue :** R1 = 2 MΩ, R2 = 10 kΩ

Ce montage abaisse la tension secteur à une plage sécurisée et compatible avec l'entrée analogique du microcontrôleur, tout en restant économique et fiable.

### Mesure de courant : shunt résistif *plutôt que* ACS712

| Critère | Shunt résistif ✅ | ACS712 ❌ |
|:---|:---|:---|
| **Coût** | Très faible (9 résistances) | Module dédié |
| **Sortie à vide** | 0 V (pas de charge = pas de signal) | Valeurs parasites même sans charge |
| **Réglage** | Aucun | Potentiomètre nécessaire |
| **Pertes** | Minimes (résistance très faible) | Faibles |
| **Stabilité** | Excellente | Moyenne |

**Configuration retenue :** 9 résistances de 0.220 Ω en parallèle

```
R_équivalente = 0.220 / 9 ≈ 0.024 Ω
```

Cette valeur très faible limite les pertes de puissance tout en générant une chute de tension proportionnelle au courant.

### Amplification du signal shunt

La résistance shunt étant très faible (≈ 0.024 Ω), la chute de tension générée reste trop petite pour être lue directement par l'ADC de l'ESP32 :

```
Pour I = 16 A  →  U_shunt = 16 × 0.024 ≈ 0.39 V
```

Un **amplificateur opérationnel MCP6004** configuré en montage différentiel applique un **gain d'environ 8** pour exploiter toute la plage de l'ADC (0 – 3.3 V) :

```
0.39 V × 8 ≈ 3.1 V  →  utilisation optimale de la dynamique ADC
```

### Adaptation du signal pour l'ADC — le point milieu

L'ESP32 fonctionne en **3.3 V** et ses entrées analogiques **ne peuvent pas mesurer de tensions négatives**. Or les signaux issus du secteur sont **alternatifs**, donc centrés autour de 0 V.

**Solution :** ajout d'un décalage continu (*offset*) de **1.65 V** — soit la moitié de 3.3 V — obtenu par un pont diviseur symétrique (R4 = R5 = 1 kΩ).

```
Sans offset :  -1.65 V  ←──── 0 V ────►  +1.65 V   ❌ moitié perdue
Avec offset  :      0 V  ←── 1.65 V ──►   +3.3 V   ✅ signal complet
```

Cette méthode garantit que toutes les valeurs lues par le convertisseur analogique-numérique restent positives et compatibles avec sa plage d'entrée.

---

## 🖥️ Conception et simulation Proteus

### Environnement de travail

Proteus n'étant pas compatible avec Linux, une chaîne de virtualisation a été mise en place :

```
Ubuntu (système hôte)
   └── VirtualBox
         └── Windows 10 (machine virtuelle)
               └── Proteus Design Suite 8.16
```

**Configuration de la machine virtuelle :**

| Paramètre | Valeur |
|:---|:---|
| Système invité | Windows 10 (64-bit) |
| Mémoire RAM | 4547 Mo |
| Processeurs | 2 |
| Stockage | 50 Go |
| Réseau | Intel PRO/1000 MT Desktop (NAT) |

### Blocs fonctionnels du schéma

Le schéma électronique a été conçu et simulé sous Proteus afin de **valider la faisabilité du montage avant la réalisation physique**. Il se compose de :

| Bloc | Fonction |
|:---|:---|
| **Alimentation (AC-DC)** | Conversion 220 V AC → tension continue, isolation et protection |
| **Commande (Relais)** | Commutation de la charge pilotée par le microcontrôleur |
| **Charge (Machine-Elect)** | Appareil électrique branché sur la prise |
| **Mesure du courant** | Shunt + amplificateur opérationnel MCP6004 |
| **Mesure de la tension** | Pont diviseur résistif (R2, R3) |
| **Adaptation ADC** | Point milieu 1.65 V (R4, R5) |

### Résultats de simulation

#### Simulation 1 — Charge de faible résistance

```
U = 220 V   |   R_charge = 2.20 Ω   →   I = U / R = 100 A
```

Le signal de courant présente une **amplitude élevée**, traduisant une consommation électrique importante.

#### Simulation 2 — Charge de forte résistance

```
U = 220 V   |   R_charge = 220 Ω   →   I = U / R = 1 A
```

Le courant mesuré présente une **amplitude réduite**, correspondant à une consommation plus faible.

> ✅ Ces deux simulations valident le bon fonctionnement du circuit de mesure sur une large plage de courants.

---

## 🔧 Réalisation matérielle

### Circuit haute puissance (220 V)

Le circuit de puissance gère la tension secteur et la mesure du courant :

- Le **relais Songle SRD-12V** est placé en série avec la charge pour commander son alimentation
- Un **résistor shunt** est inséré en série pour mesurer l'intensité traversant la charge
- Les connexions utilisent des **câbles de section adaptée**
- L'ensemble est protégé par un **boîtier** pour garantir la sécurité de l'utilisateur

> ⚠️ Bien que le shunt soit exploité par la partie électronique, il appartient au circuit de puissance car il est directement parcouru par le courant de la charge.

### Circuit basse puissance (3.3 / 5 V)

Le circuit de commande regroupe :

- L'**ESP32-C3 Super Mini** — traitement numérique et communication
- Le **module AC-DC** — fourniture des tensions 5 V et 3.3 V
- Les **circuits de conditionnement** — amplificateur opérationnel et point milieu

Le signal du shunt est envoyé vers l'amplificateur opérationnel qui adapte l'amplitude et ajoute le décalage de 1.65 V, rendant le signal compatible avec l'ADC. L'ensemble est câblé en basse tension, **isolé du secteur**.

---

## 💻 Programmation ESP32

Le programme est développé en **C++ sous Arduino IDE**.

### Fonctionnalités du firmware

```
┌─────────────────────────────────────────┐
│  1. Connexion Wi-Fi                     │
│  2. Liaison TLS/SSL avec HiveMQ         │
│  3. Souscription aux topics de commande │
│  4. Acquisition ADC (tension + courant) │
│  5. Correction quadratique              │
│  6. Calcul RMS, puissance, énergie      │
│  7. Publication MQTT périodique         │
│  8. Pilotage du relais (manuel / auto)  │
└─────────────────────────────────────────┘
```

### Correction par régression quadratique

Les valeurs mesurées par l'ADC de l'ESP32-C3 ne sont **pas parfaitement linéaires**. Une correction est appliquée à chaque échantillon :

```cpp
// Normalisation puis correction quadratique
y = 0.2268 * x * x + 0.7732 * x + 0.0001;
```

Cette linéarisation permet d'obtenir des mesures précises du courant après calcul de la tension aux bornes du shunt et application du gain de l'amplificateur.

### Grandeurs calculées

| Grandeur | Symbole | Unité |
|:---|:---:|:---:|
| Courant efficace | I_RMS | A |
| Tension efficace | U_RMS | V |
| Puissance instantanée | P | W |
| Énergie consommée | E | kWh |
| Coût estimé | — | DT / € |

### Modes de fonctionnement du relais

| Mode | Comportement |
|:---|:---|
| **Manuel** | Le relais est piloté par les messages MQTT reçus depuis l'interface |
| **Automatique** | Le relais est coupé dès qu'un seuil de courant ou de tension est dépassé |

Le mode automatique constitue une **protection active** de l'installation contre les surcharges.

---

## 🌐 Communication MQTT

### Le broker HiveMQ

**HiveMQ** est le broker MQTT retenu pour ce projet. Il permet au Smart Plug de :

- 📤 **Publier** son état et ses mesures de consommation
- 📥 **Recevoir** les commandes envoyées à distance

### Paramètres de connexion

| Paramètre | Description |
|:---|:---|
| **Adresse du broker** | URL du cluster HiveMQ |
| **Port** | 8883 (MQTT sur TLS) |
| **Authentification** | Nom d'utilisateur + mot de passe |
| **Chiffrement** | SSL / TLS |

### Structure des topics

```
smartplug/
├── mesures/
│   ├── courant          # publication — courant RMS (A)
│   ├── tension          # publication — tension RMS (V)
│   ├── puissance        # publication — puissance (W)
│   ├── energie          # publication — énergie (kWh)
│   └── cout             # publication — coût estimé
│
└── commandes/
    ├── relais           # souscription — ON / OFF
    ├── mode             # souscription — manuel / auto
    ├── seuil_courant    # souscription — seuil de coupure (A)
    └── seuil_tension    # souscription — seuil de coupure (V)
```

### Avantages de HiveMQ

- ⚡ Communication **fiable et rapide** en temps réel
- 📈 Gestion d'un **grand nombre de connexions simultanées**
- 🔄 **Scalabilité** facile si le nombre de Smart Plugs augmente
- 🔗 **Intégration** simple avec d'autres services IoT
- 📊 Suivi de l'**historique** des données et supervision à distance

---

## 📊 Interface Node-RED

Le tableau de bord Node-RED offre une interface graphique **intuitive et interactive** permettant de superviser et piloter le Smart Plug.

### Fonctionnalités du dashboard

| Widget | Fonction |
|:---|:---|
| 🔘 **Interrupteur** | Allumer / éteindre la prise à distance |
| 📈 **Graphiques** | Évolution du courant, de la tension et de la puissance |
| 🔢 **Jauges** | Affichage instantané des grandeurs mesurées |
| 💰 **Compteurs** | Énergie cumulée et coût estimé |
| ⚙️ **Champs de saisie** | Réglage des seuils de protection |
| 🔄 **Sélecteur de mode** | Basculement manuel / automatique |

### Flux de données

```
ESP32 ──► MQTT ──► HiveMQ ──► Node-RED ──► Dashboard (navigateur)
  ▲                                              │
  └──────────── commandes utilisateur ───────────┘
```

Cette interface rend l'utilisation du dispositif simple et permet de **superviser plusieurs appareils connectés** depuis un seul tableau de bord.

---

## 🚀 Installation et démarrage

### Prérequis matériel

- ESP32-C3 Super Mini
- Composants listés dans la [section dédiée](#-liste-des-composants)
- Câble USB-C pour la programmation

### Prérequis logiciel

- [Arduino IDE](https://www.arduino.cc/en/software) (version 2.x recommandée)
- [Node.js](https://nodejs.org/) et [Node-RED](https://nodered.org/docs/getting-started/)
- Compte [HiveMQ Cloud](https://www.hivemq.com/mqtt-cloud-broker/) (offre gratuite disponible)

### 1. Configuration d'Arduino IDE

Ajouter le gestionnaire de cartes ESP32 :

```
Fichier → Préférences → URL de gestionnaire de cartes supplémentaires
https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json
```

Puis installer via **Outils → Type de carte → Gestionnaire de cartes → ESP32**.

### 2. Bibliothèques requises

| Bibliothèque | Usage |
|:---|:---|
| `WiFi` | Connexion réseau (incluse dans le core ESP32) |
| `WiFiClientSecure` | Liaison TLS/SSL |
| `PubSubClient` | Client MQTT |

### 3. Configuration du firmware

Renseigner vos identifiants dans le fichier de configuration :

```cpp
// Wi-Fi
const char* ssid       = "VOTRE_SSID";
const char* password   = "VOTRE_MOT_DE_PASSE";

// HiveMQ
const char* mqtt_server = "VOTRE_CLUSTER.hivemq.cloud";
const int   mqtt_port   = 8883;
const char* mqtt_user   = "VOTRE_UTILISATEUR";
const char* mqtt_pass   = "VOTRE_MOT_DE_PASSE";
```

### 4. Téléversement

Sélectionner la carte **ESP32C3 Dev Module**, choisir le bon port, puis téléverser.

### 5. Installation de Node-RED

```bash
# Installation
sudo npm install -g --unsafe-perm node-red

# Installation du dashboard
cd ~/.node-red
npm install node-red-dashboard

# Lancement
node-red
```

Accéder ensuite à :

- **Éditeur de flux** → `http://localhost:1880`
- **Dashboard** → `http://localhost:1880/ui`

### 6. Import du flux

Dans l'éditeur Node-RED : **Menu → Import → Clipboard**, puis coller le contenu de `node-red/flow.json`.

---

## 🛡️ Sécurité

> ⚠️ **Avertissement important**
>
> Ce projet manipule la **tension secteur 220 V**, qui présente un **danger mortel**. Toute manipulation doit être effectuée hors tension, par une personne avertie, et le montage final doit impérativement être placé dans un boîtier isolant fermé.

### Mesures de sécurité intégrées

| Mesure | Description |
|:---|:---|
| 🔒 **Isolation galvanique** | Séparation stricte entre partie puissance et partie commande |
| 🔌 **Convertisseur isolé** | Le HLK-2M05 isole l'alimentation basse tension du secteur |
| 🛑 **Seuils de protection** | Coupure automatique du relais en cas de surcharge |
| 📦 **Boîtier de protection** | Câblage protégé, aucune partie sous tension accessible |
| 🔐 **MQTT chiffré** | Communication sécurisée par TLS/SSL avec authentification |

---

## 🔮 Perspectives

- [ ] Ajouter un **écran OLED** pour l'affichage local des mesures
- [ ] Intégrer un **historique long terme** avec base de données (InfluxDB + Grafana)
- [ ] Développer une **application mobile** native (Android / iOS)
- [ ] Implémenter la **programmation horaire** (allumage / extinction planifiés)
- [ ] Ajouter la **détection d'anomalies** de consommation par apprentissage
- [ ] Gérer **plusieurs prises** depuis un seul tableau de bord
- [ ] Concevoir un **PCB dédié** pour remplacer le câblage sur breadboard
- [ ] Ajouter des **notifications push** en cas de dépassement de seuil

---

## 📚 Références

- [ESP32-C3 Documentation — Espressif](https://docs.espressif.com/projects/esp-idf/en/latest/esp32c3/)
- [MQTT Protocol Specification](https://mqtt.org/)
- [HiveMQ Documentation](https://docs.hivemq.com/)
- [Node-RED Documentation](https://nodered.org/docs/)
- [MCP6004 Datasheet — Microchip](https://www.microchip.com/en-us/product/MCP6004)
- [Hi-Link HLK-2M05 Datasheet](http://www.hlktech.net/)
- [Proteus Design Suite — Labcenter](https://www.labcenter.com/)

---

## 📄 Licence

Ce projet est distribué sous licence **MIT**. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

---

<div align="center">

**⭐ Si ce projet vous a été utile, n'hésitez pas à lui laisser une étoile !**

</div>
