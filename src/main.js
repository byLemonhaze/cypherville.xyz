import './style.css'
import { Carousel3D } from './Carousel3D.js';
import { historicalContent } from './history.js';

let allPortraits = [];
let currentPortraits = []; // For the active collection
let carouselInstance = null;
let activeCollection = null; // 'Cypherville' or 'DeVille'
let activeView = 'slideshow'; // 'slideshow' or 'grid'
let currentHistorySection = null;

const app = document.querySelector('#app');

function createUI() {
  app.innerHTML = `
    <!-- Top Navigation (Hidden on Landing) -->
    <nav class="global-nav" id="global-nav" style="transform: translateY(-100%);">
        <div class="nav-group left">
            <button class="nav-item" id="nav-cypherville">CYPHERVILLE</button>
            <span class="nav-divider">|</span>
            <button class="nav-item" id="nav-deville">DEVILLE</button>
        </div>
        <div class="nav-group center">
            <button class="nav-item" id="nav-intro">INTRO</button>
            <span class="nav-divider">|</span>
            <button class="nav-item" id="nav-history">HISTORY</button>
            <span class="nav-divider">|</span>
            <button class="nav-item" id="nav-tales">TALES</button>
        </div>
        <div class="nav-group right">
            <button class="nav-item active" id="nav-slideshow">SLIDESHOW</button>
            <span class="nav-divider">|</span>
            <button class="nav-item" id="nav-grid">GRID</button>
        </div>
        <button class="mobile-view-toggle" id="mobile-view-toggle">
            <span id="mobile-view-icon">▦</span>
        </button>
    </nav>

    <!-- Dual Landing Screen -->
    <div class="landing-screen" id="landing-screen">
      <div class="panel panel-left" id="panel-cypherville">
        <div class="panel-content">
          <h1>CYPHERVILLE</h1>
          <p>The Guardians</p>
          <button class="explore-btn" id="explore-cypherville">EXPLORE</button>
        </div>
      </div>
      <div class="panel panel-right" id="panel-deville">
        <div class="panel-content">
          <h1>DEVILLE</h1>
          <p>The Architects</p>
          <button class="explore-btn" id="explore-deville">EXPLORE</button>
        </div>
      </div>
    </div>

    <!-- Main Content (Hidden initially) -->
    <div class="main-content" id="main-content" style="display: none;">
      <div class="hero-section">
        <div class="slideshow-container">
          <div class="slideshow" id="slideshow"></div>
        </div>
        <div class="footer">Cypheville &copy; by Lemonhaze</div>
      </div>
    </div>

    <!-- Grid View -->
    <div class="grid-view" id="grid-view" style="display: none;">
      <div class="gallery" id="gallery"></div>
      <div class="footer grid-footer">Cypheville &copy; by Lemonhaze</div>
    </div>

    <!-- Modal -->
    <div class="modal" id="modal">
      <div class="modal-backdrop"></div>
      <div class="modal-content">
        <button class="modal-close" id="modal-close">×</button>
        <div class="modal-body" id="modal-body"></div>
      </div>
    </div>

    <!-- History Overlay -->
    <div class="history-overlay" id="history-overlay">
      <div class="history-backdrop"></div>
      <div class="history-content">
        <button class="history-close" id="history-close">×</button>
        <div class="history-container">
          <div class="history-text-content" id="history-text-content"></div>
        </div>
      </div>
    </div>
  `;

  addStyles();
  attachEventListeners();
}

function addStyles() {
  const style = document.createElement('style');
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Space+Mono:wght@400;700&display=swap');

    :root {
      --primary: #888;
      --primary-bright: #fff;
    }

    * {
      font-family: 'Inter', sans-serif;
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      background: #000;
      color: #fff;
      overflow-x: hidden;
    }

    /* Global Navigation */
    .global-nav {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        height: 80px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 40px;
        z-index: 90; /* Below landing (100) but above content */
        background: linear-gradient(to bottom, rgba(0,0,0,0.95), transparent);
        transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        pointer-events: none; /* Let clicks pass through if invisible */
    }

    .nav-group.center {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
    }

    .global-nav.visible {
        transform: translateY(0) !important;
        pointer-events: auto;
    }

    .nav-group {
        display: flex;
        align-items: center;
        gap: 20px;
    }

    .nav-item {
        background: none;
        border: none;
        color: rgba(255, 255, 255, 0.4);
        font-family: 'Space Mono', monospace;
        font-size: 0.8rem;
        cursor: pointer;
        transition: color 0.3s, text-shadow 0.3s;
        padding: 8px 0;
        letter-spacing: 0.1em;
    }

    .nav-item:hover {
        color: rgba(255, 255, 255, 0.8);
    }

    .nav-item.active {
        color: #fff;
        text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
    }

    .nav-divider {
        color: rgba(255, 255, 255, 0.2);
        font-family: 'Space Mono', monospace;
    }

    /* Landing Split Screen */
    .landing-screen {
      position: fixed;
      inset: 0;
      display: flex;
      z-index: 100;
      background: #000;
      padding: 40px;
      gap: 40px;
      transition: transform 0.8s cubic-bezier(0.85, 0, 0.15, 1);
    }

    .panel {
      flex: 1;
      height: 100%;
      position: relative;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 16px;
      background-color: #000;
      background-size: 102%; /* Small overscan to hide edge pixel gaps */
      background-position: center;
      background-repeat: no-repeat;
      box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.1), /* Sharp edge */
                  0 20px 50px rgba(0,0,0,0.5);
    }

    .panel::after {
      content: '';
      position: absolute;
      top: -10px; left: -10px; right: -10px; bottom: -10px;
      background: linear-gradient(to bottom, 
        rgba(0,0,0,0.2) 0%, 
        transparent 20%, 
        transparent 60%, 
        rgba(0,0,0,0.9) 100%);
      box-shadow: inset 0 0 120px rgba(0,0,0,0.8);
      transition: opacity 0.4s;
      z-index: 1;
      pointer-events: none;
    }

    .panel-content {
      position: relative;
      z-index: 2;
      text-align: center;
      transition: transform 0.4s;
    }

    .panel:hover .panel-content { transform: scale(1.1); }

    .panel h1 {
      font-family: 'Space Mono', monospace;
      font-size: clamp(1.5rem, 5vw, 3.5rem);
      letter-spacing: 0.1em;
      margin-bottom: 10px;
      text-shadow: 0 0 20px rgba(255, 255, 255, 0.15);
      white-space: nowrap;
    }

    .panel p {
      font-size: 0.875rem;
      letter-spacing: 0.5em;
      text-transform: uppercase;
      opacity: 0.6;
    }

    .explore-btn {
        margin-top: 40px;
        padding: 18px 48px;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.2);
        color: #fff;
        font-family: 'Space Mono', monospace;
        font-size: 0.85rem;
        font-weight: 700;
        letter-spacing: 0.3em;
        cursor: pointer;
        transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
        opacity: 0.9;
        border-radius: 2px;
        backdrop-filter: blur(10px);
        position: relative;
        overflow: hidden;
        text-shadow: 0 2px 4px rgba(0,0,0,0.3);
    }

    .panel:hover .explore-btn {
        opacity: 1;
        background: rgba(255, 255, 255, 0.1);
        border-color: rgba(255, 255, 255, 0.5);
        transform: translateY(-5px);
        box-shadow: 0 15px 35px rgba(0,0,0,0.4);
    }

    .explore-btn:hover {
        background: rgba(255, 255, 255, 0.25) !important;
        color: #fff !important;
        border-color: rgba(255,255,255,0.6) !important;
        transform: translateY(-8px) scale(1.02) !important;
        box-shadow: 0 20px 40px rgba(0,0,0,0.4) !important;
    }

    /* Main Content */
    .hero-section {
      width: 100vw;
      height: 100vh;
      display: flex;
      flex-direction: column;
      position: relative;
    }

    .slideshow-container {
      flex: 1;
      position: relative;
    }

    .slideshow {
      height: 100%;
      width: 100%;
      position: relative;
    }

    /* Grid View */
    .grid-view {
      padding: 120px 40px 40px; /* More top padding for nav */
      min-height: 100vh;
      display: none;
    }

    .gallery {
      max-width: 1600px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 32px;
    }

    .portrait-card {
      background: rgba(255,255,255,0.02);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 12px;
      overflow: hidden;
      cursor: pointer;
      transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
    }

    .portrait-card:hover {
      transform: translateY(-8px);
      border-color: var(--primary);
      box-shadow: 0 20px 40px rgba(0,0,0,0.4);
    }

    .portrait-img-wrapper { aspect-ratio: 1; width: 100%; }
    .portrait-img { width: 100%; height: 100%; object-fit: cover; }
    .portrait-info { padding: 20px; }
    
    .portrait-name {
        font-family: 'Space Mono', monospace;
        font-weight: 700;
        margin-bottom: 4px;
    }
    
    .portrait-id {
         font-family: 'Space Mono', monospace;
         font-size: 0.7rem;
         opacity: 0.5;
         text-transform: uppercase;
    }

    /* Cyber-Noir Modal Dossier */
    .modal {
      position: fixed;
      inset: 0;
      z-index: 1000;
      display: none;
      align-items: center;
      justify-content: center;
      padding: 0;
    }
    .modal.active { display: flex; }

    /* CITY ORACLE TERMINAL */
    .terminal-toggle {
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 60px;
        height: 60px;
        background: #000;
        border: 1px solid rgba(255, 255, 255, 0.3);
        border-radius: 12px; /* Square with rounded corners (matches View Toggle style) */
        display: none; /* Hidden by default */
        align-items: center;
        justify-content: center;
        cursor: pointer;
        z-index: 2000;
        box-shadow: 0 0 15px rgba(255, 255, 255, 0.1);
        transition: all 0.3s ease;
        opacity: 0;
        transform: translateY(20px);
    }
    .terminal-toggle.visible {
        display: flex;
        opacity: 1;
        transform: translateY(0);
    }
    .terminal-toggle:hover {
        transform: scale(1.05); /* Subtle scale for square */
        box-shadow: 0 0 25px rgba(255, 255, 255, 0.3);
        border-color: #fff;
    }
    .terminal-toggle svg, .terminal-toggle img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 12px; /* Match parent */
    }
    
    .city-terminal {
        position: fixed;
        bottom: 100px;
        right: 30px;
        width: 350px;
        height: 500px;
        background: rgba(5, 5, 5, 0.95);
        border: 1px solid rgba(255, 255, 255, 0.3);
        z-index: 2000;
        display: none;
        flex-direction: column;
        font-family: 'Space Mono', monospace;
        box-shadow: 0 0 30px rgba(0, 0, 0, 0.9);
        backdrop-filter: blur(10px);
    }

    .city-terminal.active { display: flex; }
    
    .terminal-header {
        padding: 10px 15px;
        background: rgba(255, 255, 255, 0.05);
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        color: #fff;
        font-size: 0.8rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        letter-spacing: 0.1em;
    }
    .terminal-close { cursor: pointer; }
    
    .terminal-output {
        flex: 1;
        padding: 15px;
        overflow-y: auto;
        color: #fff;
        font-size: 0.85rem;
        line-height: 1.4;
    }
    
    .terminal-msg { margin-bottom: 15px; }
    .terminal-msg.user { color: #fff; text-align: right; }
    .terminal-msg.oracle { color: #a0a0a0; text-shadow: none; }
    
    .terminal-input-area {
        padding: 15px;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
        display: flex;
        align-items: center;
    }
    .terminal-prompt { color: #fff; margin-right: 10px; }
    .terminal-input {
        background: transparent;
        border: none;
        color: #fff;
        font-family: 'Space Mono', monospace;
        flex: 1;
        outline: none;
        font-size: 0.9rem;
    }
    .terminal-send-btn {
        background: none;
        border: none;
        color: #fff;
        cursor: pointer;
        opacity: 0;
        transition: all 0.2s ease;
        padding: 0 5px;
        font-size: 1.2rem;
        pointer-events: none;
        transform: translateX(-10px);
    }
    .terminal-send-btn.visible {
        opacity: 1;
        pointer-events: all;
        transform: translateX(0);
    }


    @media (max-width: 600px) {
        .city-terminal {
            width: 100%;
            height: 100%;
            bottom: 0;
            right: 0;
            border: none;
        }
        .terminal-toggle { bottom: 20px; right: 20px; }
        
        /* Fix iOS Zoom: Font size must be 16px */
        .terminal-input { font-size: 16px; }
        
        /* Ensure button has space */
        .terminal-send-btn { 
            padding: 10px 15px; /* Larger hit area */
            font-size: 1.4rem;
            flex-shrink: 0; /* Prevent crushing */
        }
        .terminal-input-area {
            padding-right: 5px; /* Adjust padding */
        }
    }
    
    .modal-backdrop { 
        position: absolute; 
        inset: 0; 
        background: #000;
        transition: opacity 0.5s ease;
    }

    .modal-content {
      position: relative;
      background: rgba(10, 10, 10, 0.65);
      backdrop-filter: blur(40px);
      -webkit-backdrop-filter: blur(40px);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 0;
      max-width: 1400px;
      width: 95%;
      height: 90vh;
      overflow: hidden;
      box-shadow: 0 0 100px rgba(0, 0, 0, 0.9);
      z-index: 2;
      display: flex;
      flex-direction: column;
    }

    .modal-body { 
        padding: 0; 
        display: flex; 
        width: 100%; 
        height: 100%;
    }
    
    /* Image Section */
    .modal-img-container {
        flex: 1.2;
        background: radial-gradient(circle at center, rgba(255,255,255,0.03), transparent 70%);
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        overflow: hidden;
        border-right: 1px solid rgba(255, 255, 255, 0.05);
    }
    
    .modal-img { 
        max-width: 85%; 
        max-height: 85%; 
        object-fit: contain;
        filter: drop-shadow(0 20px 50px rgba(0,0,0,0.6));
        transition: transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
    }
    .modal-img:hover { transform: scale(1.02); }

    /* Dossier Info Section */
    .modal-info {
        flex: 1;
        padding: 60px;
        display: flex;
        flex-direction: column;
        align-items: flex-start; /* Force start alignment */
        overflow-y: auto;
        background: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.2) 100%);
    }

    .modal-header-group {
        margin-bottom: 40px;
        border-bottom: 1px solid rgba(255,255,255,0.1);
        padding-bottom: 30px;
        width: 100%; /* Ensure full width */
        text-align: left; /* Default left */
    }

    .modal-info h2 {
        color: #fff;
        line-height: 1;
        letter-spacing: -0.02em;
        font-family: 'Space Mono', monospace; 
        margin-bottom: 15px;
        font-size: 3.5rem;
        text-transform: uppercase;
        text-shadow: 0 0 30px rgba(255,255,255,0.15);
    }
    
    .inscription-badge {
        display: inline-block;
        font-family: 'Space Mono', monospace;
        font-size: 0.8rem;
        color: #a0a0a0;
        border: 1px solid rgba(255,255,255,0.15);
        padding: 6px 12px;
        border-radius: 4px;
        background: rgba(255,255,255,0.02);
        letter-spacing: 0.1em;
    }
    .badge-row {
        display: flex;
        gap: 10px;
        margin-top: 10px;
        flex-wrap: wrap;
    }

    .modal-description {
        margin-bottom: auto;
        line-height: 1.8;
        font-size: 1.05rem;
        color: rgba(255, 255, 255, 0.8);
        font-family: 'Inter', sans-serif;
        font-weight: 300;
        padding-right: 20px;
    }

    /* HUD Specs Grid */
    .modal-details {
        display: grid;
        grid-template-columns: 1fr;
        gap: 10px;
        margin-top: 30px;
        background: none;
        padding: 0;
        border: none;
        border-top: 1px solid rgba(255,255,255,0.1);
        padding-top: 20px;
    }

    .detail-row.premium {
        background: rgba(0,0,0,0.2);
        border: 1px solid rgba(255, 255, 255, 0.05); 
        border-left: 2px solid rgba(255,255,255,0.2);
        padding: 8px 15px;
        border-radius: 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    
    .detail-label {
        color: #666;
        font-size: 0.65rem;
        text-transform: uppercase;
        letter-spacing: 0.2em;
        margin-bottom: 0;
        margin-right: 15px;
    }
    
    .neon-text {
        color: #e0e0e0;
        font-family: 'Space Mono', monospace;
        font-size: 0.65rem;
        text-shadow: none;
        letter-spacing: 0.05em;
        word-break: break-all;
        text-align: right;
        flex: 1;
        min-width: 0;
        line-height: 1.4;
    }

    .modal-link {
        align-self: flex-start;
        margin-top: 30px;
        color: #888;
        font-size: 0.75rem;
        letter-spacing: 0.1em;
        opacity: 0.7;
        border-bottom: 1px solid transparent;
    }
    .modal-link:hover {
        color: #fff;
        opacity: 1;
        border-color: #fff;
    }
    
    .modal-close {
        top: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        border: 1px solid rgba(255,255,255,0.1);
        background: rgba(0,0,0,0.3);
        z-index: 10;
        color: #fff;
        font-size: 1.5rem;
    }
    .modal-close:hover {
        background: rgba(255,255,255,0.1);
        transform: none;
    }

    @media (max-width: 900px) {
        .modal-body { flex-direction: column; overflow-y: auto; }
        .modal-img-container { flex: none; height: 400px; width: 100%; border-right: none; border-bottom: 1px solid rgba(255,255,255,0.05); }
        .modal-img { max-height: 90%; }
        .modal-content { height: 100%; width: 100%; max-width: none; border-radius: 0; }
        .modal-info { padding: 30px; overflow: visible; align-items: flex-start; }
        .modal-info h2 { font-size: 2rem; text-align: left !important; width: 100%; }
        .modal-header-group { text-align: left !important; margin-bottom: 20px; width: 100%; display: block; }
        .modal-details { grid-template-columns: 1fr; gap: 10px; }
    }
      margin-bottom: 12px;
    }

    .detail-value.cypher {
      color: #0f0 !important; /* Neon Green */
      font-family: 'Space Mono', monospace;
      text-shadow: 0 0 5px rgba(0, 255, 0, 0.6), 0 0 10px rgba(0, 255, 0, 0.4);
      animation: pulsateGreen 2s infinite alternate;
    }

    @keyframes pulsateGreen {
      0% { text-shadow: 0 0 4px rgba(0, 255, 0, 0.6), 0 0 8px rgba(0, 255, 0, 0.4); }
      100% { text-shadow: 0 0 8px rgba(0, 255, 0, 0.9), 0 0 16px rgba(0, 255, 0, 0.7); }
    }

    .modal-close {
      position: absolute;
      top: 24px;
      right: 24px;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: rgba(255,255,255,0.1);
      border: none;
      color: #fff;
      font-size: 24px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s;
    }

    .modal-close:hover { transform: rotate(90deg); background: rgba(255,255,255,0.2); }

    .footer {
      position: absolute;
      bottom: 24px;
      width: 100%;
      text-align: center;
      color: rgba(255,255,255,0.4);
      font-size: 0.75rem;
      pointer-events: none;
      z-index: 5;
    }

    .grid-footer {
        position: relative;
        bottom: auto;
        margin-top: 80px;
        padding-bottom: 40px;
    }

    /* History Overlay - Charismatic Redesign */
    .history-overlay {
      position: fixed;
      inset: 0;
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 40px;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.4s ease;
    }
    .history-overlay.active {
        opacity: 1;
        pointer-events: auto;
    }
    
    .history-backdrop { 
        position: absolute; 
        inset: 0; 
        background: rgba(0,0,0,0.92); 
        backdrop-filter: blur(15px); 
    }
    
    .history-content {
      position: relative;
      background: #050505;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 24px;
      max-width: 850px;
      width: 100%;
      height: 80vh;
      overflow: hidden;
      z-index: 2;
      display: flex;
      flex-direction: column;
      box-shadow: 0 40px 100px rgba(0,0,0,0.8);
      transform: translateY(20px);
      transition: transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
    }
    .history-overlay.active .history-content {
        transform: translateY(0);
    }
    
    .history-container {
      padding: 60px 80px;
      overflow-y: auto;
      height: 100%;
      scrollbar-width: thin;
      scrollbar-color: rgba(255,255,255,0.1) transparent;
    }
    .history-container::-webkit-scrollbar { width: 4px; }
    .history-container::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }

    .history-section-header {
      margin-bottom: 50px;
      text-align: center;
    }
    
    .history-section-header .section-tag {
        font-family: 'Space Mono', monospace;
        font-size: 0.7rem;
        text-transform: uppercase;
        letter-spacing: 0.4em;
        color: #a0a0a0;
        margin-bottom: 15px;
        display: block;
    }
    
    .history-section-header h2 {
      font-family: 'Space Mono', monospace; 
      font-size: 2.2rem; 
      color: #fff;
      letter-spacing: 0.05em;
      text-shadow: 0 0 30px rgba(255,255,255,0.1);
    }

    .history-text-content {
      line-height: 1.9;
      font-size: 1.05rem;
      color: rgba(255, 255, 255, 0.75);
      font-weight: 300;
    }
    
    .history-text-content p { margin-bottom: 30px; }
    
    .history-text-content h3 { 
      font-family: 'Space Mono', monospace; 
      font-size: 1.5rem; 
      font-weight: 700;
      margin: 60px 0 25px; 
      color: #fff;
      border-left: 2px solid rgba(255,255,255,0.4);
      padding-left: 20px;
      letter-spacing: 0.05em;
    }
    
    .tale-item { 
        margin-bottom: 80px; 
        padding-bottom: 40px;
        border-bottom: 1px solid rgba(255,255,255,0.05);
    }
    .tale-item:last-child { border-bottom: none; }
    
    .tale-id { 
        font-family: 'Space Mono', monospace; 
        font-size: 0.75rem; 
        color: #666; 
        margin-bottom: 10px; 
        letter-spacing: 0.2em;
    }
    .tale-title { 
        font-family: 'Space Mono', monospace; 
        font-size: 1.5rem; 
        color: #fff; 
        margin-bottom: 25px; 
        letter-spacing: 0.02em;
    }

    .history-close {
      position: absolute;
      top: 30px;
      right: 30px;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.08);
      color: #fff;
      font-size: 20px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s;
      z-index: 10;
    }
    .history-close:hover { background: rgba(255,255,255,0.1); transform: rotate(90deg); }

    .mobile-view-toggle {
        display: none;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        color: #fff;
        width: 44px;
        height: 44px;
        border-radius: 8px;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        z-index: 100;
        transition: all 0.3s ease;
    }
    
    #mobile-view-icon {
        font-size: 1.2rem;
        line-height: 1;
        display: inline-block;
        transition: transform 0.3s ease;
    }
    
    #mobile-view-icon.rotated {
        transform: rotate(90deg);
    }

    @media (max-width: 768px) {
      .landing-screen { flex-direction: column; }
      .panel:hover { flex: 1; }
      .modal-body { grid-template-columns: 1fr; padding: 24px; }
      .modal-img-container { margin-bottom: 20px; }
      .modal-info h2 { font-size: 1.4rem; text-align: center; }
      .modal-link { display: block; text-align: center; width: fit-content; margin: 24px auto 0; }
      
      .global-nav { 
          height: auto; 
          padding: 25px 20px; 
          flex-direction: column; 
          justify-content: center; 
          gap: 10px;
          background: linear-gradient(to bottom, rgba(0,0,0,0.98), rgba(0,0,0,0.9), transparent);
      }

      .nav-group.center {
          position: relative;
          left: auto;
          transform: none;
          margin-top: 5px;
      }

      .nav-group.right { display: none; }
      
      .mobile-view-toggle {
          display: flex;
          position: absolute;
          top: 25px;
          right: 20px;
      }

      .nav-group.left .nav-item {
          font-size: 1.25rem;
          font-weight: 800;
          color: rgba(255, 255, 255, 0.4);
          letter-spacing: 0.05em;
      }
      .nav-group.left .nav-item.active {
          color: #fff;
          text-shadow: 0 0 15px rgba(255, 255, 255, 0.3);
      }

      .nav-group.left .nav-divider {
          font-size: 1.2rem;
          opacity: 0.3;
          font-weight: 300;
      }

      .nav-group.center .nav-item {
          font-size: 0.8rem;
          opacity: 1;
          letter-spacing: 0.15em;
          color: #fff;
          font-weight: 600;
      }
      .nav-group.center .nav-item.active {
          color: #fff;
          text-shadow: 0 0 10px rgba(255, 255, 255, 0.4);
          font-weight: 800;
      }

      .panel h1 { font-size: 2.5rem; letter-spacing: 0.05em; }
      .nav-group.left { order: 1; }
      .nav-group.right { order: 2; }
      .history-container { padding: 40px 30px; }
      .history-content { height: 90vh; width: 95%; }

      /* Mobile Layout Clearing */
      .grid-view { 
          padding-top: 130px !important; 
      }
      .hero-section {
          padding-top: 110px !important;
      }
    }
  `;
  document.head.appendChild(style);
}

function attachEventListeners() {
  document.getElementById('explore-cypherville').addEventListener('click', (e) => {
    e.stopPropagation();
    setActiveCollection('Cypherville');
  });

  document.getElementById('explore-deville').addEventListener('click', (e) => {
    e.stopPropagation();
    setActiveCollection('DeVille');
  });

  // Nav Bar Listeners
  document.getElementById('nav-cypherville').addEventListener('click', () => setActiveCollection('Cypherville'));
  document.getElementById('nav-deville').addEventListener('click', () => setActiveCollection('DeVille'));
  document.getElementById('nav-slideshow').addEventListener('click', () => setView('slideshow'));
  document.getElementById('nav-grid').addEventListener('click', () => setView('grid'));

  document.getElementById('nav-intro').addEventListener('click', () => openHistory('intro'));
  document.getElementById('nav-history').addEventListener('click', () => openHistory('history'));
  document.getElementById('nav-tales').addEventListener('click', () => openHistory('tales'));

  document.getElementById('mobile-view-toggle').addEventListener('click', () => {
    const nextView = activeView === 'slideshow' ? 'grid' : 'slideshow';
    setView(nextView);
  });

  const modalClose = document.getElementById('modal-close');
  if (modalClose) {
    modalClose.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      closeModal();
    };
  }

  const historyClose = document.getElementById('history-close');
  if (historyClose) {
    historyClose.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      closeHistory();
    };
  }

  // Modal backdrop close logic
  document.querySelectorAll('.modal-backdrop').forEach(mask => {
    mask.addEventListener('click', (e) => {
      e.stopPropagation();
      closeModal();
    });
  });

  document.querySelectorAll('.history-backdrop').forEach(mask => {
    mask.addEventListener('click', (e) => {
      e.stopPropagation();
      closeHistory();
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
      closeHistory();
    }
  });
}

function updateNavState() {
  // Collection
  document.getElementById('nav-cypherville').classList.toggle('active', activeCollection === 'Cypherville');
  document.getElementById('nav-deville').classList.toggle('active', activeCollection === 'DeVille');

  // View
  document.getElementById('nav-slideshow').classList.toggle('active', activeView === 'slideshow');
  document.getElementById('nav-grid').classList.toggle('active', activeView === 'grid');

  const isHistoryOpen = document.getElementById('history-overlay').classList.contains('active');
  document.getElementById('nav-intro').classList.toggle('active', isHistoryOpen && currentHistorySection === 'intro');
  document.getElementById('nav-history').classList.toggle('active', isHistoryOpen && currentHistorySection === 'history');
  document.getElementById('nav-tales').classList.toggle('active', isHistoryOpen && currentHistorySection === 'tales');

  // Mobile Icon Update
  const viewIcon = document.getElementById('mobile-view-icon');
  if (viewIcon) {
    // Show destination icon:
    // If in slideshow, show grid icon (⊞).
    // If in grid, show rotated slideshow icon (≡ rotated 90deg = |||).
    viewIcon.innerText = activeView === 'slideshow' ? '⊞' : '≡';
    viewIcon.classList.toggle('rotated', activeView === 'grid');
  }
}

function setActiveCollection(name) {
  activeCollection = name;
  activeView = 'slideshow'; // Reset to slideshow default on switch? Or persist? Let's default to slideshow for immersion.

  // Filter Data
  currentPortraits = allPortraits.filter(p => p.collection === name);

  updateNavState();

  // Transition UI
  document.getElementById('landing-screen').style.transform = 'translateY(-100%)';
  document.getElementById('global-nav').classList.add('visible');

  // Render
  setView('slideshow');
}

function setView(mode) {
  activeView = mode;
  updateNavState();

  // Stop any running carousel
  if (carouselInstance) carouselInstance.stopAutoPlay();

  if (mode === 'slideshow') {
    document.getElementById('main-content').style.display = 'block';
    document.getElementById('grid-view').style.display = 'none';
    document.body.style.overflow = 'hidden'; // Lock vertical scroll
    document.documentElement.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    initSlideshow();
  } else {
    document.getElementById('main-content').style.display = 'none';
    document.getElementById('grid-view').style.display = 'block';

    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
    document.body.style.position = '';
    document.body.style.width = '';

    if (carouselInstance) carouselInstance.destroy();
    renderGallery(currentPortraits);
  }
}


function initSlideshow() {
  const container = document.getElementById('slideshow');

  // Clean up existing
  if (carouselInstance) {
    carouselInstance.destroy();
  }

  // Random Start Index
  const randomIndex = Math.floor(Math.random() * currentPortraits.length);

  carouselInstance = new Carousel3D(container, currentPortraits, (item) => {
    // On Click Handler
    openModal(item.id);
  }, randomIndex);
}

function renderGallery(portraits) {
  const gallery = document.getElementById('gallery');
  if (!gallery) return;

  gallery.innerHTML = portraits.map(p => `
    <div class="portrait-card" onclick="openModal('${p.id}')">
      <div class="portrait-img-wrapper">
        <img class="portrait-img" src="${p.image}" alt="${p.name}" loading="lazy" />
      </div>
      <div class="portrait-info">
        <div class="portrait-name">${p.name}</div>
        <div class="portrait-id">${p.collection} • ${p.id.substring(0, 12)}...</div>
      </div>
    </div>
  `).join('');
}

/* Typewriter Utility */
function typeWriter(element, text, speed = 30) {
  element.textContent = '';
  let i = 0;

  // Clear any existing interval on this element
  if (element.dataset.typingInterval) {
    clearInterval(parseInt(element.dataset.typingInterval));
  }

  const interval = setInterval(() => {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
    } else {
      clearInterval(interval);
    }
  }, speed);

  element.dataset.typingInterval = interval;
}


window.openModal = async function (id) {
  const p = allPortraits.find(x => x.id === id);
  const modalBody = document.getElementById('modal-body');

  // Set immersive backdrop
  const backdrop = document.querySelector('.modal-backdrop');
  if (backdrop) {
    backdrop.style.background = `url(${p.image}) center/cover no-repeat`;
    backdrop.style.filter = 'blur(60px) brightness(0.4)';
  }

  modalBody.innerHTML = `
    <div class="modal-img-container">
      <img class="modal-img" src="${p.image}" alt="${p.name}" />
    </div>
    <div class="modal-info">
      <div class="modal-header-group">
        <h2>${p.title}</h2>
        <div class="badge-row">
            ${p.inscription_number ? `<span class="inscription-badge">INSCRIPTION #${p.inscription_number}</span>` : ''}
            <span class="inscription-badge type-badge">TYPE: ${(p.type || p.collection).toUpperCase()}</span>
        </div>
      </div>
      
      ${p.description ? `<div class="modal-description desc-val"></div>` : ''}
      
      <div class="modal-details">
        <div class="detail-row premium">
          <div class="detail-label">Timestamp</div>
          <div class="detail-value neon-text time-val">Loading...</div>
        </div>
        <div class="detail-row premium">
          <div class="detail-label">Dimensions</div>
          <div class="detail-value neon-text dim-val"></div>
        </div>
        <div class="detail-row premium">
          <div class="detail-label">Size</div>
          <div class="detail-value neon-text size-val"></div>
        </div>
        <div class="detail-row premium">
          <div class="detail-label">Owner</div>
          <div class="detail-value neon-text owner-val">Loading...</div>
        </div>
        <div class="detail-row premium">
          <div class="detail-label">Inscription ID</div>
          <div class="detail-value neon-text id-val"></div>
        </div>
      </div>
      
      <a href="https://ordinals.com/inscription/${p.id}" target="_blank" class="modal-link">
        VIEW ON ORDINALS EXPLORER
      </a>
    </div>
  `;

  document.getElementById('modal').classList.add('active');
  document.body.style.overflow = 'hidden';

  // Trigger Typewriter Effects
  if (p.description) {
    setTimeout(() => typeWriter(modalBody.querySelector('.desc-val'), p.description, 10), 100);
  }

  setTimeout(() => typeWriter(modalBody.querySelector('.id-val'), p.id, 10), 200);
  setTimeout(() => typeWriter(modalBody.querySelector('.dim-val'), p.dimensions || '1280x1280', 20), 400);
  setTimeout(() => typeWriter(modalBody.querySelector('.size-val'), p.size || 'Unknown', 20), 600);

  try {
    // User requested direct chain data from ordinals.com
    const res = await fetch(`https://ordinals.com/inscription/${p.id}`, {
      headers: { 'Accept': 'application/json' }
    });

    if (res.ok) {
      const data = await res.json();
      const address = data.address || 'Unknown';
      typeWriter(modalBody.querySelector('.owner-val'), address, 10);

      // Ordinals.com returns timestamp in seconds, JS needs ms
      const timestamp = data.timestamp ? data.timestamp * 1000 : null;
      // Format as UTC string to align with "Chain Time"
      const dateStr = timestamp ? new Date(timestamp).toUTCString() : 'Unknown';
      typeWriter(modalBody.querySelector('.time-val'), dateStr, 20);
    }
  } catch (e) {
    console.error(e);
    modalBody.querySelector('.owner-val').textContent = 'Error fetching';
    modalBody.querySelector('.owner-val').style.color = '#ff6b6b';
    modalBody.querySelector('.time-val').textContent = 'Error fetching';
  }
}

function closeModal() {
  document.getElementById('modal').classList.remove('active');
  document.body.style.overflow = '';
}

function openHistory(section = 'intro') {
  currentHistorySection = section;
  const overlay = document.getElementById('history-overlay');
  const content = document.getElementById('history-text-content');
  const container = document.querySelector('.history-container');

  let html = '';
  let tag = '';
  let title = '';

  if (section === 'intro') {
    tag = 'PROLOGUE';
    title = historicalContent.welcome.title;
    html = `<p>${historicalContent.welcome.content}</p>`;
  } else if (section === 'history') {
    tag = 'ETERNITY';
    title = 'History & Process';
    html = `
      <section>
        <h3>${historicalContent.longevity.title}</h3>
        ${historicalContent.longevity.content.map(p => `<p>${p}</p>`).join('')}
      </section>

      <section>
        <h3>${historicalContent.techniques.title}</h3>
        ${historicalContent.techniques.content.map(p => `<p>${p}</p>`).join('')}
      </section>

      <section>
        <h3>${historicalContent.creativeProcess.title}</h3>
        ${historicalContent.creativeProcess.content.map(p => `<p>${p}</p>`).join('')}
      </section>
    `;
  } else if (section === 'tales') {
    tag = 'CHRONICLES';
    title = '8 Tales';
    html = `
      <div class="tales-list">
        ${historicalContent.tales.map(tale => `
          <div class="tale-item">
            <div class="tale-id">${tale.id}</div>
            <div class="tale-title">${tale.title}</div>
            <div class="tale-body">
                ${tale.content.map(p => `<p>${p}</p>`).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  content.innerHTML = `
    <header class="history-section-header">
        <span class="section-tag">${tag}</span>
        <h2>${title}</h2>
    </header>
    ${html}
  `;

  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';

  // Reset scroll
  container.scrollTop = 0;

  updateNavState();
}

function closeHistory() {
  document.getElementById('history-overlay').classList.remove('active');
  document.body.style.overflow = '';
  updateNavState();
}

async function init() {
  const res = await fetch('/portraits.json');
  allPortraits = await res.json();
  createUI();
  createTerminalUI();


  // Set specific backgrounds for panels
  const cyp_bg = `https://cdn.lemonhaze.com/assets/assets/8a44fac50ee67942819179d6e8564a8eb39dc40db4c00785c255c3ae4c0f03e1i0.jpg`;
  const dev_bg = `https://cdn.lemonhaze.com/assets/assets/e3d40b429c27ef09abdfeb8f9cae7be3680d909856105f5fb56998e16f6aa4f7i0.png`;

  const panelCyp = document.getElementById('panel-cypherville');
  const panelDev = document.getElementById('panel-deville');

  if (panelCyp) panelCyp.style.backgroundImage = `url("${cyp_bg}")`;
  if (panelDev) panelDev.style.backgroundImage = `url("${dev_bg}")`;
}

function createTerminalUI() {
  const icon = document.createElement('div');
  icon.className = 'terminal-toggle';
  // Use the site's favicon as requested
  icon.innerHTML = `<img src="/favicon.png" class="terminal-logo" alt="Oracle" />`;

  // Toggle chat logic
  icon.onclick = () => {
    const t = document.getElementById('city-terminal');
    t.classList.toggle('active');
    if (t.classList.contains('active')) document.getElementById('term-input').focus();
  };

  // Show Icon Logic (After Explore)
  const showIcon = () => {
    icon.classList.add('visible');
  };

  // Attach to existing explore buttons
  setTimeout(() => {
    document.querySelectorAll('.explore-btn').forEach(btn => {
      btn.addEventListener('click', showIcon);
    });
  }, 500); // Wait for buttons to exist/render

  const terminal = document.createElement('div');
  terminal.id = 'city-terminal';
  terminal.className = 'city-terminal';
  terminal.innerHTML = `
        <div class="terminal-header">
            <span>cypher_net [SECURE_LINK]</span>
            <span class="terminal-close" onclick="document.getElementById('city-terminal').classList.remove('active')">X</span>
        </div>
        <div class="terminal-output" id="terminal-output">
            <div class="terminal-msg oracle">SYSTEM: Connection Established.<br>Identity: ORACLE_V3.<br>Ask your question...</div>
        </div>
        <div class="terminal-input-area">
            <span class="terminal-prompt">></span>
            <input type="text" id="term-input" class="terminal-input" placeholder="Query the system..." autocomplete="off">
            <button id="term-send-btn" class="terminal-send-btn">➜</button>
        </div>
    `;

  document.body.appendChild(icon);
  document.body.appendChild(terminal);

  const input = document.getElementById('term-input');
  const sendBtn = document.getElementById('term-send-btn');

  const checkInput = () => {
    if (input.value.trim().length > 0) {
      sendBtn.classList.add('visible');
    } else {
      sendBtn.classList.remove('visible');
    }
  };

  input.addEventListener('input', checkInput);

  const submit = () => {
    if (input.value.trim()) {
      sendToOracle(input.value.trim());
      input.value = '';
      checkInput();
    }
  };

  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') submit();
  });

  sendBtn.addEventListener('click', submit);
}

async function sendToOracle(msg) {
  const output = document.getElementById('terminal-output');

  // User Msg
  const userDiv = document.createElement('div');
  userDiv.className = 'terminal-msg user';
  userDiv.textContent = msg;
  output.appendChild(userDiv);

  // Loading
  const loadDiv = document.createElement('div');
  loadDiv.className = 'terminal-msg oracle';
  loadDiv.textContent = 'DECRYPTING...';
  output.appendChild(loadDiv);
  output.scrollTop = output.scrollHeight;

  try {
    const history = Array.from(output.querySelectorAll('.terminal-msg')).map(el => {
      return {
        role: el.classList.contains('user') ? 'user' : 'assistant',
        content: el.textContent
      };
    }).slice(-6);

    // Replace loading with real response container
    loadDiv.textContent = '';

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: history })
    });

    if (!res.ok) {
      // Read text first to avoid stream locking
      const errorText = await res.text();
      let errorMsg = 'System Glitch';
      try {
        const err = JSON.parse(errorText);
        errorMsg = err.error || res.statusText;
      } catch (e) {
        errorMsg = errorText || res.statusText;
      }
      throw new Error(errorMsg);
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });

      const lines = (buffer + chunk).split('\n');
      buffer = lines.pop();

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const jsonStr = line.slice(6);
          if (jsonStr === '[DONE]') break;
          try {
            const data = JSON.parse(jsonStr);
            if (data.response) {
              loadDiv.textContent += data.response;
              output.scrollTop = output.scrollHeight;
            }
          } catch (e) { }
        }
      }
    }

  } catch (e) {
    loadDiv.textContent = `SYSTEM ERROR: ${e.message}`;
    loadDiv.style.color = 'red';
  }
}

init();
