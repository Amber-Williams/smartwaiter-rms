import store from './store';
import parseJwt from './assets/helpers/parseJwt'

export default async function(to, from, next) {
  if (localStorage.getItem('token') === null) {
    next('/');
  } else if (store.state.userRefreshed) {
    // fetch again
    await store.dispatch('apolloQuery', {
      queryType: 'query',
      queryName: 'GET_RESTAURANT_DATA',
      data: parseJwt(localStorage.getItem('token')).restaurantId
    });
    console.log(store.state.restaurantInfo.id);
    await store.dispatch('apolloSubscription', {
      queryName: 'ORDERS_SUBSCRIPTION',
      data: { id: store.state.restaurantInfo.id },
    });

    await store.dispatch('apolloSubscription', {
      queryName: 'CONNECTIONS_SUBSCRIPTION',
      data: { id: store.state.restaurantInfo.id },
    });

    await store.dispatch('apolloSubscription', {
      queryName: 'WAITER_CALLS_SUBSCRIPTION',
      data: { id: store.state.restaurantInfo.id },
    });

    next(to);
  }
  next();
}