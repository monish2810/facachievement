import mongoose from 'mongoose';
import multer from 'multer';
import { GridFsStorage } from 'multer-gridfs-storage';

let gfs;
let upload;

const MAX_BSON_SIZE = 16 * 1024 * 1024; // 16MB

export const setupGridFS = (conn) => {
  conn.once('open', () => {
    gfs = new mongoose.mongo.GridFSBucket(conn.db, { bucketName: 'certificates' });
    global.gfs = gfs;
    // Use url property for GridFsStorage, not db
    const storage = new GridFsStorage({
      url: process.env.MONGO_URI, // <-- Use the same variable as mongoose.connect
      file: (req, file) => {
        return {
          filename: `${Date.now()}-${file.originalname}`,
          bucketName: 'certificates',
        };
      },
    });
    upload = multer({ storage, limits: { fileSize: 50 * 1024 * 1024 } }); // 50MB max for GridFS
    global.upload = upload;
  });
};

export function getUpload() {
  if (!upload) throw new Error('Upload middleware not initialized yet');
  return upload;
}

// Helper to decide storage method based on file size
export function handleCertificateUpload(req, res, next) {
  if (!req.file) return next();

  if (req.file.size <= MAX_BSON_SIZE) {
    // Store as Binary Data in document
    req.certificateBinData = req.file.buffer;
    req.certificateFileName = req.file.originalname;
    req.certificateMimeType = req.file.mimetype;
    req.certificateStorageType = 'binData';
  } else {
    // Already stored in GridFS by multer-gridfs-storage
    req.certificateStorageType = 'gridfs';
  }
  next();
}