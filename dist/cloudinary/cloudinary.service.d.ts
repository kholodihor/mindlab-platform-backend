/// <reference types="multer" />
import { CloudinaryResponse } from './cloudinary-response';
export declare class CloudinaryService {
    uploadFile(file: Express.Multer.File, endFolder: string): Promise<CloudinaryResponse>;
    deleteFile(public_id: string): Promise<{
        success: boolean;
    }>;
}
