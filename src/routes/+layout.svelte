<script lang='ts'>
    import "../app.css";
    import Nav from "../components/Nav.svelte";
      import Sidebar from "../components/Sidebar.svelte";
    import LoginComponent from "../components/LoginComponent.svelte";
    import { store } from "../hooks/auth";
    import { page } from "$app/stores";
  
    $: pageTitle = $page.url.pathname

    const getPageTitle = (path: string) => {
      if(!path) return ''
      if(path === '') return ''
      const sliceResult = path.slice(1)
      const title = sliceResult.charAt(0).toUpperCase() + sliceResult.slice(1)
      const title2 = title.split("/")
      
      return title2[0]
    
    }

    </script>
    
  
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
    <!-- <slot></slot> -->
  
  
    
  