"use strict";

(() => {
  // ①第一步 一个class出来
  class ClockDrawer {
    constructor(canvas) {
      this.ctx = canvas.getContext("2d");

      this.width = canvas.width;
      this.height = canvas.height;
    }

    draw(angle, func) {
      this.ctx.save();

      this.ctx.translate(this.width / 2, this.height / 2);
      // 角度の方式(2*Math.PI/360*angle) (Math.PI/180*angle)  ラジアン弧度
      this.ctx.rotate(((2 * Math.PI) / 360) * angle);
      // ctx.rotate((Math.PI / 180) * angle);
      this.ctx.beginPath();

      // draw関数描画処理のため 与下面的draw的函数相结合
      func(this.ctx);

      this.ctx.stroke();

      this.ctx.restore();
    }
    clear() {
      // 前面一个旧的钟表全部去除 出现新的表
      this.ctx.clearRect(0, 0, this.width, this.height);
    }
  }

  // ②第二部 第二个class出来
  class Clock {
    constructor(drawer) {
      this.r = 100;
      this.drawer = drawer;
    }
    drawFace() {
      for (let angle = 0; angle < 360; angle += 6) {
        this.drawer.draw(angle, (ctx) => {
          ctx.moveTo(0, -this.r);
          if (angle % 30 === 0) {
            ctx.lineWidth = 2;
            ctx.lineTo(0, -this.r + 10);
            ctx.font = "13px Arial";
            ctx.textAlign = "center";
            ctx.fillText(angle / 30 || 12, 0, -this.r + 25);//( ||线前面的是假的false用后面的12)
          } else {
            ctx.lineTo(0, -this.r + 5);
          }
        });
      }
    }
    drawHands() {
      // hour的angle（角度）每30度走一个 要先设定时间的角度！！
      // 与分针结合时this.m*0.5!!
      this.drawer.draw(this.h * 30 + this.m * 0.5, (ctx) => {
        ctx.lineWidth = 6;
        ctx.moveTo(0, 10);
        ctx.lineTo(0, -this.r + 50);
      });
      // minite 分针6度一个变化！！
      this.drawer.draw(this.m * 6, (ctx) => {
        ctx.lineWidth = 4;
        ctx.moveTo(0, 10);
        ctx.lineTo(0, -this.r + 30);
      });
      // second 秒针也是6度一个变化！！
      this.drawer.draw(this.s * 6, (ctx) => {
        ctx.strokeStyle = "red";
        ctx.moveTo(0, 20);
        ctx.lineTo(0, -this.r + 20);
      });
    }

    update() {
      // 出现时间最先想到的是当下时间要找出来 new Date()!!
      this.h = new Date().getHours();
      this.m = new Date().getMinutes();
      this.s = new Date().getSeconds();
    }
    run() {
      this.update();

      this.drawer.clear();
      this.drawFace();
      this.drawHands();

      setTimeout(() => {
        this.run();
      }, 100);
    }
  }

  // ③ 下面是访问JS固定的！！！
  const canvas = document.querySelector("canvas");
  if (typeof canvas.getContext === "undefined") {
    // returnあれば関数から抜いた処理を止めるためなので、関数作る
    // 必要がある！！即時関数仕様 ( () => {} )()  全体{}じゃない！！
    return;
  }

  //④最后一步两个class结合！！
  const clock = new Clock(new ClockDrawer(canvas));
  clock.run();
})();
