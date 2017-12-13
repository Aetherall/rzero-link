# rzero-link
Redux-Zero Utility to connect a component to a specific slice of the store

````javascript
import React from 'react';
import connect from 'rzero-link';

const actions = {
  increment: (state) => (value) => ({ count: state.count + value }),
  decrement: (state) => (value) => (event) => ({ count: state.count - value })
}

export default connect('counter', actions)(({ count, increment, decrement }) => (
  
  <div>
    <h1>{count}</h1>
    <div>
      <button onClick={() => increment(2)}>increment</button>
      <button onClick={decrement(2)}>decrement</button>
    </div>
  </div>
));
````
