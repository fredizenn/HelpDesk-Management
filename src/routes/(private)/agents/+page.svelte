<script lang="ts">
	import { goto } from '$app/navigation';
	import Card from '../../../components/ui/Card.svelte';
	import BackButton from '../../../components/controls/BackButton.svelte';
	import * as yup from 'yup';
	import SaveButton from '../../../components/controls/SaveButton.svelte';
	import { validator } from '@felte/validator-yup';
	import reporter from '@felte/reporter-tippy';
	import 'tippy.js/dist/tippy.css';
	import AddButton from '../../../components/controls/AddButton.svelte';
	import Modal from '../../../components/partials/modal.svelte';

	let showForm = false;
	let agentData: any = [
		{
			name: 'Frederick Boafo',
			phoneNumber: '0208685163',
			email: 'kofiakuffoboafo@gmail.com',
			role: 'Agent'
		},
		{
			name: 'Akosua Ntim',
			phoneNumber: '0244135163',
			email: 'aknti@gmail.com',
			role: 'Agent'
		}
	];

	const getInitials = (name: any) => {
		if (!name) return '';
		if (name === '') return '';
		const split = name.split(' ');
		if (split.length === 1) return split[0].charAt(0).toUpperCase();
		return `${split[0].charAt(0).toUpperCase()} ${split[1].charAt(0).toUpperCase()}`;
	};
</script>

<div class="flex justify-end">
	<AddButton dataTip="Create Agent" click={() => (showForm = true)} />
</div>
<ul class="mt-1 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
	{#each agentData as agent}
		<li class="col-span-1 divide-y divide-gray-200 rounded bg-white shadow">
			<div class="flex w-full items-center justify-between space-x-6 p-6">
				<div class="flex-1 truncate">
					<div class="flex items-center space-x-3">
						<h3 class="truncate text-sm font-medium text-gray-900">{agent?.name}</h3>
						<span
							class="inline-block flex-shrink-0 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800"
							>{agent?.role}</span
						>
					</div>
					<p class="mt-1 truncate text-sm text-gray-500">Phone Number: {agent?.phoneNumber}</p>
					<p class="mt-1 truncate text-sm text-gray-500">Email: {agent?.email}</p>
				</div>
				<div
					class="flex items-center justify-center bg-slate-700 rounded-full h-10 w-10 font-medium text-white"
				>
					{getInitials(agent?.name)}
				</div>
			</div>
			<div>
				<!-- <div class="-mt-px flex divide-x divide-gray-200">
		  <div class="flex w-0 flex-1">
			<a href="mailto:janecooper@example.com" class="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-4 text-sm font-semibold text-gray-900">
			  <svg class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
				<path d="M3 4a2 2 0 00-2 2v1.161l8.441 4.221a1.25 1.25 0 001.118 0L19 7.162V6a2 2 0 00-2-2H3z" />
				<path d="M19 8.839l-7.77 3.885a2.75 2.75 0 01-2.46 0L1 8.839V14a2 2 0 002 2h14a2 2 0 002-2V8.839z" />
			  </svg>
			  Email
			</a>
		  </div>
		  <div class="-ml-px flex w-0 flex-1">
			<a href="tel:+1-202-555-0170" class="relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-br-lg border border-transparent py-4 text-sm font-semibold text-gray-900">
			  <svg class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
				<path fill-rule="evenodd" d="M2 3.5A1.5 1.5 0 013.5 2h1.148a1.5 1.5 0 011.465 1.175l.716 3.223a1.5 1.5 0 01-1.052 1.767l-.933.267c-.41.117-.643.555-.48.95a11.542 11.542 0 006.254 6.254c.395.163.833-.07.95-.48l.267-.933a1.5 1.5 0 011.767-1.052l3.223.716A1.5 1.5 0 0118 15.352V16.5a1.5 1.5 0 01-1.5 1.5H15c-1.149 0-2.263-.15-3.326-.43A13.022 13.022 0 012.43 8.326 13.019 13.019 0 012 5V3.5z" clip-rule="evenodd" />
			  </svg>
			  Call
			</a>
		  </div>
		</div> -->
			</div>
		</li>
	{/each}
	<!-- More people... -->
</ul>

<Modal title="New Agent" bind:open={showForm} showIcon={false} on:close={() => (showForm = false)}>
	<form>
		<fieldset class="p-4 border border-gray-200 rounded-md">
			<legend class="bg-blue-100 px-2 text-blue-500 rounded-md tracking-2 text-sm"
				>Agent Details</legend
			>
			<div class="flex flex-col gap-4" />
		</fieldset>
		<button type="submit" class="btn btn-accent w-full my-6">SAVE</button>
	</form>
</Modal>
