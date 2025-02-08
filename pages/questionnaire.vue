<template>
  <div class="questionnaire-container">
    <h1 class="title">食事診断チェックシート</h1>
    <div class="comment-top">
      <img src="images/smile_woman.png" alt="smile_woman" class="top-img" />
      <h2 class="page-comment">{{ currentComment }}</h2>
    </div>
    <p class="remaining-questions">{{ currentPage }}／{{ totalPages }}ページ</p>
    <form class="questionnaire-form" @submit.prevent="submitAnswers">
      <div
        class="questionnaire-label"
        v-for="(question, index) in paginatedQuestions"
        :key="index"
      >
        <label :for="'question-' + index" :class="getClass(question.category)">
          {{ index + 1 + (currentPage - 1) * questionsPerPage }}.
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
          <label :for="'yes-' + (questionIndex + index)" class="radio-label"
            >はい</label
          >

          <input
            type="radio"
            :value="1"
            v-model="answers[questionIndex + index]"
            :id="'no-' + (questionIndex + index)"
            @change="clearError(questionIndex + index)"
          />
          <label :for="'no-' + (questionIndex + index)" class="radio-label"
            >いいえ</label
          >

          <p
            v-if="validationErrors[questionIndex + index]"
            class="error-message"
          >
            選択してください
          </p>
        </div>
      </div>
      <div class="button-container">
        <div class="page-button_container">
          <button
            class="back-button"
            type="button"
            @click="prevPage"
            v-if="currentPage > 1"
          >
            前の質問に戻る
          </button>
          <button
            class="next_page-button"
            type="button"
            @click="nextPage"
            v-if="currentPage < totalPages"
          >
            次の質問に進む
          </button>
        </div>
        <div class="result-button_container">
          <button type="submit" v-if="currentPage === totalPages">
            結果を表示する
          </button>
        </div>
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
          id: 1,
          text: "甘い物がやめられない（間食にクッキーやチョコレート）",
          category: "carb_intake",
        },
        {
          id: 2,
          text: "朝食にはパンやグラノーラが多い（和食以外が多い）",
          category: "carb_intake",
        },
        {
          id: 3,
          text: "パンが大好きだ",
          category: "carb_intake",
        },
        {
          id: 4,
          text: "チロルチョコや子ども用チョコレートなど、甘いチョコが大好きだ",
          category: "carb_intake",
        },
        {
          id: 5,
          text: "お米は白米が多い",
          category: "carb_intake",
        },

        // 脂質
        {
          id: 6,
          text: "アマニ油やエゴマ油などのオメガ３油を摂っていない",
          category: "fat_intake",
        },
        {
          id: 7,
          text: "サバやイワシなどの青魚をあまり食べない",
          category: "fat_intake",
        },
        {
          id: 8,
          text: "サラダにはドレッシングやマヨネーズをかけてしまう",
          category: "fat_intake",
        },
        {
          id: 9,
          text: "コンビニのレジ前の揚げ物やコンビニおにぎり・お菓子が大好きだ",
          category: "fat_intake",
        },
        {
          id: 10,
          text: "お肉をあまり食べない",
          category: "fat_intake",
        },

        // 消化吸収
        {
          id: 11,
          text: "寝る直前（１時間前～）に何か食べてしまう",
          category: "digestive_health",
        },
        {
          id: 12,
          text: "朝食は基本的に食べない事が多い",
          category: "digestive_health",
        },
        {
          id: 13,
          text: "食べるのが早い",
          category: "digestive_health",
        },
        {
          id: 14,
          text: "動画やテレビを見ながらご飯を食べている",
          category: "digestive_health",
        },
        {
          id: 15,
          text: "お肉などの脂っこいものを食べると下痢をすることがある",
          category: "digestive_health",
        },

        // 偏食
        {
          id: 16,
          text: "栄養が不足しているとわかっているが、偏食が多くて困っている",
          category: "dietary_bias",
        },
        {
          id: 17,
          text: "果物をあまり食べてない",
          category: "dietary_bias",
        },
        {
          id: 18,
          text: "きのこが嫌いで食べない",
          category: "dietary_bias",
        },
        {
          id: 19,
          text: "レバーが嫌い（レバーを食べない）",
          category: "dietary_bias",
        },
        {
          id: 20,
          text: "葉物野菜（ほうれん草等）を食べない",
          category: "dietary_bias",
        },

        // タンパク質
        {
          id: 21,
          text: "納豆、お味噌、醤油などの伝統的な和食を食べない",
          category: "protein",
        },
        {
          id: 22,
          text: "落ち着かない等の症状があると、つい甘いものなどを食べさせてしまう",
          category: "protein",
        },
        {
          id: 23,
          text: "お湯で注ぐだけの即席スープを飲むのが大好きだ",
          category: "protein",
        },
        {
          id: 24,
          text: "ほぼ毎日グルテンフリーの食事をしている",
          category: "protein",
        },
        {
          id: 25,
          text: "サプリメントを何種類か飲んでいる",
          category: "protein",
        },

        // ミネラルバランス
        {
          id: 26,
          text: "海藻類を食べる回数が少ない",
          category: "mineral_balance",
        },
        {
          id: 27,
          text: "自宅の塩は、精製塩である（海塩や岩塩を使っていない）",
          category: "mineral_balance",
        },
        {
          id: 28,
          text: "砂糖は、白砂糖を使っている",
          category: "mineral_balance",
        },
        {
          id: 29,
          text: "男梅などのちょっとしょっぱいのが大好きだ",
          category: "mineral_balance",
        },
        {
          id: 30,
          text: "乳製品（牛乳、チーズ等）が大好きだ",
          category: "mineral_balance",
        },
      ],
      // userAnswers: {},
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
      pageComments: [
        "まずは、５問に答えてね♪",
        "その調子、その調子(^^)",
        "迷ったら直感でね♪",
        "あと、少し！",
        "ラスト、１０問！",
        "これで終わりだよ！",
      ],
    };
  },
  computed: {
    totalPages() {
      // console.log(
      //   "Total Pages:",
      //   Math.ceil(this.questions.length / this.questionsPerPage)
      // ); // Debugging
      return Math.ceil(this.questions.length / this.questionsPerPage);
    },
    totalQuestions() {
      return this.questions.length;
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
      // 境界条件の確認
      if (startIndex >= this.questions.length) {
        console.warn(
          "Start Index exceeds total questions. Adjusting to last page."
        );
        return [];
      }
      return this.questions.slice(startIndex, endIndex);
    },
    currentComment() {
      return this.pageComments[this.currentPage - 1] || "";
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
      // console.log("Current Page before next:", this.currentPage);
      const isValid = this.validateCurrentPage(); // バリデーション実行
      if (!isValid) {
        this.$nextTick(() => {
          console.log("エラーが表示されました");
        });
        return;
      }
      this.clearNextPageErrors();
      this.currentPage++; // バリデーションが成功したら次へ
      // console.log("Current Page after next:", this.currentPage); // Check the updated page
    },
    clearNextPageErrors() {
      const start = this.questionIndex + this.questionsPerPage;
      const end = start + this.questionsPerPage;
      for (let i = start; i < end; i++) {
        if (i < this.validationErrors.length) {
          this.$set(this.validationErrors, i, false);
        }
      }
    },
    validateCurrentPage() {
      let valid = true;
      for (
        let i = this.questionIndex;
        i <
        Math.min(
          this.questionIndex + this.questionsPerPage,
          this.questions.length
        );
        i++
      ) {
        if (this.answers[i] === null) {
          this.$set(this.validationErrors, i, true);
          valid = false;
        }
      }
      return valid;
    },
    prevPage() {
      // console.log("Current Page before prev:", this.currentPage);
      this.clearValidationErrors();
      this.currentPage--;
      // console.log("Current Page after prev:", this.currentPage);
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
        this.scores = {
          carb_intake: this.getCategoryScore("carb_intake"),
          fat_intake: this.getCategoryScore("fat_intake"),
          digestive_health: this.getCategoryScore("digestive_health"),
          dietary_bias: this.getCategoryScore("dietary_bias"),
          protein: this.getCategoryScore("protein"),
          mineral_balance: this.getCategoryScore("mineral_balance"),
        };
        this.$router.push({
          name: "result",
          query: {
            scores: JSON.stringify(this.scores),
            questions: JSON.stringify(this.questions),
            answers: JSON.stringify(this.answers),
          },
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
  font-size: 40px;
}

.comment-top {
  display: flex;
}

.top-img {
  width: 100px;
  margin-left: 30px;
}

.questionnaire-form {
  background-color: rgb(248, 237, 218);
  border-radius: 20px;
}

.remaining-questions {
  color: #555;
  text-align-last: end;
  margin: 0;
}

.questionnaire-label {
  max-width: 700px;
  margin: 7px auto;
  /* background-color: #f9f9f9; */
  /* border-radius: 8px; */
  /* box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1); */
  font-size: 1.1em;
  display: block;
  line-height: 3.5;
}

/* ボタン */
.button-container {
  display: flex;
  justify-content: center;
  text-align: center;
  margin: 30px auto;
  gap: 5px;
}

.back-button {
  background-color: #a3a8a3;
}

.next_page-button {
  background-color: #4caf50;
}

.back-button:hover {
  background-color: #babbba;
}

.next_page-button:hover {
  background-color: #73d176;
}

.page-button_container button {
  color: white;
  padding: 20px 43px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1.1em;
  line-height: 2.5;
  margin: 10px;
  font-weight: bold;
}

/* .page-button_container button:hover {
  background-color: #b3f0b6;
} */
.result-button_container button:hover {
  background-color: #f8abe2;
}

.result-button_container button {
  background-color: #f67dd4;
  color: rgb(245, 240, 240);
  padding: 20px 48px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1.1em;
  line-height: 2.5;
  margin: 10px;
  font-weight: bold;
}

.error-message {
  color: rgb(243, 10, 10);
  background-color: #f7d7f5;
  margin: 0 10px; /* 余白を調整 */
  display: block;
  font-size: 0.9em;
  border-radius: 5px;
  line-height: normal;
}

/* ラジオボタンとエラーメッセージを横並びにする */
.options-container {
  display: flex;
  align-items: center;
  gap: 5px;
  margin: 0 8px 10px;
}
/* ラジオボタンを隠す */
.options-container input[type="radio"] {
  display: none;
}

/* ラベルをボタンのようにスタイル */
.radio-label {
  padding: 0px 20px;
  border: 2px solid #007bff;
  border-radius: 5px;
  background-color: #eef2f6;
  color: #007bff;
  cursor: pointer;
  text-align: center;
  transition: all 0.3s ease;
  width: 50%;
  font-weight: bold;
}

/* 選択されているときのスタイル */
.options-container input[type="radio"]:checked + .radio-label {
  background-color: #007bff;
  color: #ffffff;
  border-color: #0056b3;
}

.page-comment {
  position: relative;
  display: inline-block;
  margin-left: 60px;
  padding: 16px;
  border: 2px solid #dadada;
  border-radius: 21px;
  background-color: #d1f3d2;
  text-align: center;
  font-size: 20px;
  font-weight: 400;
  line-height: 2.75;
  color: #000000;
  max-width: 270px;
}
.page-comment::before {
  content: "";
  position: absolute;
  top: 52%;
  left: 0;
  border-style: solid;
  border-width: 20px 20px 0 0;
  border-color: transparent #dadada transparent transparent;
  translate: -100% -50%;
  transform: skew(0, 22deg);
  transform-origin: right;
}

.page-comment::after {
  content: "";
  position: absolute;
  top: 52%;
  left: 0;
  border-style: solid;
  border-width: 15.2px 15.2px 0 0;
  border-color: transparent #d1f3d2 transparent transparent;
  translate: -100% calc(-50% + 0.4px);
  transform: skew(0, 22deg);
  transform-origin: right;
}

@media (max-width: 768px) {
  .questionnaire-label {
    font-size: 0.8rem;
  }
  .error-message {
    font-size: 0.8rem;
  }
}

@media (max-width: 480px) {
  .title {
    font-size: 20px;
  }

  .top-img {
    width: 80px;
    height: 70px;
    margin-left: 30px;
  }

  .page-comment {
    font-size: 10px;
    width: 130px;
    height: 20px;
    margin-left: 20px;
    line-height: 1.5;
  }

  .remaining-questions {
    font-size: 10px;
  }

  .questionnaire-label {
    font-size: 0.5rem;
    width: 97%;
  }
  .error-message {
    font-size: 0.5rem;
  }

  .page-button_container button {
    padding: 2px 10px;
    font-size: 14px;
  }
  .result-button_container button {
    padding: 2px 10px;
    font-size: 14px;
    margin: 10px;
  }
}
</style>
