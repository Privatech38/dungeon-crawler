struct VertexInput {
    @location(0) position: vec3f,
    @location(1) texcoords: vec2f,
    @location(2) normal: vec3f,
}

struct VertexOutput {
    @builtin(position) position: vec4f,
    @location(1) texcoords: vec2f,
    @location(2) normal: vec3f,
}

struct FragmentInput {
    @location(1) texcoords: vec2f,
    @location(2) normal: vec3f,
}

struct FragmentOutput {
    @location(0) color: vec4f,
}

struct CameraUniforms {
    viewMatrix: mat4x4f,
    projectionMatrix: mat4x4f,
}

struct LightUniforms {
    color: vec3f,
    direction: vec3f,
}

struct ModelUniforms {
    modelMatrix: mat4x4f,
    normalMatrix: mat3x3f,
}

struct MaterialUniforms {
    baseFactor: vec4f,
    ambientFactor: f32,
    ambientColor: vec3f
}

// Khronos Light extension
struct Light {
    color : vec3<f32>,
    light_type : u32,
    intensity : f32,
    range : f32,
    innerConeAngle : f32,
    outerConeAngle : f32
}

struct LightUniform {
    extension : Light,
    globalModelMatrix : mat4x4<f32>,
    viewProjectionMatrix : mat4x4<f32>
}

@group(0) @binding(0) var<uniform> camera: CameraUniforms;
//@group(1) @binding(0) var<uniform> light: LightUniforms;

@group(1) @binding(0) var<uniform> lights: array<LightUniform, 4>;
@group(1) @binding(1) var<uniform> lights: texture_depth_cube_array;
@group(1) @binding(2) var<uniform> lights: sampler;

@group(2) @binding(0) var<uniform> model: ModelUniforms;
@group(3) @binding(0) var<uniform> material: MaterialUniforms;
@group(3) @binding(1) var baseTexture: texture_2d<f32>;
@group(3) @binding(2) var baseSampler: sampler;

@vertex
fn vertex(input: VertexInput) -> VertexOutput {
    var output: VertexOutput;
    output.position = camera.projectionMatrix * camera.viewMatrix * model.modelMatrix * vec4(input.position, 1);
    output.texcoords = input.texcoords;
    output.normal = model.normalMatrix * input.normal;
    return output;
}

@fragment
fn fragment(input: FragmentInput) -> FragmentOutput {
    var output: FragmentOutput;

    let N = normalize(input.normal);
    let L = light.direction;
    let lambert = max(dot(N, L), 0.0);

    let baseColor = textureSample(baseTexture, baseSampler, input.texcoords) * material.baseFactor;

    let finalColor = baseColor * vec4f(light.color * lambert + material.ambientColor, 1);

    output.color = pow(finalColor, vec4(1 / 2.2));

    return output;
}
