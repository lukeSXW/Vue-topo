<template>
  <div class="main">
    <div class="left-area">
      <a-collapse>
        <a-collapse-panel v-for="item in leftTopoPanels" :key='item.id' :header="item.title">
          <ul class="ul-style">
            <li v-for="topoItem in item.rectList" :key="topoItem.key" @dragstart="dragStart($event,topoItem)">
              <img :src="topoItem.image" style="height:42px;width:42px" alt="">
              <span>{{topoItem.topo_name}}</span>
            </li>
          </ul>
        </a-collapse-panel>
      </a-collapse>
    </div>
    <div class="main-area" id="topo-convas" @drop="dragDrop($event)"></div>
    <div class="right-area">
      <a-button @click="saveData">保存</a-button>
      <a-button @click='lockTopo'>锁定画布</a-button>
      <a-button @click="reviewData">还原数据</a-button>
      <a-button @click="combine">组合节点</a-button>
      <a-button @click="to3dpage">3D页面</a-button>
    </div>
    <a-drawer
      title="Basic Drawer"
      placement="right"
      :closable="false"
      :visible="visible"
      @close="onClose"
      width = "30%"
    >
      <div class="node-data" v-for="(value,key,index) in currentOperateNode" :key="index">
        <span style="margin-right:5px;width:6em;flex:none">{{key}}</span>
        <span style="white-space:pre" v-if="key!=='text'">{{value}}</span>
        <input type="text" v-if="key==='text'" v-model="currentOperateNode.text">
      </div>
    </a-drawer>
  </div>
</template>

<script>
// @ is an alias to /src
// 1. 导入绘画引擎
import { topoList } from "../topo-data/leftPanelData";
export default {
  name: "Home",
  data() {
    return {
      topoObject: null,
      leftTopoPanels: topoList,
      // 抽屉是否可见
      visible:false,
      // 当前操作的节点数据
      currentOperateNode:null,
    };
  },
  mounted() {
    // 初始化画布函数    
    this.initToPoConvas();
  },
  methods: {
    initToPoConvas() {
      // 将中间栏渲染成画布
      this.topoObject = new Le5leTopology.Topology("topo-convas", {
        // 禁止连线终点为空
        disableEmptyLine:true,
        on: (event, data) => {
          console.log(event,data);
          switch (event){
            case 'dblclick':
              this.currentOperateNode = data;
              this.visible = true;
              break;
            case 'resizePens':
              if(data[0].rect.width < 100 || data[0].rect.height < 100){
                data[0].onlySizeX = true;
                data[0].onlySizeY = true;
              }
          }
        },
        ondrop(event) {
          console.log(event);
        },
      });
      // 设置连线类型
      this.topoObject.data.lineName = 'line';
      // 是否显示背景网格
      // this.topoObject.data.grid = true;
    },

    // 还原数据
    reviewData(){
      const reviewJsonData = JSON.parse(localStorage.getItem('topoData'))
      // 先清空画布
      // this.topoObject.delete(this.topoObject.data.pens);
      this.topoObject.open(reviewJsonData);
    },

    to3dpage(){
      this.$router.push({ path:'3dview' });
    },

    // 保存数据
    saveData(){
      localStorage.setItem('topoData',JSON.stringify(this.topoObject.data))
    },
    // 关闭抽屉
    onClose(){
      this.visible = false
    },

    // 锁定画布
    lockTopo(){
      console.log(this.topoObject);
      this.topoObject.lock(1);
    },

    // 组合节点
    combine(){
      this.topoObject.toComponent();
    },

    // 拖拽结束
    dragDrop(event) {
      const node = JSON.parse(event.dataTransfer.getData("topo-item"));
      node.rect.x = event.offsetX;
      node.rect.y = event.offsetY;
      this.topoObject.addNode(new Le5leTopology.Node(node), true);
    },
    // 单击节点
    nodeClick(event){
      console.log(event);
    },

    // 拖拽开始
    dragStart(event,dragTarget) {
      event.dataTransfer.setData("topo-item", JSON.stringify(dragTarget));
    },
  },
  components: {},
};
</script>

<style scoped>
.main {
  display: flex;
  height: 100%;
}
.main .left-area {
  width: 300px;
  height: 100%;
}
.main .main-area {
  flex: 5;
  height: 100%;
}
.ul-style{
  list-style-type: none;
  display: flex;  
  flex-wrap: wrap;
  margin: 0;
  padding: 0;
}
.ul-style li{
  width: 33%;
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 1px solid transparent;
}

.ul-style li:hover{
  border: 1px dashed skyblue;
}

.node-data{
  display: flex;
  flex-direction: row;
  padding-right: 30px;
}

.right-area{
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding: 10px;
}
.right-area button{
  margin : 10px 0;
}

</style>
