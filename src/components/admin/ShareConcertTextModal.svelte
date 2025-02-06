<script lang="ts">
    import { languages } from "../../utils/languageUtils";
    import Modal from "../modals/Modal.svelte";

    interface EditorConcert {
        location: string;
        locationPrecise: string;
        description: string;
        lingualDescriptions: { [key: string]: string };
        dateString: string;
        timeEnabled: boolean;
        timeString: string;
        endDateEnabled: boolean;
        endDateString: string;
        endTimeString: string;
        url?: string;
    }

    let modal: Modal;

    let language = $state("en");
    let compact = $state(false);
    let gap = $state(1);
    let descriptionGap = $state(0);
    let useEmojis = $state(false);
    let concerts = $state<EditorConcert[]>([]);


    let text = $derived.by(() => {
        let texts: string[] = [];
        
        const formatter = new Intl.DateTimeFormat(language, {
            dateStyle: compact ? "medium" : "long"
        });
        const timeFormatter = new Intl.DateTimeFormat(language, {
            timeStyle: "short"
        });

        for (const concert of concerts) {

            let date = "";

            let startDate = new Date((concert.timeEnabled && concert.timeString) ? `${concert.dateString}T${concert.timeString}` : concert.dateString);
            if (!concert.endDateEnabled) {
                date = formatter.format(startDate);
            } else {
                let endDate = new Date((concert.timeEnabled && concert.endTimeString) ? `${concert.endDateString}T${concert.endTimeString}` : concert.endDateString);
                date = formatter.formatRange(startDate, endDate);
            }

            if (compact) {
                texts.push(`${date} - ${concert.location}`);
            } else {
                let developped = `${date}
                    ${concert.location}`;
                if (concert.locationPrecise) {
                    developped += `
                        ${useEmojis ? "🏛️ " : ""}${concert.locationPrecise}`;
                }

                if (concert.timeEnabled) {
                    developped += `
                        ${useEmojis ? "🕐 " : ""}${timeFormatter.format(startDate)}`;
                }
                if (concert.url) {
                    developped += `
                        ${useEmojis ? "🔗 " : ""}${concert.url}`;
                }

                developped += "\n".repeat(descriptionGap + 1);
                developped += `${concert.lingualDescriptions[language] ?? concert.description}`;
    
                texts.push(developped.trim().replaceAll("\t", "").replaceAll("  ", ""));
            }

        }

        return texts.join("\n".repeat(gap + 1));
    });

    export function show(c: EditorConcert[]) {
        modal.show();
        concerts = c;
    }

    async function copyText() {
        await navigator.clipboard.writeText(text);
    }

</script>

<Modal bind:this={modal}>
     <div class="toolbar">
        <div>
            <label for="lang">Language</label>
            <select name="lang" id="lang" bind:value={language}>
                {#each Object.keys(languages) as langKey}
                    <option value={langKey}>{ languages[langKey].name }</option>
                {/each}
            </select>
        </div>
        <div>
            <label for="compact">Verbosity</label>
            <div class="checkbox-group">
                <input type="checkbox" id="compact" name="compact" bind:checked={compact} />
                <label for="compact">Compact</label>
            </div>
        </div>
        <div>
            <label for="lines">Gap</label>
            <input type="number" name="gap" id="gap" step="1" min="0" max="10" bind:value={gap} />
        </div>

        {#if !compact}
            <div>
                <label for="lines">Description gap</label>
                <input type="number" name="gap" id="gap" step="1" min="0" max="2" bind:value={descriptionGap} />
            </div>
            <div>
                <label for="emojis">Emojis</label>
                <div class="checkbox-group">
                    <input type="checkbox" id="emojis" name="emojis" bind:checked={useEmojis} />
                    <label for="emojis">Use emojis</label>
                </div>
            </div>
        {/if}
     </div>

     <div class="text">{ text }</div>

     <div class="bar">
        <button class="toolbar-button" onclick={copyText}>
            <span>Copy</span>
        </button>
     </div>
</Modal>

<style>
    .text {
        font: inherit;
        background-color: white;
        white-space: pre-line;
        padding: 0.5rem;
        max-height: 70vh;
        overflow: scroll;
    }

    .toolbar {
        align-items: center;
    }

    .toolbar > div > label {
        font-size: 0.85rem;
    }

    .checkbox-group {
        margin-top: 0;
    }

    .bar {
        margin: 0.5rem 0;
    }

    .bar button {
        font-size: 1.25rem;
    }
</style>