<template>
  <div class="cube-container">
    <div id="content">
      <div
        class="block"
        v-for="(block, i) in blocks"
        :key="i"
        :x="block.x"
        :y="block.y"
        :z="block.z"
        :style="{
          width: side + 'px',
          height: side + 'px',
          transform: `translateX(${side * block.x}px)  translateY(${side * block.y}px) translateZ(${side * block.z}px) rotateX(0deg) rotateY(0deg) rotateZ(0deg)`,
          '--size': `${side}px`,
          'transform-origin': `${origins[i].originx} ${origins[i].originy} ${origins[i].originz}`
        }"
      >
        <!-- :style="{ width: side + 'px', height: side + 'px', transform: 'translateX(' + side * block.x + 'px)  translateY(' + side * block.y + 'px) translateZ(' + side * block.z + 'px)', '--size': side + 'px' }" -->
        <!-- {{ block.x }}{{ block.y }}{{ block.z }} -->
        <div class="front">{{ block.x }}{{ block.y }}{{ block.z }}</div>
        <div class="back">{{ block.x }}{{ block.y }}{{ block.z }}</div>
        <div class="left">{{ block.x }}{{ block.y }}{{ block.z }}</div>
        <div class="right">{{ block.x }}{{ block.y }}{{ block.z }}</div>
        <div class="top">{{ block.x }}{{ block.y }}{{ block.z }}</div>
        <div class="bottom">{{ block.x }}{{ block.y }}{{ block.z }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['x', 'y', 'z'],
  name: 'cube',
  data() {
    return {
      count: 3,
      side: 50,
      blocks: [],
      origins: []
    }
  },
  created() {
    this.createBlocks()
  },
  methods: {
    // 创建魔方块
    createBlocks() {
      let originx = ''
      let originy = ''
      let originz = ''
      for (let x = 0; x < this.count; x++) {
        if (x === 0) {
          originx = '75px'
        } else if (x === 1) {
          originx = '25px'
        } else {
          originx = '-25px'
        }
        for (let y = 0; y < this.count; y++) {
          if (y === 0) {
            originy = '75px'
          } else if (y === 1) {
            originy = '25px'
          } else {
            originy = '-25px'
          }
          for (let z = 0; z < this.count; z++) {
            if (z === 0) {
              originz = '25px'
            } else if (z === 1) {
              originz = '-25px'
            } else {
              originz = '-75px'
            }
            // origin 用于存放每个魔方块的transform-origin的值
            const origin = {
              originx,
              originy,
              originz
            }
            console.log(origin)
            // block用于存放当前块的坐标
            const block = {
              x,
              y,
              z,
              origin
            }
            // 将生成的坐标块放入blocks中
            this.blocks.push(block)
            this.origins.push(origin)
          }
        }
      }
      console.log(this.blocks)
    },
    getOrigin() {}
  },
  // 计算属性
  computed: {}
}
</script>

<style lang="less" scoped>
.cube-container {
  width: 100%;
  height: 100%;
  display: flex;
  #content {
    position: relative;
    left: 0;
    top: 0;
    width: 150px;
    height: 150px;
    // border: 1px solid black;
    box-sizing: border-box;
    margin: auto;
    transform-style: preserve-3d;
    transform-origin: 50% 50% 25px;

    transform: rotateX(-30deg) rotateY(145deg) rotateZ(0deg);
    .block {
      position: absolute;
      // border: 10px solid purple;
      box-sizing: border-box;
      transform-style: preserve-3d;
      div {
        position: absolute;
        width: 100%;
        height: 100%;
        border: 1px solid pink;
      }
      .front {
        background-color: blue;
      }
      .back {
        background-color: green;
        transform: translateZ(calc(-1 * var(--size)));
      }
      .top {
        background-color: yellow;
        transform-origin: bottom;
        transform: translateY(calc(-1 * var(--size))) rotateX(90deg);
      }
      .bottom {
        background-color: white;
        transform-origin: top;
        transform: translateY(var(--size)) rotateX(-90deg);
      }
      .left {
        background-color: orange;
        transform-origin: right;
        transform: translateX(calc(-1 * var(--size))) rotateY(-90deg);
      }
      .right {
        background-color: red;
        transform-origin: left;
        transform: translateX(var(--size)) rotateY(90deg);
      }
    }
  }
}
</style>
