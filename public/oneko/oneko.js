// sketch-oneko.js — Black & white sketch cat
// Sprite sheet: 256x128px | 8 cols x 4 rows | 32x32px per cell
// Classic oneko layout — no audio

(function oneko() {
    const isReducedMotion =
        window.matchMedia(`(prefers-reduced-motion: reduce)`) === true ||
        window.matchMedia(`(prefers-reduced-motion: reduce)`).matches === true;

    if (isReducedMotion) return;

    // ─── Config ───────────────────────────────────────────────
    const CAT_FILE = './sketch-cat.png'; // your sprite sheet filename
    const SCALE = 1;                  // 32 * 3 = 96px display size
    const SPEED = 10;
    // ──────────────────────────────────────────────────────────

    const CELL = 32;
    const DISPLAY = CELL * SCALE;
    const BG_W = 256 * SCALE;
    const BG_H = 128 * SCALE;

    const px = (col, row) => [col * CELL * SCALE, row * CELL * SCALE];

    const spriteSets = {
        idle: [px(3, 3)],
        alert: [px(7, 3)],
        scratchSelf: [px(5, 0), px(6, 0), px(7, 0)],
        scratchWallN: [px(0, 0), px(0, 1)],
        scratchWallS: [px(7, 1), px(6, 2)],
        scratchWallE: [px(2, 2), px(2, 3)],
        scratchWallW: [px(4, 0), px(4, 1)],
        tired: [px(3, 2)],
        sleeping: [px(2, 0), px(2, 1)],
        N: [px(1, 2), px(1, 3)],
        NE: [px(0, 2), px(0, 3)],
        E: [px(3, 0), px(3, 1)],
        SE: [px(5, 1), px(5, 2)],
        S: [px(6, 3), px(7, 2)],
        SW: [px(5, 3), px(6, 1)],
        W: [px(4, 2), px(4, 3)],
        NW: [px(1, 0), px(1, 1)],
    };

    const nekoEl = document.createElement('div');
    let nekoPosX = 32, nekoPosY = 32;
    let mousePosX = 0, mousePosY = 0;
    let frameCount = 0;
    let idleTime = 0;
    let idleAnimation = null;
    let idleAnimationFrame = 0;

    /**
     * Create and configure the on-screen cat element, attach input handling, and start the animation loop.
     *
     * Initializes the DOM element used for the sprite (id "oneko"), applies sizing and rendering styles,
     * sets the background sprite-sheet (using the current script's `data-cat` attribute when present, otherwise the default),
     * appends the element to document.body, registers a mousemove listener that updates pointer coordinates,
     * and requests the first animation frame.
     */
    function init() {
        nekoEl.id = 'oneko';
        nekoEl.ariaHidden = true;
        nekoEl.style.width = `${DISPLAY}px`;
        nekoEl.style.height = `${DISPLAY}px`;
        nekoEl.style.overflow = 'hidden';
        nekoEl.style.position = 'fixed';
        nekoEl.style.pointerEvents = 'none';
        nekoEl.style.imageRendering = 'pixelated';
        nekoEl.style.left = `${nekoPosX - DISPLAY / 2}px`;
        nekoEl.style.top = `${nekoPosY - DISPLAY / 2}px`;
        nekoEl.style.zIndex = 2147483647;

        const curScript = document.currentScript;
        const nekoFile = (curScript && curScript.dataset.cat) ? curScript.dataset.cat : CAT_FILE;

        nekoEl.style.backgroundImage = `url(${nekoFile})`;
        nekoEl.style.backgroundSize = `${BG_W}px ${BG_H}px`;
        nekoEl.style.backgroundRepeat = 'no-repeat';

        document.body.appendChild(nekoEl);

        document.addEventListener('mousemove', (e) => {
            mousePosX = e.clientX;
            mousePosY = e.clientY;
        });

        window.requestAnimationFrame(onAnimationFrame);
    }

    let lastFrameTimestamp;

    /**
     * Advance the simulation when enough time has elapsed and schedule the next animation frame.
     *
     * If the tracked cat element is no longer in the document the function returns early.
     * Updates to the simulation are performed at most once per ~100 milliseconds; when that
     * interval has passed the frame() function is invoked and the timestamp of the last
     * processed frame is updated. The function always requests the next animation callback.
     *
     * @param {number} timestamp - High-resolution timestamp supplied by requestAnimationFrame.
     */
    function onAnimationFrame(timestamp) {
        if (!nekoEl.isConnected) return;
        if (!lastFrameTimestamp) lastFrameTimestamp = timestamp;
        if (timestamp - lastFrameTimestamp > 100) {
            lastFrameTimestamp = timestamp;
            frame();
        }
        window.requestAnimationFrame(onAnimationFrame);
    }

    /**
     * Selects the sprite frame for the given animation name and applies it to the cat element's background position.
     * @param {string} name - Key of the sprite set (e.g., 'idle', 'N', 'sleeping').
     * @param {number} frame - Frame index; cycles through the sprite set when exceeding available frames.
     */
    function setSprite(name, frame) {
        const sprite = spriteSets[name][frame % spriteSets[name].length];
        nekoEl.style.backgroundPosition = `-${sprite[0]}px -${sprite[1]}px`;
    }

    /**
     * Reset the cat's idle animation state to no active idle action and set its idle frame counter to 0.
     */
    function resetIdleAnimation() {
        idleAnimation = null;
        idleAnimationFrame = 0;
    }

    /**
     * Advances the cat's idle behavior: increments idle counters, randomly selects an idle action when appropriate, and updates the visible idle animation frame.
     *
     * When the cat has been idle for more than 10 ticks there is a 1-in-200 chance to start an idle action; choices include `sleeping`, `scratchSelf`, and wall-scratching variants added if the cat is within 32px of the corresponding window edge. While an idle action is active this function drives its frames:
     * - `sleeping`: shows `tired` for the first 8 frames, then cycles `sleeping` frames; the sleeping action resets after 192 frames.
     * - `scratchWall*` and `scratchSelf`: animate for up to 9 frames then reset.
     * - default: shows the `idle` sprite and does not advance an idle action.
     *
     * This function has no return value; it updates module-level state (idleTime, idleAnimation, idleAnimationFrame) and the displayed sprite via setSprite/resetIdleAnimation.
     */
    function idle() {
        idleTime += 1;

        if (idleTime > 10 && Math.floor(Math.random() * 200) === 0 && idleAnimation == null) {
            let available = ['sleeping', 'scratchSelf'];
            if (nekoPosX < 32) available.push('scratchWallW');
            if (nekoPosY < 32) available.push('scratchWallN');
            if (nekoPosX > window.innerWidth - 32) available.push('scratchWallE');
            if (nekoPosY > window.innerHeight - 32) available.push('scratchWallS');
            idleAnimation = available[Math.floor(Math.random() * available.length)];
        }

        switch (idleAnimation) {
            case 'sleeping':
                if (idleAnimationFrame < 8) { setSprite('tired', 0); break; }
                setSprite('sleeping', Math.floor(idleAnimationFrame / 4));
                if (idleAnimationFrame > 192) resetIdleAnimation();
                break;
            case 'scratchWallN':
            case 'scratchWallS':
            case 'scratchWallE':
            case 'scratchWallW':
            case 'scratchSelf':
                setSprite(idleAnimation, idleAnimationFrame);
                if (idleAnimationFrame > 9) resetIdleAnimation();
                break;
            default:
                setSprite('idle', 0);
                return;
        }
        idleAnimationFrame += 1;
    }

    /**
     * Advance the cat simulation by one step: update timers, choose an animation state, and move the cat toward the pointer.
     *
     * Updates internal animation/frame counters, switches to an idle or alert animation when the pointer is near or the cat was idle, otherwise selects a directional movement sprite and moves the cat position toward the current mouse coordinates. After movement the position is clamped to the viewport and the element's left/top are updated.
     */
    function frame() {
        frameCount += 1;
        const diffX = nekoPosX - mousePosX;
        const diffY = nekoPosY - mousePosY;
        const distance = Math.sqrt(diffX ** 2 + diffY ** 2);

        if (distance < SPEED || distance < 48) {
            idle();
            return;
        }

        idleAnimation = null;
        idleAnimationFrame = 0;

        if (idleTime > 1) {
            setSprite('alert', 0);
            idleTime = Math.min(idleTime, 7);
            idleTime -= 1;
            return;
        }

        let direction = '';
        direction += diffY / distance > 0.5 ? 'N' : '';
        direction += diffY / distance < -0.5 ? 'S' : '';
        direction += diffX / distance > 0.5 ? 'W' : '';
        direction += diffX / distance < -0.5 ? 'E' : '';
        setSprite(direction, frameCount);

        nekoPosX -= (diffX / distance) * SPEED;
        nekoPosY -= (diffY / distance) * SPEED;

        nekoPosX = Math.min(Math.max(16, nekoPosX), window.innerWidth - 16);
        nekoPosY = Math.min(Math.max(16, nekoPosY), window.innerHeight - 16);

        nekoEl.style.left = `${nekoPosX - DISPLAY / 2}px`;
        nekoEl.style.top = `${nekoPosY - DISPLAY / 2}px`;
    }

    init();
})();