const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();
app.use(cors({ origin: "*" }));

app.get("/liquidaciones", async (req, res) => {
    try {
        console.log(`Llamo a Coinalyze: ${new Date().toISOString()}`);

        const now = new Date();

        // Redondear a múltiplo de 5 más cercano hacia abajo
        const minutes = now.getMinutes();
        const roundedMinutes = Math.floor(minutes / 5) * 5;
        now.setMinutes(roundedMinutes);
        now.setSeconds(0);
        now.setMilliseconds(0);

        // Retroceder 1 bloque de 5 minutos para tomar solo los completos
        now.setMinutes(now.getMinutes() - 5);

        const to = Math.floor(now.getTime() / 1000); // timestamp del final del último bloque de 5min
        const from = to - (500 * 5 * 60); // 500 bloques de 5 minutos atrás (150000 segundos)

        console.log("From:", new Date(from * 1000).toString());
        console.log("To:  ", new Date(to * 1000).toString());

        const url = `https://api.coinalyze.net/v1/liquidation-history?api_key=84bd6d2d-4045-4b53-8b61-151c618d4311&symbols=BTCUSDT_PERP.A&interval=5min&from=${from}&to=${to}&convert_to_usd=true`;

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
                        const timestamp = entry.t * 1000;
                        liquidationMap.set(timestamp, {
                            long: entry.l,
                            short: entry.s
                        });
                    });
                }
            });
        }

        // Procesar todos los bloques de 5min entre from y to
        const processedLiquidations = [];
        for (let t = from * 1000; t <= to * 1000; t += 5 * 60 * 1000) {
            const date = new Date(t);
            const entry = liquidationMap.get(t) || { long: 0, short: 0}; // Valor por defecto

            processedLiquidations.push({
                timestamp: t,
                time: date.toISOString(),
                timeShort: date.toLocaleString('es-ES', {
                    dateStyle: 'short',
                    timeStyle: 'medium'
                }),
                long: entry.long,
                short: entry.short
            });
        }

        const updatedTime = processedLiquidations.length > 0 ? processedLiquidations.at(-1).time : "Sin datos";

        // Headers para evitar cache
        res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
        res.setHeader("Pragma", "no-cache");
        res.setHeader("Expires", "0");
        res.setHeader("Surrogate-Control", "no-store");

        // JSON - Descargar archivo
        if (req.query.download !== undefined) {
            const jsonContent = processedLiquidations.map(l => ({
                timestamp: l.timestamp,
                long: l.long,
                short: l.short
            }));

            res.setHeader("Content-Type", "application/json");
            res.setHeader("Content-Disposition", "attachment; filename=liquidaciones.json");
            return res.json(jsonContent);
        }

        // HTML - Mostrar tabla
        res.setHeader("Content-Type", "text/html; charset=utf-8");

        const tableHeaders = ["fecha/hora (local)", "long", "short"];
        let html = `<h2>Liquidaciones BTC - Últimos 500 bloques de 5min</h2>
                    <p>Actualizado: ${updatedTime}</p>
                    <p><a href="/liquidaciones?download">Descargar JSON</a></p>`;

        if (processedLiquidations.length === 0) {
            html += `<p>No se encontraron datos.</p>`;
        } else {
            html += `<table border="1" style="border-collapse: collapse; font-family: Arial, sans-serif; font-size: 12px;">
                        <thead style="background-color: #f2f2f2;">
                           <tr>${tableHeaders.map(h => `<th>${h}</th>`).join('')}</tr>
                        </thead>
                        <tbody>`;
            processedLiquidations.forEach(l => {
                html += `<tr><td>${l.timeShort}</td><td>${l.long}</td><td>${l.short}</td></tr>`;
            });
            html += `</tbody></table>`;
        }

        return res.status(200).send(html);

    } catch (err) {
        console.error("ERROR:", err);
        return res.status(500).send(`<h3>Error inesperado</h3><pre>${err.message}</pre>`);
    }
});

module.exports = app;
