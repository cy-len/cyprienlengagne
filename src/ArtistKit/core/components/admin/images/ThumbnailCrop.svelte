<script lang="ts">
    interface Props {
        imageTitle: string;
        thumbnailUrl: string;
        xOffset: number;
        yOffset: number;

        aspectRatioWidth: number;
        aspectRatioHeight: number;
    }

    let {
        imageTitle,
        thumbnailUrl = $bindable(),
        xOffset = $bindable(50),
        yOffset = $bindable(50),
        aspectRatioWidth,
        aspectRatioHeight
    }: Props = $props();

    function center() {
        xOffset = 50;
        yOffset = 50;
    }

    let naturalWidth = $state(1);
    let naturalHeight = $state(1);

    let targetAspectRatio = $derived(aspectRatioWidth / aspectRatioHeight);
    let naturalAspectRatio = $derived(naturalWidth / naturalHeight);

    let xDisabled = $derived(naturalAspectRatio < targetAspectRatio);
    let yDisabled = $derived(naturalAspectRatio > targetAspectRatio);
</script>

<div class="thumbnail-crop">
    <header>
        <div>
            <h4>{imageTitle}</h4>
            <div class="info">(target aspect ratio {aspectRatioWidth} / {aspectRatioHeight})</div>
        </div>

        <div class="actions">
            <button class="toolbar-button" onclick={center}>Center image</button>
        </div>
    </header>

    <div class="crop-grid">
        <img
            src={thumbnailUrl}
            alt="Preview"
            style="aspect-ratio: {aspectRatioWidth} / {aspectRatioHeight}; object-position: {xOffset}% {yOffset}%"
            bind:naturalWidth
            bind:naturalHeight
        />
        <input
            type="range"
            class="range-x"
            bind:value={xOffset}
            disabled={xDisabled}
            min={0}
            max={100}
        />
        <input
            type="range"
            class="range-y"
            bind:value={yOffset}
            disabled={yDisabled}
            min={0}
            max={100}
        />
    </div>
</div>

<style>

    .crop-grid {
        height: 100%;
        display: grid;
        grid-template-areas:
            "img range-y"
            "range-x .";
        grid-template-columns: max-content 2rem;
        grid-template-rows: 30rem 2rem;
    }

    img {
        display: block;
        max-width: 100%;
        max-height: 100%;
        object-fit: cover;
        grid-area: img;
    }

    .range-x {
        grid-area: range-x;
    }

    .range-y {
        grid-area: range-y;
        writing-mode: vertical-lr;
    }

    .actions {
        display: flex;
        gap: 0.5rem;
    }

    h4 {
        margin: 0;
    }

    header {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
</style>
