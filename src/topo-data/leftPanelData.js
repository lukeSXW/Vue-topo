// 交换机
import  exchangeMachine from  '../assets/topo/icon_topology_exchange.png'
// 路由器
import  routerMachine from  '../assets/topo/icon_topology_router.png'
// 物理主机
import  reactMachine from  '../assets/topo/icon_topology_virtual_machine.png'
// 虚拟主机
import  virtualMachine from  '../assets/topo/icon_topology_encryption.png'
// 安全设备
import  safeMachine from  '../assets/topo/icon_topology_security_resources.png'
// 三方设备
import  otherMachine from  '../assets/topo/icon_topology_.png'

export const topoList = [
    {
        title:'资产列表',
        id:1,
        rectList:[
            {
                topo_name:'交换机',
                // 文字最大显示多少行
                textMaxLine:1,
                key:1,
                // 节点周围边框颜色
                strokeStyle:'#FFFFFF',
                // 填充色，也就是节点的背景颜色
                // fillStyle:'#000000',
                // 是否禁止缩放
                // hideSizeCP:true,
                is3D:true,
                hideInput:true,
                text:'交换机',
                name: 'rectangle',
                rect: {
                    width: 120,
                    height: 120
                },
                image:exchangeMachine,
                // whiteSpace:'nowrap'
            },
            {
                key:2,
                topo_name:'路由器',
                strokeStyle:'#FFFFFF',
                name: 'rectangle',
                rect: {
                    width: 50,
                    height: 70
                },
                image:routerMachine,
            },
            {
                key:3,
                topo_name:'物理主机',
                strokeStyle:'#FFFFFF',
                name: 'rectangle',
                rect: {
                    width: 50,
                    height: 70
                },
                image:reactMachine,
            },
            {
                key:4,
                topo_name:'虚拟主机',
                strokeStyle:'#FFFFFF',
                name: 'rectangle',
                rect: {
                    width: 50,
                    height: 70
                },
                image:virtualMachine,
            },
            {
                key:5,
                topo_name:'安全设备',
                strokeStyle:'#FFFFFF',
                name: 'rectangle',
                rect: {
                    width: 50,
                    height: 70
                },
                image:safeMachine,
            },
            {
                key:6,
                topo_name:'三方设备',
                strokeStyle:'#FFFFFF',
                name: 'rectangle',
                rect: {
                    width: 50,
                    height: 70
                },
                image:otherMachine,
            },
        ]
    },
    {
        id:2,
        title:'安全设备',
        rectList:[]
    },
    {
        id:3,
        title:'基本元素',
        rectList:[]
    },
];