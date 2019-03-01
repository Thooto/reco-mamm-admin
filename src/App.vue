<template>
  <router-view></router-view>
</template>

<script>
export default {
  name: "app"
};
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Raleway:normal,bold,black');

$family-primary: 'Raleway', sans-serif;
$primary: black;

@import "~bulma";
@import "~buefy/src/scss/buefy";

.b-table .table tr.detail .detail-container {
  padding-left: 0;
  padding-right: 0;
}

.box {
  padding-left: .75rem;
  padding-right: .75rem;
}

</style>
