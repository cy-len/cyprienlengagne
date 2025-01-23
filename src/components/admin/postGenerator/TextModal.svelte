<script lang="ts">
    import Modal from "../../modals/Modal.svelte";

    let modal: Modal;

    let text: string = "";

    export function show(textToShow: string) {
        modal.show();
        text = textToShow;
        console.log(text);
    }

    async function copyText() {
        await navigator.clipboard.writeText(text);
    }

</script>

<Modal bind:this={modal}>
     {#snippet leftButton()}
        <button class="soft-button" onclick={copyText}>
            <img class="icon" src="/icons/copy.svg" alt="copy" />
        </button>
     {/snippet}

    <div class="textedit" contenteditable="true" bind:textContent={text}></div>
</Modal>

<style>
    .textedit {
        background-color: white;
        white-space: pre-line;
        padding: 0.5rem;
    }
</style>