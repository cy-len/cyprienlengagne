<script lang="ts">
    import LoadingSpinner from "../../components/utils/LoadingSpinner.svelte";
    import FormLabel from "../utils/forms/FormLabel.svelte";
    import { enhance } from "$app/forms";
    import FormSuccess from "../utils/forms/FormSuccess.svelte";
    import { page } from "$app/state";

    interface Props {
        okMessage?: string;
        nameFieldLabel?: string;
        emailFieldLabel?: string;
        messageFieldLabel?: string;
        sendButtonText?: string;
        requiredFieldText?: string;
    }

    let {
        okMessage = "Your message has been sent successfully",
        nameFieldLabel = "Your name",
        emailFieldLabel = "Your email",
        messageFieldLabel = "Message",
        sendButtonText = "Send",
        requiredFieldText = "This field is required"
    }: Props = $props();
    
    let formState = $state<"idle" | "sending" | "success">("idle");
</script>

{#if formState === "success"}
    <FormSuccess>{ okMessage }</FormSuccess>
{:else if formState === "sending"}
    <LoadingSpinner message="Sending message" />
{:else}
    <form method="POST" action="/generic/forms?/sendContactMessage" use:enhance={() => {
        formState = "sending";

        return async ({ update, result }) => {
            formState = result.type == "success" ? "success" : "idle";
            return update();
        }
    }}>
        <FormLabel name={nameFieldLabel} error={page.form?.nameMissing ? requiredFieldText : undefined}>
            <input type="text" id="name" name="from_name" placeholder=" " />
        </FormLabel>
        <FormLabel name={emailFieldLabel} error={page.form?.emailMissing ? requiredFieldText : undefined}>
            <input type="email" id="email" name="from_email" placeholder=" " />
        </FormLabel>
        <FormLabel name={messageFieldLabel} error={page.form?.messageMissing ? requiredFieldText : undefined}>
            <textarea id="message" name="message" rows="10"></textarea>
        </FormLabel>

        <button class="cta-inverted">{ sendButtonText }</button>
    </form>
{/if}

<style>

    button {
        cursor: pointer;
        font-size: 1.25rem;
    }

</style>