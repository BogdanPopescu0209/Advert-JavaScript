/**
 *
 * Adapted from:
 * http://www.evermade.fi/pure-three-js-hud/
 * 
 */
document.addEventListener("DOMContentLoaded", function () {

  //Set window size
  var width = 1500;
  var height = 900;

  //First 3D Scene
  var firstScene3D = new THREE.Scene();
  const firstSceneLoader = new THREE.TextureLoader();

  //Background
  const bgTexture = firstSceneLoader.load('background.png');
  firstScene3D.background = bgTexture;

  //Camera
  var firstSceneCamera3D = new THREE.PerspectiveCamera(45, width / height, 1, 500);
  firstSceneCamera3D.position.set(0, 0, 5);
  firstSceneCamera3D.lookAt(firstScene3D.position);

  //Renderer
  var renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
  renderer.setSize(width, height);
  renderer.autoClear = false;
  document.body.appendChild(renderer.domElement);

  //Polygon
  const geometry = new THREE.PlaneGeometry(0.8, 0.8, 50, 9);
  const boxmaterial = new THREE.MeshBasicMaterial({
    map: firstSceneLoader.load('kandia.jpeg')
  });

  const poster = new THREE.Mesh(geometry, boxmaterial);

  poster.rotation.set(-0.1, 0, 0);
  poster.position.set(-2, 1.2, 0)
  firstScene3D.add(poster);


  //Second 3D scene
  var secondScene3D = new THREE.Scene();
  const secondSceneloader = new THREE.TextureLoader();

  //Create perspective camera
  var secondSceneCamera3D = new THREE.PerspectiveCamera(45, width / height, 1, 500);
  secondSceneCamera3D.position.set(50, 0, 5);
  secondSceneCamera3D.lookAt(secondScene3D.position);

  //Light
  var secondSceneLight = new THREE.DirectionalLight(0xffffff, 1);
  secondSceneLight.position.set(50, 50, 50);
  secondScene3D.add(secondSceneLight);

  //Sphere
  var secondSceneGeometry = new THREE.SphereGeometry(1.5, 20, 20);
  const spherematerial = new THREE.MeshBasicMaterial({
    color: 0xFFFFFF,
    map: secondSceneloader.load('sun.jpeg'),
  });
  var sphere = new THREE.Mesh(secondSceneGeometry, spherematerial);
  sphere.position.set(0, 10, 0)
  secondScene3D.add(sphere);

  //Third scene
  //This is the 2D section
  //Create a 2D canvas, size it, and create a 2D context 
  var canvas2D = document.createElement('canvas');
  canvas2D.width = width;
  canvas2D.height = height;

  //Create a 2D context 
  var ctx = canvas2D.getContext('2d');

  //Create the orthographic camera and set the viewport to match the screen dimensions
  var camera2D = new THREE.OrthographicCamera(-width / 2, width / 2, height / 2, -height / 2, 0, 30);

  //Create a custom scene for 2D
  scene2D = new THREE.Scene();

  //Create 2D texture from graphics on canvas
  var texture2D = new THREE.Texture(canvas2D)
  texture2D.needsUpdate = true;

  //Create 2D material
  var material = new THREE.MeshBasicMaterial({ map: texture2D });
  material.transparent = true;

  //Create plane to render the 2D scene onto. This plane fills the screen
  var planeGeometry = new THREE.PlaneGeometry(width, height);
  var plane = new THREE.Mesh(planeGeometry, material);
  scene2D.add(plane);

  const clock = new THREE.Clock()

  //Class circle 
  class Circle {
    constructor(x, y, velocity_y, radius, color, text) {
      this.x = x;
      this.y = y;
      this.velocity_y = velocity_y;
      this.radius = radius;
      this.color = color;
      this.text = text;

      this.draw = function () {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
      };

      //Update circle that activates chocolate function
      this.update = function () {

        this.x -= 1.5;

        if (this.y > 600) {
          this.velocity_y = 0;
        }

        this.y += this.velocity_y; x

        if (this.velocity_y == 0) {
          chocolate.draw()
          updateChocolate()
          this.y = 1500;
          this.color = 'white';
        }

        this.draw();
      };

      //Update rachet
      this.updateRacket = function () {

        if (this.y > 720) {
          this.velocity_y = 0;
        }

        this.y += this.velocity_y;

        this.draw();
      };

      //Update robot's wheel
      this.updateRobotWheel1 = function () {

        this.x += 1;

        if (this.x > 150) {
          this.x = 150;
        }

        this.draw();
      };

      //Update robot's wheel
      this.updateRobotWheel2 = function () {

        this.x += 1;

        if (this.x > 70) {
          this.x = 70;
        }

        this.draw();
      };

      //Update robot's head
      this.updateRobotHead = function () {

        this.x += 1;

        if (this.x > 110) {
          this.x = 110;
        }

        this.draw();
      };
    }
  }

  //Class polygon 
  class Polygon {
    constructor(numSides, points, color, velocity_x, velocity_y) {
      this.numSides = numSides;
      this.points = points;
      this.color = color;
      this.velocity_x = velocity_x;
      this.velocity_y = velocity_y;

      this.draw = function () {
        ctx.beginPath();
        ctx.moveTo(this.points[0][0], this.points[0][1]);
        for (let i = 0; i < this.numSides; i++) {
          ctx.lineTo(this.points[i][0], this.points[i][1]);
        }
        ctx.lineTo(this.points[0][0], this.points[0][1]);
        ctx.fillStyle = this.color;
        ctx.fill();
      };

      //Update rachet
      this.update = function () {

        if (this.points[3][1] > 675) {
          this.velocity_x = 0;
          zoombie.update()
        }

        this.points[0][1] += this.velocity_x;
        this.points[1][1] += this.velocity_x;
        this.points[2][1] += this.velocity_x;
        this.points[3][1] += this.velocity_x;

        this.draw();
      };

      //Update robot's body
      this.updateRobotBody = function () {

        this.points[0][0] += this.velocity_x;
        this.points[1][0] += this.velocity_x;
        this.points[2][0] += this.velocity_x;
        this.points[3][0] += this.velocity_x;


        if (this.points[1][0] > 35) {
          this.velocity_x = 0;
        }

        this.draw();
      };

      //Update robot's cannon
      this.updateRobotCannon = function () {

        this.points[0][0] += this.velocity_x;
        this.points[1][0] += this.velocity_x;
        this.points[2][0] += this.velocity_x;
        this.points[3][0] += this.velocity_x;

        if (this.points[1][0] > 210) {
          this.velocity_x = 0;

          bullet.update();
        }

        this.draw();
      };
    }
  }

  //Class triangle
  class Triangle {
    constructor(points, color, velocity_x, velocity_y) {
      this.points = points;
      this.color = color;
      this.velocity_x = velocity_x;
      this.velocity_y = velocity_y;
      this.transparency = 0;

      this.draw = function () {
        ctx.beginPath();
        ctx.moveTo(this.points[0][0], this.points[0][1]);
        for (let i = 0; i < 3; i++) {
          ctx.lineTo(this.points[i][0], this.points[i][1]);
        }
        ctx.lineTo(this.points[0][0], this.points[0][1]);
        ctx.fillStyle = this.color;
        ctx.fill();
      };

      //Update rachet
      this.update = function () {

        if (this.points[2][1] > 825 || this.points[1][1] > 850 || this.points[0][1] > 850) {

          this.velocity_x = 0;
        }

        this.points[0][1] += this.velocity_x;
        this.points[1][1] += this.velocity_x;
        this.points[2][1] += this.velocity_x;

        this.draw();
      };

      //Delete triangles from ship
      this.delete = function () {
        this.points[0][0] = 0;
        this.points[1][0] = 0;
        this.points[2][0] = 0;
        this.points[0][1] = 0;
        this.points[1][1] = 0;
        this.points[2][1] = 0;
      }

      //Update rachet
      this.updateRachet = function () {

        if (this.points[2][1] > 900 || this.points[1][1] > 850 || this.points[0][1] > 850) {

          this.velocity_x = 0;
        }

        this.points[0][1] += this.velocity_x;
        this.points[1][1] += this.velocity_x;
        this.points[2][1] += this.velocity_x;

        this.draw();
      };

      //Update racket head
      this.updateHead = function () {

        if (this.points[2][1] > 575 || this.points[1][1] > 850 || this.points[0][1] > 850) {

          this.velocity_x = 0;
        }

        this.points[0][1] += this.velocity_x;
        this.points[1][1] += this.velocity_x;
        this.points[2][1] += this.velocity_x;

        this.draw();
      };

      //Update robot left foot
      this.updateRobotLeft = function () {

        this.points[0][0] += this.velocity_x;
        this.points[1][0] += this.velocity_x;
        this.points[2][0] += this.velocity_x;

        if (this.points[0][0] > 145) {
          this.velocity_x = 0;
        }

        this.draw();
      };

      //Update robot right foot
      this.updateRobotRight = function () {

        this.points[0][0] += this.velocity_x;
        this.points[1][0] += this.velocity_x;
        this.points[2][0] += this.velocity_x;

        if (this.points[0][0] > 70) {
          this.velocity_x = 0;
        }

        this.draw();
      };
    }
  }

  //Update different states of chocolate
  function updateChocolate() {
    count++;
    if (count < 1 * sceneLength) {
      explosion.update();
      explosion.draw();
      chocolate.transparency += 0.005;
    }
    else if (count == 1 * sceneLength) {
      chocolate.transparency = 1;
    }
    else if (count < 2 * sceneLength) {
      chocolate.rotate += 1 * toRadians;
    }
    else if (count == 2 * sceneLength) {
      chocolate.rotate = 0;
    }
    else if (count < 3 * sceneLength) {
      chocolate.pos.y -= 1;
    }
    else if (count == 3 * sceneLength) {
      chocolate.pos.x = 1110;
      chocolate.pos.y = 380;
    }
    else if (count < 4 * sceneLength) {
      chocolate.scale += .01;
      ctx.font = '35px Arial';
      ctx.strokeText('Romanian Strong Sensations', 880, 500);
    }
    else if (count == 4 * sceneLength) {
      chocolate.scale = 1;
      showRobot = true;
    }
    if (showRobot === true) {
      robot();
    }
  }

  //Explosion
  class ExplodeParticle {
    constructor(x, y) {
      this.pos = new Vector(x, y);
      this.speed = Math.random() * 10;
      this.velocity = new Vector(0, 0);
      this.velocity.x = (Math.random() * 2) - 1;
      this.velocity.y = (Math.random() * 2) - 1;
      this.velocity.normalize().multiply(this.speed);
      this.length = 5;
    }

    draw() {
      ctx.save();
      ctx.translate(this.pos.x, this.pos.y);
      ctx.strokeStyle = this.color;
      ctx.fillStyle = this.color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(this.velocity.x * 2, this.velocity.y * 2);
      ctx.arc(0, 0, this.length, 0, 2 * Math.PI);
      ctx.stroke()
      ctx.fill();
      ctx.restore();
    }
    update() {
      this.pos.add(this.velocity);
    }
  }

  class Explosion {
    constructor(size) {
      this.size = size;
    }
    init() {
      this.array = [];
      this.colors = ['red', 'yellow', 'blue'];
      let x = 1110;
      let y = 580;
      let color = this.colors[Math.floor(Math.random() * 3)];
      for (let i = 0; i < this.size; i++) {
        let e = new ExplodeParticle(x, y);
        e.color = color;
        this.array.push(e)
      }
    }
    update() {
      if (Math.random() < .05) this.init();
      for (let i = 0; i < this.size; i++) {
        this.array[i].update();
      }
    }
    draw() {
      for (let i = 0; i < this.size; i++) {
        this.array[i].draw();
      }
    }
  }

  //Initialise character
  function initCharacter() {
    zoombie = new Sprite("zombiesheet.png", 45);
    zoombie.spriteW = 192
    zoombie.spriteH = 256
    zoombie.sheetCols = 9
    zoombie.sheetRows = 5
    zoombie.animDelay = 30
    zoombie.pos.x = 700;
    zoombie.pos.y = 700;
  }

  //Class sprite 
  class Sprite {
    constructor(name, frames, spriteWidth, spriteHeight) {
      this.image = document.createElement("img");
      this.image.src = name;
      this.frames = frames;
      this.pos = new Vector(0, 0);
      this.spriteW = spriteWidth;
      this.spriteH = spriteHeight;
      this.scale = 1;
      this.flipY = false;
      this.rotate = 0;
      this.transparency = 0;
      this.index = 1;
      this.sheetRows = 1;
      this.sheetCols = 1;
      this.col = 0;
      this.row = 0;
      this.animDelay = 0;
      this.count = 0;
      this.list = []
      this.tx = 0;
      this.ty = 0;
      this.tinc = 1;
      this.showDude = true;
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = this.transparency;
      ctx.translate(this.pos.x, this.pos.y);
      ctx.rotate(this.rotate);
      if (this.flipY) { ctx.scale(-this.scale, this.scale); }
      else { ctx.scale(this.scale, this.scale); }
      ctx.translate(-this.spriteW / 2, -this.spriteH / 2);
      ctx.drawImage(this.image, 0, 0, this.spriteW, this.spriteH);
      ctx.restore();


    }
    drawAnim() {
      ctx.save()
      ctx.translate(this.pos.x, this.pos.y);
      ctx.rotate(this.rotate);
      ctx.scale(this.scale, this.scale);
      ctx.translate(-this.spriteW / 2, -this.spriteH / 2);
      if (this.index >= this.list.length) this.index = 0;
      this.col = this.list[this.index] % this.sheetCols;
      this.row = Math.trunc(this.list[this.index] / this.sheetCols);
      ctx.drawImage(this.image, this.col * this.spriteW, this.row * this.spriteH, this.spriteW,
        this.spriteH, 0, 0, this.spriteW, this.spriteH);
      ctx.restore()
      this.count += 1;
      if (this.count % this.animDelay == 0) {
        this.count = 0;
        this.index += 1;
        if (this.index == this.list.length)
          this.index = 0;
      }
      let tmp = 0;
    }
    drawAnimAll() {
      ctx.save()
      ctx.translate(this.pos.x, this.pos.y);
      ctx.rotate(this.rotate);
      ctx.scale(this.scale, this.scale);
      ctx.translate(-this.spriteW / 2, -this.spriteH / 2);

      this.col = this.index % this.sheetCols;
      this.row = Math.trunc(this.index / this.sheetCols);
      ctx.drawImage(this.image, this.col * this.spriteW, this.row * this.spriteH, this.spriteW, this.spriteH, 0, 0, this.spriteW, this.spriteH);
      ctx.restore()
      this.count += 1;
      if (this.count % this.animDelay == 0) {
        this.count = 0;
        this.index += 1;
        this.index = this.index % this.frames;
      }
      let tmp = 0;
    }
    resetIndex(n) {
      this.index = n;
    }
    wrapScreen() {
      if (this.pos.x < 0) this.pos.x = width;
      if (this.pos.x > width) this.pos.x = 0;
      if (this.pos.y < 0)
        this.pos.y = height;
      if (this.pos.y > height) this.pos.y = 0;
    }

    //Update sprite movement
    update() {

      countSprite++;

      if (countSprite < 650) {

        this.list = [36, 37, 38, 39, 40, 41, 43];
        ctx.save();
        ctx.translate(this.tx, 0);
        ctx.translate(this.pos.x, this.pos.y);
        ctx.scale(1, 1);
        ctx.translate(-this.pos.x, -this.pos.y);
        this.tx += this.tinc;
        ctx.font = '30px Arial';
        ctx.strokeText('Sugarrr!!!', this.pos.x + 80, this.pos.y + 20);
        this.drawAnim();
        ctx.restore();

      } else if (countSprite < 1200) {

        this.pos.x = 1370;
        this.list = [5, 6];
        ctx.save();
        ctx.translate(1, -this.ty);
        ctx.translate(this.pos.x, this.pos.y);
        ctx.scale(1, 1);
        ctx.translate(-this.pos.x, -this.pos.y);
        this.ty += this.tinc;
        this.drawAnim();
        ctx.restore();

      } else if (countSprite < 100000) {
        this.pos.x = 1350;
        this.pos.y = 100;
        this.index = 10;
        ctx.font = '30px Arial';
        ctx.strokeText('Finally, chocolate!!!', this.pos.x - 350, this.pos.y + 20);
        this.drawAnimAll();

        if (this.pos.x > 1348) {
          circle.update();
        }
      } else if (countSprite < 300000) {
        this.pos.x = 1350;
        this.pos.y = 100;
        this.index = 4;
        ctx.font = '30px Arial';
        ctx.strokeText('Nooo, my racket!!!', this.pos.x - 300, this.pos.y + 20);
        this.drawAnimAll();

        if (this.pos.x > 1348) {
          circle.update();
        }
      }
    }

    myRacket() {
      countSprite = 200000;
      racketLeftWing.delete();
      racketRightWing.delete();
      draw1()
      draw2();
    }
  }

  //Class SprayDrop
  class SprayDrop {
    constructor(x, y) {
      this.pos = new Vector(x, y);
      this.gravity = new Vector(0, 2.5);
      this.startPos = new Vector(x, y);
      this.startTime = Math.round(Math.random() * 100);
      this.alive = false;
      this.transparency = 1;
      this.transparencyDec = 0.10;
      this.length = (Math.random() * 5) + 0;
      this.velocity = this.setDirectionVector(0, 200);
      this.velocity.multiply(Math.random() * 8) + 5;
      this.startVector = this.velocity.clone();
      this.red = 0; this.green = 0; this.blue = 0;
      this.startColor = [0, 255, 255];
      this.endColor = [255, 0, 255];
      this.interpColor;
    }
    setDirectionVector(minAngle, maxAngle) {
      let range, newangle;
      range = maxAngle - minAngle;
      newangle = minAngle + Math.random() * range;
      let xd = Math.cos(newangle * toRadians);
      let yd = Math.sin(newangle * toRadians);
      return (new Vector(xd, yd))
    }
    update(count) {
      if (count == this.startTime) {
        this.alive = true;
        this.pos.x = rocketStartX;
        this.pos.y = rocketStartY;
      }
      if (this.alive) {
        this.transparency -= this.transparencyDec;
        this.interpColor = this.interpolateColor(this.startColor, this.endColor, (1 - this.transparency));
        this.red = this.interpColor[0]; this.green = this.interpColor[1]; this.blue = this.interpColor[2];
        this.velocity.add(this.gravity)
        this.pos.add(this.velocity);
        this.updateOnTransparency();
      }
    }
    updateOnTransparency() {
      if (this.transparency < 0) {
        this.pos.x = rocketStartX;
        this.pos.y = rocketStartY;
        this.velocity = this.startVector.clone()
        this.transparency = 1;
        this.red = this.startColor[0]; this.green = this.startColor[1]; this.blue = this.startColor[2];
      }
    }
    draw() {
      ctx.save();
      ctx.translate(this.pos.x, this.pos.y);
      ctx.fillStyle = 'rgba(' + this.red + "," + this.green + "," + this.blue + "," + this.transparency + ")"
      ctx.beginPath();
      ctx.arc(0, 0, this.length, 0, 2 * Math.PI);
      ctx.fill();
      ctx.restore();
      this.rotate += this.rotationInc;
    }
    interpolateColor(acolor, bcolor, proportion) {
      let rcol = acolor[0] + ((bcolor[0] - acolor[0]) * proportion);
      let gcol = acolor[1] + ((bcolor[1] - acolor[1]) * proportion);
      let bcol = acolor[2] + ((bcolor[2] - acolor[2]) * proportion);
      let result = [rcol, gcol, bcol];
      return result;
    }
  }

  //Class spray
  class Spray {
    constructor(size) {
      this.size = size;
      this.array = [];
      this.scale;
      this.count = 0;
    }
    init(x, y) {
      for (let i = 0; i < this.size; i++) {
        this.array.push(new SprayDrop(rocketStartX, rocketStartY))
      }
    }
    update() {
      for (let i = 0; i < this.size; i++) {
        this.array[i].update(this.count);
      }
      this.count++;
    }
    draw() {

      for (let i = 0; i < this.size; i++) {
        if (this.array[i].alive) {
          this.array[i].draw();
        }
      }
    }
  }
  let rocketStartX = 540;
  let rocketStartY = -255;

  function update() {
    spray.update();
    rocketStartY += 5;

    if (rocketStartY > 850) {
      rocketStartY = 1000;
    }
  }

  //Function to create bullet
  function object(width, height, color, x, y) {
    this.width = width;
    this.height = height;
    this.angle = 0;
    this.x = x;
    this.y = y;
    this.update = function () {
      ctx.save();
      this.x += 1;
      if (this.x > 550) {
        this.x = 550
        rain.update();
        rain.draw()
        racketRightWing.delete();
        racketLeftWing.delete();
        draw1()
        draw2()
        zoombie.myRacket()
      }
      this.angle += 1 * Math.PI / 180;
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);
      ctx.fillStyle = color;
      ctx.fillRect(this.width / -2, this.height / -2, this.width, this.height);
      ctx.restore();
    }
  }

  //Activate robot
  function robot() {
    robotCannon.updateRobotCannon();
    robotHead.updateRobotHead()
    robotLeftFoot.updateRobotLeft();
    robotRightFoot.updateRobotRight();
    robotWheel1.updateRobotWheel1();
    robotWheel2.updateRobotWheel2();
    robotBody.updateRobotBody();
  }

  //Class rain
  class RainDrop {
    constructor() {
      this.pos = new Vector(0, 0);
      this.velocity = new Vector(0, 0);
      this.startPos = new Vector(0, 0);
      this.startPos.x = 645;
      this.startPos.y = 70;
      this.pos.x = this.startPos.x + Math.random() * 185;
      this.pos.y = this.startPos.y + (Math.random() * 50) - 0;
      this.length = (Math.random() * 7) + 3;
      let t = (Math.random() * 5) + 5;
      this.velocity = new Vector(0, t);
    }
    draw() {
      ctx.save();
      ctx.translate(this.pos.x, this.pos.y);
      ctx.strokeStyle = 'white';
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, this.length);
      ctx.stroke()
      ctx.restore();
    }
    update() {
      this.pos.add(this.velocity);
      if (this.pos.y > 300) {
        this.pos.y = this.startPos.y;
      }
    }
  }

  //Class rain
  class Rain {
    constructor(size) {
      this.size = size;
      this.array = [];
    }
    init() {
      for (let i = 0; i < this.size; i++) {
        this.array.push(new RainDrop())
      }
    }
    update() {
      for (let i = 0; i < this.size; i++) {
        this.array[i].update();
      }
    }
    draw() {
      for (let i = 0; i < this.size; i++) {
        this.array[i].draw();
      }
    }
  }

  function easeOutBounce(x) {
    const n1 = 7.5625;
    const d1 = 2.75;
    if (x < 1 / d1) {
      return n1 * x * x;
    } else if (x < 2 / d1) {
      return n1 * (x -= 1.5 / d1) * x + 0.75;
    } else if (x < 2.5 / d1) {
      return n1 * (x -= 2.25 / d1) * x + 0.9375;
    } else {
      return n1 * (x -= 2.625 / d1) * x + 0.984375;
    }
  }

  //Class PolygonTweening
  class PolygonTweening {
    constructor(points, color) {
      this.points = points;
      this.color = color;
    }
    draw() {
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(this.points[0][0], this.points[0][1]);
      for (let i = 0; i < this.points.length; i++) {
        ctx.lineTo(this.points[i][0], this.points[i][1]);
      }
      ctx.lineTo(this.points[0][0], this.points[0][1]);
      ctx.fillStyle = this.color;
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.strokeStyle = 'black'
      ctx.stroke();
      ctx.restore();
    }
    tween(a, b, proportion) {
      let differenceX;
      let differenceY;
      let tweenX;
      let tweenY;
      let result = new PolygonTweening([], 'rgb(0,0,0)')

      for (let i = 0; i < a.points.length; i++) {
        differenceX = b.points[i][0] - a.points[i][0];
        differenceY = b.points[i][1] - a.points[i][1];
        tweenX = a.points[i][0] + proportion * differenceX;
        tweenY = a.points[i][1] + proportion * differenceY;
        tweenX = a.points[i][0] + easeOutBounce(proportion) * differenceX;
        tweenY = a.points[i][1] + easeOutBounce(proportion) * differenceY;
        tweenX = a.points[i][0] + easeOutBounce(proportion) * differenceX;
        tweenY = a.points[i][1] + easeOutBounce(proportion) * differenceY;
        result.points.push([tweenX, tweenY])
      }
      let acolor = a.color.substring(4, a.color.length - 1).split(',');
      let bcolor = b.color.substring(4, b.color.length - 1).split(',');
      let rcol = parseInt(acolor[0]) + ((parseInt(bcolor[0]) - parseInt(acolor[0])) * proportion);
      let gcol = parseInt(acolor[1]) + ((parseInt(bcolor[1]) - parseInt(acolor[1])) * proportion);
      let bcol = parseInt(acolor[2]) + ((parseInt(bcolor[2]) - parseInt(acolor[2])) * proportion);
      result.color = 'rgb(' + rcol + ',' + gcol + ',' + bcol + ')';
      return (result)
    }
  }


  function tweenTwoPolygons(apoly, bpoly, inc) {
    tweenPoly = apoly.tween(apoly, bpoly, proportion);
    proportion += inc
    if (proportion >= 1) proportion = 0
  }

  function draw1() {
    ctx.clearRect(0, 0, 0, 0)

    if (countTweening < interval * 1) {
      rightWing.draw();
    }
    else if (countTweening < interval * 2) {
      tweenTwoPolygons(rightWing, reversedRightWing, 1 / interval);
      tweenPoly.draw();
    }
    else if (countTweening < interval * 1000) {
      reversedRightWing.draw();
    }
    countTweening++;
  }


  function draw2() {
    ctx.clearRect(0, 0, 0, 0)

    if (countTweening < interval * 1) {
      leftWing.draw();
    }
    else if (countTweening < interval * 2) {
      tweenTwoPolygons(leftWing, reversedLeftWing, 1 / interval);
      tweenPoly.draw();
    }
    else if (countTweening < interval * 1000) {
      reversedLeftWing.draw();
    }
    countTweening++;
  }

  // Loop rendering the 2 scenes.
  function animate() {

    music.play();
    
    const t = clock.getElapsedTime()

    poster.geometry.vertices.map(v => {
      v.z = 0.25 * Math.sin(v.x * 3 + t);
    })

    poster.geometry.verticesNeedUpdate = true;

    sphere.rotation.y -= -0.01 / 2;

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    spray.draw();
    update();

    //Initialise racket and update
    racketHead.updateRachet();
    racketBody.update();
    racketWindow.updateRacket()
    racketLeftWing.update();
    racketRightWing.update();
    racketEngine.updateHead();
    ctx.save()

    //Draw circle
    circle.draw()

    let delta = lastRender;
    fps = 1000 / delta;
    texture2D.needsUpdate = true;

    // Render the 3D scene.
    renderer.render(firstScene3D, firstSceneCamera3D);

    renderer.render(secondScene3D, secondSceneCamera3D);

    // Render 2D on top of the 3D scene.
    renderer.render(scene2D, camera2D);

    // Request new frame.
    requestAnimationFrame(animate);
  };

  let toRadians = Math.PI / 100;

  //Initialise chocolate
  let chocolate = new Sprite("rom.png", 1, 200, 50);
  chocolate.pos.x = 1110; chocolate.pos.y = 580;

  //Initialise racket parts
  let circle = new Circle(1250, 150, 5, 50, 'rgb(128, 51, 51)');
  let racketBody = new Polygon(4, [[480, -300], [600, -300], [600, -450], [480, -450]], 'rgb(232, 240, 17)', 5, 5);
  let racketWindow = new Circle(540, -400, 5, 30, 'rgb(44, 93, 230)');
  let racketLeftWing = new Triangle([[600, -450], [600, -300], [650, -300]], 'rgb(212, 13, 13)', 5, 5);
  let racketRightWing = new Triangle([[480, -450], [480, -300], [430, -300]], 'rgb(212, 13, 13)', 5, 5);
  let racketEngine = new Triangle([[480, -450], [600, -450], [540, -550]], 'rgb(212, 13, 13)', 5, 5);
  let racketHead = new Triangle([[480, -270], [600, -270], [540, -500]], 'rgb(212, 13, 13)', 5, 5);

  //Initialise robot
  let robotLeftFoot = new Triangle([[-115, 850], [-150, 800], [-80, 800]], 'blue', 1, 1);
  let robotRightFoot = new Triangle([[-190, 850], [-225, 800], [-155, 800]], 'blue', 1, 1);
  let robotWheel1 = new Circle(-110, 850, 5, 30, 'rgb(44, 93, 230)');
  let robotWheel2 = new Circle(-190, 850, 5, 30, 'rgb(44, 93, 230)');
  let robotBody = new Polygon(4, [[-80, 800], [-225, 800], [-225, 730], [-80, 730]], 'rgb(3, 9, 64)', 1, 1);
  let robotCannon = new Polygon(4, [[-100, 700], [-50, 700], [-50, 720], [-100, 720]], 'red', 1, 1);
  let robotHead = new Circle(-152, 730, 5, 70, 'rgb(44, 93, 230)');
  let bullet = new object(20, 20, "red", 200, 710);

  //Polygons for tweening
  let rightWing = new PolygonTweening([[650, 830], [600, 680], [600, 830]], 'red');
  let reversedRightWing = new PolygonTweening([[650, 680], [600, 680], [600, 830]], 'red');
  let leftWing = new PolygonTweening([[430, 830], [480, 680], [480, 830]], 'red');
  let reversedLeftWing = new PolygonTweening([[430, 680], [480, 680], [480, 830]], 'red');

  let tweenPoly
  let proportion = 0;
  let interval = 100;
  let sceneLength = 200;
  let showRobot = false;
  let lastRender;
  let count = 0;
  let countSprite = 0;
  let countTweening = 0;

  //Initialise racket engine
  let spray = new Spray(2000);
  spray.init(ctx.canvas.width / 2, ctx.canvas.height / 2);

  //Initialise rain
  let rain = new Rain(1000);
  rain.init();

  //Initialise zoombie
  initCharacter()

  //Initialise explosion
  let explosion = new Explosion(1000);
  explosion.init();

  //Music
  let music = new Audio('alex-productions-epic-cinematic-gaming-cyberpunk-reset.mp3');
  
  // Start animation.
  animate();


});

