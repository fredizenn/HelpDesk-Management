<script lang="ts">
	import { goto } from "$app/navigation";
	import Card from "./ui/Card.svelte";
    import { createForm } from 'felte';
	import { reporter, ValidationMessage } from '@felte/reporter-svelte';
	import { validator } from '@felte/validator-yup';
	import * as yup from 'yup';
	import VIcon from './controls/VIcon.svelte';
    import axios from 'axios';
	import { toasts, ToastContainer, FlatToast } from 'svelte-toasts';
    import { loggedIn, token } from "../store";

    const showSuccessToast = (
		description: any = 'Logged in successfully'
	) => {
		toasts.add({
			title: 'Success',
			description: description,
			duration: 3000,
			placement: 'top-right',
			type: 'success',
			theme: 'dark',
			showProgress: true
		});
	};

    const showErrorToast = (
		title: any = 'Error',
		description: any = ''
	) => {
		toasts.add({
			title: title,
			description: description,
			duration: 3000,
			placement: 'top-right',
			type: 'error',
			theme: 'dark',
			showProgress: true
		});
	};

    let username = '';
    let password = '';
    let error = '';

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
        userName: yup.string().required(),
        password: yup.string().required()
    })


    const { form, touched, isValid } = createForm({
        initialValues: {
            userName: '',
            password: ''
        },

        extend: [validator({ schema }), reporter()],   
        
        onSubmit: async (values) => {
            const response = await axios.post("https://localhost:7085/api/auth/login", {
                ...values
            },
            { withCredentials: false});

            if (response.status === 200) {
            
                showSuccessToast(response.data?.message)
                localStorage.setItem('token', response.data?.token)
                $token = JSON.stringify(localStorage.getItem('token'))
                $loggedIn = true
                goto("/dashboard")
                console.log($loggedIn)
                console.log("done", response.data)

            }
            else {
                showErrorToast();
            }
        }
    })
</script>


<Card title="Login" titleStyle="text-white" styling="md:mt-28 md:w-2/6 mx-auto align-middle bg-slate-800">
    <svelte:fragment slot="content">
<form use:form class=""> 
        <div class="form-control">
            <label for = "userName" class="label label-text"><span class="label-text text-white">Username</span></label>
            <input type="text" name="userName" class="input input-bordered w-full" id="username" />
        </div>
        <div class="form-control">
            <label for="password" class="label label-text"><span class="label-text text-white">Password</span></label>
            <input type="password" name="password" class="input input-bordered w-full" id="password"  />
        </div>
        <div class="grid content-center">
            <!-- <SaveButton styling="" disable={false} /> -->
            <button class="btn btn-info rounded-md border-2 w-1/2 mt-4 mx-auto align middle" disabled={false} type="submit">LOGIN</button>


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