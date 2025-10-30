# Crypto Collector - Frontend Angular

Frontend de la aplicación Crypto Collector para visualizar información de criptomonedas.

## 📋 Requisitos previos

- Node.js 20+ 
- Docker 
- Backend corriendo en `http://localhost:8080`

## 🚀 Ejecución Local

### Instalar dependencias
```bash
npm install
```

### Ejecutar en modo desarrollo
```bash
npm start
```

La aplicación estará disponible en `http://localhost:4200`

## 🐳 Ejecución con Docker

### 1. Clonar el repositorio
```bash
git clone https://github.com/MaguirreC/front-crypto.git
cd front-crypto
```
### Construir la imagen
```bash
npm run docker:build
```


```bash
docker build -t crypto-frontend .
```

```bash
docker run -p 4200:4200 crypto-frontend
```

La aplicación estará disponible en `http://localhost:4200`

## 📁 Estructura del proyecto

```
src/
├── app/
│   ├── components/
│   │   ├── login/          # Componente de login
│   │   └── dashboard/      # Dashboard con tabla de cryptos
│   ├── services/
│   │   ├── auth.service.ts       # Servicio de autenticación
│   │   └── crypto.service.ts     # Servicio de criptomonedas
│   ├── guards/
│   │   └── auth-guard.ts         # Guard para rutas protegidas
│   ├── core/
│   │   └── interceptors/
│   │       └── auth.interceptor.ts  # Interceptor JWT
│   ├── models/
│   │   ├── auth.model.ts         # Interfaces de autenticación
│   │   └── crypto.model.ts       # Interfaces de criptomonedas
│   ├── app.routes.ts             # Configuración de rutas
│   └── app.config.ts             # Configuración de la app
└── ...
```

## 🔐 Autenticación

### Login
- **Endpoint:** `POST /api/auth/login`
- **Credenciales de prueba:**
  - Usuario: `admin1`
  - Contraseña: `1234`

### Registro
- **Endpoint:** `POST /api/auth/register`
- Crea un nuevo usuario

### Token JWT
El token se almacena en `localStorage` y se envía automáticamente en todas las peticiones mediante un interceptor.

## 📊 Funcionalidades

### Dashboard
- ✅ Visualización de criptomonedas en tabla
- ✅ Paginación (10 registros por página)
- ✅ Búsqueda por nombre o símbolo
- ✅ Filtrado avanzado por precio y market cap
- ✅ Ordenamiento por columnas
- ✅ Sincronización de datos desde API externa
- ✅ Sistema de alertas (éxito/error/info)
- ✅ Loader durante sincronización

### Endpoints consumidos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/crypto/list` | Lista todas las criptomonedas con paginación |
| GET | `/api/crypto/search` | Busca por nombre o símbolo |
| GET | `/api/crypto/filter` | Filtra por precio, market cap, etc. |
| POST | `/api/crypto/sync` | Sincroniza datos desde API externa |

## ⚙️ Configuración

### Variables de entorno
Puedes modificar la URL del backend en `src/app/services/auth.service.ts` y `src/app/services/crypto.service.ts`:

```typescript
private apiUrl = 'http://localhost:8080/api/auth';
```

### Puerto de desarrollo
Por defecto corre en el puerto `4200`. Para cambiarlo:

```bash
ng serve --port 4300
```

## 🛠️ Tecnologías utilizadas

- **Angular 18** - Framework principal
- **TypeScript** - Lenguaje de programación
- **RxJS** - Programación reactiva
- **Angular Router** - Enrutamiento
- **HttpClient** - Peticiones HTTP
- **JWT** - Autenticación basada en tokens



Los archivos compilados estarán en `dist/front-crypto/`


### Error de autenticación
- Verifica que el token JWT sea válido
- Intenta hacer logout y login nuevamente

