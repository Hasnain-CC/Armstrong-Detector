export const drawRect = (detections, ctx) =>{
    detections.forEach(prediction => {
        
      const [x, y, width, height] = prediction['bbox']; 
      const text = prediction['class']; 

      ctx.strokeStyle = '#' + 'ffffff'
      ctx.font = '18px Arial';
  
      // Draw rectangles and text
      ctx.beginPath();   
      ctx.fillStyle = '#' + 'ffffff'
      ctx.fillText(text, x, y);
      ctx.rect(x, y, width, height); 
      ctx.stroke();
    });
  }