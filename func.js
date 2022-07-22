function myVue(options) {
    if (options === void 0) { options = {}; }
    this.$options = options;
    this.$el = document.querySelector(options.el);
    this.$_data = options.data;
    this.$_methods = options.methods;
    this._binding = {};
    this._observe(this.$_data);
    this._compile(this.$el);
}
myVue.prototype._compile = function (root) {
    var _this = this;
    var nodes = root.children;
    var _loop_1 = function (i) {
        var node = nodes[i];
        if (node.children.length !== 0) {
            this_1._compile(node);
        }
        // 解析v-click
        if (node.hasAttribute("v-click")) {
            node.onclick = (function () {
                var attrVal = node.getAttribute("v-click");
                return _this.$_methods[attrVal].bind(_this.$_data); // 这里不是很理解
            })();
        }
        // 解析v-model
        if (node.hasAttribute("v-model") &&
            (node.tagName === "INPUT" || node.tagName === "TEXTAREA")) {
            node.addEventListener("input", (function (index) {
                var attrVal = node.getAttribute("v-model");
                _this._binding[attrVal]._directives.push(new Watcher("input", node, _this, attrVal, "value"));
                return function () {
                    _this.$_data[attrVal] = nodes[index].value;
                };
            })(i));
        }
        // 解析v-bind
        if (node.hasAttribute("v-bind")) {
            var attrVal = node.getAttribute("v-bind");
            _this._binding[attrVal]._directives.push(new Watcher("text", node, _this, attrVal, "innerHTML"));
        }
    };
    var this_1 = this;
    for (var i = 0; i < nodes.length; i++) {
        _loop_1(i);
    }
};
myVue.prototype._observe = function (obj) {
    var _this_1 = this;
    if (!obj || typeof obj !== "object") {
        return;
    }
    Object.keys(obj).forEach(function (key) {
        var value = obj[key];
        _this_1._observe(value);
        _this_1._binding[key] = {
            _directives: []
        };
        var binding = _this_1._binding[key];
        Object.defineProperty(obj, key, {
            get: function () {
                console.log("\u83B7\u53D6");
                return value;
            },
            set: function (newVal) {
                console.log("\u66F4\u65B0".concat(newVal));
                if (value !== newVal) {
                    value = newVal;
                    binding._directives.forEach(function (item) { return item.Update(); });
                }
            }
        });
    });
};
function Watcher(name, el, vm, exp, attr) {
    this.name = name;
    this.el = el;
    this.vm = vm;
    this.exp = exp;
    this.attr = attr;
    this.Update();
}
Watcher.prototype.Update = function () {
    this.el[this.attr] = this.vm.$_data[this.exp];
};
window.myapp = new myVue({
    el: "#app",
    data: {
        number: 0,
        number2: 1
    },
    methods: {
        increment: function () {
            this.number++;
        },
        increment2: function () {
            this.number2++;
        }
    }
});
