<script lang="ts">
    import Card from "../../../components/ui/Card.svelte";
    import { Icon, CheckCircle, DotsCircleHorizontal, Pause, MinusCircle } from "svelte-hero-icons";
	import LineChart from "../../../components/charts/LineChart.svelte";
	import PieChart from "../../../components/charts/PieChart.svelte";
    import toast, { Toaster } from 'svelte-french-toast';
	import { onMount } from "svelte";

</script>
<Toaster />
<main>
    <div class="md:grid text-center grid-cols-3 gap-2">
        <Card title="Open" labelIcon={DotsCircleHorizontal} labelColor="text-sky-700">
            <svelte:fragment slot="content">
                <div class="text-4xl font-semibold p-4">20</div>
                <div class="text-gray-400">Tickets to be resolved</div>
            </svelte:fragment>
        </Card>
        <Card title="Pending" labelIcon={Pause} styling="mt-2 lg:mt-0" labelColor="text-yellow-600"> 
            <svelte:fragment slot="content">
                <div class="text-4xl font-semibold p-4">10</div>
                <div class="text-gray-400">Tickets awaiting customer's response</div>
            </svelte:fragment>

        </Card>
        <Card title="Closed" labelIcon={MinusCircle} styling="mt-2 lg:mt-0" labelColor="text-red-600">
            <svelte:fragment slot="content">
                <div class="text-4xl font-semibold p-4">12</div>
                <div class="text-gray-400">Closed tickets</div>
            </svelte:fragment>
        </Card>

    </div>
    <div class="md:grid text-center grid-cols-2 mt-2 lg:mt-4 gap-2">
        <Card title="Resolved" labelIcon={CheckCircle} labelColor="text-green-700">
            <svelte:fragment slot="content">
                <div class="text-5xl font-semibold p-4">22</div>
                <div class="text-gray-400">Tickets resolved successfully</div>

            </svelte:fragment>
        </Card>
        <Card title="High Priority" styling="mt-2 lg:mt-0" labelColor="text-sky-700">
            <svelte:fragment slot="content">
                <div class="text-5xl font-semibold p-4">9</div>
                <div class="text-gray-400">Tickets for immediate attention</div>

            </svelte:fragment>
        </Card>
    </div>
    <div class="md:grid text-center grid-cols-2 mt-2 lg:mt-4 gap-2">
        <Card title="" labelColor="text-sky-700">
            <svelte:fragment slot="content">
                <div class="">Summary Data</div>
                <LineChart />
            </svelte:fragment>
        </Card>
        <Card title="" labelColor="text-sky-700" styling="mt-2 lg:mt-0">
            <svelte:fragment slot="content">
                <div class="">Summary Data</div>
                <PieChart />
            </svelte:fragment>
        </Card>
    </div>

</main>