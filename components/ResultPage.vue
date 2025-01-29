<template>
  <div class="result-page">
    <h3>回答一覧</h3>
    <div v-if="questions.length && answers.length">
      <div
        v-for="(question, index) in questions"
        :key="index"
        class="result-item"
      >
        <li class="result-item_text">{{ index + 1 }}. {{ question.text }}</li>
        <p v-if="answers[index]" class="result-item_answer">: はい</p>
        <p v-else class="result-item_answer">: いいえ</p>
      </div>
    </div>
    <p v-else>データを読み込んでいます...</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      questions: [], // 初期値を空の配列で定義
      answers: [],
    };
  },
  mounted() {
    try {
      this.questions = JSON.parse(this.$route.query.questions || "[]");
      const rawAnswers = JSON.parse(this.$route.query.answers || "[]");
      this.answers = rawAnswers.map((value) => value === 0);

      // console.log(JSON.parse(JSON.stringify(this.questions)));
      // console.log(JSON.parse(JSON.stringify(this.answers)));
    } catch (error) {
      console.error("Failed to parse query params:", error);
      this.questions = [];
      this.answers = [];
    }
  },
};
</script>

<style scoped>
.result-container {
  text-align: center;
}

.result-item {
  display: flex;
}

.result-item_text {
  list-style: none;
}

.result-item_answer {
  margin: 0;
  color: rgb(251, 131, 3);
}

.score-container {
  margin-top: 30px;
}
</style>
