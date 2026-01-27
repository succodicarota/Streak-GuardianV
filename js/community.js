/* ================================
   STREAK GUARDIAN - COMMUNITY
   Constellation visualization
   ================================ */

const Community = {
  canvas: null,
  ctx: null,
  stars: [],
  animationId: null,
  
  // Initialize community page
  init() {
    this.canvas = document.getElementById('constellation-canvas');
    if (!this.canvas) return;
    
    this.ctx = this.canvas.getContext('2d');
    
    // Set canvas size
    const container = this.canvas.parentElement;
    this.canvas.width = container.clientWidth;
    this.canvas.height = 300;
    
    // Generate stars
    this.generateStars();
    
    // Start animation
    this.animate();
    
    // Update stats (mock data for now)
    this.updateStats();
  },
  
  // Generate random stars
  generateStars() {
    const numStars = 50; // Represent users
    this.stars = [];
    
    for (let i = 0; i < numStars; i++) {
      this.stars.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.5,
        twinkleSpeed: Math.random() * 0.02 + 0.01,
        twinklePhase: Math.random() * Math.PI * 2
      });
    }
  },
  
  // Draw constellation
  draw() {
    // Clear canvas
    this.ctx.fillStyle = '#0F172A';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw connections between nearby stars
    this.ctx.strokeStyle = 'rgba(16, 185, 129, 0.2)';
    this.ctx.lineWidth = 0.5;
    
    for (let i = 0; i < this.stars.length; i++) {
      for (let j = i + 1; j < this.stars.length; j++) {
        const dx = this.stars[i].x - this.stars[j].x;
        const dy = this.stars[i].y - this.stars[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 80) {
          this.ctx.beginPath();
          this.ctx.moveTo(this.stars[i].x, this.stars[i].y);
          this.ctx.lineTo(this.stars[j].x, this.stars[j].y);
          this.ctx.stroke();
        }
      }
    }
    
    // Draw stars
    this.stars.forEach(star => {
      // Update twinkle
      star.twinklePhase += star.twinkleSpeed;
      const twinkleOpacity = star.opacity + Math.sin(star.twinklePhase) * 0.3;
      
      // Draw star
      this.ctx.fillStyle = `rgba(16, 185, 129, ${twinkleOpacity})`;
      this.ctx.beginPath();
      this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      this.ctx.fill();
      
      // Draw glow
      const gradient = this.ctx.createRadialGradient(
        star.x, star.y, 0,
        star.x, star.y, star.size * 3
      );
      gradient.addColorStop(0, `rgba(16, 185, 129, ${twinkleOpacity * 0.5})`);
      gradient.addColorStop(1, 'rgba(16, 185, 129, 0)');
      
      this.ctx.fillStyle = gradient;
      this.ctx.beginPath();
      this.ctx.arc(star.x, star.y, star.size * 3, 0, Math.PI * 2);
      this.ctx.fill();
    });
  },
  
  // Animation loop
  animate() {
    this.draw();
    this.animationId = requestAnimationFrame(() => this.animate());
  },
  
  // Stop animation
  stop() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  },
  
  // Update community stats (mock data for now)
  updateStats() {
    // Mock data - in future this would come from Firebase
    const mockUsers = 2847;
    const mockStreak = 12;
    const mockSOS = 8432;
    
    const countEl = document.getElementById('community-count');
    const streakEl = document.getElementById('global-streak');
    const sosEl = document.getElementById('global-sos');
    
    if (countEl) this.animateNumber(countEl, mockUsers);
    if (streakEl) streakEl.textContent = `${mockStreak} giorni`;
    if (sosEl) sosEl.textContent = mockSOS.toLocaleString();
  },
  
  // Animate number counting up
  animateNumber(element, target) {
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      element.textContent = Math.floor(current).toLocaleString();
    }, 30);
  }
};

// Initialize community when page loads
function initializeCommunity() {
  if (!Community.canvas) {
    Community.init();
  }
}
