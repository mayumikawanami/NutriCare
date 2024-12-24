<template>
  <div class="result">
    <div class="result-top">
      <h2 class="result-top_title">結果はこちら</h2>
    </div>
    <table class="result-table">
      <thead>
        <tr>
          <th>項目</th>
          <th>評価　</th>
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

    <div class="scores">
      <RadarChart :scores="parsedScores" />
    </div>
    <div class="result-bottom">
      <NuxtLink to="/" >トップページに戻る</NuxtLink>
      <a href="https://docs.google.com/forms/d/15FGl9uAeuHaquDOLfRS9f8CU9SG4N-swgoVbrtlCqfA/viewform?edit_requested=true" 
     class="more-info-btn" target="_blank" rel="noopener">
    さらに詳しく知りたい方はこちらへ
  </a>
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
    };
  },
  created() {
    // URLのクエリパラメータからスコアを取得
    const scores = this.$route.query.scores;
    if (scores) {
      try {
        this.parsedScores = JSON.parse(scores);
        console.log('Received scores:', this.parsedScores); // デバッグ用
        this.generateResultTable();
      } catch (error) {
        console.error('Failed to parse scores:', error);
      }
    }
  },
watch: {
    parsedScores: {
      handler() {
        this.generateResultTable();  // スコア変更時にコメントを再生成
      },
      deep: true,  // ネストされたオブジェクトも監視
    },
  },

  methods: {
    generateResultTable() {
  // 評価ロジック（スコアに応じて異なるコメントを返す）
  const gradeComment = (score, name) => {
    let grade, comment;


    // スコアに応じたコメントの処理
    switch (score) {
      case 5:
        grade = 'A';
        comment = (name === '糖質') ? '糖質コントロールもできていて、素晴らしいですね！現状の食生活を続けていきましょう。' :
                  (name === '脂質') ? 'お見事です！今後もオメガ３など良質な油を摂取し、加工食品の油の過剰には注意してください。' :
                  (name === '消化吸収') ? '消化吸収もバッチリできているようですね！食べすぎなどには注意してくださいね。' :
                  (name === '偏食') ? '偏食の心配もないようですね！バランスのよい食事を継続していきましょう！' :
                  (name === 'タンパク質') ? 'タンパク質も十分補えていそうですね！魚やお肉などバランスよく今後も食べていきましょう。' :
                  (name === 'ミネラルバランス') ? 'ミネラルもかなり意識されて、大変すばらしいです。このまま継続していきましょう。' :
                  '';
        break;
      case 4:
        grade = 'B';
        comment = (name === '糖質') ? '糖質コントロールをさらに改善できそうです。タンパク質、脂質もバランスよく摂っていきましょう。' :
                  (name === '脂質') ? '加工食品の油が少し多いかもしれません。オメガ3とオメガ6のバランスも意識してきましょう' :
                  (name === '消化吸収') ? '消化吸収には大きな問題はなさそうです。消化力を上げる食材等も取り入れていきましょう。' :
                  (name === '偏食') ? '偏食の心配が少しあるようですね。食べられるものと組み合わせて、バリエーション増やしていきましょう！' :
                  (name === 'タンパク質') ? 'タンパク質の意識ができていそうです。お肉や魚等からバランスよく食べていきましょう！' :
                  (name === 'ミネラルバランス') ? 'ミネラルも意識されて、すばらしいです！外食時等も、より意識していきましょう' :
                  '';
        break;
      case 3:
        grade = 'C';
        comment = (name === '糖質') ? '少し糖質過多になっていないか？見直してみましょう。白米、白砂糖など白を減らしましょう。' :
                  (name === '脂質') ? '加工食品での油を減らし、オメガ３など良質な油を増やすよう心掛けましょう。' :
                  (name === '消化吸収') ? '消化吸収にやや問題がある可能性があります。消化力をあげる食材を取り入れていきましょう。' :
                  (name === '偏食') ? '偏食の心配があるようです。食べられるものと組み合わせて、バリエーションを増やしましょう。' :
                  (name === 'タンパク質') ? 'タンパク質の不足が推測されます。1日に必要なたんぱく質を再度確認しましょう。' :
                  (name === 'ミネラルバランス') ? 'ミネラル不足の可能性があるかもしれません。ATM（亜鉛、鉄、マグネシウム）を意識して摂っていきましょう。' :
                  '';
        break;
      case 2:
        grade = 'D';
        comment = (name === '糖質') ? '糖質過多になっている可能性が高いです。おやつから見直して見ると良いかもしれません。' :
                  (name === '脂質') ? '脂質コントロールができていない可能性が高いです。特に加工食品の油の摂り過ぎに注意してください。' :
                  (name === '消化吸収') ? '消化吸収に問題がある可能性があります。まずは、よく噛んで消化力をあげていきましょう。' :
                  (name === '偏食') ? '偏食が心配ですね。偏食改善のポイントは、少しづつバリエーションを増やすことです。' :
                  (name === 'タンパク質') ? 'タンパク質の不足が考えられます。偏食がある場合は、食べられる食材からタンパク質の摂取を増やしていきましょう。' :
                  (name === 'ミネラルバランス') ? 'ミネラル不足の可能性があるかもしれません。ATM（亜鉛、鉄、マグネシウム）を意識して摂っていきましょう。' :
                  '';
        break;
      case 1:
        grade = 'E';
        comment = (name === '糖質') ? '今後追加。' :
                  (name === '脂質') ? '今後追加。' :
                  (name === '消化吸収') ? '今後追加。' :
                  (name === '偏食') ? '今後追加。' :
                  (name === 'タンパク質') ? '今後追加。' :
                  (name === 'ミネラルバランス') ? '今後追加。' :
                  '';
        break;
      case 0:
        grade = 'F';
        comment = (name === '糖質') ? '今後追加。' :
                  (name === '脂質') ? '今後追加。' :
                  (name === '消化吸収') ? '今後追加。' :
                  (name === '偏食') ? '今後追加。' :
                  (name === 'タンパク質') ? '今後追加。' :
                  (name === 'ミネラルバランス') ? '今後追加。' :
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
  }
  },
};
</script>

<style scoped>
/* 結果セクション */
.result-top {
  text-align: left;
  margin-top: 10px;
  width: 50%;
}
.advice{
  margin: 0;
  /* color: #fff; */
}
.result-top_title{
  margin: 5px;
  /* text-align: center; */
}

.scores {
  margin: 30px auto 50px;
  max-width: 500px;

    @media (max-width: 480px) {
      margin: 0;
  }
}

.result {
  text-align: center;
  max-width: 800px; /* フォームの幅を制限して見やすく */
  margin: 20px auto; /* 自動で中央揃え */
  padding:10px 50px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 軽い影を付けて浮き上がらせる */
    @media (max-width: 768px) {
      padding: 20px;
  }

    @media (max-width: 480px) {
      padding: 10px;
      margin: 0;
  }

}

/* .result-bottom a {
  text-decoration: none;
  background-color: blue;
  color: white;
  padding: 5px;
  border-radius: 10px;
} */

.more-info-btn {
  background-color: #4CAF50; /* ボタンの色 */
  padding: 8px 20px;
  border-radius: 10px;
  color: white;
  font-size: 14px;
  display: inline-block;
  text-align: center;
  text-decoration: none; /* 下線を削除 */
  transition: background-color 0.3s ease;
  margin-left: 10px; /* トップページリンクとの間隔 */
}

.more-info-btn:hover {
  background-color: #45a049; /* ホバー時の色 */
}

.result-table {
  width: 100%;
  margin-top: 20px;
  border-collapse: collapse;
  font-size: 14px;
  border-radius: 10px;

  @media (max-width: 480px) {
    font-size: 0.5rem;
    margin-top: 0;
  }
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