<script lang="ts">
	import { goto } from "$app/navigation";
    import Button from "../../components/Button.svelte";
    import Card from "../../components/Card.svelte";

    let columns: any[] = ["Code", "Date", "Priority", "Type", "Status"]
</script>

<div class="grid">
    <div class="justify-self-end"><Button label="Create Ticket" click={() => goto("/tickets/form")} /></div>
    <!-- <div class="mx-auto align-middle"> -->
        <div class="overflow-auto h-full mt-2">
        <table class="table w-full">
            <thead class="sticky top-0 z-10">
                <tr class="bg-gray-200">
                    <th class="bg-gray-500 text-white"></th>
                    {#each columns as column}
                    <th class="bg-gray-500 text-white">{column}</th>
                    <!-- <th class="bg-gray-600">Date</th>
                    <th>Priority</th>
                    <th>Type</th>
                    <th>Status</th> -->
                    {/each}
                </tr>
            </thead>
            <tbody>
                <tr>
                    <!-- <th></th>
                    <th></th>
                    <th>1</th>
                    <th>1</th>
                    <th>1</th>
                    <th>1</th> -->
                </tr>
            </tbody>
        </table>
    </div>
    <!-- </div> -->
</div>
