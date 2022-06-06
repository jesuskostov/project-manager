<template>
  <div>
    <div class="progress mb-3" data-height="6" style="height: 6px;">
        <div class="progress-bar" role="progressbar" :aria-valuenow="progress" aria-valuemin="0" :aria-valuemax="100" :style="{width: progress + '%'}"></div>
    </div>
  </div>
</template>

<script>
export default {
    name: 'Progress',
    props: ['progress']
}
</script>

<style>

</style>