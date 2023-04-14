<script lang="ts">
	import { goto } from "$app/navigation";
	import { loggedIn } from "../../store";
    import { Icon, ArrowLeft, ArrowRight } from "svelte-hero-icons"
    export let title: any = ''

    const logout = () => {
      localStorage.setItem('token', '')
      $loggedIn = false
      goto('/login')
    }
</script>


<div class="flex navbar justify-between p-4 w-full bg-base-100 shadow-md sticky top-0 z-20">
    <div class="flex-none lg:hidden">
        <label for="my-drawer-3" class="btn btn-square btn-ghost">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            class="inline-block w-6 h-6 stroke-current">
            <path
              d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </label>
      </div>
      <div class="font-medium uppercase">{title}</div>
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <div class="tooltip tooltip-bottom pr-1" data-tip="Logout"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-7 h-7 cursor-pointer" on:click={logout}>
        <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
      </svg>
      </div>
</div>