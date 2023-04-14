<script lang="ts">
	import Modal from '../../../components/partials/modal.svelte';
	import AddButton from '../../../components/controls/AddButton.svelte';
	import Icon from '@iconify/svelte';
	import threeDotsLoading from '@iconify/icons-eos-icons/three-dots-loading';
	import officeBuildingMarkerOutline from '@iconify/icons-mdi/office-building-marker-outline';
	import groupAccess from '@iconify/icons-carbon/group-access';
	import calendarIcon from '@iconify/icons-carbon/calendar';
	import taskSettings from '@iconify/icons-carbon/task-settings';
	import { createForm } from 'felte';
	import { reporter, ValidationMessage } from '@felte/reporter-svelte';
	import { validator } from '@felte/validator-yup';
	import * as yup from 'yup';
	import VIcon from '../../../components/controls/VIcon.svelte';
	import Svelecte from 'svelecte';
	import axios from 'axios';
	import { onMount } from 'svelte';
	import { initTicket } from './ticket-model';
	import toast, { Toaster } from 'svelte-french-toast';

	import { browser } from '$app/environment';

	let showForm = false;

	let ticketPriority = [
		{
			value: 'HIGH',
			text: 'HIGH'
		},
		{
			value: 'MID',
			text: 'MID'
		},
		{
			value: 'LOW',
			text: 'LOW'
		}
	];

	let ticketTypes = [
		{
			value: 'SERVICE REQUEST',
			text: 'SERVICE REQUEST'
		},
		{
			value: 'CHANGE REQUEST',
			text: 'CHANGE REQUEST'
		},
		{
			value: 'INCIDENT',
			text: 'INCIDENT'
		},
		{
			value: 'PROBLEM',
			text: 'PROBLEM'
		}
	];

	let ticketData: any = [];

	let departmentData: any = [];
	let departments: any = [];
	let facultyData: any = [];
	let selectedType: any = '';
	let selectedPriority: any = '';
	let selectedFaculty: any =  '';
	let selectedDepartment: any = '';



	$: manageBadge = (priority: any) => {
		priority.toUpperCase();
		if (priority === 'HIGH') {
			return 'red'
		} else if (priority === 'MID') {
			return 'yellow'
		} else {
			return 'gray';
		}
	};

	yup.setLocale({
		mixed: {
			default: 'Not valid',
			required: 'Must not be empty'
		},
		string: {
			email: 'Must be a valid email',
			min: 'Must not be empty'
		}
	});

	const schema = yup.object().shape({
		contactName: yup
			.string()
			.matches(/^[aA-zZ, -]+$/, 'Cannot contain alphanumerics')
			.required(),
		contactPhoneNumber: yup
			.string()
			.matches(/^[0-9]+$/, 'Must be only digits')
			.required(),
		contactEmail: yup.string().email().required(),
		ticketDescription: yup.string().required()
	});

	const { form, touched, data, isValid, errors } = createForm({
		initialValues: {
			...initTicket,
			type: selectedType,
			priority: selectedPriority,
			facultyId: selectedFaculty,
			departmentId: selectedDepartment
		},
		extend: [validator({ schema }), reporter]
	});

	$: changeFocus = (touch: any, error: any) => {
		let focusClass = `border-green-600`;
		if (touch === true && error === null) {
			return focusClass;
		} else if (touch === false && error === null) {
			return;
		} else {
			return (focusClass = `border-red-600`);
		}
	};

	$: console.log($data)
	let loading: boolean;

	let token: any = '';
	

	onMount(async () => {
		token = JSON.stringify(localStorage.getItem('token'));
		getTickets();
		getDepartments();
		getFaculties();	
	});

	const axiosInstance =  axios.create({
    baseURL: 'https://localhost:7085/api',
    headers: {
        'Authorization': `Bearer ${token}`
    }
});

console.log({axiosInstance})

	function getTickets() {
		loading = true;
		console.log(loading);
		axiosInstance
			.get('/tickets')
			.then((response) => {
				ticketData = response.data;
			})
			.catch((error) => {
				console.log(error);
			});
		loading = false;
	}

	function getDepartments() {
		axiosInstance
			.get('/departments')
			.then((response) => {
				departments = response.data;
			})
			.catch((error) => {
				console.log(error);
			});
	}

	function getFaculties () {
		axiosInstance
			.get('/faculties')
			.then((response) => {
				facultyData = response.data;
			})
			.catch((error) => {
				console.log(error);
			});
	}

	departmentData.subscribe = (values: any) => {
		let data: any = [];
		values.map((x: any) => {
			let d = { value: '', text: '' };
			d = { value: x.Id, text: x.name };

			return data.push(d);
		});
		departments = data;
	};

	let faculties: any;

	facultyData.subscribe = (values: any) => {
		let data: any = [];
		values.map((x: any) => {
			let d = [{ value: '', text: '' }];
			d = [{ value: x.Id, text: x.name }];

			return data.push(d);
		});
		faculties = data;
	};

	let selection: any = null;
	let departmentSelection: any = null;
	let value: any = null;
</script>
<Toaster />


<div class="flex justify-end">
	<AddButton dataTip="Create Ticket" click={() => (showForm = true)} />
</div>
<div class="mt-2 overflow-auto">
	
		<ul class="">
		{#if loading}
		<div><Icon icon={threeDotsLoading} class="w-14 h-14 mx-auto"/>
		</div>
		{:else}
			{#if ticketData.length > 0}
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
										class={`"inline-flex rounded-full bg-${manageBadge(
											ticket.priority.toUpperCase()
										)}-100 px-2 text-xs font-semibold leading-5 text-green-800"`}
									>
										{ticket?.priority}
									</p>
								</div>
							</div>
							<div class="mt-2 sm:flex sm:justify-between">
								<div class="sm:flex space-y-2 md:space-y-0 md:space-x-2">
									<p
										class="flex items-center text-sm text-gray-500 tooltip tooltip-top"
										data-tip="Department"
									>
										<span class="pr-1">
											<Icon icon={officeBuildingMarkerOutline} class="w-5 h-5" />
										</span>
										{ticket?.departmentName}
									</p>
									{#if ticket?.facultyName !== null}
										<p
											class="flex items-center text-sm text-gray-500 sm:ml-6 sm:mt-0 tooltip tooltip-top"
											data-tip="Faculty"
										>
											<span class="pr-1"> <Icon icon={groupAccess} class="w-5 h-5" /> </span>
											{ticket?.facultyName}
										</p>
									{/if}
									<p
										class="flex items-center text-sm text-gray-500 tooltip tooltip-top"
										data-tip="Ticket type"
									>
										<span class="pr-1">
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
								{ticket?.ticketDescription}
							</div>
						</div>
					</a>
				</li>
			{/each}
			{:else}
			<div class="grid content-center mx-auto align-middle text-center uppercase">No data found</div>
			{/if}
			{/if}
		</ul>
	
</div>

<Modal title="New Ticket" bind:open={showForm} showIcon={false} on:close={() => (showForm = false)}>
	<form use:form>
		
			<div class="md:grid grid-cols-2 gap-2">
				<div class="form-control">
					<label for="details" class="label label-text">Type</label>
					<Svelecte options={ticketTypes} id="type" bind:value={selectedType} />
				</div>
				<div class="form-control">
					<label for="priority" class="label label-text">Priority</label>
					<Svelecte options={ticketPriority} id="priority" bind:value={selectedPriority} />
				</div>
				<div class="form-control">
					<label for="department" class="label label-text">Department</label>
					<Svelecte bind:readSelection={departmentSelection} options={departments} id="department" />
				</div>
				<div class="form-control">
					<label for="faculty" class="label label-text">Faculty</label>
					<Svelecte bind:readSelection={selection} bind:value={selectedFaculty} options={facultyData} id="faculty" />
				</div>
				<div>
					<div class="form-control relative">
						<label class="label label-text" for="contact-name">Contact Name</label>
						<input
							id="contact-name"
							class="rounded input input-bordered {changeFocus(
								$touched.contactName,
								$errors.contactName
							)}"
							type="text"
							name="contactName"
						/>
						<VIcon touched={$touched.contactName} errors={$errors.contactName} />
					</div>
					<ValidationMessage for="contactName" let:messages={message}>
						<span class="text-red-600 text-sm pt-1">{message || ''}</span>
					</ValidationMessage>
				</div>
				<div>
					<div class="form-control relative">
						<label class="label label-text" for="contactNumber">Contact Phone Number</label>
						<input
							id="contactNumber"
							class="rounded input input-bordered {changeFocus(
								$touched.contactPhoneNumber,
								$errors.contactPhoneNumber
							)}"
							type="text"
							name="contactPhoneNumber"
						/>
						<VIcon touched={$touched.contactPhoneNumber} errors={$errors.contactPhoneNumber} />
					</div>
					<ValidationMessage for="contactPhoneNumber" let:messages={message}>
						<span class="text-red-600 text-sm pt-1">{message || ''}</span>
					</ValidationMessage>
				</div>
				<div>
					<div class="form-control relative">
						<label class="label label-text" for="contactEmail">Contact Email</label>
						<input
							id="contactEmail"
							class="rounded input input-bordered {changeFocus(
								$touched.contactEmail,
								$errors.contactEmail
							)}"
							type="text"
							name="contactEmail"
						/>
						<VIcon touched={$touched.contactEmail} errors={$errors.contactEmail} />
					</div>
					<ValidationMessage for="contactEmail" let:messages={message}>
						<span class="text-red-600 text-sm pt-1">{message || ''}</span>
					</ValidationMessage>
				</div>
				<div>
					<div class="form-control relative">
						<label class="label label-text" for="ticketDetails">Ticket Details</label>
						<input
							id="ticketDetails"
							class="rounded input input-bordered {changeFocus(
								$touched.ticketDetails,
								$errors.ticketDetails
							)}"
							type="text"
							name="ticketDetails"
						/>
						<VIcon touched={$touched.ticketDetails} errors={$errors.ticketDetails} />
					</div>
					<ValidationMessage for="ticketDetails" let:messages={message}>
						<span class="text-red-600 text-sm pt-1">{message || ''}</span>
					</ValidationMessage>
				</div>
			</div>

		<button type="submit" disabled={$isValid ? false : true} class="btn btn-info w-full my-6"
			>SAVE</button
		>
	</form>
	<div>{JSON.stringify(selection, departmentSelection)}</div>
</Modal>
