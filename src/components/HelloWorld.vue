<template>
  <v-container>
    <v-form v-model="valid">
      <v-layout text-center wrap>
        <v-flex xs12 mb-4>
          <h1 class="display-2 font-weight-bold mb-3">Sign in</h1>
        </v-flex>
        <v-flex xs12>
            <v-text-field
              v-model="username"
              :rules="[rules.username]"
              :counter="10"
              label="Username"
              hint="Enter a Username"
            ></v-text-field>
            <v-text-field
              v-model="password"
              :counter="10"
              label="password"
              hint="Your password passed! Password rules are not meant to be broken!"
              :append-icon="value ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append="() => (value = !value)"
              :type="value ? 'password' : 'text'"
              :rules="[rules.password]"
            ></v-text-field>
        </v-flex>
        <v-flex xs12>
          <v-btn
            :disabled="!valid"
            color="success"
            class="mr-4"
            @click="login"
          > Enter </v-btn>
        </v-flex>
      </v-layout>
    </v-form>
  </v-container>
</template>

<script>
import { AUTH_REQUEST } from '../store/actions/auth'
export default {
  name: 'HelloWorld',

  data: () => ({
    valid: false,
    value: true,
    username: '',
    password: '',
    rules: {
      required: value => !!value || 'Required',
      username: value => {
        return value.length <= 10 || 'UserName must be less 10 characters'
      },
      password: value => {
        const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/
        return (
          pattern.test(value) ||
            'Min. 8 characters with at least one capital letter, a number and a special character.'
        )
      }
    }
  }),
  methods: {
    login: function () {
      const { username, password } = this
      this.$store.dispatch(AUTH_REQUEST, { username, password })
    }
  }
}
</script>
