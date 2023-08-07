enum MediaProvider {
    VIMEO = 'Vimeo'
}


type MediaVimeoItem = {
    provider: MediaProvider.VIMEO;
    id: string,
};

type MediaItem = {
    provider: MediaProvider;
} & MediaVimeoItem;

interface Uploader {
    upload(
        file: File,
        name: string,
        description: string,
        onProgress?: (bytesUploaded: number, bytesTotal: number) => void
    ): Promise<MediaItem>;
}

export {
    MediaProvider,
    MediaVimeoItem,
    MediaItem,
    Uploader
}