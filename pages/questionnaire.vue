<template>
  <div>
    <h1 class="title">食事アンケート</h1>
    <form class="questionnaire" @submit.prevent="submitAnswers">
      <div class="questionnaire-label" v-for="(question, index) in questions" :key="index">
        <label :class="getClass(question.category)">{{ question.text }}</label>
        <div class="options-container">
          <input type="radio" :value="0" v-model="answers[index]" /> はい
          <input type="radio" :value="1" v-model="answers[index]" /> いいえ
          <p v-if="validationErrors[index]" class="error-message">選択してください</p>
        </div>
      </div>
      <div class="button-container">
        <button type="submit">結果を表示する</button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 質問を各カテゴリに割り当てる
      questions: [
        // 糖質
        {
          text: "甘い物がやめられない（間食にクッキーやチョコレート）",
          category: "carb_intake",
        },
        {
          text: "朝食にはパンやグラノーラが多い（和食以外が多い）",
          category: "carb_intake",
        },
        {
          text: "パンが大好きだ",
          category: "carb_intake",
        },
        {
          text: "チロルチョコや子ども用チョコレートなど、甘いチョコが大好きだ",
          category: "carb_intake",
        },
        {
          text: "お米は白米が多い",
          category: "carb_intake",
        },

        // 脂質
        {
          text: "アマニ油やエゴマ油などのオメガ３油を摂っていない",
          category: "fat_intake",
        },
        {
          text: "サバやイワシなどの青魚をあまり食べない",
          category: "fat_intake",
        },
        {
          text: "サラダにはドレッシングやマヨネーズをかけてしまう",
          category: "fat_intake"
        },
        {
          text: "コンビニのレジ前の揚げ物やコンビニおにぎり・お菓子が大好きだ",
          category: "fat_intake"
        },
        {
          text: "お肉をあまり食べない",
          category: "fat_intake"
        },

        // 消化吸収
        {
          text: "寝る直前（１時間前～）に何か食べてしまう",
          category: "digestive_health"
        },
        {
          text: "朝食は基本的に食べない",
          category: "digestive_health",
        },
        {
          text: "食べるのが早い",
          category: "digestive_health",
        },
        {
          text: "動画やテレビを見ながらご飯を食べている",
          category: "digestive_health",
        },
        {
          text: "お肉などの脂っこいものを食べると下痢をすることがある",
          category: "digestive_health",
        },

        // 偏食
        {
          text: "栄養が不足しているとわかっているが、偏食が多くて困っている",
          category: "dietary_bias",
        },
        {
          text: "果物をあまり食べてない",
          category: "dietary_bias",
        },
        {
          text: "きのこが嫌いで食べない",
          category: "dietary_bias",
        },
        {
          text: "レバーが嫌い（レバーを食べない）",
          category: "dietary_bias",
        },
        {
          text: "葉物野菜（ほうれん草等）を食べない",
          category: "dietary_bias",
        },

        // マインド
        {
          text: "納豆、お味噌、醤油などの伝統的な和食を食べない",
          category: "mental_health"
        },
        {
          text: "落ち着かない等の症状があると、ついつい甘いものなどを食べさせてしまう"
          , category: "mental_health"
        },
        {
          text: "お湯で注ぐだけの即席スープを飲むのが大好きだ",
          category: "mental_health",
        },
        {
          text: "ほぼ毎日グルテンフリーの食事をしている",
          category: "mental_health"
        },
        {
          text: "サプリを何種類か飲んでいる（飲んでいる場合、その他⇩欄に記入をお願いします）",
          category: "mental_health",
        },

        // ミネラルバランス
        {
          text: "海藻類を食べる回数が少ない",
          category: "mineral_balance"
        },
        {
          text: "自宅の塩は、精製塩である（海塩や岩塩を使っていない）",
          category: "mineral_balance"
        },
        {
          text: "砂糖は、白砂糖を使っている",
          category: "mineral_balance",
        },
        {
          text: "男梅などのちょっとしょっぱいのが大好きだ"
          , category: "mineral_balance"
        },
        {
          text: "乳製品（牛乳、チーズ等）が大好きだ",
          category: "mineral_balance"
        },
      ],
      answers: [],
      validationErrors: [],
      scores: {
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
    this.answers = Array(this.questions.length).fill(null); // 初期化
    this.validationErrors = Array(this.questions.length).fill(false);
  },
  methods: {
    getClass(category) {
      const classes = {
        carb_intake: "text-red",
        fat_intake: "text-blue",
        digestive_health: "text-yellow",
        dietary_bias: "text-green",
        mental_health: "text-purple",
        mineral_balance: "text-orange",
      };
      return classes[category] || "text-black";
    },
    submitAnswers() {
      let valid = true;

      // バリデーション
      this.validationErrors = this.answers.map(answer => {
        const hasError = answer === null;
        if (hasError) valid = false;
        return hasError;
      });

      if (!valid) {
        alert("全ての質問に回答してください。");
        return;
      }

      this.scores = {
        carb_intake: this.getCategoryScore("carb_intake"),
        fat_intake: this.getCategoryScore("fat_intake"),
        digestive_health: this.getCategoryScore("digestive_health"),
        dietary_bias: this.getCategoryScore("dietary_bias"),
        mental_health: this.getCategoryScore("mental_health"),
        mineral_balance: this.getCategoryScore("mineral_balance"),
      };
      this.$router.push({ name: "result", query: { scores: JSON.stringify(this.scores) } });
    },
    getCategoryScore(category) {
      return this.questions
        .map((question, index) => (question.category === category ? this.answers[index] : 0))
        .reduce((sum, value) => sum + value, 0);
    },
  },
};
</script>

<style scoped>
/* テキストカラー */
.text-red {
  color: #ff6384;
  font-weight: bold;
}
.text-blue
{ color: #36a2eb;
  font-weight: bold;
}
.text-yellow {
  color: #FFCE56;
  font-weight: bold;
}
.text-green {
  color: #4BC0C0;
  font-weight: bold;
}
.text-purple {
  color: #9966FF;
  font-weight: bold;
}
.text-orange {
  color: #FF9F40;
  font-weight: bold;
}
.text-black {
  color: #000;
}

.title{
  text-align: center;
}

/* 質問ラベル */
label { font-size: 1.1em; display: block; }

/* フォーム全体 */
.questionnaire-label {
  max-width: 700px;
  margin: 7px auto;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1);
}

/* ボタン */
.button-container { text-align: center; margin: 30px auto; }

button {
  background-color: #4caf50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1.1em;
}

button:hover { background-color: #45a049; }

.error-message {
  color: rgb(243, 10, 10);
  background-color: #f7d7f5;
  margin: 0 30px; /* 余白を調整 */
  display: inline;
  font-size: 0.9em;
  border-radius: 5px;
  padding:0 20px ;
}

/* ラジオボタンとエラーメッセージを横並びにする */
.options-container {
  display: flex;
  align-items: center;
  gap: 10px; /* ラジオボタン間の余白 */
}
</style>
