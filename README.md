# Library Sistem - Alexandro Lucero

Aplicación desarrollada con Clean Architecture + TDD

## 🔧 Tecnologías
- Node.js
- TypeScript
- Express
- Vitest
- Supertest
- Bcrypt
- JWT

## 📁 Estructura del proyecto
```
.
├── apps/
│   ├── backend/
│   │   ├── controllers/      # Contiene la lógica para manejar las solicitudes HTTP y las respuestas.
│   │   │   └── tests/        # Pruebas de los controladores, validando la interacción con los casos de uso.
│   │   ├── database/         # ⏳ Proximamente... (actualmente almacenamiento en memoria).
│   │   ├── infrastructure/   # Implementaciones concretas de servicios y repositorios.
│   │   ├── routes/           # Define las rutas de la API.
│   │   └── index.ts          # Punto de entrada principal de la aplicación.
│   └── frontend/             # ⏳ Proximamente...
└── domain_src/               # Contiene la lógica de negocio central de la aplicación.
    ├── entities/             # Clases que representan los objetos de negocio (Book, Loan, User).
    ├── repositories/         # Interfaces de los repositorios para la persistencia de datos.
    ├── services/             # Interfaces para servicios de dominio (HashService, TokenGenerator).
    └── usecases/             # Lógica de las operaciones de negocio, cada archivo representa un caso de uso.
        └── tests/            # Pruebas de los casos de uso, garantizando la lógica de negocio sin dependencias externas.
```

## 📦 Instalación
```bash
# Instala las dependencias del proyecto raíz (Supertest, TypeScript, Vitest)
npm install

# Ejecuta todas las pruebas unitarias
npm test

# Navega al directorio del backend
cd apps/backend

# Instala las dependencias del servidor (Express, Bcrypt, JWT, etc.)
npm install

# Inicia el servidor de desarrollo en modo de "observación"
npm run dev