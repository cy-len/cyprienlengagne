<script lang="ts">
    import { getDoc, type DocumentReference } from "firebase/firestore";
    import { onMount } from "svelte";
    import Collapsible from "./utils/Collapsible.svelte";
    import FormLabel from "../utils/forms/FormLabel.svelte";

    interface Props {
        messageRef: DocumentReference;
    }

    let { messageRef }: Props = $props();

    interface EditorMessage {
        name: string;
        email: string;
        message: string;
        date: Date;
    }

    const message = $state<EditorMessage>({
        name: "",
        email: "",
        message: "",
        date: new Date()
    });

    let messageDetails: Collapsible;

    onMount(async () => {
        const snapshot = await getDoc(messageRef);
        const data = snapshot.data();
        if (!data) return;

        message.name = data.name;
        message.email = data.email;
        message.message = data.message;
        message.date = data.date.toDate();
    });

    function expandAll() {
        messageDetails.expand();
    }

    function collapseAll() {
        messageDetails.collapse();
    }

    let dateFormatted = $derived.by(() => {
        const formatter = new Intl.DateTimeFormat(undefined, {
            dateStyle: "medium",
            timeStyle: "medium"
        });

        return formatter.format(message.date);
    })

</script>


<div class="editor-container">
    <header>
        <h3>{message.name} ({ dateFormatted })</h3>

        <div class="bar">
            <button class="toolbar-button" onclick={expandAll}>Expand</button>
            <button class="toolbar-button" onclick={collapseAll}>Collapse</button>
        </div>
    </header>

    <Collapsible summaryText="Message" bind:this={messageDetails}>
        <FormLabel name="Name">
            <input type="text" bind:value={message.name} readonly />
        </FormLabel>
        <FormLabel name="Email">
            <input type="email" bind:value={message.email} readonly />
        </FormLabel>
        <FormLabel name="Message">
            <textarea bind:value={message.message} rows="10" readonly></textarea>
        </FormLabel>
    </Collapsible>
</div>