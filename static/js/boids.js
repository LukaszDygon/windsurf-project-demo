/**
 * Boids simulation with repulsion behavior
 * Boids will be repelled by mouse cursor and other boids
 */

import { surferPhrases } from './surfer_phrases.js';

class Boid {
    constructor(x, y) {
        this.position = { x, y };
        
        // Stronger initial velocities
        this.velocity = {
            x: (Math.random() - 0.5) * 6,  
            y: (Math.random() - 0.5) * 6   
        };
        this.size = 8;
        this.maxSpeed = 7;    
        this.minSpeed = 0.8;  

        // Message pool (no active messages stored here anymore)
        this.allMessages = [];
        this.generateMessages();
        
        // Random repulsion factor for this boid
        this.personalRepulsionFactor = 0.8 + Math.random() * 0.7; // Random between 0.8 and 1.5
        
        // Repulsion parameters
        this.boidRepulsionRange = 80;
        this.boidRepulsionStrength = 0.8 * this.personalRepulsionFactor;
        this.mouseRepulsionRange = 120;
        this.mouseRepulsionStrength = 1.2 * this.personalRepulsionFactor;
        this.borderBuffer = 10;  // Absolute minimum distance from border
        this.borderRepulsionRange = 100;  // Start repelling at 100px
        this.borderRepulsionStrength = 3.0 * this.personalRepulsionFactor;  // Stronger border repulsion

        // Drag/friction parameters - more gradual slowdown
        this.dragFactor = 0.99;        
        this.restingDragFactor = 0.97; 
        this.repulsionThreshold = 0.01; // Threshold to determine if affected by repulsion
    }

    generateMessages() {
        const usedIndices = new Set();
        const count = Math.floor(Math.random() * 4) + 1; // 1 to 4 messages in pool
        while (this.allMessages.length < count) {
            const index = Math.floor(Math.random() * surferPhrases.length);
            if (!usedIndices.has(index)) {
                usedIndices.add(index);
                this.allMessages.push(surferPhrases[index]);
            }
        }
    }

    calculateRepulsion(distance, range, strength) {
        if (distance >= range) return 0;
        // Inverse square law for stronger close-range repulsion
        const normalizedDist = distance / range;
        return strength * (1 - normalizedDist) * (1 - normalizedDist);
    }

    update(boids, mousePos, canvas) {
        let repulsionX = 0;
        let repulsionY = 0;
        let isAffectedByRepulsion = false;

        // Repulsion from other boids
        boids.forEach(other => {
            if (other === this) return;

            const dx = this.position.x - other.position.x;
            const dy = this.position.y - other.position.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            const repulsion = this.calculateRepulsion(distance, this.boidRepulsionRange, this.boidRepulsionStrength);
            if (repulsion > 0) {
                const angle = Math.atan2(dy, dx);
                repulsionX += Math.cos(angle) * repulsion;
                repulsionY += Math.sin(angle) * repulsion;
                if (repulsion > this.repulsionThreshold) {
                    isAffectedByRepulsion = true;
                }
            }
        });

        // Repulsion from mouse
        if (mousePos) {
            const dx = this.position.x - mousePos.x;
            const dy = this.position.y - mousePos.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            const repulsion = this.calculateRepulsion(distance, this.mouseRepulsionRange, this.mouseRepulsionStrength);
            if (repulsion > 0) {
                const angle = Math.atan2(dy, dx);
                repulsionX += Math.cos(angle) * repulsion;
                repulsionY += Math.sin(angle) * repulsion;
                if (repulsion > this.repulsionThreshold) {
                    isAffectedByRepulsion = true;
                }
            }
        }

        // Border repulsion
        const leftDist = this.position.x;
        const rightDist = canvas.width - this.position.x;
        const topDist = this.position.y;
        const bottomDist = canvas.height - this.position.y;

        // Check and apply border repulsion (only within 100px)
        let borderRepulsion = false;
        
        if (leftDist < this.borderRepulsionRange) {
            const force = Math.pow((this.borderRepulsionRange - leftDist) / this.borderRepulsionRange, 2);
            repulsionX += this.borderRepulsionStrength * force;
            borderRepulsion = true;
        }
        if (rightDist < this.borderRepulsionRange) {
            const force = Math.pow((this.borderRepulsionRange - rightDist) / this.borderRepulsionRange, 2);
            repulsionX -= this.borderRepulsionStrength * force;
            borderRepulsion = true;
        }
        if (topDist < this.borderRepulsionRange) {
            const force = Math.pow((this.borderRepulsionRange - topDist) / this.borderRepulsionRange, 2);
            repulsionY += this.borderRepulsionStrength * force;
            borderRepulsion = true;
        }
        if (bottomDist < this.borderRepulsionRange) {
            const force = Math.pow((this.borderRepulsionRange - bottomDist) / this.borderRepulsionRange, 2);
            repulsionY -= this.borderRepulsionStrength * force;
            borderRepulsion = true;
        }
        
        if (borderRepulsion) {
            isAffectedByRepulsion = true;
        }

        // Update velocity with repulsion
        this.velocity.x += repulsionX;
        this.velocity.y += repulsionY;

        // Apply drag based on whether the boid is being affected by repulsion
        const dragFactor = isAffectedByRepulsion ? this.dragFactor : this.restingDragFactor;
        this.velocity.x *= dragFactor;
        this.velocity.y *= dragFactor;

        // Apply minimum speed
        const speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
        if (speed < this.minSpeed) {
            const scale = this.minSpeed / speed;
            this.velocity.x *= scale;
            this.velocity.y *= scale;
        }
        // Apply maximum speed
        if (speed > this.maxSpeed) {
            const scale = this.maxSpeed / speed;
            this.velocity.x *= scale;
            this.velocity.y *= scale;
        }

        // Update position
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        // Enforce strict border limits
        this.position.x = Math.max(this.borderBuffer, Math.min(canvas.width - this.borderBuffer, this.position.x));
        this.position.y = Math.max(this.borderBuffer, Math.min(canvas.height - this.borderBuffer, this.position.y));
    }

    draw(ctx) {
        // Draw the boid triangle
        const speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
        const normalizedSpeed = (speed - this.minSpeed) / (this.maxSpeed - this.minSpeed);
        
        // Save the current context state
        ctx.save();
        
        // Move to the boid's position and rotate
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(Math.atan2(this.velocity.y, this.velocity.x));
        
        // Draw the triangle
        ctx.beginPath();
        ctx.moveTo(this.size, 0);
        ctx.lineTo(-this.size, this.size / 2);
        ctx.lineTo(-this.size, -this.size / 2);
        ctx.closePath();
        
        // Set color based on speed
        const hue = 240 + normalizedSpeed * 60; // Blue to purple
        ctx.fillStyle = `hsla(${hue}, 100%, 50%, 0.8)`;
        ctx.fill();
        
        // Reset transformation
        ctx.restore();
    }
}

class BoidsSimulation {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.boids = [];
        this.mousePos = null;
        this.isRunning = false;

        // Global message management
        this.activeMessages = [];
        this.maxGlobalMessages = 4;
        this.messageChance = 0.01; // 0.2% chance per frame for any boid
        this.messageDuration = 5000; // 5 seconds
        this.fadeTime = 500; // 0.5 seconds fade in/out

        // Set canvas size
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());

        // Mouse event listeners
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mousePos = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            };
        });

        this.canvas.addEventListener('mouseleave', () => {
            this.mousePos = null;
        });

        this.canvas.addEventListener('click', (e) => {
            // Only handle left clicks
            if (e.button === 0) {
                const margin = 100; // Keep away from edges
                const x = margin + Math.random() * (this.canvas.width - 2 * margin);
                const y = margin + Math.random() * (this.canvas.height - 2 * margin);
                this.addBoid(x, y);
            }
        });

        // Add initial random boids
        this.addRandomBoids(30);
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    addRandomBoids(count) {
        const margin = 100; // Keep away from edges initially
        for (let i = 0; i < count; i++) {
            this.addBoid(
                margin + Math.random() * (this.canvas.width - 2 * margin),
                margin + Math.random() * (this.canvas.height - 2 * margin)
            );
        }
    }

    addBoid(x, y) {
        this.boids.push(new Boid(x, y));
    }

    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.animate();
        }
    }

    stop() {
        this.isRunning = false;
    }

    update() {
        // Update global messages
        const currentTime = Date.now();
        
        // Remove expired messages
        this.activeMessages = this.activeMessages.filter(msg => 
            currentTime < msg.startTime + this.messageDuration + this.fadeTime
        );

        // Chance to add new message if we have room
        if (this.activeMessages.length < this.maxGlobalMessages && 
            Math.random() < this.messageChance && 
            this.boids.length > 0) {
            
            // Select random boid
            const boidIndex = Math.floor(Math.random() * this.boids.length);
            const boid = this.boids[boidIndex];
            
            // Select random message from boid's pool
            if (boid.allMessages.length > 0) {
                const messageIndex = Math.floor(Math.random() * boid.allMessages.length);
                const message = boid.allMessages[messageIndex];
                
                // Add message with timestamp and boid reference
                this.activeMessages.push({
                    text: message,
                    startTime: currentTime,
                    boid: boid
                });
            }
        }

        // Update all boids
        this.boids.forEach(boid => {
            boid.update(this.boids, this.mousePos, this.canvas);
        });
    }

    draw() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw all boids
        this.boids.forEach(boid => {
            boid.draw(this.ctx);
        });

        // Draw speech bubbles
        const currentTime = Date.now();
        
        this.activeMessages.forEach((message, index) => {
            this.ctx.save();
            this.ctx.font = '12px Arial';
            this.ctx.textAlign = 'left';
            
            const bubbleMargin = 5;
            const bubblePadding = 5;
            const bubbleSpacing = 25;
            const bubbleRadius = 10;
            
            // Calculate fade
            let opacity = 1;
            const elapsed = currentTime - message.startTime;
            
            if (elapsed < this.fadeTime) {
                // Fading in
                opacity = elapsed / this.fadeTime;
            } else if (elapsed > this.messageDuration) {
                // Fading out
                opacity = 1 - ((elapsed - this.messageDuration) / this.fadeTime);
            }
            
            const metrics = this.ctx.measureText(message.text);
            const textHeight = 12; // Approximate height of the text
            const bubbleWidth = metrics.width + 2 * bubblePadding;
            const bubbleHeight = textHeight + 2 * bubblePadding;
            
            const bubbleX = message.boid.position.x + message.boid.size + bubbleMargin;
            const bubbleY = message.boid.position.y - bubbleHeight;
            
            // Draw bubble background
            this.ctx.beginPath();
            this.ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 0.9})`;
            this.ctx.moveTo(bubbleX + bubbleRadius, bubbleY);
            this.ctx.lineTo(bubbleX + bubbleWidth - bubbleRadius, bubbleY);
            this.ctx.quadraticCurveTo(bubbleX + bubbleWidth, bubbleY, bubbleX + bubbleWidth, bubbleY + bubbleRadius);
            this.ctx.lineTo(bubbleX + bubbleWidth, bubbleY + bubbleHeight - bubbleRadius);
            this.ctx.quadraticCurveTo(bubbleX + bubbleWidth, bubbleY + bubbleHeight, bubbleX + bubbleWidth - bubbleRadius, bubbleY + bubbleHeight);
            this.ctx.lineTo(bubbleX + bubbleRadius, bubbleY + bubbleHeight);
            this.ctx.quadraticCurveTo(bubbleX, bubbleY + bubbleHeight, bubbleX, bubbleY + bubbleHeight - bubbleRadius);
            this.ctx.lineTo(bubbleX, bubbleY + bubbleRadius);
            this.ctx.quadraticCurveTo(bubbleX, bubbleY, bubbleX + bubbleRadius, bubbleY);
            this.ctx.fill();
            
            // Draw text
            this.ctx.fillStyle = `rgba(0, 0, 0, ${opacity})`;
            this.ctx.fillText(message.text, bubbleX + bubblePadding, bubbleY + bubblePadding + textHeight);
            
            this.ctx.restore();
        });
    }

    animate() {
        if (!this.isRunning) return;

        this.update();
        this.draw();

        // Continue animation loop
        requestAnimationFrame(() => this.animate());
    }
}

// Export for use in other modules
export { BoidsSimulation };
