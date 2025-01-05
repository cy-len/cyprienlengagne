<script lang="ts">
    import NavLink from "../../../components/utils/NavLink.svelte";


</script>

<div>
    <h2>Concerts</h2>

    <nav class="admin-nav">
        <NavLink href="/admin/concerts/upcoming">Upcoming</NavLink>
        <NavLink href="/admin/concerts/past">Past</NavLink>
    </nav>

    <slot />
</div>