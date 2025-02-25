<script lang="ts">
    import { imageManager } from "../../stores/images.svelte";

    interface Props {
        lowresSrc?: string;
        src: string;
        alt?: string;
        lowresBlurRadius?: string;
        observe?: boolean;
        onFullResLoaded?: () => {};
    }

    let {
        lowresSrc,
        src,
        alt = "",
        lowresBlurRadius = "5px",
        onFullResLoaded,
        observe = true,
    }: Props = $props();

    let showLowres = $state<boolean>(!!lowresSrc);
    let img: HTMLImageElement;

    async function loadFullRes() {
        await imageManager.loadImage(src);
        showLowres = false;
        if (onFullResLoaded) onFullResLoaded();
    }

    $effect(() => {
        if (!lowresSrc || imageManager.isLoaded(src)) {
            showLowres = false;
            return;
        }

        showLowres = true;

        if (observe) {
            const observer = new IntersectionObserver((entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) {
                        loadFullRes();
                    }
                }
            });

            observer.observe(img);

            return () => {
                observer.disconnect();
            };
        } else {
            loadFullRes();
        }
    });

    let currentSrc = $derived(showLowres ? lowresSrc : src);
</script>

<img
    bind:this={img}
    src={currentSrc}
    {alt}
    class="lazy-image"
    class:blurred={showLowres}
    style="--blur-radius: {lowresBlurRadius}"
/>

<style>
    img {
        transition: 0.5s filter;
    }

    img.blurred {
        filter: blur(var(--blur-radius));
    }
</style>
