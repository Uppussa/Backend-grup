import multer from "multer";
import path from "path";

const storage = multer.diskStorage({ // Configuración de almacenamiento
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Directorio de almacenamiento
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9); // Nombre único
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)); // Nombre del archivo
    }
});

const fileFilter = (req, file, cb) => {     
    // Acepta videos y imágenes
    const filetypes = /jpeg|jpg|png|mp4|mov|avi|wmv|flv|mkv/; // Tipos de archivos permitidos
    const mimetype = filetypes.test(file.mimetype);  // Verificar el tipo de archivo   
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase()); // Verificar la extensión del archivo

    if (mimetype && extname) { // Si el tipo de archivo y la extensión son correctos
        return cb(null, true);  // Continuar con la carga
    }
    cb(new Error('Solo se permiten archivos de imagen (jpeg, jpg, png) y video (mp4, mov, avi, wmv, flv, mkv)')); // Error si el tipo de archivo no es correcto
};

export const upload = multer({  // Configuración de multer
    storage: storage,  // Almacen
    fileFilter: fileFilter, // Filtro de archivos
    limits: { // Limites
        fileSize: 100 * 1024 * 1024 // Limita el tamaño del archivo a 100MB
    }
});