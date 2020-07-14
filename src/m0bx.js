const reactionsMap = {};
// 현재 m0bx에 의해 트래킹되고 었는 컴포넌트를 체크한다
// 스토어에 담겨 있는 프로퍼티의 키: [해당 프로퍼티를 사용하는 컴포넌트]와 같은 형태로 이루어진 객체.

let currentRenderingComponent;

const handler = {
  get: (target, key) => {
    // 스토어의 프로퍼티에 접근하는 핸들러. reactionsMap에 컴포넌트를 등록해 주는 side effect를 수행.
    if (typeof currentRenderingComponent === 'undefined') {
      return target[key]; // 현재 랜더링되는 컴포넌트가 없을 때는 스토어의 값만 반환해 준다.
    }
    if (!reactionsMap[key]) {
      // get 핸들러를 실행했는데,
      // 스토어의 특정한 프로퍼티를 사용하는 컴포넌트가
      // reactionsMap에 의해 트래킹되고 있지 않다면
      // 현재 랜더링되고 있는 컴포넌트를 reactionsMap에 기록해 준다.
      reactionsMap[key] = [currentRenderingComponent];
    }

    const hasComponent = reactionsMap[key].find(
      // 현재 랜더링되고 있는 컴포넌트가 reactionsMap에 등록되어 있는지를 판단.
      component => component.ID === currentRenderingComponent.ID
    );
    if (!hasComponent) {
      // 만약 랜더링 중인 컴포넌트가 트래킹되고 있지 않다면 reactionsMap에 등록한다.
      reactionsMap[key].push(currentRenderingComponent);
    }
  },
  set: (target, key, value) => {
    // 스토어에 새로운 값을 저장하는 핸들러
    // 스토어에 변경이 발생할 때마다 forceUpdate 실행
    reactionsMap[key].forEach(component => component.forceUpdate());
    target[key] = value;
    return;
  },
};

export function store(object) {
  // Proxy를 사용하여, 스토어 객체에 대한 get/set의 behavior를 확장했다.
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
