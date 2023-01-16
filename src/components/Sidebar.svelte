<script>
	import MenuItem from "./MenuItem.svelte";
//    import { Home, Ticket, OfficeBuilding, LockClosed, UserGroup, Cog, Chat } from "svelte-hero-icons";
    import {Icon, Home, Ticket, UserGroup, OfficeBuilding, LockClosed, Cog, Chat } from "svelte-hero-icons"
</script>

<div class="drawer-side shadow-md border-r" aria-label="Sidebar">
  <label for="my-drawer-3" class="drawer-overlay"></label>
     <ul class="py-1 overflow-y-auto w-64 bg-base-100">
      <li class="text-xl p-4 font-bold text-gray-500 text-center">
        <Icon src={Chat} solid class="mx-auto w-10 h-10" />
      </li>
        <li>
           <MenuItem icon={Home} to='/dashboard' name="Dashboard"  />
        </li>
      
        <li>
         <MenuItem icon={Ticket} to='/tickets' name="Tickets" />

        </li>
        <li>
         <MenuItem icon={UserGroup} to='/agents' name="Agents" />

        </li>
        <li>
         <MenuItem icon={OfficeBuilding} to='/departments' name="Departments" />

         <MenuItem icon={LockClosed} to='/admin' name="Admin" />


         <MenuItem icon={Cog} to='/settings' name="Settings" />

        </li>
       
     </ul>
</div>
