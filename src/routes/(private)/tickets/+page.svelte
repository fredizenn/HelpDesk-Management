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

	function closeForm () {
		showForm = false
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
			"value": 'HIGH',
			"text": 'HIGH'
		},
		{
			"value": 'MEDIUM',
			"text": 'MEDIUM'
		},
		{
			"value": 'LOW',
			"text": 'LOW'
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
		code: yup.string().required(),
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

	const axiosInstance =  axios.create({
    baseURL: 'https://localhost:7085/api', 
    headers: {
		'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
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

	$: manageStatusBadge = (ticket: any) => {
		if (ticket.isOpen) {
			return "blue"
		}
		else if (ticket.onHold) {
			return "orange"
		}
		else if (ticket.isResolved) {
			return "green"			
		}
		else {
			return "red"
		}
	}

	const changeBadge = (priority: any) => {
		if (priority === "HIGH") {
			return "red"
		}
		else if (priority === "MEDIUM") {
			return "orange"
		}
		else {
			return "gray"
		}
	}

	const { form, touched, data, isValid, errors } = createForm({
		initialValues: {
			...initTicket,
		},
		extend: [validator({ schema }), reporter],
		onSubmit: async (values) => {
			if (type === '' || type === undefined) {
				return toast.error("Please select a ticket type")
			}

			else if (priority === '' || priority === undefined) {
				return toast.error('Please select ticket priority level')
			}

			else {
				savingTicket = true;
			await axiosInstance.post('/tickets/create', {
				...values, type, departmentId, facultyId, priority
			})
			.then((response) => {
				if(response.status === 201)
				{
				console.log({response})
				toast.success("Ticket created successfully");
				closeForm();
			 	getTickets();  
				}
				else {
					console.log({response})

					toast.error(response.data.response)
				}

			})
			.catch((error) => {
				toast.error(error);
			});
			savingTicket = false;
			}

			
		}
	});

	async function resolveTicket (id: any) {
		if (!id) return;

		const result = await dialog (
			"Resolve and Close Ticket",
			"Proceed to resolve this ticket?"
		);
		if (result.isConfirmed) {
			try {
				ResponseDialog.wait("Processing request...");
				await axiosInstance.put(`/tickets/resolveTicket${id}`, {})
				.then((response) => {
					if (response.status === 200) {
					toast.success("Ticket resolved successfully")
					getTickets()
					}
					else {
						toast.error("Ticket could not be resolved")
					}
				})
				.catch((error) => {
					toast.error(error)
				});
				ResponseDialog.dismissLoading();
			}
			catch (error: any) {
				toast.error(error)
				ResponseDialog.dismissLoading();
			}
		}
		
	}

	async function cancelTicket (id: any) {
		if (!id) return;

		const result = await dialog(
			"Cancel Ticket",
			"Proceed to cancel this ticket?"
		);
		if (result.isConfirmed) {
			try {
				ResponseDialog.wait("Processing request...");
				await axiosInstance.put(`/tickets/cancelTicket${id}`, {})
				.then((response) => {
					if (response.status === 200) {
						toast.success("Ticket cancelled successfully")
						getTickets()
					} else {
						toast.error("Ticket could not be cancelled")
					}
				})
				.catch((error) => {
					toast.error(error)
				});
				ResponseDialog.dismissLoading();
			}
			catch (error: any) {
				toast.error(error);
				ResponseDialog.dismissLoading();
			}
		}
	}

	async function holdTicket (id: any) {
		if (!id) return;

		const result = await dialog(
			"Hold Ticket",
			"Proceed to put this ticket on hold?"
		);
		if (result.isConfirmed) {
			try {
				ResponseDialog.wait("Processing request...");
				await axiosInstance.put(`/tickets/holdTicket${id}`, {})
				.then((response) => {
					if (response.status === 200) {
						toast.success("Ticket paused successfully")
						getTickets()
					} else {
						toast.error("Ticket could not be paused")
					}
				})
				.catch ((error) => {
					toast.error(error)
				})
				ResponseDialog.dismissLoading();
			}
			catch (error: any) {
				toast.error(error);
			};
		}
	}

	async function reopenTicket (id: any) {
		if (!id) return;

		const result = await dialog(
			"Reopen Ticket",
			"Proceed to reopen this ticket?"
		);
		if (result.isConfirmed) {
			try {
				ResponseDialog.wait("Processing request...");
				await axiosInstance.put(`/tickets/openTicket${id}`, {})
				.then((response) => {
					if (response.status === 200) {
						toast.success("Ticket reopened successfully")
						getTickets()
					} else {
						toast.error("Ticket could not be reopened")
					}
				})
				.catch ((error) => {
					toast.error(error)
				})
				ResponseDialog.dismissLoading();
			}
			catch (error: any) {
				toast.error(error);
			};
		}
	}

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
</script>
<Toaster />

<div class="overflow-hidden">
<div class="w-full bg-white shadow rounded-lg p-4 flex justify-between items-center dark:bg-dark-card mb-2">
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
		<div><Icon icon={threeDotsLoading} class="w-14 h-14 mx-auto"/>
		</div>
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
										class={`"inline-flex rounded-full bg-${[manageStatusBadge(ticket)]}-100 px-2 text-xs font-semibold leading-5 text-green-800"`}
									>
										{ticket?.status.toUpperCase()}
									</p>

									{#if !ticket.isResolved}
									<p
										class={`inline-flex rounded-full bg-${[changeBadge(ticket.priority)]}-100 px-2 text-xs font-semibold leading-5 text-green-800`}
									>Priority:
										{ticket?.priority?.toUpperCase()}
									</p>	
									{/if}

									{#if ticket.isOpen}
									<button data-tip="Resolve and close ticket" class="tooltip tooltip-left" on:click={() => resolveTicket(ticket.id)}>
										<Icon icon={tickCircleOutline} class="w-5 h-5 text-green-700"/>
									</button>
									<button data-tip="Hold" class="tooltip tooltip-left" on:click={() => holdTicket(ticket.id)}>
										<Icon icon={outlinePauseCircleOutline} class="w-5 h-5 text-yellow-600"/>
									</button>
									<button data-tip="Cancel ticket" class="tooltip tooltip-left" on:click={() => cancelTicket(ticket.id)}>
										<Icon icon={ticketOff} class="w-5 h-5 text-red-600"/>
									</button> 
									{:else if ticket.onHold}
									<button data-tip="Reopen ticket" class="tooltip tooltip-left"on:click={() => reopenTicket(ticket.id)}>
										<Icon icon={continueIcon} class="w-5 h-5 text-green-700"/>
									</button>
									<button data-tip="Cancel ticket" class="tooltip tooltip-left" on:click={() => cancelTicket(ticket.id)}>
										<Icon icon={ticketOff} class="w-5 h-5 text-red-600"/>
									</button> 
									{/if}
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
			<div class="grid content-center mx-auto align-middle text-center uppercase">No data found</div>
			{/if}
		</ul>
	
</div>
</div>
</div>

<Modal title="New Ticket" bind:open={showForm} showIcon={false} on:close={() => (showForm = false)}>
	<form use:form>
		
			<div class="md:grid grid-cols-2 gap-2">
				<div class="form-control">
					<label for="details" class="label after:content-['*'] after:ml-0.5 after:text-red-500 block label-text">Type</label>
					<Svelecte options={ticketTypes} id="type" bind:value={type} />
				</div>
				<div class="form-control">
					<label for="priority" class="label after:content-['*'] after:ml-0.5 after:text-red-500 block label-text">Priority</label>
					<Svelecte options={ticketPriority} id="priority" bind:value={priority} />
				</div>
				<div class="form-control">
					<label for="department" class="label after:content-['*'] after:ml-0.5 after:text-red-500 block label-text">Department</label>
					<Svelecte bind:readSelection={departmentSelection} options={departments} bind:value={departmentId} id="department" />
				</div>
				<div class="form-control">
					<label for="faculty" class="label after:content-['*'] after:ml-0.5 after:text-red-500 block label-text">Faculty</label>
					<Svelecte bind:readSelection={selection} bind:value={facultyId} options={facultyData} id="faculty" />
				</div>
				<div>
					<div class="form-control relative">
						<label class="label after:content-['*'] after:ml-0.5 after:text-red-500 block label-text" for="contact-name">Contact Name</label>
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
						<label class="label after:content-['*'] after:ml-0.5 after:text-red-500 block label-text" for="contactNumber">Contact Phone Number</label>
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
						<label class="label after:content-['*'] after:ml-0.5 after:text-red-500 block label-text" for="contactEmail">Contact Email</label>
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
				<div>
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
				</div>
				
			</div>
			<div class="cols-span-2">
				<div class="form-control relative">
					<label class="label after:content-['*'] after:ml-0.5 after:text-red-500 block label-text" for="ticketDescription">Ticket Description</label>
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
			<button  disabled={true} class="btn btn-accent w-full my-6"
			>CREATING TICKET...</button>
			{/if}
		
	</form>
</Modal>
