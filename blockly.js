localStorage.clear();

var blocklyArea = document.getElementById('blocklyArea');
var blocklyDiv = document.getElementById('blocklyDiv');
var workspace = Blockly.inject(blocklyDiv,
    {
        toolbox: document.getElementById('toolbox'),
        horizontalLayout: true,
        toolboxPosition: 'end',
        move: {
            scrollbars: false,
            drag: true,
            wheel: false
        }
    });

//-----------------------------------------------------------------------------------------------------//
//initialize scene, create camera and canvas
var scene;
var objects;
var camera;
var renderer;
var stopRendering;
var cube;
var arrRotate = [];
var arrMove = [];
var arrScale = [];
var controls;
var light;

var requestId;

var volume;
var jumpObject = new Object;
var blokyNaScene = [];


var element = document.getElementById("scene");



function init() {

    renderer = new THREE.WebGLRenderer({ alpha: true, preserveDrawingBuffer: true });
    renderer.setClearColor(0x000000, 0);;
    renderer.setSize(window.innerWidth, window.innerHeight);
    element.appendChild(renderer.domElement);
    // console.log(element);
    element.childNodes[0].style.background = 'transparent'

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 1, 10000);
    controls = new THREE.OrbitControls(camera, renderer.domElement);

    light = new THREE.DirectionalLight(0xffffff, 5);

    // controls = new THREE.OrbitControls( camera, render.domElement );


    camera.position.z = 5;
    //looks in the center of the scene since that where we always sstart when creating a scene
    camera.lookAt(scene.position);

    light.position = camera.position;
    scene.add(light);

    controls.update();

    // document.body.appendChild(renderer.domElement);
    // controls = new THREE.OrbitControls(camera, renderer.domElement);

    window.addEventListener('resize', () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;

        camera.updateProjectionMatrix();
    });

    // always render the scene
    render();
}

init();



// var t = 0;
var clock = new THREE.Clock();
var time = 0;
var radius = 1.5;

function rotate(object, n, vector) {
    time = clock.getElapsedTime();

    // console.log(vector);

    if (!vector) {
        vector = new THREE.Vector3(0, 0, 0);
    }

    if (!n) {
        n = 0;
    }


    // if(object){
    // object.rotation.x += 0.02;
    // object.rotation.y += 0.02;
    // }
    // console.log(n + Math.cos(time + Math.PI) * radius)
    object.rotation.set(
        vector.x + Math.cos(time * Math.PI * 0.5),
        vector.y + Math.cos(time * Math.PI * 0.5),
        vector.z + Math.cos(time * Math.PI * 0.5)
    )
}

function move(object, n, radiusNumber, vector) {

    if (!vector) {
        vector = new THREE.Vector3(0, 0, 0);
    }
    radius = radiusNumber;
    var number = 0
    if (n) {
        number = n;
    }

    time = clock.getElapsedTime() * 0.5 * Math.PI;
    // console.log(object);
    if (object) {
        object.position.set(
            vector.x + Math.cos(number * 0.8 + time + Math.PI * 0.5) * radius,
            vector.y + Math.sin(number * 0.8 + time + Math.PI * 0.5) * radius,
            vector.z + Math.cos(number * 0.8 + time + Math.PI * 0.5) * radius
        )
    }
}

function scale(object, vector) {
    time = clock.getElapsedTime() * 0.5 * Math.PI;

    if (!vector) {
        vector = new THREE.Vector3(1, 1, 1);
    }

    if (object) {
        object.scale.set(
            vector.x + Math.abs(Math.sin(time + Math.PI * 0.5) * radius),
            vector.y + Math.abs(Math.sin(time + Math.PI * 0.5) * radius),
            vector.z + Math.abs(Math.sin(time + Math.PI * 0.5) * radius)
        )
    }
}

var i;

function render() {

    light.position.copy(camera.position);

    var paintOver = true;

    workspace.getAllBlocks().forEach((x) => {
        if (x.type == "paintOver") {
            paintOver = false;
        }
    })

    if (paintOver) {
        renderer.autoClearColor = true;
    }

    if (arrRotate.length > 0) {
        // for (i = 0; i < arrRotate.length; i++) {
        //     objektyNaScene.forEach((x) => {
        //         if (arrRotate[i] == x.name.slice(0, 20)) {
        //             rotate(scene.getObjectByName(x.name), x.name[20])
        //         }
        //     })
        //     // rotate(scene.getObjectByName(arrRotate[i]));
        // }


        // console.log(arrRotate);

        arrRotate.forEach(m => {
            // console.log(m);
            objektyNaScene.forEach((x) => {
                //         if (arrMove[i][0] == x.name.slice(0, 20)) {
                // console.log(m[2]);
                rotate(scene.getObjectByName(m[0]), m[0].slice(20), m[1]);
            })
        })
    }

    if (arrMove.length > 0) {

        arrMove.forEach(m => {
            // console.log(m[0]);
            objektyNaScene.forEach((x) => {
                //         if (arrMove[i][0] == x.name.slice(0, 20)) {
                // console.log(m[2]);
                move(scene.getObjectByName(m[0]), m[0].slice(20), m[1], m[2]);
            })
        })

        // for (i = 0; i < arrMove.length; i++) {
        //     objektyNaScene.forEach((x) => {
        //         if (arrMove[i][0] == x.name.slice(0, 20)) {
        //             // console.log(arrMove[i][2]);
        //             // console.log(x.name.slice(0,20));
        //             // console.log(arrMove[i][1]);
        //             console.log(arrMove);
        //             move(scene.getObjectByName(x.name), x.name.slice(20), arrMove[i][1], arrMove[i][2]);
        //         }
        //     })
        // move(scene.getObjectByName(arrMove[i][0]));
        // move(arrMove[i]);
        // }
    }

    if (arrScale.length > 0) {
        // console.log(arrMove[0])

        arrScale.forEach(m => {
            // console.log(m[0]);
            objektyNaScene.forEach((x) => {
                //         if (arrMove[i][0] == x.name.slice(0, 20)) {
                // console.log(m[2]);
                // move(scene.getObjectByName(m[0]), m[0].slice(20), m[1], m[2]);
                scale(scene.getObjectByName(m[0]), m[2])
            })
        })

        // for (i = 0; i < arrScale.length; i++) {
        //     objektyNaScene.forEach((x) => {
        //         if (arrScale[i] == x.name.slice(0, 20)) {
        //             scale(scene.getObjectByName(x.name))
        //         }
        //     })
        //     // scale(arrScale[i]);
        // }
    }


    // console.log(new THREE.Clock().getElapsedTime());

    controls.update();

    renderer.render(scene, camera);

    requestAnimationFrame(render);

}

//------------------------------------------------------------------------------------------------------------------------------//


var onresize = function (e) {
    // Compute the absolute coordinates and dimensions of blocklyArea.
    var element = blocklyArea;
    var x = 0;
    var y = 0;
    do {
        x += element.offsetLeft;
        y += element.offsetTop;
        element = element.offsetParent;
    } while (element);
    // Position blocklyDiv over blocklyArea.
    blocklyDiv.style.left = x + 'px';
    blocklyDiv.style.top = y + 'px';
    blocklyDiv.style.width = blocklyArea.offsetWidth + 'px';
    blocklyDiv.style.height = blocklyArea.offsetHeight + 'px';
    Blockly.svgResize(workspace);
};
window.addEventListener('resize', onresize, false);
onresize();
Blockly.svgResize(workspace);

var objektyNaScene;

function runCode(event) {

    objektyNaScene = scene.children;


    // console.log(blokyNaScene);

    //pre kazdy objekt pozriet ci existuje block ak nie prec
    //vsetky objekty
    //vsetky bloky

    //vymaz objekty naviac
    // objektyNaScene.every(e => {
    //     // console.log(e.name);
    //     if (!blokyNaScene.includes(e.name)) {
    //         scene.remove(scene.getObjectByName(e.name));
    //     }
    // })


    for (i = 0; i < objektyNaScene.length; i++) {
        // console.log("runcode")
        // console.log(objektyNaScene.length)

        if (!blokyNaScene.includes(objektyNaScene[i].name) && objektyNaScene[i].name.length == 20) {
            // console.log(objektyNaScene[i].name);
            scene.remove(scene.getObjectByName(objektyNaScene[i].name));
        }
    }

    console.log()

    if (workspace.getAllBlocks().length == 0) {
        blokyNaScene = []
    } else {
        for (i = 0; i < workspace.getAllBlocks().length; i++) {
            blokyNaScene[i] = workspace.getAllBlocks()[i].id;
            // console.log(workspace.getAllBlocks())
        }
    }

    if (event) {
        if (event.type == Blockly.Events.BLOCK_DELETE) {

            arr = [];
            arr = event.ids;

            // console.log(event.ids);

            //chybna funkcia
            for (var i = scene.children.length - 1; i >= 0; i--) {

                // for (var y = 0; y < blokyNaScene; y++) {
                //     if (!scene.children[i].includes(blokyNaScene[y])) {
                //         scene.remove(scene.getObjectByName(scene.children[i].name))
                //     }
                // }

                scene.remove(scene.getObjectByName(scene.children[i].name));

                // if (!blokyNaScene.includes(scene.children[i].name)) {
                //     scene.remove(scene.getObjectByName(scene.children[i].name));
                //     console.log("delete")
                // }
            }

            arr.every(e => {
                if (arrRotate.includes(e)) {
                    arrRotate = arrRotate.filter(x => x != e);
                }
                if (arrMove.includes(e)) {
                    arrMove = arrMove.filter(x => x != e);
                }
            })

            // console.log(arr);
            for (i = 0; i < arr.length; i++) {
                // console.log(arr[i]);
                scene.remove(scene.getObjectByName(arr[i]));
            }
            // arr.every(x => {
            //     console.log(x);
            //     scene.remove(scene.getObjectByName(x))
            //     console.log("arr remove")
            // })

        };
    }

    // console.log(blokyNaScene);

    //zastav 2x pustene zvuky
    Object.keys(jumpObject).forEach(key => {
        jumpObject[key].volume(0.5);
        jumpObject[key].rate(1);
        localStorage = 1;
        if (!blokyNaScene.includes(key)) {
            jumpObject[key].pause();
            // delete jumpObject[key];
            console.log(jumpObject);
        }
    });

    if (event) {

        if ((event.type == "move" && event.oldParentId)) {
            // console.log(event.oldParentId);
        } else {
            window.LoopTrap = 1000;
            Blockly.JavaScript.INFINITE_LOOP_TRAP =
                'if (--window.LoopTrap == 0) throw "Infinite loop.";\n';
            arrRotate = [];
            arrMove = [];
            arrScale = [];

            for (i = 0; i < scene.children.length; i++) {
                var obj = scene.getObjectByName(scene.children[i].name);
                obj.position.set(0, 0, 0);
                obj.rotation.set(0, 0, 0);
                obj.scale.set(1, 1, 1);
            }

            var code = Blockly.JavaScript.workspaceToCode(workspace);
            Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
            try {
                // console.log("code: " + code)
                eval(code);
                movecode = '';
            } catch (e) {
                alert(e);
            }
        }
    }


}
workspace.addChangeListener(runCode);





