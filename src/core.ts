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
  let last_frame_time = null;
  let is_fullscreen_enabled = false;
  let bullets = {
    collection: [],
    directions: [],
    timers: [],
    speed: 15,
    live_time: 2.0,
    expected_time: 0.05,
    elapsed_time: 0
  };
  let control = {
    left: false,
    right: false,
    up: false,
    down: false,
    fire: false,
    mouse: new THREE.Vector2(1, 1)
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
      scene.background = new THREE.Color(0xffffff);
   
      camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
      camera.position.z = 1000;
   
      geometry = new THREE.BoxGeometry( 100, 50, 20);
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
        control.mouse.x = ( e.clientX / window.innerWidth ) * 2 - 1;
        control.mouse.y = -( e.clientY / window.innerHeight ) * 2 + 1;
      });

      window.addEventListener("keydown", (e) => {
        switch (e.keyCode) {
          case KEY_CODES.left: control.left = true; break;
          case KEY_CODES.right: control.right = true; break;
          case KEY_CODES.up: control.up = true; break;
          case KEY_CODES.down: control.down = true; break;
          case KEY_CODES.fullscreen_request:
            let canvas = document.body.querySelector("canvas");
            request_fullscreen(canvas);
            break;
        }
      });

      window.addEventListener("keyup", (e) => {
        switch (e.keyCode) {
          case KEY_CODES.left: control.left = false; break;
          case KEY_CODES.right: control.right = false; break;
          case KEY_CODES.up: control.up = false; break;
          case KEY_CODES.down: control.down = false; break;
        }
      });

      window.addEventListener("mousedown", (e) => {
        control.fire = true;
      });

      window.addEventListener("mouseup", (e) => {
        control.fire = false;
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

    let start = (new THREE.Vector3(control.mouse.x, control.mouse.y, 0)).unproject(camera);
    let end = (new THREE.Vector3(control.mouse.x, control.mouse.y, 1)).unproject(camera);
    let line = new THREE.Line3(start, end);
    let intersection = plane.intersectLine(line);
    let elapsed_seconds = (time - last_frame_time) * 0.001;
    last_frame_time = time;

    let speed = 400;
    if (control.left) { mesh.position.x -= speed * elapsed_seconds; }
    if (control.right) { mesh.position.x += speed * elapsed_seconds; }
    if (control.up) { mesh.position.y += speed * elapsed_seconds; }
    if (control.down) { mesh.position.y -= speed * elapsed_seconds; }


    if (intersection) {
      sphere.position.x = intersection.x;
      sphere.position.y = intersection.y;
      sphere.position.z = intersection.z;
    }

    let subs = (new THREE.Vector3()).subVectors(sphere.position, mesh.position);
    let angle = Math.atan2(subs.y, subs.x);
    mesh.setRotationFromAxisAngle(new THREE.Vector3(0, 0, 1), angle);
    renderer.render( scene, camera );

    bullets.elapsed_time += elapsed_seconds;
    if (control.fire && bullets.elapsed_time > bullets.expected_time) {
      let l = bullets.collection.length;
      let bullet_mesh = null;
      let found_bullet_id = -1;
      for (let i = 0; i < l; ++i) {
        if (bullets.timers[i] < 0) {
          found_bullet_id = i;
          break;
        }
      }

      let bullet_angle = angle + (Math.random() * 2 - 1) * 0.05;
      let direction_vector = (new THREE.Vector3(Math.cos(bullet_angle), Math.sin(bullet_angle), 0)).multiplyScalar(bullets.speed)
      if (found_bullet_id > -1) {
        bullet_mesh = bullets.collection[found_bullet_id];
        bullets.timers[found_bullet_id] = bullets.live_time;
        bullets.directions[found_bullet_id] = direction_vector;
      } else {
        bullet_mesh = new THREE.Mesh(
          //new THREE.CubeGeometry(40, 10, 10),
          new THREE.SphereGeometry(10, 10, 10),
          new THREE.MeshBasicMaterial({color: 0xcccccc})
        );
        bullets.directions.push(direction_vector);
        bullets.collection.push(bullet_mesh);
        bullets.timers.push(bullets.live_time);
      }

      bullet_mesh.setRotationFromAxisAngle(new THREE.Vector3(0, 0, 1), bullet_angle);
      bullet_mesh.position.copy(mesh.position);
      scene.add(bullet_mesh);
      bullets.elapsed_time = 0;
    }

    let l = bullets.collection.length;
    for (let i = 0; i < l; ++i) {
      if (bullets.timers[i] >= 0) {
        bullets.collection[i].position.add(bullets.directions[i]);
        bullets.timers[i] -= elapsed_seconds;
      }
    }

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
