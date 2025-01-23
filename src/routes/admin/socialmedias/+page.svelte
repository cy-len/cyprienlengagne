<script lang="ts">
    import { preventDefault } from 'svelte/legacy';
    import { getContext, onMount } from "svelte";
    import { getDoc, updateDoc, type DocumentReference } from "firebase/firestore";
    import LoadingSpinner from "../../../components/utils/LoadingSpinner.svelte";
    import type { FirebaseManager } from '../../../firebase/firebaseManager.svelte';
    
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
        console.log(handles);
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

    <form onsubmit={preventDefault(save)}>
        <label for="youtube">YouTube</label>
        <input type="text" name="youtube" id="youtube" bind:value={handles.youtube} />
        
        <label for="facebook">Facebook</label>
        <input type="text" name="facebook" id="facebook" bind:value={handles.facebook} />
        
        <label for="instagram">Instagram</label>
        <input type="text" name="instagram" id="instagram" bind:value={handles.instagram} />
        
        <label for="twitter">Twitter</label>
        <input type="text" name="twitter" id="twitter" bind:value={handles.twitter} />

        <button class="cta-inverted">Save</button>

        {#if saving}
            <div class="saving-backdrop">
                <LoadingSpinner message="Saving short bio" />
            </div>
        {/if}
    </form>
</div>

<style>
    form {
        position: relative;
    }
    label, button {
        margin-block: 0.5rem;
    }
</style>