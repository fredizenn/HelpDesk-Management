<script lang="ts">
    import Card from "../../../components/ui/Card.svelte";
    import { CheckCircle, DotsCircleHorizontal, Pause, MinusCircle } from "svelte-hero-icons";
    import Icon from '@iconify/svelte';
	import LineChart from "../../../components/charts/LineChart.svelte";
	import PieChart from "../../../components/charts/PieChart.svelte";
    import toast, { Toaster } from 'svelte-french-toast';
	import { onMount } from "svelte";
    import axios from 'axios';


    $: token = '';

    let loadingResolved: boolean;
    let loadingOnHold: boolean;
    let loadingCancelled: boolean;
    let loadingOpen: boolean;
    let loadingHighPriority: boolean;

    let totalResolved: any;
    let totalOpen: any;
    let totalCancelled: any;
    let totalHighPriority: any;
    let totalOnHold: any;


	onMount(async () => {
		token = JSON.stringify(localStorage.getItem('token'));

        getTotalResolvedTickets();
        getTotalOpenTickets();
        getTotalTicketsOnHold();
        getTotalCancelledTickets();
        getPriorityTickets();
	});

	const axiosInstance = axios.create({
		baseURL: 'https://localhost:7085/api',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`
		}
	});

    async function getTotalResolvedTickets () {
        loadingResolved = true;
        await axiosInstance
            .get('/tickets/totalResolvedTickets')
            .then((response) => {
                totalResolved = response.data;
            })
            .catch((error) => {})
        loadingResolved = false;
    }

    async function getTotalOpenTickets () {
        loadingOpen = true;
        await axiosInstance
            .get('/tickets/totalOpenTickets')
            .then((response) => {
                totalOpen = response.data;
            })
            .catch((error) => {})
        loadingOpen = false;
    }

    async function getTotalTicketsOnHold () {
        loadingResolved = true;
        await axiosInstance
            .get('/tickets/totalTicketsOnHold')
            .then((response) => {
                totalOnHold = response.data;
            })
            .catch((error) => {})
        loadingResolved = false;
    }
    async function getTotalCancelledTickets () {
        loadingCancelled = true;
        await axiosInstance
            .get('/tickets/totalCancelledTickets')
            .then((response) => {
                totalCancelled = response.data;
            })
            .catch((error) => {})
        loadingCancelled = false;
    }

    async function getPriorityTickets () {
        loadingHighPriority = true;
        await axiosInstance
            .get('/tickets/totalPriorityTickets')
            .then((response) => {
                totalHighPriority = response.data;
            })
            .catch((error) => {})
        loadingHighPriority = false;
    }

</script>
<Toaster />
<main>
    <div class="md:grid text-center grid-cols-3 gap-2">
        <Card title="Open" labelIcon={DotsCircleHorizontal} labelColor="text-sky-700">
            <svelte:fragment slot="content">
                {#if loadingOpen}
                <Icon icon="line-md:loading-twotone-loop" class="w-7 h-7 mx-auto align-middle" />
                {:else}
                <div class="text-4xl font-semibold p-4">{totalOpen || 0}</div>
                {/if}
                <div class="text-gray-400">Tickets to be resolved</div>
            </svelte:fragment>
        </Card>
        <Card title="On Hold" labelIcon={Pause} styling="mt-2 lg:mt-0" labelColor="text-yellow-600"> 
            <svelte:fragment slot="content">
                {#if loadingOnHold}
                <Icon icon="line-md:loading-twotone-loop" class="w-7 h-7 mx-auto align-middle" />
                {:else}
                <div class="text-4xl font-semibold p-4">{totalOnHold || 0}</div>
                {/if}
                <div class="text-gray-400">Tickets paused</div>
            </svelte:fragment>

        </Card>
        <Card title="Cancelled" labelIcon={MinusCircle} styling="mt-2 lg:mt-0" labelColor="text-red-600">
            <svelte:fragment slot="content">
                {#if loadingCancelled}
                <Icon icon="line-md:loading-twotone-loop" class="w-7 h-7 mx-auto align-middle" />
                {:else}
                <div class="text-4xl font-semibold p-4">{totalCancelled || 0}</div>
                {/if}
                <div class="text-gray-400">Cancelled tickets</div>
            </svelte:fragment>
        </Card>

    </div>
    <div class="md:grid text-center grid-cols-2 mt-2 lg:mt-4 gap-2">
        <Card title="Resolved" labelIcon={CheckCircle} labelColor="text-green-700">
            <svelte:fragment slot="content">
                {#if loadingResolved}
                <Icon icon="line-md:loading-twotone-loop" class="w-7 h-7 mx-auto align-middle" />
                {:else}
                <div class="text-4xl font-semibold p-4">{totalResolved || 0}</div>
                {/if}
                <div class="text-gray-400">Tickets resolved successfully</div>

            </svelte:fragment>
        </Card>
        <Card title="High Priority" styling="mt-2 lg:mt-0" labelColor="text-sky-700">
            <svelte:fragment slot="content">
                {#if loadingHighPriority}
                <Icon icon="line-md:loading-twotone-loop" class="w-7 h-7 mx-auto align-middle" />
                {:else}
                <div class="text-4xl font-semibold p-4">{totalHighPriority || 0}</div>
                {/if}
                <div class="text-gray-400">Tickets for immediate attention</div>

            </svelte:fragment>
        </Card>
    </div>
    <div class="text-center mt-2 lg:mt-4 gap-2">
        <!-- <Card title="" labelColor="text-sky-700">
            <svelte:fragment slot="content">
                <div class="">Summary Data</div>
                <LineChart />
            </svelte:fragment>
        </Card> -->
        <Card title="" labelColor="text-sky-700" styling="mt-2 lg:mt-0">
            <svelte:fragment slot="content">
                <div class="">Summary Data</div>
                <div class="mx-auto align-middle">
                    {#if loadingOpen}
                    <Icon icon="line-md:loading-twotone-loop" class="w-7 h-7 mx-auto align-middle" />
                {:else}
                    <PieChart totalOpen={totalOpen} totalCancelled={totalCancelled} totalOnHold={totalOnHold} totalResolved={totalResolved} />
                {/if}
                </div>
            </svelte:fragment>
        </Card>
    </div>

</main>