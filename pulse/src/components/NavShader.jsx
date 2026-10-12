import React, { useEffect, useRef } from 'react';
import Box from '@mui/material/Box';

const vertexSource = `
  attribute vec2 position;
  void main() { gl_Position = vec4(position, 0.0, 1.0); }
`;
const fragmentSource = `
  precision mediump float;
  uniform vec2 resolution;
  uniform float time;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }
  float noise(vec2 p) {
    vec2 cell = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(cell), hash(cell + vec2(1.0, 0.0)), u.x),
               mix(hash(cell + vec2(0.0, 1.0)), hash(cell + vec2(1.0)), u.x), u.y);
  }
  float field(vec2 p) {
    float n = 0.0, amplitude = 0.5;
    for (int i = 0; i < 4; i++) {
      n += amplitude * noise(p);
      p = mat2(1.6, -1.2, 1.2, 1.6) * p + 2.1;
      amplitude *= 0.5;
    }
    return n;
  }
  void main() {
    vec2 uv = gl_FragCoord.xy / resolution;
    float t = time * 0.22;
    vec2 p = uv * vec2(3.0, 2.0);
    float flow = field(p + vec2(t, -t * 0.6));
    float warp = field(p + flow * 2.7 - vec2(t * 0.7, t));
    float ribbon = abs(uv.y - (0.44 + 0.22 * sin(uv.x * 6.0 + t * 2.0) + (warp - 0.5) * 0.7));
    float light = exp(-ribbon * 14.0);
    float core = exp(-ribbon * 55.0);
    float edge = pow(abs(uv.y - 0.5) * 2.0, 2.0);
    vec3 color = vec3(0.09, 0.045, 0.015);
    color += vec3(0.55, 0.12, 0.015) * warp * 0.65;
    color += vec3(1.0, 0.42, 0.055) * light * 0.52;
    color += vec3(1.0, 0.83, 0.35) * core * 0.5;
    color += vec3(0.7, 0.32, 0.04) * edge * (0.4 + 0.6 * flow);
    // A dark center keeps the label readable as the ribbons move behind it.
    color *= 0.65 + edge * 0.45;
    gl_FragColor = vec4(color, 1.0);
  }
`;

export default function NavShader({ reducedMotion }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas.getContext('webgl', { alpha: false, antialias: false, depth: false, powerPreference: 'low-power' });
    if (!gl) return;
    let frame = 0;
    let lost = false;
    let inView = true;
    const compile = (type, source) => {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };
    const vertex = compile(gl.VERTEX_SHADER, vertexSource);
    const fragment = compile(gl.FRAGMENT_SHADER, fragmentSource);
    if (!vertex || !fragment) {
      if (vertex) gl.deleteShader(vertex);
      if (fragment) gl.deleteShader(fragment);
      return;
    }
    const program = gl.createProgram();
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      gl.deleteShader(vertex); gl.deleteShader(fragment); gl.deleteProgram(program);
      return;
    }
    gl.useProgram(program);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    const resolution = gl.getUniformLocation(program, 'resolution');
    const time = gl.getUniformLocation(program, 'time');
    let lastFrame = 0;
    const render = timestamp => {
      if (lost) return;
      // Limit this small decorative surface to 30 fps.
      if (timestamp - lastFrame >= 32 || reducedMotion) {
        lastFrame = timestamp;
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.uniform2f(resolution, canvas.width, canvas.height);
        gl.uniform1f(time, reducedMotion ? 7 : timestamp / 1000);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        canvas.style.opacity = '1';
      }
      if (!reducedMotion && !document.hidden && inView) frame = requestAnimationFrame(render);
    };
    const restart = () => {
      cancelAnimationFrame(frame);
      if (!lost && !document.hidden && inView) frame = requestAnimationFrame(render);
    };
    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(canvas.clientWidth * ratio));
      canvas.height = Math.max(1, Math.round(canvas.clientHeight * ratio));
      lastFrame = 0;
      restart();
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    const intersectionObserver = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; restart(); });
    intersectionObserver.observe(canvas);
    const onContextLost = event => {
      event.preventDefault(); lost = true;
      cancelAnimationFrame(frame);
      canvas.style.opacity = '0';
    };
    canvas.addEventListener('webglcontextlost', onContextLost);
    document.addEventListener('visibilitychange', restart);
    resize();
    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener('visibilitychange', restart);
      canvas.removeEventListener('webglcontextlost', onContextLost);
      gl.deleteBuffer(buffer); gl.deleteProgram(program);
      gl.deleteShader(vertex); gl.deleteShader(fragment);
    };
  }, [reducedMotion]);
  return <Box aria-hidden="true" sx={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: -1, background: 'linear-gradient(125deg, #3B200B, #17130C 55%, #563009)' }}>
    <Box component="canvas" ref={canvasRef} sx={{ width: '100%', height: '100%', display: 'block', opacity: 0 }} />
  </Box>;
}
