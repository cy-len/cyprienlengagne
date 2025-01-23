<script lang="ts">
    import emailjs from "@emailjs/browser";
    import LoadingSpinner from "../../components/utils/LoadingSpinner.svelte";

    interface Props {
        okMessage: string;
        errorMessage: string;
        nameFieldLabel: string;
        emailFieldLabel: string;
        messageFieldLabel: string;
        sendButtonText: string;
    }

    let {
        okMessage = "Your message has been sent successfully",
        errorMessage = "Your message has been sent successfully",
        nameFieldLabel = "Your name",
        emailFieldLabel = "Your email",
        messageFieldLabel = "Message",
        sendButtonText = "Send"
    }: Props = $props();

    

    type FormState = "NORMAL" | "SENDING" | "SUCCESS" | "ERROR";
    let formState: FormState = $state("NORMAL");

    async function submit(e: Event) {
        e.preventDefault();

        if (e.target instanceof Element) {
            const form: HTMLFormElement = e.target as HTMLFormElement;
            formState = "SENDING";

            try {
                await emailjs.sendForm("service_n1tzx9e", "template_r3ud1rl", form, "rC7axLGqAK34I4QMx");
                formState = "SUCCESS";
                form.reset();
            } catch (error) {
                formState = "ERROR";
            }
        }
    }
</script>

{#if formState === "SUCCESS"}
    <div class="success">
        <img src="/icons/ok.svg" alt="Email sent">
        <p>{ okMessage }</p>
    </div>
{:else if formState === "SENDING"}
    <LoadingSpinner message="Sending message" />
{:else}
    <form onsubmit={submit}>
        {#if formState === "ERROR"}
            <p class="error">{ errorMessage }</p>
        {/if}
        <div class="form-group">
            <label for="name">{ nameFieldLabel }</label>
            <input type="text" id="name" name="from_name" placeholder=" " />
        </div>
        <div class="form-group">
            <label for="email">{ emailFieldLabel }</label>
            <input type="email" id="email" name="from_email" placeholder=" " />
        </div>
        <div class="form-group">
            <label for="message">{ messageFieldLabel }</label>
            <textarea id="message" name="message" rows="10"></textarea>
        </div>

        <button class="cta-inverted">{ sendButtonText }</button>
    </form>
{/if}

<style>
    .form-group {
        position: relative;
        margin-bottom: 1rem;
    }

    label {
        width: max-content;
    }

    label, input, textarea {
        display: block;
    }

    input, textarea {
        margin-top: 0.1rem;
        font-size: 1.25rem;
        padding: 0.4rem;
        box-shadow: none;
        border: none;
        border-radius: 0.25rem;
    }
    
    input:focus, textarea:focus {
        box-shadow: 0 0.25rem 0.5rem 0.25rem rgba(0, 0, 0, 0.1);
        outline: none;
    }

    .error {
        color: rgb(180, 0, 0);
    }

    button {
        cursor: pointer;
        font-size: 1.25rem;
    }

    .success {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .success img {
        width: 10rem;
        height: 10rem;
    }
</style>