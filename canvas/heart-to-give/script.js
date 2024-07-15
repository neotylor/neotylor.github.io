const canvas = document.createElement("canvas")
const gl = canvas.getContext("webgl2")

document.body.innerHTML = ""
document.body.appendChild(canvas)
document.body.style = "margin:0;touch-action:none;overflow:hidden;"
canvas.style.width = "100%"
canvas.style.height = "auto"
canvas.style.userSelect = "none"

const dpr = window.devicePixelRatio

function resize() {
    const {
      innerWidth: width,
      innerHeight: height
    } = window
    
    canvas.width = width * dpr
    canvas.height = height * dpr
    
    gl.viewport(0, 0, width * dpr, height * dpr)
}
window.onresize = resize

const vertexSource = `#version 300 es
    #ifdef GL_FRAGMENT_PRECISION_HIGH
    precision highp float;
    #else
    precision mediump float;
    #endif
    
    in vec4 position;
    
    void main(void) {
        gl_Position = position;
    }
`

const fragmentSource = `#version 300 es
/*********
 * made by Matthias Hurrle (@atzedent) 
 */
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
out vec4 O;
uniform float time;
uniform vec2 resolution;
#define FC gl_FragCoord.xy
#define R resolution
#define T time
#define S smoothstep
vec3 palette(float t) {
    vec3    
    a=vec3(.2),
    b=vec3(.15),
    c=vec3(.125),
    d=vec3(1,.8,.6);
    return a+b*cos(6.3*(c*t+d));
}
float rnd(vec2 p) { return fract(sin(dot(p,vec2(12.9898,78.233)))*345678.); }
float noise(vec2 p) { vec2 i=floor(p), f=fract(p), u=S(.0,1.,f); float a=rnd(i),b=rnd(i+vec2(1,0)),c=rnd(i+vec2(0,1)),d=rnd(i+1.); return mix(mix(a,b,u.x),mix(c,d,u.x),u.y); }
float fbm(vec2 p) { float t=.0, a=1.; for (int i=0; i<5; i++) { t+=a*noise(p+T*.2); p*=2.; a*=.5; } return t; }
vec3 pattern(vec2 uv) {
    vec3 col = vec3(0);
    vec2 p = uv;
    float d = 1.;
    for (float i=.0; i<3.; i++) {
        p = vec2(cos(uv.x),sin(uv.y))*i;
        uv *= 2.;
        d = fbm(uv*d+T*.2);
        col += d+length(p);
    }
    return col;
}
float heart(vec2 p) {
    #define dot2(v) dot(v,v)
    p.x = abs(p.x);
    p.y+=.6;

    return p.y+p.x>1.
        ? sqrt(dot2(p-vec2(.25,.75)))-sqrt(2.)*.25
        : sqrt(min(dot2(p-vec2(0,1)),dot2(p-.5*max(p.x+p.y,.0))))*sign(p.x-p.y);
}
void main(void) {
    vec2 uv = (FC-.5*R)/min(R.x,R.y), p=uv;
    vec3 col = vec3(0);
    float d = length(uv);
    d = 200.*heart(uv*2.)*d*d*d*d;
    d = abs(d)+.025;
    d = pow(1./d,.35);
    p*=sin(exp(log(noise(uv*d+T*.1)))*222.);
    col = max(vec3(0), mix(S(length(p*.2), 1., palette(d)),palette(length(pattern(uv)))*d,.8));
    O = vec4(col, 1);
}
`

function compile(shader, source) {
    gl.shaderSource(shader, source)
    gl.compileShader(shader);
    
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error(gl.getShaderInfoLog(shader))
    }
}

let program

function setup() {
    const vs = gl.createShader(gl.VERTEX_SHADER)
    const fs = gl.createShader(gl.FRAGMENT_SHADER)
    
    compile(vs, vertexSource)
    compile(fs, fragmentSource)
    
    program = gl.createProgram()
    
    gl.attachShader(program, vs)
    gl.attachShader(program, fs)
    gl.linkProgram(program)
    
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(program))
    }
}

let vertices, buffer

function init() {
    vertices = [
        -1., 1.,
        -1.,-1.,
         1., 1.,
         1.,-1.,
        ]
    
    buffer = gl.createBuffer()
    
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW)
    
    const position = gl.getAttribLocation(program, "position")
    
    gl.enableVertexAttribArray(position)
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)
    
    program.resolution = gl.getUniformLocation(program, "resolution")
    program.time = gl.getUniformLocation(program, "time")
}

function loop(now) {
    gl.clearColor(0, 0, 0, 1)
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.useProgram(program)
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.uniform2f(program.resolution, canvas.width, canvas.height)
    gl.uniform1f(program.time, now * 1e-3)
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, vertices.length*.5)
    requestAnimationFrame(loop)
}

setup()
init()
resize()
loop(0)
