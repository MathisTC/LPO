<template>
  <div>
    <navbar></navbar>
    <main>
      <Transition>
      <router-view></router-view>
    </Transition>
    </main>
  </div>
</template>

<script>
import navbar from "./components/Navbar";
import router from "./routes/index.js";
const GoBack = () => {
      router.go(-1)
    }
export default {
  GoBack,
  components: {
    navbar
  },
};

</script>
<style>


.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

@font-face {
  font-family: "Sora";
  src: url("./assets/fonts/Sora/Sora-VariableFont_wght.ttf");
}
body {
  --var1: #76B828;

  background-color: #f0f6f8;
  font-family: 'Sora'
}

h1,h2 {
  color:#4487CD;
  margin-bottom: 15px;
}

h3,h4 {
  color:#333333;
  margin-bottom: 15px;
}

.center-div {
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 80%;
}

.btn {
  box-sizing: border-box;
  border: 1px solid #E7EAF3;
  border-radius: 5px;
  display: inline-block;
  cursor: pointer;
  color: #ffffff;
  font-family: "Sora";
  text-decoration: none;
  padding: 5px;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
}

.greenbtn {
  background-color: #76B828;
}
.greenbtn:hover {
  background-color: #C9E0AD;
}

.bluebtn {
  background-color: #4487CD;
}
.bluebtn:hover {
  background-color: #adcce0;
}

.orangebtn {
  background-color: #cd8244;
}
.orangebtn:hover {
	background-color:#e0c8ad;
}

.routerLink {
  text-decoration: none;
}

.precedent {
  position:-webkit-sticky;
  left: 2%;
  bottom: 2%;
  width: 100%
}
.label {
  display: block;
  margin-left: auto;
  margin-right: auto;
}

.iconImage {
  margin-left: 5px;
  margin-right: 5px;
  background-color: white;
  cursor: pointer;
  border-radius: 5px;
  padding: 3px;
}

.iconImage:hover {
  background-color: rgb(212, 212, 212);
  color:white;
  transition-duration: 250ms;
  padding: 0px;
}

.iconEditDelete {
  margin-left: 5px;
  margin-right: 5px;

  cursor: pointer;
}

.iconEditDelete:hover {
  color: grey;
  transition-duration:200ms;
  padding:1px;
}

</style>