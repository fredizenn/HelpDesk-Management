<script lang='ts'>
    export let name: any
    export let icon: any
    export let to: any

    import { Icon } from "svelte-hero-icons";
    import { page } from "$app/stores";

   const getLink = (path: any) => {
    if(!path) return ''
    if(path === '') return ''
    const split = path.split("/")
    const pageLink = "/" + split[1]
    
    return pageLink
   }

   $: link = $page.url.pathname

   $: toCompare = () => {
    const split = link.split("/")

    return "/" + split[1]
   }

</script>

<a href={to} class="flex items-center p-4 text-base font-normal text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-300" class:active={toCompare() === getLink(to)}>
    <Icon aria-hidden="true" src={icon} class="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-500" />
    <span class="ml-3 font-medium">{name}</span>
 </a>

 <style>
    a.active {
        background-color: rgb(235, 235, 235)
    }
 </style>