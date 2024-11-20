<template>
  <div class="top-page">
    <NuxtLink to="/questionnaire" class="link-button">アンケートに答える</NuxtLink>
  </div>
</template>

<style scoped>
.top-page {
  text-align: center;
  padding: 40px;
  margin-top: 50px;

}
.link-button {
  display: inline-block; /* Ensure it's a block-level element for padding */
  color: antiquewhite;
  text-decoration: none;
  padding: 10px 40px; /* Adjust padding */
  font-size: 20px;
  background-color: blue;
  cursor: pointer;
  border-radius: 10px;
}
</style>