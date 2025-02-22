<script lang="ts">
    import { slide } from "svelte/transition";
    import type { Recording } from "../../../types/composition";
    import FormLabel from "../../utils/forms/FormLabel.svelte";
    import RecordingPlayer from "../../utils/RecordingPlayer.svelte";

    interface Props {
        recordings: Recording[];
    }

    let { recordings = $bindable() }: Props = $props();

</script>

<div class="recordings-editor">
    {#each recordings as recording, i}
        <div class="recording-item" transition:slide={{ duration: 250 }}>
            <div class="flex">
                <FormLabel name="Platform">
                    <select bind:value={recording.platform}>
                        <option value="youtube">YouTube</option>
                        <option value="spotify">Spotify</option>
                        <option value="soundcloud">Soundcloud</option>
                    </select>
                </FormLabel>
                <FormLabel name="Link">
                    <input type="text" bind:value={recording.link} />
                </FormLabel>

                <button
                    class="cta-inverted red"
                    onclick={() => recordings.splice(i, 1)}
                >Remove</button>
            </div>

            <RecordingPlayer {recording} />
        </div>
    {/each}

    <div class="bar">
        <button
            class="cta-inverted"
            onclick={() => {
                recordings.push({
                    platform: "youtube",
                    link: ""
                })
            }}
        >Add a recording</button>
    </div>
</div>

<style>

    .flex {
        display: flex;
        gap: 0.5rem;
        align-items: center;
    }

    .flex :global(:has(> input[type="text"])) {
        width: 100%;
    }

    .bar {
        margin-top: 1rem;
    }

</style>