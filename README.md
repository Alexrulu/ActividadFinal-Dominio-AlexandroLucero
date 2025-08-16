# Library Sistem - Alexandro Lucero

Aplicación desarrollada con Clean Architecture + TDD

## 🔧 Tecnologias
- Node.js
- TypeScript
- Express
- Vitest
- Supertest
- Bcrypt
- JWT
- Storybook
- Tailwind

## 📁 Estructura del proyecto
```
.
├── apps/
│   ├── backend/
│   │   ├── controllers/      # Contiene la lógica para manejar las solicitudes HTTP y las respuestas.
│   │   │   └── tests/        # Pruebas de los controladores, validando la interacción con los casos de uso.
│   │   ├── data/             # Almacenamiento en memoria.
│   │   ├── infrastructure/   # Implementaciones concretas de servicios y repositorios.
│   │   ├── routes/           # Define las rutas de la API.
│   │   └── index.ts          # Punto de entrada principal de la aplicación.
│   └── frontend/
│       ├── public/           # Archivos estáticos accesibles públicamente.
│       └── src/
│           ├── components/   # Componentes reutilizables de UI.
│           ├── hooks/        # Custom hooks para encapsular lógica reutilizable.
│           ├── layout/       # Componentes de maquetación de la aplicación.
│           ├── pages/        # Vistas completas de la aplicación.
│           ├── styles/       # Estilos globales o específicos.
│           ├── App.tsx       # Enrutamiento
│           └── main.tsx
└── domain_src/               # Contiene la lógica de negocio central de la aplicación.
    ├── entities/             # Clases que representan los objetos de negocio (Book, Loan, User).
    ├── repositories/         # Interfaces de los repositorios para la persistencia de datos.
    ├── services/             # Interfaces para servicios de dominio (HashService, TokenGenerator).
    └── usecases/             # Lógica de las operaciones de negocio, cada archivo representa un caso de uso.
        └── tests/            # Pruebas de los casos de uso, garantizando la lógica de negocio sin dependencias externas.
```

## 📦 Instalación
```bash
# Instala las dependencias del proyecto raiz (Supertest, TypeScript, Vitest)
npm install

# Ejecuta todas las pruebas unitarias
npm test

# Navega al directorio del backend
cd apps/backend

# Instala las dependencias del servidor (Express, Bcrypt, JWT, etc.)
npm install

# Inicia el servidor de desarrollo
npm run dev

# Abre otra terminal, navega al directorio del frontend
cd apps/frontend

# Instala las dependencias (React, Tailwind, Storybook, etc.)
npm install

# Inicia el frontend
npm run dev

