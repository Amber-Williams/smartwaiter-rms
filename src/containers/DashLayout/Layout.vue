<script>
import api from '@/api';
import TopNav from '@/components/TopNav/TopNav.vue';
import SideNav from '@/components/SideNav/SideNav.vue';
export default {
  name: 'Layout',
  props: {},
  components: {
    TopNav,
    SideNav,
  },
  data: function() {
    return {
      mouseOver: false,
      grid: {
        squares: Array(40).fill(Array(40).fill('unselected')),
      },
    };
  },
  mounted() {
    document.addEventListener('mousedown', () => {
      this.dragging = true;
    });
    document.addEventListener('mouseup', () => {
      this.dragging = false;
    });
  },
  methods: {
    handleClick: function(x, y) {
      const newRow = this.grid.squares[y].slice(0);
      newRow[x] = 'selected';
      this.$set(this.grid.squares, y, newRow);
    },
    handleMouseOver: function(x, y) {
      if (this.dragging) {
        const newRow = this.grid.squares[y].slice(0);
        newRow[x] = 'selected';
        this.$set(this.grid.squares, y, newRow);
      }
    },
  },
};
</script>

<template>
  <div class="Dashboard">
    <SideNav page="layout" />

    <div class="dash-container">
      <TopNav />

      <div class="content">
        <h1>RESTAURANT LAYOUT</h1>

        <div v-for="(subrow, y) in grid.squares" :key="y" class="row">
          <div v-for="(squareClass, x) in subrow" :key="x" class="square-wrapper">

            <div @mouseover="handleMouseOver(x,y)" @click="handleClick(x, y)" :class="squareClass"></div>

          </div>
        </div>


      </div>
    </div>
  </div>
</template>

<style src="./Layout.css" scoped>

