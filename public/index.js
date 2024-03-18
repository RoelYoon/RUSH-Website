import * as THREE from 'three';
import { OrbitControls } from '/threeAddons/controls/OrbitControls.js';
import { GLTFLoader } from '/threeAddons/loaders/GLTFLoader.js';
import {Interaction} from './interaction.js';

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

function onPointerMove(event) {
	// calculate pointer position in normalized device coordinates
	// (-1 to +1) for both components
	pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

}

function getRandomInt(max) {
    return Math.floor(Math.random() * max)+1;
}

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
let zero = 0;
let curScene = zero; 
let id = 0;

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

//scene 1
sceneYLock.push(false);

addSprite(200,200,1/30,id,0,-8,0,'https://static.thenounproject.com/png/1342601-200.png');

//960 x 720
addSprite(960,720,1/30,id,0,0,0,'https://roelyoon.github.io/Portfolio/RUSH/Text/Scene 1/title.png');

//scene 2
sceneYLock.push(false);
id++;

//title
addSprite(960,720,1/30,id,0,0,0,'https://roelyoon.github.io/Portfolio/RUSH/Text/Scene 2/title.png');

//thesis
addSprite(960,720,1/25,id,0,-5,0,'https://roelyoon.github.io/Portfolio/RUSH/Text/Scene 2/s1.png');

//apollo
//addSprite(564,732,1/31,id,0,-23,0,'https://upload.wikimedia.org/wikipedia/commons/1/13/Apollo_4_Launch_-_GPN-2000-000044.jpg');
//arms race
addSprite(551,362,1/22,id,0,-19,0,'https://glikennedy.weebly.com/uploads/1/3/2/0/13201112/6090721.jpg');


//scene 3
sceneYLock.push(false);
id++;

let y = 0;

//supporting q 1
addSprite(960,720,1/30,id,0,y,0,'https://roelyoon.github.io/Portfolio/RUSH/Text/Scene 3/title.png');

//s1
y-=10;
addSprite(960,720,1/30,id,0,y,0,'https://roelyoon.github.io/Portfolio/RUSH/Text/Scene 3/s1.png');

//comp
y-=15
addSprite(500,400,1/20,id,0,y,0,'https://ids.si.edu/ids/deliveryService?id=NASM-A19890006000_PS01&max_w=500');
//https://d7fcfvvxwoz9e.cloudfront.net/dom43635/wp-content/uploads/2023/08/Explorer_6_paddles_up.jpg

//s2
y-=15
addSprite(960,720,1/30,id,0,y,0,'https://roelyoon.github.io/Portfolio/RUSH/Text/Scene 3/s2.png');

//icbm
y-=20
addSprite(582,722,1/30,id,0,y,0,'https://media.defense.gov/2012/Mar/05/2000172956/2000/2000/0/120305-F-AR054-001.JPG');

//s3
y-=20
addSprite(960,720,1/30,id,0,y,0,'https://roelyoon.github.io/Portfolio/RUSH/Text/Scene 3/s3.png');

//solar panel
y-=20
addSprite(582,396,1/30,id,0,y,0,'https://media.wired.com/photos/59334c7958b0d64bb35d4d8e/master/w_1600%2Cc_limit/explorer6.gif');

//s4
y-=20
addSprite(960,720,1/30,id,0,y,0,'https://roelyoon.github.io/Portfolio/RUSH/Text/Scene 3/s4.png');

//digital camera
y-=20
addSprite(582,436,1/30,id,0,y,0,'https://images.squarespace-cdn.com/content/5104bf8be4b0869f6414bed2/1439954219280-SQTIPJGYGNTWAI2KVKRL/?content-type=image%2Fpng');

//s5
y-=20
addSprite(960,720,1/30,id,0,y,0,'https://roelyoon.github.io/Portfolio/RUSH/Text/Scene 3/s5.png');

//water and air purifiers
y-=20
addSprite(478,385,1/30,id,0,y,0,'https://spinoff.nasa.gov/sites/default/files/styles/nasa_image_default_thumbnail/public/2021-08/Air_Purifiers_1_web_0.png');

//s6
y-=20
addSprite(960,720,1/30,id,0,y,0,'https://roelyoon.github.io/Portfolio/RUSH/Text/Scene 3/s6.png');

//Satellites and GPS
y-=20
addSprite(478,383,1/30,id,0,y,0,'https://www.wired.com/images_blogs/thisdayintech/2011/02/gps.jpg');

//scene 4
sceneYLock.push(false);
id++;

//scene 5
sceneYLock.push(false);
id++;

//citationss
addModel(id,0,-5,0,3,new THREE.Vector3(0,0.03,0),function(){},function(gltf){gltf.scene.on('click',function(ev){window.open("https://docs.google.com/document/d/1Nw6Z7hcxL_mAxQt1ILiBvgmIji-FTv7d42JROLe_MWE/edit?usp=sharing");});},'https://roelyoon.github.io/Portfolio/3DModels/drive.glb');


//light
/*
const titleBackPLight = new THREE.PointLight(0xffffff,5000);
const titleTopLight = new THREE.PointLight(0xffffff,50000);
titleBackPLight.position.set(0,-2,-4); 
titleTopLight.position.set(0,10,4); 
const hLight = new THREE.HemisphereLight( 0xffffff, 0x080820, 50000);*/
const amblight = new THREE.AmbientLight(0xffffff,1);
scene.add(amblight); 


const controls = new OrbitControls(camera,canvas);
controls.enableDamping=true;
controls.enablePan = false;
controls.enableZoom = false; 
controls.target.x=0;controls.target.y=0;controls.target.z=29.99;

//skybox
const skyBoxInd = getRandomInt(2); //for randomization later when more skyboxes
scene.background = new THREE.CubeTextureLoader()
.setPath( `https://roelyoon.github.io/Portfolio/RUSH/Skybox/Set${skyBoxInd}/` )
.load( [
            `px.png`, //left
            `nx.png`, //right
            `py.png`, //top
            `ny.png`, //down
            `pz.png`, //center
            `nz.png` //back
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
let leftArrow = document.getElementById("leftArrow");
let rightArrow = document.getElementById("rightArrow");
let lerpFrames = 0;
function moveLeft(){
    if(curScene!=0){
        curScene--;
        targetCameraPos.x-=moveX; 
        targetCameraPos.y = 0; 
        targetCameraPos.z+=curScene<zero?moveZ:moveZ*-1;
        targetOrbitPos.x-=moveX; 
        targetOrbitPos.y = 0;
        targetOrbitPos.z+=curScene<zero?moveZ:moveZ*-1;
        rightArrow.hidden=false;
        lerpFrames=60;
        if(curScene==0){
            leftArrow.hidden=true;
        }
    }
}
function moveRight(){
    if(curScene!=id){
        curScene++;
        targetCameraPos.x+=moveX;
        targetCameraPos.y = 0; 
        targetCameraPos.z+=curScene<=zero?moveZ*-1:moveZ;
        targetOrbitPos.x+=moveX;
        targetOrbitPos.y = 0;
        targetOrbitPos.z+=curScene<=zero?moveZ*-1:moveZ;
        leftArrow.hidden=false;
        lerpFrames=60;
        if(curScene==id){
            rightArrow.hidden=true;
        }
    }
}
function leftArrClick(){
    moveLeft();
}
function rightArrClick(){
    moveRight();
}

leftArrow.onclick = leftArrClick;
rightArrow.onclick = rightArrClick;
leftArrow.hidden = true;

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

window.addEventListener( 'pointermove', onPointerMove );

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