<script lang="ts">
	import { goto } from '$app/navigation';
	import Card from '../../../components/ui/Card.svelte';
	import BackButton from '../../../components/controls/BackButton.svelte';
	import { onMount } from 'svelte';
	import AddButton from '../../../components/controls/AddButton.svelte';
	import axios from 'axios';
	import toast, { Toaster } from 'svelte-french-toast';
	import Icon from '@iconify/svelte';
	import threeDotsLoading from '@iconify/icons-eos-icons/three-dots-loading';
	import Modal from '../../../components/partials/modal.svelte';
	import { createForm } from 'felte';
	import { reporter, ValidationMessage } from '@felte/reporter-svelte';
	import 'tippy.js/dist/tippy.css';
	import * as yup from 'yup';
	import { validator } from '@felte/validator-yup';
	import Svelecte from 'svelecte';
	import Loading from '../../../components/controls/loading.svelte';

	let showForm = false;
	let loading = false;
	let savingAgent: boolean; 
	let agents: any = [];
	let facultyId: any;
	let departmentId: any;	
	let departmentData: any = [];
	let departments: any = [];
	let faculties: any;
	let facultyData: any = [];

	function closeForm() {
		showForm = false;
	}
	$: token = '';

	onMount(async () => {
		token = JSON.stringify(localStorage.getItem('token'));
		getAgents();
		getFaculties();
		getDepartments();
	});

	const axiosInstance = axios.create({
		baseURL: 'https://localhost:7085/api',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`
		}
	});

	let savingUser = false;

	async function getAgents() {
		loading = true;
		await axiosInstance
			.get('/Accounts/users')
			.then((response) => {
				agents = response.data;
			})
			.catch((error) => {
				toast.error(error);
			});
		loading = false;
	}

	const getInitials = (name: any) => {
		if (!name) return '';
		if (name === '') return '';
		const split = name.split(' ');
		if (split.length === 1) return split[0].charAt(0).toUpperCase();
		return `${split[0].charAt(0).toUpperCase()} ${split[1].charAt(0).toUpperCase()}`;
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
		firstName: yup
			.string()
			.matches(/^[aA-zZ, -]+$/, 'Cannot contain alphanumerics')
			.required(),
		lastName: yup
			.string()
			.matches(/^[aA-zZ, -]+$/, 'Cannot contain alphanumerics')
			.required(),
		phoneNumber: yup.string().required(),
		email: yup.string().email().required(),
		userName: yup.string().required(),
		password: yup.string().required(), 
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

	const { form, touched, data, isValid, errors } = createForm({
		initialValues: {
			firstName: '',
			lastName: '',
			userName: '',
			password: '',
			email: '',
			phoneNumber: '',
		},
		extend: [validator({ schema }), reporter],
		onSubmit: async (values) => {
			savingAgent = true;
			await axiosInstance
				.post('/auth', {
					...values, departmentId, facultyId
				})
				.then((response) => {
					if (response.status === 201) {
						console.log({ response });
						toast.success('Agent registered successfully');
						closeForm();
						getAgents();
					} else {
						console.log({ response });

						toast.error("An error occured, try again later.");
					}
				})
				.catch((error) => {
					toast.error(error);
				});
			savingAgent = false;
		}
	});


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


	facultyData.subscribe = (values: any) => {
		let data: any = [];
		values.map((x: any) => {
			let d = [{ value: '', text: '' }];
			d = [{ value: x.Id, text: x.name }];

			return data.push(d);
		});
		faculties = data;
	};

</script>

<div class="flex justify-end">
	<AddButton dataTip="Create Agent" click={() => (showForm = true)} />
</div>
<ul class="mt-1 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
	{#if loading}
	<Loading />
	{:else if agents.length > 0}
	{#each agents as agent}
		<li class="col-span-1 divide-y divide-gray-200 rounded bg-white shadow">
			<div class="flex w-full items-center justify-between space-x-6 p-6">
				<div class="flex-1 truncate">
					<div class="flex items-center space-x-3">
						<h3 class="truncate text-sm font-medium text-gray-900">{agent.firstname + ' ' + agent.lastname}</h3>
						<span
							class="inline-block flex-shrink-0 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800"
							>{agent.facultyId ? "Agent" : 'Admin'}</span>
					</div>
					<p class="mt-1 truncate text-sm text-gray-500">Telephone: {agent.phoneNumber}</p>
					<p class="mt-1 truncate text-sm text-gray-500">Email: {agent.email}</p>
					<p class="mt-1 truncate text-sm text-gray-500">Department: {agent.departmenId ? agent.department.name : 'None'}</p>
					<p class="mt-1 truncate text-sm text-gray-500">Faculty: {agent.facultyId ? agent.faculty?.name : 'None'}</p>


				</div>
				<div
					class="flex items-center justify-center bg-slate-700 rounded-full h-10 w-10 font-medium text-white"
				>
					{getInitials(agent.firstname + ' ' + agent.lastname)}
					
				</div>
			</div>
			<div>
			</div>
		</li>
	{/each}
	{:else}
	<div class="text-center mx-auto align-middle">No Data Found</div>
	{/if}
</ul>


<Modal title="New Agent" bind:open={showForm} showIcon={false} on:close={() => (showForm = false)}>
	<form use:form>
		
		<div class="md:grid grid-cols-2 gap-2">
			<div>
				<div class="form-control relative">
					<label class="label after:content-['*'] after:ml-0.5 after:text-red-500 block label-text" for="contact-name">First Name</label>
					<input
						id="contact-name"
						class="rounded input input-bordered {changeFocus(
							$touched.firstName,
							$errors.firstName
						)}"
						type="text"
						name="firstName"
					/>
				</div>
				<ValidationMessage for="firstName" let:messages={message}>
					<span class="text-red-600 text-sm pt-1">{message || ''}</span>
				</ValidationMessage>
			</div>
			<div>
				<div class="form-control relative">
					<label class="label after:content-['*'] after:ml-0.5 after:text-red-500 block label-text" for="contact-name">Last Name</label>
					<input
						id="contact-name"
						class="rounded input input-bordered {changeFocus(
							$touched.lastName,
							$errors.lastName
						)}"
						type="text"
						name="lastName"
					/>
				</div>
				<ValidationMessage for="lastName" let:messages={message}>
					<span class="text-red-600 text-sm pt-1">{message || ''}</span>
				</ValidationMessage>
			</div>
			<div>
				<div class="form-control relative">
					<label class="label after:content-['*'] after:ml-0.5 after:text-red-500 block label-text" for="contact-name">Username</label>
					<input
						id="contact-name"
						class="rounded input input-bordered {changeFocus(
							$touched.userName,
							$errors.userName
						)}"
						type="text"
						name="userName"
					/>
				</div>
				<ValidationMessage for="userName" let:messages={message}>
					<span class="text-red-600 text-sm pt-1">{message || ''}</span>
				</ValidationMessage>
			</div>
			<div>
				<div class="form-control relative">
					<label class="label after:content-['*'] after:ml-0.5 after:text-red-500 block label-text" for="contact-name">Email</label>
					<input
						id="contact-name"
						class="rounded input input-bordered {changeFocus(
							$touched.email,
							$errors.email
						)}"
						type="text"
						name="email"
					/>
				</div>
				<ValidationMessage for="email" let:messages={message}>
					<span class="text-red-600 text-sm pt-1">{message || ''}</span>
				</ValidationMessage>
			</div>
			<div>
				<div class="form-control relative">
					<label class="label after:content-['*'] after:ml-0.5 after:text-red-500 block label-text" for="contact-name">Phone Number</label>
					<input
						id="contact-name"
						class="rounded input input-bordered {changeFocus(
							$touched.phoneNumber,
							$errors.phoneNumber
						)}"
						type="text"
						name="phoneNumber"
					/>
				</div>
				<ValidationMessage for="phoneNumber" let:messages={message}>
					<span class="text-red-600 text-sm pt-1">{message || ''}</span>
				</ValidationMessage>
			</div>
			<div>
				<div class="form-control relative">
					<label class="label after:content-['*'] after:ml-0.5 after:text-red-500 block label-text" for="contact-name">Set Password</label>
					<input
						id="contact-name"
						class="rounded input input-bordered {changeFocus(
							$touched.password,
							$errors.password
						)}"
						type="text"
						name="password"
					/>
				</div>
				<ValidationMessage for="password" let:messages={message}>
					<span class="text-red-600 text-sm pt-1">{message || ''}</span>
				</ValidationMessage>
			</div>
			<div class="form-control">
				<label for="department" class="label after:content-['*'] after:ml-0.5 after:text-red-500 block label-text">Department</label>
				<Svelecte options={departments} bind:value={departmentId} id="department" />
			</div>
			<div class="form-control">
				<label for="faculty" class="label after:content-['*'] after:ml-0.5 after:text-red-500 block label-text">Faculty</label>
				<Svelecte bind:value={facultyId} options={facultyData} id="faculty" />
			</div>
			
		</div>
		
		{#if !savingAgent}
		<button type="submit" disabled={$isValid ? false : true} class="btn btn-accent w-full my-6"
		>SAVE</button
	>
		
		{:else}
		<button  disabled={true} class="btn btn-accent w-full my-6"
		>CREATING AGENT...</button>
		{/if}
	
</form>
</Modal>
