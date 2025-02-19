<script lang="ts">
    import {
        type DocumentReference,
        updateDoc,
        getDoc,
        deleteDoc,
    } from "firebase/firestore";
    import { onMount } from "svelte";
    import type { NewsContent } from "../../../types/news";
    import NewsContentEditor from "./NewsContentEditor.svelte";
    import Collapsible from "../utils/Collapsible.svelte";
    import FormLabel from "../../utils/forms/FormLabel.svelte";
    import ImagePicker from "../images/ImagePicker.svelte";

    interface Props {
        newsRef: DocumentReference;
        ondeleted: (id: string) => any;
    }

    let { newsRef, ondeleted }: Props = $props();

    interface EditorNews {
        imageUrl: string;
        fullresXOffset: number;
        fullresYOffset: number;
        thumbnailUrl: string;
        thumbnailXOffset: number;
        thumbnailYOffset: number;
        imageCopyright: string;
        dateString: string;
        text: { [key: string]: NewsContent };
    }

    let news = $state<EditorNews>({
        imageUrl: "",
        fullresXOffset: 50,
        fullresYOffset: 50,
        thumbnailUrl: "",
        thumbnailXOffset: 50,
        thumbnailYOffset: 50,
        imageCopyright: "",
        text: {},
        dateString: "",
    });

    let hash: string = $state("");

    let basicDetails: Collapsible;
    let imageDetails: Collapsible;
    let contentDetails: Collapsible;

    onMount(async () => {
        const snapshot = await getDoc(newsRef);
        const data = snapshot.data();
        if (!data) return;

        news.dateString = data.date.toDate().toISOString().split("T")[0];
        news.imageUrl = data.imageUrl;
        news.fullresXOffset = data.fullresXOffset ?? 50;
        news.fullresYOffset = data.fullresYOffset ?? 50;
        news.thumbnailUrl = data.thumbnailUrl;
        news.thumbnailXOffset = data.thumbnailXOffset ?? 50;
        news.thumbnailYOffset = data.thumbnailYOffset ?? 50;
        news.imageCopyright = data.imageCopyright;
        news.text = {
            ...data.text,
        };

        hash = JSON.stringify(news);
    });

    export async function save() {
        if (!modified) return;

        await updateDoc(newsRef, {
            imageUrl: news.imageUrl,
            fullresXOffset: news.fullresXOffset,
            fullresYOffset: news.fullresYOffset,
            thumbnailUrl: news.thumbnailUrl,
            thumbnailXOffset: news.thumbnailXOffset,
            thumbnailYOffset: news.thumbnailYOffset,
            imageCopyright: news.imageCopyright,
            date: new Date(news.dateString),
            text: news.text,
        });

        hash = JSON.stringify(news);
    }

    async function deleteNews() {
        const areYouSure = prompt(
            `If you really want to delete ${news.text["en"]?.title ?? news.text["fr"]?.title}, type YES and select ok`,
        );
        if (areYouSure !== "YES") return;

        await deleteDoc(newsRef);
        ondeleted(newsRef.id);
    }

    function expandAll() {
        basicDetails.expand();
        imageDetails.expand();
        contentDetails.expand();
    }

    function collapseAll() {
        basicDetails.collapse();
        imageDetails.collapse();
        contentDetails.collapse();
    }

    let modified: boolean = $derived(hash !== JSON.stringify(news));
</script>

<div class="editor-container" class:modified>
    <header>
        <h3>
            {news.text["en"]?.title ?? news.text["fr"]?.title ?? "New news item"}
            ({new Date(news.dateString,).toLocaleDateString()})
        </h3>
        {#if modified}
            <div class="info">Has unsaved changes</div>
        {/if}

        <div class="bar">
            <button class="toolbar-button" onclick={expandAll}>Expand</button>
            <button class="toolbar-button" onclick={collapseAll}>Collapse</button>
            {#if modified}
                <button class="toolbar-button" onclick={save}>Save modifications</button>
            {/if}
            <button class="toolbar-button red" onclick={deleteNews}>Delete news item</button>
        </div>
    </header>

    <Collapsible summaryText="Basic details" bind:this={basicDetails}>
        <FormLabel name="Publication date">
            <input type="date" bind:value={news.dateString} />
        </FormLabel>
    </Collapsible>

    <Collapsible summaryText="Image" bind:this={imageDetails}>
        <ImagePicker
            bind:fullresUrl={news.imageUrl}
            bind:thumbnailUrl={news.thumbnailUrl}
            folderPath="news"
            allowPickFromFolders={[
                {
                    displayName: "Gallery",
                    path: "gallery"
                }
            ]}
            cropContainerThumbnail={{ width: 20, height: 26 }}
            bind:thumbnailXOffset={news.thumbnailXOffset}
            bind:thumbnailYOffset={news.thumbnailYOffset}
            cropContainerFullres={{ width: 16, height: 9 }}
            bind:fullresXOffset={news.fullresXOffset}
            bind:fullresYOffset={news.fullresYOffset}
        />
    </Collapsible>

    <Collapsible summaryText="Article content" bind:this={contentDetails}>
        {#each Object.keys(news.text) as lang}
            <NewsContentEditor langName={lang} text={news.text[lang]} />
        {/each}
    </Collapsible>
</div>
