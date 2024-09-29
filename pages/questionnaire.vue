<template>
  <div>
    <h1>健康チェックアップ</h1>
    <form @submit.prevent="submitAnswers">
      <div v-for="(question, index) in questions" :key="index">
        <label>{{ question.text }}</label>
        <input type="radio" :value="1" v-model="answers[index]" /> はい
        <input type="radio" :value="0" v-model="answers[index]" /> いいえ
      </div>
      <button type="submit">結果を表示</button>
    </form>
    <div v-if="showResult">
      <h2>結果</h2>
      <RadarChart :scores="scores" />
    </div>
  </div>
</template>

<script>
import RadarChart from '@/components/RadarChart.vue';

export default {
  components: { RadarChart },
  data() {
    return {
      questions: [
        { text: "甘い物がやめられない（間食にクッキーやチョコレート）" },
        { text: "朝食にはパンやグラノーラが多い（和食以外が多い）" },
        // 追加の質問をここに記入
      ],
      answers: Array(20).fill(null), // 質問数に応じて初期化
      showResult: false,
      scores: [0, 0, 0, 0, 0, 0], // 循環器、副腎疲労、甲状腺機能低下、甲状腺亢進、肝機能負荷、低血糖
    };
  },
  methods: {
    submitAnswers() {
      // スコアリングロジック
      this.scores = [
        this.answers.slice(0, 5).reduce((a, b) => a + b, 0), // 循環器
        this.answers.slice(5, 10).reduce((a, b) => a + b, 0), // 副腎疲労
        // 他の傾向のスコアを計算
      ];
      this.showResult = true;
    },
  },
};
</script>
