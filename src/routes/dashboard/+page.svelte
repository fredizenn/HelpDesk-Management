<script lang="ts">
    import Card from "../../components/Card.svelte";
</script>

<main>
    <div class="md:grid grid-cols-3 gap-2">
        <Card title="Sample">
            <svelte:fragment slot="content">
                <div class="h-1/2 w-1/2"></div>
            </svelte:fragment>
        </Card>
        <Card title="Sample"></Card>
        <Card title="Sample"></Card>

    </div>

</main>