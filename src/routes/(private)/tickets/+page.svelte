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
	import Svelecte from 'svelecte';
	import axios from 'axios';
	import { onMount } from 'svelte';
	import { initTicket } from './ticket-model';
	import toast, { Toaster } from 'svelte-french-toast';
	import xCircle from '@iconify/icons-bx/x-circle';
	import outlinePauseCircleOutline from '@iconify/icons-ic/outline-pause-circle-outline';
	import tickCircleOutline from '@iconify/icons-mdi/tick-circle-outline';
	import ticketOff from '@iconify/icons-tabler/ticket-off';
	import continueIcon from '@iconify/icons-carbon/continue';
	import { browser } from '$app/environment';
	import { formatDate, formatDateTime } from '../../../utils/date-formatting';
	import { dialog, ResponseDialog } from '../../../utils/toasts';

	let showForm = false;

	let showDetailForm = false;

	function closeForm() {
		showForm = false;
	}

	function closeDetailForm() {
		showDetailForm = false;
	}

	function openDetailForm () {
		showDetailForm = true
	}

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

	let ticketPriority = [
		{
			value: 'HIGH',
			text: 'HIGH'
		},
		{
			value: 'MEDIUM',
			text: 'MEDIUM'
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
	let type = '';
	let priority = '';
	let facultyId: any;
	let departmentId: any;
	let savingTicket = false;

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
		// code: yup.string().required(),
		ticketDescription: yup.string().required()
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

	let loadingTickets: boolean;

	$: token = '';

	onMount(async () => {
		token = JSON.stringify(localStorage.getItem('token'));
		getTickets();
		getDepartments();
		getFaculties();
		getTotalResolvedTickets();
		getTotalOpenTickets();
		getTotalTicketsOnHold();
		getTotalCancelledTickets();
	});

	const axiosInstance = axios.create({
		baseURL: 'https://localhost:7085/api',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`
		}
	});

	const params = { timestamp: new Date().getTime() };

	$: getTickets = async () => {
		loadingTickets = true;
		await axiosInstance
			.get('/tickets', {
				params
			})
			.then((response) => {
				ticketData = response.data;
			})
			.catch((error) => {
				console.log(error);
			});
		loadingTickets = false;
	};

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

	function getFaculties() {
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

	$: manageStatusBadge = (ticket: any) => {
		if (ticket.isOpen) {
			return 'blue';
		} else if (ticket.onHold) {
			return 'orange';
		} else if (ticket.isResolved) {
			return 'green';
		} else {
			return 'red';
		}
	};

	const changeBadge = (priority: any) => {
		if (priority === 'HIGH') {
			return 'red';
		} else if (priority === 'MEDIUM') {
			return 'orange';
		} else {
			return 'gray';
		}
	};

	//create ticket
	// Destructuring variables from the result of createForm function
	const { form, touched, data, isValid, errors } = createForm({
		// Initial form values
		initialValues: {
			...initTicket
		},
		// Extensions applied to the form (validator and reporter)
		extend: [validator({ schema }), reporter],
		// Form submission logic
		onSubmit: async (values) => {
			// Check if the ticket type is selected
			if (type === '' || type === undefined) {
				return toast.error('Please select a ticket type');
			}
			// Check if the ticket priority level is selected
			else if (priority === '' || priority === undefined) {
				return toast.error('Please select ticket priority level');
			} else {
				// Set the savingTicket flag to indicate that the ticket is being saved
				savingTicket = true;

				// Send a POST request to create a ticket
				await axiosInstance
					.post('/tickets/create', {
						...values,
						type,
						departmentId,
						facultyId,
						priority
					})
					.then((response) => {
						if (response.status === 201) {
							console.log({ response });
							toast.success('Ticket created successfully');
							closeForm();
							getTickets();
						} else {
							console.log({ response });
							toast.error('An error occurred while creating the ticket');
						}
					})
					.catch((error) => {
						toast.error(error);
					});

				// Set the savingTicket flag to indicate that the ticket saving is complete
				savingTicket = false;
			}
		}
	});

	async function resolveTicket(id: any) {
		if (!id) return;

		const result = await dialog('Resolve and Close Ticket', 'Proceed to resolve this ticket?');
		if (result.isConfirmed) {
			try {
				ResponseDialog.wait('Processing request...');
				await axiosInstance
					.put(`/tickets/resolveTicket${id}`, {})
					.then((response) => {
						if (response.status === 200) {
							toast.success('Ticket resolved successfully');
							getTickets();
						} else {
							toast.error('Ticket could not be resolved');
						}
					})
					.catch((error) => {
						toast.error(error);
					});
				ResponseDialog.dismissLoading();
			} catch (error: any) {
				toast.error(error);
				ResponseDialog.dismissLoading();
			} finally {
				getTotalResolvedTickets();
				getTotalOpenTickets();
				getTotalTicketsOnHold();
				getTotalCancelledTickets();
			}
		}
	}

	async function cancelTicket(id: any) {
		if (!id) return;

		const result = await dialog('Cancel Ticket', 'Proceed to cancel this ticket?');
		if (result.isConfirmed) {
			try {
				ResponseDialog.wait('Processing request...');
				await axiosInstance
					.put(`/tickets/cancelTicket${id}`, {})
					.then((response) => {
						if (response.status === 200) {
							toast.success('Ticket cancelled successfully');
							getTickets();
						} else {
							toast.error('Ticket could not be cancelled');
						}
					})
					.catch((error) => {
						toast.error(error);
					});
				ResponseDialog.dismissLoading();
			} catch (error: any) {
				toast.error(error);
				ResponseDialog.dismissLoading();
			} finally {
				getTotalResolvedTickets();
				getTotalOpenTickets();
				getTotalTicketsOnHold();
				getTotalCancelledTickets();
			}
		}
	}

	async function holdTicket(id: any) {
		if (!id) return;

		const result = await dialog('Hold Ticket', 'Proceed to put this ticket on hold?');
		if (result.isConfirmed) {
			try {
				ResponseDialog.wait('Processing request...');
				await axiosInstance
					.put(`/tickets/holdTicket${id}`, {})
					.then((response) => {
						if (response.status === 200) {
							toast.success('Ticket paused successfully');
							getTickets();
						} else {
							toast.error('Ticket could not be paused');
						}
					})
					.catch((error) => {
						toast.error(error);
					});
				ResponseDialog.dismissLoading();
			} catch (error: any) {
				toast.error(error);
			} finally {
				getTotalResolvedTickets();
				getTotalOpenTickets();
				getTotalTicketsOnHold();
				getTotalCancelledTickets();
			}
		}
	}

	async function reopenTicket(id: any) {
		if (!id) return;

		const result = await dialog('Reopen Ticket', 'Proceed to reopen this ticket?');
		if (result.isConfirmed) {
			try {
				ResponseDialog.wait('Processing request...');
				await axiosInstance
					.put(`/tickets/openTicket${id}`, {})
					.then((response) => {
						if (response.status === 200) {
							toast.success('Ticket reopened successfully');
							getTickets();
						} else {
							toast.error('Ticket could not be reopened');
						}
					})
					.catch((error) => {
						toast.error(error);
					});
				ResponseDialog.dismissLoading();
			} catch (error: any) {
				toast.error(error);
			} finally {
				getTotalResolvedTickets();
				getTotalOpenTickets();
				getTotalTicketsOnHold();
				getTotalCancelledTickets();
			}
		}
	}

	// Fetches the total number of open tickets
	async function getTotalOpenTickets() {
		// Set the loadingOpen flag to indicate that the request is in progress
		loadingOpen = true;

		// Send a GET request to retrieve the total open tickets
		await axiosInstance
			.get('/tickets/totalOpenTickets')
			.then((response) => {
				// Update the totalOpen variable with the response data
				totalOpen = response.data;
			})
			.catch((error) => {
				// Error occurred, handle it appropriately (not shown in the code)
			});

		// Set the loadingOpen flag to indicate that the request is complete
		loadingOpen = false;
	}

	// Fetches the total number of resolved tickets
	async function getTotalResolvedTickets() {
		// Set the loadingResolved flag to indicate that the request is in progress
		loadingResolved = true;

		// Send a GET request to retrieve the total resolved tickets
		await axiosInstance
			.get('/tickets/totalResolvedTickets')
			.then((response) => {
				// Update the totalResolved variable with the response data
				totalResolved = response.data;
			})
			.catch((error) => {
				// Error occurred, handle it appropriately (not shown in the code)
			});

		// Set the loadingResolved flag to indicate that the request is complete
		loadingResolved = false;
	}

	// Fetches the total number of tickets on hold
	async function getTotalTicketsOnHold() {
		// Set the loadingResolved flag to indicate that the request is in progress
		loadingOnHold = true;

		// Send a GET request to retrieve the total tickets on hold
		await axiosInstance
			.get('/tickets/totalTicketsOnHold')
			.then((response) => {
				// Update the totalOnHold variable with the response data
				totalOnHold = response.data;
			})
			.catch((error) => {
				// Error occurred, handle it appropriately (not shown in the code)
			});

		// Set the loadingResolved flag to indicate that the request is complete
		loadingOnHold = false;
	}

	// Fetches the total number of cancelled tickets
	async function getTotalCancelledTickets() {
		// Set the loadingCancelled flag to indicate that the request is in progress
		loadingCancelled = true;

		// Send a GET request to retrieve the total cancelled tickets
		await axiosInstance
			.get('/tickets/totalCancelledTickets')
			.then((response) => {
				// Update the totalCancelled variable with the response data
				totalCancelled = response.data;
			})
			.catch((error) => {
				// Error occurred, handle it appropriately (not shown in the code)
			});

		// Set the loadingCancelled flag to indicate that the request is complete
		loadingCancelled = false;
	}

	let currentTicket: any;
	let loadingTicket: boolean;
	async function getOneTicket(id: any) {
		loadingTicket = true
		await axiosInstance
		.get(`/tickets/${id}`, {})
		.then((response) => {
			currentTicket = response.data;
		})
		.catch(error => {

		}) 
		loadingTicket = false

		openDetailForm()
	}
</script>



<Toaster />

<div class="overflow-hidden">
	<div
		class="w-full bg-white shadow rounded-lg p-4 flex justify-between items-center dark:bg-dark-card mb-2"
	>
		<div class="flex space-x-2 divide-x-2">
			<div class="p-2 text-blue-900 font-medium">Open: {totalOpen || 0}</div>
			<div class="p-2 text-blue-900 font-medium">Resolved: {totalResolved || 0}</div>
			<div class="p-2 text-blue-900 font-medium">On Hold: {totalOnHold || 0}</div>
			<div class="p-2 text-blue-900 font-medium">Cancelled: {totalCancelled || 0}</div>
		</div>
		<div class="">
			<AddButton dataTip="Create Ticket" click={() => (showForm = true)} />
		</div>
	</div>

	<div class="overflow-auto">
		<div class="mt-">
			<ul class="">
				{#if loadingTickets}
					<div><Icon icon={threeDotsLoading} class="w-14 h-14 mx-auto" /></div>
					<!-- if number of tickets is more than zero, show this list -->
				{:else if ticketData.length > 0}
					{#each ticketData as ticket}
						<li class="m-1 rounded-sm bg-white shadow">
							<a href="#" class="block hover:bg-gray-50">
								<div class="px-4 py-4 sm:px-6">
									<div class="flex items-center justify-between">
										<p class="truncate text-sm font-medium text-indigo-600">
											Ticket Code: {ticket?.code}
										</p>
										<div class="ml-2 space-x-1 flex flex-shrink-0">
											<p
												class={`"inline-flex rounded-full bg-${[
													manageStatusBadge(ticket)
												]}-100 px-2 text-xs font-semibold leading-5 text-green-800"`}
											>
												{ticket?.status.toUpperCase()}
											</p>

											{#if !ticket.isResolved}
												<p
													class={`inline-flex rounded-full bg-${[
														changeBadge(ticket.priority)
													]}-100 px-2 text-xs font-semibold leading-5 text-green-800`}
												>
													Priority:
													{ticket?.priority?.toUpperCase()}
												</p>
											{/if}

											{#if ticket.isOpen}
												<button
													data-tip="Resolve and Close Ticket"
													class="tooltip tooltip-left"
													on:click={() => resolveTicket(ticket.id)}
												>
													<Icon icon={tickCircleOutline} class="w-5 h-5 text-green-700" />
												</button>
												<button
													data-tip="Hold"
													class="tooltip tooltip-left"
													on:click={() => holdTicket(ticket.id)}
												>
													<Icon icon={outlinePauseCircleOutline} class="w-5 h-5 text-yellow-600" />
												</button>
												<button
													data-tip="Cancel Ticket"
													class="tooltip tooltip-left"
													on:click={() => cancelTicket(ticket.id)}
												>
													<Icon icon={ticketOff} class="w-5 h-5 text-red-600" />
												</button>
											{:else if ticket.onHold}
												<button
													data-tip="Reopen Ticket"
													class="tooltip tooltip-left"
													on:click={() => reopenTicket(ticket.id)}
												>
													<Icon icon={continueIcon} class="w-5 h-5 text-green-700" />
												</button>
												<button
													data-tip="Cancel Ticket"
													class="tooltip tooltip-left"
													on:click={() => cancelTicket(ticket.id)}
												>
													<Icon icon={ticketOff} class="w-5 h-5 text-red-600" />
												</button>
											{/if}
											<button
												data-tip="View Ticket Details"
												class="tooltip tooltip-left"
												on:click={() => getOneTicket(ticket.id)}
											>
												<Icon icon="clarity:details-line" class="w-5 h-5" />
											</button>
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
												{ticket?.departmentName?.toUpperCase()}
											</p>
											{#if ticket?.facultyName !== null}
												<p
													class="flex items-center text-sm text-gray-500 sm:ml-6 sm:mt-0 tooltip tooltip-top"
													data-tip="Faculty"
												>
													<span class="pr-1"> <Icon icon={groupAccess} class="w-5 h-5" /> </span>
													{ticket?.facultyName.toUpperCase()}
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
												<time datetime="2020-01-07">{formatDate(ticket?.createdDate)}</time>
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
					<div class="grid content-center mx-auto align-middle text-center uppercase">
						No data found
					</div>
				{/if}
			</ul>
		</div>
	</div>
</div>

<Modal title="New Ticket" bind:open={showForm} showIcon={false} on:close={() => (showForm = false)}>
	<form use:form>
		<div class="md:grid grid-cols-2 gap-2">
			<div class="form-control">
				<label
					for="details"
					class="label after:content-['*'] after:ml-0.5 after:text-red-500 block label-text"
					>Type</label
				>
				<Svelecte options={ticketTypes} id="type" bind:value={type} />
			</div>
			<div class="form-control">
				<label
					for="priority"
					class="label after:content-['*'] after:ml-0.5 after:text-red-500 block label-text"
					>Priority</label
				>
				<Svelecte options={ticketPriority} id="priority" bind:value={priority} />
			</div>
			<div class="form-control">
				<label
					for="department"
					class="label after:content-['*'] after:ml-0.5 after:text-red-500 block label-text"
					>Department</label
				>
				<Svelecte
					bind:readSelection={departmentSelection}
					options={departments}
					bind:value={departmentId}
					id="department"
				/>
			</div>
			<div class="form-control">
				<label
					for="faculty"
					class="label after:content-['*'] after:ml-0.5 after:text-red-500 block label-text"
					>Faculty</label
				>
				<Svelecte
					bind:readSelection={selection}
					bind:value={facultyId}
					options={facultyData}
					id="faculty"
				
				/>
			</div>
			<div>
				<div class="form-control relative">
					<label
						class="label after:content-['*'] after:ml-0.5 after:text-red-500 block label-text"
						for="contact-name">Contact Name</label
					>
					<input
						id="contact-name"
						class="rounded input input-bordered {changeFocus(
							$touched.contactName,
							$errors.contactName
						)}"
						type="text"
						name="contactName"
					/>
				</div>
				<ValidationMessage for="contactName" let:messages={message}>
					<span class="text-red-600 text-sm pt-1">{message || ''}</span>
				</ValidationMessage>
			</div>
			<div>
				<div class="form-control relative">
					<label
						class="label after:content-['*'] after:ml-0.5 after:text-red-500 block label-text"
						for="contactNumber">Contact Phone Number</label
					>
					<input
						id="contactNumber"
						class="rounded input input-bordered {changeFocus(
							$touched.contactPhoneNumber,
							$errors.contactPhoneNumber
						)}"
						type="text"
						name="contactPhoneNumber"
					/>
				</div>
				<ValidationMessage for="contactPhoneNumber" let:messages={message}>
					<span class="text-red-600 text-sm pt-1">{message || ''}</span>
				</ValidationMessage>
			</div>
			<div>
				<div class="form-control relative">
					<label
						class="label after:content-['*'] after:ml-0.5 after:text-red-500 block label-text"
						for="contactEmail">Contact Email</label
					>
					<input
						id="contactEmail"
						class="rounded input input-bordered {changeFocus(
							$touched.contactEmail,
							$errors.contactEmail
						)}"
						type="text"
						name="contactEmail"
					/>
				</div>
				<ValidationMessage for="contactEmail" let:messages={message}>
					<span class="text-red-600 text-sm pt-1">{message || ''}</span>
				</ValidationMessage>
			</div>
			<!-- <div>
					<div class="form-control relative">
						<label class="label after:content-['*'] after:ml-0.5 after:text-red-500 block label-text" for="code">Ticket Code</label>
						<input
							id="code"
							class="rounded input input-bordered {changeFocus(
								$touched.code,
								$errors.code
							)}"
							type="text"
							name="code"
						/>
					</div>
					<ValidationMessage for="code" let:messages={message}>
						<span class="text-red-600 text-sm pt-1">{message || ''}</span>
					</ValidationMessage>
				</div> -->
		</div>
		<div class="cols-span-2">
			<div class="form-control relative">
				<label
					class="label after:content-['*'] after:ml-0.5 after:text-red-500 block label-text"
					for="ticketDescription">Ticket Description</label
				>
				<textarea
					id="ticketDescription"
					class="rounded textarea textarea-bordered {changeFocus(
						$touched.ticketDescription,
						$errors.ticketDescription
					)}"
					name="ticketDescription"
				/>
			</div>
			<ValidationMessage for="ticketDescription" let:messages={message}>
				<span class="text-red-600 text-sm pt-1">{message || ''}</span>
			</ValidationMessage>
		</div>
		{#if !savingTicket}
			<button type="submit" disabled={$isValid ? false : true} class="btn btn-accent w-full my-6"
				>SAVE</button
			>
		{:else}
			<button disabled={true} class="btn btn-accent w-full my-6">CREATING TICKET...</button>
		{/if}
	</form>
</Modal>

<Modal title="Ticket Details: {currentTicket?.code}" bind:open={showDetailForm} showIcon={false} on:close={() => (showDetailForm = false)}>
	<div class="lg:col-start-3 lg:row-end-1">
		<h2 class="sr-only">Summary</h2>
		<div class="rounded-lg bg-gray-50 shadow-sm ring-1 ring-gray-900/5">
		  <dl class="flex flex-wrap">
			<div class="flex-auto pl-6 pt-6">
			  <dt class="text-sm font-semibold leading-6 text-gray-900">Ticket Code</dt>
			  <dd class="mt-1 text-base font-semibold leading-6 text-gray-900 ">{currentTicket?.code}</dd>
			  <dt class="text-sm font-semibold leading-6 mt-2 text-gray-900">Ticket Description</dt>
			  <dd class="text-base font-semibold leading-6 text-gray-900">{currentTicket?.ticketDescription}</dd>
			</div>
			<div class="flex-none self-end px-6 ">
			  <dt class="sr-only">Status</dt>
			  <dd class="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">{currentTicket?.status}</dd>
			</div>
			<div class="mt-4 flex w-full flex-none gap-x-4 px-6">
				<dt class="flex-none">
				  <span class="sr-only">Date Issued</span>
				  <svg class="h-6 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
					<path d="M5.25 12a.75.75 0 01.75-.75h.01a.75.75 0 01.75.75v.01a.75.75 0 01-.75.75H6a.75.75 0 01-.75-.75V12zM6 13.25a.75.75 0 00-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 00.75-.75V14a.75.75 0 00-.75-.75H6zM7.25 12a.75.75 0 01.75-.75h.01a.75.75 0 01.75.75v.01a.75.75 0 01-.75.75H8a.75.75 0 01-.75-.75V12zM8 13.25a.75.75 0 00-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 00.75-.75V14a.75.75 0 00-.75-.75H8zM9.25 10a.75.75 0 01.75-.75h.01a.75.75 0 01.75.75v.01a.75.75 0 01-.75.75H10a.75.75 0 01-.75-.75V10zM10 11.25a.75.75 0 00-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 00.75-.75V12a.75.75 0 00-.75-.75H10zM9.25 14a.75.75 0 01.75-.75h.01a.75.75 0 01.75.75v.01a.75.75 0 01-.75.75H10a.75.75 0 01-.75-.75V14zM12 9.25a.75.75 0 00-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 00.75-.75V10a.75.75 0 00-.75-.75H12zM11.25 12a.75.75 0 01.75-.75h.01a.75.75 0 01.75.75v.01a.75.75 0 01-.75.75H12a.75.75 0 01-.75-.75V12zM12 13.25a.75.75 0 00-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 00.75-.75V14a.75.75 0 00-.75-.75H12zM13.25 10a.75.75 0 01.75-.75h.01a.75.75 0 01.75.75v.01a.75.75 0 01-.75.75H14a.75.75 0 01-.75-.75V10zM14 11.25a.75.75 0 00-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 00.75-.75V12a.75.75 0 00-.75-.75H14z" />
					<path fill-rule="evenodd" d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75z" clip-rule="evenodd" />
				  </svg>
				</dt>
				<dd class="text-sm leading-6 text-gray-500">
				  <time datetime="2023-01-31">{formatDate(currentTicket?.createdDate)}</time>
				</dd>
				
			  </div>
			 
			<div class="mt-6 flex w-full flex-none gap-x-4 border-t border-gray-900/5 px-6 pt-6">
			  <dt class="flex-none">
				<span class="sr-only">Client</span>
				<svg class="h-6 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
				  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-5.5-2.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zM10 12a5.99 5.99 0 00-4.793 2.39A6.483 6.483 0 0010 16.5a6.483 6.483 0 004.793-2.11A5.99 5.99 0 0010 12z" clip-rule="evenodd" />
				</svg>
			  </dt>
			  <dd class="text-sm font-medium leading-6 text-gray-900">{currentTicket?.contactName}</dd>
			</div>
			
			<div class="mt-4 flex w-full flex-none gap-x-4 px-6">
			  <dt class="flex-none">
				<span class="sr-only">Status</span>
				<svg class="h-6 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
				  <path fill-rule="evenodd" d="M2.5 4A1.5 1.5 0 001 5.5V6h18v-.5A1.5 1.5 0 0017.5 4h-15zM19 8.5H1v6A1.5 1.5 0 002.5 16h15a1.5 1.5 0 001.5-1.5v-6zM3 13.25a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5a.75.75 0 01-.75-.75zm4.75-.75a.75.75 0 000 1.5h3.5a.75.75 0 000-1.5h-3.5z" clip-rule="evenodd" />
				</svg>
			  </dt>
			  <dd class="text-sm leading-6 text-gray-500">{currentTicket?.contactPhoneNumber}</dd>
			</div>
		  </dl>
		  <div class="mt-6 border-t border-gray-900/5 px-6 py-6">
			<a href="#" class="text-sm font-semibold leading-6 text-gray-900">Customer tracking via email <span aria-hidden="true">&rarr;</span></a>
		  </div>
		</div>
	  </div>
	  
</Modal>
