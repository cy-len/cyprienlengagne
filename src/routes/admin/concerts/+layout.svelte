<script lang="ts">
    import NavLink from "../../../components/utils/NavLink.svelte";
    interface Props {
        children?: import('svelte').Snippet;
    }

    let { children }: Props = $props();


</script>

<div>
    <h2>Concerts</h2>

    <nav class="admin-nav">
        <NavLink href="/admin/concerts/upcoming">Upcoming</NavLink>
        <NavLink href="/admin/concerts/past">Past</NavLink>
    </nav>

    {@render children?.()}
</div>