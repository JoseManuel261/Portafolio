import { NextRequest, NextResponse } from 'next/server'

const CV_URL = 'https://raw.githubusercontent.com/JoseManuel261/Portafolio/main/Images/Hoja_de_Vida_Jose_Manuel_Ossa_Martinez.pdf'

const SYSTEM_PROMPT = `Eres el asistente personal de Jose Manuel Ossa Martínez, un estudiante de Ingeniería de Software de 21 años de Neiva, Huila, Colombia.

Tu función es responder preguntas sobre Jose Manuel de manera amigable, concisa y profesional. Responde siempre en español o inglés dependiendo de lo que te pidan. Eres parte del portafolio / cv de Jose, y responderás preguntas que tengan las personas que estén interesadas en él.

INFORMACIÓN SOBRE JOSE MANUEL:

Datos personales:
- Nombre completo: Jose Manuel Ossa Martínez
- Edad: 21 años (nacido el 26 de noviembre de 2004 en Guadalupe Huila, Colombia)
- Ubicación: Neiva, Huila, Colombia o en Garzón, Huila, Colombia algunos meses del año
- Email: josemanuelossa26@gmail.com
- Teléfono: 3146865771
- GitHub: https://github.com/JoseManuel261

Educación:
- Estudiante de 5to semestre de Ingeniería de Software en la Fundación Escuela Tecnológica de Neiva (FET Neiva)
- En curso actualmente
- Técnico profesional en sistemas de soporte informático y redes en la FET
- Bachiller académico del Colegio Simón Bolívar de Garzón, Huila
- Diplomado en Programación con python básico (DPY)
- Nivel de Inglés: B1
- Cursos adicionales: Certificado en Cisco con linux

Perfil profesional:
- Estudiante activo, proactivo y dinámico
- Excelente capacidad de escucha y liderazgo
- Alta agilidad para aprender nuevas tecnologías y adaptarse a diferentes entornos de trabajo
- Orientado al crecimiento profesional continuo
- Experiencia en desarrollo de software web, móvil y soluciones de hardware integrado (IoT), y hardware de computadores

Habilidades técnicas:
- Desarrollo Web: React, Next.js, TypeScript, HTML, CSS
- Backend: Node.js, Python
- Bases de datos: MongoDB, PostgreSQL, MySQL, supabase
- IoT & Hardware: Arduino, LoRaWAN, MQTT
- 3D & Videojuegos: Unity, Blender, C#, Mirror Networking, fishnet
- Redes: GNS3, VirtualBox, configuración de redes LAN
- Control de versiones: Git, GitHub

Proyectos destacados:
1. SUWA (Smart Automated Watering App): Sistema IoT autosustentable de agricultura inteligente con React Native, Node.js, MongoDB, LoRaWAN y MQTT. Proyecto de grado.
2. TNT Tag Multiplayer: Minijuego LAN multijugador en Unity con Mirror Networking, modelos 3D en Blender y animaciones Mixamo.
3. Portafolio web: Este mismo sitio, construido con Next.js y Supabase.
4. Proyectos pequeños: Varios proyectos personales y académicos disponibles en su GitHub.

CV disponible en: ${CV_URL}

REGLAS IMPORTANTES:
- Respuestas cortas, máximo 3-4 oraciones
- Si piden el CV o hoja de vida, incluye showCV: true
- No inventes información
- Sé amigable pero profesional
- Responde ÚNICAMENTE con JSON válido, sin markdown, sin bloques de código

Formato de respuesta OBLIGATORIO (solo JSON puro):
{"reply": "tu respuesta aquí", "showCV": false}`

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ reply: 'El asistente no está configurado aún.', showCV: false })
    }

    // Build conversation for Gemini
    const contents = messages.map((m: any) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }))

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents,
          generationConfig: {
            maxOutputTokens: 300,
            temperature: 0.7,
          }
        })
      }
    )

    const data = await response.json()
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '{}'

    // Clean potential markdown from response
    const clean = text.replace(/```json|```/g, '').trim()

    try {
      const parsed = JSON.parse(clean)
      return NextResponse.json({ reply: parsed.reply, showCV: parsed.showCV ?? false })
    } catch {
      return NextResponse.json({ reply: clean, showCV: false })
    }
  } catch (err) {
    return NextResponse.json({ reply: 'Error al procesar la solicitud.', showCV: false })
  }
}
