# 🗂️ Portafolio + Repositorio de Proyectos

Portafolio personal con CV, galería de proyectos y panel admin. Construido con **Next.js 14**, **Tailwind CSS** y **Supabase**.

---

## 🚀 Pasos para desplegarlo

### 1. Configurar Supabase

1. Ve a [supabase.com](https://supabase.com) y crea una cuenta gratuita
2. Crea un nuevo proyecto (anota la región más cercana a Colombia: **us-east-1**)
3. En el dashboard de Supabase ve a **SQL Editor** y pega todo el contenido de `supabase-schema.sql` → ejecuta
4. Ve a **Settings → API** y copia:
   - `Project URL` → es tu `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → es tu `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Ve a **Authentication → Users** y crea tu usuario admin con email y contraseña

### 2. Configurar el proyecto localmente

```bash
# Instalar dependencias
npm install

# Copiar variables de entorno
cp .env.example .env.local

# Editar .env.local con tus datos de Supabase
# NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
# NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...

# Correr en desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

### 3. Desplegar en Vercel

1. Sube el proyecto a GitHub (crea un repo nuevo y haz push)
2. Ve a [vercel.com](https://vercel.com) → **New Project** → importa tu repo
3. En **Environment Variables** añade:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Click en **Deploy** ✅

---

## 🧭 Estructura de páginas

| Ruta | Descripción |
|------|-------------|
| `/` | Inicio: Hero, proyectos destacados, sobre mí, contacto |
| `/projects` | Galería completa con búsqueda y filtros |
| `/admin` | Login del panel admin |
| `/admin/dashboard` | CRUD completo de proyectos |

---

## ✏️ Personalizar tu perfil

1. Ve a Supabase Dashboard → **Table Editor → profiles**
2. Edita la fila con tu nombre, bio, skills, redes sociales, etc.

O bien desde `/admin/dashboard` puedes gestionar todos los proyectos.

---

## 📁 Estructura de archivos

```
portfolio/
├── app/
│   ├── page.tsx              # Home
│   ├── layout.tsx            # Layout raíz
│   ├── globals.css           # Estilos globales
│   ├── projects/page.tsx     # Galería de proyectos
│   └── admin/
│       ├── page.tsx          # Login admin
│       └── dashboard/page.tsx # Panel CRUD
├── components/
│   ├── Nav.tsx               # Navegación
│   └── ProjectCard.tsx       # Tarjeta de proyecto
├── lib/
│   └── supabase.ts           # Cliente Supabase + tipos
├── supabase-schema.sql       # Schema SQL para ejecutar
└── .env.example              # Variables de entorno de ejemplo
```

---

## 🎨 Estética

Minimalista y limpia con:
- Fuentes: DM Serif Display (títulos) + DM Sans (cuerpo)
- Paleta: tonos cálidos neutros (stone/warm)
- Animaciones sutiles de entrada
- Diseño responsivo móvil-primero
