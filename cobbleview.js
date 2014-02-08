function CView (parent, target, visible, jQElements) {
  this.parent = parent;
  this.visible = visible;
  this.parentDisplay = parent.css("display");
  this.parentPosition = parent.css("position");
  this.elements = [];
  for(element in jQElements) {
    this.elements.push(element);
  }
  if (!this.visible) {
    this.parent.css({ // Default to hidden state
      "opacity": 0,
      "display": "none"
    });
  }
  this.parent.appendTo(target);
};

CView.setStoredParentAttributes = function (attributes, callbacks) {
  callbacks && callbacks.forEach(function (callback) {
    callback();
  });
};

CView.prototype.loadElement = function(element) {
  element.appendTo(this.parent);
  this.elements.push(element);
  return element;
};

CView.prototype.createLink = function(name) {
  var newLink = jQuery("<div/>", {
    class: name + "-link pillar-link"
  })
  return this.loadElement(newLink);
}

CView.prototype.show = function(callbacks) {
  this.visible = true;
  var that = this;
  this.parent.css({
    "display": this.parentDisplay,
  });
  this.parent.animate({
    "opacity": 1
  }, {
    duration: 1000,
    complete: function () {
      that.parent.css({
        "position": this.parentPosition
      });
      callbacks && callbacks.forEach(function (callback) {
        callback();
      });
    }
  });
};

CView.prototype.hide = function(callbacks) {
  this.visible = false;
  // $(document).off();
  // Add if you want to unbind document-level events like keypresses
  this.parent.off();
  this.elements.forEach(function (element) {
    element.off();
  });
  this.parent.css({
    "position": "absolute"
  });
  var that = this;
  this.parent.animate({
    "opacity": 0
  }, {
    duration: 1000,
    complete: function () {
      that.parent.css({"display": "none"});
      callbacks && callbacks.forEach(function (callback) {
        callback();
      });
    }
  });
};

CView.prototype.destroy = function() {
  this.elements.forEach(function (element) {
    element.off();
    element.remove();
  });
  this.parent.off();
  this.parent.remove();
};