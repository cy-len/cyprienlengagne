<script lang="ts">

    interface Props {
        title: string;
        description?: string;
        imageUrl?: string;
    }

    let { title, description = "", imageUrl = "" }: Props = $props();

</script>

<svelte:head>
    <title>{title}</title>
    <meta property="og:title" content={title} />
    <meta property="og:type" content="website" />
    <meta
        property="description"
        content={description}
    />
    <meta
        property="og:description"
        content={description}
    />
    <meta
        property="og:image"
        content={imageUrl}
    />
    <meta
        property="og:image:secure_url"
        content={imageUrl}
    />
</svelte:head>