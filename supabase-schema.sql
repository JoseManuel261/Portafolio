-- =============================================
-- ESQUEMA DE BASE DE DATOS - PORTAFOLIO
-- Ejecutar en: Supabase Dashboard → SQL Editor
-- =============================================

-- Tabla de proyectos
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
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

-- Tabla de perfil (solo 1 fila)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  bio TEXT,
  email TEXT,
  github_url TEXT,
  linkedin_url TEXT,
  location TEXT,
  skills TEXT[] DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS (Row Level Security)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policies: lectura pública
CREATE POLICY "Proyectos visibles para todos"
  ON projects FOR SELECT
  USING (true);

CREATE POLICY "Perfil visible para todos"
  ON profiles FOR SELECT
  USING (true);

-- Policies: escritura solo para usuario autenticado
CREATE POLICY "Solo admin puede insertar proyectos"
  ON projects FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Solo admin puede actualizar proyectos"
  ON projects FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Solo admin puede eliminar proyectos"
  ON projects FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Solo admin puede actualizar perfil"
  ON profiles FOR UPDATE
  TO authenticated
  USING (true);

-- Perfil inicial (reemplaza los datos con los tuyos)
INSERT INTO profiles (name, title, bio, email, github_url, linkedin_url, location, skills)
VALUES (
  'Joselin',
  'Software Engineering Student',
  'Estudiante de Ingeniería de Software en FET Neiva, apasionada por el desarrollo web, IoT, 3D y el diseño de experiencias digitales.',
  'tu@email.com',
  'https://github.com/tu_usuario',
  'https://linkedin.com/in/tu_usuario',
  'Neiva, Huila, Colombia',
  ARRAY['React', 'Next.js', 'TypeScript', 'Python', 'Unity', 'Blender', 'MongoDB', 'PostgreSQL', 'Arduino', 'GNS3']
);

-- Proyecto de ejemplo
INSERT INTO projects (title, description, long_description, tags, status, featured)
VALUES (
  'TNT Tag Multiplayer',
  'Minijuego LAN multijugador construido en Unity con Mirror Networking.',
  'Juego multijugador en red local desarrollado desde cero en Unity usando Mirror Networking, ParrelSync, modelos Mixamo y personajes NPC creados en Blender.',
  ARRAY['Unity', 'C#', 'Mirror Networking', 'Blender'],
  'completed',
  true
);
