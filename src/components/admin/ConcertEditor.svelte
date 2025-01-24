<script lang="ts">
    import { type DocumentReference, updateDoc, getDoc, deleteDoc } from "firebase/firestore";
    import { onMount } from "svelte";
    import MultilingualEditor from "./MultilingualEditor.svelte";
    import Collapsible from "./Collapsible.svelte";

    interface Props {
        concertRef: DocumentReference;
        warnAboutPast?: boolean;
        ondeleted: (id: string) => any;
    }

    interface FirebaseConcert {
        location: string;
        locationPrecise: string;
        description: string;
        lingualDescriptions: { [key: string]: string };
        date: Date;
        timeEnabled: boolean;
        endDate?: Date;
        url?: string;
    }

    let { concertRef, warnAboutPast = false, ondeleted }: Props = $props();

    let concert = $state({
        location: "",
        locationPrecise: "",
        description: "",
        lingualDescriptions: {},
        dateString: "",
        timeEnabled: false,
        timeString: "",
        endDateEnabled: false,
        endDateString: "",
        endTimeString: "",
        url: ""
    });

    let hash: string = $state("");

    let locationDetails: Collapsible;
    let dateDetails: Collapsible;
    let infosDetails: Collapsible;
    let descriptionDetails: Collapsible;

    onMount(async () => {
        const snapshot = await getDoc(concertRef);
        const data = snapshot.data();
        if (!data) return;

        concert.location = data.location;
        concert.locationPrecise = data.locationPrecise ?? "";

        concert.timeEnabled = data.timeEnabled ?? false;
        const startDateParts = data.date.toDate().toISOString().split("T");
        concert.dateString = startDateParts[0];
        concert.timeString = startDateParts[1] ?? "";

        if (data.endDate) {
            concert.endDateEnabled = true;
            const endDateParts = data.endDate.toDate().toISOString().split("T");
            concert.endDateString = endDateParts[0];
            concert.endTimeString = endDateParts[1];
        } else {
            concert.endDateEnabled = false;
        }

        concert.description = data.description;
        concert.lingualDescriptions = data.lingualDescriptions ?? {};
        
        concert.url = data.url ?? "";

        hash = JSON.stringify(concert);

        // If even location is empty, consider it's a new concert and thus expand all the options
        if (!concert.location) {
            expandAll();
        }
    });

    export async function save() {
        if (!modified) return;

        const data: FirebaseConcert = {
            location: concert.location,
            locationPrecise: concert.locationPrecise,
            description: concert.description,
            lingualDescriptions: concert.lingualDescriptions,
            url: concert.url,
            timeEnabled: concert.timeEnabled,
            date: new Date((concert.timeEnabled && concert.timeString) ? `${concert.dateString}T${concert.timeString}` : concert.dateString),
        };
        if (concert.endDateEnabled) {
            data.endDate = new Date((concert.timeEnabled && concert.endTimeString) ? `${concert.endDateString}T${concert.endTimeString}` : concert.endDateString);
        }
        await updateDoc(concertRef, data as any);

        hash = JSON.stringify(concert);
    }

    async function deleteConcert() {
        const areYouSure = prompt(`If you really want to delete this concert (${concert.location}, ${(new Date(concert.dateString)).toLocaleDateString()}), type YES and select ok`);
        if (areYouSure !== "YES") return;

        await deleteDoc(concertRef);
        ondeleted(concertRef.id);
    }

    function expandAll() {
        locationDetails.expand();
        dateDetails.expand();
        infosDetails.expand();
        descriptionDetails.expand();
    }

    function collapseAll() {
        locationDetails.collapse();
        dateDetails.collapse();
        infosDetails.collapse();
        descriptionDetails.collapse();
    }

    const idBase = "" + Math.ceil(Math.random() * 10000);

    let modified = $derived(hash !== JSON.stringify(concert));
    let dateSettingsToFormattedString = $derived.by(() => {
        if (!concert.dateString) return "";

        const formatter = new Intl.DateTimeFormat(undefined, {
            dateStyle: "medium",
            timeStyle: concert.timeEnabled ? "short" : undefined
        });

        let startDate = new Date((concert.timeEnabled && concert.timeString) ? `${concert.dateString}T${concert.timeString}` : concert.dateString);
        if (!concert.endDateEnabled) return formatter.format(startDate);

        let endDate = new Date((concert.timeEnabled && concert.endTimeString) ? `${concert.endDateString}T${concert.endTimeString}` : concert.endDateString);
        return formatter.formatRange(startDate, endDate);
    });
</script>

<div class="editor-container" class:modified={modified}>
    <header>
        <h3>{concert.location || "New concert"}, {dateSettingsToFormattedString}</h3>
        {#if modified}
            <div class="info">Has unsaved changes</div>
        {/if}
        {#if warnAboutPast && (new Date(concert.dateString)).valueOf() < (new Date()).valueOf()}
            <p>This concert is in the past. It will automatically appear in the past concerts list once saved if you reload the page.</p>
        {/if}

        <div class="bar">
            <button class="toolbar-button" onclick={expandAll}>Expand</button>
            <button class="toolbar-button" onclick={collapseAll}>Collapse</button>
            {#if modified}
                <button class="toolbar-button" onclick={save}>Save modifications</button>
            {/if}
            <button class="toolbar-button red" onclick={deleteConcert}>Delete concert</button>
        </div>
    </header>

    <Collapsible summaryText="Location" bind:this={locationDetails}>
        <label for="{idBase}-location" class="field-label">Location/name (ex. Prague Spring Festival)</label>
        <input type="text" id="{idBase}-location" class="location-field" bind:value={concert.location} />

        <label for="{idBase}-precise-location" class="field-label">Precise location (optional)</label>
        <input type="text" id="{idBase}-precise-location" class="precise-location-field" bind:value={concert.locationPrecise} />
    </Collapsible>

    <Collapsible summaryText="Date" bind:this={dateDetails}>
        <label for="{idBase}-date" class="field-label">Start date</label>
        <input type="date" id="{idBase}-date" class="date-field" bind:value={concert.dateString} />

        <div class="checkbox-group">
            <input type="checkbox" id="{idBase}-enable-start-time" name="{idBase}-enable-start-time" bind:checked={concert.timeEnabled} />
            <label for="{idBase}-enable-start-time">Enable start time</label>
        </div>
        {#if concert.timeEnabled}
            <label for="{idBase}-time" class="field-label">Start time</label>
            <input type="time" id="{idBase}-time" class="time-field" bind:value={concert.timeString} />
        {/if}

        <div class="checkbox-group">
            <input type="checkbox" id="{idBase}-enable-end-date" name="{idBase}-enable-end-date" bind:checked={concert.endDateEnabled} />
            <label for="{idBase}-enable-end-date">Enable end date</label>
        </div>
        {#if concert.endDateEnabled}
            <label for="{idBase}-end-date" class="field-label">End date</label>
            <input type="date" id="{idBase}-end-date" class="end-date-field" bind:value={concert.endDateString} />

            {#if concert.timeEnabled}
                <label for="{idBase}-end-time" class="field-label">End time</label>
                <input type="time" id="{idBase}-end-time" class="end-time-field" bind:value={concert.endTimeString} />
            {/if}
        {/if}
    </Collapsible>

    <Collapsible summaryText="Other infos" bind:this={infosDetails}>
        <label for="{idBase}-url" class="field-label">Website url (optional)</label>
        <input type="url" id="{idBase}-url" class="url-field" bind:value={concert.url} />
    </Collapsible>

    <Collapsible summaryText="Description" bind:this={descriptionDetails}>
        <MultilingualEditor bind:defaultText={concert.description} bind:lingualTexts={concert.lingualDescriptions} />
    </Collapsible>
</div>