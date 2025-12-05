Proyecto: Galería Drive + Excel (lista para Render)

CONTENIDO
- server.js             -> Backend Express que expone /galeria?folder=URL
- getDriveFiles.js      -> Scraper recursivo que visita carpeta + subcarpetas y consigue imágenes (sin API)
- readExcel.js          -> Lee data.xlsx y devuelve filas con los campos: imagen, nombre, tecnica, descripcion, precio
- public/               -> Archivos estáticos (index.html, style.css)
- data.xlsx             -> Ejemplo de Excel (puedes editarlo en tu PC y subir nuevamente)

INSTRUCCIONES RÁPIDAS PARA SUBIR A RENDER (Web Service - Node):
1) Sube el proyecto a un repo (GitHub/GitLab) o sube el ZIP en Render.
2) Crea un nuevo servicio en Render: 'Web Service' (Node).
   - Build command: (vacío)
   - Start command: npm start
   - Environment: Node 18+ recomendado.
3) Conecta el repo o sube el ZIP y desplega.
4) Abre la URL y pega la URL pública de la carpeta de Drive.
   - Ejemplo: https://drive.google.com/drive/folders/1yZXl2SuU_vCCj6t-FlTgM0BANUCjly7a?usp=sharing
5) La app leerá recursivamente la carpeta y subcarpetas, buscará imágenes y las combinará con data.xlsx.

NOTAS IMPORTANTES:
- La carpeta de Drive debe estar en modo 'Cualquiera con el enlace - Lector'.
- Si actualizas data.xlsx en el servidor, necesitas reemplazar el archivo y redeployar o usar otra forma para subirlo.
- Este enfoque parsea HTML público de Drive. Si Google cambia la estructura, puede requerir ajustes.

Si querés, genero el ZIP descargable ahora.
