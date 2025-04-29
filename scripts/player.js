import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/Addons.js';

export class Player {
    maxSpeed=10;
    input= new THREE.Vector3();
    velocity= new THREE.Vector3();
    camera= new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight , 0.1, 200);
    controls =new PointerLockControls(this.camera,document.body);
    cameraHelper= new THREE.CameraHelper(this.camera);
    radius=0.5;
    height=1.75;
    jumpspeed=10
    onGround=false;
    #worldVelocity = new THREE.Vector3();

    constructor(scene){
        this.camera.position.set(32,16,32)
        scene.add(this.camera)
        scene.add(this.cameraHelper)

        document.addEventListener('keydown',this.onkeydown.bind(this))
        document.addEventListener('keyup',this.onkeyup.bind(this))

        this.boundsHelper = new THREE.Mesh(
            new THREE.CylinderGeometry(this.radius,this.radius,this.height,16),
            new THREE.MeshBasicMaterial({wireframe:true})
        );
        scene.add(this.boundsHelper)
    }


    get worldVelocity(){
        this.#worldVelocity.copy(this.velocity)
        this.#worldVelocity.applyEuler(new THREE.Euler(0,this.camera.rotation.y,0))
        return this.#worldVelocity
    }

    applyWorldDeltaVelocity(dv){
        dv.applyEuler(new THREE.Euler(0,-this.camera.rotation.y,0))
        this.velocity.add(dv)
    }
    /**
     * Returns current world pos of player
     * @type {THREE.Vector3}
     */
    get position(){
        return this.camera.position;
     }

    applyInputs(dt){
        if(this.controls.isLocked){
            // console.log(dt)
            this.velocity.x=this.input.x;
            this.velocity.z=this.input.z;
            this.controls.moveRight(this.velocity.x * dt);
            this.controls.moveForward(this.velocity.z * dt)
            this.position.y+=this.velocity.y*dt
            document.getElementById('player-position').innerHTML=this.toString();
        }
    }

    updateBoundsHelper(){
        this.boundsHelper.position.copy(this.position);
        this.boundsHelper.position.y-=this.height/2
    }

    /**
     * 
     * @param {KeyboardEvent} event 
     */
    onkeydown (event){
        if (!this.controls.isLocked){
            this.controls.lock();
        }
        switch(event.code){
            case 'KeyW':
                this.input.z=this.maxSpeed;
                break;
            case 'KeyA':
                this.input.x=-this.maxSpeed;
                break;
            case 'KeyS':
                this.input.z=-this.maxSpeed;
                break;
            case 'KeyD':
                this.input.x=this.maxSpeed;
                break;
            case 'KeyR':
                this.camera.position.set(32,16,32);
                this.velocity.set(0,0,0)
                break;
            case "Space":
                if (this.onGround){
                    this.velocity.y+=this.jumpspeed;
                }
                break; 
        }
    }

    /**
     * 
     * @param {KeyboardEvent} event 
     */
    onkeyup(event){
        switch(event.code){
            case 'KeyW':
                this.input.z=0;
                break;
            case 'KeyA':
                this.input.x=0;
                break;
            case 'KeyS':
                this.input.z=0;
                break;
            case 'KeyD':
                this.input.x=0;
                break;
        }
    }

    toString(){
        let str='';
        str+=`x : ${this.camera.position.x.toFixed(3)}`;
        str+=`Y : ${this.camera.position.y.toFixed(3)}`;
        str+=`Z : ${this.camera.position.z.toFixed(3)}`;
        return str
    }
}