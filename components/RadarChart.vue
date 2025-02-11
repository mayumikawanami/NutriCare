<template>
  <div>
    <canvas ref="radarCanvas" class="radar-chart"></canvas>
  </div>
</template>

<script>
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  PointElement,
  LineElement,
  RadarController,
  Filler,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  PointElement,
  LineElement,
  RadarController,
  Filler
);

export default {
  props: {
    scores: {
      type: Object,
      required: true,
      default: () => ({
        carb_intake: 0,
        fat_intake: 0,
        digestive_health: 0,
        dietary_bias: 0,
        protein: 0,
        mineral_balance: 0,
      }),
    },
  },
  mounted() {
    this.renderChart();
  },
  watch: {
    scores: {
      handler() {
        this.renderChart(); // データ変更時にチャートを再描画
      },
      deep: true, // オブジェクト内の変更を監視
    },
  },
  methods: {
    renderChart() {
      const ctx = this.$refs.radarCanvas.getContext("2d");

      // 既存のチャートがあれば破棄
      if (this.chart instanceof ChartJS) {
        this.chart.destroy();
      }

      // スコアの値を配列に変換
      const scoreArray = [
        this.scores.carb_intake || 0,
        this.scores.fat_intake || 0,
        this.scores.digestive_health || 0,
        this.scores.dietary_bias || 0,
        this.scores.protein || 0,
        this.scores.mineral_balance || 0,
      ];

      // 新しいチャートを作成
      this.chart = new ChartJS(ctx, {
        type: "radar",
        data: {
          labels: [
            "糖質",
            "脂質",
            "消化吸収",
            "偏食",
            "タンパク質",
            ["ミネラル", "バランス"],
          ],
          datasets: [
            {
              label: "スコア",
              data: scoreArray,
              backgroundColor: "rgba(54, 162, 235, 0.2)",
              borderColor: "rgba(54, 162, 235, 1)",
              borderWidth: 2,
              pointBorderWidth: 1,
              pointRadius: 1,
              fill: true,
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            r: {
              beginAtZero: true,
              min: 0,
              max: 5,
              ticks: {
                stepSize: 1,
                callback: function (value) {
                  if (value === 0) {
                    return "0"; // 0も表示する
                  }
                  return value; // スコアをそのまま表示
                },
                font: {
                  size: Math.max(7, window.innerWidth * 0.013), // スコアの文字サイズを調整
                },
                color: "rgba(0, 0, 0, 0.7)", // スコアの文字色
              },
              grid: {
                color: "rgba(0, 0, 0, 0.2)",
              },
              pointLabels: {
                font: {
                  size: Math.max(7, window.innerWidth * 0.015), // ラベルの文字サイズを指定
                },
                color: "rgba(0, 0, 0, 1)", // ラベルの文字色
              },
            },
          },
          plugins: {
            legend: {
              display: false,
            },
          },
        },
      });
    },
  },
};
</script>

<style scoped></style>
