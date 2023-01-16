<script lang="ts">
	import { goto } from "$app/navigation";
    import { getUserDetails } from "../hooks/auth";
    import { store } from "../hooks/auth";
	import Card from "./Card.svelte";

    let username = '';
    let password = '';
    let error = '';

    async function login () {
    const user = await getUserDetails(username, password)!

        if(user) {
            $store = user
            if(error) error = ''
        } else {
            error = 'Incorrect username or password'
            console.log(error)
        }
    }

</script>

<Card title="Login" styling="mt-8 md:w-2/5 mx-auto align-middle">
    <svelte:fragment slot="content">

<form on:submit|preventDefault={login} class=""> 
        <div class="form-control">
            <label for = "username" class="label"><span class="label-text">Username</span></label>
            <input type="email" class="input input-bordered w-full" id="username" bind:value={username} />
        </div>
        <div class="form-control">
            <label for="password" class="label"><span class="label-text">Password</span></label>
            <input type="password" class="input input-bordered w-full" id="password" bind:value={password} />
        </div>
        <button type="submit" class="btn btn-primary mx-auto align-middle">Submit</button>
        <div id="error_message" class="text-red-500">
            <small>{error}</small>
        </div>
    </form>

    </svelte:fragment>
</Card>
