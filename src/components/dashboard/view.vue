<template>
  <section>
    <navbar/>
    <router-view/>
  </section>
</template>

<script>
import Navbar from "./navbar";

export default {
  name: "dashboard",

  components: { Navbar }
};
</script>
