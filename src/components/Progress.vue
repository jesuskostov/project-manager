<template>
  <div>
    <div class="progress mb-3" data-height="6" style="height: 6px;">
        <div class="progress-bar" role="progressbar" :aria-valuenow="finished.length" aria-valuemin="0" :aria-valuemax="tasks.length" :style="{width: ((finished.length/tasks.length) * 100) + '%'}"></div>
    </div>
  </div>
</template>

<script>
export default {
    name: 'Progress',
    props: ['tasks'],
    data() {
        return {
            finished: []
        }
    },
    created() {
        this.tasks.map( task => {
            if (task.progress == true) {
                this.finished.push(task)
            }
        })
    }
}
</script>

<style>

</style>