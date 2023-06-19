<script lang="ts">
	import { goto } from '$app/navigation';
	import Card from './ui/Card.svelte';
	import { createForm } from 'felte';
	import { reporter, ValidationMessage } from '@felte/reporter-svelte';
	import { validator } from '@felte/validator-yup';
	import * as yup from 'yup';
	import VIcon from './controls/VIcon.svelte';
	import axios from 'axios';
	import toast, { Toaster } from 'svelte-french-toast';
	import { loggedIn, token } from '../store';
	import logoText from '../assets/wiuc-text.png';

	let username = '';
	let password = '';
	let error = '';
	let loading: boolean;

	// Set the locale for Yup validation messages
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

	// Define the validation schema using Yup
	const schema = yup.object().shape({
		userName: yup.string().required(),
		password: yup.string().required()
	});

	// Destructuring variables from the result of createForm function
	const { form, touched, isValid } = createForm({
		// Initial form values
		initialValues: {
			userName: '',
			password: ''
		},
		// Extensions applied to the form (validator and reporter)
		extend: [validator({ schema }), reporter()],
		// Form submission logic
		onSubmit: async (values) => {
			// Set loading flag to indicate that form submission is in progress
			loading = true;

			try {
				// Send a POST request to the authentication endpoint with the form values
				const response = await axios.post(
					'https://localhost:7085/api/auth/login',
					{
						...values
					},
					{ withCredentials: false }
				);

				if (response.status === 200) {
					// Clear any existing toasts
					toast.dismiss();
					// Display a success toast with the response message
					toast.success(response.data?.message);
					// Store the received token in localStorage
					localStorage.setItem('token', response.data?.token);
					// Get the stored token
					$token = JSON.stringify(localStorage.getItem('token'));
					// Set the logged in flag to true
					$loggedIn = true;
					// Navigate to the "/dashboard" route
					goto('/dashboard');
					console.log($loggedIn);
					console.log('done', response.data);
				} else {
					// Display an error toast if the response status is not 200
					toast.error('An error occurred');
				}
			} catch (error: any) {
				// Catch any errors and display an error toast
				toast.error(error);
			}

			// Set loading flag to indicate that form submission is complete
			loading = false;
		}
	});
</script>

<Toaster />
<div class="mx-auto align-middle">
	<img src={logoText} class="mt-10 mx-auto align-middle" alt="logo" />
</div>
<Card
	title="HelpDesk Login"
	titleStyle=""
	styling="md:mt-10 md:w-2/6 mx-auto align-middle bg-gray-200"
>
	<svelte:fragment slot="content">
		<form use:form class="">
			<div class="form-control">
				<label for="userName" class="label label-text"
					><span class="label-text">Username</span></label
				>
				<input type="text" name="userName" class="input input-bordered w-full" id="username" />
			</div>
			<div class="form-control">
				<label for="password" class="label label-text"
					><span class="label-text">Password</span></label
				>
				<input type="password" name="password" class="input input-bordered w-full" id="password" />
			</div>
			<div class="grid content-center">
				<!-- <SaveButton styling="" disable={false} /> -->
				{#if loading}
					<button class="btn rounded-md border-2 w-1/2 mt-4 mx-auto align middle" disabled={true}
						>LOGGING IN...</button
					>
				{:else}
					<button
						class="btn btn-info rounded-md border-2 w-1/2 mt-4 mx-auto align middle"
						disabled={false}
						type="submit">LOGIN</button
					>
				{/if}
			</div>
			<!-- <button type="submit" class="btn btn-primary mx-auto align-middle">Submit</button> -->
			<div id="error_message" class="text-red-500">
				<small>{error}</small>
			</div>
		</form>
	</svelte:fragment>
</Card>

<!-- 
<ToastContainer let:data={data}>
    <FlatToast {data}  />
</ToastContainer> -->
