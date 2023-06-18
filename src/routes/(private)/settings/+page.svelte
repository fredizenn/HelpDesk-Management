<script>
	import Icon from '@iconify/svelte';
	import lockOpenAlt from '@iconify/icons-uil/lock-open-alt';
</script>

<div class="m-1 w-1/3 rounded-sm bg-white shadow">
	<a href="#" class="block hover:bg-gray-50">
		<div class="p-6">
			<div class="flex items-center justify-between truncate text-sm font-medium text-indigo-600">
				Change Password

				<div class="ml-2 space-x-1 flex flex-shrink-0">
					<div>
						<Icon icon={lockOpenAlt} class="w-5 h-5" />
					</div>
				</div>
			</div>
		</div>
	</a>
</div>
