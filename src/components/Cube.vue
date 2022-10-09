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
// 安装导入lodash，使用其中的方法cloneDeep()，用于保存魔方旋转前的状态
import lodash from 'lodash';

export default {
  name: 'cube',
  data() {
    return {
      // 魔方阶数
      count: 3,
      // 一个魔方块的边长
      size: 90,
      // 用于存储魔方块的数组
      blocks: [],
      // 每个魔方块的前后左右面
      sides: ['front', 'back', 'left', 'right', 'top', 'bottom'],
      // 魔方六个面分别对应的颜色
      colors: {
        front: 'red',
        back: 'orange',
        left: 'blue',
        right: 'green',
        top: 'yellow',
        bottom: 'white',
        default: 'black'
      },
      // 旋转动画时长
      animTime: '0s',
      // 魔方初始状态的角度
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
    // 可在mounted中最早的操作DOM元素
    document.addEventListener('keyup', event => {
      // 监听上下左右按键是否按下，根据按键的不同，朝不同的方向旋转魔方
      // 注意：魔方的坐标系是x轴水品向右，y轴垂直向下，z轴垂直于桌面朝人眼方向
      // 旋转的正负根据左手准则，大拇指与坐标轴同向，四指弯曲的方向即为正向，反之负向
      // 'ArrowUp' 'ArrowDown' 'ArrowLeft' 'ArrowRight'
      const step = 45;
      const horiMaxAngle = 180; // 定义水平方向上的最大旋转角度
      const vertMaxAngle = 45; // 定义垂直方向上的最大旋转角度

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
              // x y z 分别存放每个魔方块的坐标
              x,
              y,
              z,
              // origin 用于存放每个魔方块的transform-origin的值（即旋转中心的值）
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
    // 绕X轴旋转
    rotateX(x, degree) {
      if (this.animTime === '1s') {
        return;
      }
      // 暂存每次旋转前所有魔方块的状态
      let caches = lodash.cloneDeep(this.blocks);
      if (degree > 0) {
        // 当旋转90度时
        this.animTime = '1s';
        // 绕规定的轴旋转
        this.rotate('x', x, degree);
        setTimeout(() => {
          this.animTime = '0s';
          // 绕规定的轴再转回去（假转）
          this.rotate('x', x, -degree);
          for (const block of this.blocks) {
            // 循环遍历每个block，找出当前需要旋转魔方层的block
            if (block.x === x) {
              // 获取旋转前的当前层对应的颜色
              const lastColor = this.findLastColor('x', degree, caches, block);
              // 将假转后的魔方当前层的颜色设置为旋转前的每个块的颜色
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
    // 绕Z轴旋转
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
    // 绕Y旋转
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

    // 绕轴旋转
    rotate(axis, index, degree) {
      console.log('转');
      for (const block of this.blocks) {
        if (block[axis] === index) {
          degree > 0 ? (block.rotate[axis] += 90) : (block.rotate[axis] -= 90);
        }
      }
    },
    // 鼠标手势为 上侧 时，根据触发的面不同而绕不同的轴旋转
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
    // 鼠标手势为 下侧 时，根据触发的面不同而绕不同的轴旋转
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

<style lang="less" scoped>
.cube-container {
  width: 100%;
  height: 100%;
  display: flex;

  #content {
    position: relative;
    left: 0;
    top: 0;
    // width: var(size) * 3 * 1px;
    // height: var(size) * 3 * 1px;
    // border: 1px solid black;
    box-sizing: border-box;
    margin: auto;
    transform-style: preserve-3d;
    // transform-origin: 50% 50% -135px;
    transform-origin: 50% 50% calc(var(--count) * var(--size) / 2 * -1px);
    transform: var(--transform);
    transition: transform 1s;
    .block {
      position: absolute;
      box-sizing: border-box;
      transform-style: preserve-3d;

      // transition用于动画
      transition: transform var(--animTime); // 指定transform进行动画，并在1s内完成
      div {
        position: absolute;
        width: 100%;
        height: 100%;
        border: 3px solid #000;
        border-radius: 8px;
        box-sizing: border-box;
      }

      // 将六个面通过平移、旋转形成一个正方体
      // .front {}
      .back {
        // back面只需要平移
        transform: translateZ(calc(-1 * var(--size)));
      }
      .top {
        transform-origin: bottom; // 旋转中心
        transform: translateY(calc(-1 * var(--size))) rotateX(90deg);
      }
      .bottom {
        transform-origin: top;
        transform: translateY(var(--size)) rotateX(-90deg);
      }
      .left {
        transform-origin: right;
        transform: translateX(calc(-1 * var(--size))) rotateY(-90deg);
      }
      .right {
        transform-origin: left;
        transform: translateX(var(--size)) rotateY(90deg);
      }
    }
  }
}
</style>
