# CodeCraftHub – User Management Service

Node.js/Express Service für Benutzerregistrierung und -anmeldung mit MongoDB, JWT‑Authentifizierung und getesteter Service-/Controller‑Logik.

## Features
- Registrierung mit Validierung (Pflichtfelder, minimale Passwortlänge)
- Login mit JWT‑Token (1 Stunde Gültigkeit)
- Rollen im User‑Model (`student`, `instructor`, `admin`)
- Zentrale Config für Umgebungsvariablen
- Globales Error‑Handling und Logging (Winston)
- Unit‑Tests für Service‑ und Controller‑Schicht (Jest)

## Projektstruktur

```text
src/
	app.js                # Einstiegspunkt, startet Server nach DB‑Verbindung
	config/
		env.js              # Lädt/validiert .env und exportiert Config
		db.js               # Stellt MongoDB‑Verbindung via Mongoose her
		server.js           # Erstellt konfiguriertes Express‑App‑Objekt
	controllers/
		userController.js   # HTTP‑Handler für /register und /login
	middleware/
		authMiddleware.js   # JWT‑Auth‑Middleware (Authorization: Bearer <token>)
	models/
		userModel.js        # Mongoose‑Schema/Model für Benutzer
	routes/
		userRoutes.js       # Routen für /api/users/register und /api/users/login
	services/
		userService.js      # Datenzugriff & Businesslogik rund um User
	utils/
		errorHandler.js     # Globaler Error‑Handler für Express
		logger.js           # Winston‑Logger (Konsole + error.log)
tests/
	userController.test.js
	userService.test.js
```

## Voraussetzungen

- Node.js (empfohlen: ≥ 18)
- npm
- Laufende MongoDB‑Instanz (lokal oder remote)

## Installation

```bash
cd "./CodeCraftHub"
npm install
```

## Konfiguration (.env)

Lege im Projektroot eine Datei `.env` an:

```bash
MONGO_URI=mongodb://localhost:27017/codecrafthub
JWT_SECRET=einsichereslangessecret
PORT=5000
```

`src/config/env.js` stellt sicher, dass `MONGO_URI` und `JWT_SECRET` gesetzt sind – sonst bricht der Start mit einem Fehler ab.

## Starten der Anwendung

Entwicklungsmodus mit automatischem Neustart (falls `nodemon` installiert ist, wird über `npm install` als Dev‑Dependency geholt):

```bash
npm run dev
```

Produktionsnah (ohne Watcher):

```bash
npm start
```

Die API läuft dann standardmäßig auf `http://localhost:5000` (oder dem in `PORT` gesetzten Wert).

## API‑Endpunkte

Basis‑Pfad: `http://localhost:<PORT>/api/users`

### POST /api/users/register

Registriert einen neuen Benutzer.

**Request‑Body (JSON):**

```json
{
	"username": "alice",
	"email": "alice@example.com",
	"password": "geheimespasswort"
}
```

**Antworten (Beispiele):**
- `201 Created` – `{ "message": "User registered successfully." }`
- `400 Bad Request` – fehlende Felder oder zu kurzes Passwort
- `409 Conflict` – Username oder E‑Mail ist bereits vergeben

### POST /api/users/login

Authentifiziert einen Benutzer und gibt ein JWT zurück.

**Request‑Body (JSON):**

```json
{
	"email": "alice@example.com",
	"password": "geheimespasswort"
}
```

**Erfolgsantwort:**

```json
{
	"token": "<jwt-token>"
}
```

**Fehlerantworten (Beispiele):**
- `400 Bad Request` – E‑Mail oder Passwort fehlt
- `401 Unauthorized` – ungültige Zugangsdaten

### Geschützte Routen (Beispiel)

Für spätere, geschützte Endpunkte kannst du `authMiddleware` nutzen. Der Client muss dabei den Header setzen:

```http
Authorization: Bearer <jwt-token>
```

`authMiddleware` prüft das Token und hängt den decodierten Payload an `req.user`.

## Fehlerbehandlung & Logging

- `errorHandler` fängt alle über `next(error)` weitergegebenen Fehler ab.
- Wenn `error.statusCode` und `error.isOperational` gesetzt sind, wird dieser HTTP‑Status und die Message ausgegeben.
- Andernfalls erhält der Client eine generische `500`‑Antwort.
- Alle Fehler werden über `logger` (Winston) geloggt und z.B. in `error.log` geschrieben.

## Tests

Es kommen Jest und Supertest‑ähnliche Patterns für Unit‑Tests zum Einsatz (aktuell ohne echte HTTP‑Integrationstests):

```bash
npm test
```

Aktuelle Tests:
- `tests/userService.test.js` – testet `userService` mit gemocktem `User`‑Model
- `tests/userController.test.js` – testet `registerUser` und `loginUser` mit gemocktem `userService`, `bcrypt`, `jsonwebtoken`

## Weiterentwicklung

Mögliche nächste Schritte:
- Weitere User‑Routen: Profil, Passwort‑Reset, Rollenverwaltung
- Integrationstests mit `supertest` für komplette HTTP‑Flows
- CORS‑Konfiguration einschränken (nur bestimmte Frontend‑Origins zulassen)
- Deployment‑Konfiguration (z.B. Dockerfile, CI‑Pipeline)
