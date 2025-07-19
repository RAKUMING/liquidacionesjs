const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();
app.use(cors({ origin: "*" }));

// Reemplaza esto con tu API Key. Es mejor usar una variable de entorno en producción.
const API_KEY = "84bd6d2d-4045-4b53-8b61-151c618d4311";

// Página principal ("/") - Sin cambios
app.get("/", (req, res) => {
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.send(`
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>API de Liquidaciones</title>
            <style>
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    line-height: 1.5;
                    margin: 0;
                    padding: 0;
                    color: #e6e6e6;
                    background-color: #222;
                }
                .container {
                    max-width: 800px;
                    margin: 0 auto;
                    padding: 25px 15px;
                }
                header {
                    background-color: #111;
                    color: white;
                    padding: 20px 0;
                    border-radius: 8px 8px 0 0;
                    text-align: center;
                    margin-bottom: 20px;
                    border-bottom: 2px solid #e2b714;
                }
                h1 {
                    margin: 0;
                    font-size: 2em;
                }
                .subtitle {
                    color: #e2b714;
                    font-weight: 300;
                    margin-top: 5px;
                    margin-bottom: 0;
                }
                h2 {
                    border-bottom: 1px solid #e2b714;
                    padding-bottom: 8px;
                    margin-top: 25px;
                    color: #e2b714;
                    font-size: 1.5em;
                }
                .description {
                    background-color: #333;
                    padding: 15px;
                    border-radius: 8px;
                    margin-bottom: 20px;
                }
                .endpoint-card {
                    background-color: #333;
                    border-radius: 8px;
                    padding: 15px 20px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                    margin-bottom: 20px;
                }
                .endpoint-title {
                    font-size: 1.2em;
                    color: #e2b714;
                    margin-top: 0;
                    margin-bottom: 12px;
                    border-bottom: 1px solid #444;
                    padding-bottom: 8px;
                }
                .endpoints-list {
                    list-style-type: none;
                    padding: 0;
                    margin: 0;
                }
                .endpoints-list li {
                    padding: 8px 5px;
                    border-bottom: 1px solid #444;
                }
                .endpoints-list li:last-child {
                    border-bottom: none;
                }
                .endpoint-url {
                    font-family: monospace;
                    background-color: #222;
                    padding: 6px 10px;
                    border-radius: 4px;
                    display: inline-block;
                    margin-right: 10px;
                }
                .endpoint-url a {
                    color: #5c9ce6;
                    text-decoration: none;
                }
                .endpoint-url a:hover {
                    text-decoration: underline;
                    color: #7fb3f5;
                }
                .endpoint-period {
                    color: #aaa;
                    font-size: 0.9em;
                    display: inline-block;
                }
                .download-note {
                    background-color: #2a2a2a;
                    padding: 12px;
                    border-radius: 6px;
                    margin-top: 15px;
                    font-size: 0.95em;
                    border-left: 3px solid #e2b714;
                }
                .download-note code {
                    background-color: #222;
                    padding: 2px 5px;
                    border-radius: 3px;
                    color: #5c9ce6;
                }
                footer {
                    margin-top: 30px;
                    text-align: center;
                    color: #888;
                    font-size: 0.85em;
                    padding: 15px;
                    background-color: #111;
                    border-radius: 0 0 8px 8px;
                }
                .btc-icon {
                    color: #e2b714;
                    font-weight: bold;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <header>
                    <h1>API de Liquidaciones <span class="btc-icon">₿</span></h1>
                    <p class="subtitle">Datos en tiempo real desde Coinalyze</p>
                </header>
                
                <div class="description">
                    <p>Accede a datos de <strong>liquidaciones long y short</strong> en Binance (futuros perpetuos) extraídos de la API pública de <a href="https://coinalyze.net" target="_blank" style="color:#5c9ce6">Coinalyze</a>.</p>
                </div>
                
                <div class="endpoint-card">
                    <h3 class="endpoint-title">Endpoints Disponibles</h3>
                    <ul class="endpoints-list">
                        <li>
                            <div class="endpoint-url"><a href="/liquidaciones1min" target="_blank">/liquidaciones1min</a></div>
                            <span class="endpoint-period">Datos por minuto</span>
                        </li>
                        <li>
                            <div class="endpoint-url"><a href="/liquidaciones5min" target="_blank">/liquidaciones5min</a></div>
                            <span class="endpoint-period">Intervalos de 5 minutos</span>
                        </li>
                        <li>
                            <div class="endpoint-url"><a href="/liquidaciones15min" target="_blank">/liquidaciones15min</a></div>
                            <span class="endpoint-period">Intervalos de 15 minutos</span>
                        </li>
                        <li>
                            <div class="endpoint-url"><a href="/liquidaciones1hour" target="_blank">/liquidaciones1hour</a></div>
                            <span class="endpoint-period">Datos por hora</span>
                        </li>
                        <li>
                            <div class="endpoint-url"><a href="/liquidaciones4hour" target="_blank">/liquidaciones4hour</a></div>
                            <span class="endpoint-period">Bloques de 4 horas</span>
                        </li>
                        <li>
                            <div class="endpoint-url"><a href="/liquidacionesdaily" target="_blank">/liquidacionesdaily</a></div>
                            <span class="endpoint-period">Resumen diario</span>
                        </li>
                    </ul>
                    
                    <div class="download-note">
                        <strong>Nota:</strong> Añade el parámetro <code>?download</code> a cualquier URL para descargar los datos en formato CSV.<br>
                        Ejemplo: <code>/liquidaciones1min?download</code>
                    </div>
                </div>
                
                <div class="description">
                    <p>Esta API muestra las liquidaciones de posiciones long (compra) y short (venta) en el mercado de futuros, permitiendo analizar la presión del mercado en diferentes intervalos de tiempo. Los datos son presentados en formato tabular o pueden descargarse como CSV para análisis más detallados.</p>
                </div>
                
                <footer>
                    <p>API de Liquidaciones © 2025 | Desarrollado con Node.js + Express +python ,serversj.xxx</p>
                </footer>
            </div>
        </body>
        </html>
    `);
});

/**
 * Función genérica para manejar la lógica de fetching y procesamiento para cualquier intervalo.
 * @param {string} interval - El intervalo para la API de Coinalyze (e.g., '1min', '5min', '1hour').
 * @param {number} intervalMillis - El intervalo en milisegundos.
 * @param {number} intervalSeconds - El intervalo en segundos.
 * @param {object} req - El objeto de solicitud de Express.
 * @param {object} res - El objeto de respuesta de Express.
 */
const handleLiquidationRequest = async (interval, intervalMillis, intervalSeconds, req, res) => {
    try {
        console.log(`Llamo a Coinalyze (${interval}): ${new Date().toISOString()}`);

        // --- LÓGICA DE TIMESTAMP PRECISA Y CONSISTENTE ---
        const now = Date.now();
        // 1. Redondea la hora actual HACIA ABAJO al inicio del intervalo actual.
        const currentCandleStart = Math.floor(now / intervalMillis) * intervalMillis;
        // 2. Resta un intervalo para obtener el timestamp de la última vela COMPLETADA.
        const lastCompletedCandleTime = new Date(currentCandleStart - intervalMillis);

        const to = Math.floor(lastCompletedCandleTime.getTime() / 1000);
        const from = to - (999 * intervalSeconds);

        const url = `https://api.coinalyze.net/v1/liquidation-history?api_key=${API_KEY}&symbols=BTCUSDT_PERP.A&interval=${interval}&from=${from}&to=${to}&convert_to_usd=true`;

        const response = await fetch(url);
        const rawBody = await response.text();

        if (!response.ok) {
            console.error("Error Coinalyze:", response.status, rawBody);
            return res.status(500).send(`<h3>Error al obtener datos de Coinalyze</h3><pre>${rawBody}</pre>`);
        }

        const data = JSON.parse(rawBody);
        const liquidationMap = new Map();

        if (Array.isArray(data)) {
            data.forEach(item => {
                if (Array.isArray(item.history)) {
                    item.history.forEach(entry => {
                        liquidationMap.set(entry.t * 1000, { long: entry.l, short: entry.s });
                    });
                }
            });
        }

        const processedLiquidations = [];
        for (let t = from * 1000; t <= to * 1000; t += intervalMillis) {
            const date = new Date(t);
            const entry = liquidationMap.get(t) || { long: 0, short: 0 };
            processedLiquidations.push({
                timestamp: t,
                time: date.toISOString(),
                timeShort: date.toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'medium' }),
                long: entry.long,
                short: entry.short
            });
        }

        const updatedTime = processedLiquidations.length > 0 ? processedLiquidations.at(-1).time : "Sin datos";

        res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
        res.setHeader("Pragma", "no-cache");
        res.setHeader("Expires", "0");
        res.setHeader("Surrogate-Control", "no-store");

        if (req.query.download !== undefined) {
            const csvHeader = "timestamp,long,short\n";
            const csvRows = processedLiquidations.map(l => `${l.timestamp},${l.long},${l.short}`).join('\n');
            res.setHeader("Content-Type", "text/csv");
            res.setHeader("Content-Disposition", `attachment; filename=liquidaciones_${interval}.csv`);
            return res.send(csvHeader + csvRows);
        }

        res.setHeader("Content-Type", "text/html; charset=utf-8");

        const tableHeaders = ["fecha/hora (local)", "long", "short"];
        let html = `
            <h2 style="font-family: Arial, sans-serif;">Liquidaciones BTC - Últimos 1000 bloques de ${interval}</h2>
            <p style="font-family: Arial, sans-serif;">Actualizado: ${updatedTime}</p>
            <p><a href="/liquidaciones${interval}?download">Descargar CSV</a></p>`;

        if (processedLiquidations.length === 0) {
            html += `<p>No se encontraron datos.</p>`;
        } else {
            html += `<table border="1" style="border-collapse: collapse; font-family: Arial, sans-serif; font-size: 12px;">
                        <thead style="background-color: #f2f2f2;">
                           <tr>${tableHeaders.map(h => `<th>${h}</th>`).join('')}</tr>
                        </thead>
                        <tbody>`;
            processedLiquidations.slice().reverse().forEach(l => { // .slice().reverse() para mostrar los más recientes primero
                html += `<tr><td>${l.timeShort}</td><td>${l.long.toFixed(2)}</td><td>${l.short.toFixed(2)}</td></tr>`;
            });
            html += `</tbody></table>`;
        }
        return res.status(200).send(html);

    } catch (err) {
        console.error(`ERROR en /liquidaciones${interval}:`, err);
        return res.status(500).send(`<h3>Error inesperado</h3><pre>${err.message}</pre>`);
    }
};

// --- ENDPOINTS ---

app.get("/liquidaciones1min", (req, res) => handleLiquidationRequest('1min', 60 * 1000, 60, req, res));
app.get("/liquidaciones5min", (req, res) => handleLiquidationRequest('5min', 5 * 60 * 1000, 5 * 60, req, res));
app.get("/liquidaciones15min", (req, res) => handleLiquidationRequest('15min', 15 * 60 * 1000, 15 * 60, req, res));
app.get("/liquidaciones1hour", (req, res) => handleLiquidationRequest('1hour', 60 * 60 * 1000, 60 * 60, req, res));
app.get("/liquidaciones4hour", (req, res) => handleLiquidationRequest('4hour', 4 * 60 * 60 * 1000, 4 * 60 * 60, req, res));

// Liquidaciones diarias (1d) - tiene una lógica de tiempo especial (UTC)
app.get("/liquidacionesdaily", async (req, res) => {
    try {
        console.log(`Llamo a Coinalyze (daily): ${new Date().toISOString()}`);

        const now = new Date();
        now.setUTCHours(0, 0, 0, 0); // Ajustamos a medianoche UTC de hoy
        // El último día completo fue ayer, por lo que 'to' es el inicio del día de hoy.
        const to = Math.floor(now.getTime() / 1000);
        const from = to - (999 * 24 * 60 * 60); // 1000 días atrás

        const url = `https://api.coinalyze.net/v1/liquidation-history?api_key=${API_KEY}&symbols=BTCUSDT_PERP.A&interval=daily&from=${from}&to=${to}&convert_to_usd=true`;

        const response = await fetch(url);
        const rawBody = await response.text();

        if (!response.ok) {
            console.error("Error Coinalyze:", response.status, rawBody);
            return res.status(500).send(`<h3>Error al obtener datos de Coinalyze</h3><pre>${rawBody}</pre>`);
        }
        
        const data = JSON.parse(rawBody);
        const liquidationMap = new Map();

        if (Array.isArray(data)) {
            data.forEach(item => {
                if (Array.isArray(item.history)) {
                    item.history.forEach(entry => {
                        liquidationMap.set(entry.t * 1000, { long: entry.l, short: entry.s });
                    });
                }
            });
        }
        
        const processedLiquidations = [];
        // Iteramos sobre los días, asegurándonos de que cada timestamp es a las 00:00:00 UTC
        for (let t = from * 1000; t < to * 1000; t += 24 * 60 * 60 * 1000) {
            const date = new Date(t);
            const entry = liquidationMap.get(t) || { long: 0, short: 0 };
            processedLiquidations.push({
                timestamp: t,
                time: date.toISOString(),
                timeShort: date.toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' }),
                long: entry.long,
                short: entry.short
            });
        }
        
        const updatedTime = processedLiquidations.length > 0 ? processedLiquidations.at(-1).time : "Sin datos";
        
        res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
        res.setHeader("Pragma", "no-cache");
        res.setHeader("Expires", "0");
        res.setHeader("Surrogate-Control", "no-store");

        if (req.query.download !== undefined) {
            const csvHeader = "timestamp,long,short\n";
            const csvRows = processedLiquidations.map(l => `${l.timestamp},${l.long},${l.short}`).join('\n');
            res.setHeader("Content-Type", "text/csv");
            res.setHeader("Content-Disposition", `attachment; filename=liquidaciones_daily.csv`);
            return res.send(csvHeader + csvRows);
        }

        res.setHeader("Content-Type", "text/html; charset=utf-8");
        
        const tableHeaders = ["fecha (UTC)", "long", "short"];
        let html = `
            <h2 style="font-family: Arial, sans-serif;">Liquidaciones BTC - Últimos 1000 días</h2>
            <p style="font-family: Arial, sans-serif;">Actualizado: ${updatedTime}</p>
            <p><a href="/liquidacionesdaily?download">Descargar CSV</a></p>`;

        if (processedLiquidations.length === 0) {
            html += `<p>No se encontraron datos.</p>`;
        } else {
            html += `<table border="1" style="border-collapse: collapse; font-family: Arial, sans-serif; font-size: 12px;">
                        <thead style="background-color: #f2f2f2;">
                           <tr>${tableHeaders.map(h => `<th>${h}</th>`).join('')}</tr>
                        </thead>
                        <tbody>`;
            processedLiquidations.slice().reverse().forEach(l => {
                html += `<tr><td>${l.timeShort}</td><td>${l.long.toFixed(2)}</td><td>${l.short.toFixed(2)}</td></tr>`;
            });
            html += `</tbody></table>`;
        }
        return res.status(200).send(html);

    } catch (err) {
        console.error(`ERROR en /liquidacionesdaily:`, err);
        return res.status(500).send(`<h3>Error inesperado</h3><pre>${err.message}</pre>`);
    }
});

module.exports = app;
