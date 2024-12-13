<template>
  <div class="result">
    <div class="result-top">
      <h2 class="result-top_title">結　果</h2>
      <p class="advice" v-for="(message,index) in adviceMessages" :key="index">{{ message }}</p>
    </div>
    <div class="scores">
      <RadarChart :scores="parsedScores" />
    </div>
    <div class="result-bottom">
      <NuxtLink to="/">トップページに戻る</NuxtLink>
    </div>
  </div>
</template>

<script>
import RadarChart from '@/components/RadarChart.vue';

export default {
  components: { RadarChart },
  data() {
    return {
      parsedScores: {
        carb_intake: 0,
        fat_intake: 0,
        digestive_health: 0,
        dietary_bias: 0,
        protein: 0,
        mineral_balance: 0,
      },
      adviceMessages:[],
    };
  },
  created() {
    // URLのクエリパラメータからスコアを取得
    const scores = this.$route.query.scores;
    if (scores) {
      try {
        this.parsedScores = JSON.parse(scores);
        console.log('Received scores:', this.parsedScores); // デバッグ用
        this.generateAdvice();
      } catch (error) {
        console.error('Failed to parse scores:', error);
      }
    }
  },
  methods: {
    generateAdvice() {
      const messages = [];
      const { carb_intake, fat_intake, digestive_health, dietary_bias, protein, mineral_balance } = this.parsedScores;

      if (carb_intake < 3) {
        messages.push("・糖質の摂取量が多いかもしれません")
      }
      if (fat_intake < 3) {
        messages.push("・脂質の摂取量が多いかもしれません")
      }
      if (digestive_health < 3) {
        messages.push("・消化吸収に心配があります")
      }
      if (dietary_bias < 3) {
        messages.push("・偏食に心配があります")
      }
      if (protein < 3) {
        messages.push("・たんぱく質の摂取量が不足しているかもしれません")
      }
      if (mineral_balance < 3) {
        messages.push("・ミネラルが不足しているかもしれません")
      }
      this.adviceMessages = messages.length > 0 ? messages : ["全体的に良好です！"];
      console.log(messages);
    },
  },
};
</script>

<style scoped>
/* 結果セクション */
.result-top {
  text-align: left;
  margin-top: 10px;
  background-color: rgb(246, 175, 239);
  width: 50%;
  padding: 10px;
  border-radius: 20px;
}
.advice{
  margin: 0;
  /* color: #fff; */
}
.result-top_title{
  margin: 5px;
  /* text-align: center; */
}

.scores {
  margin: 30px auto 50px;
  max-width: 500px;
  /* width: 70%; */
}

.result {
  text-align: center;
  max-width: 800px; /* フォームの幅を制限して見やすく */
  margin: 20px auto; /* 自動で中央揃え */
  padding:10px 50px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 軽い影を付けて浮き上がらせる */
    @media (max-width: 768px) {
      padding: 20px;
  }

    @media (max-width: 480px) {
      padding: 10px;
  }

}

.result-bottom a {
  text-decoration: none;
  background-color: blue;
  color: white;
  padding: 5px;
  border-radius: 10px;
}
</style>