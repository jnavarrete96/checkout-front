# E-Commerce Checkout - Frontend

Frontend de aplicación de checkout e-commerce con React, Redux Toolkit, y Tailwind CSS. Implementa un flujo completo de compra con validación de tarjetas, resiliencia, y tests unitarios.

---

## 🚀 Características

- ✅ **React 20** con Vite para desarrollo rápido
- ✅ **Redux Toolkit** para gestión de estado global
- ✅ **React Router** para navegación entre páginas
- ✅ **Tailwind CSS v4** para diseño responsive mobile-first
- ✅ **Validación de tarjetas** con detección de VISA/MasterCard
- ✅ **Resiliencia** - recupera progreso si se cierra el navegador
- ✅ **Tests unitarios** con Vitest (85% coverage)
- ✅ **TypeScript-ready** con PropTypes
- ✅ **Integración con Wompi** (pasarela de pagos)

---

## 🛠️ Stack Tecnológico

### Core
- **React** 20.0.0
- **Vite** 6.0.11
- **Redux Toolkit** 2.5.0
- **React Router DOM** 7.1.3

### Styling
- **Tailwind CSS** 4.0.6
- **PostCSS** 8.4.49
- **Autoprefixer** 10.4.20

### HTTP Client
- **Axios** 1.7.9

### Forms & Validation
- **React Hook Form** 7.54.2

### Testing
- **Vitest** 4.0.18
- **@testing-library/react** 16.1.0
- **@testing-library/jest-dom** 6.6.3
- **@testing-library/user-event** 14.5.2
- **jsdom** 25.0.2

### UI Icons
- **lucide-react** 0.468.0

---

## 📂 Estructura del Proyecto

```
checkout-front/
├── public/                     # Archivos estáticos
├── src/
│   ├── api/                   # Servicios de API
│   │   ├── axios.js          # Configuración de Axios
│   │   ├── products.api.js   # Endpoints de productos
│   │   ├── transactions.api.js # Endpoints de transacciones
│   │   └── *.test.js         # Tests de API
│   │
│   ├── components/
│   │   ├── common/           # Componentes reutilizables
│   │   │   ├── Button.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Loader.jsx
│   │   │   └── *.test.jsx
│   │   │
│   │   ├── features/         # Componentes específicos
│   │   │   ├── ProductCard.jsx
│   │   │   ├── ProductList.jsx
│   │   │   ├── CheckoutForm.jsx
│   │   │   └── *.test.jsx
│   │   │
│   │   └── Layout.jsx        # Layout principal con header/footer
│   │
│   ├── hooks/                # Custom hooks
│   │   ├── useCardValidation.js  # Validación de tarjetas
│   │   ├── useRecovery.js        # Recuperación de sesión
│   │   └── *.test.js
│   │
│   ├── pages/                # Páginas principales
│   │   ├── ProductsPage.jsx      # Paso 1: Lista de productos
│   │   ├── CheckoutPage.jsx      # Paso 2: Formulario de checkout
│   │   ├── SummaryPage.jsx       # Paso 3: Resumen de compra
│   │   └── ResultPage.jsx        # Paso 5: Resultado del pago
│   │
│   ├── store/                # Redux store
│   │   ├── store.js          # Configuración del store
│   │   └── slices/
│   │       ├── productsSlice.js     # Estado de productos
│   │       ├── checkoutSlice.js     # Estado de checkout
│   │       └── *.test.js
│   │
│   ├── test/
│   │   └── setup.js          # Configuración de tests
│   │
│   ├── App.jsx               # Componente principal
│   ├── main.jsx              # Entry point
│   └── index.css             # Estilos globales (Tailwind)
│
├── .env                      # Variables de entorno
├── .env.example             # Ejemplo de variables de entorno
├── .gitignore
├── vitest.config.js         # Configuración de Vitest
├── tailwind.config.js       # Configuración de Tailwind
├── postcss.config.js        # Configuración de PostCSS
└── package.json
```

---

## 🔧 Instalación

### Prerrequisitos
- Node.js >= 18.x
- npm >= 9.x
- Backend API corriendo en `http://localhost:3000`

### Pasos

1. **Clonar el repositorio:**
```bash
git clone <repository-url>
cd checkout-front
```

2. **Instalar dependencias:**
```bash
npm install
```

3. **Configurar variables de entorno:**
```bash
cp .env.example .env
```

Editar `.env`:
```env
VITE_API_PORT=3000
```

4. **Iniciar el servidor de desarrollo:**
```bash
npm run dev
```

La aplicación estará disponible en: `http://localhost:5173`

---

## 🎮 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Inicia servidor de desarrollo (http://localhost:5173)
npm run build        # Compila para producción
npm run preview      # Preview de build de producción

# Testing
npm run test         # Ejecuta tests en modo watch
npm run test:coverage # Genera reporte de coverage

# Code Quality
npm run lint         # Ejecuta ESLint
```

---

## 🌐 Flujo de la Aplicación

### **5 Pasos del Checkout:**

#### **1. Products Page (Paso 1/5)**
- Lista de productos disponibles
- Filtrado por stock disponible
- Card responsive con imagen, nombre, precio, stock
- Badge "Out of Stock" / "Low Stock"
- Botón "Select Product"

#### **2. Checkout Page (Paso 2/5)**
- **Formulario de Customer:**
  - Email (validación de formato)
  - Nombre completo (mínimo 3 caracteres)
  - Teléfono (mínimo 7 dígitos)

- **Formulario de Tarjeta:**
  - Número de tarjeta (16 dígitos)
  - Detección automática VISA/MasterCard
  - Mes de expiración (01-12)
  - Año de expiración (YY)
  - CVC (3-4 dígitos)
  - Nombre del titular

- **Formulario de Delivery:**
  - Nombre completo
  - Teléfono
  - Dirección (mínimo 10 caracteres)
  - Ciudad
  - Estado/Departamento
  - Código postal (opcional)
  - Botón "Same as customer" (auto-rellena datos)

- **Validaciones en tiempo real**
- Sidebar con resumen del pedido (desktop)

#### **3. Summary Page (Paso 3/5)**
- Resumen completo de la transacción
- Detalles del producto
- Información del cliente
- Dirección de entrega
- Método de pago (últimos 4 dígitos)
- Desglose de costos:
  - Producto
  - Base Fee: $5,000 COP
  - Delivery Fee: $10,000 COP
  - Total
- Confirmación en 2 pasos:
  1. "Confirm & Pay"
  2. Warning → "Yes, Process Payment"
- Botón "Edit Information" para volver a checkout

#### **4. Processing (Paso 4/5)**
- Automático - Loading mientras procesa con Wompi
- Polling del estado de la transacción (hasta 60s)

#### **5. Result Page (Paso 5/5)**
- **Success (APPROVED):**
  - Icono verde con checkmark
  - Transaction details
  - Payment method
  - Producto comprado
  - Botón "Continue Shopping"

- **Declined (DECLINED):**
  - Icono rojo con X
  - Mensaje de error
  - Botón "Try Again" (vuelve a Summary)
  - Botón "Back to Products"

- **Error:**
  - Icono amarillo de warning
  - Detalles del error
  - Botón "Try Again"
  - Botón "Back to Products"

---

## 🔐 Validaciones Implementadas

### **Email:**
- Formato válido: `usuario@dominio.com`

### **Tarjeta de Crédito:**
- **Número:** 16 dígitos, auto-formato con espacios
- **Detección de marca:**
  - VISA: Empieza con 4
  - MasterCard: Empieza con 51-55
- **Expiración:** Mes (01-12), Año (YY)
- **CVC:** 3-4 dígitos

### **Teléfono:**
- Mínimo 7 dígitos

### **Dirección:**
- Mínimo 10 caracteres

### **Nombres:**
- Mínimo 3 caracteres

---

## 🔄 Resiliencia (Recovery Feature)

La aplicación puede **recuperar el progreso** si:
- El usuario cierra el navegador
- Se va la luz
- Recarga la página (F5)
- Cambia de dispositivo

### **¿Cómo funciona?**

1. Al cerrar navegador en **Summary** (con transacción PENDING):
   - localStorage guarda: `checkout-state`
   - Incluye: selectedProduct, customerData, deliveryData, transaction

2. Al volver a abrir la app:
   - Detecta `checkout-state` en localStorage
   - Llama: `GET /api/transactions/recover?email=xxx`
   - Restaura estado en Redux
   - Navega automáticamente a `/summary`
   - Usuario puede continuar con "Confirm & Pay"

3. Si no hay transacción PENDING:
   - Limpia localStorage
   - Usuario empieza de nuevo

### **Probar resiliencia:**

```bash
# 1. Selecciona producto y llena formulario
# 2. Llega a Summary (transacción PENDING creada)
# 3. Cierra completamente el navegador
# 4. Vuelve a abrir: http://localhost:5173
# 5. Debería mostrar "Recovering your session..."
# 6. Navega automáticamente a Summary
# 7. Continúa con el pago
```

---

## 🧪 Testing

### **Coverage actual: 85.16%** ✅

```
File                   | % Stmts | % Branch | % Funcs | % Lines
-----------------------|---------|----------|---------|--------
All files              |   85.16 |    86.74 |   81.96 |   86.16
 api                   |     100 |      100 |     100 |     100
 components/common     |      90 |    83.78 |      75 |      90
 components/features   |   91.56 |    92.52 |   85.71 |   95.94
 hooks                 |     100 |     87.5 |     100 |     100
 store/slices          |      74 |       50 |   75.75 |   73.73
```

### **Ejecutar tests:**

```bash
# Tests en modo watch
npm run test

# Coverage report
npm run test:coverage

# Coverage con UI
npm run test:coverage -- --ui
```

### **Tests implementados:**

#### **Redux Slices (34 tests):**
- ✅ productsSlice: Initial state, fetchProducts, updateProductStock
- ✅ checkoutSlice: Todos los reducers, async thunks, step navigation

#### **Hooks (7 tests):**
- ✅ useCardValidation: Detección VISA/MC, validación longitud, formateo

#### **Components (20 tests):**
- ✅ Button: Variantes, loading, disabled, onClick
- ✅ ProductCard: Render, badges, stock, eventos
- ✅ CheckoutForm: Validaciones, submit, auto-fill

#### **API Services (6 tests):**
- ✅ products.api: getProducts
- ✅ transactions.api: createTransaction, processPayment

---

## 🎨 Diseño Responsive

### **Mobile-First Approach:**

```css
/* Breakpoints de Tailwind CSS */
sm:  640px   /* Tablets pequeñas */
md:  768px   /* Tablets */
lg:  1024px  /* Laptops */
xl:  1280px  /* Desktops */
```

### **Grid responsive:**

```
Mobile (375px):    1 columna
Tablet (640px):    2 columnas
Laptop (1024px):   3 columnas
Desktop (1280px):  4 columnas
```

### **Componentes adaptables:**

- **Header:** Progress bar (mobile) → Progress circles (desktop)
- **CheckoutPage:** Stack vertical (mobile) → Sidebar (desktop)
- **SummaryPage:** Stack vertical (mobile) → Sidebar sticky (desktop)
- **Botones:** Stack vertical (mobile) → Horizontal (desktop)

### **Mínimo soportado:**
- iPhone SE (2020): 375px × 667px

---

## 🔌 Integración con Backend

### **Base URL:**
```javascript
const host = globalThis.location.hostname || 'localhost';
const API_URL = `http://${host}:3000/api`;
```

Esto permite:
- ✅ Desarrollo local: `http://localhost:3000/api`
- ✅ Desarrollo en red local (testing mobile): `http://192.168.x.x:3000/api`
- ✅ Deploy: Se adapta automáticamente al hostname

### **Endpoints consumidos:**

```
GET    /api/products
GET    /api/products/:id
POST   /api/transactions
GET    /api/transactions/:id
GET    /api/transactions/recover?email=xxx
PATCH  /api/transactions/:id/process-payment
```

### **Interceptors de Axios:**

- **Request:** Logging de peticiones
- **Response:** 
  - Logging de respuestas exitosas
  - Extracción de mensajes de error limpios
  - Manejo de errores HTTP

---

## 💳 Tarjetas de Prueba (Wompi Sandbox)

### **APPROVED:**
```
Número: 4242 4242 4242 4242
Exp: 12/28
CVC: 123
Titular: Cualquier nombre
```

### **DECLINED:**
```
Número: 4111 1111 1111 1111
Exp: 12/28
CVC: 123
Titular: Cualquier nombre
```

---

## 🐛 Debugging

### **Redux DevTools:**
Instala la extensión de Redux DevTools para Chrome/Firefox para inspeccionar el estado global.

### **Console Logs:**

```javascript
// API
[API] GET /products
[API] ✅ Response from /products

// Recovery
🔄 Detecting incomplete transaction...
📧 Email found: user@example.com
✅ Pending transaction recovered successfully
🔀 Redirecting to summary...
```

---

## 📦 Build para Producción

```bash
# Compilar
npm run build

# Preview local
npm run preview
```

Archivos generados en: `dist/`

### **Optimizaciones:**
- Code splitting automático
- Tree shaking
- Minificación
- Compresión de assets
- Lazy loading de rutas

---

## 🔒 Seguridad

### **Datos de tarjeta:**
- ✅ Nunca se almacenan números completos en Redux
- ✅ Solo se guardan temporalmente en localStorage para el flow
- ✅ Se limpian después del pago
- ✅ Solo se envían al backend (que los tokeniza con Wompi)
- ✅ Solo se muestran últimos 4 dígitos en resumen
---

## 📄 Licencia

MIT