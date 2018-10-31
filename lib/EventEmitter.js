'use strict';

class EventEmitter {
  constructor() {
    this.eventListeners = new Map();
  }

  on(event, listener) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set([listener]));
    } else {
      const listeners = this.eventListeners.get(event);

      listeners.add(listener);
    }
  }

  emit(event, ...data) {
    const listeners = this.eventListeners.get(event) || [];

    for (let listener of listeners) {
      listener(...data);
    }
  }
}