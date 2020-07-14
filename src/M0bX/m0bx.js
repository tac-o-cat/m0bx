const reactionsMap = {};

let currentRenderingComponent;

const handler = {
  get: (target, key) => {
    return target[key];
  },
  set: (target, key, value) => {
    target[key] = value;
    return;
  },
};

export function store(object) {
  return new Proxy(object, handler);
}

export function view(MyComponent) {
  return MyComponent;
}
