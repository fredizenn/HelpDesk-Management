<script>
    import LoginComponent from "../components/LoginComponent.svelte";
    import { goto } from "$app/navigation";
	import { onMount } from "svelte";
    import { loggedIn, token } from "../store";


    onMount( () => {
        $token = JSON.stringify(localStorage.getItem('token'))
        
        if ($token === null || $token === '') {
            goto('/')
        }
        // else {
        //     $loggedIn = true
        //     goto('/dashboard')
        // }

    })

  
</script>


<div>
    <LoginComponent />
</div>
