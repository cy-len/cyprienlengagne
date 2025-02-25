<script lang="ts">
    import { getContext } from "svelte";
    import { FirebaseManager } from '../../firebase/firebaseManager.svelte';
    import LoadingSpinner from "../utils/LoadingSpinner.svelte";
    import FormLabel from "../utils/forms/FormLabel.svelte";

    let firebaseManager = getContext<() => FirebaseManager | undefined>("firebaseManager")();

    let loggingIn = $state(false);

    async function login(e: SubmitEvent) {
        e.preventDefault();
        if (!firebaseManager) return;

        loggingIn = true;

        try {
            await firebaseManager.signIn(email, password);
            email = "";
            password = "";

            loggingIn = false;
        } catch (err) {
            error = "An error has occured";
            console.log(err);
            password = "";

            loggingIn = false;
        }
    }

    let email: string = $state("");
    let password: string = $state("");
    let error: string = $state("");

</script>

<form onsubmit={login}>
    {#if loggingIn}
        <LoadingSpinner message="Logging in..." />
    {:else}
        <FormLabel name="Email">
            <input type="email" name="email" bind:value={email} />
        </FormLabel>
        <FormLabel name="Password">
            <input type="password" name="password" bind:value={password} />
        </FormLabel>

        <p class="error">{ error }</p>
        <button class="cta-inverted">Login</button>
    {/if}
</form>

<style>
    form {
        max-width: 400px;
        width: 100%;
        margin: auto;
    }

    input {
        display: block;
        font: inherit;
        width: 100%;
        margin-bottom: 1rem;
        font-size: 1.2rem;
    }
</style>