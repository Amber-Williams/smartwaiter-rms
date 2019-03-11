<script>
  import api from '@/api';
  import parseJwt from './../../assets/helpers/parseJwt'

  export default {
    name: 'Register1',
    props: {
      msg: String,
    },
    data: () => ({
      register: {
        firstName: 'test',
        lastName: 'test',
        email: 'test@test',
        password: 'test',
        restaurantName: null,
        latitude: null,
        longitude: null,
      },
      errorMessage: null,
    }),
    mounted() {
      this.autocomplete = new google.maps.places.Autocomplete(
        this.$refs.autocomplete,
        { types: ['establishment'] }
      );
      this.autocomplete.addListener('place_changed', () => {
        let place = this.autocomplete.getPlace();
        let ac = place.address_components;
        let lat = place.geometry.location.lat();
        let lon = place.geometry.location.lng();
        let city = ac[0]['short_name'];
        
        this.register.id = place.id;
        this.register.latitude = lat;
        this.register.longitude = lon;
        this.register.restaurantName = place.name;
      });
    },
    methods: {
      async handleSubmit() {
        if (
          !this.register.firstName ||
          !this.register.lastName ||
          !this.register.password ||
          !this.register.email ||
          !this.register.restaurantName // To avoid blank restaurant field
        ) {
          this.errorMessage =
            'Please fill in all the fields';
          return; // So it doesn't go on with the handling
        }
        

        const created = await this.$store.dispatch('apolloQuery', {
          queryType: 'mutation',
          queryName: 'REGISTER_RESTAURANT',
          data: {
            name: this.register.restaurantName,
            latitude: this.register.latitude,
            longitude: this.register.longitude,
            id: this.register.id,
          },
        });
        
        if (created) {
          await this.$store.dispatch('apolloQuery', {
            queryType: 'mutation',
            queryName: 'REGISTER_OWNER',
            data: {
              name: this.register.firstName,
              lastname: this.register.lastName,
              email: this.register.email,
              password: this.register.password, //edit to correct this in owners table
            },
          });

          const data = {
            username: this.register.email,
            password: this.register.password,
          };
          const user = await api.request('POST', '/login-rms', data).catch(() => false);

          if (user.token) {
            await localStorage.setItem('token', user.token);
            await this.$store.dispatch('apolloQuery', {
              // We already have the restaurant data (it's being created)
              // so this is actually not necessary
              queryType: 'query',
              queryName: 'GET_RESTAURANT_DATA',
              data: parseJwt(localStorage.getItem('token')).restaurantId,
            });
          }

          if (localStorage.getItem('token')) {  // Preventing to get into orders
            this.$router.push('/orders');       // without a token (basic way)
          }
        }
      },
    },
  };
</script>

<template>
  <form class="card-form" @submit.prevent="handleSubmit">
    <input v-model="register.firstName" type="text" placeholder="First name" autocomplete="given-name">
    <input v-model="register.lastName" type="text" placeholder="Last name" autocomplete="family-name">
    <input v-model="register.email" type="email" placeholder="Email" autocomplete="email">
    <input ref="autocomplete" placeholder="Restaurant" class="search-location" onfocus="value = ''" type="text" />
    <input v-model="register.password" type="text" placeholder="Password">
    <p v-if="errorMessage" class="error-message">{{errorMessage}}</p>
    <div class="card-buttons">
      <input type="submit" value="Register" class="btn btn-register">
      <a class="" href="/">Login</a>

    </div>
  </form>
</template>

<style lang="scss" scoped>
</style>