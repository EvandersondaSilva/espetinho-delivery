
import multer from "multer";


// usar o memoryStorage para manter o arquivo em memoria e enviar para o cloudinary

export default {
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
    },
    fileFilter: (req: any, file: Express.Multer.File, cb: any) => {

        const allowedMimeTypes = ["image/jpeg", "image/png", "image/jpg"];

        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Apenas imagens são permitidas"));
        }
    }
}