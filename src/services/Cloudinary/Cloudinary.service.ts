interface CloudinaryUploadResponse {
    secure_url: string;
    public_id: string;
    format: string;
    width: number;
    height: number;
    bytes: number;
    created_at: string;
}

interface UploadOptions {
    folder?: string;
    uploadPreset?: string;
    transformation?: string;
    maxFileSize?: number;
}

class CloudinaryService {
    private cloudName: string;
    private defaultUploadPreset: string;

    constructor() {
        this.cloudName = process.env.EXPO_PUBLIC_API_CLAUDINARY_NAME || '';
        this.defaultUploadPreset = process.env.EXPO_PUBLIC_API_CLAUDINARY_PRESET || '';
    }

    private validateFile(file: File, maxSize?: number): { valid: boolean; error?: string } {
        if (!file.type.startsWith('image/')) {
            return { valid: false, error: 'El archivo debe ser una imagen' };
        }

        const maxFileSize = maxSize || 10 * 1024 * 1024;
        if (file.size > maxFileSize) {
            const maxMB = maxFileSize / (1024 * 1024);
            return { valid: false, error: `La imagen no debe superar los ${maxMB}MB` };
        }
        return { valid: true };
    }

    async uploadImage(
        file: File,
        options: UploadOptions = {}
    ): Promise<CloudinaryUploadResponse> {
        const validation = this.validateFile(file, options.maxFileSize);
        if (!validation.valid) {
            throw new Error(validation.error);
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', options.uploadPreset || this.defaultUploadPreset);

        if (options.folder) {
            formData.append('folder', options.folder);
        }

        if (options.transformation) {
            formData.append('transformation', options.transformation);
        }

        try {
            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`,
                {
                    method: 'POST',
                    body: formData,
                }
            );

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error?.message || 'Error al subir la imagen');
            }

            const data: CloudinaryUploadResponse = await response.json();
            return data;
        } catch (error) {
            console.error('Error uploading to Cloudinary:', error);
            throw error;
        }
    }
    async uploadMultipleImages(
        files: File[],
        options: UploadOptions = {}
    ): Promise<CloudinaryUploadResponse[]> {
        const uploadPromises = files.map(file => this.uploadImage(file, options));
        return Promise.all(uploadPromises);
    }

    getOptimizedUrl(publicId: string, transformation?: string): string {
        const baseUrl = `https://res.cloudinary.com/${this.cloudName}/image/upload`;
        if (transformation) {
            return `${baseUrl}/${transformation}/${publicId}`;
        }
        return `${baseUrl}/${publicId}`;
    }

    getThumbnail(publicId: string, width: number = 200, height: number = 200): string {
        return this.getOptimizedUrl(publicId, `c_fill,w_${width},h_${height},q_auto`);
    }

    async deleteImage(): Promise<void> {
        console.warn('Delete operation should be performed from backend');
        throw new Error('Delete operation must be performed from backend');
    }
}

export const cloudinaryService = new CloudinaryService();

export type { CloudinaryUploadResponse, UploadOptions };