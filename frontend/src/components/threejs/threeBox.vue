<template>
    <div>
      <div id="container"></div>
    </div>
  </template>
  
  <script>
    import * as THREE from "three";
    import {
      GLTFLoader
    } from 'three/examples/jsm/loaders/GLTFLoader.js'
    import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
    import {
      OrbitControls
    } from 'three/examples/jsm/controls/OrbitControls'
    import GUI from 'lil-gui';
  
    export default {
      data() {
        return {
          camera: null,
          scene: null,
          renderer: null,
          mesh: null,
          model: null,
          controls: null,
          bodyMatetial: null,
          lightlMatetial: null,
        };
      },
      mounted() {
        setTimeout(()=>{
            this.init();
            this.initFloor()
            this.initLight()
            this.animate()
            this.initGui()
        },1000)
      },
      methods: {
        //初始化
        init() {
          this.scene = new THREE.Scene();
          this.scene.background = new THREE.Color('rgba(0,0,0,0)')

          /**
           * 相机设置
           */
          let container = document.getElementById("container");
          //创建一个摄像机对象（摄像机决定了能够在场景里看到什么）
          this.camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 100 );
          this.camera.position.set( 1.5, 4, 9 );
  
        //   设置摄像机的位置，并让其指向场景的中心（0,0,0）
        //   左右为X轴，右为正；前后为Y轴，前为正；上下为Z轴，上为正。
        //   this.camera.position.x = 5;
        //   this.camera.position.y = 3;
        //   this.camera.position.z = 1;
          this.camera.up.x = 0; //相机默认y轴为上方
          this.camera.up.y = 1;
          this.camera.up.z = 0;
          this.camera.lookAt(this.scene.position); //相机看向哪个坐标
          // 视距 越小模型越远
        //   this.camera.position.z = -7;
          // 加载模型 模型必须整包放在public目录
          const gltfLoader = new GLTFLoader()
          const dracoLoader = new DRACOLoader()
          dracoLoader.setDecoderPath('/jsm/libs/draco/gltf/')
          gltfLoader.setDRACOLoader(dracoLoader)
          gltfLoader.load('/models/AVIFTest/forest_house.glb', (gltf) => {
            this.model = gltf.scene
            // 计算模型的包围盒 为了是模型水平居中
            var box = new THREE.Box3().setFromObject(this.model);
            var size = new THREE.Vector3();
            var center = new THREE.Vector3();
            box.getCenter(center);
            box.getSize(size);
            // 调整模型上下距离
            this.model.position.x = 0;
            this.model.position.y = -2;
            this.model.position.z = 0;
            // 缩放模型使其适应屏幕大小 除的数字越大 模型越大
            var scaleFactor = 8 / size.length();
            this.model.scale.set(scaleFactor, scaleFactor, scaleFactor);
            //遍历模型每部分
            this.bodyMatetial = new THREE.MeshPhongMaterial({
              color: '#ff5655',
              metalness: 1,
              roughness: 0.5,
              clearcoat: 1.0,
              clearcoatRoughness: 0.4
            })
            this.lightlMatetial = new THREE.MeshPhongMaterial({
              color: '#ffff00',
              metalness: 1,
              roughness: 0.5,
              transmission: 0.2, // 透光性
            })
            this.scene.add(this.model)
          })
  
          // 默认模型是黑色的 设置环境光才能正常
          this.scene.add(new THREE.AmbientLight(0x666666));
  
          /**
           * 创建渲染器对象
           */
          this.renderer = new THREE.WebGLRenderer({
            antialias: true
          });
          this.renderer.setSize(container.clientWidth, container.clientHeight);
          container.appendChild(this.renderer.domElement);

          this.controls = new OrbitControls(this.camera, this.renderer.domElement);
          this.controls.mouseButtons = {
            LEFT: THREE.MOUSE.ROTATE,
            MIDDLE: THREE.MOUSE.DOLLY,
            RIGHT: THREE.MOUSE.PAN
          }
          //最大仰视角和俯视角
          this.controls.minPolarAngle = 1; // radians
          this.controls.maxPolarAngle = Math.PI; // radians
          this.controls.minAzimuthAngle = -Infinity; // radians
          this.controls.maxAzimuthAngle = Infinity; // radians
          this.controls.enableDamping = true;
          this.controls.dampingFactor = 0.25;
          this.controls.enableZoom = true;
          this.controls.zoomSpeed = 1.1;
          this.renderer.shadowMap.enabled = true
        },
        // 动画 旋转
        animate() {
          requestAnimationFrame(this.animate);
          this.renderer.render(this.scene, this.camera);
        },
  
        // 添加地面
        initFloor() {
        //   const floorGeometry = new THREE.PlaneGeometry(20, 20)
        //   const material = new THREE.MeshPhysicalMaterial({
        //     color: '#818181',
        //     side: THREE.DoubleSide,
        //     metalness: 0,
        //     roughness: 0.1
        //   })
        //   const floorMesh = new THREE.Mesh(floorGeometry, material)
        //   // 默认垂直的 旋转以下变成水平的
        //   floorMesh.rotation.x = Math.PI / 2
        //   floorMesh.receiveShadow = true
        //   this.scene.add(floorMesh)
        },
  
        // 添加聚光灯和阴影
        initLight() {
        //   const hesLight = new THREE.HemisphereLight(0xffffff, 0x444444)
        //   hesLight.intensity = 0.6
        //   this.scene.add(hesLight)
        //   const dirLight = new THREE.DirectionalLight()
        //   dirLight.position.set(5, 5, 5)
        //   this.scene.add(dirLight)
        //   //聚光灯
        //   const sportLight = new THREE.SpotLight(0xffffff, 0.8)
        //   sportLight.angle = Math.PI / 8; //散射角度，跟水平线的夹角
        //   sportLight.penumbra = 0.1; // 聚光锥的半影衰减百分比
        //   sportLight.decay = 2; // 纵向：沿着光照距离的衰减量。
        //   sportLight.distance = 50;
        //   sportLight.shadow.radius = 10;
        //   // 阴影映射宽度，阴影映射高度
        //   sportLight.shadow.mapSize.set(4096, 4096);
        //   // 位置
        //   sportLight.position.set(5, 5, 1);
        //   // 光照射的方向
        //   sportLight.target.position.set(0, 0, 0);
        //   sportLight.castShadow = true; //开启阴影
        //   this.scene.add(sportLight);
        },
  
        // 添加改变颜色的面板 这里用到包 lil-gui 需要安装引入
        // 网址 https://lil-gui.georgealways.com/
        initGui() {
  
        //   let obj = {
        //     bodyColor: '#ff5655',
        //   }
        //   // 初始化
        //   const gui = new GUI();
        //   // gui.addColor就可以出现颜色选择器
        //   // 可视化面板修改车身颜色
        //   gui.addColor(obj, 'bodyColor').name('车身颜色').onChange(value => {
        //     this.bodyMatetial.color.set(value)
        //   }) // Checkbox
        },
      }
    };
  </script>
  
  <style>
    #container {
      position: absolute;
      width:100%;
      height:100%;
      top:0;
      left:0;
    }
  </style>