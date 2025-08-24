<script>
    import HomeStructure from "../../components/home/HomeStructure.svelte";

    let { data } = $props();
</script>

<HomeStructure
    shortBio={data.shortBio}
    topConcerts={data.topConcerts}
    topNews={data.topNews}
/>
