const { createCanvas } = require('canvas');
const fs = require('fs');

function generateImage(numDots, clustering, segmentWeights, outputFilePath) {
  // Create a canvas instance
  const canvas = createCanvas(400, 400);
  const context = canvas.getContext('2d');
  
  // Fill the canvas with white background
  context.fillStyle = '#FFFFFF';
  context.fillRect(0, 0, canvas.width, canvas.height);
  
  // Calculate the center of the circle
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  
  // Calculate the radius of the circle
  const radius = Math.min(centerX, centerY) - 10;
  
  // Draw the pizza slices
  const sliceAngle = (2 * Math.PI) / 12;
  context.strokeStyle = '#000000'; // Outline color
  context.lineWidth = 2; // Outline thickness
  for (let i = 0; i < 12; i++) {
    const startAngle = i * sliceAngle;
    const endAngle = (i + 1) * sliceAngle;
    
    // Draw the slice outline
    context.beginPath();
    context.arc(centerX, centerY, radius, startAngle, endAngle);
    context.lineTo(centerX, centerY);
    context.closePath();
    context.stroke();
    
    // Generate dots for the slice
    const sliceDots = Math.round(numDots * segmentWeights[i]);
    for (let j = 0; j < sliceDots; j++) {
      const angle = Math.random() * (endAngle - startAngle) + startAngle;
      const dotRadius = Math.random() * 3 + 1; // Adjust the dot size as desired
      const distanceFromCenter = Math.random() * (radius - dotRadius * 2) + dotRadius;
      const x = centerX + distanceFromCenter * Math.cos(angle);
      const y = centerY + distanceFromCenter * Math.sin(angle);
      
      // Draw the dot
      context.beginPath();
      context.arc(x, y, dotRadius, 0, 2 * Math.PI);
      context.fillStyle = '#000000'; // Dot color
      context.fill();
    }
  }
  
  // Export the canvas to an image file
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(outputFilePath, buffer);
}

// Example usage
const numDots = 100; // Total number of dots
const clustering = 0.6; // Dot clustering factor
const segmentWeights = [
  0.05, 0.15, 0.1, 0.12, 0.08, 0.09, 0.1, 0.12, 0.1, 0.09, 0.15, 0.05
]; // Dot weights per segment
const outputFilePath = 'image.png'; // Output file path

generateImage(numDots, clustering, segmentWeights, outputFilePath);
console.log('Image generated and saved successfully!');
