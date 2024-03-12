import * as THREE from '../node_modules/three';
import { OrbitControls } from '../node_modules/three/addons/controls/OrbitControls.js';
import { GLTFLoader } from '../node_modules/three/addons/loaders/GLTFLoader.js';

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

function abs(n){
    return n<0?-1*n:n;
}
const scene = new THREE.Scene(); 
const moveX=80; const moveZ=100;
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}
//camera
const camera = new THREE.PerspectiveCamera(45, sizes.width/sizes.height);
camera.position.z = 30; 
scene.add(camera); 
//renderer
const canvas  = document.querySelector(".webgl");
const renderer = new THREE.WebGLRenderer({ canvas }); 
renderer.setSize(sizes.width,sizes.height); 
renderer.setPixelRatio(window.devicePixelRatio);
renderer.render(scene,camera); 

const interaction = new Interaction(renderer, scene, camera);

//load objects
let models = [];
let modelRotation = [];
let modelSetRotation = [];
let anim = [];
let sceneYLock = [];
let zero = 8;
let curScene = zero; 

function addSprite(ratioWidth,ratioHeight,scaleFactor,id,xOffset,yOffset,zOffset,textureResource){
    const texture = new THREE.TextureLoader().load( textureResource ); 
    texture.colorSpace = THREE.SRGBColorSpace; 
    const material = new THREE.SpriteMaterial( { map:  texture} );
    const sprite = new THREE.Sprite( material );
    sprite.position.set(moveX*(id<=zero?-1*abs(id-zero):abs(id-zero))+xOffset,0+yOffset,moveZ*(id<=zero?abs(id-zero):abs(id-zero))+zOffset);
    sprite.scale.set(ratioWidth*scaleFactor,ratioHeight*scaleFactor,1);
    scene.add( sprite );
}

const GLTFloader = new GLTFLoader();
function addModel(id,xOffset,yOffset,zOffset,scaleFactor,rotationAnim,additionalAnim,additionalFunc,modelResource){
    GLTFloader.load( modelResource, function ( gltf ) {
    gltf.scene.position.x=moveX*(id<=zero?-1*abs(id-zero):abs(id-zero)) + xOffset;
    gltf.scene.position.y=yOffset;
    gltf.scene.position.z=moveZ*(id<=zero?abs(id-zero):abs(id-zero)) + zOffset; 
    gltf.scene.scale.set(scaleFactor,scaleFactor,scaleFactor);
    additionalFunc(gltf);
    models.push(gltf.scene);
    modelRotation.push(rotationAnim);
    modelSetRotation.push(new THREE.Vector3(gltf.scene.rotation.x,gltf.scene.rotation.y,gltf.scene.rotation.z));
    anim.push(additionalAnim);
    scene.add( gltf.scene );
    })
}

//light
const titleBackPLight = new THREE.PointLight(0xffffff,5000);
const titleTopLight = new THREE.PointLight(0xffffff,50000);
titleBackPLight.position.set(0,-2,-4); 
titleTopLight.position.set(0,10,4); 
const hLight = new THREE.HemisphereLight( 0xffffff, 0x080820, 50000);
const amblight = new THREE.AmbientLight(0xffffff,1);
scene.add(titleBackPLight,titleTopLight,amblight); 

const controls = new OrbitControls(camera,canvas);
controls.enableDamping=true;
controls.enablePan = false;
controls.enableZoom = false; 
controls.target.x=0;controls.target.y=0;controls.target.z=29.99;

//skybox
const skyBoxInd = 1; //for randomization later when more skyboxes
scene.background = new THREE.CubeTextureLoader()
.setPath( 'https://roelyoon.github.io/Portfolio/Textures/Skybox/' )
.load( [
            `px${skyBoxInd}.png`, //left
            `nx${skyBoxInd}.png`, //right
            `py${skyBoxInd}.png`, //top
            `ny${skyBoxInd}.png`, //down
            `pz${skyBoxInd}.png`, //center
            `nz${skyBoxInd}.png` //back
        ] );

//sprite 
/*
const RASpriteMaterial = new THREE.SpriteMaterial( { map: new THREE.TextureLoader().load( 'https://roelyoon.github.io/Portfolio/Sprites/rightArrow.png' ) } );
const LASpriteMaterial = new THREE.SpriteMaterial( { map: new THREE.TextureLoader().load( 'https://roelyoon.github.io/Portfolio/Sprites/leftArrow.png' ) } );
const rightArrow = new THREE.Sprite( RASpriteMaterial );
const leftArrow = new THREE.Sprite( LASpriteMaterial );
scene.add( leftArrow );
scene.add( rightArrow );*/

//functions
const targetCameraPos = new THREE.Vector3( 0, 0, 30 );
const targetOrbitPos = new THREE.Vector3( 0, 0, 29.99 );
let lerpFrames = 0;
function leftArrClick(){
    if(curScene!=0){
        curScene--;
        targetCameraPos.x-=moveX; 
        targetCameraPos.y = 0; 
        targetCameraPos.z+=curScene<zero?moveZ:moveZ*-1;
        targetOrbitPos.x-=moveX; 
        targetOrbitPos.y = 0;
        targetOrbitPos.z+=curScene<zero?moveZ:moveZ*-1;
        lerpFrames=60;
    }
}
function rightArrClick(){
    if(curScene!=id){
        curScene++;
        targetCameraPos.x+=moveX;
        targetCameraPos.y = 0; 
        targetCameraPos.z+=curScene<=zero?moveZ*-1:moveZ;
        targetOrbitPos.x+=moveX;
        targetOrbitPos.y = 0;
        targetOrbitPos.z+=curScene<=zero?moveZ*-1:moveZ;
        lerpFrames=60;
    }
}

document.getElementById("leftArrow").onclick = leftArrClick;
document.getElementById("rightArrow").onclick = rightArrClick;

window.addEventListener('resize', ()=>{
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
    camera.aspect = sizes.width/sizes.height;
    camera.updateProjectionMatrix();
    renderer.setSize(sizes.width,sizes.height);
})
  window.addEventListener("wheel", function(e) {
    if(!sceneYLock[curScene]){
        let isTouchPad = e.wheelDeltaY ? e.wheelDeltaY === -3 * e.deltaY : e.deltaMode === 0
        //let dY = isTouchPad?e.deltaY : e.wheelDeltaY * (-1); 
        let d = (Math.abs(e.deltaY)>6 ? (e.deltaY > 0)?6:-6 : e.deltaY)*(isTouchPad?3/4:2); 
        targetCameraPos.y=camera.position.y;
        targetOrbitPos.y=controls.target.y; 
        targetCameraPos.y-=d; 
        targetOrbitPos.y-=d;
        lerpFrames=2;
    }
    // code to increment object.position.z 
  }, true);

const loop = ()=>{
    if(lerpFrames>0){
        camera.position.lerp(targetCameraPos,0.1);
        controls.target.lerp(targetOrbitPos,0.1);
        lerpFrames--;
        if(camera.position==controls.target){
            controls.target.z+=-0.01;
        }
    }
    for(let i = 0; i < models.length; i++){
        models[i].rotation.x+=modelRotation[i].x; 
        models[i].rotation.y+=modelRotation[i].y; 
        models[i].rotation.z+=modelRotation[i].z; 
        anim[i](i);
    }
    controls.update(); 
    renderer.render(scene,camera); 
    window.requestAnimationFrame(loop); 
}

loop();