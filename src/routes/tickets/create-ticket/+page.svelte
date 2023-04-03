<script lang="ts">
	import { goto } from '$app/navigation';
	import SaveButton from '../../../components/SaveButton.svelte';
	import BackButton from '../../../components/BackButton.svelte';
	import Card from '../../../components/Card.svelte';
	import { createForm } from 'felte';
	import { reporter, ValidationMessage } from '@felte/reporter-svelte';
	import { validator } from '@felte/validator-yup';
	import * as yup from 'yup';
	import VIcon from '../../../components/VIcon.svelte';

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
		customerName: yup
			.string()
			.matches(/^[aA-zZ, -]+$/, 'Cannot contain alphanumerics')
			.required(),
		phoneNumber: yup
			.string()
			.matches(/^[0-9]+$/, 'Must be only digits')
			.required(),
		email: yup.string().email().required(),
		details: yup.string().required()
	});

	const { form, touched, data, isValid, errors } = createForm({
		initialValues: {
			customerName: '',
			phoneNumber: '',
			email: '',
			details: ''
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
</script>

<div>
	<BackButton click={() => goto('/tickets')} />
</div>
<Card styling="w-2/4 mx-auto align-middle" title="New Ticket">
	<svelte:fragment slot="content">
		<div class="border-b-2 pt-2" />
		<form use:form>
			<div class="md:grid grid-cols-2 gap-2 pt-4 w-full">
				<div>
					<div class="form-control relative">
						<label class="label" for="customer-name">Customer Name</label>
						<input
							id="customer-name"
							class="input input-bordered {changeFocus(
								$touched.customerName,
								$errors.customerName
							)}"
							type="text"
							name="customerName"
						/>
						<VIcon touched={$touched.customerName} errors={$errors.customerName} />
					</div>
					<ValidationMessage for="customerName" let:messages={message}>
						<span class="text-red-600 text-sm pt-1">{message || ''}</span>
					</ValidationMessage>
				</div>

				<div>
					<div class="form-control relative">
						<label for="email" class="label">Email</label>
						<input
							id="email"
							class="input input-bordered {changeFocus($touched.email, $errors.email)}"
							type="text"
							name="email"
						/>
						<VIcon touched={$touched.email} errors={$errors.email} />
					</div>
					<ValidationMessage for="email" let:messages={message}>
						<span class="text-red-600 text-sm pt-1">{message || ''}</span>
					</ValidationMessage>
				</div>

				<div>
					<div class="form-control relative">
						<label for="phone-number" class="label">Phone Number</label>
						<input
							id="phone-number"
							class="input input-bordered {changeFocus($touched.phoneNumber, $errors.phoneNumber)}"
							type="text"
							name="phoneNumber"
						/>
						<VIcon touched={$touched.phoneNumber} errors={$errors.phoneNumber} />
					</div>
					<ValidationMessage for="phoneNumber" let:messages={message}>
						<span class="text-red-600 text-sm pt-1">{message || ''}</span>
					</ValidationMessage>
				</div>

				<div>
					<div class="form-control relative">
						<label for="details" class="label">Details</label>
						<input
							id="details"
							class="input input-bordered {changeFocus($touched.details, $errors.details)}"
							type="text"
							name="details"
						/>
						<VIcon touched={$touched.details} errors={$errors.details} />
					</div>
					<ValidationMessage for="details" let:messages={message}>
						<span class="text-red-600 text-sm pt-1">{message || ''}</span>
					</ValidationMessage>
				</div>
			</div>
			<div class="grid">
				<SaveButton styling="w-2/3 mx-auto align-middle mt-4" disable={$isValid ? false : true} />
			</div>
		</form>
	</svelte:fragment>
</Card>
