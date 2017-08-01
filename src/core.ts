window.onload = () => {
  let scene : THREE.Scene;
  let camera : THREE.Camera;
  let renderer : THREE.WebGLRenderer;
  let geometry : THREE.Geometry;
  let material : THREE.Material;
  let mesh : THREE.Mesh;
  let light: THREE.Light;
   
  init();
  animate();
   
  function init() {
   
      scene = new THREE.Scene();
   
      camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
      camera.position.z = 1000;
   
      geometry = new THREE.BoxGeometry( 200, 200, 200 );
      //material = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: false } );
      material = new THREE.MeshPhongMaterial( { color: 0xff0000 } );
   
      mesh = new THREE.Mesh( geometry, material );
      scene.add( mesh );

      light = new THREE.DirectionalLight();
      light.position.x = camera.position.x;
      light.position.y = camera.position.y;
      light.position.z = camera.position.z;
      scene.add(light);
   
      renderer = new THREE.WebGLRenderer();
      renderer.setSize( window.innerWidth, window.innerHeight );
   
      document.body.appendChild( renderer.domElement );
   
  }
   
  function animate() {
   
      requestAnimationFrame( animate );
   
      mesh.rotation.x += 0.01;
      mesh.rotation.y += 0.02;
   
      renderer.render( scene, camera );
   
  }
}
