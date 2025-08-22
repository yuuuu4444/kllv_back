<script setup>
import ArticleChart from '@/components/ArticleChart.vue';
import CommentChart from '@/components/CommentChart.vue';
import EventsChart from '@/components/EventsChart.vue';
import NewsChart from '@/components/NewsChart.vue';
</script>

<template>
<div class="container01">
    <div class="EventsBoard">
        <div class="EventsBoard__title">
            <h1>活動報名狀態</h1>
        </div>
        <div class="EventsBoard__chart">
            <EventsChart/>
        </div>
    </div>
    <div class="NewsBoard">
        <div class="NewsBoard__title">
            <h1>最新消息 <span>top5</span></h1>
        </div>
        <div class="NewsBoard__chart">
            <NewsChart />
        </div>
    </div>
    </div>
    <div class="container02">
    <div class="CommunityBoard">
        <div class="CommunityBoard__title">
            <h1>文章審核</h1>
        </div>
        <div class="CommunityBoard__chart">
            <div class="CommunityBoard__chart__article">
                <h2>文章</h2>
                <ArticleChart />
            </div>
            <div class="CommunityBoard__chart__comment">
                <h2>留言</h2>
                <CommentChart />
            </div>
        </div>
    </div>
    </div>
    <div class="RepairBoard">
        <div class="RepairBoard__title">
            <h1>維修概況</h1>
        </div>
    </div>
</template>

<style scoped lang="scss">
template{
    font-family: sans-serif;
}
.container01{
    display: flex;
    margin:0 3vw ;
}
    .EventsBoard,.NewsBoard{
        width: 710px;
        height: 500px;
        text-align: center;
        border-radius: 50px;
        box-shadow: 2px 4px 8.2px 0 rgba(0, 0, 0, 0.25);
        margin: 5%;

        &__title{
            background-color: #6782A4;
            border-radius: 50px 50px 0 0;
            padding: 10px 0;
            color: white;
            font-size: 20px;
        }
        &__chart{
            margin: 30px;
        }
    }
    .container02{
        margin: 0 3vw;
    }
    .CommunityBoard{
        width: 1620px;
        height: 520px;
        text-align: center;
        border-radius: 50px;
        box-shadow: 2px 4px 8.2px 0 rgba(0, 0, 0, 0.25);
        margin: 5%;

        &__title{
            background-color: #6782A4;
            border-radius: 50px 50px 0 0;
            padding: 10px 0;
            color: white;
            font-size: 20px;
        } 
        &__chart{
            font-size: 20px;
            display: flex;
            justify-content: space-between;
            h2{
                margin: 20px 30px;
            }
                &__article{
                    width: 710px;
                    height: 470px;
                    text-align: start;
                }
                &__comment{
                    width: 710px;
                    height: 470px;
                    text-align: start;
                }
        }
    }

</style>