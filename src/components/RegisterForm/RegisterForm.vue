<script>
  import api from '@/api';
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
        console.log('ffff', place);
      });
    },
    methods: {
      async handleSubmit() {
        if (
          !this.register.firstName ||
          !this.register.lastName ||
          !this.register.password ||
          !this.register.email
        ) {
          this.errorMessage =
            'Please fill in all the fields';
          return;
        }
        

        const created = await this.$store.dispatch('apolloQuery', {
          queryType: 'mutation',
          queryName: 'REGISTER_RESTAURANT',
          data: {
            name: this.register.restaurantName,
            latitude: this.register.latitude,
            longitude: this.register.longitude,
            id: this.register.id,
            //ownerId: this.register.email //added
          },
        });
        
        if (created) {
          await this.$store.dispatch('apolloQuery', {
            queryType: 'mutation',
            queryName: 'REGISTER_OWNER',
            data: {
              name: this.register.firstName +
                ' ' + this.register.lastName,
                email: this.register.email,
                password: this.register.password, //edit to correct this in owners table
              },
            });
            
            this.$router.push('/orders');
            //await localStorage.setItem('token', user.token);
        }
        console.log('name', this.register.restaurantName);
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