<template>
  <div class="result">
    <div class="result-top">
      <img
        src="images/kei_smile.png"
        alt="kei_smile"
        class="result_top-img"
      />
      <h2 class="result-top_title">結果はこちらです</h2>
    </div>
    <div class="scores">
      <RadarChart :scores="parsedScores" />
    </div>
    <!-- <div class="scores-modal">
      <button @click="showModal = true" class="scores-modal_button">
        回答を振り返る
      </button>
      <div
        v-if="showModal"
        class="scores-modal_content"
        :class="{ visible: showModal }"
      >
        <div class="scores-modal_list">
          <button @click="showModal = false" class="scores-modal_exit-button">
            閉じる
          </button> -->
    <!-- <ResultPage :answers="answers" /> -->
    <!-- </div>
      </div>
    </div> -->
    <table class="result-table">
      <thead>
        <tr>
          <th>項目</th>
          <th>評価</th>
          <th>コメント</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(item, index) in resultTable"
          :key="index"
          :class="'grade-' + item.grade"
        >
          <td>{{ item.name }}</td>
          <td>{{ item.grade }}</td>
          <td class="justify-text">{{ item.comment }}</td>
        </tr>
      </tbody>
    </table>
    <div class="comment">
      <p class="comment-first">※（注意）：この結果はあくまで推測です。</p>
      <span class="comment-second"
        >「さらに詳しく知りたい方は、コチラ」へどうぞ</span
      >
      <span class="comment-arrow"></span>
    </div>

    <!-- <NuxtLink to="/">仮ボタン</NuxtLink> -->

    <div>
      <button @click="openModal" class="open-modal-btn">
        さらに詳しく知りたい方は、コチラ
      </button>
      <div v-if="isModalOpen" class="modal-overlay" @click.self="closeModal">
        <div class="modal-content">
          <button class="close-modal-btn" @click="closeModal">×</button>
          <div class="result-bottom">
            <form @submit.prevent="generateGoogleFormLink" class="name-form">
              <p class="modal-title">
                まず、あなたのLINE名をいれ、入力完了をクリック！<br />次のアンケートにお答えいただくと、
              </p>
              <p class="modal-title_movie">
                <span class="modal-title_span"> あなた専用の動画</span
                >が作成できます!
              </p>
              <label class="name-form_label">
                <input
                  type="text"
                  id="username"
                  name="username"
                  v-model="userName"
                  placeholder="こちらにLINE名を入力してください"
                  required
                  autocomplete="username"
                  :readonly="isSubmitted"
                />
              </label>
              <div class="name-form_buttons">
                <button
                  class="name-form_button"
                  type="submit"
                  :disabled="isSubmitted"
                >
                  {{ buttonText }}
                </button>
                <button
                  class="name-form_edit-button"
                  v-if="isSubmitted"
                  @click="enableEditing"
                >
                  名前を編集
                </button>
              </div>
            </form>
            <div v-if="googleFormLink">
              <a
                :href="googleFormLink"
                class="more-info-btn"
                target="_blank"
                rel="noopener"
                >次のアンケートに進む</a
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import RadarChart from "@/components/RadarChart.vue";
import ResultPage from "@/components/ResultPage.vue";
export default {
  components: {
    RadarChart,
    ResultPage,
  },
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
      resultTable: [],
      isModalOpen: false,
      answers: [],
      questions: [],
      userName: "",
      buttonText: "入力完了",
      isSubmitted: false,
      googleFormLink: "",
    };
  },
  created() {
    const scores = this.$route.query.scores;
    this.questions = JSON.parse(this.$route.query.questions || "[]");
    const rawAnswers = JSON.parse(this.$route.query.answers || "[]");
    this.answers = rawAnswers
      .map((value, index) => {
        const answerText = `${index + 1}.${this.questions[index].text}: ${
          value === 0 ? "はい" : "いいえ"
        }`;
        if (index === rawAnswers.length - 1) {
          return answerText;
        } else {
          return answerText + " \n";
        }
      })
      .join("");

    if (scores) {
      try {
        this.parsedScores = JSON.parse(scores);
        this.generateResultTable();
      } catch (error) {
        console.error("Failed to parse scores:", error);
      }
    }
  },
  watch: {
    parsedScores: {
      handler() {
        this.generateResultTable();
      },
      deep: true,
    },
  },

  methods: {
    generateResultTable() {
      const gradeComment = (score, name) => {
        let grade, comment;

        switch (score) {
          case 5:
            grade = "A";
            comment =
              name === "糖質"
                ? "糖質コントロールがうまくできていそうです。現状の食生活を続けていきましょう！"
                : name === "脂質"
                ? "脂質コントロールは、問題なさそうです。今後もオメガ３等の摂取をしていって下さい！"
                : name === "消化吸収"
                ? "消化吸収もバッチリできていそうです。食べすぎなどには注意してくださいね！"
                : name === "偏食"
                ? "偏食の心配もないようです。バランスのよい食事を継続していきましょう！"
                : name === "タンパク質"
                ? "タンパク質摂取への意識は高そうですね。今後も、魚や肉をバランスよく食べていきましょう！"
                : name === "ミネラルバランス"
                ? "ミネラルもかなり意識できていそうですね。このまま継続していきましょう！"
                : "";
            break;
          case 4:
            grade = "B";
            comment =
              name === "糖質"
                ? "糖質コントロールをさらに改善できそうです。タンパク質、脂質もバランスよく摂っていきましょう。"
                : name === "脂質"
                ? "加工食品の油が少し多いかもしれません。オメガ3とオメガ6のバランスも意識していきましょう"
                : name === "消化吸収"
                ? "消化吸収には大きな問題はなさそうです。消化力を上げる食材等も取り入れていきましょう。"
                : name === "偏食"
                ? "偏食の心配が少しありそうですね。バリエーションを増やしていきましょう。"
                : name === "タンパク質"
                ? "タンパク質の意識は、概ね問題なさそうです。肉や魚等からバランスよく食べていきましょう。"
                : name === "ミネラルバランス"
                ? "ミネラルも意識できていそうですね。外食時等も、より意識して摂りましょう。"
                : "";
            break;
          case 3:
            grade = "C";
            comment =
              name === "糖質"
                ? "少し糖質過多になっていないか？見直してみましょう。白米、白砂糖など白を減らしましょう。"
                : name === "脂質"
                ? "加工食品に多いオメガ６の油を減らし、オメガ３など良質な油を増やすよう心掛けましょう。"
                : name === "消化吸収"
                ? "消化吸収に、やや問題がある可能性があります。消化力をあげる食材を取り入れていきましょう。"
                : name === "偏食"
                ? "偏食の心配がありそうですね。香辛料などを使って食べられる量を増やしていきましょう。"
                : name === "タンパク質"
                ? "タンパク質の不足があるかもしれません。1日に必要なたんぱく質を再度確認しましょう。"
                : name === "ミネラルバランス"
                ? "ミネラル不足の可能性があるかもしれません。ATM（亜鉛、鉄、マグネシウム）を意識して摂っていきましょう。"
                : "";
            break;
          case 2:
            grade = "D";
            comment =
              name === "糖質"
                ? "糖質過多になっている可能性が高いです。おやつから見直して見ると良いかもしれません。"
                : name === "脂質"
                ? "脂質コントロールができていない可能性が高いです。特に加工食品の油の摂り過ぎに注意してください。"
                : name === "消化吸収"
                ? "消化吸収に問題がある可能性があります。まずは、よく噛んで消化力をあげていきましょう。"
                : name === "偏食"
                ? "偏食が心配なようですね。味覚、嗅覚を変えて食べられる量を増やしていきましょう。"
                : name === "タンパク質"
                ? "ややタンパク質不足かもしれません。食べられる食材からタンパク質の摂取を増やしていきましょう。"
                : name === "ミネラルバランス"
                ? "ややミネラル不足の可能性があるかもしれません。特に、ATM（亜鉛、鉄、マグネシウム）のために動物性たんぱく質や海藻などを摂っていきましょう。"
                : "";
            break;
          case 1:
            grade = "E";
            comment =
              name === "糖質"
                ? "糖質過多の傾向が強い可能性があります。砂糖、ジュース、主食（白米等）を見直しましょう。"
                : name === "脂質"
                ? "脂質コントロール不足の可能性が極めて高いです。冷凍食品等の加工油を、まずは減らしていきましょう。"
                : name === "消化吸収"
                ? "消化吸収に大いに問題がある可能性があります。１口で３０回噛むことから始めてみてください。"
                : name === "偏食"
                ? "偏食がかなり心配なようですね。香辛料、酸味のあるものなどを追加して、まずは食欲UPにアプローチしていきましょう。"
                : name === "タンパク質"
                ? "かなりタンパク質不足の可能性があるかもしれません。偏食がある場合は、食べられる食材からタンパク質の摂取を増やしていきましょう。"
                : name === "ミネラルバランス"
                ? "かなりミネラル不足の可能性があるかもしれません。鉄や亜鉛が多い動物性食品やマグネシウムが多い食材を積極的に摂っていきましょう。"
                : "";
            break;
          case 0:
            grade = "F";
            comment =
              name === "糖質"
                ? "糖質過多の傾向が強い可能性があります。今すぐお菓子や主食を見直しましょう！"
                : name === "脂質"
                ? "脂質コントロール不足の可能性が極めて高いです。今すぐ家で使用している油等を見直しましょう！"
                : name === "消化吸収"
                ? "消化吸収に大いに問題がある可能性があります。まずは、よく噛む等、消化力を上げる取り組みを今すぐ実行しましょう！"
                : name === "偏食"
                ? "偏食がかなり心配なようです。とにかく、料理のバリエーションを増やす取り組みをしていきましょう！"
                : name === "タンパク質"
                ? "かなりタンパク質不足の可能性があるかもしれません。１日に必要なたんぱく質を確認し、今すぐ全体の食事を改善していきましょう！"
                : name === "ミネラルバランス"
                ? "かなりミネラル不足の可能性があるかもしれません。ATM(亜鉛、鉄、マグネシウム）を摂れる食事ができるよう今すぐ見直しましょう！"
                : "";
            break;
          default:
            grade = "不明";
            comment = "評価できませんでした";
        }

        return { grade, comment };
      };

      const scores = this.parsedScores;
      this.resultTable = [
        { name: "糖質", ...gradeComment(scores.carb_intake, "糖質") },
        { name: "脂質", ...gradeComment(scores.fat_intake, "脂質") },
        {
          name: "消化吸収",
          ...gradeComment(scores.digestive_health, "消化吸収"),
        },
        { name: "偏食", ...gradeComment(scores.dietary_bias, "偏食") },
        { name: "タンパク質", ...gradeComment(scores.protein, "タンパク質") },
        {
          name: "ミネラルバランス",
          ...gradeComment(scores.mineral_balance, "ミネラルバランス"),
        },
      ];
    },
    generateGoogleFormLink() {
      this.buttonText = "入力済み";
      this.isSubmitted = true;
      const formBaseUrl =
        "https://docs.google.com/forms/d/e/1FAIpQLSfvEPGiFPfr-A7lHPLd-TQyBR-dzqE6GPJhRDxwB0AeZ92iHA/viewform";

      const userName = this.userName || "未入力";
      if (!this.parsedScores) {
        console.error("parsedScoresが未定義です");
        return null;
      }

      const formattedQA = this.answers;

      const params = new URLSearchParams({
        "entry.1402701286": this.userName,
        "entry.1196152437": `・糖質 ${this.parsedScores.carb_intake} ・脂質 ${this.parsedScores.fat_intake} ・消化吸収 ${this.parsedScores.digestive_health} ・偏食 ${this.parsedScores.dietary_bias}  ・タンパク質 ${this.parsedScores.protein} ・ミネラルバランス ${this.parsedScores.mineral_balance}`,
        "entry.2140904827": formattedQA,
      });

      this.googleFormLink = `${formBaseUrl}?${params.toString()}`;
    },
    enableEditing() {
      this.isSubmitted = false;
      this.buttonText = "入力完了";
      this.googleFormLink = false;
    },
    openModal() {
      this.isModalOpen = true;
    },
    closeModal() {
      this.isModalOpen = false;
    },
  },
};
</script>

<style scoped>
.result-top {
  display: flex;
  margin-top: 10px;
}

.result_top-img {
  width: 100px;
}

.advice {
  margin: 0;
}
/* .result-top_title {
  font-size: 2rem;
  margin-left: 20px;
} */

.result-top_title {
  position: relative;
  display: inline-block;
  margin: 0 30px;
  padding: 0 33px;
  border: 2px solid #616060;
  border-radius: 21px;
  background-color: #fce4cd;
  text-align: center;
  font-size: 33px;
  font-weight: 600;
  line-height: 2.75;
  color: #000000;
  max-width: 270px;
}
.result-top_title::before {
  content: "";
  position: absolute;
  top: 52%;
  left: 0;
  border-style: solid;
  border-width: 20px 20px 0 0;
  border-color: transparent #616060 transparent transparent;
  translate: -100% -50%;
  transform: skew(0, 22deg);
  transform-origin: right;
}

.result-top_title::after {
  content: "";
  position: absolute;
  top: 52%;
  left: 0;
  border-style: solid;
  border-width: 15.2px 15.2px 0 0;
  border-color: transparent #fce4cd transparent transparent;
  translate: -100% calc(-50% + 0.4px);
  transform: skew(0, 22deg);
  transform-origin: right;
}

.scores {
  margin: 10px auto;
  max-width: 500px;
}

.result {
  text-align: center;
  width: 80%;
  margin: 5px auto;
  padding: 10px 50px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.result-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 18px;
  border-radius: 10px;
}

.result-table th,
.result-table td {
  border: 1px solid #ccc;
  padding: 8px;
  text-align: center;
}

.result-table th {
  background-color: #ddd;
}

.result-table td.justify-text {
  text-align: justify;
}

.result-table tr:nth-child(even) {
  background-color: #e8f8e1;
}

.comment-first {
  text-align: justify;
  margin-top: 0;
}

.comment-second {
  text-align: center;
  font-size: 22px;
  margin-top: 10px;
  background-image: linear-gradient(0deg, #ffca4380 0.5em, transparent 0.5em);
}

.comment-arrow {
  display: block;
  margin: 5px auto;
  width: 200px;
  height: 40px;
  background: linear-gradient(90deg, #f3af04 0%, #e8f655 100%);
  clip-path: polygon(
    0 34.9%,
    23.4% 34.9%,
    23.4% 0,
    76.6% 0,
    76.6% 34.9%,
    100% 34.9%,
    50% 100%
  );
}

.modal-title {
  margin: 0;
  font-size: 20px;
  line-height: 2;
}
.modal-title_movie {
  font-size: 20px;
  margin: 0;
}

.modal-title_span {
  font-size: 25px;
  font-weight: bold;
  background-image: linear-gradient(0deg, #90f50280 0.8em, transparent 0.5em);
}

.result-bottom {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 1.5rem auto;
  padding: 1rem;
  background: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
  max-width: 600px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.name-form {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}

.name-form_label {
  font-size: 0.9rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
}

.name-form input {
  width: 70%;
  margin-top: 20px;
  padding: 0.5rem;
  font-size: 1.1rem;
  border: 2px solid #ccc;
  border-radius: 4px;
  transition: border-color 0.3s;
}

.name-form input:focus {
  border-color: #007bff;
}

.name-form input[readonly] {
  background: #f0f0f0;
  cursor: not-allowed;
}

.name-form_buttons {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
  text-align: center;
  margin: 0 auto;
}

.name-form_button,
.name-form_edit-button {
  padding: 0.5rem 3.5rem;
  font-size: 1.1rem;
  font-weight: 600;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  white-space: nowrap;
}

.name-form_button {
  background: #007bff;
  color: #fff;
}

.name-form_button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.name-form_button:hover:not(:disabled) {
  background: #57a3f5;
}

.name-form_edit-button {
  background: #28a745;
  color: #fff;
}

.name-form_edit-button:hover {
  background: #98d6a6;
}

.more-info-btn {
  display: block;
  text-align: center;
  text-decoration: none;
  margin-top: 10px;
  padding: 1rem 6rem;
  font-weight: bold;
  font-size: 23px;
  background: #f58b22;
  border: 6px outset #f58b22;
  color: #fff;
  transition: 0.5s;
}

.more-info-btn:hover {
  background: #f58b22;
  border: 6px outset #dc8023;
  color: #502801;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: #fff;
  padding: 1.5rem;
  border-radius: 8px;
  max-width: 600px;
  width: 90%;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: relative;
}

.close-modal-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
}

.open-modal-btn {
  display: block;
  text-align: center;
  text-decoration: none;
  margin: auto;
  padding: 1rem 4rem;
  font-size: 20px;
  font-weight: bold;
  border: 2px solid #f58b22;
  background: #f58b22;
  color: #fff;
  border-radius: 5px;
  transition: 0.5s;
  animation: move_d 2s infinite;
  box-shadow: 0 5px 0 rgb(241, 109, 1);
  position: relative;
  cursor: pointer;
}
@keyframes move_d {
  0% {
    box-shadow: 0 5px 0 rgb(241, 109, 1);
    top: 0px;
  }
  10% {
    box-shadow: 0 0 0 rgb(241, 109, 1);
    top: 5px;
  }
  20% {
    box-shadow: 0 5px 0 rgb(241, 109, 1);
    top: 0px;
  }
  30% {
    box-shadow: 0 0 0 rgb(241, 109, 1);
    top: 5px;
  }
  40% {
    box-shadow: 0 5px 0 rgb(241, 109, 1);
    top: 0px;
  }
}

.open-modal-btn:hover {
  color: #502801;
  background: #f58b22;
  border: 2px solid #f58b22;
}

@media (max-width: 768px) {
  .result {
    padding: 20px;
  }
  .result-top_title {
    padding: 0px 20px;
    font-size: 22px;
    line-height: 3.5;
  }
  .result_top-img {
    width: 80px;
    height: 83px;
  }
}
@media (max-width: 480px) {
  .scores {
    margin: 0;
  }
  .result-table {
    font-size: 0.5rem;
    margin-top: 0;
  }
  .result {
    padding: 10px;
  }
  .result-top_title {
    font-size: 0.7rem;
    padding: 0px 14px;
    border-radius: 10px;
  }
  .result_top-img {
    width: 17%;
    height: auto;
  }

  .open-modal-btn {
    font-size: 9px;
    padding: 1rem 2rem;
  }

  .comment-first {
    font-size: 9px;
  }

  .comment-second {
    font-size: 11px;
  }

  .comment-arrow {
    width: 100px;
  }
  .modal-title {
    font-size: 9px;
  }

  .modal-title_movie {
    font-size: 9px;
  }

  .name-form input {
    font-size: 10px;
  }

  .name-form_button {
    font-size: 12px;
    padding: 10px 30px;
  }

  .name-form_edit-button {
    font-size: 12px;
    padding: 10px 30px;
  }

  .more-info-btn {
    font-size: 15px;
    padding: 11px 37px;
  }

  .modal-title_span {
    font-size: 14px;
  }
}
/* .grade-A {
  background-color: #cbf9c5;
}

.grade-B {
  background-color: #cbf9c5;
}

.grade-C {
  background-color: #e1f7aa;
}

.grade-D {
  background-color: #f5c6cb;
}

.grade-E {
  background-color: #f5c6cb;
} */
</style>
