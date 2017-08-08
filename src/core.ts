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
  let mouse_pos = {x: 1, y: 1};
   
  init();
  animate();
   
  function init() {
   
      scene = new THREE.Scene();
   
      camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000);
      camera.position.z = 1000;
   
      geometry = new THREE.BoxGeometry( 400, 200, 200 );
      //material = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: false } );
      material = new THREE.MeshPhongMaterial( { color: 0xff0000 } );

      sphere = new THREE.Mesh(new THREE.SphereGeometry(50, 32, 32),
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
        mouse_pos.x = e.clientX;
        mouse_pos.y = e.clientY;
      });

      window.addEventListener("resize", (e) => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize( window.innerWidth, window.innerHeight );
      });
   
  }
   
  function animate() {
   
      requestAnimationFrame( animate );
  
      //mesh.rotation.x += 0.01;
      //mesh.rotation.y += 0.02;
      let start = (new THREE.Vector3(
        (mouse_pos.x / window.innerWidth) * 2 - 1,
        -(mouse_pos.y / window.innerHeight) * 2 + 1,
        0
      )).unproject(camera);

      let end = (new THREE.Vector3(
        (mouse_pos.x / window.innerWidth) * 2 - 1,
        -(mouse_pos.y / window.innerHeight) * 2 + 1,
        1
      )).unproject(camera);

      let line = new THREE.Line3(start, end);
      let intersection = plane.intersectLine(line);
      //console.log(intersection);
      
      //raycaster.setFromCamera(mouse3d, camera);
      //let intersection = raycaster.intersectObject(plane);

      if (intersection) {
        sphere.position.x = intersection.x;
        sphere.position.y = intersection.y;
        sphere.position.z = intersection.z;
      }

      let subs = sphere.position.sub(mesh.position);
      let angle = Math.atan2(subs.y, subs.x);
      mesh.setRotationFromAxisAngle(new THREE.Vector3(0, 0, 1), angle);

      //console.log(mesh.position.angleTo(sphere.position))

      renderer.render( scene, camera );
  }
}
