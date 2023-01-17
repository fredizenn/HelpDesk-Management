<script lang="ts">
    import Card from "../../components/Card.svelte";
    import Button from "../../components/Button.svelte";
	import { goto } from "$app/navigation";
	import SaveButton from "../../components/SaveButton.svelte";
	import CancelButton from "../../components/CancelButton.svelte";
	import CloseButton from "../../components/CloseButton.svelte";
    import { Icon, ArrowSmLeft } from "svelte-hero-icons";
	import BackButton from "../../components/BackButton.svelte";
</script>

<main>
    <div class="md:grid grid-cols-3 gap-2">
        <Card title="Sample">
            <svelte:fragment slot="content">
                <div class="h-1/2 w-1/2"></div>
            </svelte:fragment>
        </Card>
        <Card title="Sample"></Card>
        <Card title="Sample">
            <svelte:fragment slot="content">
                <!-- <Button label={'Tickets'} click={() => goto("/tickets")} />
                <SaveButton click={() => console.log('Working')} />
                <CancelButton click={() => console.log('Working')} />
                <CloseButton click={() => console.log('Working')}/>
                <BackButton click={()=> console.log("working")} /> -->
            </svelte:fragment>
        </Card>

    </div>

</main>