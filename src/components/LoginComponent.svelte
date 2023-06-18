<script lang="ts">
	import { goto } from "$app/navigation";
	import Card from "./ui/Card.svelte";
    import { createForm } from 'felte';
	import { reporter, ValidationMessage } from '@felte/reporter-svelte';
	import { validator } from '@felte/validator-yup';
	import * as yup from 'yup';
	import VIcon from './controls/VIcon.svelte';
    import axios from 'axios';
    import toast, { Toaster } from 'svelte-french-toast';
    import { loggedIn, token } from "../store";
    import logoText from '../assets/wiuc-text.png'


    let username = '';
    let password = '';
    let error = '';
    let loading: boolean;

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
            loading = true
            try {
                const response = await axios.post("https://localhost:7085/api/auth/login", {
                ...values
            },
            { withCredentials: false});

            if (response.status === 200) {
            
                toast.dismiss();
                toast.success(response.data?.message)
                localStorage.setItem('token', response.data?.token)
                $token = JSON.stringify(localStorage.getItem('token'))
                $loggedIn = true
                goto("/dashboard")
                console.log($loggedIn)
                console.log("done", response.data)

            }
            else {
                toast.error('An error occurred');
            }
            }
            catch (error: any) {
                toast.error(error)
            }
            loading = false
            
        }
    })


</script>

<Toaster />
<div class="mx-auto align-middle"><img src={logoText} class="mt-10 mx-auto align-middle" alt="logo" /></div>
<Card title="HelpDesk Login" titleStyle="" styling="md:mt-10 md:w-2/6 mx-auto align-middle bg-gray-200">
    <svelte:fragment slot="content">
<form use:form class=""> 
        <div class="form-control">
            <label for = "userName" class="label label-text"><span class="label-text ">Username</span></label>
            <input type="text" name="userName" class="input input-bordered w-full" id="username" />
        </div>
        <div class="form-control">
            <label for="password" class="label label-text"><span class="label-text">Password</span></label>
            <input type="password" name="password" class="input input-bordered w-full" id="password"  />
        </div>
        <div class="grid content-center">
            <!-- <SaveButton styling="" disable={false} /> -->
            {#if loading}
            <button class="btn rounded-md border-2 w-1/2 mt-4 mx-auto align middle" disabled={true}>LOGGING IN...</button>
            {:else}
            <button class="btn btn-info rounded-md border-2 w-1/2 mt-4 mx-auto align middle" disabled={false} type="submit">LOGIN</button>
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