<template>
  <div class="result">
    <div class="result-top">
      <h2 class="result-top_title">結果はこちら</h2>
    </div>
    <div class="scores">
      <RadarChart :scores="parsedScores" />
    </div>
    <div class="scores-modal">
      <button @click="showModal = true" class="scores-modal_button">回答を振り返る</button>
      <div
        v-if="showModal"
        class="scores-modal_content"
        :class="{ visible: showModal }"
        >
        <div class="scores-modal_list">
          <button @click="showModal = false" class="scores-modal_exit-button">閉じる</button>
          <ResultPage :answers="answers" />
        </div>
      </div>

    </div>
    <table class="result-table">
      <thead>
        <tr>
          <th>項目</th>
          <th>評価</th>
          <th>コメント</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in resultTable" :key="index" :class="'grade-' + item.grade">
          <td>{{ item.name }}</td>
          <td>{{ item.grade }}</td>
          <td class="justify-text">{{ item.comment }}</td>
        </tr>
      </tbody>
    </table>
    <p class="comment">
      ※この結果はあくまで推測であり断定ではありませんので〇〇〇〇
    </p>
    <NuxtLink to="/" >トップページに戻る</NuxtLink>

    <!-- <div class="result-bottom"> -->
      <!-- <NuxtLink to="/" >トップページに戻る</NuxtLink> -->
      <!-- <a href="https://forms.gle/AqgMYf2Kk15LoyjF9"
      class="more-info-btn" target="_blank" rel="noopener">
    さらに詳しく知りたい方はこちらへ
      </a>
    </div> -->
    <div>
      <button @click="openModal" class="open-modal-btn">
      さらに詳しく知りたい方はこちらをクリック！
    </button>
      <div v-if="isModalOpen" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <button class="close-modal-btn" @click="closeModal">×</button>
        <div class="result-bottom">
          <form @submit.prevent="generateGoogleFormLink" class="name-form">
            <p class="modal-title">次のアンケートにお答えいただくと〇〇〇〇です！<br>まずあなたのLINE名を入力して入力完了をクリックしてください！</p>
            <label class="name-form_label">LINE名：
              <input
              type="text"
              id="username"
              name="username"
              v-model="userName"
              placeholder="例: momoko"
              required
              autocomplete="username"
              :readonly="isSubmitted"
              />
            </label>
              <div class="name-form_buttons">
                <button class="name-form_button" type="submit" :disabled="isSubmitted">{{ buttonText }}</button>
                <button class="name-form_edit-button" v-if="isSubmitted" @click="enableEditing">名前を編集</button>
              </div>
          </form>
          <div v-if="googleFormLink">
            <a :href="googleFormLink" class="more-info-btn" target="_blank" rel="noopener">さらに詳しく知りたい方はこちらから</a>
          </div>
        </div>
      </div>
      </div>
    </div>
  </div>
</template>

<script>
import RadarChart from '@/components/RadarChart.vue';
import ResultPage from '@/components/ResultPage.vue';
export default {
  components: {
    RadarChart,
    ResultPage
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
      showModal: false,
      isModalOpen: false,
      answers:[],
      userName: "",
      buttonText: "入力完了",
      isSubmitted: false,
      googleFormLink: "",
      // userId: "",
    };
  },
  created() {
    const scores = this.$route.query.scores;
    if (scores) {
      try {
        this.parsedScores = JSON.parse(scores);
        // console.log('Received scores:', this.parsedScores); // デバッグ用
        this.generateResultTable();
      } catch (error) {
        console.error('Failed to parse scores:', error);
      }
    }
    // this.userId = Math.random().toString(36).slice(2, 11);
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
        grade = 'A';
        comment = (name === '糖質') ? '糖質コントロールがうまくできていそうです。現状の食生活を続けていきましょう！' :
                  (name === '脂質') ? '脂質コントロールは、問題なさそうです。今後もオメガ３等の摂取をしていって下さい！' :
                  (name === '消化吸収') ? '消化吸収もバッチリできていそうです。食べすぎなどには注意してくださいね！' :
                  (name === '偏食') ? '偏食の心配もないようです。バランスのよい食事を継続していきましょう！' :
                  (name === 'タンパク質') ? 'タンパク質摂取への意識は高そうですね。今後も、魚や肉をバランスよく食べていきましょう！' :
                  (name === 'ミネラルバランス') ? 'ミネラルもかなり意識できていそうですね。このまま継続していきましょう！' :
                  '';
        break;
      case 4:
        grade = 'B';
        comment = (name === '糖質') ? '糖質コントロールをさらに改善できそうです。タンパク質、脂質もバランスよく摂っていきましょう。' :
                  (name === '脂質') ? '加工食品の油が少し多いかもしれません。オメガ3とオメガ6のバランスも意識していきましょう' :
                  (name === '消化吸収') ? '消化吸収には大きな問題はなさそうです。消化力を上げる食材等も取り入れていきましょう。' :
                  (name === '偏食') ? '偏食の心配が少しありそうですね。バリエーションを増やしていきましょう。' :
                  (name === 'タンパク質') ? 'タンパク質の意識は、概ね問題なさそうです。肉や魚等からバランスよく食べていきましょう。' :
                  (name === 'ミネラルバランス') ? 'ミネラルも意識できていそうですね。外食時等も、より意識して摂りましょう。' :
                  '';
        break;
      case 3:
        grade = 'C';
        comment = (name === '糖質') ? '少し糖質過多になっていないか？見直してみましょう。白米、白砂糖など白を減らしましょう。' :
                  (name === '脂質') ? '加工食品に多いオメガ６の油を減らし、オメガ３など良質な油を増やすよう心掛けましょう。' :
                  (name === '消化吸収') ? '消化吸収に、やや問題がある可能性があります。消化力をあげる食材を取り入れていきましょう。' :
                  (name === '偏食') ? '偏食の心配がありそうですね。香辛料などを使って食べられる量を増やしていきましょう。' :
                  (name === 'タンパク質') ? 'タンパク質の不足があるかもしれません。1日に必要なたんぱく質を再度確認しましょう。' :
                  (name === 'ミネラルバランス') ? 'ミネラル不足の可能性があるかもしれません。ATM（亜鉛、鉄、マグネシウム）を意識して摂っていきましょう。' :
                  '';
        break;
      case 2:
        grade = 'D';
        comment = (name === '糖質') ? '糖質過多になっている可能性が高いです。おやつから見直して見ると良いかもしれません。' :
                  (name === '脂質') ? '脂質コントロールができていない可能性が高いです。特に加工食品の油の摂り過ぎに注意してください。' :
                  (name === '消化吸収') ? '消化吸収に問題がある可能性があります。まずは、よく噛んで消化力をあげていきましょう。' :
                  (name === '偏食') ? '偏食が心配なようですね。味覚、嗅覚を変えて食べられる量を増やしていきましょう。' :
                  (name === 'タンパク質') ? 'ややタンパク質不足かもしれません。食べられる食材からタンパク質の摂取を増やしていきましょう。' :
                  (name === 'ミネラルバランス') ? 'ややミネラル不足の可能性があるかもしれません。特に、ATM（亜鉛、鉄、マグネシウム）のために動物性たんぱく質や海藻などを摂っていきましょう。' :
                  '';
        break;
      case 1:
        grade = 'E';
        comment = (name === '糖質') ? '糖質過多の傾向が強い可能性があります。砂糖、ジュース、主食（白米等）を見直しましょう。' :
                  (name === '脂質') ? '脂質コントロール不足の可能性が極めて高いです。冷凍食品等の加工油を、まずは減らしていきましょう。' :
                  (name === '消化吸収') ? '消化吸収に大いに問題がある可能性があります。１口で３０回噛むことから始めてみてください。' :
                  (name === '偏食') ? '偏食がかなり心配なようですね。香辛料、酸味のあるものなどを追加して、まずは食欲UPにアプローチしていきましょう。' :
                  (name === 'タンパク質') ? 'かなりタンパク質不足の可能性があるかもしれません。偏食がある場合は、食べられる食材からタンパク質の摂取を増やしていきましょう。' :
                  (name === 'ミネラルバランス') ? 'かなりミネラル不足の可能性があるかもしれません。鉄や亜鉛が多い動物性食品やマグネシウムが多い食材を積極的に摂っていきましょう。' :
                  '';
        break;
      case 0:
        grade = 'F';
        comment = (name === '糖質') ? '糖質過多の傾向が強い可能性があります。今すぐお菓子や主食を見直しましょう！' :
                  (name === '脂質') ? '脂質コントロール不足の可能性が極めて高いです。今すぐ家で使用している油等を見直しましょう！' :
                  (name === '消化吸収') ? '消化吸収に大いに問題がある可能性があります。まずは、よく噛む等、消化力を上げる取り組みを今すぐ実行しましょう！' :
                  (name === '偏食') ? '偏食がかなり心配なようです。とにかく、料理のバリエーションを増やす取り組みをしていきましょう！' :
                  (name === 'タンパク質') ? 'かなりタンパク質不足の可能性があるかもしれません。１日に必要なたんぱく質を確認し、今すぐ全体の食事を改善していきましょう！' :
                  (name === 'ミネラルバランス') ? 'かなりミネラル不足の可能性があるかもしれません。ATM(亜鉛、鉄、マグネシウム）を摂れる食事ができるよう今すぐ見直しましょう！' :
                  '';
        break;
      default:
        grade = '不明';
        comment = '評価できませんでした';
    }

    return { grade, comment };
  };

  // 項目ごとの結果を生成
  const scores = this.parsedScores;
  this.resultTable = [
    { name: '糖質', ...gradeComment(scores.carb_intake, '糖質') },
    { name: '脂質', ...gradeComment(scores.fat_intake, '脂質') },
    { name: '消化吸収', ...gradeComment(scores.digestive_health, '消化吸収') },
    { name: '偏食', ...gradeComment(scores.dietary_bias, '偏食') },
    { name: 'タンパク質', ...gradeComment(scores.protein, 'タンパク質') },
    { name: 'ミネラルバランス', ...gradeComment(scores.mineral_balance, 'ミネラルバランス') },
  ];
    },
    generateGoogleFormLink() {
      this.buttonText = '入力済み';
      this.isSubmitted = true;

      const formBaseUrl =
        "https://docs.google.com/forms/d/e/1FAIpQLSfAES3vt6kTtoAVInRyuKE7NTcYakrILPf_tfhNyo2qaCCCgw/viewform";
      // "https://docs.google.com/forms/d/e/1FAIpQLSeF-5RwV3RXl6AYFWB2OiKlAyjLtFb_ir1Rda4bQd1zlwlC-A/viewform";

      const userName = this.userName || "未入力";
        if (!this.parsedScores) {
          console.error("parsedScoresが未定義です");
          return null;
        }

      const params = new URLSearchParams({
        "entry.1441176113": this.userName,
        "entry.2039548743": `糖質: ${this.parsedScores.carb_intake}, 脂質: ${this.parsedScores.fat_intake}, 消化吸収: ${this.parsedScores.digestive_health}, 偏食: ${this.parsedScores.dietary_bias}, タンパク質: ${this.parsedScores.protein}, ミネラルバランス: ${this.parsedScores.mineral_balance}`,
      });

      this.googleFormLink = `${formBaseUrl}?${params.toString()}`;
    },
    enableEditing() {
      this.isSubmitted = false;
      this.buttonText = '入力完了';
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
  text-align: left;
  margin-top: 10px;
  width: 50%;
}
.advice{
  margin: 0;
}
.result-top_title{
  font-size: 2.0rem;
  margin: 5px;
}

.scores {
  margin: 10px auto;
  max-width: 500px;
}

.result {
  text-align: center;
  width: 80%;
  margin: 5px auto;
  padding:10px 50px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.more-info-btn {
  background-color: #4CAF50;
  padding: 8px 20px;
  border-radius: 10px;
  color: white;
  font-size: 14px;
  display: inline-block;
  text-align: center;
  text-decoration: none;
  transition: background-color 0.3s ease;
  margin-left: 10px;
}

.more-info-btn:hover {
  background-color: #45a049;
}

.result-table {
  width: 100%;
  margin-bottom: 30px;
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

.comment{
  text-align: justify;

  margin-top: -24px;
}

/* 回答詳細のモーダル*/
.scores-modal {
  margin-bottom: 5px;
}

/* 結果を見るボタン */
.scores-modal_button {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

.scores-modal_button:hover {
  background-color: #45a049;
}

/* モーダルのコンテンツ（表示エリア） */
.scores-modal_content {
  position: fixed;
  top: 80px;
  left: 0;
  width: 100%;
  height: 100%;
  /* background-color: rgba(245, 239, 239, 0.5); 半透明の背景 */
  display: flex;
  justify-content:end;
  z-index: 999;
  opacity: 1;
}

.scores-modal_content[style*="display: block"] {
  opacity: 1;
  pointer-events: auto;
  visibility: visible;
}

/* モーダル内のリスト */
.scores-modal_list {
  background-color: #fff;
  border-radius: 10px;
  padding: 20px;
  width: 80%;
  max-width: 700px;
  max-height: 75%;
  overflow-y: auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* 閉じるボタン */
.scores-modal_exit-button {
  background-color: #3a98fc;
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  border-radius: 5px;
  margin-bottom: 20px;
  transition: background-color 0.3s ease;
}

.scores-modal_exit-button:hover {
  background-color: #0179f8;
}



/* Googleフォームへのモーダル */
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
  flex-direction: column; /* 縦方向に配置 */
  align-items: flex-start;
  gap: 0.2rem; /* 各要素間の間隔 */
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}

/* ラベルスタイル */
.name-form_label {
  font-size: 0.9rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem; /* 入力フィールドとの間隔 */
}

/* 入力フィールド */
.name-form input {
  width: 97%; /* 入力フィールドを横幅いっぱいに */
  padding: 0.5rem;
  font-size: 0.9rem;
  border: 1px solid #ccc;
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
  gap: 0.5rem; /* ボタン間の隙間 */
  margin-top: 1rem; /* フォームとの余白 */
  text-align: center;
}

/* ボタン共通スタイル */
.name-form_button,
.name-form_edit-button {
  padding: 0.5rem 2rem;
  font-size: 0.9rem;
  font-weight: 600;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  white-space: nowrap;
}

/* 送信ボタン */
.name-form_button {
  background: #007bff;
  color: #fff;
}

.name-form_button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.name-form_button:hover:not(:disabled) {
  background: #0056b3;
}

/* 編集ボタン */
.name-form_edit-button {
  background: #28a745;
  color: #fff;
}

.name-form_edit-button:hover {
  background: #218838;
}

/* 詳細リンクボタン */
.more-info-btn {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  font-weight: 600;
  background: #17a2b8;
  color: #fff;
  text-decoration: none;
  border-radius: 4px;
  text-align: center;
  display: inline-block;
  transition: background-color 0.3s;
}

.more-info-btn:hover {
  background: #138496;
}

/* モーダルの背景 */
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

/* モーダルの中身 */
.modal-content {
  background: #fff;
  padding: 1.5rem;
  border-radius: 8px;
  max-width: 600px;
  width: 90%;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: relative;
}

/* モーダルを閉じるボタン */
.close-modal-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
}

/* 名前入力フォーム */
.name-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.name-form_label {
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.name-form input {
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.name-form_buttons {
  display: flex;
  gap: 0.5rem;
}

.open-modal-btn {
  padding: 0.5rem 1rem;
  background: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.open-modal-btn:hover {
  background: #0056b3;
}

@media (max-width: 768px) {
    .result {
        padding: 20px;
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
    .result-top_title{
      font-size: 1.0rem;
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