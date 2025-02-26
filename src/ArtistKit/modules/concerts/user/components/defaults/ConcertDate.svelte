<script lang="ts">
    import { page } from "$app/state";
    import { capitalize } from "../../../../../core/utils/stringUtils";
    import type { Concert } from "../../../concertsManager.svelte";

    interface Props {
        concert: Concert;
        compact: boolean;
    }

    let { concert, compact }: Props = $props();

    function formatFull() {
        const formatter = new Intl.DateTimeFormat(page.url.pathname.split("/")[1], {
            dateStyle: "full",
        });

        if (concert.endDate) {
            return formatter.formatRange(concert.date, concert.endDate);
        }

        return formatter.format(concert.date);
    }

    function formatShort(date: Date) {
        const formatter = new Intl.DateTimeFormat(page.url.pathname.split("/")[1], {
            month: "short",
            day: "numeric"
        });

        return formatter.format(date);
    }

    function formatMonth(date: Date) {
        const formatter = new Intl.DateTimeFormat(page.url.pathname.split("/")[1], {
            month: "short",
        });

        return formatter.format(date);
    }
</script>

{#if compact}
    <div class="compact-wrapper">
        { capitalize(formatFull()) }
    </div>
{:else}
    <div class="wrapper">
        <div class="year">{ concert.date.getFullYear() }</div>
        {#if concert.endDate}
            <div class="day">{ capitalize(formatShort(concert.date)) }</div>
            <div class="year">&#9947;</div>
            <div class="day">{ capitalize(formatShort(concert.endDate)) }</div>
        {:else}
            <div class="month">{ capitalize(formatMonth(concert.date)) }</div>
            <div class="day">{ concert.date.getDate() }</div>
        {/if}
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