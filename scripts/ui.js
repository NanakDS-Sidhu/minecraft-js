import {GUI} from "three/examples/jsm/libs/lil-gui.module.min.js";
import { blocks } from "./blocks";
import { resources } from "./blocks";
export function createUI(world,player){
    const gui =new GUI();

    const playerFolder=gui.addFolder('Player');
    playerFolder.add(player,'maxSpeed',1,20).name('MaxSpeed')
    playerFolder.add(player.cameraHelper,'visible').name('Show Camera Helper')

    gui.add(world.size, 'width',8,128,1).name('Width');
    gui.add(world.size, 'height',8,64,1).name('Height');
    
    const terrainFolder = gui.addFolder('Terrain');
    terrainFolder.add(world.params,'seed',1,10000).name('Seed')
    terrainFolder.add(world.params.terrain,'scale',10,100).name('Scale')
    terrainFolder.add(world.params.terrain,'magnitude',0,1).name('Magnitude')
    terrainFolder.add(world.params.terrain,'offset',0,1).name('Offset')

    const resourcesFolder = gui.addFolder('Resources');
    resources.forEach(resource => {
        const resourcesFolder = gui.addFolder(resource.name);
        resourcesFolder.add(resource, 'scarcity',0,1).name("Scarcity");

        const scaleFolder = gui.addFolder("Scale");
        scaleFolder.add(resource.scale, 'x',10,100).name("X Scale")
        scaleFolder.add(resource.scale, 'y',10,100).name("Y Scale")
        scaleFolder.add(resource.scale, 'z',10,100).name("Z Scale")
    })


    gui.onChange(()=>{
        world.generate()
    })
}