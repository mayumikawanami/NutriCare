<template>
  <div class="top-page">
    <NuxtLink to="/questionnaire" class="link-button"
      >食事診断を受けてみる</NuxtLink
    >
  </div>
</template>

<style scoped>
.top-page {
  text-align: center;
  padding: 40px;
  margin-top: 50px;
  background-color: rgb(247, 238, 138);
}

@keyframes lightEffect {
  0% {
    left: -100%;
    opacity: 0;
  }
  50% {
    left: 50%;
    opacity: 1;
  }
  100% {
    left: 100%;
    opacity: 0;
  }
}

.link-button {
  display: block;
  text-align: center;
  text-decoration: none;
  max-width: 240px;
  margin: auto;
  padding: 2rem 4rem;
  position: relative;
  border-radius: 5px;
  border: 1px solid #27acd9;
  font-weight: bold;
  font-size: 22px;
  letter-spacing: 2px;
  background-color: #27acd9;
  color: #fff;
  overflow: hidden;
}

.link-button::before {
  content: "";
  display: block;
  width: 1%;
  height: 100%;
  position: absolute;
  top: 0;
  left: -100%;
  background: rgba(255, 255, 255, 0.6);
  transform: skewX(-20deg);
  box-shadow: 0 0 50px 30px rgba(255, 255, 255, 0.6);
  animation: lightEffect 2.5s infinite linear;
}

@media (max-width: 480px) {
  .link-button {
    font-size: 12px;
    padding: 1rem 2rem;
  }
}
</style>
