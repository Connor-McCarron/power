const { createCanvas } = require('canvas');
const fs = require('fs');

function generateSegmentWeights() {
  const segmentWeights = Array(12).fill(0);
  const populatedSegments = [];
  const targetSegments = [];

  while (targetSegments.length < 2) {
    const segment = Math.floor(Math.random() * 12);
    if (!targetSegments.includes(segment)) {
      targetSegments.push(segment);
    }
  }

  targetSegments.forEach((segment) => {
    const weight = Math.random() * 0.15 + 0.05; // Random weight between 0.05-0.2
    segmentWeights[segment] = weight;
    populatedSegments.push(segment);
  });

  const remainingSegments = [...Array(12).keys()].filter((segment) => !populatedSegments.includes(segment));

  while (populatedSegments.length < 5) {
    const segment = remainingSegments[Math.floor(Math.random() * remainingSegments.length)];
    const weight = Math.random() * 0.1 + 0.01; // Random weight between 0.01-0.1
    segmentWeights[segment] = weight;
    populatedSegments.push(segment);
  }

  return segmentWeights;
}

function generateDot(startAngle, endAngle, centerX, centerY, radius, innerRadius, context) {
  let x, y, distance, dotRadius;

  do {
    const angle = Math.random() * (endAngle - startAngle) + startAngle;
    dotRadius = Math.random() * 3 + 1; // Adjust the dot size as desired
    const distanceFromCenter = Math.random() * (radius - dotRadius * 2 - innerRadius) + innerRadius;
    x = centerX + distanceFromCenter * Math.cos(angle);
    y = centerY + distanceFromCenter * Math.sin(angle);

    // Calculate distance from the center
    distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
  } while (distance < innerRadius);

  // Draw the dot
  context.beginPath();
  context.arc(x, y, dotRadius, 0, 2 * Math.PI);
  context.fillStyle = '#000000'; // Dot color
  context.fill();
}

function generateImage(outputFilePath) {
  // Randomly generate variables within defined ranges
  const numDots = Math.floor(Math.random() * 201) + 100; // Range: 100-300
  const clustering = 0.9;
  const segmentWeights = generateSegmentWeights();

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
  const innerRadius = 60; // Distance from center to exclude

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
      generateDot(startAngle, endAngle, centerX, centerY, radius, innerRadius, context);
    }
  }

  // Export the canvas to an image file
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(outputFilePath, buffer);
}

// Generate multiple images with different variable inputs
const numImages = 3; // Number of images to generate

for (let i = 0; i < numImages; i++) {
  const outputFilePath = `image${i}.png`; // Output file path for each image
  generateImage(outputFilePath);
  console.log(`Image ${i + 1} generated and saved successfully!`);
}
