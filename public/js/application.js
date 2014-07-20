(function() {
  var INTERVAL = 80;

  function randomisedInterval() {
    return INTERVAL + (INTERVAL * Math.random());
  }

  function TyperChild(container) {
    this.container = container;
    this.text = container.textContent.trim();
    this.characters = this.text.split('');
    this.container.textContent = '';
  }

  TyperChild.prototype.on = function(name, cb) {
    this._events = this._events || {};
    this._events[name] = this._events[name] || [];
    this._events[name].push(cb);
  };

  TyperChild.prototype.trigger = function(name, arg) {
    var callbacks = this._events[name] || [];
    callbacks.forEach(function(cb) {
      cb(arg);
    });
  };

  TyperChild.prototype.type = function() {
    this.container.classList.add('is-typing');
    setTimeout(this.typeNextCharacter.bind(this), randomisedInterval());
  };

  TyperChild.prototype.endTyping = function() {
    this.container.classList.remove('is-typing');
    this.trigger('done');
  };

  TyperChild.prototype.typeNextCharacter = function() {
    if (this.characters.length === 0) return this.endTyping();

    this.container.textContent = this.container.textContent + this.characters.shift();
    this.type();
  };

  function Typer(container) {
    this.container = container;
    this.children = [];

    for (var i = 0, len = container.children.length; i < len; i++) {
      this.children.push(new TyperChild(container.children[i]));
    }
  }

  Typer.prototype.endTyping = function() {
    this.container.classList.add('is-complete');
  };

  Typer.prototype.type = function() {
    if (this.children.length === 0) return this.endTyping();
    var current = this.children.shift();
    current.on('done', this.type.bind(this));
    setTimeout(current.type.bind(current), randomisedInterval());
  };

  var typingContainers = document.querySelectorAll('.typing');

  for (var i = 0, len = typingContainers.length; i < len; i++) {
    (new Typer(typingContainers[i])).type();
  }
})();
