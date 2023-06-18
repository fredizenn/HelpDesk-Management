<script lang="ts">
	import { onMount } from 'svelte';
	import AddButton from '../../../components/controls/AddButton.svelte';
	import axios from 'axios';
	import toast, { Toaster } from 'svelte-french-toast';
	import Icon from '@iconify/svelte';
	import threeDotsLoading from '@iconify/icons-eos-icons/three-dots-loading';
	import Modal from '../../../components/partials/modal.svelte';
	import { createForm } from 'felte';
	import { reporter, ValidationMessage } from '@felte/reporter-svelte';
	import { validator } from '@felte/validator-yup';
	import * as yup from 'yup';
	import VIcon from '../../../components/controls/VIcon.svelte';

	let showForm = false;

	function closeForm() {
		showForm = false;
	}

	let loading = false;
	let faculties: any = [];

	$: token = '';

	onMount(async () => {
		token = JSON.stringify(localStorage.getItem('token'));
		getFaculties();
	});

	const axiosInstance = axios.create({
		baseURL: 'https://localhost:7085/api',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`
		}
	});

	let savingFaculties = false;

	async function getFaculties() {
		loading = true;
		await axiosInstance
			.get('/faculties')
			.then((response) => {
				faculties = response.data;
			})
			.catch((error) => {
				toast.error(error);
			});
		loading = false;
	}

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
		name: yup
			.string()
			.matches(/^[aA-zZ, -]+$/, 'Cannot contain alphanumerics')
			.required(),
		code: yup.string().required()
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
			name: '',
			code: ''
		},
		extend: [validator({ schema }), reporter],
		onSubmit: async (values) => {
			savingFaculties = true;
			await axiosInstance
				.post('/faculties/create', {
					...values
				})
				.then((response) => {
					if (response.status === 201) {
						console.log({ response });
						toast.success('Faculty created successfully');
						closeForm();
						getFaculties();
					} else {
						console.log({ response });

						toast.error("An error occured, try again later.");
					}
				})
				.catch((error) => {
					toast.error(error);
				});
			savingFaculties = false;
		}
	});
</script>
<Toaster />
<div
	class="w-full bg-white shadow justify-between rounded-lg p-4 flex items-center dark:bg-dark-card mb-2"
>
<div class="text-sm">Full list of existing faculties</div>
	<div>
		<AddButton dataTip="Create Faculty" click={() => (showForm = true)} />
	</div>
</div>
{#if loading}
	<div><Icon icon={threeDotsLoading} class="w-14 h-14 mx-auto" /></div>
{:else if faculties.length > 0}

<div class="px-4 sm:px-6 lg:px-8">
	
	<div class=" flow-root">
	  <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
		<div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
		  <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
			<table class="min-w-full divide-y divide-gray-300">
			  <thead class="bg-gray-50">
				<tr>
				<th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">#</th>
				  <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Faculty Name</th>
				  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Faculty Code</th>
				</tr>
			  </thead>
			  <tbody class="divide-y divide-gray-200 bg-white">
				{#each faculties as faculty, index}
				<tr>
				<td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{index + 1}</td>
				  <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{faculty.name}</td>
				  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{faculty.code}</td>
				 
				</tr>
  {/each}
			  </tbody>
			</table>
		  </div>
		</div>
	  </div>
	</div>
  </div>
  {:else}
  <div class="mx-auto text-center align-middle">No data found</div>
{/if}

<Modal title="New Faculty" bind:open={showForm} showIcon={false} on:close={() => (showForm = false)}>
	<form use:form>
		<div class="md:grid grid-cols-2 gap-2">
			<div>
				<div class="form-control relative">
					<label
						class="label after:content-['*'] after:ml-0.5 after:text-red-500 block label-text"
						for="contact-name">Faculty Name</label
					>
					<input
						id="contact-name"
						class="rounded input input-bordered {changeFocus(
							$touched.name,
							$errors.name
						)}"
						type="text"
						name="name"
					/>
					<VIcon touched={$touched.name} errors={$errors.name} />
				</div>
				<ValidationMessage for="name" let:messages={message}>
					<span class="text-red-600 text-sm pt-1">{message || ''}</span>
				</ValidationMessage>
			</div>
			<div>
				<div class="form-control relative">
					<label
						class="label after:content-['*'] after:ml-0.5 after:text-red-500 block label-text"
						for="code">Faculty Code</label
					>
					<input
						id="code"
						class="rounded input input-bordered {changeFocus(
							$touched.code,
							$errors.code
						)}"
						type="text"
						name="code"
					/>
					<VIcon touched={$touched.code} errors={$errors.code} />
				</div>
				<ValidationMessage for="code" let:messages={message}>
					<span class="text-red-600 text-sm pt-1">{message || ''}</span>
				</ValidationMessage>
			</div>
		</div>

		{#if !savingFaculties}
			<button type="submit" disabled={$isValid ? false : true} class="btn btn-accent w-full my-6"
				>SAVE</button
			>
		{:else}
			<button disabled={true} class="btn btn-accent w-full my-6">CREATING FACULTY...</button>
		{/if}
	</form>
</Modal>
