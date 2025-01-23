<template>
  <div class="result-page">
    <h1>アンケート結果</h1>
    <div v-for="(question, index) in questions" :key="question.id" class="result-item">
      <h2>{{ question.text }}</h2>
      <p v-if="userAnswers[index] === true">回答: はい</p>
      <p v-if="userAnswers[index] === false">回答: いいえ</p>
      <p v-if="userAnswers[index] === null">回答: 未回答</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // URLのクエリパラメータから渡されたデータを取得
      questions: JSON.parse(this.$route.query.questions),
      userAnswers: JSON.parse(this.$route.query.answers),
    };
  },
};
</script>

<style scoped>
.result-container {
  text-align: center;
}

.result-item {
  margin-bottom: 20px;
}

.score-container {
  margin-top: 30px;
}
</style>