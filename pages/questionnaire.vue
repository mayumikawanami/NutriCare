<template>
  <div>
    <h1>食事アンケート</h1>
    <form @submit.prevent="submitAnswers">
      <div v-for="(question, index) in questions" :key="index">
        <label :class="getClass(question.category)">{{ question.text }}</label>
        <input type="radio" :value="0" v-model="answers[index]" /> はい
        <input type="radio" :value="1" v-model="answers[index]" /> いいえ
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
      // 質問を各カテゴリに割り当てる
      questions: [
        // 循環器系
        { text: "甘い物がやめられない（間食にクッキーやチョコレート）", category: 'circulatory' },
        { text: "朝食にはパンやグラノーラが多い（和食以外が多い）", category: 'circulatory' },
        { text: "アマニ油やエゴマ油などのオメガ3油を摂っていない", category: 'circulatory' },
        { text: "サバやイワシなどの青魚をあまり食べない", category: 'circulatory' },
        { text: "寝る直前（1時間前〜）に何か食べてしまう", category: 'circulatory' },

        // 副腎疲労
        { text: "サラダにはドレッシングやマヨネーズを食べてしまう", category: 'adrenal_fatigue' },
        { text: "コンビニのレジ前の揚げ物やコンビニおにぎり・お菓子が大好きだ", category: 'adrenal_fatigue' },
        { text: "朝食は基本的に食べない", category: 'adrenal_fatigue' },
        { text: "海藻類を食べる回数が少ない", category: 'adrenal_fatigue' },
        { text: "パンが大好きだ", category: 'adrenal_fatigue' },

        // 甲状腺機能低下
        { text: "食べるのが早い", category: 'hypothyroidism' },
        { text: "動画やテレビを見ながらご飯を食べている", category: 'hypothyroidism' },
        { text: "栄養が不足しているとわかっているが、偏食が多くて困っている", category: 'hypothyroidism' },
        { text: "納豆、お味噌、醤油などの伝統的な和食を食べない", category: 'hypothyroidism' },
        { text: "落ち着かない等の症状があると、甘いものなどを食べてしまう", category: 'hypothyroidism' },

        // 甲状腺亢進
        { text: "温泉で注ぐだけの即席スープを飲むのが大好きだ", category: 'hyperthyroidism' },
        { text: "お肉などの脂っこいものを食べると下痢をすることがある", category: 'hyperthyroidism' },
        { text: "ほぼ毎日グルテンフリーの食事をしている", category: 'hyperthyroidism' },
        { text: "チロルチョコや子ども用チョコレートなど、甘いチョコが大好きだ", category: 'hyperthyroidism' },
        { text: "自宅の塩は、精製塩である（海塩や岩塩を使っていない）", category: 'hyperthyroidism' },

        // 肝機能負荷
        { text: "砂糖は、白砂糖を使っている", category: 'liver_function' },
        { text: "お肉をあまり食べない", category: 'liver_function' },
        { text: "男梅などのちょっとしょっぱいのが大好きだ", category: 'liver_function' },
        { text: "果物をあまり食べてない", category: 'liver_function' },
        { text: "乳製品（牛乳、チーズ等）が大好きだ", category: 'liver_function' },

        // 低血糖
        { text: "きのこが嫌いで食べない", category: 'hypoglycemia' },
        { text: "レバーが嫌い（レバーを食べない）", category: 'hypoglycemia' },
        { text: "葉物野菜（ほうれん草等）を食べない", category: 'hypoglycemia' },
        { text: "低血糖の質問１", category: 'hypoglycemia' },
        { text: "低血糖の質問２", category: 'hypoglycemia' },
      ],
      answers: Array(30).fill(null), // 質問数に応じて初期化
      showResult: false,
      scores: { circulatory: 0, adrenal_fatigue: 0, hypothyroidism: 0, hyperthyroidism: 0, liver_function: 0, hypoglycemia: 0 },
    };
  },
    methods: {
        getClass(category) {
      return {
        circulatory: 'text-red',
        adrenal_fatigue: 'text-blue',
        hypothyroidism: 'text-yellow',
        hyperthyroidism: 'text-green',
        liver_function: 'text-purple',
        hypoglycemia: 'text-orange',
      }[category] || 'text-black'; // デフォルトは黒
    },
        
        submitAnswers() {
        //console.log("Form submitted");  // フォームが送信されたか確認
      // スコアリングロジック
      this.scores = {
        circulatory: this.getCategoryScore('circulatory'),
        adrenal_fatigue: this.getCategoryScore('adrenal_fatigue'),
        hypothyroidism: this.getCategoryScore('hypothyroidism'),
        hyperthyroidism: this.getCategoryScore('hyperthyroidism'),
        liver_function: this.getCategoryScore('liver_function'),
        hypoglycemia: this.getCategoryScore('hypoglycemia'),
      };
      //console.log("Updated Scores: ", this.scores); // Debugging to see updated scores
        this.showResult = true;
        //this.$forceUpdate();  // コンポーネントを強制的に再レンダリング
        },

    // 仮のスコアでテスト
    /*submitAnswers() {
  console.log("Form submitted");  // フォームが送信されたか確認
  this.scores = {
    circulatory: 0,      // 循環器系のスコアを仮に5に設定
    adrenal_fatigue: 5,  // 副腎疲労のスコアを仮に3に設定
    hypothyroidism: 1,   // 甲状腺機能低下のスコアを仮に4に設定
    hyperthyroidism: 2,  // 甲状腺機能亢進のスコアを仮に2に設定
    liver_function: 5,   // 肝機能負荷のスコアを仮に6に設定
    hypoglycemia: 3      // 低血糖のスコアを仮に1に設定
  };

  console.log("Test Scores: ", this.scores);  // テスト用のスコアを確認
    this.showResult = true;
    this.$forceUpdate();  // コンポーネントを強制的に再レンダリング
},*/

        
        getCategoryScore(category) {
  const filteredQuestions = this.questions.filter((question, index) => {
    //console.log("Question Category:", question.category, "Current Category:", category);  // カテゴリを出力
    return question.category === category && this.answers[index] !== null;
  });

  //console.log(`Category: ${category}, Filtered Questions:`, filteredQuestions);  // フィルタリングされた質問を出力

  return filteredQuestions.reduce((sum, question, i) => {
    return sum + this.answers[this.questions.indexOf(question)];
  }, 0);
}
  },
};
</script>

<style>
.text-red {
  color: #FF6384;
}
.text-blue {
  color: #36A2EB;
}
.text-yellow {
  color: #FFCE56;
}
.text-green {
  color: #4BC0C0;
}
.text-purple {
  color: #9966FF;
}
.text-orange {
  color: #FF9F40;
}
.text-black {
  color: #000;
}
</style>
