import {
    MediaProvider,
    MediaVimeoItem,
    Uploader
} from './media-uploader.types'
import axios from 'axios'
import * as tus from 'tus-js-client'


type VimeoPresignUploadingResponse = {
    upload: {
        upload_link: string;
    };
    name: string,
    uri: string;
};

export default class MediaUploaderVimeo implements Uploader {
    async upload(file: File, name: string, onProgress?: (bytesUploaded: number, bytesTotal: number) => void): Promise<MediaVimeoItem> {
        const presignedLinkResponse =
            await axios.post<VimeoPresignUploadingResponse>('/api/vimeo', {
                size: file.size,
                name: name
            });

        const uploadURI = presignedLinkResponse.data.upload.upload_link;
        const vimeoVideoLink = presignedLinkResponse.data.uri;
        const vimeoId = vimeoVideoLink.split('/').slice(-1)[0];


        return new Promise<MediaVimeoItem>((resolve, reject) => {
            const uploader = new tus.Upload(file, {
                uploadUrl: uploadURI,
                endpoint: uploadURI,
                onError: (error) => {
                    reject(error)
                },
                onProgress: (bytesUploaded, bytesTotal) => {
                    onProgress?.(bytesUploaded, bytesTotal)
                },
                onSuccess: () => {
                    resolve({
                        provider: MediaProvider.VIMEO,
                        id: vimeoId,
                        link: vimeoVideoLink
                    });
                }
            });
            uploader.start()
        });
    }
}