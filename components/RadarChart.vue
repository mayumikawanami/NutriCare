<template>
  <div>
    <canvas ref="radarCanvas"></canvas>
  </div>
</template>

<script>
import { Chart as ChartJS, Title, Tooltip, Legend, RadialLinearScale, PointElement, LineElement, RadarController } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, RadialLinearScale, PointElement, LineElement, RadarController);

export default {
  props: ['scores', 'questions'],
  mounted() {
    this.renderChart();
  },
  watch: {
    scores: {
          handler() {
        //console.log('Received scores:', this.scores); // Add this line for debugging
        this.renderChart();
      },
      deep: true,
    },
  },
  methods: {
    renderChart() {
      const ctx = this.$refs.radarCanvas.getContext('2d');

      // 古いチャートがある場合は破棄
      if (this.chart) {
        this.chart.destroy();
      }

      // オブジェクト形式のスコアを配列に変換
      const scoreArray = [
        this.scores.circulatory,
        this.scores.adrenal_fatigue,
        this.scores.hypothyroidism,
        this.scores.hyperthyroidism,
        this.scores.liver_function,
        this.scores.hypoglycemia,
      ];

      // 新しいチャートを作成
      this.chart = new ChartJS(ctx, {
        type: 'radar',
        data: {
          labels: ['循環器', '副腎疲労', '甲状腺機能低下', '甲状腺亢進', '肝機能負荷', '低血糖'],
          datasets: [
            {
              label: 'スコア',
              data: scoreArray,
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            r: {
              beginAtZero: true,
              min: 0, // 最小値を0に固定
              max: 5, // 最大値を5に固定 (これを適宜調整)
              ticks: {
                stepSize: 1, // 1単位ずつ刻む
                display: false, // 軸上の数値を非表示
              },
              grid: {
                color: 'rgba(0, 0, 0, 0.2)', // 基本の図形（グリッド）を表示
              },
            },
          },
          plugins: {
            legend: {
              display: false, // ラベルを非表示
            },
          },
        },
      });
    },
  },
};
</script>
