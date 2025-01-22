<template>
  <div class="result">
    <div class="result-top">
      <h2 class="result-top_title">結果はこちら</h2>
    </div>
    <div class="scores">
      <RadarChart :scores="parsedScores" />
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

    <!-- <div class="result-bottom"> -->
      <!-- <NuxtLink to="/" >トップページに戻る</NuxtLink> -->
      <!-- <a href="https://forms.gle/AqgMYf2Kk15LoyjF9"
      class="more-info-btn" target="_blank" rel="noopener">
    さらに詳しく知りたい方はこちらへ
      </a>
    </div> -->
    <div class="result-bottom">
      <NuxtLink to="/" >トップページに戻る</NuxtLink>
      <a :href="generateGoogleFormUrl()"
      class="more-info-btn" target="_blank" rel="noopener">
    さらに詳しく知りたい方はこちらのアンケートへ！
      </a>
      <h3 v-if="userId">（仮）ユーザーId：{{ userId }}</h3>
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
        protein: 0,
        mineral_balance: 0,
      },
      resultTable: [],
      userId: "",
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
    this.userId = Math.random().toString(36).slice(2, 11);
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
    generateGoogleFormUrl() {
      console.log(this.userId);
      // GoogleフォームのURLとユーザーIDをパラメーターとして結合
      return `https://docs.google.com/forms/d/e/1FAIpQLSeF-5RwV3RXl6AYFWB2OiKlAyjLtFb_ir1Rda4bQd1zlwlC-A/viewform?entry.1402701286=${this.userId}`;
    // return `https://docs.google.com/forms/d/e/1FAIpQLSf1N_IZy2nQ0VbKXA-wCtXt2Gohwl22fGAXs7k58U2-1B6MUw/formResponse?entry.1709701619=${this.userId}`;
    // return `https://forms.gle/pKPoXsnyPXiDRHbk7?entry.1709701619=${encodeURIComponent(this.userId)}`;
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