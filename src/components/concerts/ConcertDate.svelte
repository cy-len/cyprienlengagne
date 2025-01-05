<script lang="ts">
    import { page } from "$app/stores";
    import { capitalize } from "../../utils/stringUtils";

    export let date: Date;
    export let compact: boolean;

    const monthFormatter = new Intl.DateTimeFormat($page.url.pathname.split("/")[1], {
        month: "short"
    });

    const fullFormatter = new Intl.DateTimeFormat($page.url.pathname.split("/")[1], {
        dateStyle: "full"
    });
</script>

{#if compact}
    <div class="compact-wrapper">
        { capitalize(fullFormatter.format(date)) }
    </div>
{:else}
    <div class="wrapper">
        <div class="year">{ date.getFullYear() }</div>
        <div class="month">{ capitalize(monthFormatter.format(date)) }</div>
        <div class="day">{ date.getDate() }</div>
    </div>
{/if}

<style>

    .compact-wrapper {
        padding: 0.5rem;
        text-align: center;
        background-color: var(--color-primary-light);
    }

    .wrapper {
        width: 5rem;
        height: 5rem;
        border-radius: 1rem;
        background-color: var(--color-primary-light);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
    
    .year {
        font-size: 0.75rem;
    }

    .month {
        font-size: 1.25rem;
    }

    .day {
        font-size: 1rem;
    }

</style>