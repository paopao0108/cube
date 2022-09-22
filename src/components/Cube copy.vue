<template>
  <div class="cube-container">
    <div
      id="content"
      :style="{
        '--size': `${size}`,
        '--count': `${count}`,
        '--transform': `rotateX(${transform.rotateX}deg) rotateY(${transform.rotateY}deg) rotateZ(${transform.rotateZ}deg)`,
        '--animTime': `${animTime}`,
        width: count * size + 'px',
        height: count * size + 'px'
      }"
    >
      <div
        class="block"
        v-for="(block, i) in blocks"
        :key="i"
        :x="block.x"
        :y="block.y"
        :z="block.z"
        :style="{
          width: size + 'px',
          height: size + 'px',
          transform: `translateX(${size * block.x}px)  translateY(${size * block.y}px) translateZ(-${size * block.z}px)
          rotateX(${block.rotate.x}deg) rotateY(${block.rotate.y}deg) rotateZ(${block.rotate.z}deg)`,
          '--size': `${size}px`,
          'transform-origin': `${block.origin.x}px ${block.origin.y}px ${block.origin.z}px`
        }"
      >
        <!-- 使用手势插件vue-touch时，需要用v-touch标签进行包裹，解析后html文档 v-touch就是div  -->
        <v-touch
          v-for="(side, i) in sides"
          :key="i"
          :class="side"
          :style="{
            'background-color': `${block.colors[side]}`,
            color: 'purple'
          }"
          @swiperight="right(block.x, block.y, block.z)"
          @swipeleft="left(block.x, block.y, block.z)"
          @swipedown="down(block.x, block.y, block.z, side)"
          @swipeup="up(block.x, block.y, block.z, side)"
        >
          <!-- {{ block.x }}{{ block.y }}{{ block.z }} -->
        </v-touch>
      </div>
    </div>
  </div>
</template>

<script>
import lodash from 'lodash';

export default {
  name: 'cube',
  data() {
    return {
      count: 3,
      size: 90,
      blocks: [],
      sides: ['front', 'back', 'left', 'right', 'top', 'bottom'],
      colors: {
        front: 'red',
        back: 'orange',
        left: 'blue',
        right: 'green',
        top: 'yellow',
        bottom: 'white',
        default: 'black'
      },
      animTime: '0s',
      transform: {
        rotateX: -30,
        rotateY: 45,
        rotateZ: 0
      }
    };
  },
  computed: {},
  created() {
    this.createBlocks();
  },
  mounted() {
    // 已挂载
    document.addEventListener('keyup', event => {
      // 'ArrowUp' 'ArrowDown' 'ArrowLeft' 'ArrowRight'
      const step = 45;
      const horiMaxAngle = 180; // 水平方向上的最大旋转角度
      const vertMaxAngle = 45; // 垂直方向上的最大旋转角度

      switch (event.key) {
        case 'ArrowUp':
          if (this.transform.rotateX <= vertMaxAngle) {
            this.transform.rotateX += step;
          }
          break;
        case 'ArrowDown':
          if (this.transform.rotateX >= -vertMaxAngle) {
            this.transform.rotateX -= step;
          }
          break;
        case 'ArrowLeft':
          if (this.transform.rotateY >= -horiMaxAngle) {
            this.transform.rotateY -= step;
          }
          break;
        case 'ArrowRight':
          if (this.transform.rotateY <= horiMaxAngle) {
            this.transform.rotateY += step;
          }
          break;
      }
    });
  },
  methods: {
    // 创建魔方块
    createBlocks() {
      for (let x = 0; x < this.count; x++) {
        for (let y = 0; y < this.count; y++) {
          for (let z = 0; z < this.count; z++) {
            const block = {
              x,
              y,
              z,
              // origin 用于存放每个魔方块的transform-origin的值
              origin: {
                x: (this.size * this.count) / 2 - this.size * x,
                y: (this.size * this.count) / 2 - this.size * y,
                z: -(this.size * this.count) / 2 + this.size * z
              },
              rotate: {
                x: 0,
                y: 0,
                z: 0
              },
              colors: {
                front: z === 0 ? this.colors.front : 'black',
                back: z === this.count - 1 ? 'orange' : 'black',
                left: x === 0 ? 'blue' : 'black',
                right: x === this.count - 1 ? this.colors.right : this.colors.default,
                top: y === 0 ? this.colors.top : this.colors.default,
                bottom: y === this.count - 1 ? this.colors.bottom : this.colors.default
              }
            };
            // 将生成的坐标块放入blocks中
            this.blocks.push(block);
          }
        }
      }
      console.log(this.blocks);
    },
    rotateX(x, degree) {
      if (this.animTime === '1s') {
        return;
      }
      // 暂存每次旋转前所有魔方块的状态
      let caches = lodash.cloneDeep(this.blocks);
      if (degree > 0) {
        this.animTime = '1s';
        this.rotate('x', x, degree);
        setTimeout(() => {
          this.animTime = '0s';
          this.rotate('x', x, -degree);
          for (const block of this.blocks) {
            // 循环遍历每个block，找出当前需要旋转魔方层的block
            if (block.x === x) {
              const lastColor = this.findLastColor('x', degree, caches, block);
              block.colors.front = lastColor.bottom;
              block.colors.back = lastColor.top;
              block.colors.top = lastColor.front;
              block.colors.bottom = lastColor.back;
              block.colors.left = lastColor.left;
              block.colors.right = lastColor.right;
            }
          }
        }, 1000);
      } else {
        this.animTime = '1s';
        this.rotate('x', x, degree);
        setTimeout(() => {
          this.animTime = '0s';
          this.rotate('x', x, -degree);
          for (const block of this.blocks) {
            if (block.x === x) {
              const lastColor = this.findLastColor('x', degree, caches, block);
              block.colors.front = lastColor.top;
              block.colors.back = lastColor.bottom;
              block.colors.top = lastColor.back;
              block.colors.bottom = lastColor.front;
              block.colors.left = lastColor.left;
              block.colors.right = lastColor.right;
            }
          }
        }, 1000);
      }
    },
    rotateZ(z, degree) {
      if (this.animTime === '1s') {
        return;
      }
      let rounds = Math.abs(degree / 90);
      for (let i = 0; i < rounds; i++) {
        let caches = lodash.cloneDeep(this.blocks);
        if (degree > 0) {
          this.animTime = '1s';
          this.rotate('z', z, degree);
          setTimeout(() => {
            this.animTime = '0s';
            this.rotate('z', z, -degree);
            for (const block of this.blocks) {
              // 循环遍历每个block，找出当前需要旋转魔方层的block
              if (block.z === z) {
                const lastColor = this.findLastColor('z', degree, caches, block);
                block.colors.top = lastColor.left;
                block.colors.bottom = lastColor.right;
                block.colors.left = lastColor.bottom;
                block.colors.right = lastColor.top;
                block.colors.front = lastColor.front;
                block.colors.back = lastColor.back;
              }
            }
          }, 1000);
        } else {
          this.animTime = '1s';
          this.rotate('z', z, degree);
          setTimeout(() => {
            this.animTime = '0s';
            this.rotate('z', z, -degree);
            for (const block of this.blocks) {
              if (block.z === z) {
                const lastColor = this.findLastColor('z', degree, caches, block);
                block.colors.top = lastColor.right;
                block.colors.bottom = lastColor.left;
                block.colors.left = lastColor.top;
                block.colors.right = lastColor.bottom;
                block.colors.front = lastColor.front;
                block.colors.back = lastColor.back;
              }
            }
          }, 1000);
        }
      }
    },
    rotateY(y, degree) {
      if (this.animTime === '1s') {
        return;
      }
      // 暂存每次旋转前所有魔方块的状态
      console.log('rotateY');
      let caches = lodash.cloneDeep(this.blocks);
      if (degree > 0) {
        this.animTime = '1s';
        this.rotate('y', y, degree);

        setTimeout(() => {
          this.animTime = '0s';
          this.rotate('y', y, -degree);
          for (const block of this.blocks) {
            // 循环遍历每个block，找出当前需要旋转魔方层的block
            if (block.y === y) {
              const lastColor = this.findLastColor('y', degree, caches, block);
              block.colors.front = lastColor.left;
              block.colors.left = lastColor.back;
              block.colors.back = lastColor.right;
              block.colors.right = lastColor.front;
              block.colors.top = lastColor.top;
              block.colors.bottom = lastColor.bottom;
            }
          }
        }, 1000);
      } else {
        this.animTime = '1s';
        this.rotate('y', y, degree);
        setTimeout(() => {
          this.animTime = '0s';
          this.rotate('y', y, -degree);
          for (const block of this.blocks) {
            // 循环遍历每个block，找出当前需要旋转魔方层的block
            if (block.y === y) {
              const lastColor = this.findLastColor('y', degree, caches, block);
              block.colors.front = lastColor.right;
              block.colors.left = lastColor.front;
              block.colors.back = lastColor.left;
              block.colors.right = lastColor.back;
              block.colors.top = lastColor.top;
              block.colors.bottom = lastColor.bottom;
            }
          }
        }, 1000);
      }
    },
    rotate(axis, index, degree) {
      console.log('转');
      for (const block of this.blocks) {
        if (block[axis] === index) {
          degree > 0 ? (block.rotate[axis] += 90) : (block.rotate[axis] -= 90);
        }
      }
    },
    up(x, y, z, side) {
      if (side === 'front') {
        console.log('在front面触发了xup事件');
        this.rotateX(x, 90);
      } else if (side === 'back') {
        console.log('在back面触发了xup事件');
        this.rotateX(x, -90);
      } else if (side === 'left') {
        console.log('在left面触发了zup事件');
        this.rotateZ(z, 90);
      } else if (side === 'right') {
        console.log('在right面触发了zup事件');
        this.rotateZ(z, -90);
      }
    },
    down(x, y, z, side) {
      if (side === 'front') {
        console.log('在front面触发了xdown事件');
        this.rotateX(x, -90);
      } else if (side === 'back') {
        console.log('在back面触发了xdown事件');
        this.rotateX(x, 90);
      } else if (side === 'left') {
        console.log('在left面触发了zdown事件');
        this.rotateZ(z, -90);
      } else if (side === 'right') {
        console.log('在right面触发了zdown事件');
        this.rotateZ(z, 90);
      }
    },

    // 鼠标手势为 右侧 时，绕 y 轴旋转
    right(x, y, z) {
      console.log('触发了right事件');
      this.rotateY(y, 90);
    },
    // 鼠标手势为 左侧 时，绕 y 轴旋转
    left(x, y, z) {
      console.log('触发了left事件');
      this.rotateY(y, -90);
    },
    // 寻找右转前的上一个块的颜色
    findLastColor(axis, degree, blocks, curblock) {
      // 当前块坐标
      let { x: curx, y: cury, z: curz } = curblock;
      let { x: lastx, y: lasty, z: lastz } = curblock;

      if (degree > 0) {
        switch (axis) {
          case 'x':
            // 上一个块的坐标
            lasty = this.count - 1 - curz;
            lastz = cury;
            break;
          case 'y':
            // 上一个块的坐标
            lastx = curz;
            lastz = this.count - 1 - curx;
            break;
          case 'z':
            // 上一个块的坐标
            lastx = cury;
            lasty = this.count - 1 - curx;
            break;
        }
      } else {
        switch (axis) {
          case 'x':
            // 上一个块的坐标
            lasty = curz;
            lastz = this.count - 1 - cury;
            break;
          case 'y':
            // 上一个块的坐标
            lastx = this.count - 1 - curz;
            lastz = curx;
            break;
          case 'z':
            // 上一个块的坐标
            lastx = this.count - 1 - cury;
            lasty = curx;
            break;
        }
      }

      // 通过坐标找到上一个块，并返回其颜色
      for (let lastblock of blocks) {
        if (lastblock.x === lastx && lastblock.y === lasty && lastblock.z === lastz) {
          // console.log('curx, cury, curz', curx, cury, curz, '; lastx, lasty, lastz', lastx, lasty, lastz);
          return lastblock.colors;
        }
      }
    }
  }
};
</script>

<style lang="less" scoped></style>
