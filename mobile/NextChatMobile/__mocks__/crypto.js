// Mock for crypto module in React Native
// React Native doesn't have built-in crypto module, so we provide a minimal implementation
// for libraries that expect it

// For nanoid, we only need randomFillSync function
const crypto = {
  randomFillSync: (buffer) => {
    // Simple implementation using Math.random
    for (let i = 0; i < buffer.length; i++) {
      buffer[i] = Math.floor(Math.random() * 256);
    }
    return buffer;
  }
};

module.exports = crypto;