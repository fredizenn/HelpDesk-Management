<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '../../components/Button.svelte';
	import BackButton from '../../components/BackButton.svelte';
	import Modal from '../../components/modal.svelte';
	import AddButton from '../../components/AddButton.svelte';
	import Icon from '@iconify/svelte';
	import officeBuildingMarkerOutline from '@iconify/icons-mdi/office-building-marker-outline';
	import groupAccess from '@iconify/icons-carbon/group-access';
	import calendarIcon from '@iconify/icons-carbon/calendar';
	import taskSettings from '@iconify/icons-carbon/task-settings';


	let showForm = false;

	let ticketData: any = [
		{
			details: 'Student ID not found: 1090784',
			priority: 'Mid',
			status: 'Open',
			departmentName: 'Academic',
			facultyName: 'IT',
			code: 'WT01',
			type: 'Issue'
		},
		{
			details: 'Fee schedule for degree IT',
			priority: 'Low',
			status: 'Open',
			departmentName: 'Administration',
			facultyName: '',
			code: 'WT02',
			type: 'Enquiry'
		}
	];

	let color = ""
	$: manageBadge = (priority: string) => {
		switch (priority) 
		{
			case "HIGH":
			 return	color = "red";
			case "MID":
			return color = "yellow";
			case "LOW":
			return color="gray";
			default: 
			return color = "gray";
		}
	}
</script>

<div class="flex justify-end">
	<AddButton dataTip="Create Ticket" click={() => (showForm = true)} />
</div>
<div class="mt-2 overflow-auto ">
	<ul class="">
		{#each ticketData as ticket}
			<li class="m-2 rounded-sm bg-white shadow">
				<a href="#" class="block hover:bg-gray-50">
					<div class="px-4 py-4 sm:px-6">
						<div class="flex items-center justify-between">
							<p class="truncate text-sm font-medium text-indigo-600">
								Ticket Code: {ticket?.code}
							</p>
							<div class="ml-2 flex flex-shrink-0">
								<p
									class={`"inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800"`}
								>
									{ticket?.status}
								</p>
								
								<p
									class={`"inline-flex rounded-full bg-${manageBadge(ticket.priority.toUpperCase())}-100 px-2 text-xs font-semibold leading-5 text-green-800"`}
								>
									{ticket?.priority}
								</p>
							</div>
							
						</div>
						<div class="mt-2 sm:flex sm:justify-between">
							<div class="sm:flex space-x-2">
								<p
									class="flex items-center text-sm text-gray-500 tooltip tooltip-top"
									data-tip="Department"
								>
									<span class="md:pr-1">
										<Icon icon={officeBuildingMarkerOutline} class="w-5 h-5" />
									</span>
									{ticket?.departmentName}
								</p>
								{#if ticket?.facultyName !== ''}
									<p
										class="flex items-center text-sm text-gray-500 sm:ml-6 sm:mt-0 tooltip tooltip-top"
										data-tip="Faculty"
									>
										<span class="md:pr-1"> <Icon icon={groupAccess} class="w-5 h-5" /> </span>
										{ticket?.facultyName}
									</p>

								{/if}
								<p
									class="flex items-center text-sm text-gray-500 tooltip tooltip-top"
									data-tip="Ticket type"
								>
									<span class="md:pr-1">
										<Icon icon={taskSettings} class="w-5 h-5" />
									</span>
									{ticket?.type}
								</p>
							</div>
							<div class="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
								<span class="pr-1"><Icon icon={calendarIcon} class="w-5 h-5" /></span>

								<p>
									Date Issued:
									<time datetime="2020-01-07">January 7, 2020</time>
								</p>
							</div>
						</div>
						<div class="mt-2 text-sm font-medium text-gray-600">
							{ticket?.details}
						</div>
					</div>
					
				</a>
			</li>
		{/each}
	</ul>
</div>

<Modal title="New Ticket" bind:open={showForm} showIcon={false} on:close={() => (showForm = false)}>
	<form>
		<fieldset class="p-4 border border-gray-200 rounded-md">
			<legend class="bg-blue-100 px-2 text-blue-500 rounded-md tracking-2 text-sm"
				>Ticket Details</legend
			>
			<div class="flex flex-col gap-4">
				<div class="form-control">
					<input class="input input-bordered" />
				</div>
				<div class="form-control">
					<input class="input input-bordered" />
				</div>
				<div class="form-control">
					<input class="input input-bordered" />
				</div>
				<div class="form-control">
					<input class="input input-bordered" />
				</div>
			</div>
		</fieldset>

		<button type="submit" class="btn btn-info w-full my-6">SAVE</button>
	</form>
</Modal>
