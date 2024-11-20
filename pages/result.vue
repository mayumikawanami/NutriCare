<template>
  <div class="result">
    <div class="result-top">
      <h2>結果</h2>
      <NuxtLink to="/">トップページに戻る</NuxtLink>
    </div>
    <div class="scores">
      <RadarChart :scores="parsedScores" />
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
        mental_health: 0,
        mineral_balance: 0,
      },
    };
  },
  created() {
    // URLのクエリパラメータからスコアを取得
    const scores = this.$route.query.scores;
    if (scores) {
      try {
        this.parsedScores = JSON.parse(scores);
        console.log('Received scores:', this.parsedScores); // デバッグ用
      } catch (error) {
        console.error('Failed to parse scores:', error);
      }
    }
  },
};
</script>

<style>
/* 結果セクション */
h2 {
  text-align: center;
  margin-top: 20px;
}
h1 {
  text-align: center;
}

.scores {
  margin: 30px auto 50px;
  width: 70%;
}

.result {
  text-align: center;
  max-width: 800px; /* フォームの幅を制限して見やすく */
  margin: 20px auto; /* 自動で中央揃え */
  padding: 50px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 軽い影を付けて浮き上がらせる */
}

.result-top a {
  text-decoration: none;
  background-color: blue;
  color: white;
  padding: 5px;
  border-radius: 10px;
}
</style>