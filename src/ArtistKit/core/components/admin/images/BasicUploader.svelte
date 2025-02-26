<script lang="ts">

    import { getDownloadURL, type UploadTaskSnapshot } from "firebase/storage";
    import { getContext } from "svelte";
    import { compressImageBrowser } from "../../../utils/imgUtils";
    import type { FirebaseManager } from "../../../libs/firebaseManager.svelte";
    import ProgressBar from "../../ProgressBar.svelte";

    interface Props {
        fullresUrl: string;
        thumbnailUrl: string;

        folderPath: string;
        uploadText: string;

        onFileUploadStart?: (file: File) => void;
    }

    let { 
        fullresUrl = $bindable(),
        thumbnailUrl = $bindable(),
        uploadText,
        folderPath,

        onFileUploadStart = (file: File) => {}
     }: Props = $props();

    let firebaseManager = getContext<() => FirebaseManager | undefined>("firebaseManager")();

    let input: HTMLInputElement | undefined = $state(undefined);
    let uploadProgress: number = $state(-1);

    async function uploadBlob(blob: Blob, path: string, onProgress: (snapshot: UploadTaskSnapshot) => void = () => {}): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            if (!firebaseManager) {
                reject();
                return;
            }

            const uploadTask = firebaseManager.uploadBytesResumable(path, blob);

            uploadTask.on("state_changed",
                onProgress,
                (error) => {
                    reject(error);
                    console.log(error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((imageUrl) => {
                        uploadProgress = -1;
                        resolve(imageUrl);
                    });
                }
            );
        });
    }

    async function uploadFullres() {
        if (!input) return;
        
        const file = (input.files as FileList)[0];
        const fileName = `${Math.ceil(Math.random() * 10_000)}-${file.name}`;

        onFileUploadStart(file);

        const thumbnailPromise = compressImageBrowser(file, 800, 800).then((blob) => uploadBlob(blob, `${folderPath}/thumbnails/${fileName}`));
        
        const [ newFullresUrl, newThumbnailUrl ] = await Promise.all([
            uploadBlob(file, `${folderPath}/fullres/${fileName}`, (snapshot) => uploadProgress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100),
            thumbnailPromise
        ]);

        fullresUrl = newFullresUrl;
        thumbnailUrl = newThumbnailUrl;
    }
</script>


{#if uploadProgress >= 0}
    <div>
        Uploading image
        <ProgressBar progress={uploadProgress} />
    </div>
{:else}
    <label class="custom-file-upload cta-inverted">
        <input type="file" accept="image/*" bind:this={input} onchange={uploadFullres} />
        { uploadText }
    </label>
{/if}


<style>

    .custom-file-upload {
        display: inline-block;
        cursor: pointer;
    }

    input[type="file"] {
        display: none;
    }

</style>