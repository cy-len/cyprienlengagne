<script lang="ts">
    import { preventDefault } from 'svelte/legacy';
    import { getContext, onMount } from "svelte";
    import { getDoc, updateDoc, type DocumentReference } from "firebase/firestore";
    import LoadingSpinner from "../../../components/utils/LoadingSpinner.svelte";
    import type { FirebaseManager } from '../../../firebase/firebaseManager.svelte';
    import FormLabel from '../../../components/utils/forms/FormLabel.svelte';
    
    let firebaseManager = getContext<() => FirebaseManager | undefined>("firebaseManager")();
    let handlesReference: DocumentReference | null = null;

    interface SocialMediasHandles {
        facebook: string;
        instagram: string;
        twitter: string;
        youtube: string;
    }

    let handles: SocialMediasHandles = $state({
        facebook: "",
        instagram: "",
        twitter: "",
        youtube: "",
    });

    let saving: boolean = $state(false);

    onMount(async () => {
        if (!firebaseManager) return;

        handlesReference = firebaseManager.socialMediasHandles();

        const handlesSnap = await getDoc(handlesReference);
        handles = handlesSnap.data() as SocialMediasHandles;
    });

    async function save() {
        if (!handlesReference) return;

        saving = true;
        await updateDoc(handlesReference, {
            ...handles
        });
        saving = false;
    }

</script>

<div>
    <h2>Edit Social Medias Handles</h2>

    <div class="form">
        <FormLabel name="YouTube">
            <input type="text" bind:value={handles.youtube} />
        </FormLabel>
        <FormLabel name="Facebook">
            <input type="text" bind:value={handles.facebook} />
        </FormLabel>
        <FormLabel name="Instagram">
            <input type="text" bind:value={handles.instagram} />
        </FormLabel>
        <FormLabel name="X (Twitter)">
            <input type="text" bind:value={handles.twitter} />
        </FormLabel>

        <button class="cta-inverted" onclick={save}>Save</button>

        {#if saving}
            <div class="saving-backdrop">
                <LoadingSpinner message="Saving social medias handles" />
            </div>
        {/if}
        </div>
</div>

<style>
    .form {
        position: relative;
    }
    
    button {
        margin-block: 0.5rem;
    }
</style>