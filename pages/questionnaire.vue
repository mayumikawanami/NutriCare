<template>
  <div class="questionnaire-container">
    <h1 class="title">食事アンケート</h1>
    <form @submit.prevent="submitAnswers">
      <div
        class="questionnaire-label"
        v-for="(question, index) in paginatedQuestions"
        :key="index"
      >
        <label :class="getClass(question.category)">
          {{ question.text }}
        </label>
        <div class="options-container">
          <input
            type="radio"
            :value="0"
            v-model="answers[questionIndex + index]"
            :id="'yes-' + (questionIndex + index)"
            @change="clearError(questionIndex + index)"
          />
          <label :for="'yes-' + (questionIndex + index)">はい</label>

          <input
            type="radio"
            :value="1"
            v-model="answers[questionIndex + index]"
            :id="'no-' + (questionIndex + index)"
            @change="clearError(questionIndex + index)"
          />
          <label :for="'no-' + (questionIndex + index)">いいえ</label>

          <p
            v-if="validationErrors[questionIndex + index]"
            class="error-message"
          >
            選択してください
          </p>
        </div>
      </div>

      <div class="button-container">
        <button type="button" @click="prevPage" v-if="currentPage > 1">
          前へ
        </button>
        <button type="button" @click="nextPage" v-if="currentPage < totalPages">
          次の質問へ
        </button>
        <button type="submit" v-if="currentPage === totalPages">
          結果を表示する
        </button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
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
          category: "fat_intake",
        },
        {
          text: "コンビニのレジ前の揚げ物やコンビニおにぎり・お菓子が大好きだ",
          category: "fat_intake",
        },
        {
          text: "お肉をあまり食べない",
          category: "fat_intake",
        },

        // 消化吸収
        {
          text: "寝る直前（１時間前～）に何か食べてしまう",
          category: "digestive_health",
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

        // タンパク質
        {
          text: "納豆、お味噌、醤油などの伝統的な和食を食べない",
          category: "protein",
        },
        {
          text: "落ち着かない等の症状があると、ついつい甘いものなどを食べさせてしまう",
          category: "protein",
        },
        {
          text: "お湯で注ぐだけの即席スープを飲むのが大好きだ",
          category: "protein",
        },
        {
          text: "ほぼ毎日グルテンフリーの食事をしている",
          category: "protein",
        },
        {
          text: "サプリメントを何種類か飲んでいる",
          category: "protein",
        },

        // ミネラルバランス
        {
          text: "海藻類を食べる回数が少ない",
          category: "mineral_balance",
        },
        {
          text: "自宅の塩は、精製塩である（海塩や岩塩を使っていない）",
          category: "mineral_balance",
        },
        {
          text: "砂糖は、白砂糖を使っている",
          category: "mineral_balance",
        },
        {
          text: "男梅などのちょっとしょっぱいのが大好きだ",
          category: "mineral_balance",
        },
        {
          text: "乳製品（牛乳、チーズ等）が大好きだ",
          category: "mineral_balance",
        },
      ],
      answers: [],
      validationErrors: [],
      scores: {
        carb_intake: 0,
        fat_intake: 0,
        digestive_health: 0,
        dietary_bias: 0,
        protein: 0,
        mineral_balance: 0,
      },
      currentPage: 1, // 現在のページ
      questionsPerPage: 5, // 1ページあたりの質問数
    };
  },
  computed: {
    totalPages() {
      console.log(
        "Total Pages:",
        Math.ceil(this.questions.length / this.questionsPerPage)
      ); // Debugging
      return Math.ceil(this.questions.length / this.questionsPerPage);
    },
    questionIndex() {
      return (this.currentPage - 1) * this.questionsPerPage;
    },
    paginatedQuestions() {
      const startIndex = (this.currentPage - 1) * this.questionsPerPage;
      const endIndex = Math.min(
        startIndex + this.questionsPerPage,
        this.questions.length
      );

      console.log("Start Index:", startIndex, "End Index:", endIndex); // デバッグ用
      console.log(
        "Total Questions:",
        this.questions.length,
        "Current Page:",
        this.currentPage
      ); // 全体の質問数と現在のページ
      console.log(
        "Questions on this page:",
        this.questions.slice(startIndex, endIndex)
      );

      // 境界条件の確認
      if (startIndex >= this.questions.length) {
        console.warn(
          "Start Index exceeds total questions. Adjusting to last page."
        );
        return [];
      }
      return this.questions.slice(startIndex, endIndex);
    },
    mounted() {
      console.log(this.startIndex); // コンポーネントがマウントされた後に totalPages を表示
    },
  },
  created() {
    this.answers = Array(this.questions.length).fill(null);
    this.validationErrors = Array(this.questions.length).fill(false);
  },
  methods: {
    getClass(category) {
      const classes = {
        carb_intake: "carb_intake",
        fat_intake: "fat_intake",
        digestive_health: "digestive_health",
        dietary_bias: "dietary_bias",
        protein: "protein",
        mineral_balance: "mineral_balance",
      };
      return classes[category] || "text-black";
    },
    nextPage() {
      console.log("Current Page before next:", this.currentPage);
      const isValid = this.validateCurrentPage(); // バリデーション実行
      if (!isValid) {
        this.$nextTick(() => {
          console.log("エラーが表示されました");
        });
        return;
      }
      this.clearNextPageErrors();
      this.currentPage++; // バリデーションが成功したら次へ
      console.log("Current Page after next:", this.currentPage); // Check the updated page
    },
    clearNextPageErrors() {
      // 次のページに関連する `validationErrors` をすべて false に設定
      for (
        let i = this.questionIndex + this.questionsPerPage;
        i < this.questionIndex + 2 * this.questionsPerPage;
        i++
      ) {
        if (i < this.validationErrors.length) {
          this.$set(this.validationErrors, i, false);
        }
      }
    },
    // バリデーションロジック
    validateCurrentPage() {
      let valid = true;
      const lastPageQuestions = this.currentPage === this.totalPages;
      for (
        let i = this.questionIndex;
        i <
        Math.min(
          this.questions.length,
          this.questionIndex + this.questionsPerPage
        );
        i++
      ) {
        if (this.answers[i] === null) {
          this.$set(this.validationErrors, i, true); // Vue.set を使用
          valid = false;
        }

        if (lastPageQuestions && this.validationErrors[i]) {
          valid = false;
        }
      }
      return valid;
    },
    prevPage() {
      console.log("Current Page before prev:", this.currentPage);
      this.clearValidationErrors();
      this.currentPage--;
      console.log("Current Page after prev:", this.currentPage);
    },
    clearError(index) {
      this.validationErrors[index] = false;
    },
    clearValidationErrors() {
      for (
        let i = this.questionIndex;
        i < this.questionIndex + this.questionsPerPage;
        i++
      ) {
        this.$set(this.validationErrors, i, false);
      }
    },

    submitAnswers() {
      if (this.validateCurrentPage()) {
        // 現在ページの情報をコンソールに出力
        // console.log("Submit - Current Page:", this.currentPage);
        // console.log("Submit - Total Pages:", this.totalPages);

        // // lastQuestionIndex をここで計算
        // const lastQuestionIndex = Math.min(
        //   (this.currentPage - 1) * this.questionsPerPage +
        //     this.questionsPerPage -
        //     1, // 現在ページの最後の質問のインデックス
        //   this.questions.length - 1 // 質問の総数より大きくならないように制限
        // );
        // console.log(`Submit - Last Question Index: ${lastQuestionIndex}`);

        const isValid = this.validateCurrentPage(); // 最終ページでもバリデーションをチェック
        if (!isValid) {
          // バリデーションエラーがあればエラーを表示
          this.$nextTick(() => {
            console.log("バリデーションエラーが表示されました");
          });
          return;
        }
        this.validationError = false;
        // スコアの計算
        this.scores = {
          carb_intake: this.getCategoryScore("carb_intake"),
          fat_intake: this.getCategoryScore("fat_intake"),
          digestive_health: this.getCategoryScore("digestive_health"),
          dietary_bias: this.getCategoryScore("dietary_bias"),
          protein: this.getCategoryScore("protein"),
          mineral_balance: this.getCategoryScore("mineral_balance"),
        };

        // 結果ページへ遷移
        this.$router.push({
          name: "result",
          query: { scores: JSON.stringify(this.scores) },
        });
      }
    },
    getCategoryScore(category) {
      return this.questions
        .map((question, index) =>
          question.category === category ? this.answers[index] : 0
        )
        .reduce((sum, value) => sum + value, 0);
    },
  },
};
</script>

<style scoped>
.carb_intake,
.fat_intake,
.digestive_health,
.dietary_bias,
.protein,
.mineral_balance {
  font-weight: bold;
}

.title {
  text-align: center;
}

/* .questionnaire-container {
  background-color: rgb(224, 248, 240);
} */

/* フォーム全体 */
.questionnaire-label {
  max-width: 700px;
  margin: 7px auto;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1);
  font-size: 1.1em;
  display: block;
  line-height: 4;

  @media (max-width: 768px) {
    font-size: 0.8rem;
  }

  @media (max-width: 480px) {
    font-size: 0.6rem;
    width: 97%;
  }
}

/* ボタン */
.button-container {
  text-align: center;
  margin: 30px auto;
}

.button-container button {
  background-color: #4caf50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1.1em;
}

button:hover {
  background-color: #b3f0b6;
}

.error-message {
  color: rgb(243, 10, 10);
  background-color: #f7d7f5;
  margin: 0 30px; /* 余白を調整 */
  display: block;
  font-size: 0.9em;
  border-radius: 5px;
  padding: 0 20px;

  @media (max-width: 768px) {
    font-size: 0.8rem;
  }

  @media (max-width: 480px) {
    font-size: 0.5rem;
    line-height: normal;
  }
}

/* ラジオボタンとエラーメッセージを横並びにする */
.options-container {
  display: flex;
  align-items: center;
  gap: 10px; /* ラジオボタン間の余白 */
}

.options-container input[type="radio"] {
  transform: scale(1.1); /* サイズを1.5倍にする */
  margin-left: 20px; /* ラジオボタンとテキストの間隔を調整 */
  cursor: pointer;
}

.options-container label {
  cursor: pointer;
}
</style>
