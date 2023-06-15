<template>
  <div class="">
    <div v-if="error" class="">{{ error }}</div>
      <div class="top-img">
      <img class="lpo-img" src="../assets/lpo-logo.png" />
    </div>

    <div class="center-div">
      <h1 align="center">
        Outil d'administration de l'application
      </h1>
      <form action="#" @submit.prevent="Login">
        <input placeholder="Email" id="email" type="email" class="label" name="email" value required autofocus v-model="email" />
        <br>
        <input placeholder="Mot de passe" id="password" type="password" class="label" name="password" required v-model="password" />
        <br>
        <button type="submit" class="btn greenbtn">Login</button>
    </form>
    </div>
    
  </div>
</template>

<script>
import { ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
  name: "LoginComponent",
  setup() {
    const email = ref('')
    const password = ref('')
    const error = ref(null)

    const store = useStore()
    const router = useRouter()

    const Login = async () => {
      try {
        await store.dispatch('logIn', {
          email: email.value,
          password: password.value
        })
        router.push('/')
      }
      catch (err) {
        error.value = err.message
      }
    }
    return { Login, email, password, error }
  }
};
</script>

<style scoped>
.center-div {
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 50%;
}

.lpo-img {
  justify-content: center;
  display: block;
  margin-left: auto;
  margin-right: auto;
  padding-top: 2%;
  height: 10%;
  width: 10%;
}
.label {
  display: block;
  margin-left: auto;
  margin-right: auto;
}
.btn {
  display: block;
  width: 30%;
  margin-left: auto;
  margin-right: auto;
}
.label {
  display: block;
  margin-left: auto;
  margin-right: auto;
}
</style>