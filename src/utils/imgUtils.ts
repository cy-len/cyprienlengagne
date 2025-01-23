export async function compressImageBrowser(file: Blob, maxWidth: number = 1500, maxHeight: number = 1500): Promise<Blob> {
    return new Promise(async (resolve, reject) => {
        const imgUrl = URL.createObjectURL(file);
        const img = await loadImageAsync(imgUrl);
    
        const imgScaleWidth = Math.min(maxWidth / img.naturalWidth, 1);
        const imgScaleHeight = Math.min(maxHeight / img.naturalHeight, 1);
        const imgScale = Math.min(imgScaleWidth, imgScaleHeight);

        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth * imgScale;
        canvas.height = img.naturalHeight * imgScale;

        const context = canvas.getContext("2d");
        if (!context) {
            reject();
            return;
        }

        context.drawImage(img, 0, 0, img.naturalWidth * imgScale, img.naturalHeight * imgScale);

        canvas.toBlob((blob) => {
            if (!blob) {
                reject();
                return;
            }

            URL.revokeObjectURL(imgUrl);
            resolve(blob);
        }, "image/jpeg", 0.9);

        img.src = imgUrl;
    });
}

export async function loadImageAsync(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.src = url;
    });
}