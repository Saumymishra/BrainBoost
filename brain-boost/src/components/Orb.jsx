import { useEffect, useRef } from "react";
import { Renderer, Program, Mesh, Triangle, Vec3 } from "ogl";

export default function Orb() {
  const ctnDom = useRef(null);

  useEffect(() => {
    const container = ctnDom.current;
    if (!container) return;

    const renderer = new Renderer({ alpha: true });
    const gl = renderer.gl;
    container.appendChild(gl.canvas);

    const geometry = new Triangle(gl);
    const program = new Program(gl, {
      vertex: `
        precision highp float;
        attribute vec2 position;
        void main() {
          gl_Position = vec4(position, 0.0, 1.0);
        }
      `,
      fragment: `
        precision highp float;
        uniform float iTime;
        uniform vec3 iResolution;

        vec3 pastelGradient(float t) {
          return mix(
            mix(vec3(0.8, 0.7, 1.0), vec3(0.7, 0.9, 1.0), sin(t * 2.0) * 0.5 + 0.5),
            vec3(0.6, 0.8, 1.0),
            0.5
          );
        }

        void main() {
          vec2 uv = (gl_FragCoord.xy / iResolution.xy) * 2.0 - 1.0;
          float len = length(uv);
          float angle = atan(uv.y, uv.x) + iTime * 0.3;

          float glow = smoothstep(1.2, 0.6, len);
          vec3 color = pastelGradient(angle);

          gl_FragColor = vec4(color * glow, glow);
        }
      `,
      uniforms: {
        iTime: { value: 0 },
        iResolution: { value: new Vec3() },
      },
    });

    const mesh = new Mesh(gl, { geometry, program });

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = container.clientWidth;
      const h = container.clientHeight;
      renderer.setSize(w * dpr, h * dpr);
      gl.canvas.style.width = `${w}px`;
      gl.canvas.style.height = `${h}px`;
      program.uniforms.iResolution.value.set(gl.canvas.width, gl.canvas.height, 1);
    };

    window.addEventListener("resize", resize);
    resize();

    let rafId;
    const update = (t) => {
      rafId = requestAnimationFrame(update);
      program.uniforms.iTime.value = t * 0.001;
      renderer.render({ scene: mesh });
    };

    update(0);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      container.removeChild(gl.canvas);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  return (
    <div ref={ctnDom} className="w-full h-full rounded-full overflow-hidden" />
  );
}
