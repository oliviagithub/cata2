import xlsx from "xlsx";
export function readExcel(path = "./data.xlsx") {
  const wb = xlsx.readFile(path);
  const sheet = wb.Sheets[wb.SheetNames[0]];
  const rows = xlsx.utils.sheet_to_json(sheet, { defval: "" });
  return rows.map(row => ({
    imagen: String(row.imagen || "").trim(),
    nombre: row.nombre || "",
    tecnica: row.tecnica || "",
    descripcion: row.descripcion || "",
    precio: row.precio || ""
  }));
}
