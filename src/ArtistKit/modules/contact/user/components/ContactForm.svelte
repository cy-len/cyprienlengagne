<script lang="ts">
    import { enhance } from "$app/forms";
    import FormLabel from "../../../../core/components/forms/FormLabel.svelte";
    import FormSuccess from "../../../../core/components/forms/FormSuccess.svelte";
    import ReCaptcha from "../../../../core/components/forms/ReCaptcha.svelte";
    import LoadingSpinner from "../../../../core/components/LoadingSpinner.svelte";


    interface Props {
        okMessage?: string;
        nameFieldLabel?: string;
        emailFieldLabel?: string;
        messageFieldLabel?: string;
        sendButtonText?: string;
        requiredFieldText?: string;
        captchaMissingText?: string;
    }

    let {
        okMessage = "Your message has been sent successfully",
        nameFieldLabel = "Your name",
        emailFieldLabel = "Your email",
        messageFieldLabel = "Message",
        sendButtonText = "Send",
        requiredFieldText = "This field is required",
        captchaMissingText = "Please complete the captcha"
    }: Props = $props();

    interface FormState {
        state: "idle" | "sending" | "success";
        result?: { type: 'success'; status: number; data?: Record<string, any> }| { type: 'failure'; status: number; data?: Record<string, any> }
    }
    
    let formState = $state<FormState>({
        state: "idle"
    });

    let captcha: string = $state("");
</script>

{#if formState.state === "success"}
    <FormSuccess>{ okMessage }</FormSuccess>
{:else if formState.state === "sending"}
    <LoadingSpinner message="Sending message" />
{:else}
    <form method="POST" action="/generic/forms?/sendContactMessage" use:enhance={({ formData }) => {
        formState.state = "sending";
        formData.append("captcha", captcha);

        return async ({ update, result }) => {
            if (result.type === "success") {
                formState.state = "success";
                formState.result = result;
            } else if (result.type === "failure") {
                formState.state = "idle";
                formState.result = result;
            }

            return update();
        }
    }}>
        <FormLabel name={nameFieldLabel} error={formState.result?.data?.nameMissing ? requiredFieldText : undefined}>
            <input type="text" id="name" name="from_name" placeholder=" " />
        </FormLabel>
        <FormLabel name={emailFieldLabel} error={formState.result?.data?.emailMissing ? requiredFieldText : undefined}>
            <input type="email" id="email" name="from_email" placeholder=" " />
        </FormLabel>
        <FormLabel name={messageFieldLabel} error={formState.result?.data?.messageMissing ? requiredFieldText : undefined}>
            <textarea id="message" name="message" rows="10"></textarea>
        </FormLabel>

        <FormLabel name="" error={formState.result?.data?.messageMissing ? requiredFieldText : undefined}>
            <ReCaptcha bind:captcha />
        </FormLabel>

        <button class="cta-inverted" disabled={!captcha}>{ sendButtonText }</button>
    </form>
{/if}

<style>

    button.cta-inverted {
        cursor: pointer;
        font-size: 1.25rem;
    }

</style>