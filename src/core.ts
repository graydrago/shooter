window.onload = () => {
  let scene : THREE.Scene;
  let camera : THREE.PerspectiveCamera;
  let renderer : THREE.WebGLRenderer;
  let geometry : THREE.Geometry;
  let material : THREE.Material;
  let mesh : THREE.Mesh;
  let sphere: THREE.Mesh;
  let light: THREE.Light;
  let raycaster = new THREE.Raycaster();
  let plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
  let mouse = new THREE.Vector2(1, 1);
  let last_frame_time = null;
  let is_fullscreen_enabled = false;
  let keyboard = {
    left: false,
    right: false,
    up: false,
    down: false
  };
  let KEY_CODES = {
    left: "A".charCodeAt(0),
    right: "D".charCodeAt(0),
    up: "W".charCodeAt(0),
    down: "S".charCodeAt(0),
    fullscreen_request: "F".charCodeAt(0)
  }
   
  init();
  window.requestAnimationFrame(animate);
   
  function init() {
   
      scene = new THREE.Scene();
   
      camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 1, 2000);
      camera.position.z = 1000;
   
      geometry = new THREE.BoxGeometry( 100, 50, 50);
      //material = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: false } );
      material = new THREE.MeshPhongMaterial( { color: 0xff0000 } );

      sphere = new THREE.Mesh(new THREE.SphereGeometry(25, 32, 32),
                              new THREE.MeshPhongMaterial( { color: 0x0000ff } ));
      sphere.position.x = 3;

      mesh = new THREE.Mesh( geometry, material );
      mesh.position.set(0, 0, 0);
      scene.add( mesh );
      scene.add( sphere);

      light = new THREE.DirectionalLight();
      light.position.x = camera.position.x;
      light.position.y = camera.position.y;
      light.position.z = camera.position.z;
      scene.add(light);
   
      renderer = new THREE.WebGLRenderer();
      renderer.setSize( window.innerWidth, window.innerHeight );
   
      document.body.appendChild( renderer.domElement );
      window.addEventListener("mousemove", (e) => {
        mouse.x = ( e.clientX / window.innerWidth ) * 2 - 1;
        mouse.y = -( e.clientY / window.innerHeight ) * 2 + 1;
      });

      window.addEventListener("keydown", (e) => {
        switch (e.keyCode) {
          case KEY_CODES.left: keyboard.left = true; break;
          case KEY_CODES.right: keyboard.right = true; break;
          case KEY_CODES.up: keyboard.up = true; break;
          case KEY_CODES.down: keyboard.down = true; break;
          case KEY_CODES.fullscreen_request:
            let canvas = document.body.querySelector("canvas");
            request_fullscreen(canvas);
            break;
        }
      });

      window.addEventListener("keyup", (e) => {
        switch (e.keyCode) {
          case KEY_CODES.left: keyboard.left = false; break;
          case KEY_CODES.right: keyboard.right = false; break;
          case KEY_CODES.up: keyboard.up = false; break;
          case KEY_CODES.down: keyboard.down = false; break;
        }
      });

      window.addEventListener("resize", (e) => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize( window.innerWidth, window.innerHeight );
      });
  }
   
  function animate(time) {
    if (last_frame_time === null) {
      last_frame_time = time;
      requestAnimationFrame( animate );
      return;
    }

    let start = (new THREE.Vector3(mouse.x, mouse.y, 0)).unproject(camera);
    let end = (new THREE.Vector3(mouse.x, mouse.y, 1)).unproject(camera);
    let line = new THREE.Line3(start, end);
    let intersection = plane.intersectLine(line);
    let elapsed_seconds = (time - last_frame_time) * 0.001;
    last_frame_time = time;

    let speed = 400;
    if (keyboard.left) { mesh.position.x -= speed * elapsed_seconds; }
    if (keyboard.right) { mesh.position.x += speed * elapsed_seconds; }
    if (keyboard.up) { mesh.position.y += speed * elapsed_seconds; }
    if (keyboard.down) { mesh.position.y -= speed * elapsed_seconds; }

    if (intersection) {
      sphere.position.x = intersection.x;
      sphere.position.y = intersection.y;
      sphere.position.z = intersection.z;
    }

    let subs = (new THREE.Vector3()).subVectors(sphere.position, mesh.position);
    let angle = Math.atan2(subs.y, subs.x);
    mesh.setRotationFromAxisAngle(new THREE.Vector3(0, 0, 1), angle);
    renderer.render( scene, camera );

    requestAnimationFrame( animate );
  }

  function request_fullscreen(elem : HTMLElement) {
    let request_fs = elem.requestFullscreen || elem.webkitRequestFullscreen || elem.mozRequestFullScreen || null;
    let exit_fs = document.exitFullscreen || document.webkitExitFullscreen || document.mozCancelFullScreen || null;
    if (is_fullscreen_enabled) {
      if (exit_fs !== null) {
        exit_fs.call(document);
        is_fullscreen_enabled = false;
      }
    } else {
      if (request_fs !== null) {
        request_fs.call(elem);
        is_fullscreen_enabled = true;
      }
    }
  }
}
