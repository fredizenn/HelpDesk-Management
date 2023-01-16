<script>
    import "../app.css";
    import Nav from "../components/Nav.svelte";
      import Sidebar from "../components/Sidebar.svelte";
    import LoginComponent from "../components/LoginComponent.svelte";
    import { store } from "../hooks/auth";
    import { page } from "$app/stores";
  
    </script>
    
  
    <!-- {#if $store != null}  -->
    <div class="drawer drawer-mobile h-screen w-full bg-gray-100">
      <input id="my-drawer-3" type="checkbox" class="drawer-toggle" />
      <div class="drawer-content flex flex-col">
        <Nav />
        <div class="p-8">
          <slot />
        </div>
      </div>
      <Sidebar />
    </div>
    <!-- {/if}
    <slot></slot> -->
  
  
    
  