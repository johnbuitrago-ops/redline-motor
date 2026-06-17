// Función serverless de Vercel — versión GRATIS.
// Lee los canales RSS de Google Noticias (gratuitos, sin clave ni pago)
// y los entrega ya ordenados a la página. Corre en el servidor para evitar
// el bloqueo de seguridad (CORS) del navegador.

export default async function handler(req, res) {
  let topic = "";
  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
    topic = (body.topic || "").toString().slice(0, 200);
  } catch (_) {}
  if (!topic) topic = "autos carros noticias automotriz";

  // Excluimos motos/motocicletas en todas las búsquedas
  const q = topic + " -moto -motocicleta -motociclismo";

  // Google Noticias en español de Colombia (trae Colombia, Latinoamérica y el mundo)
  const url =
    "https://news.google.com/rss/search?q=" +
    encodeURIComponent(q) +
    "&hl=es-419&gl=CO&ceid=CO:es-419";

  try {
    const r = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; RedlineNews/1.0)" },
    });
    if (!r.ok) throw new Error("la fuente respondió " + r.status);
    const xml = await r.text();
    const items = parseRss(xml).slice(0, 8);
    // Cache de 5 min en el borde, para ir más rápido y no repetir peticiones
    res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=900");
    return res.status(200).json({ items });
  } catch (e) {
    return res.status(500).json({ error: "No se pudieron cargar las noticias (" + String(e.message || e) + ")." });
  }
}

function parseRss(xml) {
  const out = [];
  const blocks = xml.split(/<item>/i).slice(1);
  for (const raw of blocks) {
    const chunk = raw.split(/<\/item>/i)[0];
    const get = (tag) => {
      const m = chunk.match(new RegExp("<" + tag + "[^>]*>([\\s\\S]*?)<\\/" + tag + ">", "i"));
      return m ? m[1] : "";
    };
    const clean = (t) =>
      decode(
        t.replace(/<!\[CDATA\[/g, "").replace(/\]\]>/g, "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()
      );

    let titulo = clean(get("title"));
    const link = clean(get("link"));
    const pub = clean(get("pubDate"));
    let fuente = clean(get("source"));

    // En Google Noticias el título suele venir como "Titular - Medio"
    if (fuente && titulo.endsWith(" - " + fuente)) {
      titulo = titulo.slice(0, -(fuente.length + 3)).trim();
    } else if (!fuente && titulo.includes(" - ")) {
      const parts = titulo.split(" - ");
      fuente = parts.pop().trim();
      titulo = parts.join(" - ").trim();
    }

    if (titulo && link) {
      out.push({ titulo, url: link, fuente: fuente || "Fuente", fecha: relTime(pub) });
    }
  }
  return out;
}

function decode(s) {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&#x27;/gi, "'")
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, " ");
}

function relTime(s) {
  const d = new Date(s);
  if (isNaN(d.getTime())) return "Reciente";
  const diff = (Date.now() - d.getTime()) / 1000;
  if (diff < 3600) return "Hace " + Math.max(1, Math.round(diff / 60)) + " min";
  if (diff < 86400) return "Hace " + Math.round(diff / 3600) + " h";
  if (diff < 86400 * 7) { const d2 = Math.round(diff / 86400); return "Hace " + d2 + (d2 === 1 ? " día" : " días"); }
  return d.toLocaleDateString("es", { day: "numeric", month: "short" });
}
