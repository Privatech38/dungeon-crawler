override ambientRed: f32 = 0.039;
override ambientGreen: f32 = 0.039;
override ambientBlue: f32 = 0.039;

override farPlane: f32 = 30;
override nearPlane: f32 = 0.01;

struct VertexInput {
    @location(0) position: vec3f,
    @location(1) texcoords: vec2f,
    @location(2) normal: vec3f,
}

struct VertexOutput {
    @builtin(position) position: vec4f,
    @location(1) texcoords: vec2f,
    @location(2) normal: vec3f,
    @location(3) worldPos: vec4f
}

struct FragmentInput {
    @location(1) texcoords: vec2f,
    @location(2) normal: vec3f,
    @location(3) worldPos: vec4f
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

@group(1) @binding(0) var<storage, read> lights: array<LightUniform>;
@group(1) @binding(1) var depthCubeArray: texture_depth_cube_array;
@group(1) @binding(2) var depthCubeSampler: sampler_comparison;

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
    output.worldPos = model.modelMatrix * vec4(input.position, 1);
    return output;
}

@fragment
fn fragment(input: FragmentInput) -> FragmentOutput {
    var output: FragmentOutput;

    let N = vec4f(normalize(input.normal), 0);

    let baseColor = textureSample(baseTexture, baseSampler, input.texcoords) * material.baseFactor;

    var finalColor = vec4f(0.0);
    var lightAmount: u32 = arrayLength(&lights);
    for (var i: u32 = 0; i < lightAmount; i++) {
        let light = lights[i];
        let lightModelMatrix: mat4x4<f32> = light.globalModelMatrix;
        let lightPosition: vec4f = lightModelMatrix[3];
//        if (distance(lightPosition, input.worldPos) > 10) {
//            continue;
//        }
        finalColor += calculatePointLight(light.extension, i, lightPosition, N, input.worldPos, baseColor);
    }

//    let finalColor = baseColor * vec4f(light.color * lambert + material.ambientColor, 1);

    output.color = pow(finalColor, vec4(1 / 2.2));

    return output;
}

fn calculatePointLight(light: Light, lightIndex: u32, lightPosition: vec4f, normal: vec4f, position: vec4f, baseColor: vec4f) -> vec4f {
    let lightDir: vec4f = normalize(lightPosition - position);
    let diff: f32 = max(dot(normal, lightDir), 0.0);
    // Attenuation
    let lightDistance: f32 = distance(lightPosition, position);
    let coefficients: vec3f = attenuationFromRange(light.intensity, 0.01);
    let attenuation: f32 = 1.0 / (coefficients.x + coefficients.y * lightDistance + coefficients.z * lightDistance * lightDistance);
    // Combine
    var ambient = vec4f(ambientRed, ambientGreen, ambientBlue, 1.0);
    var diffuse = vec4f(light.color, 1.0) * diff;
    ambient *= attenuation;
    diffuse *= attenuation;

    let shadow: f32 = computeShadow(position.xyz, lightPosition.xyz, lightIndex * 6);
    return (ambient + shadow * diffuse) * baseColor;
}

fn attenuationFromRange(range: f32, threshold: f32) -> vec3f {
    let constantAttenuation: f32 = 1.0;
    let linearAttenuation: f32 = 0.0;
    let t = max(threshold, 1e-6);
    let quadraticAttenuation: f32 = (1.0 / t - constantAttenuation) / (range * range);
    return vec3f(constantAttenuation, linearAttenuation, quadraticAttenuation);
}

fn computeShadow(fragPos: vec3f, lightPos: vec3f, lightIndex: u32) -> f32 {
    let fragToLight: vec3f = fragPos - lightPos;
    var referenceDepth: f32 = length(fragToLight);
    referenceDepth = (referenceDepth - nearPlane) / (farPlane - nearPlane);
    return textureSampleCompare(depthCubeArray, depthCubeSampler, normalize(fragToLight), lightIndex, referenceDepth);
}
