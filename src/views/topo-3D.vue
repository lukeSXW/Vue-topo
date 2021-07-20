<template>
  <div class="main-page">
    <div class="large-screen" ref="largeScreen"></div>
    <div class="operate-column">
      <a-button @click="toTopopage">返回拓扑页面</a-button>
      <a-button style="margin-top: 10px" @click="showTopoView"
        >显示拓扑模板</a-button
      >
      <a-button style="margin-top: 10px" @click="attackMachine"
        >攻击物理主机</a-button
      >
      <a-button style="margin-top: 10px" @click="flowLine">流动线条</a-button>
    </div>
  </div>
</template>


<script>
import * as THREE from "three/three";
import "three/examples/js/controls/TrackballControls";

export default {
  data() {
    return {
      // 场景
      scene: null,
      // 相机
      camera: null,
      // 渲染器
      renderer: null,
      // 直射光
      dirLight: null,
      // 控制器
      controls: null,
      // x偏移量
      xRemoveDistance: 0,
      // y偏移量
      yRemoveDistance: 0,
      // 纹理数组
      textureList: [],
      // 视图是否显示
      showView: false,
      // 物理主机
      physicalMachine: null,
      // 连线数组
      linesList: [],
      // 流动线索引
      flowLineIndex:0
    };
  },
  async mounted() {
    // 提前获取纹理图片
    //   初始化three.js三大组件
    this.initThree();
  },
  methods: {
    initThree() {
      const content = this.$refs.largeScreen;
      const contentWidth = content.clientWidth;
      const contentHeight = content.clientHeight;

      this.camera = new THREE.PerspectiveCamera(
        60,
        contentWidth / contentHeight,
        0.1,
        1e10
      );
      this.camera.position.z = 800;
      this.controls = new THREE.TrackballControls(this.camera);
      this.controls.dynamicDampingFactor = 0.1;

      this.scene = new THREE.Scene();
      this.scene.add(this.camera);

      this.dirLight = new THREE.DirectionalLight("#87CEFA");
      this.dirLight.position.set(10, 0, 30);
      this.camera.add(this.dirLight);
      this.camera.add(this.dirLight.target);

      this.renderer = new THREE.WebGLRenderer({ antialias: false });
      this.renderer.setClearColor('#ffffff', 1);
      this.renderer.setSize(contentWidth, contentHeight);
      content.appendChild(this.renderer.domElement);

      const that = this;
      function animate() {
        requestAnimationFrame(animate);
        that.controls.update();
        that.renderer.render(that.scene, that.camera);
      }
      animate();
    },
    // 显示拓扑数据
    showTopoView() {
      if (this.showView) {
        return;
      }
      const topoData = JSON.parse(localStorage.getItem("topoData")).pens;
      //   确定画布中心
      this.confirmCenterPoint(topoData.filter((item) => item.type === 0));
      //   绘制节点和连线
      topoData.forEach((item) => {
        if (item.type === 0) {
          // 说明是节点
          this.createNode(item);
        } else if (item.type === 1) {
          // 说明是连线
          this.createLine(item);
        }
      });
      this.showView = true;
    },
    // 返回拓扑页面
    toTopopage() {
      this.$router.push({ path: "/" });
    },

    // 创建一个节点
    async createNode(target) {
      const that = this;
      if (target.topo_name === "物理主机") {
        const geometry = new THREE.BoxGeometry(30, 50, 70);
        // const imgList = [
        //   "https://www.htmlstudio.top/imgs/others/beauty_1",
        //   "https://www.htmlstudio.top/imgs/others/beauty_2",
        //   "https://www.htmlstudio.top/imgs/others/beauty_3",
        //   "https://www.htmlstudio.top/imgs/others/bt_girl_1",
        //   "https://www.htmlstudio.top/imgs/others/bt_girl_2",
        //   "https://www.htmlstudio.top/imgs/others/bt_girl_3",
        // ];
        // let skinList = await this.getImageList(imgList);
        // const materials = new THREE.MeshFaceMaterial(
        //   skinList.map((item) => new THREE.MeshBasicMaterial({ map: item }))
        // );
        const colorList = ['#A6D8FF','#A6D8FF','#249FFF','#A6D8FF','#7AC5FF','#A6D8FF']

        const materials = new THREE.MeshFaceMaterial(colorList.map(item => new THREE.MeshBasicMaterial({ color: item })))

        const mesh = new THREE.Mesh(geometry, materials);
        
        const group = new THREE.Group();

        group.add(mesh);
        // group.rotateY(-Math.PI / 6 );
        // group.rotateX(Math.PI / 10);
        // group.rotateZ(-Math.PI / 12);

        this.physicalMachine = group;
        that.moveObject2center(group, target);
        that.scene.add(group);
      } else if (target.topo_name === "三方设备") {
        const geometry = new THREE.BoxGeometry(50, 20, 50);

        const colorList = new Array(6).fill({
          color:'#A6D8FF',
          transparent:true,
          opacity:0.8
        })

        colorList[2] = {
          color:'#249FFF',
          transparent:true,
          opacity:1
        }

        const colorList_1 = new Array(6).fill({
          color:'#A6D8FF',
          transparent:true,
          opacity:1
        })

        colorList_1[2] = {
          color:'#7AC5FF',
          transparent:true,
          opacity:1
        }

        colorList_1[4] = {
          color:'#57B6FF',
          transparent:true,
          opacity:1
        }

        const topMeshMaterials = new THREE.MeshFaceMaterial(colorList.map(item => new THREE.MeshBasicMaterial(item)))
        const bottomMeshMaterials = new THREE.MeshFaceMaterial(colorList_1.map(item => new THREE.MeshBasicMaterial(item)))

        const mesh_1 = new THREE.Mesh(geometry, topMeshMaterials);
        const mesh_2 = new THREE.Mesh(geometry, bottomMeshMaterials);
        mesh_1.position.y += 12;
        mesh_2.position.y -= 12;
        //create a group and add the two cubes
        //These cubes can now be rotated / scaled etc as a group
        const group = new THREE.Group();
        group.add(mesh_1);
        group.add(mesh_2);

        this.moveObject2center(group, target);
        group.rotateY(-Math.PI / 4);
        group.rotateX(Math.PI / 8);
        group.rotateZ(-Math.PI / 8);
        this.scene.add(group);
      } else if (target.topo_name === "交换机") {
        const cube = new THREE.BoxGeometry(50, 50, 50);
        const geometry = new THREE.BoxGeometry(40, 15, 40);
        

        const outColorList = new Array(6).fill({
          color:'#BCE1FF',
          transparent:true,
          opacity:0.6
        })
        const colorList = new Array(6).fill({
          color:'#27E1F0',
        })
        colorList[2] = {
          color:'#00FFE4',
        }
        
        const outMeshMaterials = new THREE.MeshFaceMaterial(outColorList.map(item => new THREE.MeshBasicMaterial(item)))
        const topMeshMaterials = new THREE.MeshFaceMaterial(colorList.map(item => new THREE.MeshBasicMaterial(item)))
        const bottomMeshMaterials = new THREE.MeshFaceMaterial(colorList.map(item => new THREE.MeshBasicMaterial(item)))

        const mesh_1 = new THREE.Mesh(geometry, topMeshMaterials);
        const mesh_2 = new THREE.Mesh(geometry, bottomMeshMaterials);
        const mesh_3 = new THREE.Mesh(cube, outMeshMaterials);
        mesh_1.position.y += 10;
        mesh_2.position.y -= 10;
        const group = new THREE.Group();
        group.add(mesh_3);
        group.add(mesh_1);
        group.add(mesh_2);
        this.moveObject2center(group, target);
        group.rotateY(-Math.PI / 2.2);
        group.rotateX(Math.PI / 8);
        group.rotateZ(-Math.PI / 5);
        this.scene.add(group);
      } else if (target.topo_name === "虚拟主机") {
        function CustomSinCurve(scale) {
          THREE.Curve.call(this);
          this.scale = scale === undefined ? 1 : scale;
        }
        CustomSinCurve.prototype = Object.create(THREE.Curve.prototype);
        CustomSinCurve.prototype.constructor = CustomSinCurve;
        CustomSinCurve.prototype.getPoint = function (t) {
          const tx = t * 3 - 1.5;
          const ty = 2 * Math.sin(1 * Math.PI * t);
          const tz = 0;
          return new THREE.Vector3(tx, ty, tz).multiplyScalar(this.scale);
        };
        const path = new CustomSinCurve(10);
        const geometry = new THREE.TubeGeometry(path, 20, 2, 8, false);
        const material = new THREE.MeshBasicMaterial({
          color: "#3FC3FF",
          transparent: true,
          opacity: 0.8,
        });
        const mesh = new THREE.Mesh(geometry, material);

        mesh.position.x -= 1;
        mesh.position.y += 15;


        const geometry_1 = new THREE.BoxGeometry(50, 40, 15);
        const colorList = new Array(6).fill({
          color:'#7AC5FF',
          transparent:true,
          opacity:0.7,
          side: THREE.DoubleSide
        })

        colorList[2] = {
          color:'#219EFF',
          side: THREE.DoubleSide
        }

        colorList[5] = {
          color:'#219EFF',
          side: THREE.DoubleSide
        }

        
        const MeshMaterials = new THREE.MeshFaceMaterial(colorList.map(item => new THREE.MeshBasicMaterial(item)))

        const mesh_1 = new THREE.Mesh(geometry_1, MeshMaterials);

        const group = new THREE.Group();
        group.rotateX(Math.PI / 6);
        group.rotateY(-Math.PI / 4);

        group.add(mesh);
        group.add(mesh_1);
        this.moveObject2center(group, target);
        this.scene.add(group);
      } else if (target.topo_name === "安全设备") {
        const geometry = new THREE.RingGeometry(0.0000001, 30, 32);
        const material = new THREE.MeshBasicMaterial({
          color:'#92D0FF',
          side: THREE.DoubleSide,
        });
        const circle = new THREE.Mesh(geometry, material);
        circle.rotateX(-Math.PI / 2.5);
        circle.position.y -= 35;

        // 球体
        const geometry_1 = new THREE.SphereGeometry(25, 32, 32);
        const material_1 = new THREE.MeshBasicMaterial({
          color:'#7BFFF1',
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.5,
        });
        const ball = new THREE.Mesh(geometry_1, material_1);
        ball.position.y -= 15;
        ball.position.z += 12;

        const group = new THREE.Group();
        group.add(circle);
        group.add(ball);
        // group.add(lathe);
        this.moveObject2center(group, target);
        this.scene.add(group);
      } else if (target.topo_name === "路由器") {
        function CustomSinCurve(scale) {
          THREE.Curve.call(this);

          this.scale = scale === undefined ? 1 : scale;
        }

        CustomSinCurve.prototype = Object.create(THREE.Curve.prototype);
        CustomSinCurve.prototype.constructor = CustomSinCurve;
        CustomSinCurve.prototype.getPoint = function (t) {
          const tx = t * 2 - 1.5;
          const ty = Math.sin(1 * Math.PI * t);
          const tz = 0;
          return new THREE.Vector3(tx, ty, tz).multiplyScalar(this.scale);
        };
        const path = new CustomSinCurve(10);
        const pipe = new THREE.TubeGeometry(path, 20, 2, 8, false);
        const signMaterials = new THREE.MeshBasicMaterial({
          color:'#62BAFF'
        });
        const signal = new THREE.Mesh(pipe, signMaterials);
        const signal_1 = new THREE.Mesh(pipe, signMaterials);
        signal.rotateX(Math.PI / 6);
        // signal.rotateY(-Math.PI / 4);
        signal.position.x -= 3;
        signal.position.y += 30;
        signal.position.z += 8;

        signal_1.rotateX(Math.PI / 6);
        // signal_1.rotateY(-Math.PI / 4);
        signal_1.position.x -= 3;
        signal_1.position.y += 40;
        signal_1.position.z += 14;

        var geometry = new THREE.CylinderGeometry(3, 3, 15, 32);
        const cylinderMaterials = new THREE.MeshBasicMaterial({
          color:'#3AB3FF'
        });
        var cylinder = new THREE.Mesh(geometry, cylinderMaterials);
        cylinder.position.x -= 10;
        cylinder.position.y += 20;
        cylinder.rotateX(Math.PI / 6);
        cylinder.rotateY(-Math.PI / 6);

        const geometry_1 = new THREE.BoxGeometry(50, 25, 25);

        const colorList = new Array(6).fill({
          color:'#A6D8FF',
        })
        colorList[2] = {
          color:'#219EFF',
        }
        colorList[4] = {
          color:"#7AC5FF"
        }
     
        const cubeMaterials = new THREE.MeshFaceMaterial(colorList.map(item => new THREE.MeshBasicMaterial(item)))

        const mesh_1 = new THREE.Mesh(geometry_1, cubeMaterials);
        mesh_1.rotateX(Math.PI / 6);
        mesh_1.rotateY(-Math.PI / 6);

        const group = new THREE.Group();
        group.add(mesh_1);
        group.add(cylinder);
        group.add(signal);
        group.add(signal_1);
        group.rotateZ(-Math.PI/24); 
        this.moveObject2center(group, target);
        group.position.y -= 5;
        this.scene.add(group);
      }
    },

    moveObject2center(object, target) {
      object.position.x =
        (target.rect.x + target.rect.ex) / 2 - this.xRemoveDistance;
      object.position.y = -(
        (target.rect.y + target.rect.ey) / 2 -
        this.yRemoveDistance
      );
    },

    getImageList(urlList) {
      const that = this;
      const promiseList = urlList.map((imgUrl) => that.getImage(imgUrl));
      return Promise.all(promiseList);
    },

    getImage(url) {
      return new Promise((resolve, reject) => {
        const loader = new THREE.TextureLoader();
        loader.load(url, function (texture) {
          resolve(texture);
        });
      });
    },

    // 创建一个连线
    createLine(target) {
      const material = new THREE.LineBasicMaterial({
        color: "#6686A3",
      });
      const geometry = new THREE.Geometry();
      geometry.vertices.push(
        new THREE.Vector3(
          target.from.x - this.xRemoveDistance,
          -(target.from.y - this.yRemoveDistance),
          0
        ),
        new THREE.Vector3(
          target.to.x - this.xRemoveDistance,
          -(target.to.y - this.yRemoveDistance),
          0
        )
      );
      const line = new THREE.Line(geometry, material);
      const group = new THREE.Group();
      let geometry_1 = new THREE.ConeGeometry(5, 20, 32);
      let material_1 = new THREE.MeshBasicMaterial({ color: "#1890FF" });
      let cone = new THREE.Mesh(geometry_1, material_1);
      cone.position.x = target.to.x - this.xRemoveDistance;
      cone.position.y = -(target.to.y - this.yRemoveDistance);
      cone.rotateZ(-Math.PI / 2);
      cone.rotateZ(
        Math.atan(
          -(target.to.y - target.from.y) / (target.to.x - target.from.x)
        )
      );
      // 旋转180度
      if (target.to.x < target.from.x) {
        cone.rotateZ(Math.PI);
      }
      group.add(line);
      group.add(cone);
      this.linesList.push(group);
      this.scene.add(group);
    },
    // 确定拓扑图的中心点
    confirmCenterPoint(nodeList) {
      const xList = nodeList.map((item) => item.rect.x);
      const yList = nodeList.map((item) => item.rect.y);
      this.xRemoveDistance = (Math.max(...xList) + Math.min(...xList)) / 2;
      this.yRemoveDistance = (Math.max(...yList) + Math.min(...yList)) / 2;
    },

    // 攻击
    attackMachine() {
      const that = this;
      var geometry = new THREE.SphereGeometry(20, 32, 32);
      var material = new THREE.MeshBasicMaterial({
        color: "#DC143C",
        transparent: true,
        opacity: 0.5,
      });
      var sphere = new THREE.Mesh(geometry, material);
      that.physicalMachine.add(sphere);
      function attackView() {
        if (
          that.physicalMachine.children[1].scale.x > 2 ||
          that.physicalMachine.children[1].scale.y > 2 ||
          that.physicalMachine.children[1].scale.z > 2
        ) {
          that.physicalMachine.children[1].scale.x = 1;
          that.physicalMachine.children[1].scale.y = 1;
          that.physicalMachine.children[1].scale.z = 1;
        }

        that.physicalMachine.children[1].scale.x += 0.01;
        that.physicalMachine.children[1].scale.y += 0.01;
        that.physicalMachine.children[1].scale.z += 0.01;
        requestAnimationFrame(attackView);
        that.renderer.render(that.scene, that.camera);
      }
      attackView();
    },

    // 流动性连线
    flowLine() {
      const that = this;
      // 当前连线
      const columnList = new THREE.Group();
        const lineChild = that.linesList[that.flowLineIndex].children.find(
          (item) => item.type === "Line"
        );

        const lineLlength = Math.trunc(
          Math.sqrt(
            Math.pow(
              lineChild.geometry.vertices[1].y -
                lineChild.geometry.vertices[0].y,
              2
            ) +
              Math.pow(
                lineChild.geometry.vertices[1].x -
                  lineChild.geometry.vertices[0].x,
                2
              )
          )
        );
        const gapX =
          (Math.abs(
            lineChild.geometry.vertices[1].x - lineChild.geometry.vertices[0].x
          ) *
            10) /
          lineLlength;
        const gapY =
          (Math.abs(
            lineChild.geometry.vertices[1].y - lineChild.geometry.vertices[0].y
          ) *
            10) /
          lineLlength;
        for (let i = 0; i < Math.trunc(Math.trunc(lineLlength) / 10); i++) {
          var geometry_1 = new THREE.CylinderGeometry(2, 2, 10, 32);
          var material_1 = new THREE.MeshBasicMaterial({
            color: i % 2 === 1 ? "#EEE8AA" : "#DC143C",
            transparent: true,
            opacity: 0.5,
          });
          var cylinder_1 = new THREE.Mesh(geometry_1, material_1);
          if (
            lineChild.geometry.vertices[1].x < lineChild.geometry.vertices[0].x
          ) {
            cylinder_1.position.x = lineChild.geometry.vertices[0].x - i * gapX;
          } else {
            cylinder_1.position.x = lineChild.geometry.vertices[0].x + i * gapX;
          }

          if (
            lineChild.geometry.vertices[1].y < lineChild.geometry.vertices[0].y
          ) {
            cylinder_1.position.y = lineChild.geometry.vertices[0].y - i * gapY;
          } else {
            cylinder_1.position.y = lineChild.geometry.vertices[0].y + i * gapY;
          }
          cylinder_1.rotateZ(
            Math.atan(
              (lineChild.geometry.vertices[1].y -
                lineChild.geometry.vertices[0].y) /
                (lineChild.geometry.vertices[1].x -
                  lineChild.geometry.vertices[0].x)
            )
          );
          cylinder_1.rotateZ(Math.PI / 2);
          columnList.add(cylinder_1);
        }
        columnList.name = "activeLine";

        that.linesList[that.flowLineIndex].add(columnList);

        const activeLine = that.linesList[that.flowLineIndex].children.find(
          (item) => item.name === "activeLine"
        );

        // 重置节点位置
        function resetPointPosition(pintTarget){
          pintTarget.position.x = lineChild.geometry.vertices[0].x
          pintTarget.position.y = lineChild.geometry.vertices[0].y;
        }
        function activeLineAnimate() {
          if (
            lineChild.geometry.vertices[1].x < lineChild.geometry.vertices[0].x
          ) {
            // 如果终点X坐标小于起点X坐标
            activeLine.children.forEach((lineItem) => {
              if (lineItem.position.x - gapX * 0.1 <= lineChild.geometry.vertices[1].x) {
                resetPointPosition(lineItem);
              }else{
                lineItem.position.x -= gapX * 0.1;
              }
            });
          } else {
            activeLine.children.forEach((lineItem) => {
              if (lineItem.position.x + gapX * 0.1 >= lineChild.geometry.vertices[1].x) {
                resetPointPosition(lineItem);
              }else{
                lineItem.position.x += gapX * 0.1;
              }
            });
          }
          if (
            lineChild.geometry.vertices[1].y < lineChild.geometry.vertices[0].y
          ) {
            // 如果终点Y坐标小于起点Y坐标
            activeLine.children.forEach((lineItem) => {
              if (lineItem.position.y - gapY * 0.1 <= lineChild.geometry.vertices[1].y) {
                resetPointPosition(lineItem);
              }  else {
                lineItem.position.y -= gapY * 0.1;
              }
            });
          } else {
            activeLine.children.forEach((lineItem) => {
              if (lineItem.position.y + gapY * 0.1 >= lineChild.geometry.vertices[1].y) {
                resetPointPosition(lineItem);
              } else {
                lineItem.position.y += gapY * 0.1;
              }
            });
          }
          requestAnimationFrame(activeLineAnimate);
          that.renderer.render(that.scene, that.camera);
        }
        activeLineAnimate();
        if (that.flowLineIndex < that.linesList.length){
          that.flowLineIndex ++ ;
          that.flowLine();
        }
    },
  },
};
</script>

<style scoped>
.main-page {
  display: flex;
  height: 100%;
}

.main-page .large-screen {
  flex: 1;
  /* height: 100%; */
}
.main-page .operate-column {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding: 10px;
}
</style>