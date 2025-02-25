<script lang="ts">
    import { onMount } from "svelte";
    import { galleryManager } from "../../../../ArtistKit/modules/gallery/galleryManager.svelte";
    import { socialMediasManager } from "../../../../ArtistKit/modules/socialMedias/socialMediasManager.svelte";
    import ConcertSelector from "../../../../components/admin/postGenerator/ConcertSelector.svelte";
    import FontSelector from "../../../../components/admin/postGenerator/FontSelector.svelte";
    import TextModal from "../../../../components/admin/postGenerator/TextModal.svelte";
    import type { Concert } from "../../../../types/concert";

    interface Vector2 {
        x: number;
        y: number;
    }

    function makeVector2(x = 0, y = 0): Vector2 {
        return {
            x,
            y
        };
    }

    type Theme = "LIGHT" | "DARK";


    const themes = {
        "LIGHT": {
            gradientColor: "255, 255, 255",
            textColor: "0, 0, 0"
        },
        "DARK": {
            gradientColor: "0, 0, 0",
            textColor: "255, 255, 255"
        },
    };

    
    let canvas: HTMLCanvasElement;
    let context: CanvasRenderingContext2D;

    let concertSelector: ConcertSelector;

    let textModal: TextModal;

    onMount(() => {
        context = canvas.getContext("2d") as CanvasRenderingContext2D;

        changeImageSize();
    });

    let zoomFactor: number = $state(1);
    let gridEnabled: boolean = $state(false);
    let gridDivisions: Vector2 = $state(makeVector2(5, 5));

    let title: string = $state("");

    const bgImage = $state(new Image());
    bgImage.crossOrigin = "anonymous";
    bgImage.onload = () => {
        draw();
    };
    let imageCopyright: string = $state("");

    const youtubeLogo = new Image();
    youtubeLogo.src = "/icons/youtube.svg";
    const facebookLogo = new Image();
    facebookLogo.src = "/icons/facebook.svg";
    const instagramLogo = new Image();
    instagramLogo.src = "/icons/instagram.svg";

    let imageSize: Vector2 = $state(makeVector2(1600, 1200));
    
    let bgOffset: Vector2 = $state(makeVector2());
    let bgScale: number = $state(1);

    let theme: Theme = $state("LIGHT");

    let enableGradient: boolean = $state(false);
    let gradientBegin: number = $state(0);
    let gradientBeginOpacity: number = $state(0);
    let gradientEnd: number = $state(1);
    let gradientEndOpacity: number = $state(0.5);

    let gradientPosition: Vector2 = $state(makeVector2());
    let gradientSize: Vector2 = $state(makeVector2(imageSize.x, imageSize.y));
    let gradientRotation: number = $state(0);

    let titlePosition: Vector2 = $state(makeVector2(imageSize.x / 2, imageSize.y / 2));
    let titleFontFamily: string = $state("Aboreto");
    let titleFontSize: number = $state(60);
    let titleShadowRadius: number = $state(10);
    let titleShadowStrength: number = $state(0.5);

    let concertListPosition: Vector2 = $state(makeVector2(200, 200));

    let concertFontFamily: string = $state("Montserrat");
    let concertDateFontSize: number = $state(38);
    let concertDateLocationGap: number = $state(10);
    let concertLocationFontSize: number = $state(30);
    let concertGap: number = $state(20);
    let concertShadowRadius: number = $state(10);
    let concertShadowStrength: number = $state(0.5);

    let enableSocialMedia: boolean = $state(false);
    let socialMediaPosition: Vector2 = $state(makeVector2(imageSize.x / 2, imageSize.y / 2));
    let socialMediaGap: number = $state(200);
    let socialMediaLogoSize: number = $state(100);
    let socialMediaLogoGap: number = $state(15);
    let socialMediaFontFamily: string = $state("Segoe UI");
    let socialMediaFontSize: number = $state(30);
    
    let enableWebsite: boolean = $state(false);
    let websitePosition: Vector2 = $state(makeVector2(imageSize.x / 2, imageSize.y / 2));
    let websiteFontFamily: string = $state("Segoe UI");
    let websiteFontSize: number = $state(50);

    let copyrightFontSize: number = $state(30);
    
    function changeImageSize() {
        canvas.width = imageSize.x;
        canvas.height = imageSize.y;
        canvas.style.width = imageSize.x / window.devicePixelRatio + "px";
        canvas.style.height = imageSize.y / window.devicePixelRatio + "px";

        draw();
    }

    function autoResizeToBackground() {
        imageSize.x = bgImage.naturalWidth;
        imageSize.y = bgImage.naturalHeight;

        changeImageSize();
    }

    function setToInstagramPost() {
        imageSize.x = 1080;
        imageSize.y = 1080;

        changeImageSize();
    }

    function setToInstagramStory() {
        imageSize.x = 1080;
        imageSize.y = 1920;

        changeImageSize();
    }

    function setToFacebookVertical() {
        imageSize.x = 1200;
        imageSize.y = 1500;

        changeImageSize();
    }

    function setTo16by9() {
        imageSize.x = 1920;
        imageSize.y = 1080;

        changeImageSize();
    }

    function setBackground(url: string) {
        bgImage.src = url;
    }

    function autoChooseTheme() {
        if (!bgImage.src) return;

        const analysisCanvas = document.createElement("canvas");
        analysisCanvas.width = bgImage.naturalWidth;
        analysisCanvas.height = bgImage.naturalHeight;
        const ctx = analysisCanvas.getContext("2d") as CanvasRenderingContext2D;
        ctx.drawImage(bgImage, 0, 0);

        const imageData = ctx.getImageData(0, 0, analysisCanvas.width, analysisCanvas.height);
        const data = imageData.data;
        let r, g, b, avg;
        let colorSum = 0;

        for(let x=0, len=data.length; x<len; x+=4) {
            r = data[x];
            g = data[x+1];
            b = data[x+2];
            avg = Math.floor((r+g+b) / 3);
            colorSum += avg;
        }

        const brightness = Math.floor(colorSum / (bgImage.naturalWidth * bgImage.naturalHeight));

        if (brightness < 128) {
            theme = "DARK";
        } else {
            theme = "LIGHT";
        }

        draw();
    }

    function snapToGrid(pos: Vector2): Vector2 {
        const cellWidth = imageSize.x / gridDivisions.x;
        const cellHeight = imageSize.y / gridDivisions.y;

        return {
            x: Math.round(cellWidth * Math.round(pos.x / cellWidth)),
            y: Math.round(cellHeight * Math.round(pos.y / cellHeight))
        };
    }

    function snapTitleToGrid() {
        titlePosition = snapToGrid(titlePosition);
        draw();
    }

    function snapConcertsToGrid() {
        concertListPosition = snapToGrid(concertListPosition);
        draw();
    }

    function snapSocialMediasToGrid() {
        socialMediaPosition = snapToGrid(socialMediaPosition);
        draw();
    }

    function snapWebsiteToGrid() {
        websitePosition = snapToGrid(websitePosition);
        draw();
    }

    // Returns size of the concert
    function renderConcert(concert: Concert, x: number, y: number): Vector2 {
        context.font = `${concertDateFontSize}px "${concertFontFamily}"`;
        context.fillText(concert.date.toLocaleDateString(), x, y + concertDateFontSize);

        context.font = `${concertLocationFontSize}px "${concertFontFamily}"`;
        context.fillText(concert.location, x, y + concertDateFontSize + concertDateLocationGap + concertLocationFontSize);

        return {
            x: 0,
            y: concertDateFontSize + concertDateLocationGap + concertLocationFontSize
        };
    }

    function renderSocial(icon: HTMLImageElement, handle: string, x: number, y: number) {
        context.drawImage(icon, x, y, socialMediaLogoSize, socialMediaLogoSize);
        context.font = `${socialMediaFontSize}px "${socialMediaFontFamily}"`;
        context.textAlign = "center";
        context.fillText(handle, x + socialMediaLogoSize / 2, y + socialMediaLogoSize + socialMediaLogoGap);
    }

    function renderSocialMedias() {
        const pairs: { icon: HTMLImageElement; handle: string }[] = [];

        if (socialMediasManager.socialMedias.youtube.handle) {
            pairs.push({
                icon: youtubeLogo,
                handle: socialMediasManager.socialMedias.youtube.handle
            });
        }
        if (socialMediasManager.socialMedias.facebook.handle) {
            pairs.push({
                icon: facebookLogo,
                handle: socialMediasManager.socialMedias.facebook.handle
            });
        }
        if (socialMediasManager.socialMedias.instagram.handle) {
            pairs.push({
                icon: instagramLogo,
                handle: socialMediasManager.socialMedias.instagram.handle
            });
        }

        let x = socialMediaPosition.x;
        for (const pair of pairs) {
            renderSocial(pair.icon, pair.handle, x, socialMediaPosition.y);
            x += socialMediaGap;
        }
    }

    function drawGrid() {
        context.strokeStyle = "1px black";

        const stepX = imageSize.x / gridDivisions.x;
        const stepY = imageSize.y / gridDivisions.y;

        for (let i = 1; i < gridDivisions.x; i++) {
            context.beginPath();
            context.moveTo(i * stepX, 0);
            context.lineTo(i * stepX, imageSize.y);
            context.stroke();
        }

        for (let i = 1; i < gridDivisions.y; i++) {
            context.beginPath();
            context.moveTo(0, i * stepY);
            context.lineTo(imageSize.x, i * stepY);
            context.stroke();
        }
    }

    function draw() {
        context.resetTransform();
        context.clearRect(0, 0, imageSize.x, imageSize.y);

        context.save();

        context.scale(bgScale, bgScale);
        context.drawImage(bgImage, bgOffset.x, bgOffset.y);

        context.restore();

        context.save();

        if (enableGradient) {
            const gradient = context.createLinearGradient(0, 0, imageSize.x, 0);
            gradient.addColorStop(gradientBegin, `rgba(${themes[theme].gradientColor}, ${gradientBeginOpacity})`);
            gradient.addColorStop(gradientEnd, `rgba(${themes[theme].gradientColor}, ${gradientEndOpacity})`);

            context.fillStyle = gradient;
            context.translate(imageSize.x / 2, imageSize.y / 2);
            context.rotate(gradientRotation * Math.PI / 180);
            context.translate(-imageSize.x / 2, -imageSize.y / 2);
            context.fillRect(gradientPosition.x, gradientPosition.y, gradientSize.x, gradientSize.y);
        }

        context.restore();

        context.textAlign = "left";

        context.font = `${titleFontSize}px "${titleFontFamily}"`;
        context.shadowColor = `rgba(${themes[theme].gradientColor}, ${titleShadowStrength})`;
        context.shadowBlur = titleShadowRadius;
        context.fillStyle = `rgb(${themes[theme].textColor})`;
        context.fillText(title, titlePosition.x, titlePosition.y);
        
        context.shadowColor = `rgba(${themes[theme].gradientColor}, ${concertShadowStrength})`;
        context.shadowBlur = concertShadowRadius;
        const selectedConcerts = concertSelector.getSelectedConcerts();
        let yPos = concertListPosition.y;
        selectedConcerts.forEach((c) => {
            yPos += renderConcert(c, concertListPosition.x, yPos).y + concertGap;
        });
        
        if (enableSocialMedia) {
            renderSocialMedias();
        }

        context.textAlign = "left";
        if (enableWebsite) {
            context.font = `${websiteFontSize}px "${websiteFontFamily}"`;
            context.fillText("cyprien-keiser.com", websitePosition.x, websitePosition.y);
        }

        context.font = `${copyrightFontSize}px Montserrat`;
        const copyrightText = `© ${imageCopyright}`;
        const x = imageSize.x - context.measureText(copyrightText).width - 10;
        context.fillText(`© ${imageCopyright}`, x, imageSize.y - 10);

        if (gridEnabled) {
            drawGrid();
        }
    }

    function download() {
        const a: HTMLAnchorElement = document.createElement('a');
        a.setAttribute('download', `${title}.png`);
        a.setAttribute('href', canvas.toDataURL("image/png").replace("image/png", "image/octet-stream"));
        a.click();
    }

    function generatePostText() {
        let text = `${title}`;
        text += "\n \n";
        
        const selectedConcerts = concertSelector.getSelectedConcerts();
        selectedConcerts.forEach((concert: Concert) => {
            text += "\n";
            text += `${concert.date.toLocaleDateString()} - ${concert.location}` + "\n";
            text += `${concert.description}`;
            text += "\n";
        });

        text += "\ncyprien-keiser.com\n";
        text += `© ${imageCopyright}`;;

        textModal.show(text);
    }

</script>

<div class="wrapper">
    <div class="toolbar-left">
        <fieldset>
            <legend>Image size</legend>

            <div class="horizontal-group">
                <div>
                    <label for="image-width">Width</label>
                    <input type="number" name="image-width" id="image-width" step="1" min="100" max="10000" bind:value={imageSize.x} onchange={changeImageSize} />
                </div>
                <div>
                    <label for="image-height">Height</label>
                    <input type="number" name="image-height" id="image-height" step="1" min="100" max="10000" bind:value={imageSize.y} onchange={changeImageSize} />
                </div>
            </div>

            <div class="horizontal-group">
                <button class="toolbar-button" onclick={setToInstagramPost}>Instagram post</button>
                <button class="toolbar-button" onclick={setToInstagramStory}>Instagram story</button>
            </div>
            <div class="horizontal-group">
                <button class="toolbar-button" onclick={setToFacebookVertical}>Facebook feed</button>
                <button class="toolbar-button" onclick={setTo16by9}>Standard 16/9</button>
            </div>

            {#if bgImage.src}
                <button class="toolbar-button" onclick={autoResizeToBackground}>Fit to background</button>
            {/if}
        </fieldset>

        <fieldset>
            <legend>Background</legend>

            <div class="horizontal-group">
                <div>
                    <label for="bg-offset-x">Offset X</label>
                    <input type="number" name="bg-offset-x" id="bg-offset-x" step="1" min="-1000" max="1000" bind:value={bgOffset.x} onchange={draw} />
                </div>
                <div>
                    <label for="bg-offset-y">Offset Y</label>
                    <input type="number" name="bg-offset-y" id="bg-offset-y" step="1" min="-1000" max="1000" bind:value={bgOffset.y} onchange={draw} />
                </div>
            </div>

            <label for="bg-scale">Scale</label>
            <input type="number" name="bg-scale" id="bg-scale" step="0.01" min="0.01" max="10" bind:value={bgScale} onchange={draw} />
        </fieldset>

        <fieldset>
            <legend>Theme</legend>

            <div class="horizontal-group">
                <label for="light-theme-switch" class="checkbox">
                    <input type="radio" name="theme-switch" id="light-theme-switch" bind:group={theme} value="LIGHT" onchange={draw} />
                    Light
                </label>
                <label for="dark-theme-switch" class="checkbox">
                    <input type="radio" name="theme-switch" id="dark-theme-switch" bind:group={theme} value="DARK" onchange={draw} />
                    Dark
                </label>
            </div>

            {#if bgImage.src}
                <button class="toolbar-button" onclick={autoChooseTheme}>Auto-choose</button>
            {/if}
        </fieldset>

        <fieldset>
            <legend>Gradient</legend>

            <label for="enable-gradient" class="checkbox">
                <input type="checkbox" name="enable-gradient" id="enable-gradient" bind:checked={enableGradient} onchange={draw} />
                Enable gradient
            </label>

            {#if enableGradient}
                <label for="gradient-begin">Gradient begin</label>
                <input type="number" name="gradient-begin" id="gradient-begin" step="0.01" min="0" max="1" bind:value={gradientBegin} oninput={draw} />
                <label for="gradient-start-opacity">Start opacity</label>
                <input type="number" name="gradient-start-opacity" id="gradient-start-opacity" step="0.01" min="0" max="1" bind:value={gradientBeginOpacity} oninput={draw} />
                <label for="gradient-end">Gradient end</label>
                <input type="number" name="gradient-end" id="gradient-end" step="0.01" min="0" max="1" bind:value={gradientEnd} oninput={draw} />
                <label for="gradient-end-opacity">End opacity</label>
                <input type="number" name="gradient-end-opacity" id="gradient-end-opacity" step="0.01" min="0" max="1" bind:value={gradientEndOpacity} oninput={draw} />

                <div class="horizontal-group">
                    <div>
                        <label for="gradient-pos-x">Position X</label>
                        <input type="number" name="gradient-pos-x" id="gradient-pos-x" step="1" min="-10000" max="10000" bind:value={gradientPosition.x} oninput={draw} />
                    </div>
                    <div>
                        <label for="gradient-pos-y">Position Y</label>
                        <input type="number" name="gradient-pos-y" id="gradient-pos-y" step="1" min="-10000" max="10000" bind:value={gradientPosition.y} oninput={draw} />
                    </div>
                </div>

                <div class="horizontal-group">
                    <div>
                        <label for="gradient-width">Width</label>
                        <input type="number" name="gradient-width" id="gradient-width" step="1" min="-10000" max="10000" bind:value={gradientSize.x} oninput={draw} />
                    </div>
                    <div>
                        <label for="gradient-height">Height</label>
                        <input type="number" name="gradient-height" id="gradient-height" step="1" min="-10000" max="10000" bind:value={gradientSize.y} oninput={draw} />
                    </div>
                </div>

                <label for="gradient-rotation">Rotation</label>
                <input type="number" name="gradient-rotation" id="gradient-rotation" step="1" min="0" max="359" bind:value={gradientRotation} oninput={draw} />  
            {/if}
        </fieldset>

        <fieldset>
            <legend>Title</legend>

            <div class="horizontal-group">
                <div>
                    <label for="title-position-x">Position X</label>
                    <input type="number" name="title-position-x" id="title-position-x" step="1" min="0" max="10000" bind:value={titlePosition.x} oninput={draw} />
                </div>
                <div>
                    <label for="title-position-y">Position Y</label>
                    <input type="number" name="title-position-y" id="title-position-y" step="1" min="0" max="10000" bind:value={titlePosition.y} oninput={draw} />
                </div>
            </div>

            {#if gridEnabled}
                <button class="toolbar-button" onclick={snapTitleToGrid}>Snap to grid</button>
            {/if}

            <FontSelector bind:font={titleFontFamily} onchange={draw} />
            <label for="title-font-size">Font size</label>
            <input type="number" name="title-font-size" id="title-font-size" step="1" min="0" max="250" bind:value={titleFontSize} oninput={draw} />
            
            <div class="horizontal-group">
                <div>
                    <label for="title-shadow-radius">Shadow radius</label>
                    <input type="number" name="title-shadow-radius" id="title-shadow-radius" step="1" min="0" max="100" bind:value={titleShadowRadius} oninput={draw} />
                </div>
                <div>
                    <label for="title-shadow-strength">Shadow strength</label>
                    <input type="number" name="title-shadow-strength" id="title-shadow-strength" step="0.01" min="0" max="1" bind:value={titleShadowStrength} oninput={draw} />
                </div>
            </div>
        </fieldset>
        
        <fieldset>
            <legend>Concert list</legend>
            
            <div class="horizontal-group">
                <div>
                    <label for="concerts-offset-x">Position X</label>
                    <input type="number" name="concerts-offset-x" id="concerts-offset-x" step="1" min="0" max="10000" bind:value={concertListPosition.x} oninput={draw} />
                </div>
                <div>
                    <label for="concerts-offset-y">Position Y</label>
                    <input type="number" name="concerts-offset-y" id="concerts-offset-y" step="1" min="0" max="10000" bind:value={concertListPosition.y} oninput={draw} />
                </div>
            </div>

            {#if gridEnabled}
                <button class="toolbar-button" onclick={snapConcertsToGrid}>Snap to grid</button>
            {/if}

            <label for="concert-date-location-gap">Gap between date and location</label>
            <input type="number" name="concert-date-location-gap" id="concert-date-location-gap" step="1" min="0" max="100" bind:value={concertDateLocationGap} oninput={draw} />
            <label for="concerts-gap">Gap between concerts</label>
            <input type="number" name="concerts-gap" id="concerts-gap" step="1" min="0" max="100" bind:value={concertGap} oninput={draw} />
            
            <FontSelector bind:font={concertFontFamily} onchange={draw} />
            <label for="concert-date-font-size">Date font size</label>
            <input type="number" name="concert-date-font-size" id="concert-date-font-size" step="1" min="0" max="100" bind:value={concertDateFontSize} oninput={draw} />
            <label for="concert-location-font-size">Location font size</label>
            <input type="number" name="concert-location-font-size" id="concert-location-font-size" step="1" min="0" max="100" bind:value={concertLocationFontSize} oninput={draw} />
            
            <div class="horizontal-group">
                <div>
                    <label for="concert-shadow-radius">Shadow radius</label>
                    <input type="number" name="concert-shadow-radius" id="concert-shadow-radius" step="1" min="0" max="100" bind:value={concertShadowRadius} oninput={draw} />
                </div>
                <div>
                    <label for="concert-shadow-strength">Shadow strength</label>
                    <input type="number" name="concert-shadow-strength" id="concert-shadow-strength" step="0.01" min="0" max="1" bind:value={concertShadowStrength} oninput={draw} />
                </div>
            </div>
        </fieldset>

        <fieldset>
            <legend>Social medias</legend>

            <label for="enable-social-media" class="checkbox">
                <input type="checkbox" name="enable-social-media" id="enable-social-media" bind:checked={enableSocialMedia} onchange={draw} />
                Enable social medias
            </label>

            {#if enableSocialMedia}
                <div class="horizontal-group">
                    <div>
                        <label for="social-offset-x">Position X</label>
                        <input type="number" name="social-offset-x" id="social-offset-x" step="1" min="0" max="10000" bind:value={socialMediaPosition.x} oninput={draw} />
                    </div>
                    <div>
                        <label for="social-offset-y">Position Y</label>
                        <input type="number" name="social-offset-y" id="social-offset-y" step="1" min="0" max="10000" bind:value={socialMediaPosition.y} oninput={draw} />
                    </div>
                </div>

                {#if gridEnabled}
                    <button class="toolbar-button" onclick={snapSocialMediasToGrid}>Snap to grid</button>
                {/if}
                
                <label for="social-media-gap">Gap between social medias</label>
                <input type="number" name="social-media-gap" id="social-media-gap" step="1" min="0" max="1000" bind:value={socialMediaGap} oninput={draw} />
                <label for="social-media-logo-size">Logo size</label>
                <input type="number" name="social-media-logo-size" id="social-media-logo-size" step="1" min="0" max="500" bind:value={socialMediaLogoSize} oninput={draw} />
                <label for="social-media-logo-gap">Gap between logo and handle</label>
                <input type="number" name="social-media-logo-gap" id="social-media-logo-gap" step="1" min="0" max="500" bind:value={socialMediaLogoGap} oninput={draw} />
                <FontSelector bind:font={socialMediaFontFamily} onchange={draw} />
                <label for="social-media-font-size">Font size</label>
                <input type="number" name="social-media-font-size" id="social-media-font-size" step="1" min="0" max="250" bind:value={socialMediaFontSize} oninput={draw} />
            {/if}
            
        </fieldset>

        <fieldset>
            <legend>Website address</legend>

            <label for="enable-website" class="checkbox">
                <input type="checkbox" name="enable-website" id="enable-website" bind:checked={enableWebsite} onchange={draw} />
                Enable website address
            </label>
            
            {#if enableWebsite}
                <div class="horizontal-group">
                    <div>
                        <label for="website-offset-x">Position X</label>
                        <input type="number" name="website-offset-x" id="website-offset-x" step="1" min="0" max="10000" bind:value={websitePosition.x} oninput={draw} />
                    </div>
                    <div>
                        <label for="website-offset-y">Position Y</label>
                        <input type="number" name="website-offset-y" id="website-offset-y" step="1" min="0" max="10000" bind:value={websitePosition.y} oninput={draw} />
                    </div>
                </div>

                {#if gridEnabled}
                    <button class="toolbar-button" onclick={snapWebsiteToGrid}>Snap to grid</button>
                {/if}

                <FontSelector bind:font={websiteFontFamily} onchange={draw} />
                <label for="website-font-size">Font size</label>
                <input type="number" name="website-font-size" id="website-font-size" step="1" min="0" max="250" bind:value={websiteFontSize} oninput={draw} />
            {/if}
        </fieldset>
        
        <fieldset>
            <legend>Image copyright</legend>

            <label for="copyright-font-size">Font size</label>
            <input type="number" name="copyright-font-size" id="copyright-font-size" step="1" min="0" max="250" bind:value={copyrightFontSize} oninput={draw} />
        </fieldset>
    </div>
    
    <div class="center">
        <div class="toolbar-top">
            <div class="sub-toolbar">
                <div>
                    <label for="viewport-zoom">Zoom</label>
                    <input type="number" name="viewport-zoom" id="viewport-zoom" step="0.025" min="0.1" max="10" bind:value={zoomFactor} />
                </div>
                
                <label for="enable-grid" class="checkbox">
                    <input type="checkbox" name="enable-grid" id="enable-grid" bind:checked={gridEnabled} onchange={draw} />
                    Enable grid
                </label>
    
                {#if gridEnabled}
                    <div>
                        <label for="grid-divisions-x">Divisions X</label>
                        <input type="number" name="grid-divisions-x" id="grid-divisions-x" step="1" min="0" max="100" bind:value={gridDivisions.x} oninput={draw} />
                    </div>
                    <div>
                        <label for="grid-divisions-y">Divisions Y</label>
                        <input type="number" name="grid-divisions-y" id="grid-divisions-y" step="1" min="0" max="100" bind:value={gridDivisions.y} oninput={draw} />
                    </div>
                {/if}
            </div>

            <div class="sub-toolbar">
                <button class="toolbar-button" onclick={generatePostText}>Get post text</button>
                <button class="toolbar-button" onclick={download}>Download</button>
                <TextModal bind:this={textModal} />
            </div>
        </div>
        <div class="preview">
            <canvas class="canvas" style="--zoom: {zoomFactor}" bind:this={canvas}></canvas>
        </div>
    </div>

    <div class="toolbar-right">
        <fieldset>
            <legend>Title</legend>

            <input type="text" bind:value={title} oninput={draw} />
        </fieldset>

        <fieldset>
            <legend>Background image</legend>
            <ul class="images-list">
                {#each galleryManager.gallery.items as picture}
                    <li>
                        <button onclick={() => { setBackground(picture.url); imageCopyright = picture.copyright; }}>
                            <img src={picture.thumbnailUrl} alt={picture.copyright} />
                        </button>
                    </li>
                {/each}
            </ul>
        </fieldset>

        <fieldset>
            <legend>Concerts</legend>

            <ConcertSelector bind:this={concertSelector} onSelectionChanged={draw} />
        </fieldset>
    </div>
</div>

<style>

    .wrapper {
        --toolbar-width: 14rem;

        display: grid;

        grid-template-areas: "toolbar-left center toolbar-right";
        grid-template-columns: var(--toolbar-width) 1fr var(--toolbar-width);
        gap: 1rem;

        margin-top: 1rem;
    }

    fieldset {
        margin: 0;
        width: 100%;
        max-width: 100%;
        box-sizing: border-box;
        border-width: 1px;

        margin-bottom: 0.5rem;
    }

    .horizontal-group {
        display: flex;
        gap: 0.25rem;
        margin-bottom: 0.25rem;
    }

    .toolbar-left {
        grid-area: toolbar-left;

        overflow: auto;
        min-height: 600px;
        max-height: 80vh;
    }

    .center {
        grid-area: center;
        max-width: calc(100vw - calc(2 * var(--toolbar-width)) - 4rem - 1px);
    }

    .preview {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: auto;
    }
    
    .canvas {
        border: 1px solid black;

        transform: scale(var(--zoom));
    }

    .toolbar-right {
        grid-area: toolbar-right;
        overflow: auto;
        min-height: 600px;
        max-height: 80vh;
    }

    .toolbar-top {
        display: flex;
        justify-content: space-between;
        margin-bottom: 1rem;
        padding: 0.5rem 0;
        box-shadow: 0 0.5rem 0.5rem -0.5rem rgba(0, 0, 0, 0.1);
    }

    .sub-toolbar {
        display: flex;
        gap: 1rem;
    }

    .images-list {
        list-style-type: none;
        padding: 0;
        margin: 0;
        max-height: 20rem;

        overflow: auto;
    }

    .images-list button {
        padding: 0.5rem;
        cursor: pointer;

        transition: 0.25s;
    }

    .images-list button:hover {
        background-color: rgba(0, 0, 0, 0.2);
    }

    .images-list img {
        max-width: 100%;
        max-height: 8rem;
    }

    .checkbox {
        display: flex;
        align-items: center;
    }

    input {
        box-sizing: border-box;
        max-width: 11rem;
    }

</style>