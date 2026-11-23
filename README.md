# Calculadora de Fuga Operativa y ROI en Automatización (B2B Sogamoso)

Web app estática ultra-ligera y mobile-first pensada para desplegarse en `calculadora.nikko.dev` como imán de leads durante talleres presenciales y conferencias en auditorios de Sogamoso y Boyacá.

## 🚀 Características
- **Estética NikkoDev**: Fondo Obsidian Deep (`#0b0d10`), acentos menta (`#10b981`) y cyan (`#38bdf8`), bordes sutiles y diseño limpio sin ruido.
- **Mobile-First real**: Diseñada para escaneo por código QR en auditorios (90% de tráfico móvil). Sliders táctiles, botones grandes y feedback instantáneo.
- **Cero dependencias pesadas**: HTML5 + CSS3 + JS nativo puro. Pesa menos de 30 KB en total, carga en menos de 100ms incluso en conexiones móviles lentas.
- **Sectores adaptados a Sogamoso**: Educación, Industria/Ferretería, Salud/IPS, Transporte/Logística, Comercio/Servicios.
- **Captura calificada de Lead**: Enlace prellenado directo a WhatsApp (`+573136638097`) y Email (`contacto@nikko.dev`) con el resumen exacto del cálculo para cerrar la auditoría de 30 minutos.

## 🧮 Lógica de Negocio
- **Fuga Operativa Mensual (COP)**: `personas × horas_semanales × 4.33 × costo_hora`
- **Fuga Operativa Anual (COP)**: `Fuga Mensual × 12`
- **Horas Recuperables al Año**: `personas × horas_semanales × 52 × 0.70` (70% de automatización de tareas repetitivas).
- **Payback (Meses)**: `$1.500.000 / (Fuga Mensual × 0.70)`

## 💻 Desarrollo Local
Puedes probarla con cualquier servidor estático local:
```bash
python3 -m http.server 3000
# Abrir http://localhost:3000 en el navegador o móvil en la misma red Wi-Fi
```

## 🌐 Despliegue
Lista para producción en Vercel, Netlify o Cloudflare Pages (`vercel.json` incluido).
