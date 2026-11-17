# Royal Computers Xerox Shop - Backend (Node.js & MongoDB Atlas)

## 📡 MongoDB Atlas Connection
- **Cluster**: `cluster0.ml1nsxy.mongodb.net`
- **Database**: `royal_computers`
- **User**: `sathyasathyaravi94_db_user`
- **Connection URI**: Configured securely in `backend/.env`

---

## 🚀 How to Run Backend

```bash
cd backend
npm install   # If not installed yet
npm start     # Runs on http://localhost:5000
# or
npm run dev   # Runs with auto-reload
```

---

## 🛠 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Backend and MongoDB health status |
| `GET` | `/api/auth/current` | Get current owner details & Premier Key |
| `POST` | `/api/auth/login` | Owner ID & Password validation |
| `POST` | `/api/auth/register` | Register new owner credentials |
| `POST` | `/api/auth/reset-password`| Reset password using master Premier Key (`ROYAL777`) |
| `PUT` | `/api/auth/profile` | Update shop profile & credentials in MongoDB |
| `GET` / `PUT` | `/api/settings` | Get & update shop settings / services |
| `GET` | `/api/rates` | Get all services and pricing rates |
| `POST` / `PUT` / `DELETE` | `/api/rates/...` | Add, update, delete rates |
| `GET` / `POST` / `PUT` / `DELETE` | `/api/stock` | Stock inventory management |
| `PATCH` | `/api/stock/:id/adjust` | Quick stock quantity adjustment |
| `GET` / `POST` / `PUT` / `DELETE` | `/api/employees` | Staff management |
| `PATCH` | `/api/employees/:id/toggle-duty` | Toggle employee on/off duty |
| `GET` / `POST` / `PUT` / `DELETE` | `/api/bills` | Invoices & bills management |
| `GET` / `POST` / `PUT` / `DELETE` | `/api/customers` | Customer Directory & Accounts CRUD in MongoDB Atlas |
| `POST` | `/api/seed` | Reset / reseed default shop data |

---

## 💻 Full-Stack Quick Start

From the root project directory:
```bash
# Start BOTH Backend (Port 5000) and Frontend (Port 5173) concurrently:
npm run dev
```
