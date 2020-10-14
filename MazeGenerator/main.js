import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import MazeGen from './classes/MazeGen';
import { GUI } from 'three/examples/jsm/libs/dat.gui.module.js';

///////////////////////////////////////////////////////////////
//             MAZE
//////////////////////////////////////////////////////////////
class MazeApp{

    constructor( p ){
        this.paramList = p;

        // generate a random maze image dataURI with the maze.draw function
        this.scene = null;
        this.renderer = null;
        this.camera = null;
        this.controls = null;
        this.mazeSphere = null;
        this.heightfieldShape = null;
        this.heightfieldBody = null;
        this.world = null;

        this.loader = new THREE.TextureLoader();
    }

    setupPhysics( data ){
        this.world = new CANNON.World();
        this.world.gravity.set(0,-9.8,0);
            
        // Create the heightfield shape
        this.heightfieldShape = new CANNON.Heightfield(data, {
            elementSize: 1 // Distance between the data points in X and Y directions
        });
        this.heightfieldBody = new CANNON.Body({mass:0});
        this.heightfieldBody.addShape(this.heightfieldShape);
        this.world.addBody(this.heightfieldBody);
    }

    convertURIToImageData(URI) {
        return new Promise(function (resolve, reject) {
            if (URI == null) return reject();
            var canvas = document.createElement('canvas'),
                context = canvas.getContext('2d'),
                image = new Image();
            image.addEventListener('load', function () {
                canvas.width = image.width;
                canvas.height = image.height;
                context.drawImage(image, 0, 0, canvas.width, canvas.height);
                resolve(context.getImageData(0, 0, canvas.width, canvas.height));
            }, false);
            image.src = URI;
        });
    }

    listToMatrix(list, elementsPerSubArray) {
        var matrix = [], i, k;

        for (i = 0, k = -1; i < list.length; i+=4) {
            if (i % elementsPerSubArray === 0) {
                k++;
                matrix[k] = [];
            } 
            matrix[k].push([list[i],list[i+1],list[i+2],list[i+3]]);
            
        }

        return matrix;
    }

    hexToRgb(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    paramHandler() {
        let uri = this.initMaze(this.paramList);
        let h = this.hexToRgb(this.paramList.objColor);
        this.loadHeightMap(uri, (mat) => {
            this.mazeSphere.material = mat;
        });
    }

    initMaze(plist) {
        return new MazeGen(plist).getDataURL();
    }

    loadHeightMap(uri, cb) {
        let self = this;

        this.convertURIToImageData(uri).then(function(data){
            console.log(data);
            console.log(self.listToMatrix(data.data,data.width))
        });
        // use the dataURI to generate the height map
        this.loader.load(uri, function (texture) {
            
            texture.wrapT = texture.wrapS = THREE.RepeatWrapping;
            texture.mapping = THREE.UVMapping;
            texture.repeat.set( 4,4 );
            
            console.log(texture);
            
            let customMaterial = self.createMat({ texture: texture });

            //customMaterial.map = texture;

            if (typeof cb === "function") cb(customMaterial);
        });
    }



    createMat(data) {
        let self = this;
        let texture = data.texture;
        let color = this.hexToRgb(paramList.objColor);
        let zScale = 1;

        // fake a lookup table
        let lut = [];
        for (let n = 0; n < 256; n++) {
            lut.push(new THREE.Vector3(0.5, 0.4, 0.3));
        }

        // use "const" to create global object
        var customUniforms = {
            zTexture: { type: "t", value: texture },
            zScale: { type: "f", value: zScale },
            zLut: { type: "v3v", value: lut }
        };

        var customMaterial = new THREE.ShaderMaterial({
            uniforms: customUniforms,
            vertexShader: `uniform sampler2D   zTexture;
                            uniform float       zScale;
                            uniform vec3        zLut[ 256 ];

                            varying float vAmount;

                            void main() {
                                vec4 heightData = texture2D( zTexture, uv * ${self.paramList.sectors}. );

                                vAmount = heightData.r * 16.; 

                                // move the position along the normal
                                vec3 newPosition = position + normal * zScale * vAmount;

                                gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 0.5 );
                            }`,
            fragmentShader: `uniform vec3 zLut[ 256 ];

                            varying float vAmount;

                            void main() {
                                int index = int(vAmount) * 255;
                                float brightness = 7.;
                                vec3 vColor = vec3(vAmount/brightness, vAmount/brightness, vAmount/brightness);
                                //gl_FragColor = vec4(zLut[32], 1.0);
                                vec3 col2 = vec3 ((${color.r}.0 / 255.0), (${color.g}.0 / 255.0), (${color.b}.0 / 255.0));
                                gl_FragColor = vec4(mix(vColor,col2,0.5), 1.0);
                            }`,
            flatshading: true
        });

        return customMaterial;

    }

    init() {
        let self = this;
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        let width = window.innerWidth;
        let height = window.innerHeight;
        this.renderer.setSize(width, height);
        document.body.appendChild(this.renderer.domElement);

        this.scene = new THREE.Scene();

        //var axesHelper = new THREE.AxesHelper( 500 );
        //scene.add( axesHelper );

        this.camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);
        this.camera.position.y = 25;
        this.camera.position.z = -475;
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.update();

        let ambLight = new THREE.AmbientLight(0x808080);
        this.scene.add(ambLight);

        let dirLight = new THREE.DirectionalLight(0xc0c0c0);
        dirLight.position.set(5, 20, 12);
        this.scene.add(dirLight);

        window.addEventListener('resize', ()=>{this.onWindowResize()}, false);

        this.dataURI = this.initMaze(this.paramList);

        this.gui = new GUI({ width: 650 });
        this.gui.add(this.paramList, 'pathWidth').name('Width of the Maze Path').onChange(()=>{self.paramHandler()});
        this.gui.add(this.paramList, 'wall').name('Width of the Walls between Paths').onChange(()=>{self.paramHandler()});
        this.gui.add(this.paramList, 'sectors').name('Number of times maze is repeated').onChange(()=>{self.paramHandler()});
        this.gui.add(this.paramList, 'outerWall').name('Width of the Outer most wall').onChange(()=>{self.paramHandler()});
        this.gui.add(this.paramList, 'width').name('Number paths fitted horisontally').onChange(()=>{self.paramHandler()});
        this.gui.add(this.paramList, 'height').name('Number paths fitted vertically').onChange(()=>{self.paramHandler()});
        this.gui.addColor(this.paramList, 'wallColor').name('Heightmap Wall Color Differential').onChange(()=>{self.paramHandler()});
        this.gui.addColor(this.paramList, 'pathColor').name('Heightmap Path Color Differential').onChange(()=>{self.paramHandler()});
        this.gui.addColor(this.paramList, 'objColor').name('Sphere Base Color').onChange(()=>{self.paramHandler()});
        this.gui.add(this.paramList, 'seed').name('Seed for the Random Number Generator').onChange(()=>{self.paramHandler()});

        this.loadHeightMap(this.dataURI, (mat) => {
            let sphereGeo = new THREE.SphereGeometry(50, 100, 100);
            this.mazeSphere = new THREE.Mesh(sphereGeo, mat);
        
            this.mazeSphere.rotation.x = -Math.PI / 2;
            this.mazeSphere.position.y = 0;
            console.log(this.mazeSphere)
            this.scene.add(this.mazeSphere);
        });

        this.animate();
    }


    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    animate() {
        requestAnimationFrame(()=>{this.animate()});


        this.renderer.render(this.scene, this.camera);
    }

    heightmapPhysics(heightmap) {
        // Create a matrix of height values
        var matrix = [];
        var sizeX = 15,
            sizeY = 15;
        for (var i = 0; i < sizeX; i++) {
            matrix.push([]);
            for (var j = 0; j < sizeY; j++) {
                //var height = Math.cos(i/sizeX * Math.PI * 2)*Math.cos(j/sizeY * Math.PI * 2) + 2;
                var height = '';//value from heightmap;
                if (i === 0 || i === sizeX - 1 || j === 0 || j === sizeY - 1)
                    height = 3;
                matrix[i].push(height);
            }
        }
    }
}


///////////////////////////////////////////////////////////////
//             
//////////////////////////////////////////////////////////////

var params = function () {
    this.pathWidth = 25;
    this.wall = 25;
    this.sectors = 2;
    this.width = 15;
    this.height = 15;
    this.wallColor = '#ffffff';
    this.pathColor = '#000000';
    this.objColor = '#460a50';
    this.outerWall = 15;
    this.seed = '1';
}

let paramList = new params();

let app = new MazeApp( paramList );

app.init();
