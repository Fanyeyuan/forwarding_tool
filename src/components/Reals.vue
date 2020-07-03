<template>
    <div class="reals">
        <div class="data" v-if="real.length">
            <el-card class="card" shadow="hover" v-for="(data, index) in real" :key="index">
                <span>{{data.eName}} : <em>{{data.eValue}} {{data.eUnit}}</em></span>
            </el-card>
        </div>
        <div class="vavle" v-if="vavle.length">
            <div v-for="(jk, index) in vavle" :key="index">
                <span>J{{index+1}}</span>
                <el-switch
                :value ="jk"
                active-color="#13ce66"
                inactive-color="#ff4949"
                disabled
                ></el-switch>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                color: () => () => []
            }
        },
        props: {
            real: {
                type: Array,
                default: () => () => []
            },
            vavle: {
                type: Array,
                default: () => () => []
            }
        },
        mounted () {
            setInterval(()=>{
                this.color = []
                for(let i = 0; i < 16; i++){
                    let red = Math.random() * 255
                    let green = Math.random() * 255
                    let blue = Math.random() * 255
                    let a = Math.random()

                    this.color.push({
                        "backgrand-color": `rgb(${red}, ${green}, ${blue}, ${a})`
                    })
                }
            }, 10000)
        },
    }
</script>

<style lang="scss" scoped>
.reals{
    // display: flex;
    // justify-content: center;
    .data{
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap ;
        align-content: center;
        // border: 1px solid black;
        box-shadow: 0 0 5px gray;
        margin-bottom: 10px;
        .card{
            width:200px;
            margin: 10px;
            text-align: center;
            cursor: pointer;
        }
    }
    .vavle{
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap ;
        align-content: center;
        align-content: center;
        // border: 1px solid black;
        box-shadow: 0 0 5px gray;
        padding: 5px 10px;

        >div{
            width: 70px;
            height: 25px;
            margin-left: 10px;
            span{
                display: inline-block;
                width: 30px;
                text-align: center;
            }
        }
    }
}
</style>