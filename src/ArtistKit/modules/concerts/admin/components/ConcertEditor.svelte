<script lang="ts">
    import { type DocumentReference, updateDoc, getDoc, deleteDoc } from "firebase/firestore";
    import { onMount } from "svelte";
    import { slide } from "svelte/transition";
    import ImagePicker from "../../../../core/components/admin/images/ImagePicker.svelte";
    import MultilingualEditor from "../../../../core/components/admin/MultilingualEditor.svelte";
    import TagsEditor from "../../../../core/components/admin/TagsEditor.svelte";
    import Collapsible from "../../../../core/components/Collapsible.svelte";
    import FormCheckbox from "../../../../core/components/forms/FormCheckbox.svelte";
    import FormLabel from "../../../../core/components/forms/FormLabel.svelte";

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
        imgUrl: string;
        thumbnailUrl: string;
        tags: { [key: string]: string };
    }

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
        imgUrl: string;
        thumbnailUrl: string;
        tags: {
            name: string;
            value: string;
        }[];
    }

    let { concertRef, warnAboutPast = false, ondeleted }: Props = $props();

    let concert = $state<EditorConcert>({
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
        imgUrl: "",
        thumbnailUrl: "",
        url: "",
        tags: []
    });

    let hash: string = $state("");

    let locationDetails: Collapsible;
    let dateDetails: Collapsible;
    let infosDetails: Collapsible;
    let descriptionDetails: Collapsible;
    let imageDetails: Collapsible;
    let tagsDetails: Collapsible;

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
        concert.imgUrl = data.imgUrl ?? "";
        concert.thumbnailUrl = data.thumbnailUrl ?? "";
        concert.tags = Object.keys(data.tags ?? {}).map((key) => {
            return {
                name: key,
                value: data.tags[key] ?? ""
            };
        });

        hash = JSON.stringify(concert);

        // If even location is empty, consider it's a new concert and thus expand all the options
        if (!concert.location) {
            expandAll();
        }
    });

    export async function save() {
        if (!modified) return;

        const tags: { [key: string]: string } = {};
        for (const tag of concert.tags) {
            tags[tag.name] = tag.value;
        }

        const data: FirebaseConcert = {
            location: concert.location,
            locationPrecise: concert.locationPrecise,
            description: concert.description,
            lingualDescriptions: concert.lingualDescriptions,
            url: concert.url,
            timeEnabled: concert.timeEnabled,
            imgUrl: concert.imgUrl,
            thumbnailUrl: concert.thumbnailUrl,
            tags,
            date: new Date((concert.timeEnabled && concert.timeString) ? `${concert.dateString}T${concert.timeString}` : concert.dateString),
        };
        if (concert.endDateEnabled) {
            data.endDate = new Date((concert.timeEnabled && concert.endTimeString) ? `${concert.endDateString}T${concert.endTimeString}` : concert.endDateString);
        }
        await updateDoc(concertRef, data as any);

        hash = JSON.stringify(concert);
    }

    export function toJSON() {
        return concert;
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
        imageDetails.expand();
        tagsDetails.expand();
    }

    function collapseAll() {
        locationDetails.collapse();
        dateDetails.collapse();
        infosDetails.collapse();
        descriptionDetails.collapse();
        imageDetails.collapse();
        tagsDetails.collapse();
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
        <FormLabel name="Location/name (ex. Praque Spring Festival)">
            <input type="text" bind:value={concert.location} />
        </FormLabel>

        <FormLabel name="Precise location (optional)">
            <input type="text" bind:value={concert.locationPrecise} />
        </FormLabel>
    </Collapsible>

    <Collapsible summaryText="Date" bind:this={dateDetails}>
        <FormLabel name="Start date">
            <input type="date" bind:value={concert.dateString} />
        </FormLabel>

        <FormCheckbox name="Enable start time">
            <input type="checkbox" bind:checked={concert.timeEnabled} />
        </FormCheckbox>
        
        {#if concert.timeEnabled}
            <div transition:slide={{ duration: 150 }}>
                <FormLabel name="Start time">
                    <input type="time" bind:value={concert.timeString} />
                </FormLabel>
            </div>
        {/if}

        <FormCheckbox name="Enable end date">
            <input type="checkbox" bind:checked={concert.endDateEnabled} />
        </FormCheckbox>
        {#if concert.endDateEnabled}
            <div transition:slide={{ duration: 150 }}>
                <FormLabel name="End date">
                    <input type="date" id="{idBase}-end-date" class="end-date-field" bind:value={concert.endDateString} />
                </FormLabel>

                {#if concert.timeEnabled}
                    <FormLabel name="End time">
                        <input type="time" id="{idBase}-end-time" class="end-time-field" bind:value={concert.endTimeString} />
                    </FormLabel>
                {/if}
            </div>
        {/if}
    </Collapsible>

    <Collapsible summaryText="Other infos" bind:this={infosDetails}>
        <FormLabel name="Website url (optional)">
            <input type="url" id="{idBase}-url" class="url-field" bind:value={concert.url} />
        </FormLabel>
    </Collapsible>

    <Collapsible summaryText="Description" bind:this={descriptionDetails}>
        <MultilingualEditor bind:defaultText={concert.description} bind:lingualTexts={concert.lingualDescriptions} />
    </Collapsible>

    <Collapsible summaryText="Image" bind:this={imageDetails}>
        <ImagePicker
            bind:fullresUrl={concert.imgUrl}
            bind:thumbnailUrl={concert.thumbnailUrl}
            folderPath="concerts"
            allowPickFromFolders={[
                {
                    displayName: "Gallery",
                    path: "gallery"
                },
                {
                    displayName: "Concerts",
                    path: "concerts"
                }
            ]}
        />
    </Collapsible>

    <Collapsible summaryText="Tags" bind:this={tagsDetails}>
        <TagsEditor bind:tags={concert.tags} />
    </Collapsible>
</div>