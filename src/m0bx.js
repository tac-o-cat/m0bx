const reactionsMap = {}; // 현재 m0bx에 의해 트래킹되고 었는 컴포넌트를 체크한다

let currentRenderingComponent;

const handler = {
  get: (target, key) => {
    // 스토어의 프로퍼티에 접근하는 핸들러
    if (typeof currentRenderingComponent === 'undefined') {
      return target[key];
    }
    if (!reactionsMap[key]) {
      reactionsMap[key] = [currentRenderingComponent];
    }

    const hasComponent = reactionsMap[key].find(
      component => component.ID === currentRenderingComponent.ID
    );
    if (!hasComponent) {
      reactionsMap[key].push(currentRenderingComponent);
    }
  },
  set: (target, key, value) => {
    // 스토어에 새로운 값을 갱신하는 핸들러
    // 스토어에 변경이 발생할 때마다 forceUpdate 실행
    reactionsMap[key].forEach(component => component.forceUpdate());
    target[key] = value;
    return;
  },
};

export function store(object) {
  return new Proxy(object, handler);
}

export function view(MyComponent) {
  return class Observer extends MyComponent {
    ID = `${Math.floor(Math.random() * 10e9)}`;

    render() {
      currentRenderingComponent = this;
      const renderValue = super.render();
      currentRenderingComponent = undefined;
      return renderValue;
    }
  };
}
