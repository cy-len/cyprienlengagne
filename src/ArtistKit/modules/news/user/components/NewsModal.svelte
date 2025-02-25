<script lang="ts">
    import Modal from "../../../../core/components/Modal.svelte";
    import type { News } from "../../newsManager.svelte";
    
    interface Props {
        lang?: string;
    }

    let { lang = "en" }: Props = $props();

    let news: News = $state({
        imageUrl: "",
        fullresXOffset: 50,
        fullresYOffset: 50,
        thumbnailXOffset: 50,
        thumbnailYOffset: 50,
        imageCopyright: "",
        text: {
            [lang]: {
                title: "",
                content: ""
            },
        },
        date: new Date()
    });

    let modal: Modal;

    export function show(newsItem: News) {
        news = newsItem;
        console.log($state.snapshot(news));
        modal.show();
    }
</script>

<Modal bind:this={modal}>
    <div>
        <img src={news.imageUrl} alt={news.text[lang].title} style="object-position: {news.fullresXOffset}% {news.fullresYOffset}%;" />
        <div class="text">
            <h3>{ news.text[lang].title }</h3>
            <p>{ news.text[lang].content }</p>
        </div>
    </div>
</Modal>

<style>

    img {
        display: block;
        object-fit: cover;
        max-width: min(90vw, 800px);
        aspect-ratio: 16 / 9;
    }

    @media screen and (min-width: 768px) {
        img {
            max-width: 90vw;
            width: 100%;
            max-height: 400px;
        }
    }

    .text {
        background: rgba(255, 255, 255, 0.5);
        padding: 0.75rem;
    }

</style>