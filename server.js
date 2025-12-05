import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from 'url';
import { getAllFiles } from "./getDriveFiles.js";
import { readExcel } from "./readExcel.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

app.get("/galeria", async (req, res) => {
  const folder = req.query.folder;
  if (!folder) return res.status(400).json({ error: "Falta el parámetro ?folder=URL" });

  try {
    // Obtener listas de Drive (recursivo y con paginado)
    const driveFiles = await getAllFiles(folder);
    // Leer Excel local (data.xlsx)
    const excel = readExcel(path.join(__dirname, "data.xlsx"));

    // Combinar por nombre de archivo
    const final = excel.map(item => {
      const match = driveFiles.find(f => f.file === item.imagen);
      return {
        ...item,
        url: match ? match.direct : null,
        id: match ? match.id : null
      };
    });

    res.json(final);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Serve index.html for root
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor escuchando en puerto ${PORT}`));
