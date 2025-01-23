<script lang="ts">
    import { getContext } from "svelte";
    import { FirebaseManager } from '../../firebase/firebaseManager.svelte';

    let firebaseManager = getContext<() => FirebaseManager | undefined>("firebaseManager")();

    async function login(e: SubmitEvent) {
        e.preventDefault();
        if (!firebaseManager) return;

        try {
            await firebaseManager.signIn(email, password);
            email = "";
            password = "";
        } catch (err) {
            error = "An error has occured";
            console.log(err);
            password = "";
        }
    }

    let email: string = $state("");
    let password: string = $state("");
    let error: string = $state("");

</script>

<form onsubmit={login}>
    <label for="email">Email</label>
    <input type="email" name="email" id="email" bind:value={email} />
    <label for="password">Password</label>
    <input type="password" name="password" id="password" bind:value={password} />
    <p class="error">{ error }</p>
    <button class="cta-inverted">Login</button>
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