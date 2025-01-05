<script lang="ts">
    import type { Concert } from "../../types/concert";
    import ConcertDate from "./ConcertDate.svelte";


    export let concert: Concert;
    export let compact: boolean;

</script>

<a href={concert.url} target="_blank" rel="noopener noreferrer" class:compact={compact}>
    <div class="concert-container">
        <div class="concert-date"><ConcertDate date={concert.date} compact={compact} /></div>
        <div class="concert-title">{ concert.location }</div>
        <div class="concert-description line-breaks">{ concert.description }</div>
    </div>
</a>

<style>

    a {
        display: block;
        padding: 0.5rem 0.5rem 0.5rem 0;
        text-decoration: none;
        color: inherit;
        border-top-right-radius: 2rem;
        border-bottom-right-radius: 2rem;

        transition: 0.25s;
    }

    a:not(.compact) {
        padding-right: 1rem;
    }

    a.compact {
        padding: 0;
        border-top-right-radius: 0;
        border-bottom-left-radius: 2rem;

        border: 1px solid var(--color-primary-light);
        margin-bottom: 1rem;
    }

    a:hover {
        background-color: rgba(51, 51, 51, 0.1);
    }

    a:not(.compact):hover {
        padding-left: 1rem;
        padding-right: 0;
    }

    .concert-container {
        display: grid;
        grid-template-areas:
            "date title"
            "date description";
        grid-template-columns: 5rem 1fr;
        gap: 0.5rem 1rem;
    }
    
    a:not(.compact) .concert-container {
        max-width: calc(100% - 1rem);
    }

    a.compact .concert-container {
        grid-template-areas:
            "date"
            "title"
            "description";
        grid-template-columns: 1fr;
    }

    .concert-title {
        font-size: 1.25rem;
        font-weight: bold;
        grid-area: title;
    }

    .compact .concert-title {
        padding: 0 1rem;
    }

    .concert-date {
        grid-area: date;
    }

    .concert-description {
        grid-area: description;
    }

    .compact .concert-description {
        padding: 0 1rem 1rem 1rem;
    }

</style>