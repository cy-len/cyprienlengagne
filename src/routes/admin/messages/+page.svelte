<script lang="ts">

    import { getContext, onMount } from "svelte";
    import type { DocumentReference } from "firebase/firestore";
    import type { FirebaseManager } from "../../../firebase/firebaseManager.svelte";
    import ContactMessage from "../../../components/admin/ContactMessage.svelte";

    let firebaseManager = getContext<() => FirebaseManager | undefined>("firebaseManager")();
    
    let messagesRefs: DocumentReference[] = $state([]);

    onMount(async () => {
        if (!firebaseManager) return;

        messagesRefs = (await firebaseManager.getAllContactMessages()).docs.map((d) => d.ref);
    });

</script>

<div>
    <h2>See all messages</h2>

    <div class="editor-wrapper">
        {#each messagesRefs as message}
            <ContactMessage messageRef={message} />
        {/each}
    </div>
</div>