<script module lang="ts">
    declare const grecaptcha: any;
</script>
<script lang="ts">
    import { PUBLIC_RECAPTCHA_SITEKEY } from "$env/static/public";

    import { onMount } from "svelte";

    interface Props {
        captcha: string;
    }

    let { captcha = $bindable() }: Props = $props();

    let captchaDiv: HTMLDivElement;

    async function loadRecaptcha() {
        return new Promise<void>((resolve, reject) => {
            if (typeof window === "undefined") {
                reject();
                return;
            }

            if (document.getElementById("recaptcha-script")) {
                resolve();
                return; 
            }

            const script = document.createElement("script");
            script.id = "recaptcha-script";
            script.async = true;
            script.defer = true;
            script.onload = () => {
                console.log("reCAPTCHA script loaded.");
                resolve();
            };
            script.src = "https://www.google.com/recaptcha/api.js?render=explicit";
            document.head.appendChild(script);
        });
    }

    onMount(async () => {
        await loadRecaptcha();
        setTimeout(() => {
            grecaptcha.render(captchaDiv, {
                sitekey: PUBLIC_RECAPTCHA_SITEKEY, // FROM TUVENS !
                callback: (c: string) => {
                    captcha = c;
                }
            });
        }, 500);
    });

</script>

<div bind:this={captchaDiv}></div>

<style>

    div {
        margin-block: 1rem;
    }

</style>