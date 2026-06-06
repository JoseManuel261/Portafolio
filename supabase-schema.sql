-- =============================================
-- ESQUEMA DE BASE DE DATOS - PORTAFOLIO HUB
-- Ejecutar en: Supabase Dashboard → SQL Editor
-- =============================================

-- ══════════════════════════════════════════════
-- EXTENSIONES
-- ══════════════════════════════════════════════
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ══════════════════════════════════════════════
-- TABLA: profiles
-- ══════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  title TEXT NOT NULL DEFAULT 'Desarrollador',
  bio TEXT DEFAULT '',
  email TEXT,
  github_url TEXT,
  linkedin_url TEXT,
  location TEXT DEFAULT '',
  skills TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ══════════════════════════════════════════════
-- TABLA: projects
-- ══════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  long_description TEXT,
  tags TEXT[] DEFAULT '{}',
  image_url TEXT,
  repo_url TEXT,
  live_url TEXT,
  status TEXT DEFAULT 'completed' CHECK (status IN ('completed', 'in-progress', 'archived')),
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ══════════════════════════════════════════════
-- RLS (Row Level Security)
-- ══════════════════════════════════════════════
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- ── Lectura pública ──
CREATE POLICY "Perfiles visibles para todos"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Proyectos visibles para todos"
  ON projects FOR SELECT
  USING (true);

-- ── Insert: solo autenticado ──
CREATE POLICY "Usuario puede insertar su perfil"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Usuario puede insertar proyectos"
  ON projects FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- ── Update: solo dueño ──
CREATE POLICY "Usuario puede actualizar su perfil"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Usuario puede actualizar sus proyectos"
  ON projects FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- ── Delete: solo dueño ──
CREATE POLICY "Usuario puede eliminar sus proyectos"
  ON projects FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ══════════════════════════════════════════════
-- FUNCIÓN: Obtener perfil por username
-- ══════════════════════════════════════════════
CREATE OR REPLACE FUNCTION get_profile_by_username(p_username TEXT)
RETURNS SETOF profiles
LANGUAGE sql STABLE
AS $$
  SELECT * FROM profiles WHERE username = p_username LIMIT 1;
$$;

