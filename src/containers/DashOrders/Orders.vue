<script>
import OrderItems from '@/components/OrderItems/OrderItems.vue';
import TopNav from '@/components/TopNav/TopNav.vue';
import SideNav from '@/components/SideNav/SideNav.vue';
import OrderModal from '@/components/OrderModal/OrderModal.vue';
export default {
  name: 'Orders',
  props: {},
  components: {
    TopNav,
    SideNav,
    OrderItems,
    OrderModal,
  },
  data: function() {
    return {
      orders: [],
      completedOrders: [],
      openModal: null,
      modalOrder: null,
    };
  },
  async beforeCreate() {
    await this.$store.dispatch('apolloQuery', {
      queryType: 'query',
      queryName: 'ACTIVE_CONNECTION_DATA',
    });
    this.orders = this.$store.state.activeOrders;
    // this.completedOrders = this.$store.state.completedOrders;
  },
  methods: {
    toggleModal: function(index) {
      this.modalOrder = index;
      this.openModal = !this.openModal;
    },
  },
};
</script>

<template>
  <div class="Dashboard">
    <OrderModal v-if="openModal" v-bind="{toggleModal}" :order="orders[modalOrder]"  />
    <SideNav page="orders" />

    <div class="dash-container">
      <TopNav />

      <div class="content">
        <h1 class="orders-h1">PENDING ORDERS</h1>

        <div class="orders-empty-state" v-if="orders.length === 0">
          <h3 class="empty-state-header">No orders have been placed</h3>
        </div>
        <OrderItems :orders="orders" :toggleModal="toggleModal" v-else />

        <h1 class="orders-h1">COMPLETED ORDERS</h1>

        <div class="completed-orders-empty-state" v-if="completedOrders.length === 0">
          <h3 class="empty-state-header">No orders have been completed</h3>
        </div>
        <OrderItems :orders="completedOrders" v-else />

      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import 'Orders.css';
</style>
