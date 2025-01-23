<script lang="ts">
    import type { Concert } from "../../types/concert";
    import ConcertDate from "./ConcertDate.svelte";
    import { page } from "$app/state";
    import { limit } from "../../utils/stringUtils";

    interface Props {
        concert: Concert;
        compact: boolean;
    }

    let { concert, compact }: Props = $props();

    let description = $derived.by(() => {
        const lang = page.url.pathname.split("/")[1];
        return concert.lingualDescriptions[lang] ?? concert.description;
    });

    const timeFormatter = new Intl.DateTimeFormat(page.url.pathname.split("/")[1], {
        timeStyle: "short"
    });

</script>

<a href={concert.url} target="_blank" rel="noopener noreferrer" class:compact={compact}>
    <div class="concert-container">
        <div class="concert-date"><ConcertDate concert={concert} compact={compact} /></div>
        <header>
            <div class="concert-title">{ concert.location }</div>
            <div class="concert-optional">
                {#if concert.locationPrecise}
                    <div>
                        <img src="/icons/map_marker.svg" alt="Map marker" class="icon" />
                        <span>{ concert.locationPrecise }</span>
                    </div>
                {/if}
                {#if concert.timeEnabled}
                    <div>
                        <img src="/icons/clock.svg" alt="Clock" class="icon" />
                        <span>{ timeFormatter.format(concert.date) }</span>
                    </div>
                {/if}
                {#if concert.url}
                    <div>
                        <img src="/icons/link.svg" alt="Link" class="icon" />
                        <span>{ limit(concert.url, 32) }</span>
                    </div>
                {/if}
            </div>
        </header>
        <div class="concert-description line-breaks">{ description }</div>
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
            "date header"
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
            "header"
            "description";
        grid-template-columns: 1fr;
    }

    header {
        grid-area: header;
    }

    .concert-title {
        font-size: 1.25rem;
        font-weight: bold;
    }

    .compact .concert-title  {
        padding: 0.5rem 1rem 0.25rem 1rem;
    }

    .compact .concert-optional  {
        padding: 0 1rem 0.5rem 1rem;
    }

    .concert-date {
        grid-area: date;
    }
    
    .concert-optional > div {
        display: flex;
        gap: 0.25rem;
        align-items: center;
        font-size: 0.9rem;
    }

    .icon {
        height: 1rem;
    }

    .concert-description {
        grid-area: description;
    }

    .compact .concert-description {
        padding: 0 1rem 1rem 1rem;
    }

</style>