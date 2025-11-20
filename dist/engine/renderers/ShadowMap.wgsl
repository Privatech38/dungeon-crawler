struct LightUniforms {
    viewMatrix: mat4x4f,
    projectionMatrix: mat4x4f,
}

struct ModelUniforms {
    modelMatrix: mat4x4f,
    normalMatrix: mat3x3f,
}

@group(0) @binding(0) var<uniform> lightViewProj : LightUniforms;
@group(1) @binding(0) var<uniform> model: ModelUniforms;

@group(2) @binding(0) var shadowTexture : texture_2d<f32>;
@group(2) @binding(1) var shadowSampler : sampler;

@vertex
fn vertex(@location(0) position: vec3f) -> @builtin(position) vec4f {
    return lightViewProj.projectionMatrix * lightViewProj.viewMatrix * model.modelMatrix * vec4(position, 1);
}