<template>
    <div class="card">
        <div class="card-header">
            <h4>{{project.name}}</h4>
            <div class="status">
                <select v-if="workingID == id || workingID == null" class="form-control selectric" v-model="statusValue" @change="status()">
                    <option value="start">Старт</option>
                    <option value="pause">Пауза</option>
                    <option value="finished">Завършено</option>
                </select>
            </div>
            </div>
            <div class="card-body text-left">
            <p>{{project.description}}</p>
            <div v-for="(task, i) in project.tasks" :key="i" class="alert alert-primary" :class="{'blur': workingID != id}">
                <span @click="complete(task.name, i)" class="checkbox">
                    <div v-if="task.progress" class="check">
                        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 76.887 55.552" style="enable-background:new 0 0 76.887 55.552;" xml:space="preserve">
                            <polygon style="fill:#fff;" points="34.373,49.541 76.887,5.889 70.739,0 28.426,43.458 6.078,20.632 0,26.585 22.488,49.557 
                                22.488,49.557 28.517,55.552 28.426,55.467 28.517,55.552 34.373,49.541 	"/>
                        </svg>
                    </div>
                </span>
                <p>{{task.name}}</p>
            </div>
        </div>
    </div>
</template>

<script>
import { bus } from '../main'

export default {
    name: 'project',
    props: ['id', 'workingID', 'workStatus'],
    data() {
        return {
            statusValue: ''
        }
    },
    computed: {
        project() {
            return this.$store.state.project
        },
        tasks() {
            return this.$store.state.project.tasks.map( task => {
                return task.progress
            })
        },
    },
    watch: {
        'tasks': {
            handler: function (val, oldVal) {
                console.log(val);
                console.log(oldVal);
                bus.$emit('reload')
            },
        },
        project() {
            this.statusValue = this.project.status
        }
    },
    methods: {
        status() {
            let projectID = this.id
            let status = this.statusValue
            this.$store.dispatch('workingStatus', {projectID, status})
        },
        complete(name, i) {
            let projectID = this.id
            let taskID = i
            let taskName = name
            this.$store.dispatch('completeTask', {projectID, taskID, taskName})
        }
    },
    async created() {
        let projectID = this.id
        this.$store.dispatch('getProject', projectID)
    }
}
</script>

<style lang="scss" scoped>
.alert {
    transition: 1s;
}
.blur {
    filter: blur(2px);
    pointer-events: none;
    transition: 1s;
}
.card-header {

    .status {
        width: 200px;
        margin-left: auto;

        .form-control {
            border-radius: 3px;
        }
    }
}

.alert {
    display: flex;
    align-items: center;
    margin-bottom: 5px;
    p {
        color: #fff;
    }
}
.checkbox {
    position: relative;
    display: inline-block;
    width: 22px;
    height: 22px;
    margin-right: 12px;
    border-radius: 99999999px;
    background-color: #fff;
    cursor: pointer;
    overflow: hidden;
    border: 1px solid #fff;
}

.check {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #47c363;
    display: flex;
    align-items: center;
    justify-content: center;
    svg {
        width: 12px;
    }
}
</style>