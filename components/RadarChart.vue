<template>
  <div>
    <canvas ref="radarCanvas"></canvas>
  </div>
</template>

<script>
import { Radar } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, RadialLinearScale, PointElement, LineElement } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, RadialLinearScale, PointElement, LineElement);

export default {
  props: ['scores'],
  mounted() {
    this.renderChart();
  },
  methods: {
    renderChart() {
      const ctx = this.$refs.radarCanvas.getContext('2d');
      new ChartJS(ctx, {
        type: 'radar',
        data: {
          labels: ['循環器', '副腎疲労', '甲状腺機能低下', '甲状腺亢進', '肝機能負荷', '低血糖'],
          datasets: [
            {
              label: 'スコア',
              data: this.scores,
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
            },
          },
        },
      });
    },
  },
};
</script>
