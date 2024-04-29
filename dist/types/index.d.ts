/// <reference types="multer" />
export declare class IUser {
    id: string;
    email: string;
    access_token: string;
}
export declare class NotFoundResponse {
    status_code: number;
    message: string;
}
export declare class UploadImageResponse {
    imageUrl: string;
}
export declare class FileType {
    file: Express.Multer.File;
}
