<script lang='ts'>
    import "../app.css";
    import Nav from "../components/ui/Nav.svelte";
    import Sidebar from "../components/ui/Sidebar.svelte";
    import LoginComponent from "../components/LoginComponent.svelte";
    import { page } from "$app/stores";
    import { loggedIn, token } from "../store";
	import { onMount } from "svelte";
	import { goto } from "$app/navigation";
  
    $: pageTitle = $page.url.pathname
    const getPageTitle = (path: string) => {
      if(!path) return ''
      if(path === '') return ''
      const sliceResult = path.slice(1)
      const title = sliceResult.charAt(0).toUpperCase() + sliceResult.slice(1)
      const title2 = title.split("/")
      
      return title2[0]
    
    }

    onMount( () => {
        $token = JSON.stringify(localStorage.getItem('token'))
        
        if ($token !== null || $token !== '') {
          $loggedIn = true
        }
        // else {
        //     $loggedIn = true
        //     goto('/dashboard')
        // }

    })

 

    </script>
    

    {#if $loggedIn === false}
    <slot />

   
    {:else}
    <div class="drawer drawer-mobile h-screen w-full bg-gray-100">
      <input id="my-drawer-3" type="checkbox" class="drawer-toggle" />
      <div class="drawer-content flex flex-col">
        <Nav title={getPageTitle(pageTitle)} />
        <div class="p-8 h-full">
          <slot />
        </div>
      </div>
      <Sidebar />
    </div>
    {/if}

     
    <!-- <slot></slot> -->
  
  
    
  