// Panel component for flat or curved panels
AFRAME.registerComponent('panel', {
  schema: {
    curve: {type: 'number', default: 0}, // 0 for flat, fraction of 180deg for curved
    radius: {type: 'number', default: 1},
    width: {type: 'number', default: 1.5},
    height: {type: 'number', default: 1}
  },
  update: function () {
    if (this.data.curve > 0) {
      this.el.setAttribute('geometry', {
        primitive: 'cylinder',
        radius: this.data.radius,
        height: this.data.height,
        openEnded: true,
        thetaLength: this.data.curve * 180,
        thetaStart: -this.data.curve * 90
      });
    } else {
      this.el.setAttribute('geometry', {
        primitive: 'plane',
        width: this.data.width,
        height: this.data.height
      });
    }
  }
});

// Orbiter component for rotating elements
AFRAME.registerComponent('orbiter', {
  schema: { radius: {default: 0.3}, speed: {default: 45} }, // speed in deg/s
  tick: function (time) {
    var angle = THREE.Math.degToRad((time / 1000) * this.data.speed);
    var x = Math.cos(angle) * this.data.radius;
    var z = Math.sin(angle) * this.data.radius - 2; // orbit around panel at z=-2
    this.el.object3D.position.set(x, 0.2, z);
  }
});

// Elevation animation for dialogs/popups
AFRAME.registerComponent('elevate-on-enter', {
  schema: { from: {default: -0.1}, to: {default: 0.3}, dur: {default: 300} },
  init: function () {
    var pos = this.el.object3D.position;
    this.startZ = pos.z + this.data.from;
    pos.z = this.startZ;
    this.el.setAttribute('visible', false);
    this.el.addEventListener('show', () => {
      this.el.setAttribute('visible', true);
      this.el.setAttribute('animation__elevate', {
        property: 'position',
        to: `${pos.x} ${pos.y} ${this.data.to}`,
        dur: this.data.dur,
        easing: 'easeOutQuad'
      });
    });
    this.el.addEventListener('hide', () => {
      this.el.setAttribute('animation__elevate', {
        property: 'position',
        to: `${pos.x} ${pos.y} ${this.startZ}`,
        dur: this.data.dur,
        easing: 'easeInQuad'
      });
      setTimeout(() => this.el.setAttribute('visible', false), this.data.dur);
    });
  }
});

// Interactive button states
AFRAME.registerComponent('button-actions', {
  init: function () {
    this.el.addEventListener('raycaster-intersected', () => this.el.addState('hovered'));
    this.el.addEventListener('raycaster-intersected-cleared', () => {
      this.el.removeState('hovered');
      this.el.removeState('pressed');
    });
    this.el.addEventListener('mousedown', () => this.el.addState('pressed'));
    this.el.addEventListener('mouseup', () => this.el.removeState('pressed'));
  },
  tick: function () {
    var scale = this.el.is('pressed') ? 0.95 : this.el.is('hovered') ? 1.1 : 1;
    this.el.object3D.scale.set(scale, scale, scale);
  }
});

// Auto-scale text based on camera distance
AFRAME.registerComponent('auto-scale-text', {
  schema: { factor: {default: 0.5} },
  tick: function () {
    var cam = this.el.sceneEl.camera;
    if (!cam) return;
    var pos = new THREE.Vector3();
    var camPos = new THREE.Vector3();
    this.el.object3D.getWorldPosition(pos);
    cam.getWorldPosition(camPos);
    var dist = pos.distanceTo(camPos);
    var s = dist * this.data.factor;
    this.el.object3D.scale.set(s, s, s);
  }
});

// Gesture handler for models
AFRAME.registerComponent('gesture-handler', {
  schema: { min: {default: 0.5}, max: {default: 3} },
  init: function () {
    this.initialScale = this.el.object3D.scale.clone();
    this.el.sceneEl.addEventListener('onefingermove', e => {
      this.el.object3D.position.add(e.detail.positionChange);
    });
    this.el.sceneEl.addEventListener('twofingermove', e => {
      var current = this.el.object3D.scale.x;
      var newScale = THREE.Math.clamp(current + e.detail.spreadChange / 400, this.data.min, this.data.max);
      this.el.object3D.scale.set(newScale, newScale, newScale);
    });
  }
});

// Annotation component
AFRAME.registerComponent('annotation', {
  schema: { text: {type: 'string'} },
  init: function () {
    var ann = document.createElement('a-entity');
    ann.setAttribute('position', '0 0.5 0');
    ann.setAttribute('htmlembed', 'ppu:256');
    ann.innerHTML = `<div class="embed annotation">${this.data.text}</div>`;
    this.el.appendChild(ann);
  }
});

// Pointer feedback on hands/controllers
AFRAME.registerComponent('pointer-feedback', {
  init: function () {
    var ring = document.createElement('a-ring');
    ring.setAttribute('radius-inner', '0.0075');
    ring.setAttribute('radius-outer', '0.01');
    ring.setAttribute('color', '#00A8E8');
    ring.setAttribute('material', 'shader:flat; opacity:0.8');
    ring.setAttribute('position', '0 0 -0.05');
    this.el.appendChild(ring);
    this.ring = ring;
    this.el.addEventListener('triggerdown', () => ring.setAttribute('color', '#fff'));
    this.el.addEventListener('triggerup', () => ring.setAttribute('color', '#00A8E8'));
  }
});

// Safe zone visual
AFRAME.registerComponent('safe-zone', {
  schema: { radius: {default: 1.5} },
  init: function () {
    var r = this.data.radius;
    var ring = document.createElement('a-ring');
    ring.setAttribute('radius-inner', r - 0.005);
    ring.setAttribute('radius-outer', r + 0.005);
    ring.setAttribute('rotation', '-90 0 0');
    ring.setAttribute('material', 'color:#00A8E8; opacity:0.25; side:double; wireframe:true');
    this.el.appendChild(ring);
  }
});

// Voice command helper
AFRAME.registerComponent('voice-command', {
  init: function () {
    var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    var rec = new SpeechRecognition();
    rec.continuous = true;
    rec.lang = 'en-US';
    rec.onresult = e => {
      var last = e.results[e.results.length - 1][0].transcript.trim().toLowerCase();
      this.el.emit('voice', {text: last});
    };
    rec.start();
  }
});

// Start local camera stream for video panel
async function startStream() {
  var video = document.getElementById('stream');
  if (!navigator.mediaDevices) return;
  try {
    var media = await navigator.mediaDevices.getUserMedia({video: true, audio: false});
    video.srcObject = media;
  } catch (e) {
    console.warn('Stream failed', e);
  }
}

// Initialize interactions after DOM is ready
document.addEventListener('DOMContentLoaded', function () {
  startStream();
  var scene = document.querySelector('a-scene');
  scene.setAttribute('voice-command', '');
  var dialog = document.getElementById('dialog');
  var openBtn = document.getElementById('dialogBtn');
  var closeBtn = document.getElementById('closeDialog');
  openBtn.addEventListener('click', function () {
    dialog.classList.remove('hidden');
    dialog.emit('show');
  });
  closeBtn.addEventListener('click', function () {
    dialog.emit('hide');
    dialog.classList.add('hidden');
  });
  scene.addEventListener('voice', function (e) {
    if (e.detail.text.includes('open dialog')) openBtn.click();
    if (e.detail.text.includes('close dialog')) closeBtn.click();
  });
});
