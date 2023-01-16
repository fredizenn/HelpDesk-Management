<script lang='ts'>
    export let name: any
    export let icon: any
    export let to: any

    import { Icon } from "svelte-hero-icons";
    import { page } from "$app/stores";

</script>

<a href={to} class="flex items-center p-4 text-base font-normal text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-300" class:active={$page.url.pathname === to}>
    <Icon aria-hidden="true" src={icon} class="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-500" />
    <span class="ml-3">{name}</span>
 </a>

 <style>
    a.active {
        background-color: rgb(235, 235, 235)
    }
 </style>