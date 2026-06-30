// Person segmentation via the Vision framework.
// Reads an image, masks out everything but the person(s), writes a PNG with a
// transparent background. Usage: segment <in.jpg> <out.png>
import Foundation
import Vision
import CoreImage
import AppKit

let args = CommandLine.arguments
guard args.count >= 3 else { FileHandle.standardError.write("usage: segment <in> <out>\n".data(using: .utf8)!); exit(1) }
let inURL = URL(fileURLWithPath: args[1])
let outURL = URL(fileURLWithPath: args[2])

guard let nsImage = NSImage(contentsOf: inURL),
      let tiff = nsImage.tiffRepresentation,
      let bitmap = NSBitmapImageRep(data: tiff),
      let cgImage = bitmap.cgImage else {
  FileHandle.standardError.write("failed to load image\n".data(using: .utf8)!); exit(1)
}

let request = VNGeneratePersonSegmentationRequest()
request.qualityLevel = .accurate
request.outputPixelFormat = kCVPixelFormatType_OneComponent8

let handler = VNImageRequestHandler(cgImage: cgImage, options: [:])
do { try handler.perform([request]) } catch {
  FileHandle.standardError.write("segmentation failed: \(error)\n".data(using: .utf8)!); exit(1)
}
guard let mask = request.results?.first?.pixelBuffer else {
  FileHandle.standardError.write("no person found\n".data(using: .utf8)!); exit(1)
}

let base = CIImage(cgImage: cgImage)
var maskCI = CIImage(cvPixelBuffer: mask)
let sx = base.extent.width / maskCI.extent.width
let sy = base.extent.height / maskCI.extent.height
maskCI = maskCI.transformed(by: CGAffineTransform(scaleX: sx, y: sy))

let blend = CIFilter(name: "CIBlendWithMask")!
blend.setValue(base, forKey: kCIInputImageKey)
blend.setValue(CIImage.empty(), forKey: kCIInputBackgroundImageKey) // transparent bg
blend.setValue(maskCI, forKey: kCIInputMaskImageKey)
guard let out = blend.outputImage else {
  FileHandle.standardError.write("blend failed\n".data(using: .utf8)!); exit(1)
}

let ctx = CIContext()
guard let outCG = ctx.createCGImage(out, from: base.extent) else {
  FileHandle.standardError.write("render failed\n".data(using: .utf8)!); exit(1)
}
let rep = NSBitmapImageRep(cgImage: outCG)
guard let png = rep.representation(using: .png, properties: [:]) else {
  FileHandle.standardError.write("encode failed\n".data(using: .utf8)!); exit(1)
}
try! png.write(to: outURL)
print("ok \(outCG.width)x\(outCG.height)")
