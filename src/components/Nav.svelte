<script lang="ts">
    export let title: any = ''
</script>


<div class="flex navbar justify-start p-4 w-full bg-base-100 shadow-md sticky top-0 z-20">
    <div class="flex-none lg:hidden">
        <label for="my-drawer-3" class="btn btn-square btn-ghost">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            class="inline-block w-6 h-6 stroke-current">
            <!-- <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"></path> -->
          </svg>
        </label>
      </div>
      <div>{title}</div>
</div>